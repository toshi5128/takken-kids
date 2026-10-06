// Lists every line the app can speak, for tools/voice_gen.py to record.
// usage: node tools/voice_list.js <kid name> > lines.json
const fs=require('fs'),path=require('path');
const {voiceText,voiceKey,panelParts,wordParts}=require('../voice.js');
const root=path.join(__dirname,'..'),name=process.argv[2]||'ねいろ';
const C=JSON.parse(fs.readFileSync(path.join(root,'data/course.json'),'utf8'));
const CHO=JSON.parse(fs.readFileSync(path.join(root,'data/cho.json'),'utf8'));
const out=new Map();
const add=([who,html])=>{const k=voiceKey(who,html);if(!out.has(k)&&voiceText(html,true))out.set(k,{key:k,who,kanji:voiceText(html,false),kana:voiceText(html,true)})};
for(const ch of C.chapters)for(const l of ch.lessons){
 for(const p of l.panels)panelParts(p).forEach(add);
 for(const q of l.quiz){add(['teacher',q.qHtml]);add(['teacher',q.whyHtml])}
}
for(const [t,w] of Object.entries(C.words))wordParts(w,CHO[t]?CHO[t].replace(/\{name\}/g,name):'').forEach(add);
add(['teacher','たっけんクエストへようこそ。いっしょにがんばろうワン！']);
process.stdout.write(JSON.stringify([...out.values()]));
