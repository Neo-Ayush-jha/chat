// Create floating chat button
const chatButton = document.createElement('div');
chatButton.innerHTML = '💬';
chatButton.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4f46e5;
  color: white;
  font-size: 24px;
  padding: 14px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Chat popup
const chatPopup = document.createElement('div');
chatPopup.style.cssText = `
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 320px;
  height: 450px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  display: none;
  flex-direction: column;
  overflow: hidden;
  font-family: sans-serif;
  z-index: 9999;
`;

// Header
const header = document.createElement('div');
header.innerText = 'NyayVaani 🤖';
header.style.cssText = `
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  color: white;
  padding: 14px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

// Chat body
const chatBody = document.createElement('div');
chatBody.style.cssText = `
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f9fafb;
`;

// Input area
const inputContainer = document.createElement('div');
inputContainer.style.cssText = `
  display: flex;
  border-top: 1px solid #e5e7eb;
`;

const input = document.createElement('input');
input.placeholder = 'Type your message...';
input.style.cssText = `
  flex: 1;
  border: none;
  padding: 12px;
  outline: none;
`;

const sendBtn = document.createElement('button');
sendBtn.innerText = '➤';
sendBtn.style.cssText = `
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0 16px;
  font-size: 18px;
  cursor: pointer;
`;

// Append elements
inputContainer.appendChild(input);
inputContainer.appendChild(sendBtn);
chatPopup.appendChild(header);
chatPopup.appendChild(chatBody);
chatPopup.appendChild(inputContainer);
document.body.appendChild(chatPopup);
document.body.appendChild(chatButton);

// Toggle popup on button click
chatButton.onclick = () => {
  chatPopup.style.display = chatPopup.style.display === 'none' ? 'flex' : 'none';
};

// Add message to chat
function addMessage(text, sender = 'user') {
  const msg = document.createElement('div');
  msg.innerText = text;
  msg.style.cssText = `
    background: ${sender === 'user' ? '#6366f1' : '#e0e7ff'};
    color: ${sender === 'user' ? 'white' : '#1e1e1e'};
    padding: 10px 14px;
    margin: 8px;
    border-radius: 16px;
    max-width: 80%;
    align-self: ${sender === 'user' ? 'flex-end' : 'flex-start'};
    white-space: pre-wrap;
  `;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Send message
sendBtn.onclick = async () => {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, 'user');
  input.value = '';

  try {
    const res = await fetch('https://mystery-game.onrender.com/api/chatbot/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();
    if (data?.data?.bot_reply) {
      addMessage(data.data.bot_reply, 'bot');
    } else {
      addMessage("Oops! Couldn't understand the response. 😕", 'bot');
    }
  } catch (error) {
    addMessage("Error connecting to bot. 😓", 'bot');
  }
};
