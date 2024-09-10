import * as React from "react";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import DialogComponent from "./Dialog";

const actions = [
  { icon: <FileCopyIcon />, name: "녹음 불러오기" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
      {/* <Backdrop open={open} /> */}
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={
              action.name === "녹음 불러오기" ? handleDialogOpen : handleClose
            }
          />
        ))}
      </SpeedDial>

      <DialogComponent open={dialogOpen} onClose={handleDialogClose} />
    </Box>
  );
}
