import React, { useRef, useEffect, useState } from "react";

const ComponentTest = () => {
  const textareaRef = useRef(null);
  const msg ="123123";
  const color = "text-gray-500";
  const [speaker, setSpeaker] = useState(0);
  const [speakerInput, setSpeakerInput] = useState(""); // 입력된 값
  const speakers = ["abc","def"];
  
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

  return (
    <div className="p-4 mb-2rounded-md shadow-sm flex items-center">
      <div className="flex-shrink-0">
       
        <select
          className={`text-lg ${color} bg-transparent border-none outline-none`}
          value={speakers[speaker]}
          onChange={(e) => handleSpeakerChange(e.target.selectedIndex)}
        >
          {speakers.map((spk, index) => (
            <option key={index} value={spk}>
              {spk}
            </option>
          ))}
          {/* 구분선 역할을 하는 divider */}
  <option disabled className="bg-gray-200 cursor-default">
    ------------
  </option>
  {/* Edit 옵션 추가 */}
  <option value="edit" className="bg-gray-50">
    Edit
  </option>
           <input type="text"></input>
        </select>
        <input
          type="text"
          className="text-lg ml-2 p-1 border border-gray-300 rounded"
          value={speakerInput} // input에 입력된 값 표시
          onChange={handleInputChange} // 사용자가 입력한 값을 업데이트
        />
      </div>
      <div className="flex-1 ml-4">
        <div className="ml-4 text-gray-700 border border-gray-300">
          <textarea
            ref={textareaRef}
            type="text"
            value={msg}
            className="w-full p-2 border-none outline-none bg-transparent resize-none"
            
            rows={1}
          />
        </div>
      </div>
    </div>
  )
};

export default ComponentTest;