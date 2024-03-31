import React, { useState, useEffect, useRef } from "react";

function Memo() {
  const [memoList, setMemoList] = useState([]);
  const [newMemo, setNewMemo] = useState("");
  const memoContainerRef = useRef(null);

  useEffect(() => {
    const savedMemoList = JSON.parse(localStorage.getItem("memoList"));
    if (savedMemoList) {
      setMemoList(savedMemoList);
    }
  }, []);

  useEffect(() => {
    memoContainerRef.current.scrollTop = memoContainerRef.current.scrollHeight;
  }, [memoList]);

  const handleNewMemoChange = (event) => {
    setNewMemo(event.target.value);
  };

  const handleAddMemo = () => {
    if (newMemo.trim() !== "") {
      const updatedMemoList = [...memoList, { content: newMemo }];
      setMemoList(updatedMemoList);
      localStorage.setItem("memoList", JSON.stringify(updatedMemoList));
      setNewMemo("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddMemo();
    }
  };

  return (
    <div className="memo-container" ref={memoContainerRef}>
      <div className="memo-header"></div>
      <div className="memo-content">
        <ul>
          {memoList.map((memo, index) => (
            <li key={index}>{memo.content}</li>
          ))}
        </ul>
      </div>
      <div className="memo-input">
        <input
          type="text"
          value={newMemo}
          onChange={handleNewMemoChange}
          onKeyPress={handleKeyPress}
          placeholder="Text"
        />
        <button onClick={handleAddMemo}>Submit</button>
      </div>
    </div>
  );
}

export default Memo;
