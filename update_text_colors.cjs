const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceTheme = (content) => {
    let newContent = content;

    // Remaining gold colors
    newContent = newContent.replace(/#d4af37/g, 'primary'); // Tailwind class usage like `ring-[#d4af37]` becomes `ring-primary`. Wait, `ring-primary` exists without brackets. Let's fix that.
    newContent = newContent.replace(/\[#d4af37\]/g, 'primary');
    newContent = newContent.replace(/\[#c5a059\]/g, 'blue-700');

    // Text colors designed for dark backgrounds
    newContent = newContent.replace(/text-slate-100/g, 'text-slate-800');
    newContent = newContent.replace(/text-slate-200/g, 'text-slate-700');
    newContent = newContent.replace(/text-slate-300/g, 'text-slate-600');
    newContent = newContent.replace(/text-slate-400/g, 'text-slate-500');

    // Remove any text-slate-950 on white backgrounds (optional, usually text-slate-950 is fine on white, but in some places we changed text to white on blue backgrounds)

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
    // Skip Sidebar.jsx as it has a navy background and needs light text
    if (page.includes('Sidebar.jsx') || page.includes('Login.jsx') || page.includes('Dashboard.jsx') || page.includes('App.jsx')) continue;

    const content = fs.readFileSync(page, 'utf8');
    const updated = replaceTheme(content);
    if (updated !== content) {
        fs.writeFileSync(page, updated);
        console.log(`Updated ${page}`);
    }
}
