// ---------- ○○不動産（自分のオフィス） ----------
// Furniture is bought with coins and placed in fixed slots. The two legal notices
// (宅建業者票・報酬額表) are "special": each one on display adds +5% to quiz coins.
const OFFICE_ITEMS=[
 {id:'sofa',name:'ソファ',price:80,slot:'floor'},
 {id:'plant',name:R('観葉植物','かんようしょくぶつ'),price:60,slot:'floor',s:.8},
 {id:'desk',name:'つくえ',price:100,slot:'floor'},
 {id:'bookshelf',name:R('本','ほん')+'だな',price:100,slot:'floor',s:.85},
 {id:'teatable',name:'ローテーブル',price:80,slot:'floor',s:.9},
 {id:'cushions',name:'クッション',price:50,slot:'floor',s:.75},
 {id:'lamp',name:'ランプ',price:60,slot:'floor',s:.5},
 {id:'house',name:R('家','いえ')+'のもけい',price:120,slot:'floor',s:.8},
 {id:'trophy',name:'トロフィー',price:150,slot:'floor',s:.6},
 {id:'coffee',name:'コーヒーマシン',price:100,slot:'floor',s:.65},
 {id:'counter',name:R('受付','うけつけ')+'カウンター',price:150,slot:'floor'},
 {id:'showcase',name:R('物件','ぶっけん')+'ショーケース',price:150,slot:'floor'},
 {id:'sign',name:R('宅建業者票','たっけんぎょうしゃひょう'),price:200,slot:'floor',s:.75,sp:true,
  why:`${R('不動産屋','ふどうさんや')}さんは、お${R('店','みせ')}に「${R('国','くに')}や${R('県','けん')}からOKをもらっています」という${R('票','ひょう')}を、かならずかざるルールだよ。`},
 {id:'rug',name:'ラグ',price:60,slot:'rug'},
 {id:'clock',name:'とけい',price:50,slot:'wall',s:.75},
 {id:'map',name:R('町','まち')+'の'+R('地図','ちず'),price:80,slot:'wall'},
 {id:'keybox',name:'かぎのボックス',price:100,slot:'wall'},
 {id:'board',name:R('報酬額表','ほうしゅうがくひょう'),price:200,slot:'wall',sp:true,
  why:`お${R('礼','れい')}（${R('報酬','ほうしゅう')}）のいちばん${R('上','うえ')}の${R('金額','きんがく')}を、お${R('客','きゃく')}さんに${R('見','み')}えるようにかざるルールだよ。`},
];
// x = center, y = bottom edge (wall slots: center), w = width — all in % of the room.
const OFFICE_SLOTS=[
 {id:'wL',type:'wall',x:13,y:35,w:19},{id:'wR',type:'wall',x:87,y:35,w:19},
 {id:'rug',type:'rug',x:50,y:93,w:66},
 {id:'bL',type:'floor',x:17,y:77,w:30},{id:'bR',type:'floor',x:83,y:77,w:30},
 {id:'fL',type:'floor',x:15,y:99,w:30},{id:'fR',type:'floor',x:85,y:99,w:30},
];
const ofc=()=>(S.office=S.office||{own:[],at:{}});
const officeItem=id=>OFFICE_ITEMS.find(i=>i.id===id);
const officeBuff=()=>Object.values(ofc().at).filter(id=>officeItem(id)?.sp).length*5;
const officeName=()=>`${esc(S.name||'')}${R('不動産','ふどうさん')}`;
function officeBonus(coins){const b=officeBuff();return b&&coins>0?Math.ceil(coins*b/100):0}

function officeThing(it){
 let txt='';
 if(it.id==='sign')txt=`<span class="otx sign"><b>${R('宅建業者票','たっけんぎょうしゃひょう')}</b><i>${officeName()}</i><small>${R('免許','めんきょ')}${R('番号','ばんごう')} 1${R('号','ごう')}</small></span>`;
 if(it.id==='board')txt=`<span class="otx board"><b>${R('報酬額表','ほうしゅうがくひょう')}</b><small>200${R('万円','まんえん')}まで…5%<br>400${R('万円','まんえん')}まで…4%<br>それより${R('上','うえ')}…3%</small></span>`;
 return `<img src="art/office/${it.id}.png" alt="">${txt}`;
}

