const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: "Basic server works!" });
});

app.listen(5000, () => console.log('Test server running on port 5000'));