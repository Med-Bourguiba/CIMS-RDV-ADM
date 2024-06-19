const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const RespAnalyse = require('../models/respAnalyse');
const Medecin = require('../models/medecin.model');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.KEY,
        { expiresIn: '1h' }
    );
};

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    console.log(`mdp: ${password}`); 
    try {
        const admin = await Admin.findOne({ username });
        if (admin) {
            const passwordMatch = bcrypt.compareSync(password, admin.password);
            if (passwordMatch) {
                const token = generateToken(admin);
                return res.status(200).json({
                    message: "Admin authentifié avec succès",
                    token: token,
                    admin: admin
                });
            } else {
                return res.status(401).json({ message: "Mot de passe incorrect" });
            }
        } else {
            return res.status(401).json({ message: "Nom d'utilisateur incorrect" });
        }
    } catch (error) {
        console.error("Erreur lors de la recherche de l'admin:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.loginMedecin = async (req, res) => {
    const { username, password } = req.body;
    console.log(`Tentative de connexion pour le médecin: ${username}`); 
    console.log(`Mot de passe fourni: ${password}`); 

    try {
        const medecin = await Medecin.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } });
        console.log('Résultat de la recherche de médecin:', medecin);
        if (medecin) {
            console.log('Médecin trouvé dans la base de données:', medecin);
            const passwordMatch = bcrypt.compareSync(password, medecin.password);
            if (passwordMatch) {
                const token = generateToken(medecin);
                return res.status(200).json({
                    message: "Médecin authentifié avec succès",
                    token: token,
                    medecin: medecin
                });
            } else {
                return res.status(401).json({ message: "Mot de passe incorrect" });
            }
        } else {
            return res.status(401).json({ message: "Nom d'utilisateur incorrect" });
        }
    } catch (error) {
        console.error("Erreur lors de la recherche de médecin:", error);
        return res.status(500).json({ message: error.message });
    }
};



exports.loginRespAnalyse = async (req, res) => {
    const { username, password } = req.body;
    console.log(`Tentative de connexion pour le responsable analyse: ${username}`); 
    console.log(`Mot de passe fourni: ${password}`); 

    try {
        const respAnalyse = await RespAnalyse.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } });
        console.log('Résultat de la recherche de responsable analyse:', respAnalyse);
        if (respAnalyse) {
            console.log('Responsable analyse trouvé dans la base de données:', respAnalyse);
            const passwordMatch = bcrypt.compareSync(password, respAnalyse.password);
            if (passwordMatch) {
                const token = generateToken(respAnalyse);
                return res.status(200).json({
                    message: "Responsable analyse authentifié avec succès",
                    token: token,
                    respAnalyse: respAnalyse
                });
            } else {
                return res.status(401).json({ message: "Mot de passe incorrect" });
            }
        } else {
            return res.status(401).json({ message: "Nom d'utilisateur incorrect" });
        }
    } catch (error) {
        console.error("Erreur lors de la recherche du responsable analyse:", error);
        return res.status(500).json({ message: error.message });
    }
};

