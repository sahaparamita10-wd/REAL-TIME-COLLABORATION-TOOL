const ws = new WebSocket("ws://localhost:3000");
const editor = document.getElementById("editor");

let isTyping = false;

// Receive updates
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "init") {
        editor.value = data.content;
    }

    if (data.type === "update" && !isTyping) {
        editor.value = data.content;
    }
};

// Send updates
editor.addEventListener("input", () => {
    isTyping = true;

    ws.send(JSON.stringify({
        type: "update",
        content: editor.value
    }));

    setTimeout(() => isTyping = false, 100);
});