import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchRecordDetail } from "apis/RecordApi";
import Toolbar from "components/Toolbar";
import Player from "components/Player";
import Description from "components/Description";

const DetailPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null); // API 데이터를 저장할 상태
  const [recordText, setRecordText] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordName, setRecordName] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // spk와 speaker 매핑
  const spkToSpeaker = (spk) => {
    return speakers[spk] || `Speaker ${spk}`; // 기본값 처리
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Toolbar />
      <div className="h-[68px]" />

      {/* 오디오 플레이어 */}
      {audioUrl && <Player audioSrc={audioUrl} recordName={recordName} />}
      <div className="ml-6 mr-6 pr-4 w-[100hv] text-right">
        참여자들 : {speakers.join(", ")}
      </div>
      {record ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div>
            <Link to={`/edit/${id}`}>
              <button>수정</button>
            </Link>
          </div>
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
