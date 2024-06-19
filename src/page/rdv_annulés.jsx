// src/pages/RDVAnnules.jsx

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box } from "@mui/material";
import Header from "../components/Header";
import RdvService from "../services/rdv";
import { format } from 'date-fns';

const RDVAnnules = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchRDVannuleData();
  }, []);

  const fetchRDVannuleData = async () => {
    try {
      const response = await RdvService.getRDVannules();
      const rdvs = response.data;

      const rowsWithIds = rdvs.map((row, index) => ({
        ...row,
        id: index + 1, 
      }));

      setRows(rowsWithIds);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "COD_MED",
      headerName: "COD MED",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "COD_BENEF",
      headerName: "COD BENEF",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    { 
      field: "DATE_RDV", 
      headerName: "DATE RDV", 
      align: "center", 
      headerAlign: "center",
      renderCell: (params) => (
        <div>
          {format(new Date(params.value), 'dd/MM/yyyy')}
        </div>
      ),
    },
    {
      field: "HEURE_RDV",
      headerName: "HEURE RDV",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "COD_SERV",
      headerName: "COD SERV",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "NUM_RDV",
      headerName: "NUM RDV",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "NUM_DOSSIER",
      headerName: "NUM DOSSIER",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "GSM",
      headerName: "GSM",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "DATE_ANNULATION",
      headerName: "DATE ANNULATION",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div>
          {format(new Date(params.value), 'dd/MM/yyyy')}
        </div>
      ),
    },
    {
      field: "USER_ANNULATION",
      headerName: "USER ANNULATION",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "RAISON_ANNULATION",
      headerName: "RAISON ANNULATION",
      flex: 3,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box>
      <Header title={"RDV Annulés"} subTitle={"Liste des Rendez-vous annulés"} />
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} rowHeight={120}/>
      </Box>
    </Box>
  );
};

export default RDVAnnules;
