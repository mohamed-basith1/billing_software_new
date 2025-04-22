import React, { useEffect, useState } from "react";
import { style } from "./CustomerCreateModal";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUpdateUserModal,
  selectUserName,
  setUpdateUserModal,
} from "../../pages/LoginPage/LoginSlice";
import { toast } from "react-toastify";

const UpdateUserDetails = () => {
  const [username, setUsername] = useState(""); // Example default username
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector(selectUserName);
  const updateUserModal = useSelector(selectUpdateUserModal);
  const dispatch = useDispatch();

  const isDisabled =
    !username ||
    !currentPassword ||
    !newPassword ||
    newPassword !== confirmPassword;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    setUsername(user);
  }, []);

  const handleUpdateUser = async () => {
    // handle update logic here
    const payload = {
      username: user,
      newUserName: username,
      currentPassword,
      newPassword,
    };
    //@ts-ignore
    let response: any = await window.electronAPI.updateAccount(payload);
    if (response.status !== 200) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      toast.success(`${response.message}`, { position: "bottom-left" });
      dispatch(setUpdateUserModal(false));
    }
  };

  return (
    <Modal
      open={updateUserModal}
      onClose={() => dispatch(setUpdateUserModal(false))}
      aria-labelledby="create-modal-title"
      aria-describedby="create-modal-description"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(2px)",
        },
      }}
    >
      <Box
        sx={{
          ...style,
          width: 500,
          p: 4,
          borderRadius: "8px",
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Update User Details</Typography>

        {/* Username input with edit icon */}
        <Box sx={{ position: "relative", width: "100%" }}>
          <OutlinedInput
            placeholder="User Name"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!isUsernameEditable}
          />
          {!isUsernameEditable && (
            <IconButton
              onClick={() => setIsUsernameEditable(true)}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          )}
        </Box>

        <OutlinedInput
          placeholder="Current Password"
          fullWidth
          type={showPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {!showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />

        <OutlinedInput
          placeholder="New Password"
          fullWidth
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {!showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />

        <OutlinedInput
          placeholder="Confirm Password"
          fullWidth
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmPassword !== "" && confirmPassword !== newPassword}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end">
                {!showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />

        {confirmPassword !== "" && confirmPassword !== newPassword && (
          <Typography variant="body2" color="error" align="left" width="100%">
            Passwords do not match
          </Typography>
        )}

        <Button
          fullWidth
          disabled={isDisabled}
          onClick={handleUpdateUser}
          sx={{
            bgcolor: isDisabled ? "#ccc" : "black",
            color: isDisabled ? "#666" : "#fff",
            cursor: isDisabled ? "not-allowed" : "pointer",
            "&:hover": {
              bgcolor: isDisabled ? "#ccc" : "black",
            },
          }}
        >
          Change
        </Button>
      </Box>
    </Modal>
  );
};

export default UpdateUserDetails;
