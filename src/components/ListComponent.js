import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
// import Collapse from '@mui/material/Collapse';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';

const ListComponent = ({items, month}) => {

  // 여러 상태를 관리하기 위해 객체 형태로 확장/축소 상태를 관리
  const [openItems, setOpenItems] = React.useState({});

  const handleClick = (index) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [index]: !prevOpenItems[index],
    }));
  };

  const renderListItems = (items) => {
    return items.map((item, index) => (
      <Card key={index} sx={{ marginLeft: 4, marginRight: 4 }}>
     
        <ListItemButton onClick={() => item.nestedItems && handleClick(index)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText 
          primary={item.label} 
          secondary={
            <Typography variant='body2' color={'GrayText'}>{item.date}</Typography>
          }/>
        </ListItemButton>
      </Card>
    ));
  };

  return (
    <List
      sx={{ width: '100%',  bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" color="inherit" sx={{fontSize:'1.25rem', fontWeight:'bold'}} >
          {month}
        </ListSubheader>
      }
    >
      {renderListItems(items)}
    </List>
  );

};

export default ListComponent;
