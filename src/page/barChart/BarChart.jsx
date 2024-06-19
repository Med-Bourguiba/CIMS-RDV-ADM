import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme } from "@mui/material";
import Bar from "./bar";
import Header from "../../components/Header";

const BarChart = () => {
  const theme = useTheme();
  return (
    <Box>
      <Header
        title="Statistique Medecins"
        subTitle="Données sur les médecins ayant reçu le plus grand nombre de consultations dans leur service"
      />
      <Bar />
    </Box>
  );
};

export default BarChart;
