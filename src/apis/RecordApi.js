import axios from 'axios';

export const fetchRecords = async () => {
    try {
      const response = await axios.get('/api/record'); // 프록시 설정에 따라 /api로 시작하는 요청이 http://localhost:8080으로 프록시됨
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // 에러가 발생하면 호출한 곳에서 처리할 수 있도록 에러를 던집니다.
    }
  };