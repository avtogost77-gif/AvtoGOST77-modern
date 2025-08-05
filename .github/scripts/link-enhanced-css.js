const fs = require('fs');
const path = require('path');

// Pages that were enhanced
const enhancedPages = [
  'about.html',
  'contact.html',
  'blog-3-spot-orders.html'
];

// Function to add CSS link to a page
function addCSSLink(filepath) {
  console.log(`Processing: ${filepath}`);
  
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Check if the CSS is already linked
  if (content.includes('enhanced-content.css')) {
    console.log('  ✓ CSS already linked');
    return;
  }
  
  // Find where to insert the CSS link (after the main CSS)
  const mainCSSMatch = content.match(/<link[^>]+styles[^>]+\.css[^>]*>/);
  
  if (mainCSSMatch) {
    const insertIndex = content.indexOf(mainCSSMatch[0]) + mainCSSMatch[0].length;
    const cssLink = '\n  <link rel="stylesheet" href="assets/css/enhanced-content.css">';
    
    content = content.slice(0, insertIndex) + cssLink + content.slice(insertIndex);
    
    fs.writeFileSync(filepath, content);
    console.log('  ✓ Added CSS link');
  } else {
    console.log('  ⚠️  Could not find main CSS link');
  }
}

// Process all enhanced pages
console.log('Adding enhanced-content.css to enhanced pages...\n');

enhancedPages.forEach(page => {
  if (fs.existsSync(page)) {
    addCSSLink(page);
  }
});

console.log('\n✅ CSS linking complete!');