import React, { useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import "./App.css";
import Canvas from "./Canvas";
import { HttpAgent } from "@dfinity/agent";

const App = () => {
  const [publicKey, setPublicKey] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");

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

        // 로그인 성공 후 ICP 지갑 주소 및 잔액 가져오기
        const agent = new HttpAgent();
        agent.setIdentity(authClient.getIdentity());
        const walletAddress = await agent.whoami();
        setWalletAddress(walletAddress);
        const balance = await getBalance(walletAddress);
        setBalance(balance);
      },
    });
  };

  // 잔액을 가져오는 함수 (실제 API 호출로 대체되어야 함)
  const getBalance = async (walletAddress) => {
    // 실제 ICP 지갑 API를 호출하여 잔액을 가져오는 코드를 작성해야 함
    // 예시: const balance = await icpWalletApi.getBalance(walletAddress);
    return "100 ICP"; // 임시로 잔액을 반환하는 예시 코드
  };

  const handleLogout = () => {
    // 로그아웃 처리 (예시 코드, 실제 사용에 따라 처리 필요)
    alert("로그아웃 되었습니다.");
    setPublicKey(""); // 인증 정보 초기화 등 추가 작업 가능
  };

  return (
    <div>
      {publicKey ? (
        <div>
          <div id="profileArea">
            <p>공개 키(Base64): {publicKey}</p>
            <div>
              <p>지갑 주소: {walletAddress}</p>
              <p>잔액: {balance}</p>
            </div>
            <button id="logoutBtn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
          <Canvas />
        </div>
      ) : (
        <button id="loginBtn" onClick={handleLogin}>
          로그인
        </button>
      )}
    </div>
  );
};

export default App;
