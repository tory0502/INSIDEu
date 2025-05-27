import { useNavigate } from "react-router-dom";
import angerImg from './assets/anger.png';
import disgustImg from './assets/disgust.png';
import ennuiImg from './assets/ennui.png';
import envyImg from './assets/envy.png';
import joyImg from './assets/joy.png';

function Intro() {
  const navigate = useNavigate();

  return (
    <>
      {/* ✅ 상단바 */}
      <div
        style={{
          width: "100%",
          height: "60px",
          padding: "0 2rem",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          fontFamily: "'Pretendard', sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* 좌측: 로고 */}
        <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "#2d3436", whiteSpace: "nowrap" }}>
          INSIDEu
        </div>

        {/* 우측: 메뉴들 */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", whiteSpace: "nowrap" }}>
          <button
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              border: "1px solid #2d3436",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#2d3436",
              cursor: "pointer",
              minWidth: "80px", // ✅ 너비 강제 확보
              whiteSpace: "nowrap", // ✅ 줄바꿈 방지
            }}
            onClick={() => alert("로그인 페이지로 이동 예정입니다.")}
          >
            로그인
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              border: "1px solid #2d3436",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#2d3436",
              cursor: "pointer",
              minWidth: "100px", // ✅ 더 넓게 확보
              whiteSpace: "nowrap",
            }}
            onClick={() => alert("문의하기 이메일: insideu@support.com")}
          >
            문의하기
          </button>
        </div>
      </div>


      {/* ✅ 본문 */}
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#daeaf6",
          fontFamily: "'Black Han Sans', sans-serif",
          paddingTop: "60px", // 상단바 때문에 밀려나지 않게!
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "600px", width: "fit-content" }}>
          {/* 캐릭터 이미지 줄 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.25rem",
              marginBottom: "3rem",
            }}
          >
            <img src={joyImg} alt="Joy" style={{ width: "66px", height: "auto" }} />
            <img src={ennuiImg} alt="Ennui" style={{ width: "66px", height: "auto" }} />
            <img src={angerImg} alt="Anger" style={{ width: "66px", height: "auto" }} />
            <img src={envyImg} alt="Envy" style={{ width: "66px", height: "auto" }} />
            <img src={disgustImg} alt="Disgust" style={{ width: "66px", height: "auto" }} />
          </div>

          <h1
            style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "3.5rem",
              fontWeight: 800,
              color: "#2d3436",
              marginBottom: "1rem",
            }}
          >
            INSIDEu
          </h1>
          <p
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "1.25rem",
              color: "#636e72",
              marginBottom: "2.5rem",
            }}
          >
            당신의 내면을 들여다보는 상담 공간
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              onClick={() =>
                alert("INSIDEu는 당신의 감정을 함께 이해하고 돌아보는 AI 기반 심리 상담 플랫폼입니다.")
              }
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                border: "1px solid #dfe6e9",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              소개
            </button>
            <button
              onClick={() => navigate("/consult")}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                backgroundColor: "#6C5CE7",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              }}
            >
              시작하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Intro;

