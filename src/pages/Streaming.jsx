import { AppBar, Button, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import Toolbar from "components/Toolbar";
import React, { useState, useRef, useEffect } from "react";
import { VoiceVisualizer, useVoiceVisualizer } from "react-voice-visualizer";
import { stopStreaming } from "apis/StreamApi";
import { Box } from "@mui/joy";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DialogComponent from "components/Dialog";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Streaming = () => {
  const [audioUrl, setAudioUrl] = useState(null); // 녹음된 파일의 URL을 저장
  const [transferText, setTransferText] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRecording = async () => {
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

  const { audioRef, recordedBlob, duration } = recorderControls;

  const handleSave = () => {
    if (!recordedBlob) {
      alert("파일이 없습니다.");
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Toolbar isDetail={true} title={"record"} />
      <div className="h-[68px]" />
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
      {isSaving && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <div className="scroll h-[47vh] overflow-y-auto p-4 shadow-lg">
        <ul className="space-y-4 p-4">
          {transferText.map((item, index) => (
            <li key={index} className="flex justify-right">
              <div
                className="p-3 max-w-lg bg-blue-100 text-black-200
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
      <div className="absolute bottom-4 right-4">
        <Button onClick={handleSave}>
          <div className="text-gray-500">save</div>
        </Button>
      </div>
      {/* Dialog for saving the recorded audio */}
      <DialogComponent
        open={isDialogOpen}
        onClose={handleDialogClose}
        recordedBlob={recordedBlob}
        duration={duration}
      ></DialogComponent>
    </div>
  );
};

export default Streaming;
