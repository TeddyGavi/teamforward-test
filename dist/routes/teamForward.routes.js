"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../controllers/index");
const auth_middleware_1 = require("../middlewares/auth.middleware");
module.exports = (app) => {
    //anonymous routes
    app.post('/teamForward/newUsers', index_1.USER.createNewUser);
    app.post('/teamForward/login', index_1.USER.login);
    app.post('/teamForward/logout', index_1.USER.logOut);
    //authenticated routes
    app.use(auth_middleware_1.authenticateMiddleware);
    //User
    app.get('/teamForward/location', index_1.LOCATION.getLocation);
    app.get('/teamForward/loggedInUser', index_1.USER.loggedInUser);
    app.get('/teamForward/:id', index_1.USER.findOneUser);
    app.get('/teamForward', index_1.USER.findAllUsers);
    app.patch('/teamForward/:id', index_1.USER.updateUser);
    app.patch('/teamForward/:id/gallery/upload', index_1.USER.uploadGallery);
    app.patch('/teamForward/:id/gallery/update/:photoId', index_1.USER.updateGallery);
    app.patch('/teamForward/:id/gallery/delete/:photoId', index_1.USER.deleteGallery);
    app.delete('/teamForward/:id', index_1.USER.deleteUser);
    //Messaging
    app.post('/messaging/chatRoom/:chatRoomId/message', index_1.CHAT.createNewMessage);
    app.post('/messaging/chatRoom', index_1.CHAT.createNewChatRoom);
    app.get('/messaging/inbox', index_1.CHAT.findInbox);
    app.get('/messaging/user/message/unreadCount', index_1.CHAT.unreadCount);
    app.get('/messaging/chatRoom/:chatRoomId/allMessages', index_1.CHAT.findAllChatRoomMessages);
    app.put('/messaging/message/:messageId/update', index_1.CHAT.updateMessage);
    app.delete('/messaging/chatRoom/:chatRoomId/delete', index_1.CHAT.deleteChat);
    app.delete('/messaging/chatRoom/message/:messageId/delete', index_1.CHAT.deleteMessage);
};
//# sourceMappingURL=teamForward.routes.js.map