import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function QMRAApp() {
  const [selectedOrganism, setSelectedOrganism] = useState('Campylobacter jejun');
  const [count, setCount] = useState('');
  const [alpha, setAlpha] = useState('');
  const [beta, setBeta] = useState('');
  const [n50, setN50] = useState('');
  const [Constant, setConstant] = useState('');
  const [Parameters, setParameters] = useState([]);
  const [result, setResult] = useState('');
  const [Pathogen, setPathogen] = useState([]);
  const [TempPathogen, setTempPathogen] = useState([]);
  const [IsfoundPath, setIsfoundPath] = useState(false);
  const [bestFit, setBestFit] = useState('')
  const [Longitude, setLongitude] = useState('')
  const [Latitude, setLatitude] = useState('')

  let estimated = useSelector((state) => state.fib.value)
  let sampling_info = useSelector((state) => state.sampling.value)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setLongitude(longitude)
      setLatitude(latitude)
    })
    axios.get("http://localhost:3001/api/reference_pathogens").then(respond => {
      //  console.log(respond.data.reference_pathogens)

      //setParameters(respond.data.reference_pathogens[0].parameter[0])
      setPathogen(respond.data.reference_pathogens)
      console.log(Pathogen, "state");

      setIsfoundPath(respond.data.success)
      // const filteredParameters = response.Pathogen.filter(item => item.parameters === beta);
      // setAlpha(filteredParameters)
    }, error => {
      console.log(error)
    })

  }, [])
  const calculateResult = () => {
    console.log(selectedOrganism)

  };

  function selectPathogen(event) {
    var filtered = []
    // console.log(event)
    filtered.push(Pathogen.filter((value) => value.pathogen === event))

    console.log(filtered[0][0].pathogen)
    setSelectedOrganism(filtered[0][0].pathogen)
    setTempPathogen(filtered[0][0])
    setParameters(filtered[0][0].parameter[0])
    
    if (filtered[0][0].best_fit_model === 'exponential') {
      setConstant(filtered[0][0].parameter[0].constant)
    }
    if (filtered[0][0].best_fit_model === 'beta-poisson') {
      setBeta(filtered[0][0].parameter[0].beta)
      setAlpha(filtered[0][0].parameter[0].alpha)
      setN50(filtered[0][0].parameter[0].n50)
    }

  }
  function sendQmra() {
    console.log('beta', beta)
    console.log('alpha', alpha)
    console.log('constant', Constant)
    console.log('N50', n50)
    console.log(selectedOrganism)

    var qmra_data = {
      beta: beta,
      alpha: alpha,
      constant: Constant,
      n50: n50,
      organism: selectedOrganism,
      fib: estimated.estimatedCount
    }


     //Call in sampling data api
     axios.post("http://localhost:3001/api/sampling_data", sampling_info).then((response) => {
      qmra_data.samplingId = response.data.insertedId
      // Assign to Coordinates object
      var coordinates = {
          latitude: Latitude,
          longitude: Longitude,
          samplingId: response.data.insertedId
      }
      //Call in coordinates api
      axios.post("http://localhost:3001/api/coordinates", coordinates).then((result) => {
          console.log(result)
      }, err => {
          console.log(err)
      })
      // Assign to watersource object
      var watersource = {
          samplingId: response.data.insertedId,
          type: sampling_info.type,
          waterAccessability: sampling_info.waterAccessability
      }
      //Call in watersource api
      axios.post("http://localhost:3001/api/watersource", watersource).then((result) => {
          console.log(result)
      }, err => {
          console.log(err)
      })

      axios.post("http://localhost:3001/api/QMRA",qmra_data )
          .then((result) => {
              console.log(result.data.success)

          }, err => {
              console.log(err)
          })
  }, (err) => {
      console.log(err)
  })


    

    console.log(qmra_data)

  }


  return (
    <div style={styles.container}>
      <h1 style={styles.header}>QMRA Parameters</h1>
      <select
        // value={selectedOrganism}
        onChange={(e) => {
          selectPathogen(e.target.value);
          setResult('');
        }}
      >
        <option value='' disabled selected>--- Select ---- </option>
        {Pathogen.map((organism, xid) => (
          <option key={xid} value={organism.pathogen}>
            {organism.pathogen}
          </option>
        ))}

      </select>
      <button onClick={calculateResult}>Calculate</button>
      {result !== '' && <p style={styles.result}>{result}</p>}
      <table id='table'>
        <th>
          Pathogen
        </th>
        <th>
          Best Fit model
        </th>
        <th>
          Parameters
        </th>
        <tbody>
          {(TempPathogen.best_fit_model !== '') && (<tr>

            <td>{TempPathogen.pathogen} </td>
            <td>{TempPathogen.best_fit_model}</td>
            <td>{(TempPathogen.best_fit_model === 'exponential') && (<label>constant {Parameters.constant}</label>)}

              {(TempPathogen.best_fit_model === 'beta-poisson') && (<label>alpha {Parameters.alpha},
                <span>
                  {(Parameters.beta) && (<label>beta {Parameters.beta}</label>)}
                  {(!Parameters.beta) && (<label>N50 {Parameters.n50}</label>)}
                </span>
              </label>)}
            </td>
          </tr>)}
          {(TempPathogen.best_fit_model === '') && (<tr>
            <td><input type='text'></input></td>
            <td><select onChange={(e) => {
              setBestFit(e.target.value)
            }} >
              <option value='beta-poisson'>beta-poisson </option>
              <option value='exponential'>exponential </option>
            </select></td>
            <td>
              {(bestFit === 'beta-poisson') && (<span>
                <input type='text' placeholder='alpha'></input>
                <input type='text' placeholder='beta'></input>
              </span>)}

              {(bestFit === 'exponential') && (<span>
                <input type='text' placeholder='constant'></input>

              </span>)}

            </td>
          </tr>)}

        </tbody>
      </table>
      <button onClick={sendQmra}></button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  header: {
    fontSize: '20px',
    marginBottom: '20px',
  },
  input: {
    width: '200px',
    fontSize: '16px',
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid blue',
  },
  result: {
    fontSize: '18px',
    marginTop: '20px',
  },
};