const fs = require('fs');

const seedFile = './src/utils/seedDatabase.js';
let content = fs.readFileSync(seedFile, 'utf8');

// Replace all old size arrays with new size objects with stock
const replacements = [
  { old: "sizes: ['40', '41', '42', '43']", new: "sizes: [{ size: '40', stock: 6 }, { size: '41', stock: 8 }, { size: '42', stock: 7 }, { size: '43', stock: 6 }]" },
  { old: "sizes: ['39', '40', '41', '42', '43']", new: "sizes: [{ size: '39', stock: 4 }, { size: '40', stock: 6 }, { size: '41', stock: 5 }, { size: '42', stock: 4 }, { size: '43', stock: 3 }]" },
  { old: "sizes: ['40', '41', '42', '43', '44']", new: "sizes: [{ size: '40', stock: 8 }, { size: '41', stock: 10 }, { size: '42', stock: 7 }, { size: '43', stock: 6 }, { size: '44', stock: 4 }]" },
  { old: "sizes: ['38', '39', '40', '41', '42']", new: "sizes: [{ size: '38', stock: 3 }, { size: '39', stock: 4 }, { size: '40', stock: 5 }, { size: '41', stock: 4 }, { size: '42', stock: 3 }]" },
  { old: "sizes: ['39', '40', '41', '42']", new: "sizes: [{ size: '39', stock: 5 }, { size: '40', stock: 7 }, { size: '41', stock: 6 }, { size: '42', stock: 5 }]" },
  { old: "sizes: ['39', '40', '41', '42', '43', '44']", new: "sizes: [{ size: '39', stock: 3 }, { size: '40', stock: 5 }, { size: '41', stock: 6 }, { size: '42', stock: 5 }, { size: '43', stock: 4 }, { size: '44', stock: 3 }]" },
  { old: "sizes: ['S', 'M', 'L', 'XL', 'XXL']", new: "sizes: [{ size: 'S', stock: 12 }, { size: 'M', stock: 15 }, { size: 'L', stock: 13 }, { size: 'XL', stock: 10 }, { size: 'XXL', stock: 8 }]" },
  { old: "sizes: ['S', 'M', 'L', 'XL']", new: "sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 12 }, { size: 'L', stock: 11 }, { size: 'XL', stock: 9 }]" },
  { old: "sizes: ['S', 'M', 'L']", new: "sizes: [{ size: 'S', stock: 25 }, { size: 'M', stock: 35 }, { size: 'L', stock: 30 }]" },
  { old: "sizes: ['5']", new: "sizes: [{ size: '5', stock: 20 }]" },
  { old: "sizes: ['4', '5']", new: "sizes: [{ size: '4', stock: 15 }, { size: '5', stock: 20 }]" },
  { old: "sizes: ['7', '8', '9', '10', '11']", new: "sizes: [{ size: '7', stock: 5 }, { size: '8', stock: 7 }, { size: '9', stock: 6 }, { size: '10', stock: 5 }, { size: '11', stock: 2 }]" },
  { old: "sizes: ['7', '8', '9', '10']", new: "sizes: [{ size: '7', stock: 5 }, { size: '8', stock: 6 }, { size: '9', stock: 7 }, { size: '10', stock: 4 }]" }
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(seedFile, content);
console.log('✅ Updated seed file with size-specific stock quantities');
