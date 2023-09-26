"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const port = process.env.PORTKEY;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// const passport = require("passport");
const socket_io_1 = require("socket.io");
const index_1 = require("./utils/index");
const index_2 = require("./controllers/index");
// set up
dotenv_1.default.config();
const app = (0, express_1.default)();
// configure Passport
// require("./Config/passport");
// middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cookie_parser_1.default)());
const apiCorsConfig = new index_1.CorsConfig('api').getCorsMiddleware();
const socketCorsConfig = new index_1.CorsConfig('socket').getCorsOptions();
app.use(apiCorsConfig);
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
require('./lib/mongoose.config');
require('./routes/teamForward.routes')(app);
const server = app.listen(port, () => console.log(`listening on port: ${port}`));
const io = new socket_io_1.Server(server, {
    cors: socketCorsConfig,
});
io.on('connection', async (socket) => {
    socket.on('join', (chatRoomId) => {
        socket.join(chatRoomId);
    });
    socket.on('clientMessage', (data) => {
        index_2.CHAT.createNewMessage(io, data);
    });
});
//# sourceMappingURL=server.js.map