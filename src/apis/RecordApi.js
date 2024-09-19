import axios from "axios";

export const fetchRecords = async () => {
  try {
    const response = await axios.get("/api/records"); // 프록시 설정에 따라 /api로 시작하는 요청이 프록시됨
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // 에러가 발생하면 호출한 곳에서 처리할 수 있도록 에러를 던집니다.
  }
};

export const fetchRecordDetail = async (id) => {
  try {
    const response = await fetch(`/api/record/detail?recordId=${id}`, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error("네트워크 응답이 성공하지 않았습니다.");
    }

    const data = await response.json();

    if (data.fileData) {
      // Base64 디코딩
      const byteCharacters = atob(data.fileData); // Base64로 인코딩된 데이터 디코딩
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Blob으로 변환
      const blob = new Blob([byteArray], { type: "audio/mpeg" });

      // Blob을 URL로 변환
      const url = URL.createObjectURL(blob);

      data.fileData = url;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// 서버에 파일 업로드 및 기타 데이터를 전송하는 함수
export const uploadRecord = async (fileName, title, speaker, speakers) => {
  const formData = new FormData();
  formData.append("recordId", ""); // 빈 문자열로 채우거나 적절한 값으로 수정
  formData.append("title", title);
  formData.append("speaker", speaker); // 빈 문자열로 채우거나 적절한 값으로 수정
  formData.append("file", fileName); // 선택된 파일을 추가
  formData.append("speakers", speakers.join(",")); // 배열을 쉼표로 구분된 문자열로 변환

  // FormData의 내용을 출력하기
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  try {
    const response = await axios.post("/api/save/record", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // 응답 데이터 가져오기
    const record = await response.data;

    // 응답 데이터의 id 반환
    return record.id;
  } catch (error) {
    console.error("Error uploading record:", error);
    throw error;
  }
};

export const editRecord = async (
  recordId,
  title,
  speaker,
  speakers,
  recordTextList
) => {
  const data = {
    recordId: recordId,
    title: title,
    speaker: speaker,
    speakers: speakers,
    recordTextList: recordTextList,
  };

  try {
    const response = await axios.post("/api/edit/record", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });
    const record = await response.data;

    console.log(record);
  } catch (error) {
    console.error("Error uploading record:", error);
    throw error;
  }
};
