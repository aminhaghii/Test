import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function fixImageUrls() {
  // Files that need to be updated
  const files = await glob('src/**/*.{ts,tsx}', { ignore: ['**/*.d.ts', '**/node_modules/**'] });

  let updatedCount = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Check if file uses API_URL for images
    if (content.includes('${API_URL}/ALMAS') || 
        content.includes('${API_URL}/DECORED') || 
        content.includes('${API_URL}/Content')) {
      
      // Add import if not present
      if (!content.includes("from '@/lib/getImageUrl'") && !content.includes('from "@/lib/getImageUrl"')) {
        // Find the last import statement
        const importMatch = content.match(/(import\s+.*?from\s+['"].*?['"];?\s*\n)+/g);
        if (importMatch) {
          const lastImport = importMatch[importMatch.length - 1];
          const insertPos = content.indexOf(lastImport) + lastImport.length;
          content = content.slice(0, insertPos) + 
                    "import { getImageUrl } from '@/lib/getImageUrl';\n" + 
                    content.slice(insertPos);
          modified = true;
        }
      }
      
      // Replace ${API_URL}/ALMAS/... with getImageUrl('/ALMAS/...')
      content = content.replace(
        /\$\{API_URL\}\/ALMAS\/([^`"'\s\)]+)/g,
        (match, imagePath) => {
          modified = true;
          return `getImageUrl('/ALMAS/${imagePath}')`;
        }
      );
      
      // Replace ${API_URL}/DECORED/... with getImageUrl('/DECORED/...')
      content = content.replace(
        /\$\{API_URL\}\/DECORED\/([^`"'\s\)]+)/g,
        (match, imagePath) => {
          modified = true;
          return `getImageUrl('/DECORED/${imagePath}')`;
        }
      );
      
      // Replace ${API_URL}/Content/... with getImageUrl('/Content/...')
      content = content.replace(
        /\$\{API_URL\}\/Content\/([^`"'\s\)]+)/g,
        (match, imagePath) => {
          modified = true;
          return `getImageUrl('/Content/${imagePath}')`;
        }
      );
      
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`✓ Updated: ${file}`);
      }
    }
  }

  console.log(`\n✅ Updated ${updatedCount} files`);
}

fixImageUrls().catch(console.error);

