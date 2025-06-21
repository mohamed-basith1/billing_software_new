import  { useEffect, useState } from "react";

const BarcodeScanner = ({ onScan }) => {
  const [input, setInput] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);


  useEffect(() => {
    const handleKeyPress = (e) => {
      const activeElement = document.activeElement;
      
      // ✅ Ignore if user is typing in an input or textarea
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
      ) {
        return;
      }
  
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
  
      if (e.key === "Enter") {
        if (input) {
          onScan(input); // Send scanned code
          setInput("");
        }
        return;
      }
  
      setInput((prev) => prev + e.key);
  
      const newTimeoutId = setTimeout(() => {
        setInput("");
      }, 100);
  
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
