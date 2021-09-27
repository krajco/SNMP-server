// index.js

/**
 * Required External Modules
 */
const express = require('express');
const path = require('path');
const bent = require('bent');
const fs = require('fs').promises;
var bodyParser = require('body-parser');
const { json } = require('express');
/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || '8000';

/**
 *  App Configuration
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZjBjMjNlMzFiNDA0NDJiYTg1ZWE5YTZhNzk2OTNjYiIsImlhdCI6MTYzMjU5Mjc2OCwiZXhwIjoxOTQ3OTUyNzY4fQ.Iwln2UBqWAerPczPSLCCp0P5T5s_EcHsqgGFN28ER2Y';
  let data = bent({'Authorization': 'Bearer '+ token}, 'json')('https://ha.nesad.fit.vutbr.cz/api/states');
  data.then((data) => {
    res.render('index', {title: 'Dashboard', sensors: data});
  });
});

app.post('/', (req, res) => {
  console.log('body' + JSON.stringify(req.body));
  
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZjBjMjNlMzFiNDA0NDJiYTg1ZWE5YTZhNzk2OTNjYiIsImlhdCI6MTYzMjU5Mjc2OCwiZXhwIjoxOTQ3OTUyNzY4fQ.Iwln2UBqWAerPczPSLCCp0P5T5s_EcHsqgGFN28ER2Y';
  let data = bent({'Authorization': 'Bearer '+ token}, 'json')('https://ha.nesad.fit.vutbr.cz/api/states');
  
  data.then((data) => {
    res.render('index', {title: 'Dashboard', sensors: data});
  });
});

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

/**
 * HASSIO communication
 */
