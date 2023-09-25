const port = process.env.PORTKEY;
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
// const passport = require("passport");
import { Server } from 'socket.io';
import { CorsConfig } from './utils/index';
import { CHAT } from './controllers/index';
// set up
dotenv.config();
const app = express();
// configure Passport
// require("./Config/passport");
// middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
const apiCorsConfig = new CorsConfig('api').getCorsMiddleware();
const socketCorsConfig = new CorsConfig('socket').getCorsOptions();
app.use(apiCorsConfig);
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
require('./lib/mongoose.config');
require('./routes/teamForward.routes')(app);
const server = app.listen(port, () => console.log(`listening on port: ${port}`));
const io = new Server(server, {
    cors: socketCorsConfig,
});
io.on('connection', async (socket) => {
    socket.on('join', (chatRoomId) => {
        socket.join(chatRoomId);
    });
    socket.on('clientMessage', (data) => {
        CHAT.createNewMessage(io, data);
    });
});
//# sourceMappingURL=server.js.map