import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchRecordDetail } from "apis/RecordApi";
import Toolbar from "components/Toolbar";
import Player from "components/Player";
import Description from "components/Description";
import Skeleton from "@mui/material/Skeleton";

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

const DetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [record, setRecord] = useState(null); // API 데이터를 저장할 상태
  const [recordText, setRecordText] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordName, setRecordName] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [duration, setDuration] = useState(null);

  const handleEditClick = () => {
    navigate(`/edit/${id}`, { state: { record } });
  };

  useEffect(() => {
    const loadRecordDetail = async () => {
      try {
        const data = await fetchRecordDetail(id);
        setRecord(data);
        setAudioUrl(data.fileData);
        setRecordName(data.recordName);
        setRecordText(data.recordTextList);
        setSpeakers(data.speakers);
        setDuration(data.duration);
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecordDetail();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // spk와 speaker 매핑
  const spkToSpeaker = (spk) => {
    return speakers[spk] || `Speaker ${spk}`; // 기본값 처리
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Toolbar isDetail={true} title={loading ? "" : record?.title} />
      <div className="h-[68px]" />

      {/* 오디오 플레이어 */}
      <Player
        audioSrc={audioUrl}
        recordName={recordName}
        isLoading={loading}
        time={duration}
      />

      <div className="ml-6 mr-6 pr-4 w-[100hv] flex justify-between">
        <div className="m-3 mb-0">
          참여자들 : {loading ? null : speakers.join(", ")}
        </div>
        <button className="m-3 mb-0" onClick={handleEditClick}>
          수정
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 border border-gray-400 p-4 m-6 rounded-[20px] h-[55vh]">
            <div className="m-2 overflow-hidden">
              {Array(6)
                .fill()
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    width="100%"
                    height={70}
                    className="mt-3"
                  />
                ))}
            </div>
          </div>
        </div>
      ) : record ? (
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

export default DetailPage;
