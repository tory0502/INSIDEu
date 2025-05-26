import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import joyProfile from "./assets/joy_profile.png";
import anxietyProfile from "./assets/anxiety_profile.png";
import sadnessProfile from "./assets/sadness_profile.png";
import ennuiProfile from "./assets/ennui_profile.png";
import envyProfile from "./assets/envy_profile.png";

function App() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "agent"; text: string; agentType?: string }[]
  >([
    {
      sender: "agent",
      text: `**최근에 겪었던 힘들거나 마음에 남는 일이 있다면 자유롭게 이야기해 주세요.**

1)그때 어떤 일이 있었는지, 2)어떤 생각이 들었고 어떤 기분이었는지,

그리고 가능하다면 앞으로 어떻게 이 상황을 해결하거나 극복하고 싶은지도 함께 말씀해 주시면 좋아요.

e.g.\n며칠 전 친구에게 연락했는데, 계속 답이 없었어요.  
순간 '내가 뭘 잘못했나?' 하는 생각이 들었고,  
사실 이런 일이 자주 있다 보니 '나는 별로 중요하지 않은 사람인가 보다'라는 생각이 스쳤어요.  
그때 굉장히 외롭고 속상했어요.  
앞으로는 이런 감정에서 벗어나고 싶고, 너무 신경 쓰지 않는 사람이 되고 싶어요.`,
      agentType: "reflection supervisor",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const getAgentProfile = (type: string) => {
    switch (type) {
      case "empathy supervisor":
        return joyProfile;
      case "strategy supervisor":
        return anxietyProfile;
      case "identification supervisor":
        return sadnessProfile;
      case "reflection supervisor":
        return ennuiProfile;
      case "encouragement supervisor":
        return envyProfile;
      default:
        return ennuiProfile;
    }
  };

  const handleSubmit = async () => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setUserInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = "그 감정에 대해 조금 더 깊이 들여다보면 어떨까요?";
      const agentType = "encouragement supervisor";
      setMessages((prev) => [...prev, { sender: "agent", text: reply, agentType }]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#d3e3f5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Pretendard', sans-serif",
        padding: 0,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Navigation bar with back button */}
      <div
        style={{
          height: "60px",
          backgroundColor: "#ffffffdd",
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#2d3436",
          }}
        >
          ←
        </button>
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.25rem",
            fontFamily: "'Black Han Sans', sans-serif",
            color: "#2d3436",
          }}
        >
          심리 상담 에이전트
        </div>
      </div>

      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "1rem 0.25rem 0 0.25rem",
          zIndex: 1,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start",
              padding: "0 1rem",
              alignItems: "flex-end",
              gap: "0.5rem",
            }}
          >
            {msg.sender === "agent" && (
              <img
                src={getAgentProfile(msg.agentType || "")}
                alt="agent"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}

            <div
              style={{
                backgroundColor: msg.sender === "user" ? "#6C5CE7" : "#f1f1f1",
                color: msg.sender === "user" ? "#ffffff" : "#333",
                padding: "0.75rem 1rem",
                borderRadius: "1.25rem",
                maxWidth: "75%",
                wordBreak: "break-word",
                fontSize: "1rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          display: "flex",
          padding: "1rem",
          backgroundColor: "#ffffffcc",
          backdropFilter: "blur(6px)",
          position: "sticky",
          bottom: 0,
          zIndex: 2,
          borderRadius: "1rem",
          marginTop: "1rem",
        }}
      >
        <input
          type="text"
          value={userInput}
          placeholder="여기에 입력하세요..."
          onChange={(e) => setUserInput(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "999px",
            border: "1px solid #ccc",
            outline: "none",
            fontFamily: "'Pretendard', sans-serif",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginLeft: "0.5rem",
            padding: "0.75rem 1.25rem",
            backgroundColor: "#6C5CE7",
            color: "white",
            border: "none",
            borderRadius: "999px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "전송"}
        </button>
      </div>
    </div>
  );
}

export default App;