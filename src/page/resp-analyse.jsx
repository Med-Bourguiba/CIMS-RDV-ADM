import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import Header from "../components/Header";
import ResponsableAnalyseService from "../services/respAnalyse";
import ServiceService from "../services/service"; 
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { toast } from 'react-toastify';

const RespAnalyse = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResp, setSelectedResp] = useState(null);
  const [services, setServices] = useState([]);
  const [specialites, setSpecialites] = useState([]); 

  const [nomPrenom, setNomPrenom] = useState("");
  const [dateNaiss, setDateNaiss] = useState("");
  const [sexe, setSexe] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codServ, setCodServ] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchResponsables();
    fetchServices();
    fetchSpecialites(); 
  }, []);

  useEffect(() => {
    if (selectedResp) {
      setNomPrenom(selectedResp.NOM_PRENOM);
      setDateNaiss(selectedResp.DATE_NAISS.split('T')[0]);
      setSexe(selectedResp.SEXE);
      setTelephone(selectedResp.TELEPHONE);
      setAdresse(selectedResp.ADRESSE);
      setCodServ(selectedResp.COD_SERV);
      setSpecialite(selectedResp.SPECIALITE);
      setUsername(selectedResp.username);
      setPassword("");
    } else {
      resetForm();
    }
  }, [selectedResp]);

  const fetchResponsables = async () => {
    try {
      const response = await ResponsableAnalyseService.lister();
      const responsables = response.data;
      const rowsWithIds = responsables.map((row, index) => ({
        ...row,
        id: index + 1,
      }));
      setRows(rowsWithIds);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await ServiceService.listerAnalyse();
      setServices(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des services :", error);
    }
  };

  const fetchSpecialites = async () => {
    try {
      const response = await ResponsableAnalyseService.listerSpecialite();
      setSpecialites(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des spécialités :", error);
    }
  };

  const handleOpenDialog = (resp) => {
    setSelectedResp(resp);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResp(null);
  };

  const resetForm = () => {
    setNomPrenom("");
    setDateNaiss("");
    setSexe("");
    setTelephone("");
    setAdresse("");
    setCodServ("");
    setSpecialite("");
    setUsername("");
    setPassword("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!nomPrenom) newErrors.NOM_PRENOM = "Le nom et prénom sont requis";
    if (!dateNaiss) newErrors.DATE_NAISS = "La date de naissance est requise";
    if (!sexe) newErrors.SEXE = "Le sexe est requis";
    if (!telephone) {
      newErrors.TELEPHONE = "Le téléphone est requis";
    } else if (!/^\d{8}$/.test(telephone)) {
      newErrors.TELEPHONE = "Le téléphone doit contenir exactement 8 chiffres";
    }
    if (!adresse) newErrors.ADRESSE = "L'adresse est requise";
    if (!codServ) newErrors.COD_SERV = "Le code service est requis";
    if (!specialite) newErrors.SPECIALITE = "La spécialité est requise";
    if (!username) newErrors.username = "Le nom d'utilisateur est requis";
    if (!password && !selectedResp) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password && password.length < 8) {
      newErrors.password = "Le mot de passe doit comporter au moins 8 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      console.log("Formulaire invalide", errors);
      return;
    }

    try {
      const formData = {
        NOM_PRENOM: nomPrenom,
        DATE_NAISS: dateNaiss,
        SEXE: sexe,
        TELEPHONE: telephone,
        ADRESSE: adresse,
        COD_SERV: codServ,
        SPECIALITE: specialite,
        username
      };

      if (!selectedResp) {
        formData.password = password;
      }

      if (selectedResp) {
        await ResponsableAnalyseService.modifier(selectedResp._id, formData);
        toast.success("Responsable modifié avec succès", { position: "top-right" });
      } else {
        await ResponsableAnalyseService.ajouter(formData);
        toast.success("Responsable ajouté avec succès", { position: "top-right" });
        resetForm();
      }

      handleCloseDialog();
      fetchResponsables();
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status === 500) {
        setErrors({ ...errors, username: "Ce nom d'utilisateur est déjà pris" });
      } else {
        console.error("Erreur lors de la sauvegarde du responsable :", error);
        toast.error("Erreur lors de la sauvegarde du responsable", { position: "top-right" });
      }
    }
  };

  const handleDelete = async (resp) => {
    try {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce responsable ?");
      if (confirmation) {
        await ResponsableAnalyseService.supprimer(resp._id);
        setRows(rows.filter(row => row._id !== resp._id));
        toast.success("Responsable supprimé avec succès", { position: "top-right" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du responsable :", error);
      toast.error("Erreur lors de la suppression du responsable", { position: "top-right" });
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 33, align: "center", headerAlign: "center" },
    { field: "COD_RESP", headerName: "Code Resp.", flex: 1, align: "center", headerAlign: "center" },
    { field: "NOM_PRENOM", headerName: "Nom Prénom", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "DATE_NAISS", headerName: "Date Naiss.", flex: 1.5, align: "center", headerAlign: "center", valueFormatter: (params) => params.value ? params.value.split('T')[0] : '',},
    { field: "SEXE", headerName: "Sexe", flex: 0.5, align: "center", headerAlign: "center" },
    { field: "TELEPHONE", headerName: "Téléphone", flex: 1, align: "center", headerAlign: "center" },
    { field: "ADRESSE", headerName: "Adresse", flex: 2, align: "center", headerAlign: "center" },
    { field: "COD_SERV", headerName: "Code Service", flex: 1, align: "center", headerAlign: "center" },
    { field: "SPECIALITE", headerName: "Spécialité", flex: 1, align: "center", headerAlign: "center" },
    { field: "username", headerName: "Nom d'utilisateur", flex: 1.5, align: "center", headerAlign: "center" },
    {
      field: "actions", headerName: "Actions", align: "center", headerAlign: "center", sortable: false, width: 150,
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
      <Header title={"Responsables d'Analyses"} subTitle={"Liste des responsables d'analyses"} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" onClick={() => handleOpenDialog(null)}><AddBoxOutlinedIcon sx={{ marginRight: '5px' }} />Ajouter un Responsable</Button>
      </Box>
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedResp ? "Modifier le responsable" : "Ajouter un responsable"}</DialogTitle>
        <DialogContent sx={{ width: '400px' }}>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField
              label="Nom Prénom"
              fullWidth
              value={nomPrenom}
              onChange={(e) => setNomPrenom(e.target.value)}
              error={!!errors.NOM_PRENOM}
              helperText={errors.NOM_PRENOM}
            />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField
              label="Date Naissance"
              type="date"
              fullWidth
              value={dateNaiss}
              onChange={(e) => setDateNaiss(e.target.value)}
              error={!!errors.DATE_NAISS}
              helperText={errors.DATE_NAISS}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!errors.SEXE}>
              <InputLabel id="sexe-label">Sexe</InputLabel>
              <Select
                labelId="sexe-label"
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
              >
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </Select>
              {errors.SEXE && <Box color="red" mt={1}>{errors.SEXE}</Box>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField
              label="Téléphone"
              fullWidth
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              error={!!errors.TELEPHONE}
              helperText={errors.TELEPHONE}
            />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField
              label="Adresse"
              fullWidth
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              error={!!errors.ADRESSE}
              helperText={errors.ADRESSE}
            />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!errors.COD_SERV}>
              <InputLabel id="cod-serv-label">Code Service</InputLabel>
              <Select
                labelId="cod-serv-label"
                value={codServ}
                onChange={(e) => setCodServ(e.target.value)}
              >
                {services.map(service => (
                  <MenuItem key={service.COD_SERV} value={service.COD_SERV}>
                    {service.COD_SERV}
                  </MenuItem>
                ))}
              </Select>
              {errors.COD_SERV && <Box color="red" mt={1}>{errors.COD_SERV}</Box>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!errors.SPECIALITE}>
              <InputLabel id="specialite-label">Spécialité</InputLabel>
              <Select
                labelId="specialite-label"
                value={specialite}
                onChange={(e) => setSpecialite(e.target.value)}
              >
                {specialites.map(spec => (
                  <MenuItem key={spec.COD_SPEC} value={spec.LIB_SPEC}>
                    {spec.LIB_SPEC}
                  </MenuItem>
                ))}
              </Select>
              {errors.SPECIALITE && <Box color="red" mt={1}>{errors.SPECIALITE}</Box>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField
              label="Nom d'utilisateur"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
            />
            {errors.username && <Typography color="error">{errors.username}</Typography>}
          </Box>
          {!selectedResp && (
            <Box sx={{ marginBottom: '1rem', width: '100%' }}>
              <TextField
                label="Mot de passe"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">{selectedResp ? "Modifier" : "Ajouter"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RespAnalyse;
