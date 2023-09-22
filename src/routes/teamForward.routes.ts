import { CHAT, USER, LOCATION } from '../controllers/index'
import { authenticateMiddleware } from '../middlewares/auth.middleware'

module.exports = (app) => {
  //anonymous routes
  app.post('/teamForward/newUsers', USER.createNewUser)
  app.post('/teamForward/login', USER.login)
  app.post('/teamForward/logout', USER.logOut)

  //authenticated routes
  app.use(authenticateMiddleware)

  //User
  app.get('/teamForward/location', LOCATION.getLocation)
  app.get('/teamForward/loggedInUser', USER.loggedInUser)
  app.get('/teamForward/:id', USER.findOneUser)
  app.get('/teamForward', USER.findAllUsers)
  app.patch('/teamForward/:id', USER.updateUser)
  app.patch('/teamForward/:id/gallery/upload', USER.uploadGallery)
  app.patch('/teamForward/:id/gallery/update/:photoId', USER.updateGallery)
  app.patch('/teamForward/:id/gallery/delete/:photoId', USER.deleteGallery)
  app.delete('/teamForward/:id', USER.deleteUser)

  //Messaging
  app.post('/messaging/chatRoom/:chatRoomId/message', CHAT.createNewMessage)
  app.post('/messaging/chatRoom', CHAT.createNewChatRoom)
  app.get('/messaging/inbox', CHAT.findInbox)
  app.get('/messaging/user/message/unreadCount', CHAT.unreadCount)
  app.get(
    '/messaging/chatRoom/:chatRoomId/allMessages',
    CHAT.findAllChatRoomMessages
  )
  app.put('/messaging/message/:messageId/update', CHAT.updateMessage)
  app.delete('/messaging/chatRoom/:chatRoomId/delete', CHAT.deleteChat)
  app.delete(
    '/messaging/chatRoom/message/:messageId/delete',
    CHAT.deleteMessage
  )
}