function office(){
 const o=ofc(),look={...DEFAULT_LOOK,...S.look},a=typeof artFor==='function'&&artFor(look,myStage());
 const slot=s=>{const it=officeItem(o.at[s.id]);const w=it?s.w*(it.s||1):12;
  const pos=s.type==='wall'?`left:${s.x-w/2}%;top:${s.y}%;transform:translateY(-50%)`:`left:${s.x-w/2}%;bottom:${100-s.y}%`;
  return `<button class="oslot ${s.type} ${it?'on':'empty'}" style="${pos};width:${w}%" onclick="officePick('${s.id}')" aria-label="${it?'かえる':'おく'}">${it?officeThing(it):'<span class="plus">＋</span>'}</button>`};
 const order=['wL','wR','rug','bL','bR'].map(id=>OFFICE_SLOTS.find(s=>s.id===id));
 const front=['fL','fR'].map(id=>OFFICE_SLOTS.find(s=>s.id===id));
 const b=officeBuff(),placed=Object.keys(o.at).length;
 app.innerHTML=`${header(officeName(),'go(home)')}
 <div class="stats"><span class="pill">🪙 ${S.coins}</span><span class="pill">🛋️ ${placed} / ${OFFICE_SLOTS.length}</span><span class="pill ${b?'buff':''}">✨ コイン +${b}%</span></div>
 <div class="room">${order.map(slot).join('')}
  <div class="ome">${a?`<img src="${a.file}" alt="">`:avatarHTML(S.look,myStage(),'happy','full')}</div>
  ${front.map(slot).join('')}</div>
 <p class="muted" style="text-align:center">「＋」や<ruby>家具<rt>かぐ</rt></ruby>をタップして、おいたり<ruby>入<rt>い</rt></ruby>れかえたりできるよ</p>
 <div class="ohint">⭐ <b>${R('宅建業者票','たっけんぎょうしゃひょう')}</b>と<b>${R('報酬額表','ほうしゅうがくひょう')}</b>は、<ruby>本物<rt>ほんもの</rt></ruby>の<ruby>不動産屋<rt>ふどうさんや</rt></ruby>さんにもかざってあるよ。かざると1つにつきクイズのコインが<b>+5%</b>！</div>`;
}

function officePick(sid){
 const o=ofc(),s=OFFICE_SLOTS.find(x=>x.id===sid),cur=o.at[sid];
 const list=OFFICE_ITEMS.filter(i=>i.slot===s.type);
 const where=id=>Object.keys(o.at).find(k=>o.at[k]===id);
 const row=it=>{const own=o.own.includes(it.id),here=cur===it.id,other=!here&&where(it.id);
  return `<button class="orow ${here?'here':''}" data-id="${it.id}"><img src="art/office/${it.id}.png" alt=""><span><b>${it.sp?'⭐ ':''}${it.name}</b>${it.sp?`<small class="sp">かざるとコイン+5%</small>`:''}${it.why?`<small>${it.why}</small>`:''}</span><em>${here?'おいてある':own?(other?'ここへうつす':'おく'):`🪙 ${it.price}`}</em></button>`};
 const sh=document.createElement('div');sh.className='shade';
 sh.innerHTML=`<div class="sheet" role="dialog"><h2 style="font-size:22px">${{wall:'かべ',floor:'ゆか',rug:'ラグ'}[s.type]}に<ruby>何<rt>なに</rt></ruby>をおく？</h2><div class="muted">🪙 ${S.coins}</div>${list.map(row).join('')}${cur?'<button class="sub" data-off style="margin-top:10px">しまう（もちものにもどす）</button>':''}<button class="big" data-close style="margin-top:10px;font-size:18px;padding:14px">とじる</button></div>`;
 sh.addEventListener('click',e=>{
  if(e.target===sh||e.target.closest('[data-close]'))return sh.remove();
  if(e.target.closest('[data-off]')){delete o.at[sid];save();sh.remove();return office()}
  const r=e.target.closest('.orow');if(!r)return;const it=officeItem(r.dataset.id);
  if(cur===it.id)return;
  if(!o.own.includes(it.id)){
   if(S.coins<it.price)return toast(`コインがあと ${it.price-S.coins} たりないよ`);
   S.coins-=it.price;o.own.push(it.id);
  }
  const old=where(it.id);if(old)delete o.at[old];
  o.at[sid]=it.id;save();sh.remove();office();
  if(it.sp){confetti();toast(`✨ ${it.name}をかざった！ クイズのコイン +${officeBuff()}%`)}
 });
 document.body.appendChild(sh);
}
