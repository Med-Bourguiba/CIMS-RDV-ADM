import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdLogIn } from "react-icons/io";
import authService from '../services/authentification'; 
import Swal from 'sweetalert2';
import './AuthPage.css';

function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); 
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const userData = {
            username,
            password
        };

        try {
            if (role === 'medecin') {
                const response = await authService.loginMedecin(userData);
                if (response.status === 200) {
                    const { token, medecin } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(medecin));
                    navigate('/dashboard-medecin');
                    console.log("Médecin authentifié avec succès");
                }
            } else if (role === 'respAnalyse') {
                const response = await authService.loginRespAnalyse(userData);
                if (response.status === 200) {
                    const { token, respAnalyse } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(respAnalyse));
                    navigate('/dashboard-resp-analyses'); 
                    console.log("Responsable analyse authentifié avec succès");
                }
            } else {
                const response = await authService.loginAdmin(userData);
                if (response.status === 200) {
                    const { token, admin } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(admin));
                    navigate('/dashboard'); 
                    console.log("Admin authentifié avec succès");
                }
            }
        } catch (error) {
            if (error.response) {
                console.error("Erreur d'authentification: ", error.response.data);
                Swal.fire({
                    position: 'top',
                    title: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    width: '350px',
                    customClass: {
                        popup: 'small-alert-popup' 
                    }});
                
            } else {
                console.error("Erreur réseau ou de serveur", error.message);
                Swal.fire({
                    position: 'top',
                    title: error.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    width: '350px',
                    customClass: {
                        popup: 'small-alert-popup' 
                    }});
            }
        }
    };

    return (
        <div className='auth-background'>
            <div className="auth-container">
            <form onSubmit={handleLogin}>
                <label>
                    Nom d'utilisateur :
                    <input type="text" placeholder='entrer votre nom d’utilisateur' value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Mot de passe :
                    <input type="password" placeholder='entrer votre mot de passe ici ' value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <div style={{margin:"10px", marginBottom:"15px"}} className="radio-container">
                    <input
                        id="adminRadio"
                        type="radio"
                        value="admin"
                        checked={role === 'admin'}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    <label htmlFor="adminRadio">Connecté en tant qu'administrateur</label><br/><br/>
                    <input
                        id="medecinRadio"
                        type="radio"
                        value="medecin"
                        checked={role === 'medecin'}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    <label htmlFor="medecinRadio">Connecté en tant que médecin</label><br/><br/>
                    <input
                        id="respAnalyseRadio"
                        type="radio"
                        value="respAnalyse"
                        checked={role === 'respAnalyse'}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    <label htmlFor="respAnalyseRadio">Connecté en tant que responsable analyses</label>
                </div>
                <button style={{display: 'flex',alignItems:'center', justifyContent:'center', gap:'5px', fontSize:'15px'}} type="submit"><IoMdLogIn size={18}/> Se connecter</button>
            </form>
        </div>
        </div>
    );
}

export default AuthPage;
