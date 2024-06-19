import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box, Button } from "@mui/material";
import Header from "../../components/Header";
import RdvService from "../../services/rdv";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { toast } from 'react-toastify';

const Rdv = () => {
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
    fetchRdvData();
  }, []);

  const fetchRdvData = async () => {
    try {
      const response = await RdvService.lister();
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

  const handleDelete = async (rdv) => {
    try {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?");
      if (confirmation) {
        const user_annulation = "Administrateur";
        await RdvService.supprimer(rdv._id, { user_annulation });
        setRows(rows.filter(row => row._id !== rdv._id));
        toast.success("Rendez-vous supprimé avec succès", { position: "top-right" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous :", error);
      toast.error("Erreur lors de la suppression du rendez-vous", { position: "top-right" });
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
    { field: "DATE_RDV", headerName: "DATE RDV", align: "center", headerAlign: "center" },
    {
      field: "HEURE_RDV",
      headerName: "HEURE RDV",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ETAT_RDV",
      headerName: "ETAT RDV",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "USER_CREATION",
      headerName: "USER CREATION",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "DATE_CREATION",
      headerName: "DATE CREATION",
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
    },{
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      sortable: false,
      width: 150,
      renderCell: ({ row }) => (
        <div>
          <Button onClick={() => handleDelete(row)} sx={{ color: 'red' }}><DeleteOutlinedIcon/> Annuler</Button>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Header title={"RENDEZ-VOUS"} subTitle={"Liste des Rendez-vous"} />
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Rdv;
