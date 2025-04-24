const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Chat API endpoint
app.post('/api/chat', (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'No query content provided' });
  }

  // Set environment variable for query passing
  const env = { ...process.env };
  env.TEST_QUERY = query;

  // Run Python script
  const pythonProcess = spawn('python', [
    path.join(__dirname, 'src/rag.py')
  ], { env });

  let result = '';
  let error = '';

  // Collect data
  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  // When script is finished
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with error code ${code}`);
      console.error(`Error: ${error}`);
      return res.status(500).json({ error: 'Failed to process query' });
    }
    
    // Try to extract answer part
    try {
      // Find content after "Answer from GPT-4o:"
      const answerMatch = result.match(/Answer from GPT-4o:\s*\n\s*([\s\S]*)/);
      const answer = answerMatch ? answerMatch[1].trim() : result.trim();
      
      res.json({ answer });
    } catch (e) {
      console.error('Error parsing Python script output:', e);
      res.json({ answer: result.trim() });
    }
  });
});

// All other GET requests return React application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});