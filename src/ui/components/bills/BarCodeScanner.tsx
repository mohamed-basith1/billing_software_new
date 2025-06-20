import  { useEffect, useState } from "react";

const BarcodeScanner = ({ onScan }) => {
  const [input, setInput] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (e.key === "Enter") {
        if (input) {
          onScan(input); // send scanned code to parent or process it
          setInput("");
        }
        return;
      }

      setInput((prev) => prev + e.key);

      const newTimeoutId = setTimeout(() => {
        setInput("");
      }, 100); // Clear input if more than 100ms passes between keystrokes

      setTimeoutId(newTimeoutId);
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [input, timeoutId, onScan]);

  return null; // No visible component, just background listening
};

export default BarcodeScanner;
