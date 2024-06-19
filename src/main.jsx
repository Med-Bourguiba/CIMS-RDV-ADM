import React from 'react';
import { ToastContainer } from 'react-toastify'; 
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from 'react-dom/client';
import "./index.css";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import App from './App';
import AppMedecin from './App-medecin';
import AppRespAnalyses from './App-medecin-analyses';
import Dashboard from './page/dashboard/Dashboard';
import Rdv from './page/rendez-vous/Rdv';
import RdvMedecin from './page/RDV-medecin';
import RespAnalyse from './page/resp-analyse';
import Patients from './page/patients/Patient';
import Medecins from './page/medecins/medecin'; 
import BarChart from './page/barChart/BarChart';
import PieChart from './page/pieChart/PieChart';
import LineChart from './page/lineChart/LineChart';
import NotFound from './page/notFound/NotFound';
import AuthPage from './page/authPage';
import PrivateRoute from './PrivateRoute';
import Analyse from './page/analyse';
import AnalyseGlobal from './page/analyse-global'
import AnalyseAnnulees from './page/analyses-annulées';
import Paiment from './page/paiment';
import AnalyseAdmin from './page/liste_analyse_admin';
import RDVAnnules from './page/rdv_annulés';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<AuthPage />} />

    <Route element={<PrivateRoute />}>

      <Route path="/dashboard" element={<App />}>
        <Route index element={<Dashboard />} />
        <Route path="rendez-vous" element={<Rdv />} />
        <Route path="analyses" element={<AnalyseAdmin />} />
        <Route path="patients" element={<Patients />} />
        <Route path="medecins" element={<Medecins />} />
        <Route path="RDV-annulés" element={<RDVAnnules />} />
        <Route path="analyse-annulées" element={<AnalyseAnnulees />} />
        <Route path="paiments" element={<Paiment />} />
        <Route path="resp_analyses" element={<RespAnalyse />} />
        <Route path="bar" element={<BarChart />} />
        <Route path="pie" element={<PieChart />} />
        <Route path="line" element={<LineChart />} />
        <Route path="*" element={<NotFound />} />
      </Route>


      <Route path="/dashboard-medecin" element={<AppMedecin />}>
        <Route index element={<RdvMedecin />} />
        <Route path="rendez-vous" element={<RdvMedecin />} />
        <Route path="RDV-annulés" element={<RDVAnnules />} />
        <Route path="analyses" element={<Analyse />} />
        <Route path="*" element={<NotFound />} />
      </Route>


      <Route path="/dashboard-resp-analyses" element={<AppRespAnalyses />}>
        <Route index element={<AnalyseGlobal />} /> 
        <Route path="analyses" element={<AnalyseGlobal />} /> 
        <Route path="analyses-annulées" element={<AnalyseAnnulees />} /> 
        <Route path="*" element={<NotFound />} />
      </Route>

    </Route>
  </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);
