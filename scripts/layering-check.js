const fs = require('fs');
const path = require('path');

const violations = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (
      line.includes('import') &&
      (line.includes('/data/') || line.includes('/services/'))
    ) {
      violations.push({
        file: filePath,
        line: index + 1,
        content: line.trim(),
      });
    }
  });
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fullPath.includes('components') || fullPath.includes('pages')) {
        checkFile(fullPath);
      }
    }
  });
}

walkDir('./src');

if (violations.length > 0) {
  console.log('GATE 4 FAILED — layering violations:');
  violations.forEach((v) => {
    console.log(`  ${v.file} line ${v.line}: ${v.content}`);
  });
  process.exit(1);
} else {
  console.log('GATE 4 PASSED — no layering violations.');
  process.exit(0);
}
