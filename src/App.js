import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './screens/Login/Login';
import SamplingData from './screens/User/SamplingData/SamplingData';
import Level1 from './screens/User/Level1/Level1/Level1';
import H2S from './screens/User/Level1/H2S/H2S';
import SanitaryInpection from './screens/User/Level1/SanitaryInpection/SanitaryInpection';
import DataResults from './screens/User/Level1/AnalysisResults/AnalysisResults';
import Home from './screens/User/Home/Home';
import Profile from './screens/User/Profile/Profile';
import VideoScreen from './screens/User/Video/Video';
import UserRegistration from './screens/Registration/Registration';
import Municipality from './screens/Municipality/Municipality/Municipality';
import Survay_Report from './screens/Municipality/Survay_Report/Survay_Report';
import Logs from './screens/User/Level1/Logs/Logs';
import H2S_Report from './screens/Municipality/H2S_Report/H2S_Report';
import Report from './screens/Municipality/Report/Report';
import H2S_Logs_Report from './screens/User/Logs/H2S_Logs_Reports/H2S_Logs_Reports';
import Sanitary_Survay_Logs_Report from './screens/User/Logs/Sanitary_Survay_Logs_Reports/Sanitary_Survay_Logs_Reports';
import Qmra_results from './screens/Level2/qmra/qmra_results';

import './App.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/Login' element={<Login />} />
        <Route exact path='/sampling_data' element={<SamplingData />} />
        <Route exact path='/h2s_testing' element={<H2S />} />
        <Route exact path='/level1' element={<Level1 />} />
        <Route exact path='/sanitaryInpection' element={<SanitaryInpection />} />
        <Route exact path='/data_results' element={<DataResults />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path='/profile' element={<Profile />} />
        <Route exact path='/video' element={<VideoScreen />} />
        <Route exact path='/user_Registration' element={<UserRegistration />} />
        <Route exact path='/municipality' element={<Municipality />} />
        <Route exact path='/sanitary_report' element={<Survay_Report />} />
        <Route exact path='/logs' element={<Logs />} />
        <Route exact path='/h2s_report' element={<H2S_Report />} />
        <Route exact path='/report' element={<Report />} />
        <Route exact path='/h2s_logs_report' element={<H2S_Logs_Report />} />
        <Route exact path='/sanitary_survay_logs_report' element={<Sanitary_Survay_Logs_Report />} />
        <Route exact path='/qmra_results' element={<Qmra_results />} />

      </Routes>
    </Router>
  );
}
export default App;
