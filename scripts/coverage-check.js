const fs = require('fs');

if (!fs.existsSync('./BACKLOG.md')) {
  console.log('BACKLOG.md not found');
  process.exit(1);
}

if (!fs.existsSync('./review.md')) {
  console.log('review.md not found');
  process.exit(1);
}

const backlog = fs.readFileSync('./BACKLOG.md', 'utf8');
const review = fs.readFileSync('./review.md', 'utf8');

const matches = backlog.match(/\[ \] .+/g) || [];
const criteria = matches.map((c) => c.replace('[ ] ', '').trim());

const missing = [];

criteria.forEach((criterion) => {
  const keywords = criterion
    .toLowerCase()
    .split(' ')
    .filter((w) => w.length > 4);

  const covered = keywords.some((word) => review.toLowerCase().includes(word));

  if (!covered) missing.push(criterion);
});

if (missing.length > 0) {
  console.log('COVERAGE CHECK FAILED');
  console.log('Not addressed in review.md:');
  missing.forEach((m) => console.log(`  - ${m}`));
  process.exit(1);
} else {
  console.log('COVERAGE CHECK PASSED');
  console.log(`All ${criteria.length} criteria addressed.`);
  process.exit(0);
}
