import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function App() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { message: "Hello, I am the bot!", sentTime: "just now", sender: "bot" },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToBot(newMessages);
  };

  async function processMessageToBot(messages) {
    const formData = new FormData();
    let message = messages.map((messageObject) => {
      if (messageObject.sender !== "bot") {
        return messageObject.message;
      }
    });
    formData.append("question", message[message.length - 1]);
    await fetch("http://127.0.0.1:5000/respond", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages([
          ...messages,
          {
            message: data.result,
            sentTime: "just now",
            sender: "bot",
          },
        ]);

        setIsTyping(false);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={
                isTyping ? <TypingIndicator content="bot is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
