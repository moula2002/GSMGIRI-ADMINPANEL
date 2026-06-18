const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceTheme = (content) => {
    let newContent = content;

    newContent = newContent.replace(/bg-bg-main/g, 'bg-[#F8FAFC]');
    newContent = newContent.replace(/bg-slate-header/g, 'bg-[#1E293B]');
    newContent = newContent.replace(/bg-slate-search/g, 'bg-[#334155]');
    newContent = newContent.replace(/border-slate-border/g, 'border-[#475569]');

    newContent = newContent.replace(/text-text-dark/g, 'text-[#111827]');
    newContent = newContent.replace(/text-text-light/g, 'text-[#64748B]');

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
