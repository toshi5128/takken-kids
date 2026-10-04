'use strict';
// The player's own character: grows with level (小学生 → 中学生 → 高校生ギャル) and is dressed up with shop items.
// Everything is drawn as layered SVG so every combination of item works without image files.

const STAGES=[
 {name:'小学生',from:1,hr:44,hy:84,sw:30,leg:288,lash:false},
 {name:'中学生',from:5,hr:41,hy:74,sw:31,leg:298,lash:false},
 {name:'高校生ギャル',from:10,hr:38,hy:64,sw:31,leg:308,lash:true},
];
function stageOf(level){let s=0;STAGES.forEach((st,i)=>{if(level>=st.from)s=i});return s}

// cat: shop tab, st: stage that unlocks it, p: price in coins (0 = owned from the start)
const ITEMS=[
 // hair styles
 {id:'h_bob',cat:'hair',name:'ボブ',st:0,p:0},
 {id:'h_pony',cat:'hair',name:'ポニーテール',st:0,p:40},
 {id:'h_twin',cat:'hair',name:'ツインテール',st:0,p:60},
 {id:'h_long',cat:'hair',name:'ロングストレート',st:1,p:80},
 {id:'h_side',cat:'hair',name:'サイドポニー',st:1,p:80},
 {id:'h_wave',cat:'hair',name:'ゆる<ruby>巻<rt>ま</rt></ruby>きロング',st:2,p:150},
 {id:'h_bun',cat:'hair',name:'おだんごツイン',st:2,p:150},
 // hair colors
 {id:'c_brown',cat:'color',name:'<ruby>茶色<rt>ちゃいろ</rt></ruby>',st:0,p:0,c:'#6b4431'},
 {id:'c_black',cat:'color',name:'<ruby>黒<rt>くろ</rt></ruby>',st:0,p:20,c:'#2f2a2e'},
 {id:'c_milk',cat:'color',name:'ミルクティー',st:1,p:80,c:'#c9a27e'},
 {id:'c_pink',cat:'color',name:'ピンク',st:2,p:150,c:'#f58bb8'},
 {id:'c_gold',cat:'color',name:'<ruby>金<rt>きん</rt></ruby>ぱつ',st:2,p:150,c:'#f2c75c'},
 {id:'c_mint',cat:'color',name:'ミント',st:2,p:150,c:'#7fd6c2'},
 // tops
 {id:'t_hoodie',cat:'top',name:'<ruby>黄色<rt>きいろ</rt></ruby>パーカー',st:0,p:0,c:'#ffd23f'},
 {id:'t_tee',cat:'top',name:'ボーダーT',st:0,p:30,c:'#ffffff',c2:'#4aa8ff'},
 {id:'t_sailor',cat:'top',name:'セーラー<ruby>服<rt>ふく</rt></ruby>',st:1,p:100,c:'#ffffff',c2:'#2c3e6b'},
 {id:'t_blazer',cat:'top',name:'ブレザー',st:1,p:120,c:'#3d4b7a',c2:'#e64b6b'},
 {id:'t_cardi',cat:'top',name:'ゆるカーデ',st:2,p:160,c:'#ffb3d1',c2:'#ffffff'},
 {id:'t_hoodiep',cat:'top',name:'ビッグパーカー',st:2,p:160,c:'#b28cff'},
 // bottoms
 {id:'b_skirt',cat:'bottom',name:'デニムスカート',st:0,p:0,c:'#5b8fd6'},
 {id:'b_shorts',cat:'bottom',name:'ショートパンツ',st:0,p:30,c:'#ff8a3d'},
 {id:'b_pleat',cat:'bottom',name:'チェックスカート',st:1,p:90,c:'#3d4b7a',c2:'#e64b6b'},
 {id:'b_jeans',cat:'bottom',name:'ジーンズ',st:1,p:90,c:'#4b6fa8'},
 {id:'b_pink',cat:'bottom',name:'ピンクのミニスカート',st:2,p:140,c:'#ff6fa5'},
 // shoes
 {id:'s_sneaker',cat:'shoes',name:'スニーカー',st:0,p:0,c:'#ffffff',c2:'#ff6fa5'},
 {id:'s_loafer',cat:'shoes',name:'ローファー',st:1,p:60,c:'#4a3328',c2:'#4a3328'},
 {id:'s_boots',cat:'shoes',name:'あつぞこブーツ',st:2,p:130,c:'#f6efe6',c2:'#d9c9b6'},
 // accessories
 {id:'a_none',cat:'acc',name:'なし',st:0,p:0},
 {id:'a_pin',cat:'acc',name:'ピンクのヘアピン',st:0,p:0},
 {id:'a_ribbon',cat:'acc',name:'<ruby>大<rt>おお</rt></ruby>きいリボン',st:0,p:40},
 {id:'a_star',cat:'acc',name:'<ruby>星<rt>ほし</rt></ruby>のヘアピン',st:0,p:40},
 {id:'a_ear',cat:'acc',name:'ハートのイヤリング',st:1,p:90},
 {id:'a_heartglass',cat:'acc',name:'ハートのサングラス',st:2,p:140},
 {id:'a_neck',cat:'acc',name:'キラキラネックレス',st:2,p:140},
 // nails
 {id:'n_none',cat:'nail',name:'なし',st:0,p:0},
 {id:'n_pink',cat:'nail',name:'ピンク',st:0,p:30,c:['#ff8fb8']},
 {id:'n_rainbow',cat:'nail',name:'にじいろ',st:1,p:80,c:['#ff6f6f','#ffd23f','#7fd67f','#4aa8ff','#b28cff']},
 {id:'n_french',cat:'nail',name:'フレンチ',st:1,p:80,c:['#ffe9f1'],tip:'#ffffff'},
 {id:'n_heart',cat:'nail',name:'ハートアート',st:2,p:150,c:['#ff4f8b'],art:'heart'},
 {id:'n_gold',cat:'nail',name:'ゴールドラメ',st:2,p:150,c:['#f2c75c'],art:'glitter'},
 // backgrounds
 {id:'g_room',cat:'bg',name:'じぶんの<ruby>部屋<rt>へや</rt></ruby>',st:0,p:0},
 {id:'g_sky',cat:'bg',name:'<ruby>青空<rt>あおぞら</rt></ruby>',st:0,p:30},
 {id:'g_sakura',cat:'bg',name:'さくら',st:1,p:80},
 {id:'g_star',cat:'bg',name:'<ruby>星空<rt>ほしぞら</rt></ruby>',st:1,p:80},
 {id:'g_city',cat:'bg',name:'<ruby>夜<rt>よる</rt></ruby>の<ruby>街<rt>まち</rt></ruby>',st:2,p:120},
];
// Names are trusted constants with <ruby> for kids, so they are inserted as HTML.
const CATS=[['hair','<ruby>髪型<rt>かみがた</rt></ruby>'],['color','<ruby>髪<rt>かみ</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>'],['top','<ruby>服<rt>ふく</rt></ruby>'],['bottom','ボトム'],['shoes','くつ'],['acc','アクセ'],['nail','ネイル'],['bg','<ruby>背景<rt>はいけい</rt></ruby>']];
const DEFAULT_LOOK={hair:'h_bob',color:'c_brown',top:'t_hoodie',bottom:'b_skirt',shoes:'s_sneaker',acc:'a_pin',nail:'n_none',bg:'g_room'};
const item=id=>ITEMS.find(i=>i.id===id);

