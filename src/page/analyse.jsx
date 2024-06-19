import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Header from "../components/Header";
import RdvService from "../services/rdv";
import { toast } from 'react-toastify';
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { format } from 'date-fns';

const Analyse = () => {
  const theme = useTheme();
 
const [rows, setRows] = useState([]);


useEffect(() => {

  fetchAnalyseData();
}, []);



const fetchAnalyseData = async () => {
  try {
    const response = await RdvService.getAnalyses();
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

const handleValide = async (analyse) => {
    try {
      const updatedAnalyse = { ...analyse, VALIDEE: true };
      await RdvService.modifierAnalyse(analyse._id, updatedAnalyse);
      toast.success("Analyse validée avec succès");
      fetchAnalyseData(); // Met à jour les données après la validation
    } catch (error) {
      console.error("Erreur lors de la validation de l'analyse :", error);
      toast.error("Erreur lors de la validation de l'analyse");
    }
  };


  // field ==> Reqird
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
    { field: "TYPE_ANALYSE", headerName: "TYPE ANALYSE", flex: 2,align: "center", headerAlign: "center",
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
        {params.value}
      </div>
    ),},
    {
        field: "DESCRIPTION",
        headerName: "DESCRIPTION",
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
        field: "DATE_ANALYSE",
        headerName: "DATE ANALYSE",
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
      field: "RESULTATS",
      headerName: "RESULTATS",
      flex: 2,align: "center", headerAlign: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>),
    },
    {
      field: "MEDECIN_RESPONSABLE",
      headerName: "MEDECIN RESPONSABLE",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      sortable: false,
      width: 195,
      renderCell: ({ row }) => (
        <div>
        {row.VALIDEE ? (
          <Button 
            sx={{ 
              backgroundColor: 'green', 
              color: 'white',
              cursor: 'default',
              pointerEvents: 'none', 
              '&:hover': {
                backgroundColor: 'green',
              }
            }}
          >
            <TaskAltOutlinedIcon sx={{ color: 'white' }} /> Validé
          </Button>
        ) : (
          <Button onClick={() => handleValide(row)} sx={{ backgroundColor: 'blue', color: 'white','&:hover': {backgroundColor: '#0077CC',}, }}>
            <LibraryAddCheckOutlinedIcon sx={{ color: 'white' }} /> Valider l'analyse
          </Button>
        )}
      </div>
      ),
    },
  ];

  

  
  return (
    <Box>

      <Header title={"ANALYSES"} subTitle={"Liste des analyses"} />
      
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} rowHeight={120}/>
      </Box>
    </Box>
  );
};

export default Analyse;