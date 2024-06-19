
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const rdvRoutes = require("./routes/rdv.js");
const patientRoutes = require("./routes/patient.js");
const medecinRoutes = require("./routes/medecin.js");
const authRoutes = require("./routes/authentification.js");
const serviceRoutes = require("./routes/service.js");
const responsableRoutes = require("./routes/respAnalyse.js");
const paimentRoutes = require("./routes/paiment.js");


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Admin interface !");
});


/* Routes*/
app.use("/gestion_rdvs", rdvRoutes);
app.use("/gestion_patients", patientRoutes);
app.use("/gestion_medecins", medecinRoutes);
app.use("/auth", authRoutes);
app.use("/services",serviceRoutes);
app.use("/responsables",responsableRoutes);
app.use("/paiments",paimentRoutes);


//Connection DB
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("\x1b[32m%s\x1b[0m", "database connected successfully !");
});


//listner
app.listen(process.env.PORT, () => {
  console.log(`app listning on port \x1b[33m  ${process.env.PORT} \x1b[0m`);
});
