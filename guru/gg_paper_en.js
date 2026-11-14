/* gg_paper_en.js：ぐるぐる英語の紙（2026-11-03）。gg_paper.js（数学の紙）を読んだあとに読む。見出し・.sheet・sh-ft・名前の欄は数学の紙と同じ部品を使う。
   決まり＝仕様書\ぐるぐる英語_作り方の決まり.md 5f（紙の割り付け）・5b（答え方）・9a（見出し）・10（章まとめテスト）。4本線＝teacher.html の .pp-l4（KWT_紙と印刷.md「4線」）
   使い方：
     ggPaper.cssEn                     ＝英語の紙の CSS（ggPaper.css のあとに入れる）
     ggPaper.roundEn(GG, パートid, 回)  ＝通常回・入試パターンの1回分（表と裏の2枚）
     ggPaper.ctEn(GG, テストid, 回, 'q'|'a') ＝章まとめテストの問題用紙（'q'）・解答用紙（'a'）
     ggPaper.layoutEn(root)            ＝入れたあとに呼ぶ：通常回の表と裏の分け方（入らないときは並び替えを表へ）・問題用紙のページ分け
   紙の答え方（5b）：文法の穴埋め・語句（対話の空所）は（　）の所に英語を書く（4本線）／語句（英単語→和訳）は意味を日本語で書く／並び替えは語群つきで英文を全部書く（4本線）／選択肢はリスニングと短文読解だけ。
   紙に出さないもの：.eaf（放送文・和訳＝答え合わせのあとだけ）・.eau（音のボタン。音は見出しの QR）・.egh（指示文は大問の頭に1回だけ出す） */
