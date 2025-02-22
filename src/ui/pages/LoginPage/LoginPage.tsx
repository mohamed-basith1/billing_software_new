import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import loginImage from "../../assets/Image/illustrate/login.png";
import { setAuthenticate } from "./LoginSlice";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let payload = {
    username,
    password,
    adminPassword,
  };
  const sanitizedData = JSON.parse(JSON.stringify(payload));
  const dispatch = useDispatch();

  const handleLogin = async () => {
    //@ts-ignore
    let response = await window.electronAPI.loginAPI(sanitizedData);
    if (response.status !== 200) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      dispatch(setAuthenticate(true));
    }
  };

  const handleCreateAccount = async () => {
    if (username && password && adminPassword) {
      //@ts-ignore
      let response = await window.electronAPI.createAccount(sanitizedData);
      console.log("");
      if (response.status === 201) {
        toast.success(`${response.message}`, { position: "bottom-left" });
        setCreateAccount(false);
      } else {
        toast.error(`${response.message}`, { position: "bottom-left" });
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        gap: "20px",
        p: 2,
        boxSizing: "border-box",
        background: "white",
        transition: "3s",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "50%",
          height: "100%",
          bgcolor: "white",
          borderRadius: "50px",
          padding: "10rem 5rem 5rem 5rem",
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{ fontSize: "1.8rem", fontWeight: 400, color: "#1E1E2D" }}
        >
          Get Started Now
        </Typography>
        <Typography
          sx={{ fontSize: "0.8rem", fontWeight: 400, pt: 1, color: "#1E1E2D" }}
        >
          Enter your credentials to access your account
        </Typography>

        {createAccount ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 12,
            }}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "#1E1E2D",
                mb: 1,
              }}
            >
              User Name
            </Typography>
            <TextField
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              placeholder="User Name"
            />

            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "#1E1E2D",
                mt: 2,
                mb: 1,
              }}
            >
              Password
            </Typography>
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "#1E1E2D",
                mt: 2,
                mb: 1,
              }}
            >
              Admin Password
            </Typography>
            <TextField
              value={adminPassword}
              type="password"
              onChange={(e: any) => setAdminPassword(e.target.value)}
            />

            <Button
              sx={{ bgcolor: "#1E1E2D", mt: 6 }}
              variant="contained"
              fullWidth
              onClick={() => handleCreateAccount()}
            >
              Create Account
            </Button>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "#1E1E2D",
                mt: 2,
                mb: 1,
              }}
            >
              Have an account ?{" "}
              <span
                style={{ color: "#22b378", cursor: "pointer" }}
                onClick={() => setCreateAccount(false)}
              >
                Sign In
              </span>
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 12,
            }}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "#1E1E2D",
                mb: 1,
              }}
            >
              User Name
            </Typography>
            <TextField
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              placeholder="User Name"
            />

            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "#1E1E2D",
                mt: 2,
                mb: 1,
              }}
            >
              Password
            </Typography>
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              sx={{ bgcolor: "#1E1E2D", mt: 6 }}
              variant="contained"
              fullWidth
              onClick={() => handleLogin()}
            >
              Login
            </Button>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "#1E1E2D",
                mt: 2,
                mb: 1,
              }}
            >
              Don't have an account ?{" "}
              <span
                style={{ color: "#22b378", cursor: "pointer" }}
                onClick={() => setCreateAccount(true)}
              >
                Create Account
              </span>
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          width: "50%",
          height: "100%",
          bgcolor: "#1E1E2D",
          borderRadius: "50px",
          padding: "10rem 5rem",
          boxSizing: "border-box",
        }}
      >
        <Typography sx={{ fontSize: "1.8rem", fontWeight: 400 }}>
          The simplest way to manage <br /> your business
        </Typography>

        <Typography sx={{ fontSize: "0.8rem", fontWeight: 400, pt: 1 }}>
          Enter your credentials to access your account
        </Typography>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={loginImage} style={{ height: "90%" }} />
        </Box>
      </Box>
    </Box>
  );
}
