import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FormModal from "../common/form-modal";
const ChangePassword = ({ auth, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");

  const onSubmitChangePassword = async (event) => {
    event.preventDefault();
    if (reNewPassword !== newPassword) {
      toast.error("Please re-enter your new password and confirm password!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    try {
      const response = await axios.post(
        `/auth/change-password`,
        {
          oldPassword,
          newPassword,
          reEnterPassword: reNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.data.code === 1000) {
        onClose();
        toast.success("Change password successful!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      } else {
        toast.error("Your password is incorrect!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  const changePasswordForm = {
    title: "Change Password",
    fields: [
      {
        value: oldPassword,
        label: "Old password",
        name: "oldPassword",
        type: "password",
        required: true,
        onChange: (e) => setOldPassword(e.target.value),
      },
      {
        value: newPassword,
        label: "New password",
        name: "newPassword",
        type: "password",
        required: true,
        onChange: (e) => setNewPassword(e.target.value),
      },
      {
        value: reNewPassword,
        label: "Re-enter password",
        name: "reEnter",
        type: "password",
        required: true,
        onChange: (e) => setReNewPassword(e.target.value),
      },
    ],
    submitText: "Change Password",
  };

  return (
    <FormModal
      handleClose={onClose}
      open={true}
      formData={changePasswordForm}
      onSubmit={onSubmitChangePassword}
      className="modal-changepassword"
    />
  );
};

export default ChangePassword;
