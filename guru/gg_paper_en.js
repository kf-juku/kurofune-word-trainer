/* gg_paper_en.js：ぐるぐる英語の紙（2026-11-03・2026-11-17 に今の決まり K3 に合わせて作り直し）。gg_paper.js（数学の紙）を読んだあとに読む。見出し・.sheet・sh-ft・名前の欄は数学の紙と同じ部品を使う。
   決まり＝仕様書\ぐるぐる英語_作り方の決まり.md の「★★決まったこと」K2（1回16問）・K3（答え方：紙は選ぶ問題は記号を書く・並べかえは札と枠の外の語を出し英文を4本線に書く）・K4（全部6択）・K5・K10②（1回＝A4 表裏1枚）・K12（2つ選ぶ＝記号2つ）・M3（章まとめテスト）・N2。4本線＝teacher.html の .pp-l4（KWT_紙と印刷.md「4線」）
   使い方：
     ggPaper.cssEn                     ＝英語の紙の CSS（ggPaper.css のあとに入れる）
     ggPaper.roundEn(GG, パートid, 回)  ＝通常回・入試パターンの1回分（表と裏の2枚）
     ggPaper.ctEn(GG, テストid, 回, 'q'|'a') ＝章まとめテストの問題用紙（'q'）・解答用紙（'a'）。英検のまとめテスト（c.ek）は前の作りのまま
     ggPaper.ansEn(GG, パートid か テストid, 回) ＝解答解説（正解の記号・2つ選ぶは記号2つ・並べかえは英文、と解説）
     ggPaper.layoutEn(root)            ＝入れたあとに呼ぶ：選択肢の列・1回の表と裏の分け方（番号の順・入らなければ字を詰める）・問題用紙と解答解説のページ分け
   紙の答え方（K3）：選ぶ問題（単語・穴うめ・書きかえ・リスニング・読解。全部6択）は記号を右の枠（章まとめテストは解答用紙）に書く／2つ選ぶ問題は枠2つ／並べかえは札（使わない語も入った語群）を見て英文を全部4本線に書く。
   紙に出さないもの：.eaf（放送文・和訳＝答え合わせのあとだけ。解答解説には出す）・.eau（音のボタン。音は見出しの QR）・.egh。英検のまとめテスト（c.ek・it.pk）の部品（kindOf・secName・ghPaper・itemC・headEk）は前のまま */
