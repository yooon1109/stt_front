import React, { useRef, useEffect, useState } from "react";
import AudioRecorder from "components/AudioRecorder";
const ComponentTest = () => {
  const textareaRef = useRef(null);
  const msg = "123123";
  const color = "text-gray-500";
  const [speaker, setSpeaker] = useState(0);
  const [speakerInput, setSpeakerInput] = useState(""); // 입력된 값
  const speakers = ["abc", "def"];

  useEffect(() => {
    if (textareaRef.current) {
      // 텍스트 내용에 따라 높이 조정
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [msg]);

  // speaker가 변경될 때 호출되는 함수
  const handleSpeakerChange = (index) => {
    if (index === speakers.length + 1) {
      // Edit 옵션 선택 시 동작
      console.log("Edit option selected");
      // Edit 모드 활성화 등
    } else {
      setSpeaker(index); // 다른 선택지는 speaker로 설정
      setSpeakerInput(speakers[index]);
      console.log(speaker);
    }
  };

  // input에서 직접 값을 수정할 때 호출되는 함수
  const handleInputChange = (e) => {
    setSpeakerInput(e.target.value); // 입력된 값으로 업데이트
  };

  const [selected, setSelected] = useState(speakers[1]);

  return (
    <div>
      <AudioRecorder />
    </div>
  );
};

export default ComponentTest;
