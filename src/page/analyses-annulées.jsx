import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box } from "@mui/material";
import Header from "../components/Header";
import RdvService from "../services/rdv";
import { format } from 'date-fns';

const AnalyseAnnulees = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchAnalyseAnnuleeData();
  }, []);

  const fetchAnalyseAnnuleeData = async () => {
    try {
      const response = await RdvService.getAnalysesAnnulees();
      const analyses = response.data;

      const rowsWithIds = analyses.map((row, index) => ({
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
      field: "NUM_ANALYSE",
      headerName: "NUM ANALYSE",
      width: 110,
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
      field: "TYPE_ANALYSE", 
      headerName: "TYPE ANALYSE", 
      flex: 2,
      align: "center", 
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "DESCRIPTION",
      headerName: "DESCRIPTION",
      flex: 3,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "DATE_ANALYSE",
      headerName: "DATE ANALYSE",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div>
          {format(new Date(params.value), 'dd/MM/yyyy')}
        </div>
      ),
    },
    {
      field: "MEDECIN_RESPONSABLE",
      headerName: "MEDECIN RESPONSABLE",
      flex: 1.5,
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
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "RAISON_ANNULATION",
      headerName: "RAISON ANNULATION",
      flex: 2,
      align: "center",
      headerAlign: "center",
    },

  ];

  return (
    <Box>
      <Header title={"ANALYSES ANNULEES"} subTitle={"Liste des analyses annulées"} />
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} rowHeight={120}/>
      </Box>
    </Box>
  );
};

export default AnalyseAnnulees;