(function(G){
const PP=G.ggPaper;const RD=PP.RD,HD=PP.HD;
const KANA='アイウエオカキクケコ';   /* 並べかえの札は10個まで（決まり K5・11-17） */
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

/* ===== ぐるぐる英語の紙（2026-11-17 作り直し・決まり K2〜K5・K10②・K12・M3・N2） =====
   通常回・会話表現・入試パターンの1回（16問）＝ A4 の表と裏の1枚（.sheet.sf.en.gge と .sheet.sb.en.gge）。問題は番号の順に表から裏へ流す。
   答え方（K3）：選ぶ問題（単語・穴うめ・書きかえ・リスニング・読解。全部6択 K4）は ア〜カ を出し、右の枠に記号を書く。2つ選ぶ問題（K12・qdata の m2）は枠を2つ。
     並べかえは 日本語（入試パターンは対話も）・札（使わない語も入れた語群 ord.tok）を出し、並べた英文を4本線に書く（文の終わりの記号 ord.post は線の外）。
   リスニングは放送文（.eaf）を紙に出さない。音は見出しの QR（この回を開く）から聞く。.eau（音のボタン）も出さない。
   指示文（gh）は、前の問題と同じ文なら出さない（同じ形が続くときは最初の問題の上に1回だけ）。 */
const gKind=it=>it.ren?'read':it.ord?'order':/class="eau"/.test(String(it.q||''))?'listen':'choice';
const isDlg=it=>/class="edlg"/.test(String(it.q||''));
const KANA6=i=>KANA[i]||'';
/* 紙の指示文。mode 'r'＝1回の紙（答えは紙に書く）、'c'＝章まとめテストの問題用紙（答えは解答用紙に書く） */
function ghG(it,mode){const k=gKind(it);
 if(k==='order'){const where=mode==='c'?'解答用紙に':'4本線に';
  return isDlg(it)?`日本語に合うように並べかえ、【　】の英文を全部${where}書きなさい。使わない語が1つあります。`:`日本語に合うように並べかえ、英文を全部${where}書きなさい。使わない語が1つあります。`;}
 return String(it.gh||'');}
/* 選択肢 ア〜カ。列の数はまず字の長さで見当をつけ、layout で枠からはみ出したら列を減らす（6→3→2→1） */
function chG(c){const n=Math.max(0,...(c||[]).map(wOf));const col=n<=12?6:n<=26?3:n<=54?2:1;
 return `<div class="gch" data-c="${col}" style="--gc:${col}">${(c||[]).map((x,i)=>`<span><b>${KANA6(i)}</b><i>${x}</i></span>`).join('')}</div>`;}
/* 答えの枠。2つ選ぶ問題は枠を2つ（K12） */
/* 2026-11-17 並べかえ（st.op＝[3,5]）：札に記号・答えは「3番目」「5番目」の枠2つ（決まり K5） */
const anG=(st,lab)=>st&&st.op?`<div class="an2 op"><div class="an"><span class="ank">${st.op[0]}番目</span></div><div class="an"><span class="ank">${st.op[1]}番目</span></div></div>`:st&&st.m2?`<div class="an2"><div class="an"></div><div class="an">${lab?`<span class="ank">${lab}</span>`:''}</div></div>`:`<div class="an">${lab?`<span class="ank">${lab}</span>`:''}</div>`;
const m2Tag=st=>st&&st.m2?'<span class="m2t">2つ選ぶ</span>':'';
const qG=it=>strip(it.q,['.eau','.eaf','.egh']);
const tokG=it=>`<div class="etk">${(it.ord&&it.ord.tok||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div>`;
const lineG=it=>`<div class="eol">${L4B}${postOf(it)?`<span class="epost">${esc(postOf(it))}</span>`:''}</div>`;
/* 1回の紙の1問（.su）。ghOn＝指示文を出すか */
function itemG(it,num,ghOn,mode){const k=gKind(it);const gh=ghOn?`<div class="ggh">${ghG(it,mode)}</div>`:'';
 const NO=`<div class="no">${num}</div>`,SUB='<div class="no sub"></div>';
 if(k==='read'){const st=it.steps.map((s,si)=>`<div class="sq gst">${SUB}<div class="bd"><div class="qq">(${si+1}) ${s.s}${m2Tag(s)}</div>${chG(s.c)}</div>${mode==='c'?'':anG(s,`${num}(${si+1})`)}</div>`).join('');
  return `<div class="su gu" data-k="read"><div class="sq grh">${NO}<div class="bd">${gh}<div class="erd">${qG(it)}</div></div></div>${st}</div>`;}
 if(k==='order')return `<div class="su gu" data-k="order"><div class="sq">${NO}<div class="bd">${gh}${qG(it)}${tokG(it)}${mode==='c'?'':lineG(it)}</div></div></div>`;
 return `<div class="su gu" data-k="${k}"><div class="sq">${NO}<div class="bd">${gh}<div class="gq">${qG(it)}${m2Tag(it)}</div>${chG(it.c)}</div>${mode==='c'?'':anG(it,'')}</div></div>`;}
/* 小問の数（連問は steps の数） */
const nqOf=rd=>rd.reduce((s,it)=>s+(it.ren?it.steps.length:1),0);

function headRound(GG,p,R,H,GN){
 /* 入試パターンは番号（入試1 → ①）を単元名の横に出す。通常回はキャッチを見出しに出す */
 if(H.ny&&!H.maru){const q=(GG.ny||[]).find(x=>x.id===p.id);if(q&&q.no)H=Object.assign({},H,{maru:'①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'[q.no-1]||String(q.no)});}
 const ex=(p.cover||[])[0];const ca=(!H.ny&&(p.catch||ex))?`<div class="sh-ca">${p.catch?`<b>${esc(p.catch)}</b>`:''}${ex?`<span class="sh-ex">例　${ex.q}</span>`:''}</div>`:'';
 const dots=Array.from({length:H.n},(_,i)=>`<span class="${i+1===H.k?'on':''}">${i+1}</span>`).join('');
 const ttl=H.ny?`${H.unit} <span class="mr">${H.maru}</span>`:p.kaiwa?`${H.unit} <span class="kw">会話表現</span>`:`${H.unit}${H.n>1?`<span class="sh-dots sh-di">${dots}</span>`:''}`;
 return `<div class="sh-h"><div class="sh-l"><div class="sh-k">${H.grade}${SJN[H.subj]||'英語'}<b>ぐるぐる</b></div><div class="sh-tt">${ttl}</div><div class="sh-ps">${H.main}${H.sub?` <small>（${H.sub}）</small>`:''}</div>${H.ny&&H.aft?`<div class="sh-dots"><i>${H.aft} が終わったら挑戦</i></div>`:''}${ca}</div><div class="sh-r"><div class="sh-rd">${RD(R)}</div><div class="sh-rt">${GN}問・${p.min||10}分</div></div><div class="sh-qr">QR<br>この回を開く</div></div>
 <div class="sh-f"><span class="b" style="width:24mm">　月　　日</span><span class="b nm">名前</span><span class="b sc"><span>正解</span><span>／${GN}</span></span></div>
 <div class="sh-ins">選ぶ問題は ア〜カ から選び、右の枠に記号を書きなさい（2つ選ぶ問題は枠に1つずつ）。並べかえは英文をノートに全部書き、聞かれた2つの位置に来る語の記号を枠に書きなさい。リスニングの音声は右上の QR から聞きます。（${p.min||10}分）</div>`;}

function roundEn(GG,id,R){const p=(GG.parts||[]).find(x=>x.id===id);if(!p||!p.rounds[R])return '';const rd=p.rounds[R];
 const H=HD(GG,id);const GN=nqOf(rd);const {POS}=blocks(rd);let pg='';
 const U=rd.map((it,i)=>{const g=ghG(it,'r');const on=g!==pg;pg=g;return itemG(it,POS[i].num,on,'r');});
 const cont=`<div class="sh-cont">${callG(GG,p,id,R)}（裏）<small>　${H.main}</small></div>`;
 return `<div class="sheet sf en gge" data-r="${R}" data-id="${id}">${headRound(GG,p,R,H,GN)}<div class="sbody">${U.join('')}</div><div class="sh-ft">${RD(R)}　表　（裏に続く）</div></div>`
  +`<div class="sheet sb en gge" data-r="${R}" data-id="${id}">${cont}<div class="sbody"></div><div class="sh-ft">${RD(R)}　裏</div></div>`;}

/* 呼び名（裏の頭・解答解説の続き）。会話表現のパートは文法のパートの番号（①…）に数えない（gg_shell.js と同じ）ので「会話表現」と書く */
const callG=(GG,p,id,R)=>p&&p.kaiwa?`${HD(GG,id).unit} 会話表現 ${RD(R)}`:PP.CALL(GG,id,R);
const limOf=sh=>{const b=sh.querySelector('.sbody'),ft=sh.querySelector('.sh-ft');return ft.offsetTop-16-b.offsetTop;};
const usedOf=sh=>{const b=sh.querySelector('.sbody');const L=b.lastElementChild;return L?L.offsetTop+L.offsetHeight-b.offsetTop:0;};
/* 選択肢の列：枠からはみ出す選択肢があれば列を減らす（6→3→2→1） */
const COLS=[6,3,2,1];
function fitCh(root){root.querySelectorAll('.gge .gch').forEach(g=>{let c=+g.dataset.c;g.style.setProperty('--gc',c);g.classList.toggle('c1',c===1);
 const bad=()=>[...g.children].some(x=>x.scrollWidth>x.clientWidth+1);
 while(c>1&&bad()){c=COLS[COLS.indexOf(c)+1];g.style.setProperty('--gc',c);g.classList.toggle('c1',c===1);}});}
/* 表と裏の分け方：番号の順に表へ入れ、入らない問題から後ろを裏へ。裏に入らなければ、字と行の間を1段ずつ詰める（z1〜z3）。それでも入らなければ data-over（はみ出す高さ px）を付ける */
function layRoundG(sf){const sb=sf.nextElementSibling;const B1=sf.querySelector('.sbody'),B2=sb.querySelector('.sbody');
 const flow=()=>{[...B2.children].forEach(u=>B1.appendChild(u));[...B1.children].forEach(u=>u.style.marginBottom='');fitCh(sf);
  const lim=limOf(sf);const U=[...B1.children];const k=U.findIndex(u=>u.offsetTop+u.offsetHeight-B1.offsetTop>lim);
  if(k>=0)U.slice(k).forEach(u=>B2.appendChild(u));return usedOf(sb)-limOf(sb);};
 let z=0,over=flow();
 while(over>0&&z<3){[sf,sb].forEach(s=>{s.classList.remove('z'+z);s.classList.add('z'+(z+1));});z++;over=flow();}
 sf.dataset.z=z;sf.dataset.k=B1.children.length;
 if(over>0){sf.dataset.over=Math.round(over);
  /* 2026-11-28 字を詰めても裏に入らないときは、黙って切らずに続きの紙へ送る（前は .sheet の overflow:hidden で下が紙に出なかった＝中1① C-1 の裏の 14番）。先生画面は data-over で知らせる */
  let sh=sb;for(let g=0;g<4;g++){const b=sh.querySelector('.sbody'),lim=limOf(sh),U=[...b.children],k=U.findIndex(u=>u.offsetTop+u.offsetHeight-b.offsetTop>lim);if(k<0)break;
   const nx=document.createElement('div');nx.className=sb.className+' cont';nx.innerHTML='<div class="sh-cont">（裏の続き）</div><div class="sbody"></div>'+(sb.querySelector('.sh-ft')?'<div class="sh-ft">'+sb.querySelector('.sh-ft').innerHTML+'（続き）</div>':'');
   sh.after(nx);const nb=nx.querySelector('.sbody');U.slice(Math.max(1,k)).forEach(x=>nb.appendChild(x));if(k===0)break;sh=nx;}
  return;}
 delete sf.dataset.over;
 /* 余った高さは問題のあいだに少しずつ配る（1問 5mm まで）。書く所を窮屈にしない */
 [sf,sb].forEach(sh=>{const b=sh.querySelector('.sbody');const U=[...b.children];if(!U.length)return;const free=limOf(sh)-usedOf(sh);if(free<=0)return;const g=Math.min(free/U.length,5*3.78);U.forEach(u=>u.style.marginBottom=g+'px');});}

/* ===== 章まとめテスト（ぐるぐる英語・M3）：問題用紙（何ページでも）・解答用紙（1枚）。英検のまとめテスト（c.ek）は下の ctEn の前からの作りのまま ===== */
/* 大問の区切り＝T.secs（小問の数で区切る）。小問の通し番号 j → 区切りの番号 */
function secOfJ(T){const S=T.secs||[];const at=[];let j0=0;S.forEach((s,si)=>{for(let k=0;k<s.n;k++)at[j0+k]=si;j0+=s.n;});return at;}
function headCtG(c,T,R,GN,kind){const lis=(T.items||[]).some(x=>gKind(x)==='listen');
 const h=`<div class="sh-h"><div class="sh-l"><div class="sh-k">${c.grade}${SJN[c.subj]||'英語'}<b>ぐるぐる</b></div><div class="sh-tt">${c.unit} <span class="mr">${c.rng||''}</span></div><div class="sh-ps">章まとめテスト　${kind==='a'?'解答用紙':'問題用紙'}</div></div><div class="sh-r"><div class="sh-rd">${RD(R)}</div><div class="sh-rt">${GN}問・${T.min||30}分・100点</div></div>${kind==='a'||lis?`<div class="sh-qr${kind==='a'?' big':''}">QR<br>${kind==='a'?'このテストを開く':'音声を聞く'}</div>`:''}</div>`;
 const pt=`<div class="sh-pt">配点：${T.wpt||''}（100点満点）／制限時間：${T.min||30}分</div>`;
 if(kind==='a')return h+`<div class="sh-f"><span class="b" style="width:24mm">　月　　日</span><span class="b nm">名前</span><span class="b sc"><span>点数</span><span>／100</span></span></div>${pt}<div class="sh-ins">選ぶ問題は記号（ア〜カ）を枠に書きなさい。2つ選ぶ問題は枠に1つずつ書きなさい。並べかえは、聞かれた2つの位置（◯番目・◯番目）に来る語の記号を、枠の左と右に書きなさい。</div>`;
 return h+pt+`<div class="sh-ins">答えはすべて解答用紙に書きなさい。選ぶ問題は記号（ア〜カ）を、2つ選ぶ問題は記号を2つ、並べかえは聞かれた2つの位置に来る語の記号を書きなさい。${lis?'リスニングの音声は右上の QR から聞きます。':''}</div>`;}
function ctG(GG,c,T,R,kind){const rd=T.items;const GN=nqOf(rd);const {POS}=blocks(rd);const SA=secOfJ(T);const S=T.secs||[];
 const id=c.id,CALLC=`章まとめテスト ${c.unit} ${c.rng||''} ${RD(R)}`;
 const secH=si=>{const s=S[si];if(!s)return '';return `<div class="sh-sec">${esc(s.name)}<small>（${s.n}問・各${T.pt||ptOf(rd[0])||''}点）</small></div>`;};
 if(kind!=='a'){let j=0,ps=-1,pg='';const U=rd.map((it,i)=>{const si=SA[j];j+=it.ren?it.steps.length:1;let h='';if(si!==ps){h=secH(si);ps=si;pg='';}const g=ghG(it,'c');const on=g!==pg;pg=g;const u=itemG(it,POS[i].num,on,'c');return h?u.replace('<div class="su gu"',`<div class="su gu" data-sec="1"`).replace(/^(<div class="su gu"[^>]*>)/,`$1${h}`):u;});
  return `<div class="sheet ctq en gge" data-r="${R}" data-id="${id}" data-call="${esc(CALLC)}">${headCtG(c,T,R,GN,'q')}<div class="sbody">${U.join('')}</div><div class="sh-ft">問題用紙</div></div>`;}
 /* 解答用紙：大問ごとに、選ぶ問題は記号の枠（2つ選ぶ問題は2つ分の幅で枠2つ）、並べかえは4本線 */
 const Q=[];rd.forEach((it,i)=>{const ps=POS[i];if(it.ren){it.steps.forEach((s,si)=>Q.push({lab:`${ps.num}(${si+1})`,st:s,k:'read'}));return;}Q.push({lab:`${ps.num}`,st:it,it,k:gKind(it)});});
 const G2=[];Q.forEach((q,j)=>{const si=SA[j]!=null?SA[j]:0;if(!G2[si])G2[si]=[];G2[si].push(q);});
 const body=G2.map((L,si)=>{const hd=secH(si);if(L.every(q=>q.k==='order'))return `<div class="su" data-k="order">${hd}${L.map(q=>`<div class="eol"><span class="eoln"><b>${q.lab}</b></span>${L4B}${postOf(q.it)?`<span class="epost">${esc(postOf(q.it))}</span>`:''}</div>`).join('')}</div>`;
  return `<div class="su" data-k="ch">${hd}<div class="eag">${L.map(q=>q.k==='order'?'':`<div class="eac${q.st.m2||q.st.op?' m2':''}"><span>${q.lab}${q.st.op?`（${q.st.op[0]}番目・${q.st.op[1]}番目）`:q.st.m2?'（2つ）':''}</span>${q.st.m2||q.st.op?'<i></i>':''}</div>`).join('')}</div>${L.filter(q=>q.k==='order').map(q=>`<div class="eol"><span class="eoln"><b>${q.lab}</b></span>${L4B}${postOf(q.it)?`<span class="epost">${esc(postOf(q.it))}</span>`:''}</div>`).join('')}</div>`;}).join('');
 return `<div class="sheet cta en gge" data-r="${R}" data-id="${id}">${headCtG(c,T,R,GN,'a')}<div class="sbody">${body}</div><div class="sh-ft">解答用紙　1／1</div></div>`;}

/* ===== 解答解説（ぐるぐる英語の1回・章まとめテスト）：問題ごとに 正解（記号・2つ選ぶは記号2つ・並べかえは英文）と解説。リスニングは放送文と和訳も（答え合わせのあとに見る紙なので） ===== */
function wLine(l,c){l=String(l==null?'':l);if(l.slice(0,2)==='&+')return '';if(l.charAt(0)==='&'){const bx=typeof window!=='undefined'&&window.ggEnBox?window.ggEnBox(l):null;return bx?`<div class="wbx">${bx}</div>`:'';}let m=/^#\{(\d+)\}(.*)$/.exec(l);if(m)return `<div class="wx"><b>${KANA6(+m[1])} を選んだ人</b>${m[2]}</div>`;
 if(l.charAt(0)==='#')return `<div class="wx">${l.slice(1)}</div>`;if(l.charAt(0)==='>')return `<div class="wu">${l.slice(1)}</div>`;return `<div class="wl">${l}</div>`;}
const wHtml=(w,c)=>(w||[]).map(l=>wLine(l,c)).join('');
function ansOf(st){if(st.ord)return `<span class="ae">${esc(st.a)}</span>${(st.ord.alt||[]).length?`<div class="aalt">別の正しい語順：${st.ord.alt.map(esc).join('　／　')}</div>`:''}`;
 if(st.op){const a=String(st.a).split(',').map(Number);return `<b class="ak">${st.op.map((p,n)=>`${p}番目 ${KANA6(a[n])}`).join('・')}</b><span class="act">${esc(st.full||'')}</span>`;}
 if(st.m2){const a=String(st.a).split(',').map(Number);return `<b class="ak">${a.map(KANA6).join('・')}</b><span class="act">${a.map(i=>`${KANA6(i)} ${st.c[i]}`).join('　／　')}</span>`;}
 return `<b class="ak">${KANA6(st.a)}</b><span class="act">${st.c[st.a]}</span>`;}
function ansItem(it,num){const k=gKind(it);const eaf=(()=>{const t=document.createElement('template');t.innerHTML=String(it.q||'');const e=t.content.querySelector('.eaf');return e?`<div class="xaf">${e.innerHTML}</div>`:'';})();
 if(k==='read')return `<div class="su xa"><div class="sq"><div class="no">${num}</div><div class="bd">${eaf}${it.steps.map((s,si)=>`<div class="xr"><div class="xh">(${si+1}) ${ansOf(s)}</div>${wHtml(s.w,s.c)}</div>`).join('')}</div></div></div>`;
 return `<div class="su xa"><div class="sq"><div class="no">${num}</div><div class="bd"><div class="xh">${ansOf(it)}</div>${k==='listen'?eaf:''}${wHtml(it.w,it.c)}</div></div></div>`;}
function ansEn(GG,id,R){let rd,head,call;const p=(GG.parts||[]).find(x=>x.id===id);
 if(p){if(!p.rounds[R])return '';rd=p.rounds[R];const H=HD(GG,id);call=callG(GG,p,id,R);
  head=`<div class="sh-h"><div class="sh-l"><div class="sh-k">${H.grade}${SJN[H.subj]||'英語'}<b>ぐるぐる</b></div><div class="sh-tt">${H.ny?'入試パターン':p.kaiwa?`${H.unit} <span class="kw">会話表現</span>`:H.unit}</div><div class="sh-ps">${H.main}${H.sub?` <small>（${H.sub}）</small>`:''}　解答解説</div></div><div class="sh-r"><div class="sh-rd">${RD(R)}</div><div class="sh-rt">${nqOf(rd)}問</div></div></div>`;}
 else{const o=ctOf(GG,id,R);if(!o)return '';rd=o.rd;call=`章まとめテスト ${o.c.unit} ${o.c.rng||''} ${RD(R)}`;
  head=`<div class="sh-h"><div class="sh-l"><div class="sh-k">${o.c.grade}${SJN[o.c.subj]||'英語'}<b>ぐるぐる</b></div><div class="sh-tt">${o.c.unit} <span class="mr">${o.c.rng||''}</span></div><div class="sh-ps">章まとめテスト　解答解説</div></div><div class="sh-r"><div class="sh-rd">${RD(R)}</div><div class="sh-rt">${nqOf(rd)}問・100点</div></div></div>`;}
 const {POS}=blocks(rd);
 return `<div class="sheet ctq gga en gge" data-r="${R}" data-id="${id}" data-call="${esc(call)}" data-lab="解答解説">${head}<div class="sbody">${rd.map((it,i)=>ansItem(it,POS[i].num)).join('')}</div><div class="sh-ft">解答解説</div></div>`;}
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

function ctEn(GG,id,R,kind){const o=ctOf(GG,id,R);if(!o)return '';const {c,T,rd}=o;if(!c.ek)return ctG(GG,c,T,R,kind);const GN=ctNQ(rd);const {BK,POS}=blocks(rd);
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
  const nx=document.createElement('div');nx.className=first.className+' cont';const LAB=first.dataset.lab||'問題用紙';nx.dataset.r=first.dataset.r;nx.dataset.id=first.dataset.id;
  nx.innerHTML=`<div class="sh-cont">${first.dataset.call}　${LAB}（続き）</div><div class="sbody"></div><div class="sh-ft">　</div>`;   /* 2026-11-28 下の行は組んだあとに字が入る。空のままだと高さが0で、入る所を1行分（約4mm）多く見積もっていた */
  sh.after(nx);const nb=nx.querySelector('.sbody');
  if(k===0){/* 1つ目から入らない＝.sq で分ける */const u=U[0];const Q=[...u.querySelectorAll(':scope>.sq')];const j=Q.findIndex(q=>q.offsetTop+q.offsetHeight-b.offsetTop>lim);
   /* 2026-11-28 1つの小問（.sq）が1ページより高いとき（読解の解説など）は、その中の段で分けて続きのページへ送る。前は下が切れて紙に出なかった（中1① B-1・B-2・C-1 の 14番） */
   let cut=false;if(j===0&&Q[0]){const bt=b.getBoundingClientRect().top;
    /* 段の中を下へたどり、ページの下をこえる最初の段で分ける。分けた後ろは同じ入れ物の写しに入れて続きのページへ */
    const tail=el=>{const C=[...el.children].filter(c=>c.getBoundingClientRect().height>0);const ci=C.findIndex(c=>c.getBoundingClientRect().bottom-bt>lim);if(ci<0)return null;
     const D=C[ci];if(D.children.length>=1&&(D.tagName!=='TABLE'||D.offsetHeight>lim-40)&&D.getBoundingClientRect().top-bt<lim-40){const t=tail(D);if(t){const e2=el.cloneNode(false);e2.appendChild(t);C.slice(ci+1).forEach(c=>e2.appendChild(c));return e2;}}   /* こえる段の中でも分けられるなら中で分ける（ページを埋める）。子が1つだけの段（解説の箱 .wbx など）も中へたどる。表（table）は中で分けない（列の幅が変わって高さがずれ、見出しの行も消える）。ただし1ページより高い表だけは行で分ける */
     if(ci===0)return null;
     const e2=el.cloneNode(false);C.slice(ci).forEach(c=>e2.appendChild(c));return e2;};
    const q2=tail(Q[0]);if(q2){q2.classList.add('qcont');const u2=u.cloneNode(false);u2.appendChild(q2);Q.slice(1).forEach(x=>u2.appendChild(x));nb.appendChild(u2);U.slice(1).forEach(x=>nb.appendChild(x));cut=true;}}
   if(cut){}else if(j<=0){U.slice(1).forEach(x=>nb.appendChild(x));}else{const u2=u.cloneNode(false);Q.slice(j).forEach(q=>u2.appendChild(q));nb.appendChild(u2);U.slice(1).forEach(x=>nb.appendChild(x));}}
  else U.slice(k).forEach(x=>nb.appendChild(x));
  pages.push(nx);sh=nx;}
 const LAB0=first.dataset.lab||'問題用紙';pages.forEach((p,i)=>{p.querySelector('.sh-ft').textContent=`${LAB0}　${i+1}／${pages.length}`;});
 /* テストは問題用紙・解答用紙とも新しい紙の表から（KWT_紙と印刷.md 2026-10-19 17:15）。奇数ページで終わったら白紙を1枚 */
 if(pages.length%2){const w=document.createElement('div');w.className='sheet blank en';w.innerHTML='<div class="sh-ft">（白紙）</div>';sh.after(w);}
 return pages.length;}

function layoutEn(root){root.querySelectorAll('.sheet.sf.en.gge').forEach(layRoundG);fitCh(root);root.querySelectorAll('.sheet.ctq.en:not(.cont)').forEach(layCt);
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
/* ぐるぐる英語（2026-11-17 作り直し・.gge の紙だけに効く。英検のまとめテストの紙は上の CSS_EN のまま） */
const CSS_GG=`
.ggp .sheet.gge{font-size:12.5px;line-height:1.42}
.ggp .gge .sq{padding:3px 0 4px;gap:7px}
.ggp .gge .sq .bd{min-width:0}
.ggp .gge .ggh{font-size:11.5px;margin:0 0 2px;color:#111;font-weight:600}
.ggp .gge .ejp{font-size:12.5px}
.ggp .gge .een,.ggp .gge .eut,.ggp .gge .eqq{font-size:13.5px}
.ggp .gge .een{line-height:1.6;margin-top:1px}
.ggp .gge .edl{line-height:1.6;gap:5px}
.ggp .gge .eqq{font-weight:600}
.ggp .gge .gq .eqq{display:inline}
.ggp .gge .m2t{display:inline-block;margin-left:6px;border:1.3px solid #111;border-radius:4px;padding:0 4px;font-size:10.5px;font-weight:800;line-height:1.35;vertical-align:1px;white-space:nowrap}
.ggp .gge .gch{display:grid;grid-template-columns:repeat(var(--gc,3),minmax(0,1fr));gap:1px 8px;margin:3px 0 1px;font-size:13.5px}
.ggp .gge .gch>span{display:flex;gap:4px;white-space:nowrap;overflow:hidden;line-height:1.45;min-width:0}
.ggp .gge .gch>span b{flex:none;font-weight:800}
.ggp .gge .gch>span i{font-style:normal;white-space:nowrap}
.ggp .gge .gch.c1>span,.ggp .gge .gch.c1>span i{white-space:normal}
.ggp .gge .sq .an{height:11mm;width:16mm}
.ggp .gge .an2{flex:none;display:flex;gap:1.2mm;align-self:center}
.ggp .gge .an2 .an{width:12.5mm;align-self:auto}
.ggp .gge .an2.op .an{width:14mm}
.ggp .gge .an2.op .an:before{content:none}
.ggp .gge .an2.op .ank{left:2px;top:1px;right:auto;bottom:auto;font-size:8.5px}
.ggp .gge .erd{display:flex;flex-wrap:wrap;gap:1mm 4mm;align-items:flex-start;margin:2px 0 1px}
.ggp .gge .erd>.edlg{flex:1 1 100%}
.ggp .gge .edoc{margin:2px 0 2px;padding:3px 8px 4px;max-width:100%}
.ggp .gge .edoc .een{line-height:1.5}
.ggp .gge .edtb td,.ggp .gge .edtb th{padding:1px 8px}
.ggp .gge .grh{border-bottom:0;padding-bottom:0}
.ggp .gge .gst .qq{font-weight:600}
.ggp .gge .etk{margin:3px 0 1px}
.ggp .gge .etk span{font-size:13.5px;line-height:1.4}
.ggp .gge .eol{margin:3px 0 0}
.ggp .gge .sh-tt .kw{font-size:15px;font-weight:800;border:1.8px solid #111;border-radius:5px;padding:0 6px;margin-left:3mm;vertical-align:5px}
.ggp .gge .sh-sec small{font-weight:600;font-size:11px;margin-left:4px;color:#334155}
/* 1回の紙が表と裏に入らないときに1段ずつ詰める（layRoundG） */
.ggp .gge.z1 .sq{padding:2px 0 3px}.ggp .gge.z1 .een,.ggp .gge.z1 .edl{line-height:1.45}.ggp .gge.z1 .gch{font-size:13px}.ggp .gge.z1 .ggh{font-size:11px}
.ggp .gge.z2{font-size:12px}.ggp .gge.z2 .sq{padding:1px 0 2px}.ggp .gge.z2 .een,.ggp .gge.z2 .eut,.ggp .gge.z2 .eqq,.ggp .gge.z2 .etk span{font-size:13px}.ggp .gge.z2 .een,.ggp .gge.z2 .edl{line-height:1.4}.ggp .gge.z2 .gch{font-size:12.5px}.ggp .gge.z2 .ggh{font-size:11px}.ggp .gge.z2 .pp-l4{height:6.3mm}.ggp .gge.z2 .ejp{font-size:12px}
.ggp .gge.z3{font-size:11.5px}.ggp .gge.z3 .sq{padding:1px 0 1px}.ggp .gge.z3 .een,.ggp .gge.z3 .eut,.ggp .gge.z3 .eqq,.ggp .gge.z3 .etk span{font-size:12.5px}.ggp .gge.z3 .een,.ggp .gge.z3 .edl{line-height:1.35}.ggp .gge.z3 .gch{font-size:12px}.ggp .gge.z3 .ggh{font-size:10.5px}.ggp .gge.z3 .pp-l4{height:6.3mm}.ggp .gge.z3 .ejp{font-size:11.5px}.ggp .gge.z3 .sq .an{height:10mm}
/* 章まとめテストの解答用紙：2つ選ぶ問題は枠2つ分の幅で、真ん中に点線 */
.ggp .gge .eac.m2{grid-column:span 2}
.ggp .gge .eac.m2 i{position:absolute;left:50%;top:3.5mm;bottom:1mm;border-left:1px dashed #64748b}
.ggp .gge.cta .su{margin-top:1mm}
.ggp .gge.cta .eol{margin:4.6mm 0 0 2mm}
.ggp .gge.cta .eag{grid-template-columns:repeat(8,1fr);gap:2.2mm 2.5mm}
/* 解答解説 */
.ggp .gga .xa .sq{padding:3px 0 4px}
.ggp .gga .xh{font-size:13px;margin:0 0 1px;line-height:1.5}
.ggp .gga .ak{display:inline-block;min-width:8mm;border:1.5px solid #111;border-radius:4px;text-align:center;font-size:14px;margin-right:6px;padding:0 4px}
.ggp .gga .ae{font-size:14px;font-weight:700}
.ggp .gga .aalt{font-size:11px;color:#334155}
.ggp .gga .wl,.ggp .gga .wx,.ggp .gga .wu{font-size:11.5px;line-height:1.5}
.ggp .gga .wu{font-weight:600}
.ggp .gga .wx{color:#334155;padding-left:1em;text-indent:-1em}
.ggp .gga .wx b{font-weight:700;margin-right:4px}
.ggp .gga .xaf{font-size:11px;border:1px solid #cbd5e1;border-radius:4px;padding:2px 6px;margin:2px 0 3px}
.ggp .gga .xaf .eafh{font-weight:700;font-size:10.5px}
.ggp .gga .xaf .edl{line-height:1.4;font-size:11px}
.ggp .gga .xaf small{color:#475569;font-size:10px}
.ggp .gga .xr{margin:3px 0 4px}
`;
PP.cssEn=CSS_EN+CSS_GG;PP.roundEn=roundEn;PP.ctEn=ctEn;PP.ansEn=ansEn;PP.layoutEn=layoutEn;
})(typeof window!=='undefined'?window:globalThis);
