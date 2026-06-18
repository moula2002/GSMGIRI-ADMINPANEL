const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceTheme = (content) => {
    let newContent = content;

    // Replace custom tailwind colors with hardcoded brackets or standard colors to fix Vite not picking them up
    newContent = newContent.replace(/bg-navy/g, 'bg-[#0F172A]');
    newContent = newContent.replace(/text-navy/g, 'text-[#0F172A]');
    newContent = newContent.replace(/border-navy/g, 'border-[#0F172A]');

    newContent = newContent.replace(/text-primary/g, 'text-[#2563EB]');
    newContent = newContent.replace(/bg-primary/g, 'bg-[#2563EB]');
    newContent = newContent.replace(/border-primary/g, 'border-[#2563EB]');
    newContent = newContent.replace(/ring-primary/g, 'ring-[#2563EB]');
    newContent = newContent.replace(/shadow-primary/g, 'shadow-blue');

    newContent = newContent.replace(/text-accent/g, 'text-[#06B6D4]');
    newContent = newContent.replace(/bg-accent/g, 'bg-[#06B6D4]');
    
    newContent = newContent.replace(/text-status-success/g, 'text-[#10B981]');
    newContent = newContent.replace(/bg-status-success/g, 'bg-[#10B981]');
    newContent = newContent.replace(/border-status-success/g, 'border-[#10B981]');

    newContent = newContent.replace(/text-status-warning/g, 'text-[#F59E0B]');
    newContent = newContent.replace(/bg-status-warning/g, 'bg-[#F59E0B]');
    newContent = newContent.replace(/border-status-warning/g, 'border-[#F59E0B]');

    newContent = newContent.replace(/text-status-danger/g, 'text-[#EF4444]');
    newContent = newContent.replace(/bg-status-danger/g, 'bg-[#EF4444]');
    newContent = newContent.replace(/border-status-danger/g, 'border-[#EF4444]');

    // Dashboard gradient text fixes
    newContent = newContent.replace(/text-gradient-primary/g, 'text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]');

    // Fix any text-slate-800 that isn't showing up because it inherited white or similar?
    // Wait, text-slate-800 works natively in Tailwind. If the numbers were faint, it was because `text-primary`, `text-status-success`, etc. were missing.

    return newContent;
};

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walkSync(filepath, filelist);
        } else if (filepath.endsWith('.jsx') || filepath.endsWith('.css') || filepath.endsWith('.js')) {
            filelist.push(filepath);
        }
    }
    return filelist;
};

const files = walkSync(srcDir);
for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const updated = replaceTheme(content);
    if (updated !== content) {
        fs.writeFileSync(file, updated);
        console.log(`Updated ${file}`);
    }
}
