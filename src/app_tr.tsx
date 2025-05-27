import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 상담사 유형별 프로필 이미지지
import joyProfile from "./assets/joy_profile.png";
import anxietyProfile from "./assets/anxiety_profile.png";
import sadnessProfile from "./assets/sadness_profile.png";
import ennuiProfile from "./assets/ennui_profile.png";
import envyProfile from "./assets/envy_profile.png";

function App() {
  // 사용자 입력력
  const [userInput, setUserInput] = useState("");

  // 메시지 목록
  const [messages, setMessages] = useState<
    { sender: "user" | "agent"; text: string; agentType?: string }[]
  >([
    {
      sender: "agent",
      text: `최근에 겪었던 힘들거나 마음에 남는 일이 있다면 자유롭게 이야기해 주세요.

1)그때 어떤 일이 있었는지 \n2)어떤 생각이 들었고 어떤 기분이었는지

그리고 가능하다면 앞으로 어떻게 이 상황을 해결하거나 극복하고 싶은지도 함께 말씀해 주시면 좋아요.
--
예시)\n며칠 전 친구에게 연락했는데, 계속 답이 없었어요.  
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

  // 상담사 유형별 프로필 이미지지
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

  // 상담사 유형 이름
  const getAgentLabel = (type: string) => {
    switch (type) {
      case "empathy supervisor":
        return "empathy";
      case "strategy supervisor":
        return "strategy";
      case "identification supervisor":
        return "identification";
      case "reflection supervisor":
        return "reflection";
      case "encouragement supervisor":
        return "encouragement";
      default:
        return "상담사";
    }
  };

  const handleSubmit = async () => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    // 사용자 메시지
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setUserInput("");
    setLoading(true);

    // ⬇모델 API 연동 부분
    // 여기에 실제 백엔드 모델 API 요청을 넣으면 됨.
    // 예시:
    // const res = await fetch("/api/chat", {
    //   method: "POST",
    //   body: JSON.stringify({ user_input: trimmed }),
    // });
    // 이 부분의 코드는 모델의 output에 따라 바꾸면 됨.
    // const data = await res.json();
    // const reply = data.response;
    // const agentType = data.agent_type;

    // 지금은 테스트용 mock 응답
    setTimeout(() => {
      const reply = "그 감정에 대해 조금 더 깊이 들여다보면 어떨까요?";
      const agentType = "encouragement supervisor";
      setMessages((prev) => [...prev, { sender: "agent", text: reply, agentType }]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#98ebeb",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Pretendard', sans-serif",
        padding: 0,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
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
              flexDirection: "column",
              alignItems:
                msg.sender === "user" ? "flex-end" : "flex-start",
              padding: "0 1rem",
              gap: "0.25rem",
            }}
          >
            {msg.sender === "agent" && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                <span style={{ fontSize: "0.85rem", color: "#555" }}>
                  {getAgentLabel(msg.agentType || "")}
                </span>
              </div>
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

        {loading && (() => {
          const lastAgent = [...messages].reverse().find(m => m.sender === "agent");
          const lastAgentType = lastAgent?.agentType || "reflection supervisor";

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0 1rem",
              }}
            >
              <img
                src={getAgentProfile(lastAgentType)}
                alt="typing"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  backgroundColor: "#f1f1f1",
                  color: "#333",
                  padding: "0.75rem 1rem",
                  borderRadius: "1.25rem",
                  fontSize: "1rem",
                }}
              >
                ...
              </div>
            </div>
          );
        })()}


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
