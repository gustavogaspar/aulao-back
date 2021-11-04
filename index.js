const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const mysql = require('mysql'); 
const bodyParser = require('body-parser')


app.use(cors({
    origin: '*',
    methods: ['POST']
}));

app.use(bodyParser.json())

app.post('/api', (req, res) => {
    console.log(req.body)
    sendToDB(req.body);
    res.send("message received")
})

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})


function sendToDB(body){
    const con = mysql.createConnection({
        host: "<YOUR_DB_FQDN>",
        user: "db_user",
        password: "Oracle@123",
        database: "student"
      });
    
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to the database!");
        var sql = `INSERT INTO student (fname, lname, email) VALUES ('${body.firstName}','${body.lastName}','${body.email}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Record inserted, ID: " + result.insertId);
        });
      });

}