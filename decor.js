'use strict';
// Extra dress-up that needs no new illustrations: backgrounds, effects around the character, and a pet.
// Drawn in the same 200x320 frame as the character so it scales with any card size.
const R=(k,y)=>`<ruby>${k}<rt>${y}</rt></ruby>`;

ITEMS.push(
 // backgrounds
 {id:'g_class',cat:'bg',name:R('教室','きょうしつ'),st:0,p:40},
 {id:'g_park',cat:'bg',name:R('公園','こうえん'),st:0,p:40},
 {id:'g_flower',cat:'bg',name:'お'+R('花畑','はなばたけ'),st:0,p:60},
 {id:'g_rainbow',cat:'bg',name:'にじ',st:0,p:60},
 {id:'g_snow',cat:'bg',name:R('雪','ゆき')+'の'+R('日','ひ'),st:0,p:60},
 {id:'g_sea',cat:'bg',name:R('海','うみ'),st:0,p:80},
 {id:'g_amuse',cat:'bg',name:R('遊園地','ゆうえんち'),st:0,p:100},
 {id:'g_cafe',cat:'bg',name:'カフェ',st:1,p:80},
 {id:'g_yume',cat:'bg',name:'ゆめかわ',st:1,p:100},
 {id:'g_fire',cat:'bg',name:R('花火','はなび')+'大会',st:1,p:120},
 {id:'g_sunset',cat:'bg',name:R('夕','ゆう')+'やけビーチ',st:1,p:120},
 {id:'g_stage',cat:'bg',name:'ライブステージ',st:2,p:150},
 {id:'g_neon',cat:'bg',name:'ネオン'+R('街','がい'),st:2,p:150},
 // effects (float around the character)
 {id:'f_none',cat:'fx',name:'なし',st:0,p:0},
 {id:'f_kira',cat:'fx',name:'キラキラ',st:0,p:60,e:['✨']},
 {id:'f_heart',cat:'fx',name:'ハート',st:0,p:60,e:['💖','💗']},
 {id:'f_star',cat:'fx',name:R('星','ほし'),st:0,p:60,e:['⭐','🌟']},
 {id:'f_note',cat:'fx',name:R('音符','おんぷ'),st:0,p:80,e:['🎵','🎶']},
 {id:'f_bubble',cat:'fx',name:'シャボン'+R('玉','だま'),st:0,p:80,e:['🫧']},
 {id:'f_petal',cat:'fx',name:R('花','はな')+'びら',st:1,p:100,e:['🌸','🌷']},
 {id:'f_snowf',cat:'fx',name:R('雪','ゆき')+'の'+R('結晶','けっしょう'),st:1,p:100,e:['❄️']},
 {id:'f_candy',cat:'fx',name:'スイーツ',st:2,p:150,e:['🍬','🍭','🧁']},
 // pets at her feet
 {id:'p_none',cat:'pet',name:'なし',st:0,p:0},
 {id:'p_cat',cat:'pet',name:'ねこ',st:0,p:100,e:'🐱'},
 {id:'p_rabbit',cat:'pet',name:'うさぎ',st:0,p:100,e:'🐰'},
 {id:'p_ham',cat:'pet',name:'ハムスター',st:0,p:100,e:'🐹'},
 {id:'p_dog',cat:'pet',name:'こいぬ',st:0,p:100,e:'🐶'},
 {id:'p_chick',cat:'pet',name:'ひよこ',st:0,p:80,e:'🐥'},
 {id:'p_panda',cat:'pet',name:'パンダ',st:1,p:150,e:'🐼'},
 {id:'p_penguin',cat:'pet',name:'ペンギン',st:1,p:150,e:'🐧'},
 {id:'p_uni',cat:'pet',name:'ユニコーン',st:2,p:200,e:'🦄'},
);
CATS.push(['fx','エフェクト'],['pet','おとも']);
Object.assign(DEFAULT_LOOK,{fx:'f_none',pet:'p_none'});

