const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const filesToCopy = ['index.html', 'thankyou.html', 'admin.html', 'style.css', 'styles.css', 'app.js', 'script.js'];
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(publicDir, file));
  }
});

const imagesDir = path.join(__dirname, 'images');
const publicImagesDir = path.join(publicDir, 'images');
if (fs.existsSync(imagesDir)) {
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir);
  }
  fs.readdirSync(imagesDir).forEach(file => {
    fs.copyFileSync(path.join(imagesDir, file), path.join(publicImagesDir, file));
  });
}

console.log('Build complete: Static files copied to public/ for Vercel deployment.');
