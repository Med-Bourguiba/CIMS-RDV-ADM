import React from "react";
import Typography from "@mui/material/Typography";
import { Box, useTheme } from "@mui/material";

const NotFound = () => {
  const theme = useTheme();
  return (
    <Box>
      <Typography align="center" color={theme.palette.error.main} variant="h5">
       Il n'y a pas encore de conception
         <br />
         <br />
         Veuillez réessayer plus tard..
      </Typography>
    </Box>
  );
};

export default NotFound;