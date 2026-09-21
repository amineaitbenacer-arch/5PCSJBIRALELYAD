const fs = require('fs');

function patchFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(
        /const fb1 = s\.fb_pixel_1 \|\| s\.fb_pixel_id;/g,
        "let fb1 = s.fb_pixel_1 || s.fb_pixel_id || ''; fb1 = fb1.replace(/\\D/g, '');"
    );
    content = content.replace(
        /const fb2 = s\.fb_pixel_2;/g,
        "let fb2 = s.fb_pixel_2 || ''; fb2 = fb2.replace(/\\D/g, '');"
    );
    
    fs.writeFileSync(file, content);
    console.log("Patched", file);
}

['index.html', 'public/index.html', 'thankyou.html', 'public/thankyou.html'].forEach(patchFile);
