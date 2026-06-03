const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static(__dirname));

// Function to format game title from filename
function formatGameTitle(filename) {
  // Remove .html or .htm extension
  const name = filename.replace(/\.(html|htm)$/i, '');
  
  // Replace hyphens and underscores with spaces
  let formatted = name.replace(/[-_]/g, ' ');
  
  // Capitalize first letter of each word
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return formatted;
}

// API endpoint to get list of all games
app.get('/api/games', (req, res) => {
  const htmlDir = path.join(__dirname, 'html');
  
  try {
    const files = fs.readdirSync(htmlDir);
    
    // Filter for HTML files only (excluding system files)
    const games = files
      .filter(file => /\.(html|htm)$/i.test(file) && file !== 'player.html')
      .map(file => ({
        title: formatGameTitle(file),
        filename: file,
        path: `/html/${encodeURIComponent(file)}`
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
    
    res.json(games);
  } catch (error) {
    console.error('Error reading html directory:', error);
    res.status(500).json({ error: 'Failed to read games directory' });
  }
});

// Serve the main index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎮 Game Launcher running at http://localhost:${PORT}`);
  console.log(`📁 Games directory: ${path.join(__dirname, 'html')}`);
  console.log(`ℹ️  Press Ctrl+C to stop the server`);
});
