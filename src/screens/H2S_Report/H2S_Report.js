
import Header from '../Header/Header';
import './H2S_Report.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../Footer/Footer';
import Admin_NavBar from '../Admin_NavBar/Admin_NavBar';

function H2S_Report() {
    const [H2SReport, setH2SReport] = useState([])
    const [IsDataLoaded,setIsDataLoaded] = useState(false)
    useEffect(() => {
        axios.get("http://localhost:3001/api/get_all_summary_h2s").then(response => {
            setIsDataLoaded(response.data.success)
            if (response.data.success === true) {
                setH2SReport(response.data.rows)
            }

        })
    }, [])
    return (
        <div className='hero-all' >
            <Admin_NavBar/>
            <div className='main-all'>
                <div className='content'>
                    <Header />
                    <div className='container-wrapper'>
                        {IsDataLoaded === true && (
                        <table>
                                <th>Municipality</th>
                                <th>Sample Source</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Samling Date​</th>
                                <th>Presence/Absence</th>
                            {H2SReport.map((report, xid) => (
                                <tr key={xid}>
                                    <td>{report.muni_name}</td>
                                    <td>{report.type}</td>
                                    <td>{report.longitude}</td>
                                    <td>{report.latitude}</td>
                                    <td>{report.sample_date}</td>
                                    <td>{report.status}</td>
                                </tr>
                            ))}

                        </table>)}
                        {IsDataLoaded === false && (
                            <label>Data is not loaded</label>
                        )}
                    </div>
                </div>
            </div>
            <footer>
                <Footer/>
            </footer>
        </div>
    )
}

export default H2S_Report