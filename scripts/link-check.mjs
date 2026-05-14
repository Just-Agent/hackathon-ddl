import fs from 'node:fs';
const items=JSON.parse(fs.readFileSync(new URL('../data/items.json', import.meta.url),'utf8'));
for(const item of items){ if(!item.url||item.url==='#')continue; try{new URL(item.url); console.log(`seed link ${item.id}: ${item.url}`)}catch{console.warn(`bad url ${item.id}: ${item.url}`);} }
