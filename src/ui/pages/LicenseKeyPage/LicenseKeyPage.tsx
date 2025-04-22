import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { generateRandomKey } from "../../utils/utils";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLicenseAuth } from "../LoginPage/LoginSlice";

const LicenseKeyInput = () => {
  const [values, setValues] = useState(Array(8).fill(""));
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    licenseKeySender();
  }, []);

  const licenseKeySender = () => {
    const randomKey = generateRandomKey();
    setLicenseKey(randomKey.toLowerCase());
    sendLicenseKeyHandle(randomKey);
  };

  const sendLicenseKeyHandle = async (key) => {
    try {
      const isLicensed = JSON.parse(localStorage.getItem("isLicensed"));
      if (isLicensed === null) {
        //@ts-ignore
        let response = await window.electronAPI.sendLicenseKey(key);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e, index) => {
    const newValues = [...values];
    newValues[index] = e.target.value.toUpperCase().slice(0, 1);
    setValues(newValues);

    if (e.target.value && index < 7) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const enteredLicenseKey = values.join("").toLowerCase();
    if (enteredLicenseKey === licenseKey.toLowerCase()) {
      localStorage.setItem("isLicensed", JSON.stringify({ key: "activated" }));
      dispatch(setLicenseAuth(true));
    } else {
      toast.error("Wrong License Key", { position: "bottom-left" });
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setValues(Array(8).fill(""));
    licenseKeySender();
  };

  return (
    <Box
      sx={{
        bgcolor: "#f9f9f9",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "#ffffff",
          p: 4,
          borderRadius: 2,
          boxShadow: 0.9,
          textAlign: "center",
          maxWidth: 500,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "black" }}>
          License Key
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, width: "70%" }}
        >
          Hey Boss! 👋 Please enter our license key below. I've sent it to your
          email.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {values.map((value, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputsRef.current[index] = el)}
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              variant="outlined"
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "1rem",
                  width: "1rem",
                  height: "1rem",
                },
              }}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={values.join("").length !== 8}
          sx={{ mb: 1, display: timer <= 0 ? "none" : "auto" }}
        >
          Submit
        </Button>

        {canResend ? (
          <Button variant="outlined" color="secondary" onClick={handleResend}>
            Resend Key
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Resend available in {timer}s
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LicenseKeyInput;

//    const randomKey = generateRandomKey();
//       // sendLicenseKeyHandle(randomKey);
//   const sendLicenseKeyHandle = async (key) => {
//     console.log("generated key ", key);
//     //@ts-ignore
//     let response = await window.electronAPI.sendLicenseKey(key);
//   };
//   // console.log(encription_key.key); // { name: "Basith", age: 23 }

//   const handleLicenseKey = (license_key) => {
//     console.log("license_key", license_key);
//     //  localStorage.setItem("encription_key", JSON.stringify({ key: "Basith" }));
//   };
