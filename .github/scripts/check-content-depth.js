const fs = require('fs');
const path = require('path');

// Function to count words in HTML content
function countWords(html) {
  // Remove script tags and their content
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove style tags and their content
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags
  html = html.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  html = html.replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");
  
  // Remove extra whitespace
  html = html.replace(/\s+/g, ' ').trim();
  
  // Count words
  const words = html.split(' ').filter(word => word.length > 0);
  return words.length;
}

// Function to analyze a single file
function analyzeFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const wordCount = countWords(content);
  const filename = path.basename(filepath);
  
  // Extract title
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : filename;
  
  return {
    filepath: filepath.replace(/\\/g, '/'),
    filename,
    title,
    wordCount,
    needsExpansion: wordCount < 2000
  };
}

// Function to scan all HTML files
function scanAllPages() {
  const results = [];
  
  // Scan root directory
  const rootFiles = fs.readdirSync('.').filter(f => 
    f.endsWith('.html') && 
    f !== '404.html' && 
    f !== 'google-verification-template.html'
  );
  rootFiles.forEach(file => {
    results.push(analyzeFile(path.join('.', file)));
  });
  
  // Scan subdirectories
  const subdirs = ['routes', 'calculators', 'industries', 'blog'];
  subdirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const scanDir = (dirPath) => {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
          const filepath = path.join(dirPath, file);
          if (fs.statSync(filepath).isDirectory()) {
            scanDir(filepath);
          } else if (file.endsWith('.html') && file !== 'index.html') {
            results.push(analyzeFile(filepath));
          }
        });
      };
      scanDir(dir);
    }
  });
  
  return results;
}

// Generate report
function generateReport() {
  const results = scanAllPages();
  
  // Sort by word count (ascending)
  results.sort((a, b) => a.wordCount - b.wordCount);
  
  // Statistics
  const total = results.length;
  const needsExpansion = results.filter(r => r.needsExpansion).length;
  const avgWordCount = Math.round(results.reduce((sum, r) => sum + r.wordCount, 0) / total);
  
  console.log('='.repeat(80));
  console.log('CONTENT DEPTH ANALYSIS REPORT');
  console.log('='.repeat(80));
  console.log(`\nTotal pages analyzed: ${total}`);
  console.log(`Pages needing expansion (< 2000 words): ${needsExpansion}`);
  console.log(`Average word count: ${avgWordCount}`);
  console.log('\n' + '='.repeat(80));
  console.log('PAGES NEEDING CONTENT EXPANSION:');
  console.log('='.repeat(80));
  
  // Show pages that need expansion
  results.filter(r => r.needsExpansion).forEach(page => {
    const deficit = 2000 - page.wordCount;
    console.log(`\n📄 ${page.filepath}`);
    console.log(`   Title: ${page.title}`);
    console.log(`   Current: ${page.wordCount} words`);
    console.log(`   Needed: +${deficit} words`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('TOP 10 SHORTEST PAGES:');
  console.log('='.repeat(80));
  
  results.slice(0, 10).forEach((page, index) => {
    console.log(`${index + 1}. ${page.filepath} - ${page.wordCount} words`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('PAGES MEETING REQUIREMENT (>= 2000 words):');
  console.log('='.repeat(80));
  
  results.filter(r => !r.needsExpansion).forEach(page => {
    console.log(`✅ ${page.filepath} - ${page.wordCount} words`);
  });
  
  // Save detailed report to file
  const reportData = {
    generated: new Date().toISOString(),
    statistics: {
      total,
      needsExpansion,
      avgWordCount
    },
    pages: results
  };
  
  fs.writeFileSync('content-depth-report.json', JSON.stringify(reportData, null, 2));
  console.log('\n💾 Detailed report saved to: content-depth-report.json');
}

// Run the analysis
generateReport();