const SKIN='#ffe2c9',SKIN_D='#f5cbaa';

// Illustrated outfits ("コーデ") drawn with Gemini. Once a stage has art, it replaces the SVG parts for that stage.
// fx/fy: face centre as a fraction of the image, cw: width of the face crop (fraction of image width).
const ART=[
 {id:'k_hoodie',st:0,name:'パーカーコーデ',p:0,file:'art/s1_coord1.png',fx:.51,fy:.163,cw:.6},
 {id:'k_dress',st:0,name:'<ruby>水色<rt>みずいろ</rt></ruby>ワンピース',p:60,file:'art/s1_coord2.png',fx:.484,fy:.165,cw:.95},
 {id:'k_border',st:0,name:'ボーダーT＆ショートパンツ',p:60,file:'art/s1_coord3.png',fx:.477,fy:.16,cw:1.2},
 // hairstyles for the hoodie outfit (Gemini sheet joined to the full body by tools/hairstyles.py)
 {id:'h1_pony',st:0,kind:'hair',name:'ポニーテール',p:40,file:'art/s1_hair_pony.png',fx:0.475,fy:0.229,cw:0.56},
 {id:'h1_bob',st:0,kind:'hair',name:'ボブ',p:40,file:'art/s1_hair_bob.png',fx:0.512,fy:0.180,cw:0.60},
 {id:'h1_twinshort',st:0,kind:'hair',name:'ちょこんとツイン',p:40,file:'art/s1_hair_twinshort.png',fx:0.507,fy:0.180,cw:0.58},
 {id:'h1_long',st:0,kind:'hair',name:'さらさらロング',p:40,file:'art/s1_hair_long.png',fx:0.506,fy:0.181,cw:0.55},
 {id:'h1_crown',st:0,kind:'hair',name:'あみこみカチューシャ',p:80,file:'art/s1_hair_crown.png',fx:0.509,fy:0.173,cw:0.54},
 {id:'h1_bun',st:0,kind:'hair',name:'おだんご',p:60,file:'art/s1_hair_bun.png',fx:0.505,fy:0.216,cw:0.59},
 {id:'h1_drill',st:0,kind:'hair',name:'くるくるツインテール',p:100,file:'art/s1_hair_drill.png',fx:0.479,fy:0.178,cw:0.53},
 {id:'h1_short',st:0,kind:'hair',name:'ショートカット',p:60,file:'art/s1_hair_short.png',fx:0.504,fy:0.189,cw:0.56},
 {id:'h1_sidebraid',st:0,kind:'hair',name:'サイドみつあみ',p:80,file:'art/s1_hair_sidebraid.png',fx:0.502,fy:0.184,cw:0.57},
 {id:'h1_asym',st:0,kind:'hair',name:'クールなアシメ',p:150,file:'art/s1_hair_asym.png',fx:0.522,fy:0.171,cw:0.57},
 {id:'h1_updo',st:0,kind:'hair',name:'ふんわりアップ',p:100,file:'art/s1_hair_updo.png',fx:0.507,fy:0.192,cw:0.59},
 {id:'m_sailor',st:1,name:'セーラー<ruby>服<rt>ふく</rt></ruby>',p:0,file:'art/s2_coord1.png',fx:.474,fy:.15,cw:.66},
 {id:'g_uniform',st:2,name:'<ruby>制服<rt>せいふく</rt></ruby>ギャル',p:0,file:'art/s3_coord1.png',fx:.502,fy:.145,cw:.64},
];
// Face close-ups per outfit and expression ('<coord id>_<face>'), so the clothes in the face always match.
// Missing ones are cut from the outfit art itself.
const ART_FACES=Object.fromEntries(['normal','happy','surprise','think','sad'].flatMap(f=>[['k_hoodie_'+f,'art/s1_'+f+'.jpg'],['m_sailor_'+f,'art/s2_'+f+'.jpg'],['g_uniform_'+f,'art/s3_'+f+'.jpg']]));
function artFor(look,stage){const mine=ART.filter(a=>a.st===stage);return mine.find(a=>a.id===look.coord)||mine[0]||null}
function avatarHTML(look,stage,face='normal',crop='full'){
 const a=artFor({...DEFAULT_LOOK,...look},stage);
 if(!a)return avatarSVG(look,stage,face,crop);
 if(crop==='full')return `<div class="art full"><svg viewBox="0 0 200 320" preserveAspectRatio="xMidYMid slice">${bgLayer({...DEFAULT_LOOK,...look}.bg)}</svg><img src="${a.file}" alt="">${typeof petLayer==='function'?petLayer(look.pet)+fxLayer(look.fx):''}</div>`;
 const f=ART_FACES[`${a.id}_${face}`];
 if(f)return `<div class="art bust"><img src="${f}" alt="" style="width:100%;height:100%;object-fit:cover"></div>`;
 const w=100/a.cw;
 return `<div class="art bust"><img src="${a.file}" alt="" style="position:absolute;width:${w}%;left:${50-a.fx*w}%;top:calc(50% - ${a.fy} * ${w}% * var(--ar,2.8))" onload="this.style.setProperty('--ar',this.naturalHeight/this.naturalWidth)"></div>`;
}

