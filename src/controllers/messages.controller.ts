import { Request, Response } from 'express'
import {
  UserModel,
  ChatRoomModel,
  IndividualMessageModel,
  ISingleMessage,
  IChatRoom,
  IUser,
} from '../models/index'
import mongoose from 'mongoose'
import { Server } from 'socket.io'

export class ChatController {
  constructor() {}

  //CHATROOM
  async createNewChatRoom(req: Request, res: Response): Promise<void> {
    const { otherUserId } = req.body
    // console.log("controller user objects", req.body.userId, otherUserId)
    const chatRoomExists = await ChatRoomModel.findOne({
      userIds: { $all: [req.body.userId, otherUserId] },
    })

    if (chatRoomExists) {
      // console.log("Chat room already exists:",chatRoomExists)
      res.json(chatRoomExists)
    } else {
      try {
        // console.log("Creating new chatroom...")
        const newChatRoom = await ChatRoomModel.create({
          userIds: [
            new mongoose.Types.ObjectId(req.body.userId),
            new mongoose.Types.ObjectId(otherUserId),
          ],
        })
        res.json(newChatRoom)
      } catch (err) {
        console.log('createNewChatRoom is not working', err)
      }
    }
  }

  async findInbox(req: Request, res: Response): Promise<void> {
    try {
      //finds all chatRoom instances where logged in user is listed in userIds
      const chatRoomList = await ChatRoomModel.find({
        // userIds: {$in: [req.body.userId]}
        userIds: { $in: [new mongoose.Types.ObjectId(req.body.userId)] },
        //sorts by updated at date
      }).sort({ updatedAt: -1 })

      //create set for all userIds gathered and does not allow duplicates
      const userIdSet = new Set()
      // iterate through each chatRoom to get the user ids listed in userIds array
      chatRoomList.forEach((oneChatRoom) => {
        for (const userId of oneChatRoom.userIds) {
          // adds userId to set
          userIdSet.add(userId.toString())
        }
      })
      // removes the logged in user from the set
      userIdSet.delete(req.body.userId)
      //turns set into an array
      const userIdArray = Array.from(userIdSet).map((oneUserId) => {
        if (typeof oneUserId === 'string')
          return new mongoose.Types.ObjectId(oneUserId)
      })

      //finds user objects by each _id in userIdArray
      const otherUsers = await UserModel.find(
        {
          _id: { $in: userIdArray },
        },
        { password: 0 }
      )
      interface ChatRoomList {
        ChatRoomInfo: IChatRoom
        userObject: IUser
      }
      const returnList: ChatRoomList[] = []
      let otherUserId: mongoose.Types.ObjectId | undefined
      let user: IUser | undefined

      //iterate through chatRooms
      for (const oneChatRoom of chatRoomList) {
        //sets otherUserId to _id listed when oneChatRoom.userIds is not the logged in user i.e. other person's id
        otherUserId = oneChatRoom.userIds.find(
          (userId: mongoose.Types.ObjectId) =>
            userId.toString() !== req.body.userId
        )
        //searches through otherUsers array to find where userObject id matches the other person's id and returns true
        user = otherUsers.find((userObject) => {
          return userObject._id.toString() === otherUserId?.toString()
        })
        if (otherUserId !== undefined && user !== undefined) {
          returnList.push({
            ChatRoomInfo: oneChatRoom,
            userObject: user,
          })
        }
      }
      res.json(returnList)
    } catch (expection) {
      console.log('something went wrong with findInbox', expection)
    }
  }

  async deleteChat(req: Request, res: Response) {
    try {
      // console.log(req.params);
      const messagesDeleted = await IndividualMessageModel.deleteMany({
        chatRoomId: req.params.chatRoomId,
      })
      const chatRoomDeleted = await ChatRoomModel.deleteOne({
        _id: req.params.chatRoomId,
      })
      res.status(200).json({ messagesDeleted, chatRoomDeleted })
    } catch (err) {
      console.log('Deleting the chat room failed.', err)
    }
  }

  //Messaging
  createNewMessage(io: Server, data: ISingleMessage) {
    const { message, to, chatRoomId, from } = data
    IndividualMessageModel.create({
      chatRoomId,
      from,
      to,
      message,
    })
      .then((newMessage) => {
        io.to(chatRoomId._id.toString()).emit('message', newMessage) // TODO: CONFIRM THIS .toString() Method
        // res.json(newMessage);
      })
      .catch((err) => {
        console.log('createNewMessage is not working', err)
      })
  }

  updateMessage(req: Request, res: Response) {
    IndividualMessageModel.findOneAndUpdate(
      { _id: req.params.messageId, to: req.body.userId },
      { unread: false },
      { new: true }
    )
      .then(() => res.json('message read'))
      .catch((err) => console.log('update message failed', err))
  }

  async findAllChatRoomMessages(req: Request, res: Response) {
    try {
      //user sends in chatRoomId
      //findOne chatRoom
      const oneChatRoom = await ChatRoomModel.findOne({
        _id: req.params.chatRoomId,
      })
      if (!oneChatRoom) {
        res.status(404).json('chatroom could not be found.')
      }
      //find user by chatRoom.userIds
      let otherUserId
      for (const userId of oneChatRoom!.userIds) {
        if (userId.toString() !== req.body.userId) {
          otherUserId = userId
        }
      }
      const otherUserObject = await UserModel.findOne(
        { _id: otherUserId },
        { password: 0 }
      )
      if (!otherUserObject) {
        res.status(404).json('The other user could not be found.')
      }
      //find all messages by chatRoomId
      const chatRoomMessages = await IndividualMessageModel.find({
        chatRoomId: oneChatRoom!._id,
      }).sort({ createdAt: 1 })
      if (!chatRoomMessages) {
        res.status(404).json('Your messages could not be found.')
      }
      //package into object and send to UI
      const chatRoomInfo = [
        {
          chatRoom: oneChatRoom,
          otherUser: otherUserObject,
          messages: chatRoomMessages,
        },
      ]
      res.json(chatRoomInfo)
    } catch (err) {
      console.error(err)
      res.status(500).json('There was a problem with finding this chat room.')
    }
  }

  deleteMessage(req: Request, res: Response) {
    IndividualMessageModel.deleteOne({ _id: req.params.messageId })
      .then((deleteMessage) => {
        res.json(deleteMessage)
      })
      .catch((err) => console.log('Deleting the message room failed.', err))
  }

  //TODO - add a unread message in chatroom controller

  //unread counts
  async unreadCount(req: Request, res: Response) {
    try {
      const count = await IndividualMessageModel.count({
        to: req.body.userId,
        unread: true,
      })
      res.json(count)
    } catch (err) {
      console.error(err)
      res.status(500).json('There was a problem with find your unread count.')
    }
  }
}
