import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box, Button } from "@mui/material";
import Header from "../components/Header";
import PaimentService from "../services/paiment";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { toast } from 'react-toastify';

const Paiment = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchPaimentData();
  }, []);

  const fetchPaimentData = async () => {
    try {
      const response = await PaimentService.lister();
      const paiments = response.data;

      const rowsWithIds = paiments.map((row, index) => ({
        ...row,
        id: index + 1, 
      }));

      setRows(rowsWithIds);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 50, align: "center", headerAlign: "center" },
    { field: "NUM_RDV", headerName: "Num RDV", flex: 1, align: "center", headerAlign: "center" },
    { field: "NUM_ANALYSE", headerName: "Num Analyse", flex: 1, align: "center", headerAlign: "center" },
    { 
      field: "DATE_PAIEMENT", 
      headerName: "Date Paiement", 
      flex: 1, 
      align: "center", 
      headerAlign: "center",
      valueFormatter: (params) => new Date(params.value).toISOString().split('T')[0] 
    },
    { field: "COD_BENEF", headerName: "Cod Benef", flex: 1, align: "center", headerAlign: "center" },
    { field: "SERVICE_PAYE", headerName: "Service Payé", flex: 1, align: "center", headerAlign: "center" },
    { field: "MNT_PAYE", headerName: "Montant Payé", flex: 1, align: "center", headerAlign: "center" },
    { field: "METHOD_PAIEMENT", headerName: "Méthode de Paiement", flex: 1, align: "center", headerAlign: "center" },
    { field: "STATUS_PAIEMENT", headerName: "Status Paiement", flex: 1, align: "center", headerAlign: "center" },
    { field: "TRANSACTION_ID", headerName: "Transaction ID", flex: 2, align: "center", headerAlign: "center" },
    { field: "REMARQUE", headerName: "Remarque", flex: 3, align: "center", headerAlign: "center" },
  ];

  return (
    <Box>
      <Header title={"PAIEMENTS"} subTitle={"Liste des transactions effectuées"} />
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Paiment;
