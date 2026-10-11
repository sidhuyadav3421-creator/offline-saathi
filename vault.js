"use strict";
const Vault=(()=>{
 const DB='offline-saathi-encrypted-v2',VERSION=1, ITERATIONS=310000, encoder=new TextEncoder(), decoder=new TextDecoder();
 const bytes=n=>crypto.getRandomValues(new Uint8Array(n));
 const encode=a=>btoa(String.fromCharCode(...new Uint8Array(a)));
 const decode=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 let database,secret=null,config=null;
 function open(){if(database)return Promise.resolve(database);return new Promise((resolve,reject)=>{let req=indexedDB.open(DB,VERSION);req.onupgradeneeded=()=>{let d=req.result;d.createObjectStore('settings');d.createObjectStore('records',{keyPath:'id'})};req.onsuccess=()=>{database=req.result;resolve(database)};req.onerror=()=>reject(req.error)})}
 async function request(store,mode,call){let d=await open();return new Promise((resolve,reject)=>{let tx=d.transaction(store,mode),r=call(tx.objectStore(store));r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);tx.onabort=()=>reject(tx.error||new Error('Storage transaction aborted'))})}
 async function load(){config=await request('settings','readonly',s=>s.get('vault'));return !!config}
 async function derive(pass,salt){let base=await crypto.subtle.importKey('raw',encoder.encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
 async function seal(value,key=secret){if(!key)throw Error('Vault locked');const iv=bytes(12),ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,encoder.encode(JSON.stringify(value)));return {iv:encode(iv),ciphertext:encode(ct)}}
 async function unseal(obj,key=secret){if(!key)throw Error('Vault locked');const buffer=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(obj.iv)},key,decode(obj.ciphertext));return JSON.parse(decoder.decode(buffer))}
 async function create(pass){if((await load()))throw Error('Vault already exists');if(pass.length<12)throw Error('Use at least 12 characters');let salt=bytes(16),key=await derive(pass,salt),check=await seal({marker:'offline-saathi-v2'},key);let value={format:2,salt:encode(salt),iterations:ITERATIONS,check};await request('settings','readwrite',s=>s.put(value,'vault'));config=value;secret=key}
 async function unlock(pass){if(!config)await load();if(!config)throw Error('Create vault first');let key=await derive(pass,decode(config.salt));let check=await unseal(config.check,key);if(check.marker!=='offline-saathi-v2')throw Error('Incorrect passphrase');secret=key}
 const lock=()=>{secret=null};
 async function add(note){if(!secret)throw Error('Vault locked');let id=crypto.randomUUID(),data=await seal(note);await request('records','readwrite',s=>s.put({id,...data}))}
 async function list(){if(!secret)throw Error('Vault locked');let records=await request('records','readonly',s=>s.getAll());let result=[];for(let r of records)result.push({id:r.id,...await unseal(r)});return result.sort((a,b)=>b.created-a.created)}
 async function remove(id){if(!secret)throw Error('Vault locked');await request('records','readwrite',s=>s.delete(id))}
 async function clear(){if(!secret)throw Error('Vault locked');await request('records','readwrite',s=>s.clear())}
 async function exportBackup(){if(!secret)throw Error('Vault locked');return {application:'Offline Saathi',backupVersion:2,exported:new Date().toISOString(),config,records:await request('records','readonly',s=>s.getAll())}}
 async function importBackup(bundle){if(!secret)throw Error('Unlock an existing vault before importing');if(bundle?.backupVersion!==2||!Array.isArray(bundle.records)||!bundle.config||bundle.records.length>10000)throw Error('Invalid backup file');if(bundle.config.salt!==config.salt||bundle.config.check.ciphertext!==config.check.ciphertext)throw Error('Backup belongs to a different vault. Restore with its original passphrase in a separate browser profile.');for(const rec of bundle.records){if(typeof rec.id!=='string'||typeof rec.iv!=='string'||typeof rec.ciphertext!=='string')throw Error('Invalid encrypted record');await unseal(rec)}await new Promise(async(resolve,reject)=>{try{let d=await open(),tx=d.transaction('records','readwrite');for(const rec of bundle.records)tx.objectStore('records').put(rec);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)}catch(e){reject(e)}})}
 return {load,create,unlock,lock,add,list,remove,clear,exportBackup,importBackup,isUnlocked:()=>!!secret};
})();
