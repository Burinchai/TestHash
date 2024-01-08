import React, { useState } from 'react';
import { SHA256 } from 'crypto-js';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [inputAmount, setInputAmount] = useState(1);
  const [hashedText, setHashedText] = useState('');
  const [inputStartDate, setStartDate] = useState('');
  const [inputEndDate, setEndDate] = useState('');




  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleAmountChange = (event) => {
    setInputAmount(event.target.value);
  }

  const StartDate = (event) => {
    setStartDate(event.target.value)
  }

  const EndDate = (event) => {
    setEndDate(event.target.value)
  }


  const handleHashClick = () => {
    let allHashes = '';



    for (let i = 1; i <= inputAmount; i++) {
      const uniqueInput = inputText + i; // Concatenate input text with the iteration number
      const hashedValue = SHA256(uniqueInput).toString();

      const upperActivtyCode = (hashedValue.slice(-8)).toUpperCase();

      const CodeData = {
        actName: inputText,
        actCode: upperActivtyCode
      };


      fetch('http://localhost:5050/actcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(CodeData)
      })
        .then(response => response.json())
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.error('Error:', error);
        });



      allHashes += upperActivtyCode + '\n';
    }
    const activity = {
      actName: inputText,
      startDate: inputStartDate,
      endDate: inputEndDate
    };

    fetch('http://localhost:5050/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activity)
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    setHashedText(allHashes);

  };

  return (
    <>
      <div>
        <label>
          Enter Text :
          <input type="text" value={inputText} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Enter Amount :
          <input type="text" value={inputAmount} onChange={handleAmountChange} />
        </label>
        <br />
        <div>
          <label>
            Start Date :
            <input type="datetime-local" value={inputStartDate} onChange={StartDate} />
          </label>
          <label>
            End Date :
            <input type="datetime-local" value={inputEndDate} onChange={EndDate} />
          </label>
        </div>
        <button onClick={handleHashClick}>Hash</button>
        {hashedText && (
          <div>
            <p>All Hashed Texts:</p>
            <pre>{hashedText}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
