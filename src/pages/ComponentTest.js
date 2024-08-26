import React from 'react';
import ListComponent from 'components/ListComponent';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import { fetchRecords } from 'apis/RecordApi';

const ComponentTest = () => {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        const getItems = async () => {
          try {
            const data = await fetchRecords();
            const formattedData = data.map((item) => ({
              label: item.label,
              date: item.date,
              icon: item.label === 'Sent mail' ? <SendIcon /> : item.label === 'Drafts' ? <DraftsIcon /> : <InboxIcon />, // 예시 아이콘 매칭
            }));
            setItems(formattedData);
          } catch (error) {
            console.error('Failed to fetch items:', error);
          }
        };
    
        getItems();
      }, []);

      return (
        <div>
          <h1>Dynamic MUI List</h1>
          <ListComponent items={items} month={month} />
        </div>
      );
};

export default ComponentTest;