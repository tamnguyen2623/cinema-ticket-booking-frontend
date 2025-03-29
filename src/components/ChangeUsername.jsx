import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FormModal from "../common/form-modal";
const ChangeUsername = ({ auth, onClose }) => {
  const [newUsername, setNewUsername] = useState("");

  const onSubmitChangeUsername = async (event) => {
    event.preventDefault();
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    try {
      const response = await axios.post(
        `/auth/change-username`,
        { newUsername },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.data.success) {
        onClose();
        toast.success("Username changed successfully!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      } else {
        toast.error("Failed to change username!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error changing username!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  const changeUsernameForm = {
    title: "Change Username",
    fields: [
      {
        value: newUsername,
        label: "New Username",
        name: "newUsername",
        type: "text",
        required: true,
        onChange: (e) => setNewUsername(e.target.value),
      },
    ],
    submitText: "Change Username",
  };

  return (
    <FormModal
      handleClose={onClose}
      open={true}
      formData={changeUsernameForm}
      onSubmit={onSubmitChangeUsername}
      className="modal-change"
    />
  );
};

export default ChangeUsername;
