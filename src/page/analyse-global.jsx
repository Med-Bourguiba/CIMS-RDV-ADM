import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import Header from "../components/Header";
import RdvService from "../services/rdv";
import ResponsableAnalyseService from "../services/respAnalyse";
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const AnalyseGlobal = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    _id: "",
    NUM_ANALYSE: "",
    NUM_RDV: "",
    TYPE_ANALYSE: "",
    DESCRIPTION: "",
    DATE_ANALYSE: "",
    HEURE: "",
    PRIX: "",
    RESULTATS: "",
    MEDECIN_RESPONSABLE: ""
  });
  const [errors, setErrors] = useState({});
  const [rdvs, setRdvs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [responsables, setResponsables] = useState([]); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchAnalyseData();
    fetchRdvData();
    fetchResponsablesData(); 
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

  const fetchRdvData = async () => {
    try {
      const response = await RdvService.lister();
      setRdvs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous :", error);
    }
  };

  const fetchResponsablesData = async () => { 
    try {
      const response = await ResponsableAnalyseService.lister();
      setResponsables(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des responsables :", error);
    }
  };

  const handleOpenDialog = (row) => {
    if (row) {
      setIsEditing(true);
      setFormValues(row);
    } else {
      setIsEditing(false);
      setFormValues({
        _id: "",
        NUM_ANALYSE: "",
        NUM_RDV: "",
        TYPE_ANALYSE: "",
        DESCRIPTION: "",
        DATE_ANALYSE: "",
        HEURE: "",
        PRIX: "",
        RESULTATS: "",
        MEDECIN_RESPONSABLE: ""
      });
    }
    setErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.NUM_RDV) newErrors.NUM_RDV = "Ce champ est obligatoire";
    if (!formValues.TYPE_ANALYSE) newErrors.TYPE_ANALYSE = "Ce champ est obligatoire";
    if (!formValues.DESCRIPTION) newErrors.DESCRIPTION = "Ce champ est obligatoire";
    if (!formValues.DATE_ANALYSE) newErrors.DATE_ANALYSE = "Ce champ est obligatoire";
    if (!formValues.HEURE) newErrors.HEURE = "Ce champ est obligatoire";
    if (!formValues.PRIX) newErrors.PRIX = "Ce champ est obligatoire";
    if (!formValues.MEDECIN_RESPONSABLE) newErrors.MEDECIN_RESPONSABLE = "Ce champ est obligatoire";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      if (isEditing) {
        await editerAnalyse();
      } else {
        await ajouterAnalyse();
      }
      handleCloseDialog();
    }
  };

  const ajouterAnalyse = async () => {
    try {
      const response = await RdvService.ajouterAnalyse(formValues);
      setRows([...rows, { ...response.data, id: rows.length + 1 }]);
      toast.success("Analyse ajoutée avec succès", { position: "top-right" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'analyse :", error);
      toast.error("Erreur lors de l'ajout de l'analyse", { position: "top-right" });
    }
  };

  const editerAnalyse = async () => {
    try {
      await RdvService.editerAnalyse(formValues._id, formValues);
      setRows(rows.map(row => (row._id === formValues._id ? formValues : row)));
      toast.success("Analyse modifiée avec succès", { position: "top-right" });
    } catch (error) {
      console.error("Erreur lors de la modification de l'analyse :", error);
      toast.error("Erreur lors de la modification de l'analyse", { position: "top-right" });
    }
  };

  const handleDelete = async (analyse) => {
    try {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir annuler cette analyse ?");
      if (confirmation) {
        const user_annulation = user ? user.NOM_PRENOM : "Utilisateur";
        console.log(user_annulation);
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
      flex: 2, align: "center", headerAlign: "center",
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
          <Button onClick={() => handleOpenDialog(row)} sx={{ color: 'green' }}><BorderColorOutlinedIcon /></Button>
          <Button onClick={() => handleDelete(row)} sx={{ color: 'red' }}><DeleteOutlinedIcon /></Button>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Header title={"ANALYSES"} subTitle={"Liste des analyses"} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" onClick={() => handleOpenDialog(null)}><AddBoxOutlinedIcon sx={{ marginRight: '5px' }} />Ajouter une analyse</Button>
      </Box>
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} rowHeight={145} />
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Modifier l'analyse" : "Ajouter une analyse"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="num-rdv-label">Num RDV</InputLabel>
            <Select
              labelId="num-rdv-label"
              name="NUM_RDV"
              value={formValues.NUM_RDV}
              onChange={handleChange}
              error={!!errors.NUM_RDV}
            >
              {rdvs.map(rdv => (
                <MenuItem key={rdv.NUM_RDV} value={rdv.NUM_RDV}>{rdv.NUM_RDV}</MenuItem>
              ))}
            </Select>
            {errors.NUM_RDV && <Typography color="error">{errors.NUM_RDV}</Typography>}
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            name="TYPE_ANALYSE"
            label="Type Analyse"
            type="text"
            fullWidth
            value={formValues.TYPE_ANALYSE}
            onChange={handleChange}
            error={!!errors.TYPE_ANALYSE}
            helperText={errors.TYPE_ANALYSE}
          />
          <TextField
            margin="dense"
            name="DESCRIPTION"
            label="Description"
            type="text"
            fullWidth
            value={formValues.DESCRIPTION}
            onChange={handleChange}
            error={!!errors.DESCRIPTION}
            helperText={errors.DESCRIPTION}
          />
          <TextField
            margin="dense"
            name="DATE_ANALYSE"
            label="Date Analyse"
            type="date"
            fullWidth
            value={formValues.DATE_ANALYSE}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.DATE_ANALYSE}
            helperText={errors.DATE_ANALYSE}
          />
          <TextField
            margin="dense"
            name="HEURE"
            label="Heure"
            type="text"
            fullWidth
            value={formValues.HEURE}
            onChange={handleChange}
            error={!!errors.HEURE}
            helperText={errors.HEURE}
          />
          <TextField
            margin="dense"
            name="PRIX"
            label="Prix"
            type="number" 
            fullWidth
            value={formValues.PRIX}
            onChange={handleChange}
            error={!!errors.PRIX}
            helperText={errors.PRIX}
          />
          {isEditing && (
            <TextField
              margin="dense"
              name="RESULTATS"
              label="Résultats"
              type="text"
              fullWidth
              value={formValues.RESULTATS}
              onChange={handleChange}
              error={!!errors.RESULTATS}
              helperText={errors.RESULTATS}
            />
          )}
          <FormControl fullWidth margin="dense">
            <InputLabel id="medecin-responsable-label">Médecin Responsable</InputLabel>
            <Select
              labelId="medecin-responsable-label"
              name="MEDECIN_RESPONSABLE"
              value={formValues.MEDECIN_RESPONSABLE}
              onChange={handleChange}
              error={!!errors.MEDECIN_RESPONSABLE}
            >
              {responsables.map(responsable => (
                <MenuItem key={responsable.username} value={responsable.username}>{responsable.NOM_PRENOM}</MenuItem>
              ))}
            </Select>
            {errors.MEDECIN_RESPONSABLE && <Typography color="error">{errors.MEDECIN_RESPONSABLE}</Typography>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">{isEditing ? "Modifier" : "Ajouter"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnalyseGlobal;
