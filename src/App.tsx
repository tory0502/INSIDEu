import { useState } from "react";
import backgroundImg from './assets/indoor_plant.png'; // ⬅ your uploaded image

function App() {
  const [userInput, setUserInput] = useState("");
  const [agent, setAgent] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const mockCallAPI = async (text: string) => {
    setLoading(true);
    setTimeout(() => {
      setAgent("Reflection Supervisor");
      setResponse("그 감정에 대해 조금 더 깊이 들여다보면 어떨까요?");
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    mockCallAPI(userInput);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#d3e3f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Pretendard', sans-serif",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      {/* background illustration */}
      <img
        src={backgroundImg}
        alt="cozy plant"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "550px", // ⬅ 더 크게
          opacity: 0.5,   // ⬅ 선명하게
          zIndex: 0,
          filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.1))", // ⬅ 부드러운 그림자
        }}
      />

      {/* main content */}
      <div
        style={{
          position: "relative",
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
          padding: "2rem",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            fontFamily: "'Black Han Sans', sans-serif",
            color: "#2d3436",
            marginBottom: "1.5rem",
          }}
        >
          심리 상담 에이전트
        </h1>

        <textarea
          placeholder="마음이 복잡할 땐 이렇게 털어놓아도 괜찮아요 😊"
          style={{
            width: "100%",
            height: "120px",
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "1px solid #ccc",
            fontSize: "1rem",
            resize: "none",
            marginBottom: "1.5rem",
            fontFamily: "'Pretendard', sans-serif",
            boxSizing: "border-box",
          }}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            backgroundColor: "#6C5CE7",
            color: "white",
            border: "none",
            borderRadius: "0.75rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "상담 중..." : "내 마음 들려주기"}
        </button>

        {agent && response && (
          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "#f4f5f7",
              borderRadius: "1rem",
              padding: "1.25rem",
              textAlign: "left",
              fontSize: "1rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <p><strong>배정된 상담사:</strong> {agent}</p>
            <p><strong>상담 응답:</strong> {response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
