// DialogComponent.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  TextField,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import CloseIcon from "@mui/icons-material/Close";
import StyledChip from "./StyledChip";
import { uploadRecord } from "apis/RecordApi";

const DialogComponent = ({ open, onClose, recordedBlob, duration }) => {
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [isUnknown, setIsUnknown] = useState(false);
  const [chipData, setChipData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name); // 선택된 파일 이름 저장
      setFile(e.target.files[0]); // 파일 객체 저장
    }
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSpeaker(""); // 체크박스가 선택되면 TextField를 비워줌
    }
    setIsUnknown(event.target.checked); // 체크박스의 선택 상태를 업데이트
  };

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete)); // 특정 Chip 삭제
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (chipData.length < speaker) {
        // chipData의 길이가 speakers 배열의 길이보다 작은 경우에만 추가
        setChipData([...chipData, inputValue]); // 배열에 새로운 값 추가
        setInputValue(""); // 입력 필드 초기화
      }
    }
  };

  const handleClose = () => {
    onClose();
    setChipData([]);
    setFile(null);
    setFileName("");
    setTitle("");
    setSpeaker("");
    setIsUnknown(false);
  };

  const handleConfirm = async () => {
    try {
      let currentFile = file;
      if (!fileName) {
        console.error("파일이 선택되지 않았습니다.");
      }
      if (recordedBlob) {
        currentFile = new File([recordedBlob], `${title}.mp3`, {
          type: "audio/mpeg",
        });
      }

      if (!title) {
        console.error("제목을 입력해주세요");
      } else {
        setLoading(true); // 로딩 시작

        const id = await uploadRecord(
          currentFile,
          title,
          speaker,
          chipData,
          duration
        ); // 파일, 제목 및 Chip 데이터를 API로 전송
        navigate(`/details/${id}`);
        onClose(); // 요청 성공 후 다이얼로그 닫기
      }
    } catch (error) {
      console.error("요청 처리 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "40%",
          maxWidth: "none",
          margin: "auto", // 항상 화면 가운데 위치
        },
      }}
    >
      <DialogTitle>녹음 불러오기</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading && (
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
              //   backgroundColor: "rgba(0, 0, 0, 0.2)", // 배경을 약간 어둡게
              zIndex: 1, // CircularProgress를 다이얼로그 위에 표시
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <div style={{ width: "85%" }}>
          {!recordedBlob ? (
            <div style={{ margin: "10px" }}>
              <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                파일 선택
              </Typography>
              <input
                type="file"
                id="fileInput"
                accept=".mp3,.wav,video/*,.mp4"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="fileInput">
                <AudioFileIcon />
                {fileName && (
                  <span style={{ marginLeft: "8px" }}>{fileName}</span>
                )}
              </label>
            </div>
          ) : (
            <div style={{ margin: "10px" }}>
              <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                녹음 파일
              </Typography>
              <p>
                <AudioFileIcon /> recorded_audio.wav
              </p>
              {/* <p>Size: {(recordedBlob.size / 1024).toFixed(2)} KB</p> */}
            </div>
          )}

          <div style={{ margin: "10px" }}>
            <Typography variant="body1">제목</Typography>
            <TextField
              autoComplete="off"
              id="outlined-basic"
              variant="standard"
              sx={{ width: "100%" }}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ margin: "10px" }}>
            <Typography variant="body1">대화 참여자 수</Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                autoComplete="off"
                id="outlined-basic"
                variant="standard"
                size="small"
                sx={{ width: "80px", marginRight: "5px" }}
                InputProps={{
                  inputProps: {
                    style: { textAlign: "right" },
                  },
                }}
                onChange={(e) => setSpeaker(e.target.value)}
                disabled={isUnknown}
              />
              <p>명</p>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isUnknown}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="모름"
                  sx={{ marginLeft: "30px" }}
                />
              </FormGroup>
            </div>
          </div>
          {/* <div style={{ margin: "10px" }}>
            <Typography variant="body1">대화 참여자 이름</Typography>

            <Box
              component="section"
              sx={{
                maxHeight: "60px",
                display: "flex",
                gap: 1,
                padding: "10px",
                marginTop: "10px",
                border: "1px solid #9ca3af",
                borderRadius: 2,
                alignItems: "center",
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                "&::-webkit-scrollbar": {
                  height: "2px",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  alignItems: "center",
                }}
              >
                {chipData.map((data, index) => (
                  <StyledChip
                    key={index}
                    label={data}
                    onDelete={handleDelete(data)} // 삭제 버튼 클릭 시 Chip 제거
                    deleteIcon={<CloseIcon />}
                  />
                ))}
                <input
                  type="text"
                  autoComplete="off"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isUnknown}
                  style={{
                    outline: "none",
                    paddingLeft: "6px",
                    height: 20,
                    width: 100,
                    margin: "2px",
                    caretColor: "#9ca3af",
                  }}
                />
              </div>
            </Box>
          </div> */}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          닫기
        </Button>
        <Button onClick={handleConfirm} color="secondary">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
