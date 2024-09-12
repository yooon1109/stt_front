import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Reorder } from "framer-motion";

const SpeakersEdit = React.memo(({ open, onClose, speakers }) => {
  const [spkList, setSpkList] = useState(speakers);
  const [tempValues, setTempValues] = useState(speakers);

  const handleDelete = useCallback((index) => {
    setSpkList((prevList) => {
      const updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    });
    setTempValues((prevList) => {
      const updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    });
  }, []);

  const handleChange = useCallback(
    (index) => (e) => {
      setTempValues((prevValues) => {
        const updatedValues = [...prevValues];
        updatedValues[index] = e.target.value;
        return updatedValues;
      });
    },
    []
  );

  const handleAddBtn = useCallback(() => {
    setSpkList((prevList) => [...prevList, ""]);
    setTempValues((prevList) => [...prevList, ""]);
  }, []);

  const handleClose = useCallback(() => {
    onClose(tempValues);
  }, [onClose, tempValues]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>참여자들</DialogTitle>
      <DialogContent>
        <Reorder.Group axis="y" values={spkList} onReorder={setSpkList}>
          {spkList.map((item, index) => (
            <Reorder.Item key={item} value={item}>
              <div className="flex gap-2 items-center">
                <DragHandleIcon fontSize="small" />
                <TextField
                  type="text"
                  className="m-2"
                  value={tempValues[index]}
                  onChange={handleChange(index)}
                  variant="outlined"
                  size="small"
                />
                <IconButton onClick={() => handleDelete(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <div className="text-gray-500 mt-3 w-full">
          <Button onClick={handleAddBtn}>
            <AddIcon fontSize="small" style={{ marginRight: "10px" }} />
            Add...
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default SpeakersEdit;
