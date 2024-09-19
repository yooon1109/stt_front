import { AppBar } from "@mui/material";
import { red } from "@mui/material/colors";
import Toolbar from "components/Toolbar";
import React, { useState, useRef, useEffect } from "react";
import AudioVisualizer from "components/AudioVisualizer";
import { VoiceVisualizer, useVoiceVisualizer } from "react-voice-visualizer";
import { stopStreaming } from "apis/StreamApi";

const Streaming = () => {
  const [audioUrl, setAudioUrl] = useState(null); // 녹음된 파일의 URL을 저장
  const [transferText, setTransferText] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // MediaRecorder 생성 및 시작
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = async (event) => {
      // 녹음 중인 오디오 데이터를 audioChunks 배열에 저장
      // const arrayBuffer = await event.data.arrayBuffer()
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.start();

    // Stop recording and clean up
    mediaRecorder.onstop = async () => {
      // 녹음이 끝난 후 모든 녹음된 오디오 데이터를 Blob으로 결합
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl); // Blob URL을 상태에 저장
      stream.getTracks().forEach((track) => track.stop());
    };

    const eventSource = new EventSource("http://localhost:8081/api/stream");

    eventSource.onmessage = function (event) {
      const parsedData = JSON.parse(event.data);
      const { seq, alternatives, start_at } = parsedData;
      const text =
        alternatives.length > 0 && alternatives[0]?.text
          ? alternatives[0].text
          : "";

      console.log("Extracted text:", text);
      setTransferText((prevText) => {
        // 동일한 seq 값이 있는지 확인
        const existingIndex = prevText.findIndex((item) => item.seq === seq);

        if (existingIndex !== -1) {
          // 동일한 seq 값을 가진 메시지가 있다면 덮어쓰기
          const updatedText = [...prevText];
          updatedText[existingIndex] = { seq, text, start_at };

          return updatedText;
        } else {
          // 새 메시지를 추가
          return [...prevText, { seq, text, start_at }];
        }
      });
    };

    eventSource.onerror = function () {
      eventSource.close();
      console.log("error");
    };
  };

  const handleRecordStop = async () => {
    mediaRecorderRef.current?.stop();
    stopStreaming();
  };

  const recorderControls = useVoiceVisualizer({
    onStartRecording: handleRecording,
    onStopRecording: handleRecordStop,
  });

  const {
    // ... (Extracted controls and states, if necessary)
    audioRef,
    recordedBlob,
    bufferFromRecordedBlob,
  } = recorderControls;

  return (
    <div>
      <Toolbar />
      <div className="h-[68px] m-5 p-8" />
      {audioUrl && (
        <div>
          <h2>Recorded Audio:</h2>
          <audio controls src={audioUrl} />
        </div>
      )}
      <div>
        <VoiceVisualizer
          controls={recorderControls}
          ref={audioRef}
          width="90%"
          height={150}
          speed={3}
          backgroundColor="white"
          mainBarColor="black"
          secondaryBarColor="gray"
          barWidth={2}
          gap={2}
          rounded={true}
          isControlPanelShown={true}
          isDownloadAudioButtonShown={false}
          animateCurrentPick={true}
          fullscreen={false}
          onlyRecording={false}
          isDefaultUIShown={false}
          defaultMicrophoneIconColor="black"
          defaultAudioWaveIconColor="gray"
          isProgressIndicatorShown={true}
          isProgressIndicatorTimeShown={true}
          isProgressIndicatorOnHoverShown={true}
          isProgressIndicatorTimeOnHoverShown={true}
          isAudioProcessingTextShown={false}
        />
      </div>
      <div className="scroll h-[50vh] overflow-y-auto p-4 shadow-lg">
        <ul className="space-y-4 p-4">
          {transferText.map((item, index) => (
            <li key={index} className="flex justify-right">
              <div
                className="p-3 max-w-lg bg-blue-100 text-black
              rounded-xl relative shadow-md"
              >
                {item.text}
                <span
                  className="absolute top-full left-3 right-auto border-[10px] border
                  gray-300
                 border-transparent"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Streaming;
