//NAVBAR//

document.getElementById("hamburgerBtn").addEventListener("click", function() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("hidden");
    menu.classList.toggle("show");
});

//CHATBOT//

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
});

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value.trim();
    if (message === "") return;

    addMessage("user", message);
    inputField.value = "";

    try {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        addMessage("bot", data.reply);
    } catch (error) {
        addMessage("bot", "Maaf, terjadi kesalahan!");
    }
}

function addMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");

    // Bubble chat dengan tampilan lebih rapi
    msgDiv.classList.add(
        "p-3",
        "rounded-xl",
        "text-lg",
        "max-w-[75%]",
        "break-words",
        "opacity-0",
        "transition-opacity",
        "duration-300"
    );

    if (sender === "user") {
        msgDiv.classList.add(
            "bg-blue-500",
            "text-white",
            "self-end",
            "rounded-br-none",
            "mt-2",
            "mb-2",
            "mr-2"
        );
    } else {
        msgDiv.classList.add(
            "bg-gray-300",
            "text-black",
            "self-start",
            "rounded-bl-none",
            "ml-2"
        );
    }

    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);

    // Animasi fade-in setelah pesan ditambahkan
    setTimeout(() => {
        msgDiv.classList.remove("opacity-0");
    }, 100);

    // Tambahkan margin-bottom agar tidak ketutupan
    chatBox.style.paddingBottom = "120px";

    // Auto-scroll ke bawah agar pesan terbaru terlihat
    chatBox.scrollTop = chatBox.scrollHeight;
}
