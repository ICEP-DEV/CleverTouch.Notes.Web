import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../../Footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Sidebar/SideBar';
function Survay_Admin(){
    const [Provinces, setProvinces] = useState([])
    const [Report, setReport] = useState([])
    const [Municipalities, setMunicipalities] = useState([])
    const [StoredReport, setStoredReport] = useState([])
    let [TotalRecord, setTotalRecord] = useState(0)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [FoundReport, setFoundReport] = useState(false)
    const [IsDataLoaded,setIsDataLoaded] = useState(false)
    const [sanitaryReport, setSanitaryReport] =useState([])
    // Pagination
    const [CurrentPage, setCurrentPage] = useState(1)
    const record_per_page = 5
    const lastIndex = CurrentPage * record_per_page
    const firdIndex = lastIndex - record_per_page
    const record =Report.slice(firdIndex, lastIndex)
    const number_of_pages = Math.ceil(record.length / record_per_page)
    const number = [...Array(number_of_pages + 1).keys()].slice
    const PagePerNumber = []
    for (let i = 1; i <= Math.ceil(Report.length / record_per_page); i++) {
      PagePerNumber.push(i)
    }
    const api = "http://localhost:3001/api/"


    useEffect(() => {
      axios.get(api+"get_all_summary_survey").then(response => {
        setTotalRecord(0)
          setIsDataLoaded(response.data.success)
          setFoundReport(response.data.success)
          if (response.data.success === true) {
           
            setSanitaryReport(response.data.rows)
              
          }

      })
  }, [])

    useEffect(() => {
      var date = new Date()
      var current_date = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
      axios.get(api + 'get_survey_stats/2023-06-30/' + current_date.toString()).then((response) => {
        setFoundReport(response.data.success)
        if (response.data.success === true) {
            setReport(response.data.result)
            setStoredReport(response.data.result)
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
      axios.get(api + 'get_survey_stats/' + startDate + '/' + endDate).then((response) => {
        setTotalRecord(0)
        if (response.data.success === true) {
          setStoredReport(response.data.result)
          setReport(response.data.result)
          setFoundReport(response.data.success)
          setTotalRecord(response.data.result.length)
        }
      })
    }
  
    function filter_by_province(_province) {
      var count = 0
      var temp_array = StoredReport
  
      axios.get(api + "get_municipalities/" + _province).then(response => {
        setMunicipalities(response.data.results)
  
      }, err => {
        console.log(err)
      })
      setReport(temp_array.filter(value => {
        return value.province_id.toLocaleLowerCase().includes(_province.toLocaleLowerCase())
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
    const paginate = (page_number) => setCurrentPage(page_number)
    return(
        <div className="container-admin" >
        <div className='sidebar-admin ' >
        <Sidebar/>
        </div>
 
        <div className='main-admin'>
        <div className='report-header'>
            
        <table className="table-logs table table-bordered w-75 mt-5 ">
    <thead className='thead-dark'>
    <tr>
      
     <th>To</th>
     <th>From</th>
      <th scope="col" className='report-heading'>Province</th>
      <th scope='col' className='report-heading'>Municipalities</th>
     
    </tr>
  </thead>
  <tbody>
  <tr>
    <td> <input type='date' className='control-from  start_date' onChange={(event) => setStartDate(event.target.value)} /></td>
  <td><input type='date' className='control-from end_date' onChange={(event) => setEndDate(event.target.value)} /></td>
  <td> <span className='survey_province'>
                 {/* <label>Province</label> */}
                 <select onChange={(e) => filter_by_province(e.target.value)} className='p-2'>
                   <option value=''>Province</option>
                   {Provinces.map((province, xid) => (
                     <option key={xid} value={province.province_id} >{province.province_name}</option>
                   ))}
                 </select>
               </span></td>
  <td> <span className='survey_province'>
                 {/* <label>Municipalities</label> */}
                 <select onChange={(e) => filter_by_municipality(e.target.value)} className='p-2'>
                   <option value=''>Municipalities</option>
                   {Municipalities.map((muni, xid) => (
                     <option key={xid} value={muni.muni_id} >{muni.muni_name}</option>
                   ))}
                 </select>
               </span> </td>
  </tr>
 
   
   
  </tbody>
</table>
        
              
              <div id='stats_summary'  className='text-center text-primary mt-5' >
                <h3>Total Records: {TotalRecord}</h3>
              </div>

            </div>
            
            <div className='reports'>
              {(FoundReport === true) && (
                <table className="table survay_table w-50 ">
                  <thead class="thead-dark">
                  <tr className="survey_tr">
                    <th className="survey_th _th">Municipalities</th>
                    <th className="survey_th">Date</th>
                    <th className="survey_th ">Catchment Area</th>
                    <th className="survey_th ">Total Average</th>
                    <th className="survey_th ">Risk Type</th>
                  </tr>
                  </thead>
                  {sanitaryReport.map((report, xid) => (
                    <tr key={xid} className="survey_tr" scope="row">
                      <td className="survey_td _td">{report.muni_name}</td>
                      <td className="survey_td">{report.created_date}</td>
                      <td className="survey_td">{report.type}</td>
                      <td className="survey_td">{report.total_avarage}</td>
                      <td className="survey_td">{report.risk_type}</td>
                    </tr>
                  ))}
                </table>
              )}

               <div className='page_numbers' >
                {(IsDataLoaded === true) && (
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

        )
}

export default Survay_Admin;