import React from "react";
import Input from "@mui/joy/Input";

// EditableText 컴포넌트
const EditableText = ({
  spk,
  msg,
  onMsgChange,
  spkToSpeaker,
  onEnterPress,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 엔터키 동작 방지
      onEnterPress();
    }
  };

  return (
    <div className="inline-block mb-2.5">
      <div className="flex items-center">
        <Input
          value={spkToSpeaker(spk)}
          sx={{
            width: `${spk.length * 12}px`, // 스피커 ID 길이에 따른 폭 조정
            minWidth: "200px",
            boxSizing: "border-box",
            fontWeight: "800",
          }}
        />
        <div className="font-bold mx-2.5">:</div>
        <Input
          color="neutral"
          value={msg}
          onChange={(e) => onMsgChange(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            width: `${msg.length * 12}px`, // 메시지 길이에 따른 폭 조정
            minWidth: "200px",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
};

export default EditableText;
