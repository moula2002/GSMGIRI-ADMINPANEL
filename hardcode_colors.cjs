const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceTheme = (content) => {
    let newContent = content;

    // The previous dev inverted the slate palette. 
    // To ensure the UI looks perfect and ignores the cached inverted palette, we will hardcode the text and border colors to the exact hex values specified in the plan.
    
    // Borders -> #E2E8F0
    newContent = newContent.replace(/border-slate-[0-9]{2,3}/g, 'border-[#E2E8F0]');
    
    // Light Text -> #64748B
    newContent = newContent.replace(/text-slate-(400|500|600)/g, 'text-[#64748B]');
    
    // Dark Text -> #111827
    newContent = newContent.replace(/text-slate-(700|800|900|950|50|100)/g, 'text-[#111827]');
    
    // Backgrounds -> White or Light Gray
    // Replace light grays (in inverted scale, 900/950 were white, 50/100 were black). Let's just make sure backgrounds are standard.
    // If it's a card, it should be bg-white.
    newContent = newContent.replace(/bg-slate-[0-9]{2,3}/g, 'bg-[#F8FAFC]');

    // Fix specific elements that should have white text (like inside gradients or navy background)
    newContent = newContent.replace(/text-\[\#111827\] font-black block tracking-tight text-\[\#111827\]/g, 'text-[#111827] font-black block tracking-tight'); // Deduplicate
    
    // Sidebar specific (needs white text on Navy)
    // Wait, Sidebar has bg-[#0F172A]. Any text inside it should be white. We can't do this with a blanket regex easily, so we will skip Sidebar and Dashboard for the blanket regex, or do them explicitly.
    
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
    if (page.includes('Sidebar.jsx')) continue; // Sidebar needs custom text colors
    
    const content = fs.readFileSync(page, 'utf8');
    const updated = replaceTheme(content);
    if (updated !== content) {
        fs.writeFileSync(page, updated);
        console.log(`Updated ${page}`);
    }
}
