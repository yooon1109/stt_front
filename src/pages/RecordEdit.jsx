import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { editRecord, fetchRecordDetail } from "apis/RecordApi";
import Toolbar from "components/Toolbar";
import Player from "components/Player";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
} from "@mui/material";
import Input from "@mui/joy/Input";
import EditableText from "components/EditableText";
import Description from "components/DescriptionEdit";
import EditIcon from "@mui/icons-material/Edit";
import SpeakersEdit from "components/SpeakersEdit";

const RecordEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const [record] = useState(location.state?.record || null); // API 데이터를 저장할 상태
  const [recordText, setRecordText] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [title, setTitle] = useState(null);
  const [recordName, setRecordName] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [open, setOpen] = useState(false); // 다이얼로그 열림 상태 관리

  // 색상 배열 정의
  const colors = [
    "text-slate-600",
    "text-teal-500",
    "text-cyan-400",
    "text-slate-500",
    "text-pink-400",
    "text-amber-400",
    "text-red-300",
    "text-indigo-400",
  ];

  useEffect(() => {
    setAudioUrl(record.fileData);
    setRecordName(record.recordName);
    setRecordText(record.recordTextList);
    setSpeakers(record.speakers);
    setTitle(record.title);
    setDuration(record.duration);
    setLoading(false);
    // const loadRecordDetail = async () => {
    //   try {
    //     const data = await fetchRecordDetail(id);
    //     setRecord(data);
    //     setAudioUrl(data.fileData);
    //     setRecordName(data.recordName);
    //     setRecordText(data.recordTextList);
    //     setSpeakers(data.speakers);
    //     console.log(data);
    //   } catch (error) {
    //     setError(error.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // loadRecordDetail();
  }, []);

  const handleSave = async () => {};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!record) {
    return <div>No record found.</div>;
  }

  // spk와 speaker 매핑
  const spkToSpeaker = (spk) => {
    return speakers[spk] || `Speaker ${spk}`; // 기본값 처리
  };

  const handleMsgChange = (index, newMsg) => {
    setRecordText((prevMessages) =>
      prevMessages.map((item, i) =>
        i === index ? { ...item, msg: newMsg } : item
      )
    );
  };

  const handleSpeakerChange = (index, speaker) => {
    setRecordText((prevMessages) =>
      prevMessages.map((item, i) =>
        i === index ? { ...item, spk: speaker } : item
      )
    );
    console.log(recordText);
  };

  const handleEnterPress = (index, cursorPosition) => {
    const updatedList = [...recordText];

    // 현재 메시지와 커서 위치
    const currentMessage = updatedList[index].msg;

    // 커서 위치에 따라 메시지 분할
    const firstPart = currentMessage.slice(0, cursorPosition);
    const secondPart = currentMessage.slice(cursorPosition);

    // 기존 메시지 업데이트
    updatedList[index].msg = firstPart;

    // 새 메시지 추가
    const newMessage = {
      spk: updatedList[index].spk,
      startAt: updatedList[index].startAt + 300, // 새 메시지의 시작 시간 조정
      msg: secondPart,
    };

    // 새 메시지를 기존 메시지 뒤에 추가
    updatedList.splice(index + 1, 0, newMessage);

    // 상태 업데이트
    setRecordText(updatedList);
  };

  const handleDeleteText = (index) => {
    const updatedList = [...recordText];
    updatedList.splice(index, 1);
    setRecordText(updatedList);
  };

  const handleEditSpeakers = () => {
    setOpen(true); // 다이얼로그 열기
  };
  const handleClose = (updatedSpeakers) => {
    setOpen(false);
    setSpeakers(updatedSpeakers);
  };

  const handleSaveClick = () => {
    const saveRecord = async () => {
      const response = await editRecord(
        id,
        title,
        speakers.length,
        speakers,
        recordText
      );
    };
    saveRecord();

    navigate(`/details/${id}`);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Toolbar
        isDetail={true}
        isEdit={true}
        title={title}
        onTitleChange={(newTitle) => handleTitleChange(newTitle)}
      />
      <div className="h-[68px]" />

      {/* 오디오 플레이어 */}
      {audioUrl && (
        <Player audioSrc={audioUrl} recordName={recordName} time={duration} />
      )}
      <div className="ml-6 mr-6 pr-4 w-[100hv] flex justify-between">
        <div className="m-3 mb-0 items-center">
          참여자들 : {speakers.join(", ")}
          <IconButton onClick={handleEditSpeakers} sx={{ height: "10px" }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </div>

        <button className="m-3 mb-0" onClick={handleSaveClick}>
          저장
        </button>
      </div>
      <SpeakersEdit open={open} onClose={handleClose} speakers={speakers} />
      {record ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 border border-gray-400 p-4 m-6 rounded-[20px] h-[55vh]">
            <div className="m-2 overflow-y-auto scrollbar-thin-custom">
              <div>
                {recordText.map((item, index) => (
                  <Description
                    key={index}
                    speaker={spkToSpeaker(item.spk)}
                    msg={item.msg}
                    color={colors[item.spk]}
                    onMsgChange={(newMsg) => handleMsgChange(index, newMsg)}
                    speakers={speakers}
                    onSpeakerChange={(speaker) =>
                      handleSpeakerChange(index, speaker)
                    }
                    onEnterPress={(cursorPosition) =>
                      handleEnterPress(index, cursorPosition)
                    }
                    onClickDelete={() => handleDeleteText(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>No record found.</div>
      )}
    </div>
  );
};

export default RecordEdit;
