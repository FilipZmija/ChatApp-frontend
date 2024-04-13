import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconButton } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import UserCard from "../Users/UserCard";
import "./ConvStyle/ConvesraionUsersList.css";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs() {
  const [open, setOpen] = React.useState(false);
  const { users } = useAppSelector((state) => state.conv.conversation);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <InfoOutlinedIcon fontSize="large" />
      </IconButton>

      <BootstrapDialog onClose={handleClose} open={open}>
        <div>
          <DialogTitle sx={{ m: 0, p: 2 }}>Conversation's users</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="dialog-user-list-container">
          {users.map((item) => (
            <UserCard user={item} key={item.id} />
          ))}
        </div>
      </BootstrapDialog>
    </React.Fragment>
  );
}