const sky=(a,b)=>`<defs><linearGradient id="sk${a.slice(1)}${b.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="200" height="320" fill="url(#sk${a.slice(1)}${b.slice(1)})"/>`;
const dots=(pts,svg)=>pts.map(([x,y,s=1])=>svg(x,y,s)).join('');
Object.assign(BG_SCENES,{
 g_class:'<rect width="200" height="320" fill="#f6efe2"/><rect x="20" y="40" width="160" height="70" rx="4" fill="#2f5d4a" stroke="#8a6a44" stroke-width="5"/><text x="34" y="80" font-size="16" fill="#fff" opacity=".8">たっけん！</text><rect y="250" width="200" height="70" fill="#d9b98c"/>'+dots([[30],[100],[170]],x=>`<rect x="${x-14}" y="232" width="28" height="22" rx="3" fill="#b88a55"/>`),
 g_park:sky('#bfe6ff','#e8f7ff')+'<rect y="235" width="200" height="85" fill="#8fd17a"/><circle cx="34" cy="190" r="34" fill="#5fb85a"/><rect x="30" y="210" width="8" height="34" fill="#8a5a33"/><circle cx="170" cy="200" r="28" fill="#6cc46a"/><rect x="166" y="216" width="8" height="28" fill="#8a5a33"/><path d="M120 235 L130 190 L150 190 L160 235" fill="none" stroke="#ff8a3d" stroke-width="4"/>',
 g_flower:sky('#cfeeff','#fff6fb')+'<rect y="220" width="200" height="100" fill="#a6e08f"/>'+dots([[15,240],[45,262],[80,236],[120,258],[155,240],[185,265],[30,290],[95,295],[140,290],[180,300],[60,305]],(x,y)=>`<g transform="translate(${x} ${y})"><circle r="5" cx="0" cy="-5" fill="#ff8fb8"/><circle r="5" cx="5" cy="0" fill="#ffb3cf"/><circle r="5" cx="0" cy="5" fill="#ff8fb8"/><circle r="5" cx="-5" cy="0" fill="#ffb3cf"/><circle r="3" fill="#ffd23f"/></g>`),
 g_rainbow:sky('#bfe6ff','#f2fbff')+['#ff6f6f','#ffb547','#ffe066','#7fd67f','#5ab0ff','#b28cff'].map((c,i)=>`<path d="M${-20+i*9} 260 A${120-i*9} ${120-i*9} 0 0 1 ${220-i*9} 260" fill="none" stroke="${c}" stroke-width="9"/>`).join('')+'<circle cx="20" cy="250" r="22" fill="#fff"/><circle cx="185" cy="252" r="22" fill="#fff"/><rect y="262" width="200" height="58" fill="#a6e08f"/>',
 g_snow:sky('#cfe2f5','#f4f8ff')+'<rect y="240" width="200" height="80" fill="#fff"/><circle cx="160" cy="226" r="18" fill="#fff" stroke="#dde7f2"/><circle cx="160" cy="196" r="12" fill="#fff" stroke="#dde7f2"/>'+dots([[20,30],[60,80],[110,40],[150,110],[30,160],[180,60],[90,150]],(x,y)=>`<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`),
 g_sea:sky('#8fd3ff','#d8f2ff')+'<rect y="190" width="200" height="60" fill="#3fa9e0"/><path d="M0 200 Q25 194 50 200 T100 200 T150 200 T200 200" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><rect y="250" width="200" height="70" fill="#f5deb0"/><circle cx="160" cy="50" r="18" fill="#ffe066"/>',
 g_amuse:sky('#ffd6e8','#fff1f7')+'<circle cx="60" cy="150" r="58" fill="none" stroke="#b28cff" stroke-width="5"/>'+dots([[0],[45],[90],[135],[180],[225],[270],[315]],a=>{const r=a*Math.PI/180;return `<line x1="60" y1="150" x2="${60+58*Math.cos(r)}" y2="${150+58*Math.sin(r)}" stroke="#d8c6ff" stroke-width="2"/><rect x="${52+58*Math.cos(r)}" y="${144+58*Math.sin(r)}" width="16" height="12" rx="3" fill="${['#ff6fa5','#4aa8ff','#ffd23f','#7fd67f'][a/45%4]}"/>`})+'<path d="M140 250 L140 150 L190 150 L190 250" fill="#ff8fb8"/><path d="M135 150 L165 115 L195 150Z" fill="#ff6fa5"/><rect y="250" width="200" height="70" fill="#f3d9bd"/>',
 g_cafe:'<rect width="200" height="320" fill="#f3e3cf"/><rect y="0" width="200" height="20" fill="#7a4b2e"/>'+dots([[20],[60],[100],[140],[180]],x=>`<path d="M${x-10} 20 L${x} 40 L${x+10} 20Z" fill="${x%40?'#ff8fb8':'#fff'}"/>`)+'<rect x="20" y="70" width="60" height="80" rx="30" fill="#bfe6ff" stroke="#fff" stroke-width="5"/><rect y="250" width="200" height="70" fill="#c49a6c"/><circle cx="160" cy="236" r="14" fill="#fff"/><rect x="152" y="222" width="16" height="14" rx="3" fill="#ff8fb8"/>',
 g_yume:sky('#ffd1f0','#d6e4ff')+dots([[30,40],[150,30],[100,90],[20,150],[180,140],[60,210],[170,230]],(x,y)=>`<path d="M${x} ${y-7} L${x+2} ${y-2} L${x+7} ${y} L${x+2} ${y+2} L${x} ${y+7} L${x-2} ${y+2} L${x-7} ${y} L${x-2} ${y-2}Z" fill="#fff"/>`)+'<circle cx="40" cy="80" r="16" fill="#fff" opacity=".8"/><circle cx="58" cy="76" r="20" fill="#fff" opacity=".8"/><rect y="262" width="200" height="58" fill="#f7d3ef"/>',
 g_fire:'<rect width="200" height="320" fill="#1d2152"/>'+dots([[50,70,'#ff6fa5'],[140,60,'#ffd23f'],[100,120,'#7fd6ff']],(x,y,c)=>Array.from({length:12},(_,i)=>{const r=i*Math.PI/6;return `<line x1="${x}" y1="${y}" x2="${x+26*Math.cos(r)}" y2="${y+26*Math.sin(r)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`}).join(''))+'<rect y="250" width="200" height="70" fill="#2a2f6b"/>',
 g_sunset:sky('#ff9a6b','#ffd6a0')+'<circle cx="100" cy="190" r="34" fill="#ffe066"/><rect y="190" width="200" height="60" fill="#ff8a6b" opacity=".85"/><rect y="250" width="200" height="70" fill="#f5c98f"/><path d="M20 250 L26 170 M26 170 Q10 160 4 172 M26 170 Q40 156 50 170 M26 170 Q22 152 34 150" stroke="#3b6b3b" stroke-width="4" fill="none"/>',
 g_stage:'<rect width="200" height="320" fill="#2b1a3f"/><path d="M40 0 L0 260 L80 260Z" fill="#fff6a8" opacity=".25"/><path d="M160 0 L120 260 L200 260Z" fill="#ffb3e6" opacity=".25"/><path d="M100 0 L60 260 L140 260Z" fill="#a8e6ff" opacity=".2"/><rect y="250" width="200" height="70" fill="#5b2e7a"/><rect y="250" width="200" height="6" fill="#ffd23f"/>',
 g_neon:'<rect width="200" height="320" fill="#14122e"/>'+dots([[0,150,46],[44,120,40],[86,170,36],[124,110,44],[166,160,40]],(x,y,w)=>`<rect x="${x}" y="${y}" width="${w}" height="${320-y}" fill="#231f4f"/>`)+'<text x="20" y="100" font-size="20" fill="#ff5cc8" font-weight="bold">LOVE</text><text x="120" y="80" font-size="18" fill="#5cf0ff" font-weight="bold">♡OPEN</text><rect y="260" width="200" height="60" fill="#1d1a40"/>',
});

