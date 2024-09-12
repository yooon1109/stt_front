import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 임포트 추가
import { fetchRecordDetail } from "apis/RecordApi";
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
  const { id } = useParams();
  const [record, setRecord] = useState(null); // API 데이터를 저장할 상태
  const [recordText, setRecordText] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordName, setRecordName] = useState(null);
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
    const loadRecordDetail = async () => {
      try {
        const data = await fetchRecordDetail(id);
        setRecord(data);
        setAudioUrl(data.fileData);
        setRecordName(data.recordName);
        setRecordText(data.recordTextList);
        setSpeakers(data.speakers);
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecordDetail();
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

  const handleEnterPress = (index) => {
    const updatedList = [...recordText];
    console.log(updatedList[0].spk);
    updatedList.splice(index + 1, 0, { spk: updatedList[index].spk, msg: "" });
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

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Toolbar />
      <div className="h-[68px]" />

      {/* 오디오 플레이어 */}
      {audioUrl && <Player audioSrc={audioUrl} recordName={recordName} />}
      <div className="ml-6 mr-6 pr-4 w-[100hv] flex justify-end">
        <div className="flex gap-2 items-center">
          참여자들 : {speakers.join(", ")}
          <IconButton onClick={handleEditSpeakers}>
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <SpeakersEdit open={open} onClose={handleClose} speakers={speakers} />
      {record ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* <Link to={`/edit/${id}`}>
            <button>Edit</button>
          </Link> */}
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
                    onEnterPress={() => handleEnterPress(index)}
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
