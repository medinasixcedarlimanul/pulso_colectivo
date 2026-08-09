const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000; // Render uses PORT env var, defaults to 10000 on Render

// Serve static files from the root directory
app.use(express.static(__dirname));

// Send index.html for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
