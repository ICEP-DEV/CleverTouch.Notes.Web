import React, { useEffect, useState } from 'react';
import './User_H2S_Logs.css';
import axios from 'axios';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

function User_H2S_Logs() {
  const api = "http://localhost:3001/api/";

  const [Provinces, setProvinces] = useState([]);
  const [Report, setReport] = useState([]);
  const [Municipalities, setMunicipalities] = useState([]);
  const [StoredReport, setStoredReport] = useState([]);
  const [TotalRecord, setTotalRecord] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [FoundReport, setFoundReport] = useState(false);
  const [UserId, setUserId] = useState(0);
  const [CurrentPage, setCurrentPage] = useState(1);
  const [numIterations, setNumIterations] = useState(1);
  const [monteCarloResults, setMonteCarloResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let user_info = useSelector((state) => state.user.value);

  useEffect(() => {
    var userId = user_info.userId;
    console.log(userId);
    setUserId(userId);
    axios.get(api + 'get_userhistory_h2s/' + userId).then((response) => {
      setFoundReport(response.data.success);
      if (response.data.success === true) {
        setStoredReport(response.data.result);
        setReport(response.data.result);
        setTotalRecord(response.data.result.length);
      }
    });

    axios.get(api + "get_provinces").then(response => {
      setProvinces(response.data.results);
    }, err => {
      console.log(err);
    });
  }, []);

  const runMonteCarloSimulation = () => {
    setIsLoading(true);
    const filteredReports = Report;
  
    const monteCarloResultsArray = [];
  
    for (let i = 0; i < numIterations; i++) {
      let simulationResults = [];
  
      filteredReports.forEach(report => {
        // For each report, generate a random value to determine if it's a Risk or NoRisk
        const isRisk = Math.random() >= 0.5; // Assuming 50/50 probability
        const result = isRisk ? "Risk" : "NoRisk";
        
        simulationResults.push(result);
      });
  
      monteCarloResultsArray.push(simulationResults);
    }
  
    setMonteCarloResults(monteCarloResultsArray);
    setIsLoading(false);
  };
  
  function getRepresentativeValue(simulationResults) {
    const counts = simulationResults.reduce((acc, result) => {
      acc[result] = (acc[result] || 0) + 1;
      return acc;
    }, {});
  
    const mostCommonResult = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return mostCommonResult;
  }
  

  // Pagination
  const record_per_page = 5;
  const lastIndex = CurrentPage * record_per_page;
  const firdIndex = lastIndex - record_per_page;
  const record = Report.slice(firdIndex, lastIndex);
  const number_of_pages = Math.ceil(record.length / record_per_page);
  const PagePerNumber = [...Array(number_of_pages + 1).keys()].slice(1);

  const handleIterationsChange = (event) => {
    const newValue = parseInt(event.target.value);
    setNumIterations(newValue);
  };


  function display_search_report() {
    if (startDate === '' || endDate === '') {
      toast.warn("All date should be selected!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (Date.parse(startDate) > Date.parse(endDate)) {
      toast.warn("End date cannot be before start date!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    axios.get(api + 'get_user_h2s_stats/' + startDate + '/' + endDate + '/' + UserId).then((response) => {
      setTotalRecord(0)
      setFoundReport(response.data.success)
      if (response.data.success === true) {
        setTotalRecord(response.data.result.length)
        setReport(response.data.result)
        setStoredReport(response.data.result)
      }
    })
  }

  function checkForUserInfo(id) {
    var temp_array = StoredReport
    if (id === true) {
      setReport(temp_array.filter(value => {
        return value.user().includes(id)
      }))
    }
    else {
      setReport(StoredReport)
    }
  }

  function filter_by_province(_province) {
    var count = 0
    if (_province === '') {
      setReport(StoredReport)
      setTotalRecord(StoredReport.length)
      return
    }
    var temp_array = StoredReport
    axios.get(api + "get_municipalities/" + _province).then(response => {
      setMunicipalities(response.data.results)

    }, err => {
      console.log(err)
    })
    setReport(temp_array.filter(value => {
      return value.province_id?.toLocaleLowerCase().includes(_province?.toLocaleLowerCase())
    }))

    for (var k = 0; k < StoredReport.length; k++) {
      if (StoredReport[k].province_id.toLocaleLowerCase() === _province.toLocaleLowerCase()) {
        count++
      }
    }
    setTotalRecord(count)
  }

  function filter_by_municipality(_muni) {
    var temp_array = StoredReport
    var count = 0
    if (_muni === '') {
      setReport(StoredReport)
      return
    }

    setReport(temp_array.filter(value => {
      return value.muni_id.toLocaleLowerCase().includes(_muni.toLocaleLowerCase())
    }))
    for (var k = 0; k < Report.length; k++) {
      if (Report[k].muni_id.toLocaleLowerCase() === _muni.toLocaleLowerCase()) {
        count++
      }
    }
    setTotalRecord(count)
  }

  function search_by_weekday(day) {
    var temp_array = StoredReport

    if (day !== '') {
      setReport(temp_array.filter(value => {
        return value.weekday.toLocaleLowerCase().includes(day.toLocaleLowerCase())
      }))
    }
    else {
      setReport(StoredReport)
    }
  }
  function catchmentArea(catchment) {
    var temp_array = StoredReport
    console.log(temp_array)
    var count = 0
    if (catchment !== '') {
        setReport(temp_array.filter(value => {
            return value.type.toLocaleLowerCase().includes(catchment.toLocaleLowerCase())
        }))
        for (var k = 0; k < StoredReport.length; k++) {
            if (StoredReport[k].type.toLocaleLowerCase() === catchment.toLocaleLowerCase()) {
                count++
            }
        }
        setTotalRecord(count)
    }
    else {
        setReport(StoredReport)
    }
}


function riskType(typeRisk) {
    var temp_array = StoredReport
    console.log(temp_array)
    var count = 0
    if (typeRisk !== '') {
        setReport(temp_array.filter(value => {
            return value.risk_type.toLocaleLowerCase().includes(typeRisk.toLocaleLowerCase())
        }))
        for (var k = 0; k < StoredReport.length; k++) {
            if (StoredReport[k].risk_type.toLocaleLowerCase() === typeRisk.toLocaleLowerCase()) {
                count++
            }
        }
        setTotalRecord(count)
    }
    else {
        setReport(StoredReport)
    }
}
  //change page 
  const paginate = (page_number) => setCurrentPage(page_number)

  return (
    <div className='hero-all'>
      <Navbar />
      <div className='main-all'>
        <ToastContainer />
        <div className='content text-center'>
          <Header />
          <h2 className='text-primary text-center'>hydrogen Sulfide Logs</h2>  

            <div className='report-header  '>
              <div id='search_date ' >
                <table className="table-logs-date table table-bordered w-50">
                  <thead className='thead-dark'>
                    <tr>

                      <th scope="col " className='report-heading'>Start Date</th>
                      <th scope="col" className='report-heading'>End Date</th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr scope="row">

                      <td>  <input type='date' className='control-from  start_date w-100 p-2' onChange={(event) => setStartDate(event.target.value)} /></td>
                      <td> <input type='date' className='control-from end_date w-100 p-2' onChange={(event) => setEndDate(event.target.value)} /></td>

                    </tr>


                  </tbody>
                </table>
                <button onClick={display_search_report} className="btn btn-success btn-search-report  mb-5">Show Results</button>
              </div>
              {/* <div id='search_date ' >
                <span className='survey_date'>
                  <label className='survey_date_label'>From</label>
                  <input type='date' className='control-from  start_date w-50' onChange={(event) => setStartDate(event.target.value)}  />
                </span><br/>
                <span className='survey_date'>
                  <label className='survey_date_label'>To</label>
                  <input type='date' className='control-from end_date w-50' onChange={(event) => setEndDate(event.target.value)} />
                </span>

                <button onClick={display_search_report} className="btn btn-dark btn-search-report w-50">Show Results</button>

              </div> */}
              <table className="table-logs table table-bordered w-75">
                <thead className='thead-dark'>
                  <tr>

                    <th scope="col " className='report-heading'>WeekDays</th>
                    <th scope="col" className='report-heading'>Province</th>
                    <th scope='col' className='report-heading'>Municipalities</th>
                    <th scope='col' className='report-heading'>Catchment Area</th>
                    <th scope='col' className='report-heading'>Risk Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr scope="row">

                    <td className="w-15">
                      <select onChange={(event) => search_by_weekday(event.target.value)} className=" w-100 p-2">
                        <option value=''>All Weekdays</option>
                        <option value='Monday'>Monday</option>
                        <option value='Tuesday'>Tuesday</option>
                        <option value='Wednesday'>Wednesday</option>
                        <option value='Thursday'>Thursday</option>
                        <option value='Friday'>Friday</option>
                        <option value='Saturday'>Saturday</option>
                        <option value='Sunday'>Sunday</option>
                      </select>
                    </td>


                    {/* <label>Province</label> */}
                    <td className="w-15">
                      <select onChange={(e) => filter_by_province(e.target.value)} className="w-100 p-2">
                        <option value=''>All Provinces</option>
                        {Provinces.map((province, xid) => (
                          <option key={xid} value={province.province_id} >{province.province_name}</option>
                        ))}
                      </select>

                    </td>
                    <td className="w-15">
                      <select onChange={(e) => filter_by_municipality(e.target.value)} className="w-100 p-2" >
                        <option value=''>All Municipalities</option>
                        {Municipalities.map((muni, xid) => (
                          <option key={xid} value={muni.muni_id} >{muni.muni_name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="w-15">
                                            <select onChange={(e) => catchmentArea(e.target.value)} className="w-100 p-2" >
                                                <option value='' className="control-form">Water Source</option>
                                                <option value='River' className="control-form">River</option>
                                                <option value='Dam' className="control-form">Dam</option>
                                                <option value='Spring' className="control-form">Spring</option>
                                                <option value='Borehole' className="control-form">Borehole</option>
                                                <option value='Dug Well' className="control-form">Dug Well</option>
                                                <option value='Tap' className="control-form">Tap</option>
                                                <option value='Housewater Stored Water' className="control-form">Housewater Stored Water</option>
                                                <option value='Wastewater Treatment Plant' className="control-form">Wastewater Treatment Plant</option>
                                                <option value='water Treatment Plant' className="control-form">water Treatment Plant</option>
                                            </select>
                                        </td>

                                        <td className="w-15">
                                            <select onChange={(e) => riskType(e.target.value)} className="w-100 p-2" >
                                                <option value='' className="control-form">Risk Type</option>
                                                <option value='No Risk' className="control-form">No Risk</option>
                                                <option value='Risk' className="control-form">Risk</option>
                                      
                                            </select>

                                        </td>
                    {/* <label>Municipalities</label> */}
                  </tr>
                </tbody>
              </table>
            
              <div id='stats_summary' className=' text-primary mt-5' >
                <h3>Total Records: {TotalRecord}</h3>
              </div>

            </div>

            <div className='reports'>
              {(FoundReport === true) && (
                <table className="table survay_table w-100">
                  <tr className="survey_tr">
                    <th className="survey_th">Municipalities</th>
                    <th className="survey_th">Date</th>
                    <th className="survey_th ">Catchment Area</th>
                    <th className="survey_th ">Status</th>
                    <th className="survey_th ">Risk Type</th>
                  </tr>

                  {record.map((report, xid) => (
                    <tr key={xid} className="survey_tr" scope="row">
                      <td className="survey_td _td">{report.muni_name}</td>
                      <td className="survey_td">{report.sample_date}</td>
                      <td className="survey_td">{report.type}</td>
                      <td className="survey_td">{report.status}</td>
                      <td className="survey_td">{report.risk_type}</td>
                    </tr>
                  ))}
                </table>
              )}
              <div className='page_numbers' >
                {(FoundReport === true) && (
                  <nav className='pagination'>
                    <ul class="pagination justify-content-center">
                      {PagePerNumber.map((number, xid) => (
                        <li key={xid} className='page-item'>
                          <button onClick={() => paginate(number)} className='page-link'>{number}</button>
                        </li>
                      ))}
                    </ul>

                  </nav>
                )}
              </div>
               </div>
{/*                
              <input className='form-control w-25' type="number" value={numIterations} onChange={(e) => setNumIterations(e.target.value)} />
              <button onClick={runMonteCarloSimulation} className="btn btn-primary w-25 mb-5">Run Monte Carlo Simulation</button> */}

                  {/* {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="monte-carlo-results">
                    <h3>Monte Carlo Results</h3>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Simulation</th>
                          <th>Results</th>
                          <th>Representative Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monteCarloResults.map((simulationResults, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <ul>
                                {simulationResults.map((result, resultIndex) => (
                                  <li key={resultIndex}>{result}</li>
                                ))}
                              </ul>
                            </td>
                            <td>{getRepresentativeValue(simulationResults)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}                
               */}
      
        
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
    </div>
  );
}
export default User_H2S_Logs