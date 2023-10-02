import React, { useState } from 'react';

const qmraParameters = {
  'Campylobacter jejun': { model: 'Beta-Poisson', alpha: 0.145, beta: 7.45 },
  'E-Coli O157:H7': { model: 'Beta-Poisson', alpha: 0.4, beta: 45.9 },
  'Salmonella Typhi': { model: 'Beta-Poisson', alpha: 0.21, beta: 49.78 },
  'S. flexneri': { model: 'Beta-Poisson', alpha: 0.265, beta: 1480 },
  'Vibrio cholerae': { model: 'Beta-Poisson', alpha: 0.169, beta: 2305 },
  'Cryptosporidium parvum': { model: 'exponential', r: 0.059 },
  'Entamoeba coli': { model: 'Beta-Poisson', alpha: 0.79433, beta: 5.40789 },
  'Giardia lambia': { model: 'exponential', k: 0.01199 },
  'Other': { model: '', alpha: 0, beta: 0 },
};

function QMRAApp() {
  const [selectedOrganism, setSelectedOrganism] = useState('Campylobacter jejun');
  const [count, setCount] = useState('');
  const [alpha, setAlpha] = useState('');
  const [beta, setBeta] = useState('');
  const [r, setr] = useState('');
  const [k, setk] = useState('');
  const [model, setModel] = useState('');
  const [result, setResult] = useState('');

  const calculateResult = () => {
    if (selectedOrganism === 'Other' && model && count && alpha && beta) {
      let calculatedResult = 0;

      if (model === 'Beta-Poisson') {
        calculatedResult = calculateBetaPoisson(alpha, beta, count);
      }  if (selectedOrganism === 'Cryptosporidium parvum') {
          calculatedResult = calculateExponentialForCryptosporidium(r, count);
        } else if (selectedOrganism === 'Giardia lambia') {
          calculatedResult = calculateExponentialForGiardia(k, count);
        }
 
      setResult(`Model Type: ${model}, Calculated Result: ${calculatedResult}`);
    } else {
      setResult('');
    }
  };

  const calculateExponentialForCryptosporidium = (r, count) => {
    // Implement the exponential calculation for Cryptosporidium parvum
      // Your formula here 
      const calculatedResult = r;
    return calculatedResult;
  };

  const calculateExponentialForGiardia = (k, count) => {
    // Implement the exponential calculation for Giardia lambia
     // Your formula here 
     const calculatedResult = k;
    return calculatedResult;
  };


  const calculateBetaPoisson = (alpha, beta, count) => {
    // Perform the Beta-Poisson calculation here  
    const calculatedResult = 1 -[1+(count/beta)]-alpha;
    return 1 - (1 + (count /  beta)) - alpha;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>QMRA Parameters</h1>
      <select
        value={selectedOrganism}
        onChange={(e) => {
          setSelectedOrganism(e.target.value);
          setResult('');
        }}
      >
        {Object.keys(qmraParameters).map((organism) => (
          <option
            key={organism}
            value={organism}
          >
            {organism}
          </option>
        ))}
        <option value="Other">Other</option>
      </select>
      {selectedOrganism === 'Other' && (
        <>
          <input
            style={styles.input}
            placeholder="Enter Organism"
            onChange={(e) => setSelectedOrganism(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Enter Model"
            onChange={(e) => setModel(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Enter Count"
            type="number"
            onChange={(e) => setCount(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Enter Alpha"
            type="number"
            step="0.01"
            onChange={(e) => setAlpha(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Enter Beta"
            type="number"
            step="0.01"
            onChange={(e) => setBeta(e.target.value)}
          />
          {model === 'exponential' && (
            <>
              {selectedOrganism !== 'Cryptosporidium parvum' && selectedOrganism !== 'Giardia lambia' && (
                <input
                  style={styles.input}
                  placeholder="Enter r"
                  type="number"
                  step="0.01"
                  onChange={(e) => setr(e.target.value)}
                />
              )}
              {selectedOrganism !== 'Cryptosporidium parvum' && selectedOrganism !== 'Giardia lambia' && (
                <input
                  style={styles.input}
                  placeholder="Enter k"
                  type="number"
                  step="0.01"
                  onChange={(e) => setk(e.target.value)}
                />
              )}
            </>
          )}
        </>
      )}
      <button
        onClick={calculateResult}
      >
        Calculate
      </button>
      {result !== '' && (
        <p style={styles.result}>{result}</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
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
    borderWidth: '1px',
    borderColor: 'blue',
  },
  result: {
    fontSize: '18px',
    marginTop: '20px',
  },
};

export default QMRAApp;