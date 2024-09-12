import * as React from "react";
import { useNavigate } from "react-router-dom";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
// import Collapse from '@mui/material/Collapse';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';

const ListComponent = ({ items, month, onItemSelect }) => {
  const renderListItems = (items) => {
    return items.map((item, index) => (
      <Card key={index} sx={{ marginLeft: 4, marginRight: 4 }}>
        <ListItemButton onClick={() => onItemSelect(item.id)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.label}
            secondary={
              <Typography variant="body2" color={"GrayText"}>
                {item.date}
              </Typography>
            }
            sx={{ marginRight: 2 }}
          />
        </ListItemButton>
      </Card>
    ));
  };

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper", padding: "20px" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          color="inherit"
          sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
        >
          {month}
        </ListSubheader>
      }
    >
      {renderListItems(items)}
    </List>
  );
};

export default ListComponent;
