'use strict';
// Quest battle: every chapter has a "law-trouble monster". A correct answer fires a law technique from that
// chapter, a wrong one lets the monster attack (and the explanation shows). Monsters are cute SVG blobs so
// they work without art files; art/mon/<id>.png can replace one later.

const MONSTERS={
 ch1:{name:'むめんきょモグラ',c:'#a98466',c2:'#e7c9a9',shape:'imp',acc:'helmet',sk:['めんきょチェックパンチ','8つの取引スラッシュ','宅建業はっけんレーダー']},
 ch2:{name:'ルールむしタヌキ',c:'#8d7b6b',c2:'#d9c6b0',shape:'imp',acc:'leaf',sk:['めんきょ換えワープ','5年タイマーアタック','欠格ジャッジ']},
 ch3:{name:'にせ宅建士オバケ',c:'#b9b4e8',c2:'#efeaff',shape:'ghost',acc:'tie',sk:['宅建士証ピカッ','3つのお仕事ガード','登録ビーム']},
 ch4:{name:'おかねもちにげスライム',c:'#7fcf8a',c2:'#d4f5d8',shape:'slime',acc:'bag',sk:['供託金バリア','保証協会シールド','還付ヒール']},
 ch5:{name:'おおげさ広告ピエロ',c:'#ff9db7',c2:'#ffe2ea',shape:'imp',acc:'clown',sk:['誇大広告ストップ','取引態様めいじビーム','レインズ登録アロー']},
 ch6:{name:'せつめいサボりん',c:'#9fc4ff',c2:'#e3eeff',shape:'slime',acc:'zzz',sk:['必殺・35条重説ビーム','宅建士証フラッシュ','IT重説リモートアタック']},
 ch7:{name:'くちやくそくキツネ',c:'#ffb36b',c2:'#ffe6c9',shape:'imp',acc:'ears',sk:['37条書面プレス','記名スタンプ','書面わたしブーメラン']},
 ch8:{name:'クーリング・オフむし男',c:'#7fd6e0',c2:'#d9f6f9',shape:'imp',acc:'shades',sk:['クーリング・オフ解除スラッシュ','手付2割ガード','保全シールド']},
 ch9:{name:'ぼったくりカラス',c:'#5b5f7a',c2:'#b7bbd6',shape:'imp',acc:'beak',sk:['報酬上限キャップ','消費税かけ算ブレード','そっさん式ビーム']},
 ch10:{name:'わるい業者ボス',c:'#c96b6b',c2:'#f2c9c9',shape:'imp',acc:'crown',sk:['指示処分イエローカード','業務停止ストップ','免許取消ハンマー']},
 ch11:{name:'かってに開発ブル',c:'#e0b04f',c2:'#f8e6b8',shape:'imp',acc:'helmet',sk:['開発許可チェック','用途地域13色バリア','市街化調整ウォール']},
 ch12:{name:'はみだしビルゴーレム',c:'#9aa6b2',c2:'#dbe1e7',shape:'bot',acc:'antenna',sk:['建ぺい率カッター','容積率プレス','2m接道ロック']},
 ch13:{name:'田んぼつぶしモンスター',c:'#86b86b',c2:'#d6edca',shape:'slime',acc:'leaf',sk:['農地法3条ガード','4条5条ダブルアタック','事後届出ベル']},
 ch14:{name:'くずれもりどドロン',c:'#b08b6b',c2:'#e8d6c4',shape:'slime',acc:'none',sk:['盛土規制バリア','仮換地ワープ','換地処分フィニッシュ']},
 ch15:{name:'だましうそつきキング',c:'#a678d6',c2:'#e7d6f7',shape:'imp',acc:'crown',sk:['詐欺取消ソード','錯誤リセット','未成年者シールド']},
 ch16:{name:'なりすまし代理ニンジャ',c:'#4f5a78',c2:'#aab4cf',shape:'imp',acc:'mask',sk:['無権代理みやぶりアイ','表見代理ミラー','追認キャンセル']},
 ch17:{name:'登記のっとりシャドウ',c:'#3d3a5c',c2:'#9b97c4',shape:'ghost',acc:'none',sk:['対抗要件ランプ','時効カウントダウン','登記はやいものがちダッシュ']},
 ch18:{name:'ローンおばけ',c:'#8fb3d9',c2:'#e0ecf8',shape:'ghost',acc:'bag',sk:['抵当権スーパーチケット','順位ばんごうアタック','連帯保証チェーン']},
 ch19:{name:'手付金もちにげスライム',c:'#f2c94c',c2:'#fdf0c4',shape:'slime',acc:'bag',sk:['手付解除リリース','契約不適合チェック','遺留分ガード']},
 ch20:{name:'おいだし大家ドラゴン',c:'#6fbf8f',c2:'#cfeedd',shape:'imp',acc:'horns',sk:['借家ガードシールド','正当事由ジャッジ','区分所有ルールブック']},
 ch21:{name:'ぜいきんわすれゾンビ',c:'#9fbf86',c2:'#e1efd6',shape:'imp',acc:'bandage',sk:['軽減税率ビーム','固定資産税カレンダー','印紙ペタッ']},
 ch22:{name:'ねだんごまかしダヌキ',c:'#b8937a',c2:'#ecdccf',shape:'imp',acc:'leaf',sk:['地価公示メジャー','原価法ブロック','収益還元ビーム']},
 ch23:{name:'あぶない土地ゴーレム',c:'#a59382',c2:'#ddd2c7',shape:'bot',acc:'crack',sk:['免震クッション','統計グラフアタック','公正競争ルールアロー']},
 review:{name:'ふくしゅうゴースト',c:'#c3b8f0',c2:'#f0ecff',shape:'ghost',acc:'none',sk:['ふくしゅうパワー','思い出しビーム','もう間違えないスラッシュ']},
};
function monsterFor(lessonId){const ch=(lessonId||'').split('-')[0];return {...(MONSTERS[ch]||MONSTERS.review),id:MONSTERS[ch]?ch:'review'}}

