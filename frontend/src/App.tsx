import { useEffect, useRef, useState } from 'react';
import './App.css'

function App() {
  const [text, setText] = useState("");
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([]);

  type Message = {
    text: string;
    sender: "user" | "server";
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!socket || !text.trim()) return;

    socket.send(JSON.stringify({
      type: "chat",
      payload: {
        message: text
      }
    }));

    setMessages(prev => [
      ...prev,
      {
        text,
        sender: "user"
      }
    ]);

    setText("");
  }

  //connection to web socket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected");

      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "room1"
        }
      }));
    };

    //the response we get from the server
    ws.onmessage = (e) => {
      setMessages(prev => [
        ...prev,
        {
          text: e.data,
          sender: "server"
        }
      ]);
    }

    setSocket(ws);

    return () => ws.close();
  }, [])

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-black to-blue-950">
        <div className="w-100 h-150 bg-linear-to-b from-gray-900/90 to-gray-800/90 
                    backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl 
                    flex flex-col overflow-hidden">
          <div className="bg-gray-800/80 px-5 py-4 flex items-center gap-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl">
              🤖
            </div>
            <div>
              <h2 className="text-white font-semibold">Chat Room</h2>
              <p className="text-green-400 text-xs">● Online</p>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-2 chat-scroll">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage}
            className="flex items-center px-4 py-3 border-t border-white/10"
          >
            <div
              className="flex items-center w-full bg-white/10 border border-white/20 
                        rounded-full px-4 py-1.5 shadow-lg"
            >
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-white placeholder:text-gray-400 
                focus:outline-none text-lg px-3 py-2"
              />
              <button
                type="submit"
                className="ml-5 p-5 rounded-full
                          text-white shadow-md hover:scale-105 active:scale-95 transition-transform"
              >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
