import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box, Button } from "@mui/material";
import Header from "../components/Header";
import RdvService from "../services/rdv";
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const AnalyseAdmin = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  const handleDelete = async (analyse) => {
    try {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir annuler cette analyse ?");
      if (confirmation) {
        const user_annulation = user ? user.name : "Utilisateur";
        await RdvService.supprimerAnalyse(analyse._id, { user_annulation });
        setRows(rows.filter(row => row._id !== analyse._id));
        toast.success("Analyse annulée avec succès", { position: "top-right" });
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'analyse :", error);
      toast.error("Erreur lors de l'annulation de l'analyse", { position: "top-right" });
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
    { field: "TYPE_ANALYSE", headerName: "TYPE ANALYSE", flex: 2, align: "center", headerAlign: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ), },
    {
      field: "DESCRIPTION",
      headerName: "DESCRIPTION",
      flex: 4,
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
      field: "HEURE",
      headerName: "HEURE",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "PRIX",
      headerName: "PRIX",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "RESULTATS",
      headerName: "RESULTATS",
      flex: 3, align: "center", headerAlign: "center",
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
      field: "VALIDEE",
      headerName: "Validation",
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
      width: 150,
      renderCell: ({ row }) => (
        <div>
          <Button onClick={() => handleDelete(row)} sx={{ color: 'red' }}><DeleteOutlinedIcon />Annuler</Button>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Header title={"ANALYSES"} subTitle={"Liste des analyses"} />
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} rowHeight={180} />
      </Box>
    </Box>
  );
};

export default AnalyseAdmin;
