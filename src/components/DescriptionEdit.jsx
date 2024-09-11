import React, { useRef, useEffect } from "react";

const DescriptionEdit = ({
  speaker,
  msg,
  color,
  onMsgChange,
  speakers,
  onSpeakerChange,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // 텍스트 내용에 따라 높이 조정
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [msg]);

  return (
    <div className="p-4 mb-2rounded-md shadow-sm flex items-center">
      <div className="flex-shrink-0">
        <select
          className={`text-lg ${color} bg-transparent border-none outline-none`}
          value={speaker}
          onChange={(e) => onSpeakerChange(e.target.value)}
        >
          {speakers.map((spk, index) => (
            <option key={index} value={spk}>
              {spk}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 ml-4">
        <div className="ml-4 text-gray-700 border border-gray-300">
          <textarea
            ref={textareaRef}
            type="text"
            value={msg}
            className="w-full p-2 border-none outline-none bg-transparent resize-none"
            onChange={(e) => onMsgChange(e.target.value)}
            rows={1}
          />
        </div>
      </div>
    </div>
  );
};

export default DescriptionEdit;
