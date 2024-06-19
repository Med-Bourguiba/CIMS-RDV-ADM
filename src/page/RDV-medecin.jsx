import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import RdvService from "../services/rdv";
import ServiceService from "../services/service";
import PatientService from "../services/patient";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { toast } from "react-toastify";

const RdvMedecin = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [todayDate, setTodayDate] = useState("");
  const [services, setServices] = useState([]);
  const [beneficiaires, setBeneficiaires] = useState([]);

  const [codMed, setCodMed] = useState("");
  const [codBenef, setCodBenef] = useState("");
  const [dateRdv, setDateRdv] = useState("");
  const [heureRdv, setHeureRdv] = useState("");
  const [etatRdv, setEtatRdv] = useState("E");
  const [userCreation, setUserCreation] = useState("");
  const [dateCreation, setDateCreation] = useState("");
  const [USER_ANNULATION, setUSER_ANNULATION] = useState("");
  const [DATE_ANNULATION, setDATE_ANNULATION] = useState("");
  const [codServ, setCodServ] = useState("");
  const [numRdv, setNumRdv] = useState("");
  const [numDossier, setNumDossier] = useState("");
  const [gsm, setGsm] = useState("");
  const [errors, setErrors] = useState({});
  const [lastNumRdv, setLastNumRdv] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().substr(0, 10);
    setTodayDate(today);

    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user.name);
    setUserCreation(user.name);
    setCodMed(user.COD_MED);

    setDateCreation(today);
    fetchRdvData();
    fetchServices();
    fetchLastNumRdv();
    fetchBeneficiaires();
  }, []);

  useEffect(() => {
    if (selectedRdv) {
      setCodMed(selectedRdv.COD_MED);
      setCodBenef(selectedRdv.COD_BENEF);
      setDateRdv(selectedRdv.DATE_RDV);
      setHeureRdv(selectedRdv.HEURE_RDV);
      setEtatRdv(selectedRdv.ETAT_RDV);
      setUserCreation(selectedRdv.USER_CREATION);
      setDateCreation(selectedRdv.DATE_CREATION);
      setUSER_ANNULATION(selectedRdv.USER_ANNULATION || "");
      setDATE_ANNULATION(selectedRdv.DATE_ANNULATION || "");
      setCodServ(selectedRdv.COD_SERV);
      setNumRdv(selectedRdv.NUM_RDV);
      setNumDossier(selectedRdv.NUM_DOSSIER);
      setGsm(selectedRdv.GSM);
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      setCodMed(user.COD_MED);
      setCodBenef("");
      setDateRdv("");
      setHeureRdv("");
      setEtatRdv("E");
      setUserCreation(user.NOM_PREN_MED);
      setDateCreation(todayDate);
      setCodServ("");
      setNumRdv((parseInt(lastNumRdv) + 1).toString());
      setNumDossier("");
      setGsm("");
    }
  }, [selectedRdv, todayDate, lastNumRdv]);

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

  const fetchServices = async () => {
    try {
      const response = await ServiceService.lister();
      setServices(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des services :", error);
    }
  };

  const fetchLastNumRdv = async () => {
    try {
      const response = await RdvService.lister();
      const rdvs = response.data;
      const lastRdv = rdvs[rdvs.length - 1];
      if (lastRdv) {
        setLastNumRdv(lastRdv.NUM_RDV);
      } else {
        setLastNumRdv(0);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du dernier numéro de RDV :", error);
    }
  };

  const fetchBeneficiaires = async () => {
    try {
      const response = await PatientService.lister();
      setBeneficiaires(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des bénéficiaires :", error);
    }
  };

  const handleOpenDialog = (rdv) => {
    setSelectedRdv(rdv);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRdv(null);
  };

  const handleSave = async () => {
    const newErrors = {};

    if (!codMed) newErrors.COD_MED = "Le code médecin est requis";
    if (!codBenef) newErrors.COD_BENEF = "Le code bénéficiaire est requis";
    if (!dateRdv) newErrors.DATE_RDV = "La date de rendez-vous est requise";
    if (!heureRdv) newErrors.HEURE_RDV = "L'heure de rendez-vous est requise";
    if (!userCreation) newErrors.USER_CREATION = "Le nom de l'utilisateur est requis";
    if (!dateCreation) newErrors.DATE_CREATION = "La date de création est requise";
    if (!codServ) newErrors.COD_SERV = "Le code service est requis";
    if (!numRdv) newErrors.NUM_RDV = "Le numéro de rendez-vous est requis";
    if (!numDossier) newErrors.NUM_DOSSIER = "Le numéro de dossier est requis";
    if (!gsm) {
      newErrors.GSM = "Le GSM est requis";
    } else if (!/^\d{8}$/.test(gsm)) {
      newErrors.GSM = "Le GSM doit contenir exactement 8 chiffres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const formData = {
        COD_MED: codMed,
        COD_BENEF: codBenef,
        DATE_RDV: dateRdv,
        HEURE_RDV: heureRdv,
        ETAT_RDV: etatRdv,
        USER_CREATION: userCreation,
        DATE_CREATION: dateCreation,
        USER_ANNULATION: USER_ANNULATION,
        DATE_ANNULATION: DATE_ANNULATION,
        COD_SERV: codServ,
        NUM_RDV: numRdv,
        NUM_DOSSIER: numDossier,
        GSM: gsm,
      };

      if (selectedRdv) {
        await RdvService.modifier(selectedRdv._id, formData);
        toast.success("Rendez-vous modifié avec succès", { position: "top-right" });
      } else {
        await RdvService.ajouter(formData);
        toast.success("Rendez-vous ajouté avec succès", { position: "top-right" });
      }

      handleCloseDialog();
      fetchRdvData();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du rendez-vous :", error);
      toast.error("Erreur lors de la sauvegarde du rendez-vous", { position: "top-right" });
    }
  };

  const handleDelete = async (rdv) => {
    try {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?");
      if (confirmation) {
        const user_annulation = user ? user.NOM_PREN_MED : "Utilisateur";
        await RdvService.supprimer(rdv._id, { user_annulation });
        setRows(rows.filter((row) => row._id !== rdv._id));
        toast.success("Rendez-vous supprimé avec succès", { position: "top-right" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous :", error);
      toast.error("Erreur lors de la suppression du rendez-vous", { position: "top-right" });
    }
  };

  const handleChangeBenef = (event) => {
    const selectedBenef = beneficiaires.find(benef => benef.COD_BENEF === event.target.value);
    setCodBenef(event.target.value);
    if (selectedBenef) {
      setNumDossier(selectedBenef.NUM_DM);
    } else {
      setNumDossier("");
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
      flex: 2,
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
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      sortable: false,
      width: 150,
      renderCell: ({ row }) => (
        <div>
          <Button onClick={() => handleOpenDialog(row)} sx={{ color: "green" }}>
            <BorderColorOutlinedIcon />
          </Button>
          <Button onClick={() => handleDelete(row)} sx={{ color: "red" }}>
            <DeleteOutlinedIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Header title={"RENDEZ-VOUS"} subTitle={"Liste des Rendez-vous"} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button variant="contained" onClick={() => handleOpenDialog(null)}>
          <AddBoxOutlinedIcon sx={{ marginRight: "5px" }} />
          Ajouter un RDV
        </Button>
      </Box>
      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedRdv ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"}</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="COD_MED"
              fullWidth
              value={codMed}
              onChange={(e) => setCodMed(e.target.value)}
              error={!!errors.COD_MED}
              helperText={errors.COD_MED}
            />
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <FormControl fullWidth error={!!errors.COD_BENEF}>
              <InputLabel id="cod-benef-label">COD_BENEF</InputLabel>
              <Select
                labelId="cod-benef-label"
                value={codBenef}
                onChange={handleChangeBenef}
              >
                {beneficiaires.map((benef) => (
                  <MenuItem key={benef.COD_BENEF} value={benef.COD_BENEF}>
                    {benef.COD_BENEF}
                  </MenuItem>
                ))}
              </Select>
              {errors.COD_BENEF && (
                <Typography color="error">{errors.COD_BENEF}</Typography>
              )}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="DATE_RDV"
              type="date"
              fullWidth
              value={dateRdv}
              onChange={(e) => setDateRdv(e.target.value)}
              error={!!errors.DATE_RDV}
              helperText={errors.DATE_RDV}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="HEURE_RDV"
              fullWidth
              value={heureRdv}
              onChange={(e) => setHeureRdv(e.target.value)}
              error={!!errors.HEURE_RDV}
              helperText={errors.HEURE_RDV}
            />
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="ETAT_RDV"
              fullWidth
              value={etatRdv}
              onChange={(e) => setEtatRdv(e.target.value)}
              error={!!errors.ETAT_RDV}
              helperText={errors.ETAT_RDV}
            />
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="USER_CREATION"
              fullWidth
              value={userCreation}
              onChange={(e) => setUserCreation(e.target.value)}
              error={!!errors.USER_CREATION}
              helperText={errors.USER_CREATION}
            />
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="DATE_CREATION"
              type="date"
              fullWidth
              value={dateCreation}
              onChange={(e) => setDateCreation(e.target.value)}
              error={!!errors.DATE_CREATION}
              helperText={errors.DATE_CREATION}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <FormControl fullWidth error={!!errors.COD_SERV}>
              <InputLabel id="cod-serv-label">COD_SERV</InputLabel>
              <Select
                labelId="cod-serv-label"
                value={codServ}
                onChange={(e) => setCodServ(e.target.value)}
              >
                {services.map((service) => (
                  <MenuItem key={service.COD_SERV} value={service.COD_SERV}>
                    {service.COD_SERV}
                  </MenuItem>
                ))}
              </Select>
              {errors.COD_SERV && <Typography color="error">{errors.COD_SERV}</Typography>}
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="NUM_RDV"
              fullWidth
              value={numRdv}
              onChange={(e) => setNumRdv(e.target.value)}
              error={!!errors.NUM_RDV}
              helperText={errors.NUM_RDV}
            />
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="NUM_DOSSIER"
              fullWidth
              value={numDossier}
              onChange={(e) => setNumDossier(e.target.value)}
              error={!!errors.NUM_DOSSIER}
              helperText={errors.NUM_DOSSIER}
            />
          </Box>
          <Box sx={{ marginBottom: "1rem", width: "100%" }}>
            <TextField
              label="GSM"
              fullWidth
              value={gsm}
              onChange={(e) => setGsm(e.target.value)}
              error={!!errors.GSM}
              helperText={errors.GSM}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {selectedRdv ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RdvMedecin;
