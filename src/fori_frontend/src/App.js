import React, { useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import "./App.css";
import Canvas from "./Canvas";
import { Actor } from "@dfinity/agent";

const App = () => {
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState(null);

  const handleAuthenticated = async (authClient) => {
    const identity = await authClient.getIdentity();
    console.log("인증된 신원:", identity);

    // DelegationIdentity 객체에서 publicKey 속성 추출
    const { publicKey } = identity._delegation;
    const base64Key = arrayBufferToBase64(publicKey); // ArrayBuffer를 Base64 문자열로 변환
    setPublicKey(base64Key); // 변환된 문자열 저장
  };

  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    const binary = bytes.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    return btoa(binary);
  };

  const handleLogin = async () => {
    const authClient = await AuthClient.create();
    authClient.login({
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7일(나노초)
      onSuccess: async () => {
        await handleAuthenticated(authClient);
        await queryBalance(); // 로그인 후 잔액 조회
      },
    });
  };

  const queryBalance = async () => {
    const icpAccountActor = Actor.createActor(ICP_CANISTER_ID, {
      agentOptions: {
        host: "https://ic0.app",
      },
    });

    try {
      const accountInfo = await icpAccountActor.queryAccountInfo();
      setBalance(accountInfo.balance); // 잔액 업데이트
    } catch (err) {
      console.error("Canister Methods 호출 중 오류:", err);
    }
  };

  const handleLogout = () => {
    // 로그아웃 처리 (예시 코드, 실제 사용에 따라 처리 필요)
    alert("로그아웃 되었습니다.");
    setPublicKey(""); // 인증 정보 초기화 등 추가 작업 가능
    setBalance(null); // 잔액 초기화
  };

  return (
    <div>
      {publicKey ? (
        <div>
          <div id="profileArea">
            <button id="logoutBtn" onClick={handleLogout}>
              로그아웃
            </button>
            {balance && <div>잔액: {balance} ICP</div>}
          </div>
        </div>
      ) : (
        <>
          <button id="loginBtn" onClick={handleLogin}>
            로그인
          </button>
          <Canvas />
        </>
      )}
    </div>
  );
};

export default App;
