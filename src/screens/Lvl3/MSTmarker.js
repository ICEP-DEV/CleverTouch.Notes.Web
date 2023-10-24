import React, { useState, useEffect } from 'react';

const FibAnalysis = () => {
    const [selectedFIB, setSelectedFIB] = useState('Select a FIB');
    const [referencePath, setReferencePath] = useState('');
    const [ratio, setRatio] = useState(0);
    const [estimatedCount, setEstimatedCount] = useState(0); 
    const [userCount, setUserCount] = useState(0);
    const [roundedEstimatedCount, setRoundedEstimatedCount] = useState(0);

  const fibData = {
    'Cow': { referencePath: 'Campylobacter', ratio: 0.66, estimatedCount: 0 },
    'Human': { referencePath: 'Cryptosporidium', ratio: 1, estimatedCount: 0 },
    'Dog': { referencePath: 'Campylobacter', ratio: 0.01, estimatedCount: 0 },
    'Pig': { referencePath: 'Giardia', ratio: 0.8, estimatedCount: 0 },
    'Chicken': { referencePath: 'Giardia', ratio: 0.01, estimatedCount: 0 },
  };

  // Function to calculate estimated count
  const calculateEstimatedCount = () => {
    const count = parseInt(userCount, 10);
    if (!isNaN(count)) {
      const estimated = count * ratio;
      setEstimatedCount(estimated);
      setRoundedEstimatedCount(Math.round(estimated)); // Round the estimated count
    } else {
      setEstimatedCount(0);
      setRoundedEstimatedCount(0);
    }
  };

  useEffect(() => {
    calculateEstimatedCount();
  }, [userCount, ratio]);

  const handleFibData = (fib) => {
    setSelectedFIB(fib);
    if (fibData[fib]) {
      setReferencePath(fibData[fib].referencePath);
      setRatio(fibData[fib].ratio);
      // Calculate estimated count based on user input
      calculateEstimatedCount();
    } else {
      setReferencePath('');
      setRatio(0);
      setEstimatedCount(0);
    }
  };

  return (
    <div>
      <p>Select an FIB Indicator:</p>
      <select
        value={selectedFIB}
        onChange={(event) => handleFibData(event.target.value)}
      >
        <option value="Other">Select A Marker</option>
        {Object.keys(fibData).map((fib) => (
          <option key={fib} value={fib}>
            {fib}
          </option>
        ))}
      </select>
      
      <table>
        <tbody>
          <tr>
            <th>MST Marker</th>
            <th>Ratio</th>
          </tr>
          <tr>
            <td>{referencePath}</td>
            <td>{ratio}</td>
          </tr>
        </tbody>
      </table>

      <br>  </br>
      <p>Enter The Count:</p>
      <input
        type="number"
        value={userCount}
        onChange={(event) => setUserCount(event.target.value)}
      />
      <p> Count: {estimatedCount} </p>
      <p>Estimated Count: {roundedEstimatedCount} </p>
    </div>
  );
};

export default FibAnalysis;