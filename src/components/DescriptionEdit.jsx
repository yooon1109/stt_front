import { Button } from "@mui/material";
import React, { useRef, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const DescriptionEdit = ({
  speaker,
  msg,
  color,
  onMsgChange,
  speakers,
  onSpeakerChange,
  onEnterPress,
  onClickDelete,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // 텍스트 내용에 따라 높이 조정
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [msg]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 엔터키 동작 방지
      const cursorPosition = textareaRef.current.selectionStart;
      onEnterPress(cursorPosition);
    }
  };

  const handleDelete = (e) => {
    onClickDelete();
  };

  return (
    <div className="p-4 mb-2rounded-md shadow-sm flex items-center">
      <div className="flex-shrink-0">
        <IconButton aria-label="delete" size="small" onClick={handleDelete}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
        <select
          className={`text-lg ${color} bg-transparent border-none outline-none`}
          value={speaker}
          onChange={(e) => onSpeakerChange(e.target.selectedIndex)}
        >
          {speakers.map((spk, index) => (
            <option key={index} value={spk} className="text-gray-500">
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
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </div>
      </div>
    </div>
  );
};

export default DescriptionEdit;
