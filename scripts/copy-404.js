import { copyFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const distPath = join(process.cwd(), 'dist')
const indexPath = join(distPath, 'index.html')
const notFoundPath = join(distPath, '404.html')
const noJekyllPath = join(distPath, '.nojekyll')

try {
  // Copy index.html to 404.html for GitHub Pages routing
  copyFileSync(indexPath, notFoundPath)
  console.log('✅ Copied index.html to 404.html for GitHub Pages routing')
  
  // Create .nojekyll file to disable Jekyll processing
  writeFileSync(noJekyllPath, '')
  console.log('✅ Created .nojekyll file')
} catch (error) {
  console.error('❌ Error:', error)
  process.exit(1)
}