const BG_SCENES={g_room:'<rect width="200" height="320" fill="#fff1e0"/><rect x="0" y="230" width="200" height="90" fill="#f3d9bd"/><rect x="18" y="40" width="50" height="60" rx="4" fill="#cfe9ff" stroke="#fff" stroke-width="4"/>',
  g_sky:'<rect width="200" height="320" fill="#bfe6ff"/><circle cx="40" cy="50" r="16" fill="#fff"/><circle cx="58" cy="46" r="20" fill="#fff"/><circle cx="160" cy="80" r="14" fill="#fff"/><rect y="250" width="200" height="70" fill="#9fdc8f"/>',
  g_sakura:'<rect width="200" height="320" fill="#ffe6f0"/>'+[[30,40],[160,60],[60,120],[150,170],[25,210],[175,250],[90,30]].map(([x,y])=>`<g fill="#ffb3cf" transform="translate(${x} ${y})"><circle r="5" cx="0" cy="-5"/><circle r="5" cx="5" cy="0"/><circle r="5" cx="0" cy="5"/><circle r="5" cx="-5" cy="0"/><circle r="2.5" fill="#fff"/></g>`).join(''),
  g_star:'<rect width="200" height="320" fill="#2b2f6b"/>'+[[20,30],[60,70],[170,40],[140,120],[30,180],[180,200],[90,20],[110,90]].map(([x,y])=>`<path d="M${x} ${y-6} L${x+2} ${y-2} L${x+6} ${y} L${x+2} ${y+2} L${x} ${y+6} L${x-2} ${y+2} L${x-6} ${y} L${x-2} ${y-2}Z" fill="#ffe680"/>`).join(''),
  g_city:'<rect width="200" height="320" fill="#3a2f6b"/>'+[[0,180,40],[38,150,30],[66,200,36],[100,160,28],[126,130,34],[160,190,40]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${320-y}" fill="#55498f"/><rect x="${x+8}" y="${y+14}" width="6" height="6" fill="#ffd96b"/><rect x="${x+20}" y="${y+34}" width="6" height="6" fill="#ff8fc8"/>`).join('')};
function bgLayer(id){return BG_SCENES[id]||''}

function avatarSVG(look,stage,face='normal',crop='full'){
 const S=STAGES[stage],L={...DEFAULT_LOOK,...look};
 const hc=item(L.color).c,top=item(L.top),bot=item(L.bottom),sh=item(L.shoes),nail=item(L.nail);
 const cx=100,hy=S.hy,hr=S.hr,shy=hy+hr+10,sw=S.sw,waist=shy+70,leg=S.leg;
 const g=[];
 // background
 g.push(crop==='full'?bgLayer(L.bg):'');

 // hair behind the head
 const back={h_bob:`<path d="M${cx-hr-6} ${hy} Q${cx-hr-8} ${hy+hr+14} ${cx-hr+6} ${hy+hr+16} L${cx+hr-6} ${hy+hr+16} Q${cx+hr+8} ${hy+hr+14} ${cx+hr+6} ${hy} Z" fill="${hc}"/>`,
  h_pony:`<path d="M${cx+hr-4} ${hy-hr+10} Q${cx+hr+34} ${hy-hr+4} ${cx+hr+24} ${hy+hr+30} Q${cx+hr+10} ${hy+30} ${cx+hr-6} ${hy-hr+22}Z" fill="${hc}"/>`,
  h_twin:`<path d="M${cx-hr+2} ${hy-hr+18} Q${cx-hr-30} ${hy} ${cx-hr-14} ${hy+hr+28} Q${cx-hr-2} ${hy+20} ${cx-hr+6} ${hy-hr+26}Z M${cx+hr-2} ${hy-hr+18} Q${cx+hr+30} ${hy} ${cx+hr+14} ${hy+hr+28} Q${cx+hr+2} ${hy+20} ${cx+hr-6} ${hy-hr+26}Z" fill="${hc}"/>`,
  h_long:`<path d="M${cx-hr-6} ${hy-6} L${cx-hr-4} ${shy+56} L${cx+hr+4} ${shy+56} L${cx+hr+6} ${hy-6} Z" fill="${hc}"/>`,
  h_side:`<path d="M${cx-hr+4} ${hy-hr+12} Q${cx-hr-34} ${hy+10} ${cx-hr-18} ${shy+40} Q${cx-hr-4} ${hy+40} ${cx-hr+8} ${hy-hr+24}Z" fill="${hc}"/>`,
  h_wave:`<path d="M${cx-hr-6} ${hy-6} Q${cx-hr-18} ${shy+10} ${cx-hr-6} ${shy+30} Q${cx-hr-16} ${shy+50} ${cx-hr+2} ${shy+66} L${cx+hr-2} ${shy+66} Q${cx+hr+16} ${shy+50} ${cx+hr+6} ${shy+30} Q${cx+hr+18} ${shy+10} ${cx+hr+6} ${hy-6} Z" fill="${hc}"/>`,
  h_bun:`<circle cx="${cx-hr+4}" cy="${hy-hr+6}" r="15" fill="${hc}"/><circle cx="${cx+hr-4}" cy="${hy-hr+6}" r="15" fill="${hc}"/><path d="M${cx-hr-4} ${hy} Q${cx-hr-6} ${hy+hr+6} ${cx-hr+6} ${hy+hr+8} L${cx+hr-6} ${hy+hr+8} Q${cx+hr+6} ${hy+hr+6} ${cx+hr+4} ${hy} Z" fill="${hc}"/>`}[L.hair]||'';
 g.push(back);
 // legs, bottoms, shoes
 const legL=cx-12,legR=cx+12,lw=12;
 if(crop==='full'){
  const legTop=waist+10,shoeY=leg-12;
  g.push(`<rect x="${legL-lw/2}" y="${legTop}" width="${lw}" height="${shoeY-legTop}" rx="5" fill="${SKIN}"/><rect x="${legR-lw/2}" y="${legTop}" width="${lw}" height="${shoeY-legTop}" rx="5" fill="${SKIN}"/>`);
  const tall=L.shoes==='s_boots'?24:0;
  g.push(`<rect x="${legL-10}" y="${shoeY-tall}" width="20" height="${14+tall}" rx="6" fill="${sh.c}"/><rect x="${legR-10}" y="${shoeY-tall}" width="20" height="${14+tall}" rx="6" fill="${sh.c}"/><rect x="${legL-10}" y="${shoeY+9}" width="20" height="5" rx="2" fill="${sh.c2}"/><rect x="${legR-10}" y="${shoeY+9}" width="20" height="5" rx="2" fill="${sh.c2}"/>`);
  if(L.bottom==='b_jeans')g.push(`<path d="M${cx-sw+6} ${waist} L${cx+sw-6} ${waist} L${legR+8} ${shoeY-2} L${cx+3} ${shoeY-2} L${cx} ${waist+30} L${cx-3} ${shoeY-2} L${legL-8} ${shoeY-2} Z" fill="${bot.c}"/>`);
  else if(L.bottom==='b_shorts')g.push(`<path d="M${cx-sw+6} ${waist} L${cx+sw-6} ${waist} L${cx+sw} ${waist+34} L${cx+3} ${waist+34} L${cx} ${waist+18} L${cx-3} ${waist+34} L${cx-sw} ${waist+34} Z" fill="${bot.c}"/>`);
  else{const len=L.bottom==='b_pink'?36:46;g.push(`<path d="M${cx-sw+6} ${waist} L${cx+sw-6} ${waist} L${cx+sw+14} ${waist+len} L${cx-sw-14} ${waist+len} Z" fill="${bot.c}"/>`);
   if(bot.c2)g.push(`<path d="M${cx-sw+2} ${waist+14} L${cx+sw+2} ${waist+14} M${cx-sw-4} ${waist+30} L${cx+sw+4} ${waist+30} M${cx-12} ${waist} L${cx-16} ${waist+len} M${cx+12} ${waist} L${cx+16} ${waist+len}" stroke="${bot.c2}" stroke-width="3" opacity=".7"/>`);}
 }
 // body and top
 const body=`M${cx-sw} ${shy+6} Q${cx-sw} ${shy-2} ${cx-sw+10} ${shy-4} L${cx+sw-10} ${shy-4} Q${cx+sw} ${shy-2} ${cx+sw} ${shy+6} L${cx+sw-4} ${waist+6} L${cx-sw+4} ${waist+6} Z`;
 g.push(`<rect x="${cx-7}" y="${hy+hr-8}" width="14" height="20" fill="${SKIN_D}"/>`);
 g.push(`<path d="${body}" fill="${top.c}"/>`);
 if(L.top==='t_hoodie'||L.top==='t_hoodiep')g.push(`<path d="M${cx-16} ${shy-4} Q${cx} ${shy+16} ${cx+16} ${shy-4}" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="5"/><path d="M${cx-6} ${shy+6} L${cx-7} ${shy+30} M${cx+6} ${shy+6} L${cx+7} ${shy+30}" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="${cx-18}" y="${waist-26}" width="36" height="18" rx="5" fill="rgba(0,0,0,.08)"/>`);
 if(L.top==='t_tee')g.push(`<path d="M${cx-sw+1} ${shy+16} H${cx+sw-1} M${cx-sw+2} ${shy+32} H${cx+sw-2} M${cx-sw+3} ${shy+48} H${cx+sw-3} M${cx-sw+3} ${shy+64} H${cx+sw-3}" stroke="${top.c2}" stroke-width="7"/>`);
 if(L.top==='t_sailor')g.push(`<path d="M${cx-sw+4} ${shy-3} L${cx} ${shy+26} L${cx+sw-4} ${shy-3} L${cx+sw-4} ${shy+12} L${cx} ${shy+36} L${cx-sw+4} ${shy+12}Z" fill="${top.c2}"/><path d="M${cx-10} ${shy+30} L${cx} ${shy+40} L${cx+10} ${shy+30} L${cx+4} ${shy+50} L${cx} ${shy+42} L${cx-4} ${shy+50}Z" fill="#e64b6b"/>`);
 if(L.top==='t_blazer')g.push(`<path d="M${cx-10} ${shy-4} L${cx} ${shy+30} L${cx+10} ${shy-4}Z" fill="#fff"/><path d="M${cx-5} ${shy+4} L${cx+5} ${shy+4} L${cx+3} ${shy+30} L${cx} ${shy+34} L${cx-3} ${shy+30}Z" fill="${top.c2}"/><circle cx="${cx}" cy="${shy+48}" r="3" fill="#f2c75c"/><circle cx="${cx}" cy="${shy+60}" r="3" fill="#f2c75c"/>`);
 if(L.top==='t_cardi')g.push(`<path d="M${cx-12} ${shy-4} L${cx} ${shy+40} L${cx+12} ${shy-4}Z" fill="${top.c2}"/><path d="M${cx} ${shy+40} L${cx} ${waist+6}" stroke="rgba(0,0,0,.15)" stroke-width="2"/>${[50,62].map(d=>`<circle cx="${cx+5}" cy="${shy+d}" r="2.6" fill="#fff"/>`).join('')}`);
 // arms, hands and nails
 const handY=waist+14,handL=cx-sw-8,handR=cx+sw+8;
 g.push(`<path d="M${cx-sw+2} ${shy+2} Q${cx-sw-10} ${shy+30} ${handL} ${handY-8}" stroke="${top.c}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M${cx+sw-2} ${shy+2} Q${cx+sw+10} ${shy+30} ${handR} ${handY-8}" stroke="${top.c}" stroke-width="15" fill="none" stroke-linecap="round"/>`);
 g.push(`<circle cx="${handL}" cy="${handY}" r="8" fill="${SKIN}"/><circle cx="${handR}" cy="${handY}" r="8" fill="${SKIN}"/>`);
 if(nail.c){[handL,handR].forEach(hx=>{[-4,0,4].forEach((dx,i)=>{const col=nail.c[(i+(hx>cx?3:0))%nail.c.length];g.push(`<ellipse cx="${hx+dx}" cy="${handY+6}" rx="1.9" ry="2.6" fill="${col}"/>`);if(nail.tip)g.push(`<rect x="${hx+dx-1.9}" y="${handY+7}" width="3.8" height="1.6" fill="${nail.tip}"/>`);if(nail.art==='heart'&&i===1)g.push(`<path d="M${hx} ${handY+5} l-1.5 -1.5 a1 1 0 0 1 1.5 -1 a1 1 0 0 1 1.5 1 Z" fill="#fff"/>`);if(nail.art==='glitter')g.push(`<circle cx="${hx+dx+.6}" cy="${handY+5.4}" r=".7" fill="#fff"/>`)})})}
 if(L.acc==='a_neck')g.push(`<path d="M${cx-12} ${shy-2} Q${cx} ${shy+14} ${cx+12} ${shy-2}" stroke="#f2c75c" stroke-width="2" fill="none"/><path d="M${cx} ${shy+8} l4 4 -4 4 -4 -4z" fill="#9fe3ff"/>`);
 // head and face
 g.push(`<circle cx="${cx-hr+2}" cy="${hy+4}" r="7" fill="${SKIN_D}"/><circle cx="${cx+hr-2}" cy="${hy+4}" r="7" fill="${SKIN_D}"/><ellipse cx="${cx}" cy="${hy+2}" rx="${hr}" ry="${hr*.98}" fill="${SKIN}"/>`);
 const ey=hy+6,ex=hr*.38,er=stage===0?5.5:5;
 const eyes={happy:`<path d="M${cx-ex-7} ${ey+1} Q${cx-ex} ${ey-7} ${cx-ex+7} ${ey+1} M${cx+ex-7} ${ey+1} Q${cx+ex} ${ey-7} ${cx+ex+7} ${ey+1}" stroke="#3b2a1f" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  surprise:`<circle cx="${cx-ex}" cy="${ey}" r="${er+2.5}" fill="#3b2a1f"/><circle cx="${cx+ex}" cy="${ey}" r="${er+2.5}" fill="#3b2a1f"/><circle cx="${cx-ex+2}" cy="${ey-2}" r="2.4" fill="#fff"/><circle cx="${cx+ex+2}" cy="${ey-2}" r="2.4" fill="#fff"/>`,
  sad:`<ellipse cx="${cx-ex}" cy="${ey+1}" rx="${er}" ry="${er-1}" fill="#3b2a1f"/><ellipse cx="${cx+ex}" cy="${ey+1}" rx="${er}" ry="${er-1}" fill="#3b2a1f"/><path d="M${cx-ex-8} ${ey-10} L${cx-ex+5} ${ey-13} M${cx+ex+8} ${ey-10} L${cx+ex-5} ${ey-13}" stroke="#6b4431" stroke-width="2.5" stroke-linecap="round"/>`}[face]||`<ellipse cx="${cx-ex}" cy="${ey}" rx="${er}" ry="${er+1.5}" fill="#3b2a1f"/><ellipse cx="${cx+ex}" cy="${ey}" rx="${er}" ry="${er+1.5}" fill="#3b2a1f"/><circle cx="${cx-ex+2}" cy="${ey-2.5}" r="2" fill="#fff"/><circle cx="${cx+ex+2}" cy="${ey-2.5}" r="2" fill="#fff"/>`;
 g.push(eyes);
 if(S.lash&&face!=='happy')g.push(`<path d="M${cx-ex-7} ${ey-6} L${cx-ex-10} ${ey-9} M${cx-ex-4} ${ey-8} L${cx-ex-6} ${ey-12} M${cx+ex+7} ${ey-6} L${cx+ex+10} ${ey-9} M${cx+ex+4} ${ey-8} L${cx+ex+6} ${ey-12}" stroke="#3b2a1f" stroke-width="2" stroke-linecap="round"/>`);
 g.push(`<ellipse cx="${cx-ex-4}" cy="${ey+12}" rx="7" ry="4" fill="#ff9fb8" opacity="${stage===2?.75:.5}"/><ellipse cx="${cx+ex+4}" cy="${ey+12}" rx="7" ry="4" fill="#ff9fb8" opacity="${stage===2?.75:.5}"/>`);
 const lip=stage===2?'#ff5c8a':'#c94a5a',my=hy+hr*.5;
 const mouth={happy:`<path d="M${cx-8} ${my-2} Q${cx} ${my+10} ${cx+8} ${my-2}Z" fill="${lip}"/>`,surprise:`<ellipse cx="${cx}" cy="${my+1}" rx="4.5" ry="5.5" fill="${lip}"/>`,think:`<path d="M${cx-6} ${my+1} L${cx+5} ${my-1}" stroke="${lip}" stroke-width="3" stroke-linecap="round"/>`,sad:`<path d="M${cx-7} ${my+3} Q${cx} ${my-4} ${cx+7} ${my+3}" stroke="${lip}" stroke-width="3" fill="none" stroke-linecap="round"/>`}[face]||`<path d="M${cx-6} ${my-1} Q${cx} ${my+5} ${cx+6} ${my-1}" stroke="${lip}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 g.push(mouth);
 if(face==='think')g.push(`<circle cx="${handR-14}" cy="${my+12}" r="7" fill="${SKIN}"/>`);
 // front hair (bangs + top)
 const top0=hy-hr;
 g.push(`<path d="M${cx-hr-4} ${hy+6} Q${cx-hr-6} ${top0-6} ${cx} ${top0-8} Q${cx+hr+6} ${top0-6} ${cx+hr+4} ${hy+6} Q${cx+hr-6} ${hy-14} ${cx+10} ${hy-16} L${cx+4} ${hy-6} L${cx-4} ${hy-16} L${cx-12} ${hy-6} Q${cx-hr+2} ${hy-14} ${cx-hr-4} ${hy+6} Z" fill="${hc}"/>`);
 if(L.hair==='h_wave'||L.hair==='h_long')g.push(`<path d="M${cx-hr-4} ${hy} Q${cx-hr-10} ${hy+hr} ${cx-hr-2} ${shy+20} L${cx-hr+6} ${shy+18} Q${cx-hr} ${hy+hr} ${cx-hr+4} ${hy+6}Z M${cx+hr+4} ${hy} Q${cx+hr+10} ${hy+hr} ${cx+hr+2} ${shy+20} L${cx+hr-6} ${shy+18} Q${cx+hr} ${hy+hr} ${cx+hr-4} ${hy+6}Z" fill="${hc}"/>`);
 g.push(`<path d="M${cx-hr*.55} ${top0+4} Q${cx-hr*.2} ${top0-2} ${cx+hr*.1} ${top0+3}" stroke="#fff" stroke-width="3" opacity=".35" fill="none" stroke-linecap="round"/>`);
 // accessories on top
 const acc={a_pin:`<rect x="${cx+hr*.35}" y="${hy-hr*.62}" width="16" height="5" rx="2.5" fill="#ff6fa5" transform="rotate(-20 ${cx+hr*.35} ${hy-hr*.62})"/>`,
  a_star:`<path d="M${cx+hr*.55} ${hy-hr*.82} l3 6 6.5 1 -4.7 4.5 1.1 6.5 -5.9-3.1 -5.9 3.1 1.1-6.5 -4.7-4.5 6.5-1Z" fill="#ffd23f" stroke="#e8a920" stroke-width="1"/>`,
  a_ribbon:`<path d="M${cx} ${top0-2} L${cx-20} ${top0-14} L${cx-18} ${top0+8} Z M${cx} ${top0-2} L${cx+20} ${top0-14} L${cx+18} ${top0+8} Z" fill="#ff4f8b"/><circle cx="${cx}" cy="${top0-2}" r="5" fill="#e63a75"/>`,
  a_ear:`<path d="M${cx-hr+2} ${hy+14} l-3 -3 a2 2 0 0 1 3 -2 a2 2 0 0 1 3 2Z M${cx+hr-2} ${hy+14} l-3 -3 a2 2 0 0 1 3 -2 a2 2 0 0 1 3 2Z" fill="#ff4f8b"/>`,
  a_heartglass:`<g transform="translate(0 ${-hr*.75})"><path d="M${cx-ex} ${ey+8} l-10 -10 a6 6 0 0 1 10 -6 a6 6 0 0 1 10 6Z M${cx+ex} ${ey+8} l-10 -10 a6 6 0 0 1 10 -6 a6 6 0 0 1 10 6Z" fill="#ff6fa5" opacity=".9"/><path d="M${cx-ex+8} ${ey-2} H${cx+ex-8}" stroke="#ff6fa5" stroke-width="2"/></g>`}[L.acc]||'';
 g.push(acc);
 const vb=crop==='full'?'0 0 200 320':`${cx-hr-30} ${hy-hr-24} ${2*hr+60} ${2*hr+60}`;
 return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${g.join('')}</svg>`;
}
