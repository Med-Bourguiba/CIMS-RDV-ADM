import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import Pie from "../../page/pieChart/pie";
import Bar from "../../page/barChart/bar";

const Row3 = () => {
  const theme = useTheme();
  

  return (
    <Stack gap={1.5} direction={"column"} mt={1.4}>
      <Paper sx={{ minWidth: "400px", width: "100%" }}>
        <Typography
          color={theme.palette.secondary.main}
          sx={{ padding: "30px 30px 0 30px" }}
          variant="h6"
          fontWeight="600"
        >
          Services
        </Typography>

        <Pie isDashbord={true} />
        <Typography variant="h6" align="center" sx={{ mt: "15px" }}>
          60% des patients qui viennent
        </Typography>
        <Typography variant="body2" px={0.7} pb={3} align="center">
          à notre hôpital choisissent de consulter le service
          <br />
          de cardiologie pour leurs soins.
        </Typography>
      </Paper>

      <Paper sx={{ minWidth: "400px", width: "100%" }}>
        <Typography
          color={theme.palette.secondary.main}
          variant="h6"
          fontWeight="600"
          sx={{ padding: "30px 30px 0 30px" }}
        >
          Medecins
        </Typography>

        <Bar isDashbord={true} />
        <Typography variant="h6" align="center" sx={{ mt: "20px" }}>
           Dr Karim Lassoued est le médecin le plus
        </Typography>
        <Typography variant="body2" px={0.7} pb={3} align="center" sx={{ mt: "5px" }}>
           consulté dans le service de cardiologie .
        </Typography>
      </Paper>
    </Stack>
  );
};



export default Row3;
