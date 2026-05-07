const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

let documentText = ""; // shared document

wss.on("connection", (ws) => {
    console.log("User connected");

    // Send current document to new user
    ws.send(JSON.stringify({
        type: "init",
        content: documentText
    }));

    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "update") {
            documentText = data.content;

            // Broadcast to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "update",
                        content: documentText
                    }));
                }
            });
        }
    });

    ws.on("close", () => {
        console.log("User disconnected");
    });
});

console.log("Server running on ws://localhost:3000");