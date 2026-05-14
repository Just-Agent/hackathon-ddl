import fs from 'node:fs';
const items=JSON.parse(fs.readFileSync(new URL('../data/items.json', import.meta.url),'utf8'));
const required=['id','title','deadline','status','url'];
let errors=0; const ids=new Set();
if(!Array.isArray(items)){console.error('data/items.json must be an array');process.exit(1);}
for(const [i,item] of items.entries()){for(const key of required){if(!item[key]){console.error(`item ${i} missing ${key}`);errors++;}} if(ids.has(item.id)){console.error(`duplicate id ${item.id}`);errors++;} ids.add(item.id); if(Number.isNaN(Date.parse(item.deadline))){console.error(`invalid deadline ${item.id}`);errors++;} if(item.url&&item.url!=='#'){try{new URL(item.url)}catch{console.error(`invalid url ${item.id}`);errors++;}}}
if(errors)process.exit(1); console.log(`validated ${items.length} DDL items`);
