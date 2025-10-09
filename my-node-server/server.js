const express = require('express');
const app = express();
const port = 5000; 

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from Server!' 
  });
});

app.listen(port, () => {
  console.log(`✅ Server Node.js berjalan di http://localhost:${port}`);
  console.log(`(Silakan buka http://localhost:3000 untuk aplikasi React)`);
});
