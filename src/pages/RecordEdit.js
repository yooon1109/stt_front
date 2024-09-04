import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 임포트 추가
import { fetchRecordDetail } from 'apis/RecordApi';
import Input  from '@mui/joy/Input';
import EditableText from 'components/EditableText';

const RecordEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recordTextList, setRecordTextList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecord = async () => {
      try {
        const data = await fetchRecordDetail(id);
        setRecord(data);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setRecordTextList(data.recordTextList || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [id]);

  const handleSave = async () => {
    // try {
    //   const response = await fetch(`http://localhost:8081/api/record/update`, { // 업데이트 API 호출
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       id,
    //       title,
    //       description,
    //       recordTextList
    //     })
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to update record.');
    //   }

    //   navigate(`/record/${id}`); // 업데이트 후 상세 페이지로 이동
    // } catch (error) {
    //   setError(error.message);
    // }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!record) {
    return <div>No record found.</div>;
  }

  const { speakers } = record;

  // spk와 speaker 매핑
  const spkToSpeaker = (spk) => {
    return speakers[spk] || `Speaker ${spk}`; // 기본값 처리
  };

  const handleEnterPress = (index) => {
    const updatedList = [...recordTextList];
    updatedList.splice(index + 1, 0, { spk: updatedList[index].spk, msg: '' });
    setRecordTextList(updatedList);
  };
  
  return (
    <div>
      <h1>Edit Record</h1>
      <div>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        
        <div>
          <h2>Record Text List</h2>
          {recordTextList.map((item, index) => (
            <EditableText
            key={index}
            spk={item.spk}
            msg={item.msg}
            onMsgChange={(newMsg) => {
              const updatedList = [...recordTextList];
              updatedList[index].msg = newMsg;
              setRecordTextList(updatedList);
            }}
            spkToSpeaker={spkToSpeaker}
            onEnterPress={() => handleEnterPress(index)}
          />
          ))}
        </div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default RecordEdit;