// Cute angry-ish monster, drawn in a 120x120 box. mood: normal | hit | attack | down
function monsterSVG(m,mood='normal'){
 const body={slime:`<path d="M20 98 Q12 60 40 36 Q60 18 80 36 Q108 60 100 98 Z" fill="${m.c}"/><path d="M28 92 Q60 102 92 92" stroke="${m.c2}" stroke-width="6" fill="none" opacity=".6"/>`,
  ghost:`<path d="M24 100 L24 56 Q24 20 60 20 Q96 20 96 56 L96 100 L84 92 L72 100 L60 92 L48 100 L36 92 Z" fill="${m.c}"/>`,
  imp:`<ellipse cx="60" cy="66" rx="40" ry="36" fill="${m.c}"/><ellipse cx="60" cy="76" rx="24" ry="18" fill="${m.c2}"/><circle cx="32" cy="102" r="9" fill="${m.c}"/><circle cx="88" cy="102" r="9" fill="${m.c}"/>`,
  bot:`<rect x="24" y="28" width="72" height="72" rx="14" fill="${m.c}"/><rect x="34" y="70" width="52" height="20" rx="6" fill="${m.c2}"/><rect x="18" y="56" width="10" height="26" rx="4" fill="${m.c}"/><rect x="92" y="56" width="10" height="26" rx="4" fill="${m.c}"/>`}[m.shape];
 const acc={helmet:`<path d="M30 40 Q60 8 90 40 Z" fill="#ffd23f"/><rect x="28" y="38" width="64" height="7" rx="3" fill="#f0b400"/>`,
  leaf:`<path d="M58 30 Q70 6 86 14 Q76 30 58 30Z" fill="#6fbf6f"/>`,tie:`<path d="M56 78 L64 78 L66 96 L60 102 L54 96Z" fill="#2c3e6b"/>`,
  bag:`<path d="M88 74 q10 0 12 14 l-24 0 q2 -14 12 -14z" fill="#e8b84a"/><text x="88" y="87" font-size="9" text-anchor="middle" fill="#7a5a10">¥</text>`,
  clown:`<circle cx="60" cy="64" r="6" fill="#ff4f6b"/><path d="M40 34 L60 6 L80 34Z" fill="#ffd23f"/>`,zzz:`<text x="86" y="30" font-size="16" fill="#6b7fd6" font-weight="bold">Z</text><text x="98" y="18" font-size="11" fill="#6b7fd6" font-weight="bold">z</text>`,
  ears:`<path d="M30 40 L28 14 L48 32Z M90 40 L92 14 L72 32Z" fill="${m.c}"/>`,shades:`<rect x="36" y="50" width="20" height="10" rx="4" fill="#223"/><rect x="64" y="50" width="20" height="10" rx="4" fill="#223"/><rect x="54" y="53" width="12" height="3" fill="#223"/>`,
  beak:`<path d="M52 70 L68 70 L60 82Z" fill="#ffb347"/>`,crown:`<path d="M40 34 L44 16 L52 28 L60 12 L68 28 L76 16 L80 34Z" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/>`,
  antenna:`<line x1="60" y1="28" x2="60" y2="12" stroke="#666" stroke-width="3"/><circle cx="60" cy="10" r="5" fill="#ff5a5f"/>`,
  mask:`<rect x="26" y="46" width="68" height="16" rx="8" fill="#232a40"/>`,horns:`<path d="M34 40 L28 18 L46 34Z M86 40 L92 18 L74 34Z" fill="#fff3c4"/>`,
  bandage:`<rect x="70" y="36" width="24" height="8" rx="3" fill="#fff" transform="rotate(25 82 40)"/>`,crack:`<path d="M44 40 L52 52 L46 60 L56 72" stroke="#6b5a4a" stroke-width="3" fill="none"/>`,none:''}[m.acc]||'';
 const dead=mood==='down';
 const eyes=dead?`<path d="M40 50 l10 10 m0 -10 l-10 10 M70 50 l10 10 m0 -10 l-10 10" stroke="#3b2a1f" stroke-width="4" stroke-linecap="round"/>`
  :mood==='hit'?`<path d="M38 56 l12 -4 M82 56 l-12 -4" stroke="#3b2a1f" stroke-width="4" stroke-linecap="round"/><path d="M40 54 q5 6 10 0 M70 54 q5 6 10 0" stroke="#3b2a1f" stroke-width="4" fill="none"/>`
  :`<path d="M36 46 l14 6 M84 46 l-14 6" stroke="#3b2a1f" stroke-width="4" stroke-linecap="round"/><circle cx="46" cy="58" r="6" fill="#3b2a1f"/><circle cx="74" cy="58" r="6" fill="#3b2a1f"/><circle cx="48" cy="56" r="2" fill="#fff"/><circle cx="76" cy="56" r="2" fill="#fff"/>`;
 const mouth=dead?`<path d="M50 80 q10 -6 20 0" stroke="#3b2a1f" stroke-width="3" fill="none"/>`:mood==='attack'?`<path d="M46 74 Q60 92 74 74Z" fill="#7a2a3a"/><path d="M50 74 l3 5 l3 -5 m8 0 l3 5 l3 -5" fill="#fff"/>`:mood==='hit'?`<ellipse cx="60" cy="80" rx="6" ry="7" fill="#7a2a3a"/>`:`<path d="M48 76 Q60 70 72 76" stroke="#3b2a1f" stroke-width="3" fill="none"/>`;
 return `<svg viewBox="0 0 120 120" class="mon-svg">${body}${acc}${eyes}${mouth}${dead?'':`<ellipse cx="38" cy="70" rx="6" ry="4" fill="#ff8fa3" opacity=".5"/><ellipse cx="82" cy="70" rx="6" ry="4" fill="#ff8fa3" opacity=".5"/>`}</svg>`;
}

