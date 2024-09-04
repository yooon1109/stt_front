import axios from 'axios';

export const fetchRecords = async () => {
    try {
      const response = await axios.get('/api/records'); // 프록시 설정에 따라 /api로 시작하는 요청이 http://localhost:8080으로 프록시됨
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // 에러가 발생하면 호출한 곳에서 처리할 수 있도록 에러를 던집니다.
    }
  };

export const fetchRecordDetail = async (id) => {
  try {
    const response = await fetch(`http://localhost:8081/api/record/detail?recordId=${id}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error('네트워크 응답이 성공하지 않았습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};