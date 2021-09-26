// index.js

/**
 * Required External Modules
 */
const express = require('express');
const path = require('path');
const bent = require('bent');
const fs = require('fs').promises;
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
/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZjBjMjNlMzFiNDA0NDJiYTg1ZWE5YTZhNzk2OTNjYiIsImlhdCI6MTYzMjU5Mjc2OCwiZXhwIjoxOTQ3OTUyNzY4fQ.Iwln2UBqWAerPczPSLCCp0P5T5s_EcHsqgGFN28ER2Y';
  let data = bent({'Authorization': 'Bearer '+ token}, 'json')('https://ha.nesad.fit.vutbr.cz/api/states');
  data.then((data) => {
    res.render('index', {title: 'Dashboard', data: data});
  });
});

app.get('/monitoring', (req, res) => {
  res.render('monitoring', {title: 'Monitoring'});
});

app.get('/mib_objects', (req, res) => {
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyZjBjMjNlMzFiNDA0NDJiYTg1ZWE5YTZhNzk2OTNjYiIsImlhdCI6MTYzMjU5Mjc2OCwiZXhwIjoxOTQ3OTUyNzY4fQ.Iwln2UBqWAerPczPSLCCp0P5T5s_EcHsqgGFN28ER2Y';
  let data = bent({'Authorization': 'Bearer '+ token}, 'json')('https://ha.nesad.fit.vutbr.cz/api/states');
  data.then((data) => {
    res.render('mib_objects', {title: 'mib_objects', sensors: data});
  });
});

app.get('/mib_config', (req, res) => {
  res.render('mib_config', {title: 'mib_config'});
});

app.get('/mib_database', (req, res) => {
  res.render('mib_database', {title: 'mib_database'});
});

app.get('/nagios_config', (req, res) => {
  res.render('nagios_config', {title: 'nagios_config'});
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
