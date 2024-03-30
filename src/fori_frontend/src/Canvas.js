import React, { useState, useEffect } from "react";
import "./App.css"; // App.css 파일에 body의 background-color를 설정해주세요.

function Canvas() {
  const [text, setText] = useState(""); // 입력된 텍스트 상태
  const [imageLoaded, setImageLoaded] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

  const handleInputChange = (e) => {
    setText(e.target.value); // 입력 값 업데이트
  };

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d"); // 캔버스 컨텍스트 가져오기
    canvas.width = 1024;
    canvas.height = 576;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.src = "./img/Pellet Town.png";

    const playerImage = new Image();
    playerImage.src = "./img/playerDown.png";

    image.onload = () => {
      ctx.drawImage(image, -750, -550);
      setImageLoaded(true); // 이미지 로드 완료 상태 업데이트

      playerImage.onload = () => {
        ctx.drawImage(
          playerImage,
          0,
          0,
          playerImage.width / 4,
          playerImage.height,
          canvas.width / 2 - playerImage.width / 8, // 가로 위치 조정
          canvas.height / 2 - playerImage.height / 2, // 세로 위치 조정
          playerImage.width / 4,
          playerImage.height
        );
      };
    };

    // 텍스트 그리기 함수
    const drawText = (ctx, text, x, y) => {
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(text, x, y);
    };

    // 애니메이션 함수 내부에 위치 텍스트 그리기 추가
    function animate() {
      window.requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지움
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // 배경 채우기
      ctx.drawImage(image, -750, -550); // 배경 이미지 그리기

      ctx.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - playerImage.width / 8 + playerPosition.x, // 캐릭터 위치에 추가
        canvas.height / 2 - playerImage.height / 2 + playerPosition.y, // 캐릭터 위치에 추가
        playerImage.width / 4,
        playerImage.height
      ); // 플레이어 이미지 그리기

      drawText(
        ctx,
        text,
        canvas.width / 2 + playerPosition.x,
        canvas.height / 2 + playerPosition.y
      );
      // 캐릭터 위치를 중심으로 입력된 텍스트를 그립니다.
    }
    animate();

    // 키보드 이벤트 처리
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          setPlayerPosition((prevPos) => ({ ...prevPos, y: prevPos.y - 5 }));
          break;
        case "ArrowDown":
          setPlayerPosition((prevPos) => ({ ...prevPos, y: prevPos.y + 5 }));
          break;
        case "ArrowLeft":
          setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x - 5 }));
          break;
        case "ArrowRight":
          setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x + 5 }));
          break;
      }
    });
  }, [text]); // text 상태가 변경될 때마다 useEffect 실행

  return (
    <div className="App">
      <canvas></canvas>
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="글을 입력하세요"
      />
    </div>
  );
}

export default Canvas;
