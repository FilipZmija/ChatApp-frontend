import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import { Avatar, List, ListItem, ListItemText } from "@mui/material";
import { TUser } from "../../types/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createRoom } from "../../redux/slices/instancesSlice";

interface UserData {
  id: number;
  name: string;
}

export default function FormDialog() {
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<TUser[]>([]);
  console.log(users);
  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/all`,
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
        }
      );
      setUsers(response.data.users);
    })();
  }, []);
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

  const handleUserToggle = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData.name, selectedUsers);
    dispatch(createRoom({ name: formData.name, users: selectedUsers }));
  };
  return users.length > 0 ? (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Your Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />

          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleUserToggle(user.id)}
                sx={{ paddingLeft: "0", paddingRight: "0" }}
              >
                <Avatar sx={{ marginRight: "8px" }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText primary={user.name} />
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create Group</Button>
        </DialogActions>
      </Dialog>
    </>
  ) : null;
}
