import { api } from "../../../Data/API";
import Sidebar from "../Sidebar/SideBar";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../../Footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
// import { api } from '../../../Data/API'
function H2SReport(){
  // const api = "http://localhost:3001/api/"

  const [Provinces, setProvinces] = useState([])
  const [Report, setReport] = useState([])
  const [Municipalities, setMunicipalities] = useState([])
  const [StoredReport, setStoredReport] = useState([])
  let [TotalRecord, setTotalRecord] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [FoundReport, setFoundReport] = useState(false)
  const [UserId, setUserId] = useState(0)
  // Pagination
  const [CurrentPage, setCurrentPage] = useState(1)
  const record_per_page = 5
  const lastIndex = CurrentPage * record_per_page
  const firdIndex = lastIndex - record_per_page
  const record = Report.slice(firdIndex, lastIndex)
  const number_of_pages = Math.ceil(record.length / record_per_page)
  const number = [...Array(number_of_pages + 1).keys()].slice
  const PagePerNumber = []
  for (let i = 1; i <= Math.ceil(Report.length / record_per_page); i++) {
    PagePerNumber.push(i)
  }

  let user_info = useSelector((state) => state.user.value)

  useEffect(() => {
    var userId = user_info.userId
    console.log(userId)
    setUserId(userId)
    axios.get(api + 'get_userhistory_h2s/' + userId).then((response) => {
      setFoundReport(response.data.success)
      if (response.data.success === true) {
        setStoredReport(response.data.result)
        setReport(response.data.result)
        setTotalRecord(response.data.result.length)
      }
    })

    axios.get(api + "get_provinces").then(response => {
      setProvinces(response.data.results)

    }, err => {
      console.log(err)
    })


  }, []);

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

  //change page 
  const paginate = (page_number) => setCurrentPage(page_number)

  return (
    <div className="container-admin" >
    <div className='sidebar-admin ' >
    <Sidebar/>
    </div>

    <div className='main-admin text-center'>
        <ToastContainer />
        <div className='content'>
         <h2 className='text-primary text-center'>hydrogen Sulfide Logs</h2>
         
          
         <div className='report-header'>
              <div id='search_date'>
                <span className='survey_date'>
                  <label className='survey_date_label'>From</label>
                  <input type='date' className='control-from  start_date' onChange={(event) => setStartDate(event.target.value)} />
                </span>
                <span className='survey_date'>
                  <label className='survey_date_label'>To</label>
                  <input type='date' className='control-from end_date' onChange={(event) => setEndDate(event.target.value)} />
                </span>

                <button onClick={display_search_report} className="btn btn-dark btn-search-report">Show Results</button>

              </div>
              <div id='filter_by_province'>
                <span className='survey_province'>
                  {/* <label>Province</label> */}
                  <select onChange={(e) => filter_by_province(e.target.value)}>
                    <option value=''>Province</option>
                    {Provinces.map((province, xid) => (
                      <option key={xid} value={province.province_id} >{province.province_name}</option>
                    ))}
                  </select>
                </span>
                <span className='survey_province'>
                  {/* <label>Municipalities</label> */}
                  <select onChange={(e) => filter_by_municipality(e.target.value)}>
                    <option value=''>Municipality</option>
                    {Municipalities.map((muni, xid) => (
                      <option key={xid} value={muni.muni_id} >{muni.muni_name}</option>
                    ))}
                  </select>
                </span>
              </div>
              <div id='stats_summary' style={{ color: 'black' }}>
                <h3>Total Records: {TotalRecord}</h3>
              </div>
              </div>

            <div className='reports'>
              {(FoundReport === true) && (
                <table className="table survay_table w-75">
                  <tr className="survey_tr">
                    <th className="survey_th _th">Municipalities</th>
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
          </div>
        </div>
      </div>
  

  );
}
export default H2SReport;