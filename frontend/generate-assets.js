const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Minimal 1x1 valid PNG base64
const b64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGBgAAAABQABh6+kcQAAAABJRU5ErkJggg==';
const buffer = Buffer.from(b64Png, 'base64');

['favicon.png', 'icon.png', 'splash.png', 'adaptive-icon.png'].forEach(file => {
  fs.writeFileSync(path.join(assetsDir, file), buffer);
});
console.log('Assets created successfully');