(function(G){
const PP=G.ggPaper;const RD=PP.RD,HD=PP.HD;
const KANA='アイウエオカ';
const SJN={ma:'数学',en:'英語'};
const kindOf=it=>it.pk||(it.ren?'read':String(it.g||'').split('|')[0]);   /* 2026-11-13 英検のまとめテスト：it.pk＝紙の形（goku2・listen・order・read） */
const vis=s=>String(s==null?'':s).replace(/<[^>]+>/g,'');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function strip(html,sels){const t=document.createElement('template');t.innerHTML=String(html||'');sels.forEach(s=>t.content.querySelectorAll(s).forEach(e=>e.remove()));return t.innerHTML;}
const L4=w=>`<span class="pp-l4" style="width:${w}mm"></span>`;
const L4B='<span class="pp-l4 blk"></span>';
/* 書いて答える紙：（　）（.ebl・wide でないもの）を4本線にする。並べかえの対話の（　　　）＝ .ebl.wide はそのまま（答えは下の4本線に書く） */
const blankW=h=>String(h).replace(/<span class="ebl">[^<]*<\/span>/g,L4(30));
const isDoc=it=>/class="edoc"/.test(String(it.q||''));
/* 大問の分け方＝数学の紙・アプリの mkBlocks と同じ（連問＝1つの大問、続けて同じ g＝1つの大問） */
function blocks(rd){const BK=[];let gk=null;rd.forEach((it,i)=>{if(it.ren){BK.push({items:[i]});gk=null;return;}if(!gk||gk.key!==(it.g||'')){gk={key:it.g||'',items:[]};BK.push(gk);}gk.items.push(i);});
 const POS={};BK.forEach((b,bi)=>b.items.forEach((i,k)=>POS[i]={num:bi+1,k,n:b.items.length}));return {BK,POS};}
/* 区切りの名前（決まり 3・4 の呼び方） */
function secName(it,ny){if(it.sec)return it.sec;const k=kindOf(it);return k==='blank'?'文法の穴埋め':(k==='goku'||k==='goku2')?'語句':k==='listen'?'リスニング':k==='order'?'並び替え':k==='order2'?'並べかえ':k==='read'?(ny||isDoc(it)?'資料つき読解':'短文読解'):'';}
const SEC_OF=k=>k==='goku2'?'goku':k==='order2'?'order':k;
const SECK=it=>kindOf(it)==='order'?'order':(it.sec||SEC_OF(kindOf(it)));   /* 2026-11-13 英検のまとめテスト：区切りは it.sec（語句・穴うめ・第1部型…）ごと */
/* 紙の指示文。mode 'w'＝書いて答える（通常回・入試パターン）、'c'＝選んで解答用紙に書く（章まとめテストの問題用紙） */
function ghPaper(it,mode){const k=kindOf(it),gh=String(it.gh||'');
 if(mode==='w'){
  if(k==='blank')return '日本語に合うように、（　）に入る英語を書きなさい。';
  if(k==='goku')return '英語の意味を日本語で書きなさい。';
  if(k==='goku2')return '対話の（　）に入る英語を1語書きなさい。';
  if(k==='order')return '日本語に合うように並べかえて、英文を全部書きなさい。使わない語が1つあります。';
  if(k==='order2')return '対話が成り立つように並べかえて、（　　　）に入る英語を全部書きなさい。使わない語が1つあります。';
  return gh;}
 if(k==='order'&&it.pk)return '日本語に合うように並べかえて、英文を全部書きなさい。'+(it.ord&&+it.ord.ex?'使わない語があります。':'');
 if(k==='order')return '日本語に合うように並べかえて、英文を全部書きなさい。使わない語が1つあります。';
 if(k==='order2')return '対話が成り立つように並べかえて、（　　　）に入る英語を全部書きなさい。使わない語が1つあります。';
 return gh;}
/* 選択肢（ア〜エ）。字の長さで 4列・2列・1列 */
const wOf=t=>[...vis(t)].reduce((s,ch)=>s+(/[\u0000-\u00ff]/.test(ch)?1:2),0);/* 半角＝1・全角＝2 */
function chHtml(c){const n=Math.max(...c.map(wOf));const cl=n<=15?'c4':n<=34?'c2':'c1';
 return `<div class="ech ${cl}">${c.map((x,i)=>`<span><b>${KANA[i]}</b>${x}</span>`).join('')}</div>`;}
const toks=it=>`<div class="etk">${(it.ord&&it.ord.tok||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div>`;
const postOf=it=>String(it.ord&&it.ord.post||'');
const ansLine=(it,lab)=>`<div class="eol">${lab?`<span class="eoln">${lab}</span>`:''}${L4B}${postOf(it)?`<span class="epost">${esc(postOf(it))}</span>`:''}</div>`;
/* 問題文（紙用）：音のボタン・答え合わせのあとの所・指示文を外す */
/* 小問の番号 (1) を左に置き、中身はその右にそろえる */
const QX=(sub,h)=>sub?`<div class="qx"><span class="qsub">${sub}</span><div class="qc">${h}</div></div>`:`<div class="qc">${h}</div>`;
const qPaper=it=>strip(it.q,['.eau','.eaf','.egh']);

/* ===== 通常回・入試パターン（A4 両面1枚） ===== */
function itemW(it,ps,sec,ny){const k=kindOf(it);
 const lead=`<div class="no${ps.k===0?'':' sub'}">${ps.k===0?ps.num:''}</div>`;
 const sub=ps.n>1?`(${ps.k+1})`:'';
 const gh=ps.k===0?`<div class="egh2">${ghPaper(it,'w')}</div>`:'';
 const ank=ps.n>1?`<span class="ank">${ps.num}(${ps.k+1})</span>`:'';
 const head=sec?`<div class="sh-sec">${sec}</div>`:'';
 if(k==='read'){const body=qPaper(it);
  const st=it.steps.map((s,si)=>`<div class="sq"><div class="no${si===0?'':' sub'}">${si===0?ps.num:''}</div><div class="bd">${si===0?`<div class="egh2">${ghPaper(it,'w')}</div><div class="erd">${body}</div>`:''}<div class="qq">(${si+1}) ${s.s}</div>${chHtml(s.c)}</div><div class="an"><span class="ank">${ps.num}(${si+1})</span></div></div>`).join('');
  return `<div class="su" data-k="read">${head}${st}</div>`;}
 let bd='',an='';
 if(k==='blank'||k==='goku2'){bd=QX(sub,blankW(qPaper(it)));}
 else if(k==='goku'){bd=QX(sub,qPaper(it));an=`<div class="an wd">${ank}</div>`;}
 else if(k==='listen'){bd=QX(sub,qPaper(it)+chHtml(it.c));an=`<div class="an">${ank}</div>`;}
 else if(k==='order'||k==='order2'){bd=QX(sub,qPaper(it)+toks(it)+ansLine(it,''));}
 else bd=QX(sub,qPaper(it)+((it.c||[]).length?chHtml(it.c):'')),an=`<div class="an">${ank}</div>`;
 return `<div class="su" data-k="${SEC_OF(k)}">${head}<div class="sq k-${k}">${lead}<div class="bd">${gh}${bd}</div>${an}</div></div>`;}

function headRound(GG,p,R,H,GN){
 /* 2026-11-03 21:3x 川上さん「推奨でOK」：入試パターンは番号（入試1 → ①）を単元名の横に出す。通常回はキャッチと代表例の英文を見出しに出す（決まり 5f・9a＝表紙と同じ並び） */
 if(H.ny&&!H.maru){const q=(GG.ny||[]).find(x=>x.id===p.id);if(q&&q.no)H=Object.assign({},H,{maru:'①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'[q.no-1]||String(q.no)});}
 const ex=(p.cover||[])[0];const ca=(!H.ny&&(p.catch||ex))?`<div class="sh-ca">${p.catch?`<b>${esc(p.catch)}</b>`:''}${ex?`<span class="sh-ex">例　${ex.q}</span>`:''}</div>`:'';
 const dots=Array.from({length:H.n},(_,i)=>`<span class="${i+1===H.k?'on':''}">${i+1}</span>`).join('');
 /* 数学の紙の見出し（gg_paper.js sheetHtml の hd）と同じ並び */
 return `<div class="sh-h"><div class="sh-l"><div class="sh-k">${H.grade}${SJN[H.subj]||'英語'}<b>ぐるぐる</b></div><div class="sh-tt">${H.ny?`${H.unit} <span class="mr">${H.maru}</span>`:`${H.unit}${H.n>1?`<span class="sh-dots sh-di">${dots}</span>`:''}`}</div><div class="sh-ps">${H.main}${H.sub?` <small>（${H.sub}）</small>`:''}</div>${H.ny?`<div class="sh-dots"><i>${H.aft} が終わったら挑戦</i></div>`:''}${ca}</div><div class="sh-r"><div class="sh-rd">${RD(R)}</div><div class="sh-rt">${GN}問・${p.min||13}分</div></div><div class="sh-qr">QR<br>この回を開く</div></div>
 <div class="sh-f"><span class="b" style="width:24mm">　月　　日</span><span class="b nm">名前</span><span class="b sc"><span>正解</span><span>／${GN}</span></span></div>
 <div class="sh-ins">英語は4本線に書きなさい。語句の意味は日本語で書きなさい。リスニングと読解は答えを選んで、右の枠に記号を書きなさい。リスニングの音声は右上の QR から聞きます。（${p.min||13}分）</div>`;}

function roundEn(GG,id,R){const p=(GG.parts||[]).find(x=>x.id===id);if(!p||!p.rounds[R])return '';const rd=p.rounds[R];
 const H=HD(GG,id);const GN=rd.reduce((s,it)=>s+(it.ren?it.steps.length:1),0);const {POS}=blocks(rd);
 let prev='';const F=[],B=[];
 rd.forEach((it,i)=>{const k=SEC_OF(kindOf(it));const sec=k!==prev?secName(it,H.ny):'';prev=k;const h=itemW(it,POS[i],sec,H.ny);(k==='order'||k==='read'?B:F).push(h);});
 const cont=`<div class="sh-cont">${PP.CALL(GG,id,R)}（裏）<small>　${H.main}</small></div>`;
 return `<div class="sheet sf en" data-r="${R}" data-id="${id}">${headRound(GG,p,R,H,GN)}<div class="sbody">${F.join('')}</div><div class="sh-ft">${RD(R)}　表　（裏に続く）</div></div>`
  +`<div class="sheet sb en" data-r="${R}" data-id="${id}">${cont}<div class="sbody">${B.join('')}</div><div class="sh-ft">${RD(R)}　裏</div></div>`;}

const limOf=sh=>{const b=sh.querySelector('.sbody'),ft=sh.querySelector('.sh-ft');return ft.offsetTop-16-b.offsetTop;};
const usedOf=sh=>{const b=sh.querySelector('.sbody');const L=b.lastElementChild;return L?L.offsetTop+L.offsetHeight-b.offsetTop:0;};
/* .sbody の offsetParent は .sheet（position:relative）。.su の offsetTop も .sheet から測る */
function layRound(sf){const sb=sf.nextElementSibling;const B1=sf.querySelector('.sbody'),B2=sb.querySelector('.sbody');
 [...B1.children,...B2.children].forEach(u=>u.style.marginBottom='');
 const over=sh=>usedOf(sh)-limOf(sh);
 /* 決まり 5f：裏に入りきらないときは資料を小さくせず、並び替えを表へ移す（まとめて → だめなら1問ずつ前から） */
 let moved=0;
 if(over(sb)>0){const O=[...B2.querySelectorAll(':scope>.su[data-k="order"]')];
  for(const u of O){B1.appendChild(u);if(over(sf)>0){B2.insertBefore(u,B2.firstChild);break;}moved++;}}
 sf.dataset.k=moved;
 /* 余った高さは区切りのあいだに少しずつ配る（1問 6mm まで）。書く所を窮屈にしない */
 [sf,sb].forEach(sh=>{const b=sh.querySelector('.sbody');const U=[...b.children];if(!U.length)return;const free=limOf(sh)-usedOf(sh);if(free<=0)return;const g=Math.min(free/U.length,6*3.78);U.forEach(u=>u.style.marginBottom=g+'px');});}

/* ===== 章まとめテスト ===== */
function ctOf(GG,id,R){const c=(GG.cts||[]).find(x=>x.id===id);if(!c||!c.rounds[R]||!c.rounds[R].items)return null;return {c,T:c.rounds[R],rd:c.rounds[R].items};}
const ctNQ=rd=>rd.reduce((s,it)=>s+(it.ren?it.steps.length:1),0);
const ptOf=it=>it.ren?(it.steps[0]&&it.steps[0].pt):it.pt;
function headCt(c,T,R,GN,kind){if(c.ek)return headEk(c,T,R,GN,kind);const h=`<div class="sh-h"><div class="sh-l"><div class="sh-k">${c.grade}${SJN[c.subj]||'英語'}<b>ぐるぐる</b></div><div class="sh-tt">${c.unit} <span class="mr">${c.rng||''}</span></div><div class="sh-ps">章まとめテスト　${kind==='a'?'解答用紙':'問題用紙'}</div></div><div class="sh-r"><div class="sh-rd">${RD(R)}</div><div class="sh-rt">${GN}問・${T.min||30}分・100点</div></div><div class="sh-qr${kind==='a'?' big':''}">QR<br>${kind==='a'?'このテストを開く':'音声を聞く'}</div></div>`;
 const pt=`<div class="sh-pt">配点：${T.wpt||''}（100点満点）／制限時間：${T.min||30}分</div>`;
 if(kind==='a')return h+`<div class="sh-f"><span class="b" style="width:24mm">　月　　日</span><span class="b nm">名前</span><span class="b sc"><span>点数</span><span>／100</span></span></div>${pt}<div class="sh-ins">選ぶ問題は記号（ア〜エ）を、並び替えは英文を全部、4本線に書きなさい。</div>`;
 return h+pt+`<div class="sh-ins">答えはすべて解答用紙に書きなさい。選ぶ問題は記号（ア〜エ）を、並び替えは英文を全部書きなさい。リスニングの音声は右上の QR から聞きます。</div>`;}

/* 2026-11-13 英検のまとめテストの見出し（c.ek＝{book}）。形は章まとめテストと同じ・名前は「まとめテスト」 */
function headEk(c,T,R,GN,kind){const lis=(T.items||[]).some(x=>/class="eau"/.test(String(x.q||''))||(x.steps||[]).some(s=>/class="eau"/.test(String(s.q||''))));const h=`<div class="sh-h"><div class="sh-l"><div class="sh-k">${esc(c.ek.book||'')}</div><div class="sh-tt">${esc(c.unit)}</div><div class="sh-ps">${kind==='a'?'解答用紙':'問題用紙'}</div></div><div class="sh-r"><div class="sh-rd">${R}</div><div class="sh-rt">${GN}問・${T.min||30}分・100点</div></div>${kind==='a'||lis?`<div class="sh-qr${kind==='a'?' big':''}">QR<br>${kind==='a'?'このテストを開く':'音声を聞く'}</div>`:''}</div>`;   /* 解答用紙＝このテストを開く QR（答え合わせ）／問題用紙＝リスニングがあるときだけ音の QR（11-13 川上さん「ア」）。QR は teacher.html の ekMtPrint_ が入れる */
 const pt=`<div class="sh-pt">配点：各5点（100点満点・80点で合格）／制限時間：${T.min||30}分</div>`;
 if(kind==='a')return h+`<div class="sh-f"><span class="b" style="width:24mm">　月　　日</span><span class="b nm">名前</span><span class="b sc"><span>点数</span><span>／100</span></span></div>${pt}<div class="sh-ins">選ぶ問題は記号（ア〜エ）を、並べかえは英文を全部、書きなさい。</div>`;
 return h+pt+`<div class="sh-ins">答えはすべて解答用紙に書きなさい。${lis?'リスニングの問題は、右上の「リスニング用 QR」から音を聞きます（1問につき2回流れます）。':''}</div>`;}
function itemC(it,ps,sec){const k=kindOf(it);
 const head=sec?`<div class="sh-sec">${sec}</div>`:'';
 const gh=ps.k===0?`<div class="egh2">${ghPaper(it,'c')}</div>`:'';
 if(k==='read'){const st=it.steps.map((s,si)=>`<div class="sq"><div class="no${si===0?'':' sub'}">${si===0?ps.num:''}</div><div class="bd">${si===0?`<div class="egh2">${ghPaper(it,'c')}</div><div class="erd">${qPaper(it)}</div>`:''}<div class="qq">(${si+1}) ${s.s}</div>${chHtml(s.c)}</div></div>`).join('');return `<div class="su" data-k="read">${head}${st}</div>`;}
 const sub=ps.n>1?`(${ps.k+1})`:'';
 const lead=`<div class="no${ps.k===0?'':' sub'}">${ps.k===0?ps.num:''}</div>`;
 let bd;
 if(k==='order'||k==='order2')bd=QX(sub,qPaper(it)+toks(it));
 else if(k==='goku')bd=QX(sub,`<div class="egr">${qPaper(it)}${chHtml(it.c||[])}</div>`);/* 語句は見出し語と選択肢を1行に */
 else bd=QX(sub,qPaper(it)+(it.hd?`<div class="ech c4">${(it.c||[]).map((x,i)=>`<span><b>${KANA[i]}</b></span>`).join('')}</div>`:chHtml(it.c||[])));   /* it.hd＝選択肢は放送で読まれる（英検の第1部型・第3部型） */
 return `<div class="su" data-k="${SEC_OF(k)}">${head}<div class="sq k-${k}">${lead}<div class="bd">${gh}${bd}</div></div></div>`;}

function ctEn(GG,id,R,kind){const o=ctOf(GG,id,R);if(!o)return '';const {c,T,rd}=o;const GN=ctNQ(rd);const {BK,POS}=blocks(rd);
 const CALLC=c.ek?`${c.ek.book||''} ${c.unit} ${R}`:`章まとめテスト ${c.unit} ${c.rng||''} ${RD(R)}`;
 if(kind!=='a'){let prev='';const U=rd.map((it,i)=>{const k=SECK(it);let sec='';if(k!==prev){const pt=ptOf(it);sec=`${secName(it)}<small>（各${pt}点）</small>${/class="eau"/.test(String(it.q||''))?'<span class="ls-n">🎧 音は右上の QR（リスニング用）から聞く（1問2回）</span>':''}`;}prev=k;return itemC(it,POS[i],sec);});
  return `<div class="sheet ctq en" data-r="${R}" data-id="${id}" data-call="${esc(CALLC)}">${headCt(c,T,R,GN,'q')}<div class="sbody">${U.join('')}</div><div class="sh-ft">問題用紙</div></div>`;}
 /* 解答用紙：区切り（語句・文法・リスニング・並び替え・読解）ごとに、選ぶ問題は記号の枠を並べ、並び替えは4本線 */
 const S=[];let cur=null;
 BK.forEach(b=>{const it0=rd[b.items[0]];const k=SECK(it0);if(!cur||cur.k!==k){cur={k,name:secName(it0),pt:ptOf(it0),cells:[],n:0};S.push(cur);}
  b.items.forEach(i=>{const it=rd[i],ps=POS[i];if(it.ren){it.steps.forEach((s,si)=>{cur.cells.push({lab:`${ps.num}(${si+1})`});cur.n++;});return;}
   cur.cells.push({lab:ps.n>1?`${ps.num}(${ps.k+1})`:`${ps.num}`,it});cur.n++;});});
 const body=S.map(s=>{const hd=`<div class="sh-sec">${s.name}<small>（各${s.pt}点・${s.n}問）</small></div>`;
  if(s.k==='order')return `<div class="su${c.ek&&s.n>5?' ekmany':''}" data-k="order">${hd}${s.cells.map(x=>ansLine(x.it,`<b>${x.lab}</b>`)).join('')}</div>`;
  return `<div class="su" data-k="${s.k}">${hd}<div class="eag">${s.cells.map(x=>`<div class="eac"><span>${x.lab}</span></div>`).join('')}</div></div>`;}).join('');
 return `<div class="sheet cta en" data-r="${R}" data-id="${id}">${headCt(c,T,R,GN,'a')}<div class="sbody">${body}</div><div class="sh-ft">解答用紙　1／1</div></div>`;}

/* 問題用紙のページ分け：入らない .su から後ろを次の紙へ。続きの紙の頭は数学の裏と同じ .sh-cont */
function layCt(first){const pages=[first];let sh=first;
 for(let guard=0;guard<20;guard++){const b=sh.querySelector('.sbody');const lim=limOf(sh);const U=[...b.children];
  const k=U.findIndex(u=>u.offsetTop+u.offsetHeight-b.offsetTop>lim);if(k<0)break;
  /* .su がまるごと1ページより高いときは、その中の .sq ごとに分ける（区切りの頭は前の紙に残さない） */
  const nx=document.createElement('div');nx.className='sheet ctq en cont';nx.dataset.r=first.dataset.r;nx.dataset.id=first.dataset.id;
  nx.innerHTML=`<div class="sh-cont">${first.dataset.call}　問題用紙（続き）</div><div class="sbody"></div><div class="sh-ft"></div>`;
  sh.after(nx);const nb=nx.querySelector('.sbody');
  if(k===0){/* 1つ目から入らない＝.sq で分ける */const u=U[0];const Q=[...u.querySelectorAll(':scope>.sq')];const j=Q.findIndex(q=>q.offsetTop+q.offsetHeight-b.offsetTop>lim);
   if(j<=0){U.slice(1).forEach(x=>nb.appendChild(x));}else{const u2=u.cloneNode(false);Q.slice(j).forEach(q=>u2.appendChild(q));nb.appendChild(u2);U.slice(1).forEach(x=>nb.appendChild(x));}}
  else U.slice(k).forEach(x=>nb.appendChild(x));
  pages.push(nx);sh=nx;}
 pages.forEach((p,i)=>{p.querySelector('.sh-ft').textContent=`問題用紙　${i+1}／${pages.length}`;});
 /* テストは問題用紙・解答用紙とも新しい紙の表から（KWT_紙と印刷.md 2026-10-19 17:15）。奇数ページで終わったら白紙を1枚 */
 if(pages.length%2){const w=document.createElement('div');w.className='sheet blank en';w.innerHTML='<div class="sh-ft">（白紙）</div>';sh.after(w);}
 return pages.length;}

function layoutEn(root){root.querySelectorAll('.sheet.sf.en').forEach(layRound);root.querySelectorAll('.sheet.ctq.en:not(.cont)').forEach(layCt);
 root.querySelectorAll('.sheet.cta.en').forEach(sh=>{const b=sh.querySelector('.sbody');const U=[...b.children];const free=limOf(sh)-usedOf(sh);if(free>0&&U.length){const g=Math.min(free/U.length,6*3.78);U.forEach(u=>u.style.marginBottom=g+'px');}});}

const CSS_EN=`
/* 4本線（teacher.html .pp-l4 と同じ部品・線は色でなく種類で分ける：上下＝細い実線／2本目＝点線／基線＝太い実線） */
.ggp .pp-l4{position:relative;display:inline-block;height:7mm;vertical-align:-2.1mm;border-top:0.25mm solid #444;border-bottom:0.25mm solid #444;margin:0.5mm 0}
.ggp .pp-l4:before{content:"";position:absolute;left:0;right:0;top:33%;border-top:0.3mm dotted #444}
.ggp .pp-l4:after{content:"";position:absolute;left:0;right:0;top:66%;border-top:0.6mm solid #000}
.ggp .pp-l4.blk{display:block;width:100%;vertical-align:baseline}
.ggp .sheet.en{font-size:12.5px}
.ggp .sheet.en .sq{padding:4px 0 5px}
.ggp .sheet.en .egh2{font-size:12px;margin:0 0 3px}
.ggp .sheet.en .qq{line-height:1.5}
.ggp .qx{display:flex;gap:5px;align-items:flex-start}.ggp .qsub{flex:none;line-height:1.6;min-width:7mm}.ggp .qc{flex:1;min-width:0}
.ggp .ejp{font-size:12.5px}
.ggp .een,.ggp .eut,.ggp .eqq{font-size:14px}
.ggp .een{margin-top:1px;line-height:2.1}
.ggp .eword{font-size:18px;font-weight:800;letter-spacing:.2px;display:inline-block;margin-left:2px}
.ggp .edlg{margin:2px 0}
.ggp .edl{display:flex;gap:6px;line-height:2.1}
.ggp .esp{flex:none;min-width:9mm;font-weight:700}
.ggp .eut{flex:1}
.ggp .ebl{white-space:nowrap}
.ggp .eqq{font-weight:600;margin:1px 0}
.ggp .ememo,.ggp .edtb{border-collapse:collapse;margin:3px 0 4px;font-size:13px}
.ggp .ememo th,.ggp .ememo td,.ggp .edtb td,.ggp .edtb th{border:1px solid #111;padding:2px 10px;text-align:left}
.ggp .ememo th{background:#f1f5f9;font-weight:700}
.ggp .edoc{border:1.5px solid #111;border-radius:4px;padding:4px 8px 6px;margin:3px 0 5px;display:inline-block;min-width:90mm}
.ggp .edoct{font-weight:800;font-size:14px;text-align:center;margin-bottom:2px}
.ggp .edoc .edtb{width:100%;margin:0}
.ggp .erd{margin:2px 0 4px}
.ggp .ech{display:grid;gap:3px 10px;margin:4px 0 1px;font-size:13.5px}
.ggp .ech.c4{grid-template-columns:repeat(4,1fr)}.ggp .ech.c2{grid-template-columns:repeat(2,1fr)}.ggp .ech.c1{grid-template-columns:1fr}
.ggp .ech span{line-height:1.35}.ggp .ech b{font-weight:800;margin-right:6px}
.ggp .etk{margin:4px 0 2px}
.ggp .etk span{border:1px solid #555;border-radius:1.5mm;padding:0 2.2mm;margin:0 1.6mm 0.8mm 0;display:inline-block;line-height:1.45;font-size:14px}
.ggp .eol{display:flex;align-items:flex-start;gap:2mm;margin:3px 0 1px}
.ggp .eol .pp-l4.blk{flex:1;width:auto}
.ggp .eoln{flex:none;font-size:12px;line-height:7mm;margin-top:0.5mm}
.ggp .epost{flex:none;font-size:15px;line-height:1;padding-top:2.1mm;margin-top:0.5mm;min-width:4mm}
.ggp .sq .an.wd{width:48mm}
.ggp .sh-ca{font-size:12px;margin-top:3px;line-height:1.35;display:flex;flex-wrap:wrap;gap:2px 10px;align-items:baseline}.ggp .sh-ca b{font-weight:700}.ggp .sh-ex .eex{font-family:inherit;font-weight:700}.ggp .sh-ex .eexj{font-size:11px;color:#4b5563;margin-left:3px}\n.ggp .sq .an.wd:before{content:"意味"}
.ggp .sheet.en .sq .an{height:11mm}
/* 章まとめテスト */
.ggp .sh-pt{font-size:11.5px;font-weight:700;margin:5px 0 0;white-space:nowrap}
.ggp .sh-qr.big{width:27mm;height:27mm;font-size:10px}
.ggp .eag{display:grid;grid-template-columns:repeat(6,1fr);gap:2.2mm 3mm;margin:3px 0 2px 2mm}
.ggp .eac{border:1.5px solid #111;border-radius:4px;height:12mm;position:relative}
.ggp .eac span{position:absolute;top:0;left:3px;font-size:10px;color:#334155}
.ggp .cta .eol{margin:4.2mm 0 0 2mm}.ggp .cta .su.ekmany .eol{margin-top:2.4mm}   /* 2026-11-14 英検のまとめテスト40問：並べかえが6問以上なら行の間を詰めて解答用紙を1枚に */.ggp .cta .eoln{min-width:11mm;font-size:12px}
.ggp .egr{display:flex;align-items:center;gap:3mm}.ggp .egr .eword{flex:none;width:34mm;font-size:16px}.ggp .egr .ech{flex:1;margin:0}
.ggp .sh-sec .ls-n{font-size:11px;font-weight:700;margin-left:8px;border:1.3px solid #111;border-radius:4px;padding:0 5px;color:#111}.ggp .sh-sec small{font-weight:600;font-size:11px;margin-left:4px;color:#334155}
.ggp .sheet.blank{display:flex}
`;
PP.cssEn=CSS_EN;PP.roundEn=roundEn;PP.ctEn=ctEn;PP.layoutEn=layoutEn;
})(typeof window!=='undefined'?window:globalThis);
