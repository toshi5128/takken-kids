'use strict';
// ---------- recorded voices (VOICEVOX) ----------
// Every line is split into parts [who, html]. A part's clip is voice/<key>.m4a, key = hash of who + the
// furigana reading, so the clip always says exactly what is on screen. tools/voice_list.js runs this same
// file in node to list the lines to record. A part with no clip (e.g. a different name) falls back to the
// phone's speech engine.
const VOICE_WHO={teacher:'teacher',neko:'teacher',point:'teacher',zu:'teacher',mirai:'girl'};
const VOICE_UNESC={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&nbsp;':' '};
function voiceText(html,kana){
 let s=String(html).replace(/<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g,kana?'$2':'$1');
 return s.replace(/<br\s*\/?>/g,'。').replace(/<[^>]+>/g,'').replace(/&[a-z#0-9]+;/g,m=>VOICE_UNESC[m]||'').replace(/\s+/g,' ').trim();
}
function voiceKey(who,html){
 const s=who+'|'+voiceText(html,true);let a=0x811c9dc5,b=0x01000193;
 for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a=Math.imul(a^c,16777619)>>>0;b=Math.imul(b^c,2246822519)>>>0}
 return a.toString(16).padStart(8,'0')+b.toString(16).padStart(8,'0');
}
const zuMark=h=>h==='○'?'まる':h==='×'?'ばつ':h;
function panelParts(p){
 if(p.who==='zu')return [['teacher','<ruby>図<rt>ず</rt></ruby>で<ruby>見<rt>み</rt></ruby>てみよう。'+p.titleHtml],...p.tableHtml.slice(1).map(r=>['teacher',r.map(zuMark).join('、')])];
 if(p.who==='point')return [['teacher','ここがポイント！'],['teacher',p.html]];
 return [[VOICE_WHO[p.who]||'teacher',p.html]];
}
// word sheet: reading, one-liner (may contain the kid's name), meaning, example
function wordParts(w,choHtml){
 return [['teacher',w.yomi],...(choHtml?[['teacher','ひとことでいうと、'],['teacher',choHtml]]:[]),['teacher',w.meanHtml],['teacher','たとえば、'],['teacher',w.tatoeHtml]];
}
if(typeof module!=='undefined')module.exports={voiceText,voiceKey,panelParts,wordParts};
