import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import Header from "../../components/Header";
import PatientService from "../../services/patient";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { toast } from 'react-toastify';

const Patients = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [todayDate, setTodayDate] = useState("");
  const [delegations, setDelegations] = useState([]);
  const [debiteurs, setDebiteurs] = useState([]);

  const [codBenef, setCodBenef] = useState("");
  const [nomPrenom, setNomPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [sexe, setSexe] = useState("");
  const [codEtatCivil, setCodEtatCivil] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codDelegation, setCodDelegation] = useState("");
  const [dateCreation, setDateCreation] = useState("");
  const [numeroDM, setNumeroDM] = useState("");
  const [codDebit, setCodDebit] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const today = new Date().toISOString().substr(0, 10);
    setTodayDate(today);
    setDateCreation(today);
    fetchPatientData();
    fetchDelegations();
    fetchDebiteurs();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setCodBenef(selectedPatient.COD_BENEF);
      setNomPrenom(selectedPatient.NOM_PREN_BENEF);
      setDateNaissance(selectedPatient.DATE_NAI_BENEF.split('T')[0]);
      setSexe(selectedPatient.SEXE_BENEF);
      setCodEtatCivil(selectedPatient.COD_ETAT_CIV);
      setAdresse(selectedPatient.ADR_BENEF);
      setCodDelegation(selectedPatient.COD_DELEG);
      setDateCreation(selectedPatient.DATE_CREATION);
      setNumeroDM(selectedPatient.NUM_DM);
      setCodDebit(selectedPatient.COD_DEBIT);
    } else {
      resetForm();
      setNextCodBenef();
    }
  }, [selectedPatient, todayDate]);

  const fetchPatientData = async () => {
    try {
      const response = await PatientService.lister();
      const patients = response.data;

      const rowsWithIds = patients.map((patient, index) => ({
        ...patient,
        id: index + 1, 
      }));

      setRows(rowsWithIds);
    } catch (error) {
      console.error("Erreur lors de la récupération des données des patients :", error);
    }
  };

  const fetchDelegations = async () => {
    try {
      const response = await PatientService.listerDelegation();
      setDelegations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des délégations :", error);
    }
  };

  const fetchDebiteurs = async () => {
    try {
      const response = await PatientService.listerDebiteur();
      setDebiteurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des débiteurs :", error);
    }
  };

  const resetForm = () => {
    setCodBenef("");
    setNomPrenom("");
    setDateNaissance("");
    setSexe("");
    setCodEtatCivil("");
    setAdresse("");
    setCodDelegation("");
    setDateCreation(todayDate);
    setNumeroDM("");
    setCodDebit("");
    setFieldErrors({});
  };

  const setNextCodBenef = async () => {
    try {
      const response = await PatientService.lister();
      const patients = response.data;
      if (patients.length > 0) {
        const lastCodBenef = patients
          .map(p => p.COD_BENEF)
          .filter(code => code.startsWith('P')) 
          .map(code => parseInt(code.replace('P', ''), 10)); 
  
        const maxCodBenef = Math.max(...lastCodBenef);
        const nextCodBenef = `P${String(maxCodBenef + 1).padStart(3, '0')}`; 
        setCodBenef(nextCodBenef);
      } else {
        setCodBenef("P001");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du dernier code patient :", error);
    }
  };

  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient);
    if (!patient) {
      setNextCodBenef();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!codBenef) errors.codBenef = "Champ obligatoire";
    if (!nomPrenom) errors.nomPrenom = "Champ obligatoire";
    if (!dateNaissance) errors.dateNaissance = "Champ obligatoire";
    if (!sexe) errors.sexe = "Champ obligatoire";
    if (!codEtatCivil) errors.codEtatCivil = "Champ obligatoire";
    if (!adresse) errors.adresse = "Champ obligatoire";
    if (!codDelegation) errors.codDelegation = "Champ obligatoire";
    if (!numeroDM) errors.numeroDM = "Champ obligatoire";
    if (!codDebit) errors.codDebit = "Champ obligatoire";

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
        COD_BENEF: codBenef,
        NOM_PREN_BENEF: nomPrenom,
        DATE_NAI_BENEF: dateNaissance,
        SEXE_BENEF: sexe,
        COD_ETAT_CIV: codEtatCivil,
        ADR_BENEF: adresse,
        COD_DELEG: codDelegation,
        DATE_CREATION: dateCreation,
        NUM_DM: numeroDM,
        COD_DEBIT: codDebit
      };
      
      if (selectedPatient) {
        await PatientService.modifier(selectedPatient._id, formData);
        toast.success("Patient modifié avec succès", { position: "top-right" });
      } else {
        await PatientService.ajouter(formData);
        toast.success("Patient ajouté avec succès", { position: "top-right" });
        resetForm();
      }
      handleCloseDialog();
      fetchPatientData();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du patient :", error);
      toast.error("Erreur lors de la sauvegarde du patient", { position: "top-right" });
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 33 },
    { field: "COD_BENEF", headerName: "Code Bénéficiaire", flex: 1.5, align: "center", headerAlign: "center"},
    { field: "NOM_PREN_BENEF", headerName: "Nom Prénom", flex: 1.5, align: "center", headerAlign: "center"},
    { field: "DATE_NAI_BENEF", headerName: "Date de Naissance", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "SEXE_BENEF", headerName: "Sexe", flex: 0.5, align: "center", headerAlign: "center" },
    { field: "COD_ETAT_CIV", headerName: "Code État Civil", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "ADR_BENEF", headerName: "Adresse", flex: 1, align: "center", headerAlign: "center" },
    { field: "COD_DELEG", headerName: "Code Délégation", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "DATE_CREATION", headerName: "Date Création", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "NUM_DM", headerName: "Numéro DM", flex: 1.5, align: "center", headerAlign: "center" },
    { field: "COD_DEBIT", headerName: "Code Débiteur", flex: 1.5, align: "center", headerAlign: "center" },
    {
      field: "actions", headerName: "Actions", align: "center", headerAlign: "center",
      sortable: false,
      width: 150,
      renderCell: ({ row }) => (
        <div>
          <Button onClick={() => handleOpenDialog(row)} sx={{ color: 'green' }}><BorderColorOutlinedIcon/></Button>
          <Button onClick={() => handleDelete(row)} sx={{ color: 'red' }}><DeleteOutlinedIcon/></Button>
        </div>
      ),
    },
  ];

  const handleDelete = async (patient) => {
    try {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?");
      if (confirmation) {
        await PatientService.supprimer(patient._id);
        setRows(rows.filter(row => row._id !== patient._id));
        toast.success("Patient supprimé avec succès", { position: "top-right" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du patient :", error);
      toast.error("Erreur lors de la suppression du patient", { position: "top-right" });
    }
  };

  return (
    <Box>
      <Header title="PATIENTS" subTitle="Liste des patients" />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" onClick={() => handleOpenDialog(null)} ><AddBoxOutlinedIcon sx={{ marginRight: '5px' }}/>Ajouter un patient</Button>
      </Box>
      <Box sx={{ height: 600, mx: "auto" }}>
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
        <DialogTitle>{selectedPatient ? "Modifier le patient" : "Ajouter un patient"}</DialogTitle>
        <DialogContent sx={{ width: '400px' }}>
          {/* Contenu de la modalité pour ajouter ou modifier un patient */}
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Code patient" fullWidth value={codBenef} onChange={(e) => setCodBenef(e.target.value)} error={!!fieldErrors.codBenef} helperText={fieldErrors.codBenef} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Nom et prénom" fullWidth value={nomPrenom} onChange={(e) => setNomPrenom(e.target.value)} error={!!fieldErrors.nomPrenom} helperText={fieldErrors.nomPrenom} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Date de naissance" type="date" fullWidth value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} error={!!fieldErrors.dateNaissance} helperText={fieldErrors.dateNaissance} InputLabelProps={{ shrink: true }} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!fieldErrors.sexe}>
              <InputLabel id="sexe-label">Sexe</InputLabel>
              <Select labelId="sexe-label" value={sexe} onChange={(e) => setSexe(e.target.value)}>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </Select>
              {fieldErrors.sexe && <Typography color="error">{fieldErrors.sexe}</Typography>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!fieldErrors.codEtatCivil}>
              <InputLabel id="etat-civil-label">Code état civil</InputLabel>
              <Select labelId="etat-civil-label" value={codEtatCivil} onChange={(e) => setCodEtatCivil(e.target.value)}>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="C">C</MenuItem>
              </Select>
              {fieldErrors.codEtatCivil && <Typography color="error">{fieldErrors.codEtatCivil}</Typography>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Adresse" fullWidth value={adresse} onChange={(e) => setAdresse(e.target.value)} error={!!fieldErrors.adresse} helperText={fieldErrors.adresse} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!fieldErrors.codDelegation}>
              <InputLabel id="delegation-label">Code délégation</InputLabel>
              <Select labelId="delegation-label" value={codDelegation} onChange={(e) => setCodDelegation(e.target.value)}>
                {delegations.map(delegation => (
                  <MenuItem key={delegation.COD_DELEG} value={delegation.COD_DELEG}>
                    {delegation.COD_DELEG}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.codDelegation && <Typography color="error">{fieldErrors.codDelegation}</Typography>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Date de création" type="date" fullWidth value={dateCreation} onChange={(e) => setDateCreation(e.target.value)} error={!!fieldErrors.dateCreation} helperText={fieldErrors.dateCreation} InputLabelProps={{ shrink: true }} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <TextField label="Numéro DM" fullWidth value={numeroDM} onChange={(e) => setNumeroDM(e.target.value)} error={!!fieldErrors.numeroDM} helperText={fieldErrors.numeroDM} />
          </Box>
          <Box sx={{ marginBottom: '1rem', width: '100%' }}>
            <FormControl fullWidth error={!!fieldErrors.codDebit}>
              <InputLabel id="debiteur-label">Code débiteur</InputLabel>
              <Select labelId="debiteur-label" value={codDebit} onChange={(e) => setCodDebit(e.target.value)}>
                {debiteurs.map(debiteur => (
                  <MenuItem key={debiteur.COD_DEBIT} value={debiteur.COD_DEBIT}>
                    {debiteur.COD_DEBIT}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.codDebit && <Typography color="error">{fieldErrors.codDebit}</Typography>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">{selectedPatient ? "Modifier" : "Ajouter"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Patients;
