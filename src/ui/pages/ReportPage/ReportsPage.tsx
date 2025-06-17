import { Box } from "@mui/material";
import ReportsTabs from "./ReportsTabs";
import { useSelector } from "react-redux";
import { selectCurrentReportsTab } from "./ReportsSlice";
import Dashboard from "./Dashboard";
import Transaction from "./Transaction";

const ReportsPage = () => {
  const CurrentReportsTab = useSelector(selectCurrentReportsTab);
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <ReportsTabs />

      {CurrentReportsTab === 0 ? <Dashboard /> : <Transaction />}
    </Box>
  );
};

export default ReportsPage;