// Readings for every kanji word used in monster/technique names (shown big, so they must have furigana).
const BATTLE_YOMI={宅建業:'たっけんぎょう',宅建士証:'たっけんししょう',宅建士:'たっけんし',取引態様:'とりひきたいよう',取引:'とりひき',換:'が',年:'ねん',欠格:'けっかく',
 登録:'とうろく',供託金:'きょうたくきん',保証協会:'ほしょうきょうかい',還付:'かんぷ',誇大広告:'こだいこうこく',広告:'こうこく',必殺:'ひっさつ',条:'じょう',重説:'じゅうせつ',
 書面:'しょめん',記名:'きめい',解除:'かいじょ',手付金:'てつけきん',手付:'てつけ',割:'わり',保全:'ほぜん',報酬上限:'ほうしゅうじょうげん',消費税:'しょうひぜい',式:'しき',
 業者:'ぎょうしゃ',指示処分:'しじしょぶん',業務停止:'ぎょうむていし',免許取消:'めんきょとりけし',開発許可:'かいはつきょか',開発:'かいはつ',用途地域:'ようとちいき',色:'しょく',
 市街化調整:'しがいかちょうせい',建:'けん',率:'りつ',容積率:'ようせきりつ',接道:'せつどう',田:'た',農地法:'のうちほう',事後届出:'じごとどけで',盛土規制:'もりどきせい',
 仮換地:'かりかんち',換地処分:'かんちしょぶん',詐欺取消:'さぎとりけし',錯誤:'さくご',未成年者:'みせいねんしゃ',無権代理:'むけんだいり',表見代理:'ひょうけんだいり',代理:'だいり',
 追認:'ついにん',登記:'とうき',対抗要件:'たいこうようけん',時効:'じこう',抵当権:'ていとうけん',順位:'じゅんい',連帯保証:'れんたいほしょう',契約不適合:'けいやくふてきごう',
 遺留分:'いりゅうぶん',大家:'おおや',借家:'しゃくや',正当事由:'せいとうじゆう',区分所有:'くぶんしょゆう',軽減税率:'けいげんぜいりつ',固定資産税:'こていしさんぜい',印紙:'いんし',
 地価公示:'ちかこうじ',原価法:'げんかほう',収益還元:'しゅうえきかんげん',土地:'とち',免震:'めんしん',統計:'とうけい',公正競争:'こうせいきょうそう',思い出:'おもいだ',間違:'まちが',仕事:'しごと',男:'おとこ',算:'ざん'};
const BATTLE_RX=new RegExp(Object.keys(BATTLE_YOMI).sort((a,b)=>b.length-a.length).join('|'),'g');
const bruby=t=>t.replace(BATTLE_RX,k=>`<ruby>${k}<rt>${BATTLE_YOMI[k]}</rt></ruby>`);
