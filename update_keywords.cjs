const fs = require('fs');

const keywordFile = 'c:\\Dhyey\\TSD\\seo-keywords.txt';
const targetFile = 'c:\\Dhyey\\TSD\\src\\app\\components\\SEO-fallback.tsx';

let allKeywords = fs.readFileSync(keywordFile, 'utf8').split('\n').map(l => l.trim().replace(/'/g, "")).filter(l => l.length > 0);

// Taking a wider slice to avoid duplicates with what we might already have
let selected = allKeywords.slice(1500, 2500);

const groups = {
  home: selected.slice(0, 200),
  about: selected.slice(200, 400),
  services: selected.slice(400, 600),
  gallery: selected.slice(600, 800),
  contact: selected.slice(800, 1000)
};

let content = fs.readFileSync(targetFile, 'utf8');

for (const key of Object.keys(groups)) {
  const newKws = groups[key].join(', ');
  
  // Replace only the keywords string within the specified key block
  const regex = new RegExp(`(${key}: \\{(?:[^{}]|\\{[^{}]*\\})*?keywords:\\s*')((?:[^'\\\\]|\\\\.)*)(')`, '');
  
  if (regex.test(content)) {
    content = content.replace(regex, `$1$2, ${newKws}$3`);
  }
}

fs.writeFileSync(targetFile, content);
console.log('Successfully appended 200 keywords per category (1000 total) without removing the existing ones.');
