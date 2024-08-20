// proxy.js
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS middleware
const app = express();
const PORT = 5001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/leetcode', async (req, res) => {
  try {
    const { query, variables } = req.body;
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching LeetCode data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
