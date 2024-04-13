import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TUser } from "../../types/user";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { createRoom } from "../../redux/slices/instancesSlice";
import "./RoomStyle/RoomCreationForm.css";
import UserCheckList from "./UserCheckList";
import TwoColumnUserList from "./TwoColumnUserList";
import IconButton from "@mui/material/IconButton";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
export default function FormDialog() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [selectedUsers, setSelectedUsers] = useState<TUser[]>([]);
  const selectedUserIds = selectedUsers.map((user) => user.id);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserToggle = (user: TUser) => {
    if (
      selectedUsers.findIndex(
        (selectedUsers) => selectedUsers.id === user.id
      ) !== -1
    ) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData.name, selectedUsers);
    dispatch(createRoom({ name: formData.name, users: selectedUserIds }));
  };
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <ChatOutlinedIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle className="dialog-title">Create Group</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Room name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <h3>Selected users</h3>

          {selectedUsers.length > 0 ? (
            <div className="dialog-users-list-container selected-container">
              <TwoColumnUserList
                handleUserToggle={handleUserToggle}
                selectedUsers={selectedUsers}
              />
            </div>
          ) : (
            <h5>No selected users</h5>
          )}

          <UserCheckList
            handleUserToggle={handleUserToggle}
            selectedUsers={selectedUsers}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create Group</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
