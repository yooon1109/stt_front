import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchRecordDetail } from "apis/RecordApi";

const DetailPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null); // API 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const loadRecordDetail = async () => {
      try {
        const data = await fetchRecordDetail(id);
        setRecord(data);
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

  const { speakers, recordTextList } = record;

  // spk와 speaker 매핑
  const spkToSpeaker = (spk) => {
    return speakers[spk] || `Speaker ${spk}`; // 기본값 처리
  };

  return (
    <div>
      <h1>Record Detail</h1>
      {record ? (
        <div>
          <Link to={`/edit/${id}`}>
            <button>Edit</button>
          </Link>
          <p>ID: {record.id}</p>
          <p>Title: {record.title}</p>
          <div>
            Description:{" "}
            {recordTextList.map((item, index) => (
              <div key={index}>
                <strong>{spkToSpeaker(item.spk)}:</strong> {item.msg}
              </div>
            ))}
          </div>
          {/* 필요한 다른 데이터들도 추가적으로 렌더링 */}
        </div>
      ) : (
        <div>No record found.</div>
      )}
    </div>
  );
};

export default DetailPage;
