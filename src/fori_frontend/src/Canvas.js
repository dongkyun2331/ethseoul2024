import React, { useState, useEffect } from "react";
import "./App.css"; // App.css 파일에 body의 background-color를 설정해주세요.

function Canvas() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
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
  }, []);

  return (
    <div className="App">
      <canvas></canvas>
    </div>
  );
}

export default Canvas;
