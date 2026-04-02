import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const dist = path.join(root, 'dist');

// Clean and create dist
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist, { recursive: true });

// Copy static files — main site
fs.copyFileSync(path.join(root, 'index.html'), path.join(dist, 'index.html'));
if (fs.existsSync(path.join(root, 'david-hopper.png'))) {
  fs.copyFileSync(path.join(root, 'david-hopper.png'), path.join(dist, 'david-hopper.png'));
}

// Copy writing essays
const writingDirs = fs.readdirSync(path.join(root, 'writing'));
for (const dir of writingDirs) {
  const src = path.join(root, 'writing', dir);
  const dst = path.join(dist, 'writing', dir);
  fs.mkdirSync(dst, { recursive: true });
  fs.copyFileSync(path.join(src, 'index.html'), path.join(dst, 'index.html'));
  console.log(`✓ writing/${dir}`);
}

// Build each React tool
const toolDirs = fs.readdirSync(path.join(root, 'tools'));
for (const tool of toolDirs) {
  const toolPath = path.join(root, 'tools', tool);
  if (!fs.existsSync(path.join(toolPath, 'package.json'))) continue;

  console.log(`Building tools/${tool}...`);
  
  // Install deps and build
  execSync('npm install --silent', { cwd: toolPath, stdio: 'inherit' });
  execSync(`npx vite build --outDir ${path.join(dist, 'tools', tool)} --base /tools/${tool}/`, { 
    cwd: toolPath, 
    stdio: 'inherit' 
  });
  
  console.log(`✓ tools/${tool}`);
}

console.log('\nBuild complete.');
