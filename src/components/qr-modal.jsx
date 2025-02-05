import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Grow,
  Box,
} from "@mui/material";

const QrModal = ({ open, handleClose, url }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Grow}
      transitionDuration={500}
      sx={{
        zIndex: 2000,
        "& .MuiDialog-paper": {
          borderRadius: "16px", // Rounded corners
          padding: "16px",
          backgroundColor: "#e0ffe0", // Soft green for success, soft red for fail
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)", // Elegant shadow
          transition: "all 0.3s ease-in-out", // Smooth transition for the modal
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Custom backdrop color
          transition: "opacity 0.5s ease-in-out", // Smooth backdrop transition
        },
      }}
    >
      <DialogContent>
        <Box
          component="img"
          src={url}
          alt="Example Image"
          sx={{
            width: "100%", 
            height: "auto",
            width: 300, 
            borderRadius: 2, 
            boxShadow: 3,
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: "green",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
            borderRadius: "8px",
            padding: "10px 20px",
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QrModal;
