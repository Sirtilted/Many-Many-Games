const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'html');
const outputFile = path.join(htmlDir, 'folder-games.js');
const exclude = new Set(['player.html', 'style.css']);

function formatTitle(filename) {
  const name = filename.replace(/\.(html|htm)$/i, '');
  return name
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function buildList(files) {
  return files
    .filter(file => /\.(html|htm)$/i.test(file))
    .filter(file => !exclude.has(file.toLowerCase()))
    .sort((a, b) => formatTitle(a).localeCompare(formatTitle(b)));
}

try {
  const files = fs.readdirSync(htmlDir);
  const gameFiles = buildList(files);
  const output = `const folderGames = ${JSON.stringify(gameFiles, null, 2)};\n`;
  fs.writeFileSync(outputFile, output, 'utf8');
  console.log(`Generated ${outputFile} with ${gameFiles.length} games.`);
} catch (error) {
  console.error('Error generating game list:', error);
  process.exit(1);
}
