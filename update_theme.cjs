const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

const replaceTheme = (content) => {
    let newContent = content;

    // Replace gold classes with primary/accent classes
    newContent = newContent.replace(/text-\[\#d4af37\]/g, 'text-primary');
    newContent = newContent.replace(/bg-\[\#d4af37\]/g, 'bg-primary');
    newContent = newContent.replace(/border-\[\#d4af37\]/g, 'border-primary');
    newContent = newContent.replace(/shadow-gold/g, 'shadow-primary');
    newContent = newContent.replace(/btn-gold/g, 'btn-primary');
    newContent = newContent.replace(/text-gradient-gold/g, 'text-gradient-primary');

    // Remove dark theme card backgrounds
    newContent = newContent.replace(/bg-slate-900/g, 'bg-white');
    newContent = newContent.replace(/bg-slate-950/g, 'bg-bg-main');
    newContent = newContent.replace(/border-slate-800/g, 'border-slate-200');

    return newContent;
};

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walkSync(filepath, filelist);
        } else if (filepath.endsWith('.jsx')) {
            filelist.push(filepath);
        }
    }
    return filelist;
};

const pages = walkSync(srcDir);
for (const page of pages) {
    const content = fs.readFileSync(page, 'utf8');
    const updated = replaceTheme(content);
    if (updated !== content) {
        fs.writeFileSync(page, updated);
        console.log(`Updated ${page}`);
    }
}
