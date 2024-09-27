import React, { useRef, useEffect, useState } from "react";
import { stopStreaming } from "apis/StreamApi";
import Canvas from "./Canvas";
import AudioVisualizer from "./AudioVisualizer";
import { IconButton, Button } from "@mui/material";
import MicNoneIcon from "@mui/icons-material/MicNone";
import StopIcon from "@mui/icons-material/Stop";
import DialogComponent from "components/Dialog";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef(null);

  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [seconds, setSeconds] = useState(0); // 초 카운트 상태
  const timerRef = useRef(null); // 타이머 Ref

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    console.log(audioBlob);
    if (audioBlob == null) {
      alert("파일이 없습니다.");
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const startRecording = async () => {
    setSeconds(0);
    try {
      // 디바이스 오디오 스트림 가져오기
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });
      setMediaStream(stream);
      setIsRecording(true);
      // MediaRecorder 생성 및 시작
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = async (event) => {
        // 녹음 중인 오디오 데이터를 audioChunks 배열에 저장
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        clearInterval(timerRef.current);
        // 녹음이 끝난 후 오디오 데이터를 Blob으로 결합
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(blob);
        setAudioURL(audioUrl); // 녹음된 오디오를 재생할 수 있도록 URL 설정
        setAudioBlob(blob);
      };

      // 타이머 시작
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing audio stream:", err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // mediaRecorder가 존재할 때만 stop() 호출
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop()); // 스트림의 트랙 종료
    }
    console.log(seconds);
  };

  return (
    <div>
      <AudioVisualizer mediaStream={mediaStream} />
      <div className="flex justify-center">
        <IconButton
          onClick={isRecording ? stopRecording : startRecording}
          sx={{ border: "4px solid #d1d5db", borderRadius: "50%" }}
        >
          {isRecording ? (
            <StopIcon fontSize="large" />
          ) : (
            <div className="w-[35px] h-[35px] flex items-center justify-center">
              <img src="/micIcon.svg" alt="micIcon" />
            </div>
          )}
        </IconButton>
      </div>
      <div className="absolute bottom-4 right-4">
        <Button onClick={handleSave}>
          <div className="text-gray-500">save</div>
        </Button>
      </div>
      <DialogComponent
        open={isDialogOpen}
        onClose={handleDialogClose}
        recordedBlob={audioBlob}
        duration={seconds}
      ></DialogComponent>
      {/* {audioURL && (
        <div>
          <h3>녹음된 오디오:</h3>
          <audio ref={audioRef} src={audioURL}></audio>
        </div>
      )} */}
    </div>
  );
};

export default AudioRecorder;
