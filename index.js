const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const mysql2 = require('mysql2');
const bodyParser = require('body-parser')

// APM Configuration
const apm_upload_url = 'https://aaaac7hrlrc7saaaaaaaaaayre.apm-agt.us-ashburn-1.oci.oraclecloud.com/20200101/observations/public-span?dataFormat=zipkin&dataFormatVersion=2&dataKey=DIZBCJU6DBOIPEGP5IFGBYJ4U4RWHQFW';
const serviceName = 'setStudent';

//Zipkin Config

const { Tracer, ExplicitContext, BatchRecorder, jsonEncoder } = require("zipkin");
const { HttpLogger } = require("zipkin-transport-http");
const zipkinMiddleware = require("zipkin-instrumentation-express").expressMiddleware;
const zipkinMySQL = require('zipkin-instrumentation-mysql2');

const tracer = new Tracer({
  ctxImpl: new ExplicitContext(),
  recorder: new BatchRecorder({
    logger: new HttpLogger({
      endpoint: apm_upload_url,
      jsonEncoder: jsonEncoder.JSON_V2,
    }),
  }),
  localServiceName: serviceName,
});

app.use(zipkinMiddleware({ tracer }));

app.use(cors({
  origin: '*',
  methods: ['POST']
}));

app.use(bodyParser.json())

app.post('/api', (req, res) => {
  console.log(req.body)
  sendToDB(req.body, tracer);
  res.send("message received")
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})


function sendToDB(body, tracer) {

  const wrappedMysqlClient = zipkinMySQL(mysql2, tracer)
  const connOptions = {
    host: "<YOUR_DB_FQDN>",
    user: "db_user",
    password: "Oracle@123",
    database: "student"
  }
  const client = wrappedMysqlClient.createConnection(connOptions)

  client.query(`INSERT INTO student (fname, lname, email) VALUES ('${body.firstName}','${body.lastName}','${body.email}')`,(err, result) => {
    console.log(err, result)
  })
}