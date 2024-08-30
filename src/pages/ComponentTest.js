import React from 'react';
import ListComponent from 'components/ListComponent';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { fetchRecords } from 'apis/RecordApi';

// recordDate를 원하는 형식으로 변환하는 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 데이터를 월별로 그룹화하는 함수
const groupByMonth = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    const date = new Date(item.recordDate);
    const month = date.getMonth() + 1;
    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    groupedData[month].push({
      label: item.title,
      date: formatDate(item.recordDate),
      icon: <NoteAltIcon/>,
    });
  });

    // 월별 데이터 정렬
    Object.keys(groupedData).forEach((month) => {
      groupedData[month].sort((a, b) => {
        const dateA = Date.parse(a.date);
        const dateB = Date.parse(b.date);
        return dateA - dateB; // 오름차순 정렬
      });
    });

    
  return groupedData;
};

const ComponentTest = () => {
  const [groupedItems, setGroupedItems] = React.useState({});

    React.useEffect(() => {
        const getItems = async () => {
          try {
            const data = await fetchRecords();
            const groupedData = groupByMonth(data);
            setGroupedItems(groupedData);
            console.log(groupedData);
          } catch (error) {
            console.error('Failed to fetch items:', error);
          }
        };
    
        getItems();
      }, []);

      return (
        <div>
          {Object.keys(groupedItems).map((month) => (
            <ListComponent key={month} items={groupedItems[month]} month={month +'월'} />
          ))}
        </div>
      );
};

export default ComponentTest;