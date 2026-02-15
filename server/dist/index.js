import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let allSockets = [];
//event handler
wss.on("connection", function (socket) {
    socket.on("message", (msg) => {
        const msgObj = JSON.parse(msg.toString());
        console.log("user joined the room " + msgObj.payload.roomId);
        if (msgObj.type == "join") {
            allSockets.push({
                socket,
                room: msgObj.payload.roomId
            });
        }
        if (msgObj.type == "chat") {
            console.log("user joined the room " + msgObj.payload.message);
            // let currentUserRoom = null;
            // for(let i=0; i< allSockets.length; i++) {
            //     if (allSockets[i]?.socket == socket) {
            //         currentUserRoom = allSockets[i].room
            //     }
            // }
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;
            // for(let i=0; i< allSockets.length; i++) {
            //     if (allSockets[i]?.room == currentUserRoom) {
            //         allSockets[i]?.socket.send(msgObj.payload.message)
            //     }
            // }
            allSockets.forEach((x) => {
                if (x.room === currentUserRoom && x.socket !== socket) {
                    x.socket.send(msgObj.payload.message);
                }
            });
        }
    });
    socket.on("close", () => {
        allSockets = allSockets.filter(x => x.socket !== socket);
    });
});
//# sourceMappingURL=index.js.map