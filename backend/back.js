import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';



const server = express();
const PORT = 5050;

server.use(bodyParser.json())
server.use(express.json());
server.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hashStorage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Terminate the application if MySQL connection fails
  } else {
    console.log('Connected to MySQL');
    connection.release();
  }
});

// Define a simple route
server.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});

server.post('/activity', function (req, res) {
  pool.query(
    'INSERT INTO actname(`act_Name`, `start_Date`, `end_Date`) VALUES (?,?,?)',
    [req.body.actName, req.body.startDate, req.body.endDate], // Change actId to actCode
    function (err, results) {
      if (err) {
        console.error('Error inserting into database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    }
  );
});

server.post('/actcode', function (req, res) {
  pool.query('INSERT INTO actcode(`act_Code`, `act_Name`) VALUES (?,?)',
    [req.body.actCode, req.body.actName],
    function (err, results) {
      if (err) {
        console.error('Error inserting into database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    }
  );
});

server.get('/check', function (req, res) {
  const actCodeParam = req.query.actCode;

  if (!actCodeParam) {
    return res.status(400).json({ error: 'actCode is required in the query parameters' });
  }

  pool.execute(
    'SELECT actname.*, actcode.act_Code FROM actname INNER JOIN actcode ON actname.act_Name=actcode.act_Name WHERE act_Code = ?',
    [actCodeParam],
    function (errS, resultsS) {
      if (errS) {
        console.error('Error querying the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("Join activity successfully");
        const DactCodeParam = resultsS[0].act_Code;
  


        pool.execute('DELETE FROM actcode WHERE act_Code = ?',
        [DactCodeParam],
        function (errD, resultsD) {
          if(errD){
            console.log("error");
          } else{
            console.log("Deleting Succesfully");
            res.json(resultsD);
          }
        })
      }
    }
  );
});





// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
