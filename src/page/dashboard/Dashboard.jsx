import React from "react";
import Row2 from "./Row2";
import Row3 from "./Row3";
import Button from "@mui/material/Button";
import { DownloadOutlined } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";

const Dashboard = () => {
  const theme = useTheme();

  const handlePrint = () => {
    window.print();
  };

  
  return (
    <div>
       <style>
        {`
          @media print {
            .print-dashboard {
              display: none;
            }
          }
        `}
      </style>
<     Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Header
          isDashboard={true}
          title={"DASHBOARD"}
          subTitle={"Bienvenue sur votre tableau de bord"}
        />
  
        <Box sx={{ textAlign: "right", mb: 1.3 }}>
          <Button
            className="print-dashboard"
            sx={{ padding: "6px 8px", textTransform: "capitalize" }}
            variant="contained"
            color="primary"
            onClick={handlePrint}
          >
            <DownloadOutlined />
            Télécharger les rapports
          </Button>
        </Box>
</Stack>

     
      <Row2 />
      <Row3 />
    </div>
  );
};

export default Dashboard;