// effects: a few floating symbols in front of the character
function fxLayer(id){
 const it=ITEMS.find(i=>i.id===id);if(!it||!it.e)return'';
 const spots=[[22,40],[170,60],[30,150],[178,170],[60,90],[150,250],[18,240],[120,30]];
 return `<svg class="fx" viewBox="0 0 200 320" preserveAspectRatio="xMidYMid slice">${spots.map(([x,y],i)=>`<text x="${x}" y="${y}" font-size="${16+(i%3)*5}" style="animation-delay:${i*.35}s">${it.e[i%it.e.length]}</text>`).join('')}</svg>`;
}
function petLayer(id){const it=ITEMS.find(i=>i.id===id);return it&&it.e?`<svg class="petl" viewBox="0 0 200 320" preserveAspectRatio="xMidYMid slice"><text x="12" y="306" font-size="38">${it.e}</text></svg>`:''}

// Illustrated worlds (Gemini sheet "小学5年生女子の好きな世界", cut by hand into art/bg/w_*.jpg)
const WORLDS=[
 ['gummy','グミベアワンダーランド',80],['unicorn','ユニコーンの'+R('夢','ゆめ')+'のお'+R('城','しろ'),120],['cyber','サイバーカフェ',100],
 ['planet','うかぶプラネタリウム',120],['mermaid','マーメイド'+R('学園','がくえん'),150],['animal','どうぶつの'+R('村','むら'),80],
 ['booknook','まほうの'+R('本','ほん')+'の'+R('木','き'),100],['crystal','クリスタルの'+R('森','もり'),120],['skycarnival',''+R('空','そら')+'のカーニバル',150],
 ['treehouse','ひみつのツリーハウス',100],
];
for(const [id,name,p] of WORLDS){
 ITEMS.push({id:'w_'+id,cat:'bg',name,st:0,p});
 BG_SCENES['w_'+id]=`<image href="art/bg/w_${id}.jpg" width="200" height="320" preserveAspectRatio="xMidYMid slice"/>`;
}
