// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

console.log(process.env.CLIENT_ID);

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
