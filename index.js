document.addEventListener("DOMContentLoaded", function () {
  const fontFamily = `"ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;

  // Chat trigger button
  const chatButton = document.createElement("button");
  chatButton.innerText = "💬";
  chatButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-size: 24px;
    background-color: #6366f1;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    font-family: ${fontFamily};
  `;

  // Chat popup container
  const chatPopup = document.createElement("div");
  chatPopup.style.cssText = `
    display: none;
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 350px;
    height: 600px;
    background-color: white;
    border-radius: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: ${fontFamily};
  `;

  // Header
  const chatHeader = document.createElement("div");
  chatHeader.style.cssText = `
    background: linear-gradient(to right, #9ae6f8, #6366f1);
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    font-family: ${fontFamily};
  `;

  const leftSide = document.createElement("div");
  leftSide.style.display = "flex";
  leftSide.style.alignItems = "center";
  leftSide.innerHTML = `
    <img src="https://raw.githubusercontent.com/Neo-Ayush-jha/chat/refs/heads/main/logo.webp" alt="Logo" style="height: 30px; margin-right: 10px;" />
    <strong style="font-size: 16px; color: #000;">AI Noir</strong>
  `;

  const rightSide = document.createElement("div");
  rightSide.style.display = "flex";
  rightSide.style.alignItems = "center";
  rightSide.innerHTML = `
    <span style="cursor:pointer; font-size: 18px; margin-right: 10px;">🌙</span>
    <span id="chatCloseBtn" style="cursor:pointer; font-size: 20px;">✖</span>
  `;
  rightSide.querySelector("#chatCloseBtn").addEventListener("click", () => {
    chatPopup.style.display = "none";
  });

  chatHeader.appendChild(leftSide);
  chatHeader.appendChild(rightSide);

  // Messages container
  const chatMessages = document.createElement("div");
  chatMessages.style.cssText = `
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
    font-size: 14px;
  `;

  // Message input area
  const chatForm = document.createElement("form");
  chatForm.style.cssText = "display: flex; border-top: 1px solid #eee;";
  const chatInput = document.createElement("input");
  chatInput.placeholder = "Type your message...";
  chatInput.style.cssText = `
    flex: 1;
    padding: 10px;
    border: none;
    outline: none;
    font-family: ${fontFamily};
  `;

  const sendBtn = document.createElement("button");
  sendBtn.innerHTML = "➤";
  sendBtn.type = "submit";
  sendBtn.style.cssText = `
    background: #4f46e5;
    color: white;
    border: none;
    padding: 0 15px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 0 20px 20px 0;
    transition: background 0.3s ease;
    margin:0px 12px;
  `;

  chatForm.appendChild(chatInput);
  chatForm.appendChild(sendBtn);
  chatPopup.appendChild(chatHeader);
  chatPopup.appendChild(chatMessages);
  chatPopup.appendChild(chatForm);

  let isFirstOpen = true;

  chatButton.addEventListener("click", () => {
    const isHidden = chatPopup.style.display === "none";
    chatPopup.style.display = isHidden ? "flex" : "none";

    if (isHidden && isFirstOpen) {
      const welcomeMsg = createMessageElement("Hello there! How can I help you today?", false);
      chatMessages.appendChild(welcomeMsg);
      isFirstOpen = false;
    }

    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  });

  // Create Message Block
  function createMessageElement(text, isUser) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "flex-end";
    container.style.gap = "8px";
    container.style.alignSelf = isUser ? "flex-end" : "flex-start";

    const icon = document.createElement("img");
    icon.src = isUser
      ? "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
      : "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";
    icon.style.width = "24px";
    icon.style.height = "24px";
    icon.style.borderRadius = "50%";

    const msg = document.createElement("div");
    msg.style.maxWidth = "220px";
    msg.style.padding = "10px";
    msg.style.borderRadius = "15px";
    msg.style.fontSize = "14px";
    msg.style.whiteSpace = "pre-wrap";
    msg.style.wordWrap = "break-word";
    msg.style.backgroundColor = isUser ? "#4f46e5" : "#f3f4f6";
    msg.style.color = isUser ? "white" : "black";
    msg.style.transition = "all 0.3s ease";
    msg.style.fontFamily = fontFamily;

    container.appendChild(isUser ? msg : icon);
    container.appendChild(isUser ? icon : msg);

    msg.textContent = text;
    return container;
  }

  // Typing animation
  function typeBotReply(element, text, index = 0) {
    const msgDiv = element.querySelector("div");
    if (index < text.length) {
      msgDiv.textContent += text.charAt(index);
      setTimeout(() => typeBotReply(element, text, index + 1), 25);
    }
  }

  // Message sending logic
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    const userMsg = createMessageElement(message, true);
    chatMessages.appendChild(userMsg);
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const response = await fetch("https://mystery-game.onrender.com/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();
      const botReplyText = result?.data?.bot_reply || "⚠️ Something went wrong.";

      const botMsg = createMessageElement("", false);
      chatMessages.appendChild(botMsg);
      typeBotReply(botMsg, botReplyText);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (err) {
      const errorMsg = createMessageElement("🤖: Error connecting to server.", false);
      chatMessages.appendChild(errorMsg);
    }
  });

  document.body.appendChild(chatButton);
  document.body.appendChild(chatPopup);
});
