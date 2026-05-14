import fs from 'node:fs'; import path from 'node:path';
const sources=JSON.parse(fs.readFileSync(new URL('../data/sources.json', import.meta.url),'utf8'));
const report={generatedAt:new Date().toISOString(),mode:'seed-plan',sources};
console.log(JSON.stringify(report,null,2));
if(process.argv.includes('--write-report')){fs.mkdirSync('reports',{recursive:true});fs.writeFileSync(path.join('reports','crawl-plan.json'),JSON.stringify(report,null,2));}
