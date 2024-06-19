import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import Header from "../../components/Header";
import MedecinService from "../../services/medecin";
import ResponsableAnalyseService from "../../services/respAnalyse"; 
import ServiceService from "../../services/service"; 
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { toast } from 'react-toastify';

const Medecins = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMedecin, setSelectedMedecin] = useState(null);

  const [codMed, setCodMed] = useState("");
  const [nomPrenomMed, setNomPrenomMed] = useState("");
  const [dateNaissanceMed, setDateNaissanceMed] = useState("");
  const [sexeMed, setSexeMed] = useState("");
  const [codSpecialiteMed, setCodSpecialiteMed] = useState("");
  const [codGradeMed, setCodGradeMed] = useState("");
  const [codServiceMed, setCodServiceMed] = useState("");
  const [adresseMed, setAdresseMed] = useState("");
  const [tel1Med, setTel1Med] = useState("");
  const [tel2Med, setTel2Med] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [specialites, setSpecialites] = useState([]);
  const [grades, setGrades] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchMedecinData();
    fetchSpecialites();
    fetchGrades();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedMedecin) {
      setCodMed(selectedMedecin.COD_MED);
      setNomPrenomMed(selectedMedecin.NOM_PREN_MED);
      setDateNaissanceMed(selectedMedecin.DATE_NAISS_MED.split('T')[0]);
      setSexeMed(selectedMedecin.SEXE_MED);
      setCodSpecialiteMed(selectedMedecin.COD_SPEC);
      setCodGradeMed(selectedMedecin.COD_GRADE);
      setCodServiceMed(selectedMedecin.COD_SERV);
      setAdresseMed(selectedMedecin.ADR_MED);
      setTel1Med(selectedMedecin.TEL1_MED);
      setTel2Med(selectedMedecin.TEL2_MED);
      setUsername(selectedMedecin.username);
      setPassword("");
    } else {
      resetForm();
    }
  }, [selectedMedecin]);

  const fetchMedecinData = async () => {
    try {
      const response = await MedecinService.lister();
      const medecins = response.data;
      const rowsWithIds = medecins.map((medecin, index) => ({
        ...medecin,
        id: index + 1, 
      }));
      setRows(rowsWithIds);

      // Fill the codMed with the last code + 1
      if (medecins.length > 0) {
        const lastCodMed = medecins[medecins.length - 1].COD_MED;
        const newCodMed = `M${String(Number(lastCodMed.slice(1)) + 1).padStart(3, '0')}`;
        setCodMed(newCodMed);
      } else {
        setCodMed("M001");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données des medecins :", error);
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

  const fetchGrades = async () => {
    try {
      const response = await MedecinService.listerGrade();
      setGrades(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des grades :", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await ServiceService.lister();
      setServices(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des services :", error);
    }
  };

  const resetForm = () => {
    setNomPrenomMed("");
    setDateNaissanceMed("");
    setSexeMed("");
    setCodSpecialiteMed("");
    setCodGradeMed("");
    setCodServiceMed("");
    setAdresseMed("");
    setTel1Med("");
    setTel2Med("");
    setUsername("");
    setPassword("");
    setUsernameError("");
    setFieldErrors({});
    fetchMedecinData();
  };

  const handleOpenDialog = (medecin) => {
    setSelectedMedecin(medecin);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMedecin(null);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    if (!codMed) errors.codMed = "Champ obligatoire";
    if (!nomPrenomMed) errors.nomPrenomMed = "Champ obligatoire";
    if (!dateNaissanceMed) errors.dateNaissanceMed = "Champ obligatoire";
    if (!sexeMed) errors.sexeMed = "Champ obligatoire";
    if (!codSpecialiteMed) errors.codSpecialiteMed = "Champ obligatoire";
    if (!codGradeMed) errors.codGradeMed = "Champ obligatoire";
    if (!codServiceMed) errors.codServiceMed = "Champ obligatoire";
    if (!adresseMed) errors.adresseMed = "Champ obligatoire";
    if (!tel1Med) {
      errors.tel1Med = "Champ obligatoire";
    } else if (!/^\d{8}$/.test(tel1Med)) {
      errors.tel1Med = "Le téléphone doit contenir exactement 8 chiffres";
    }
    if (!username) errors.username = "Champ obligatoire";
    if (!password && !selectedMedecin) {
      errors.password = "Champ obligatoire";
    } else if (password && password.length < 8) {
      errors.password = "Le mot de passe doit comporter au moins 8 caractères";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      console.log("Formulaire invalide", fieldErrors);
      return;
    }

    try {
      const formData = {
        COD_MED: codMed,
        NOM_PREN_MED: nomPrenomMed,
        DATE_NAISS_MED: dateNaissanceMed,
        SEXE_MED: sexeMed,
        COD_SPEC: codSpecialiteMed,
        COD_GRADE: codGradeMed,
        COD_SERV: codServiceMed,
        ADR_MED: adresseMed,
        TEL1_MED: tel1Med,
        TEL2_MED: tel2Med,
        username,
      };

      if (!selectedMedecin) {
        formData.password = password;
      }

      console.log("Données envoyées :", formData);

      if (selectedMedecin) {
        await MedecinService.modifier(selectedMedecin._id, formData);
        toast.success("Médecin modifié avec succès", { position: "top-right" });
      } else {
        await MedecinService.ajouter(formData);
        toast.success("Médecin ajouté avec succès", { position: "top-right" });
      }
      handleCloseDialog();
      fetchMedecinData();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error === "Nom d'utilisateur déjà utilisé") {
        setUsernameError("Nom d'utilisateur déjà utilisé");
      } else {
        console.error("Erreur lors de la sauvegarde du médecin :", error);
        toast.error("Erreur lors de la sauvegarde du médecin", { position: "top-right" });
      }
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 33 },
    { field: "COD_MED", headerName: "Code Médecin", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "NOM_PREN_MED", headerName: "Nom Prénom", flex: 2, align: "center", headerAlign: "center" },
    { field: "DATE_NAISS_MED", headerName: "Date de Naissance", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "SEXE_MED", headerName: "Sexe", flex: 0.5, align: "center", headerAlign: "center" },
    { field: "COD_SPEC", headerName: "Code Spécialité", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "COD_GRADE", headerName: "Code Grade", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "COD_SERV", headerName: "Code Service", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "ADR_MED", headerName: "Adresse", flex: 1, align: "center", headerAlign: "center" },
    { field: "TEL1_MED", headerName: "Téléphone 1", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "TEL2_MED", headerName: "Téléphone 2", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "username", headerName: "Nom d'utilisateur", flex: 2, align: "center", headerAlign: "center" },
    {
      field: "actions", headerName: "Actions", align: "center", headerAlign: "center",
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

  const handleDelete = async (medecin) => {
    try {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?");
      if (confirmation) {
        await MedecinService.supprimer(medecin._id);
        setRows(rows.filter(row => row._id !== medecin._id));
        toast.success("Médecin supprimé avec succès", { position: "top-right" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du médecin :", error);
      toast.error("Erreur lors de la suppression du médecin", { position: "top-right" });
    }
  };

  return (
    <Box>
      <Header title="MEDECINS" subTitle="Liste des medecins" />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" onClick={() => handleOpenDialog(null)} ><AddBoxOutlinedIcon sx={{ marginRight: '5px' }} />Ajouter un medecin</Button>
      </Box>

      <Box sx={{ height: 650, mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows}
          // @ts-ignore
          columns={columns}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedMedecin ? "Modifier le médecin" : "Ajouter un médecin"}</DialogTitle>
        <DialogContent sx={{ width: '400px' }}>
          {/* Contenu de la modalité pour ajouter ou modifier un médecin */}
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Code médecin" fullWidth value={codMed} onChange={(e) => setCodMed(e.target.value)} error={!!fieldErrors.codMed} helperText={fieldErrors.codMed} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Nom et prénom" fullWidth value={nomPrenomMed} onChange={(e) => setNomPrenomMed(e.target.value)} error={!!fieldErrors.nomPrenomMed} helperText={fieldErrors.nomPrenomMed} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Date de naissance" type="date" fullWidth value={dateNaissanceMed} onChange={(e) => setDateNaissanceMed(e.target.value)} error={!!fieldErrors.dateNaissanceMed} helperText={fieldErrors.dateNaissanceMed} InputLabelProps={{ shrink: true }} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!fieldErrors.sexeMed}>
              <InputLabel id="sexe-label">Sexe</InputLabel>
              <Select labelId="sexe-label" value={sexeMed} onChange={(e) => setSexeMed(e.target.value)}>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </Select>
              {fieldErrors.sexeMed && <Typography color="error">{fieldErrors.sexeMed}</Typography>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!fieldErrors.codSpecialiteMed}>
              <InputLabel id="specialite-label">Code spécialité</InputLabel>
              <Select labelId="specialite-label" value={codSpecialiteMed} onChange={(e) => setCodSpecialiteMed(e.target.value)}>
                {specialites.map((spec) => (
                  <MenuItem key={spec.COD_SPEC} value={spec.COD_SPEC}>
                    {spec.COD_SPEC}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.codSpecialiteMed && <Typography color="error">{fieldErrors.codSpecialiteMed}</Typography>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!fieldErrors.codGradeMed}>
              <InputLabel id="grade-label">Code grade</InputLabel>
              <Select labelId="grade-label" value={codGradeMed} onChange={(e) => setCodGradeMed(e.target.value)}>
                {grades.map((grade) => (
                  <MenuItem key={grade.COD_GRADE} value={grade.COD_GRADE}>
                    {grade.COD_GRADE}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.codGradeMed && <Typography color="error">{fieldErrors.codGradeMed}</Typography>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!fieldErrors.codServiceMed}>
              <InputLabel id="service-label">Code service</InputLabel>
              <Select labelId="service-label" value={codServiceMed} onChange={(e) => setCodServiceMed(e.target.value)}>
                {services.map((service) => (
                  <MenuItem key={service.COD_SERV} value={service.COD_SERV}>
                    {service.DES_SERV}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.codServiceMed && <Typography color="error">{fieldErrors.codServiceMed}</Typography>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Adresse" fullWidth value={adresseMed} onChange={(e) => setAdresseMed(e.target.value)} error={!!fieldErrors.adresseMed} helperText={fieldErrors.adresseMed} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Téléphone 1" fullWidth value={tel1Med} onChange={(e) => setTel1Med(e.target.value)} error={!!fieldErrors.tel1Med} helperText={fieldErrors.tel1Med} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Téléphone 2" fullWidth value={tel2Med} onChange={(e) => setTel2Med(e.target.value)} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Nom d'utilisateur" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} error={!!usernameError || !!fieldErrors.username} helperText={usernameError || fieldErrors.username} />
            {usernameError && <Typography color="error">{usernameError}</Typography>}
          </Box>
          {!selectedMedecin && (
            <Box sx={{ marginBottom: '1rem', width: '100%' }}>
              <TextField label="Mot de passe" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} error={!!fieldErrors.password} helperText={fieldErrors.password} />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">{selectedMedecin ? "Modifier" : "Ajouter"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Medecins;
