import {
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RdvService from "../../services/rdv";
import PaimentService from "../../services/paiment";
import Line from "../../page/lineChart/Line";

const Row2 = () => {
  const theme = useTheme();
  const [totalAmount, setTotalAmount] = useState(0);
  const [transactions, setTransactions] = useState([
    {
      txId: "5555",
      user: "johndoe",
      date: "2021-09-01",
      cost: "43.91",
    },
    {
      txId: "0315dsaaef",
      user: "jackdower",
      date: "2022-04-01",
      cost: "133.45",
    },
    {
      txId: "01e4dsaef",
      user: "aberdohnny",
      date: "2021-09-01",
      cost: "43.95",
    },
    {
      txId: "51034szvfew",
      user: "goodmanave",
      date: "2022-11-05",
      cost: "200.95",
    },
    {
      txId: "0a123sb",
      user: "stevebower",
      date: "2022-11-02",
      cost: "13.55",
    },
    {
      txId: "01e4dsa",
      user: "aberdohnny",
      date: "2021-09-01",
      cost: "43.95",
    },
    {
      txId: "120s51a",
      user: "wootzifer",
      date: "2019-04-15",
      cost: "24.20",
    },
    {
      txId: "0315dsaa",
      user: "jackdower",
      date: "2022-04-01",
      cost: "133.49",
    },
  ]);

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const { data: { total } } = await RdvService.getStatsByMntPaye();
        setTotalAmount(parseFloat(total)); // Ensure the total amount is parsed as float
      } catch (error) {
        console.error("Error fetching total amount:", error);
      }
    };

    fetchTotalAmount();
  }, []);

  useEffect(() => {
    const fetchDernieresTransactions = async () => {
      try {
        const { data } = await PaimentService.getDernieresTransactions();
        const formattedTransactions = data.map(paiement => ({
          txId: paiement.TRANSACTION_ID,
          user: paiement.SERVICE_PAYE,
          date: new Date(paiement.DATE_PAIEMENT).toLocaleDateString(),
          cost: Math.round(paiement.MNT_PAYE) / 1000
        }));
        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Erreur lors de la récupération des dernières transactions :", error);
      }
    };

    fetchDernieresTransactions();
  }, []);

  return (
    <Stack direction={"row"} flexWrap={"wrap"} gap={1.2} mt={1.3}>
      <Paper sx={{ maxWidth: 900, flexGrow: 1, minWidth: "400px", height: 400 }}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography
              color={theme.palette.secondary.main}
              mb={1}
              mt={2}
              ml={4}
              variant="h6"
              fontWeight={"bold"}
            >
              Revenus générés
            </Typography>
            <Typography variant="body2" ml={4}>
              TND {totalAmount ? totalAmount.toLocaleString() : "0.00"}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ height: 'calc(100% - 70px)', width: '100%' }}>
          <Line isDashboard={true} style={{ height: '100%' }} />
        </Box>
      </Paper>

      <Paper
        sx={{
          overflow: "auto",
          borderRadius: "4px",
          minWidth: "280px",
          height: 400,
          flexGrow: 1,
          padding:'20px'
        }}
      >
        <Typography
          color={theme.palette.secondary.main}
          fontWeight={"bold"}
          p={1.2}
          variant="h6"
        >
          Transactions récentes
        </Typography>

        {transactions.map((item) => {
          return (
            <Paper
              key={item.txId}
              sx={{
                mt: 0.4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box p={1.2}>
                <Typography variant="body1">{item.txId}</Typography>
                <Typography variant="body2">{item.user} </Typography>
              </Box>
              <Typography variant="body1">{item.date} </Typography>

              <Typography
                borderRadius={1.4}
                p={1}
                bgcolor={theme.palette.error.main}
                color={theme.palette.getContrastText(theme.palette.error.main)}
                variant="body2"
              >
                 TND {item.cost}
              </Typography>
            </Paper>
          );
        })}
      </Paper>
    </Stack>
  );
};

export default Row2;
