import { AppBar } from "@mui/material";
import { red } from "@mui/material/colors";
import Toolbar from "components/Toolbar";
import React, { useState, useRef, useEffect } from "react";
import AudioVisualizer from "components/AudioVisualizer";
import { VoiceVisualizer, useVoiceVisualizer } from "react-voice-visualizer";

const Streaming = () => {
  const [transferText, setTransferText] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
    });

    // MediaRecorder 생성 및 시작
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    const ws = new WebSocket("ws://localhost:8081/api/audio");

    ws.onopen = () => {
      console.log("open");
    };

    mediaRecorder.ondataavailable = async (event) => {
      // 녹음 중인 오디오 데이터를 audioChunks 배열에 저장
      const arrayBuffer = await event.data.arrayBuffer();
      if (ws.readyState === WebSocket.OPEN) {
        // ws.send(arrayBuffer);
        audioChunksRef.current.push(event.data);
      } else {
        console.warn("WebSocket is not open. Data not sent.");
      }
    };

    mediaRecorder.start();

    // Stop recording and clean up
    mediaRecorder.onstop = async () => {
      // 녹음이 끝난 후 모든 녹음된 오디오 데이터를 Blob으로 결합
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // 녹음된 오디오 데이터를 WebSocket으로 전송
      const arrayBuffer = await audioBlob.arrayBuffer();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(arrayBuffer);
        console.log(arrayBuffer);
      } else {
        console.warn("WebSocket is not open. Data not sent.");
      }

      stream.getTracks().forEach((track) => track.stop());
      ws.close();
    };

    // const eventSource = new EventSource("http://localhost:8081/api/stream");

    // eventSource.onmessage = function (event) {
    //   const parsedData = JSON.parse(event.data);
    //   const { seq, alternatives, start_at } = parsedData;
    //   const text = alternatives[0]?.text || "";

    //   setTransferText((prevText) => {
    //     // 동일한 seq 값이 있는지 확인
    //     const existingIndex = prevText.findIndex((item) => item.seq === seq);

    //     if (existingIndex !== -1) {
    //       // 동일한 seq 값을 가진 메시지가 있다면 덮어쓰기
    //       const updatedText = [...prevText];
    //       updatedText[existingIndex] = { seq, text, start_at };
    //       return updatedText;
    //     } else {
    //       // 새 메시지를 추가
    //       return [...prevText, { seq, text, start_at }];
    //     }
    //   });
    // };
    // eventSource.onerror = function () {
    //   eventSource.close();
    //   alert("Connection closed");
    // };
  };

  const recorderControls = useVoiceVisualizer({
    onStartRecording: handleRecording,
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
      <VoiceVisualizer
        controls={recorderControls}
        ref={audioRef}
        width="90%"
        height={300}
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
  );
};

export default Streaming;
