/* gg_paper.js：ぐるぐるの紙（2026-11-03 川上さん 20:41「紙を先に作って PDF で見る」）。先生画面の［ぐるぐる印刷］と確かめの道具が使う。
   元＝モック ジョブス用\道具\20261021_ぐるぐる中2数学\shell2.html の sheetHtml・gLay・紙の CSS（川上さんが確かめた形）を、そのまま移した。決まり＝仕様書\ぐるぐる_作り方の決まり.md §5 紙・§0c「名前と見出し」
   使い方：
     ggPaper.css            ＝紙の CSS（.ggp の中だけに効く）。ページに <style> で入れる
     ggPaper.round(GG, パートid, 回)  ＝通常回の紙（表と裏の2枚）の HTML。<div class="ggp">…</div> の中に入れる
     ggPaper.layout(root)   ＝入れたあと（KaTeX を描いたあと）に呼ぶ：表と裏の分け方と計算の枠の高さを決める（gLay）
     ggPaper.KX(el)         ＝紙の中の数式を描く（アプリと同じ書き方）
   GG＝ggBuildData（gg_load.js）の返り（図を描いたもの） */
(function(G){
const KANA='アイウエオカ';
const RD=r=>String(r||'').replace(/^([ABC])([12])$/,'$1-$2');
const MARU='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮';
const SJN={ma:'数学',en:'英語'};
const NQ=items=>(items||[]).reduce((s,it)=>s+(it&&it.ren?it.steps.length:1),0);
function NMS(name){const s=String(name||''),i=s.indexOf('（');if(i<0)return {main:s,sub:''};const j=s.indexOf('）',i);return j<0?{main:s.slice(0,i).trim(),sub:s.slice(i+1)}:{main:(s.slice(0,i)+s.slice(j+1)).trim(),sub:s.slice(i+1,j)};}
/* 見出しの名前（gg_shell.js の HD と同じ作り） */
function HD(GG,id){const ny=(GG.ny||[]).find(q=>q.id===id);
 if(ny){const nm=NMS(ny.name);const a=ny.after?HD(GG,ny.after):null;return {subj:ny.subj||'ma',grade:ny.grade,unit:'入試パターン',k:0,n:0,maru:'',main:nm.main,sub:nm.sub,name:ny.name,ny:true,aft:a?a.unit+' '+a.maru:''};}
 for(const u of GG.units){const k=u.parts.findIndex(x=>x.id===id);if(k>=0){const x=u.parts[k],nm=NMS(x.name);return {subj:u.subj||'ma',grade:u.grade,unit:u.unit,k:k+1,n:u.parts.length,maru:MARU[k]||'('+(k+1)+')',main:nm.main,sub:nm.sub,name:x.name};}}
 return {subj:'ma',grade:'',unit:'',k:0,n:0,maru:'',main:'',sub:''};}
const CALL=(GG,id,R)=>{const h=HD(GG,id);return (h.ny?'入試パターン '+h.main:h.unit+h.maru)+(R?' '+RD(R):'');};
const GMAC={'\\UA':'\\htmlClass{gsa}{#1}','\\UB':'\\htmlClass{gsb}{#1}','\\UC':'\\htmlClass{gsc}{#1}','\\UD':'\\htmlClass{gsd}{#1}','\\UE':'\\htmlClass{gse}{#1}','\\UR':'\\htmlClass{gsr}{#1}','\\AF':'\\htmlData{af=#1}{#2}','\\AT':'\\htmlData{at=1}{#1}','\\ATD':'\\htmlData{atd=1}{#1}','\\AFB':'\\htmlData{afb=#1}{#2}','\\ATB':'\\htmlData{atb=1}{#1}','\\ATDB':'\\htmlData{atdb=1}{#1}'};   /* 2026-11-04 矢印の2つ目の組（gg_app.js と同じ）。紙は矢印を描かないが、式が赤いエラーにならないように */
const KX=el=>{try{renderMathInElement(el,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false,trust:true,strict:false,macros:GMAC});}catch(e){}};
function sheetHtml(GG,p,R){const rd=p.rounds[R];const H=HD(GG,p.id);const GN=NQ(rd);
 /* 2026-11-01 23:13 川上さん「OKです」：番号は大問式（アプリの mkBlocks と同じ分け方）。連問＝1つの大問、続けて同じ g の問題＝1つの大問（指示文は1回・小問は (1)(2)…）。決まり §0c 点検1 */
 const BK=[];let gk=null;rd.forEach((it,i)=>{if(it.ren){BK.push({items:[i]});gk=null;return;}if(!gk||gk.key!==(it.g||'')){gk={key:it.g||'',items:[]};BK.push(gk);}gk.items.push(i);});
 const POS={};BK.forEach((b,bi)=>b.items.forEach((i,k)=>POS[i]={num:bi+1,k,n:b.items.length}));
 const unit=(it,sec,ii)=>{const ss=it.ren?it.steps:[it];
  /* 2026-11-01 作図を選ぶ問題＝選択肢が図（<svg）で、問題文（連問は小問の文も）に「作図」がある。計算の枠は出さない（決まり §0c 紙の作図・グラフを選ぶ問題）。
     グラフを選ぶ問題（1次関数・ダイヤグラム・水面のグラフなど）は図の6択でも「作図」が無いので、計算の枠を出す */
  const zuOf=st=>(st.c||[]).some(c=>/<svg/.test(c))&&/作図/.test(String(it.q||'')+String(st.s||''));const noCalc=ss.every(zuOf);
  const body=ss.map((st,si)=>{const ps=POS[ii],grp=!it.ren&&ps.n>1,first=it.ren?si===0:ps.k===0,sub=it.ren?`(${si+1})`:grp?`(${ps.k+1})`:'';const vis=c=>String(c).replace(/<[^>]+>/g,'').replace(/\\(dfrac|frac|leqq|geqq|lt|gt|quad|text|times|div)/g,'#').replace(/[{}\\()]/g,'');const gx=st.c.some(c=>/<svg/.test(c));const long=!gx&&st.c.some(c=>vis(c).length>14);
   const head=(it.ren&&si===0)||!it.ren?`<div class="qq">${it.gh&&!it.ren&&ps.k===0?`<div>${it.gh}</div>`:''}${grp?sub+' ':''}${it.q}</div>`:'';
   const chs=gx?st.c.map((c,i)=>`<span><b class="gk">${KANA[i]}</b>${c}</span>`).join(''):st.c.map((c,i)=>`<span>${KANA[i]}　${c}</span>`).join('');
   return `<div class="sq"><div class="no${first?'':' sub'}">${first?ps.num:''}</div><div class="bd">${head}${it.ren?`<div class="qq">(${si+1}) ${st.s}</div>`:''}<div class="ch ${gx?'g6 '+(zuOf(st)?'zu':'gr'):long?'l2':''}">${chs}</div></div><div class="an">${sub?`<span class="ank">${ps.num}${sub}</span>`:''}</div></div>`;}).join('');
  const nL=o=>{let n=0;const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object')Object.keys(x).forEach(k=>{if(k==='w'&&Array.isArray(x.w))x.w.forEach(l=>{if(/^\\\(/.test(String(l)))n++;});else if(typeof x[k]==='object')w(x[k]);});};w(o);return n;};   /* 解説の式の行数（\( で始まる行）＝計算の枠の大きさの目安（2026-11-21） */
  return `<div class="su${noCalc?' nocalc':''}" data-l="${nL(it)}">${sec?`<div class="sh-sec">${sec}</div>`:''}${body}${noCalc?'':'<div class="calc"><span>計算</span></div>'}</div>`;};
 const units=rd.map((it,i)=>unit(it,H.ny?(i===0?'基礎':i===5?`入試の形　${H.main}`:''):(i===0?(H.unit==='小学校の総復習'?'基礎計算':'復習'):i===3?`${H.unit}${H.maru}　${H.main}`:''),i));
 const dots=Array.from({length:H.n},(_,i)=>`<span class="${i+1===H.k?'on':''}">${i+1}</span>`).join('');
 const hd=`<div class="sh-h"><div class="sh-l"><div class="sh-k">${H.grade}${SJN[H.subj]||'数学'}<b>ぐるぐる</b></div><div class="sh-tt">${H.ny?`${H.unit} <span class="mr">${H.maru}</span>`:`${H.unit}${H.n>1?`<span class="sh-dots sh-di">${dots}</span>`:''}`}</div><div class="sh-ps">${H.main}${H.sub?` <small>（${H.sub}）</small>`:''}</div>${H.ny?`<div class="sh-dots"><i>${H.aft} が終わったら挑戦</i></div>`:''}</div><div class="sh-r"><div class="sh-rd">${RD(R)}</div><div class="sh-rt">${GN}問・${p.min||10}分</div></div><div class="sh-qr">QR<br>この回を開く</div></div>
 <div class="sh-f"><span class="b" style="width:24mm">　月　　日</span><span class="b nm">名前</span><span class="b sc"><span>正解</span><span>／${GN}</span></span></div>
 <div class="sh-ins">計算の枠に式を書いて解き、答えをア〜カから選んで、右の枠に記号を書きなさい。（${p.min||10}分）</div>`;
 /* 2026-11-23 紙の直し係P（川上さん 02:03「Aア」）：回の行に2枚の印（gg.sh＝2 → gg_load.js の p.shR[回]）がある回だけ A4 両面2枚（4ページ）。
    1枚目 表（見出し）→ 1枚目 裏 → 2枚目 表 → 2枚目 裏。2枚目の表は裏と同じ続きの見出し。下の文字は「1枚目 表（裏に続く）」…「2枚目 裏」。印の無い回は今までと1字も同じ */
 const two=!!(p.shR&&p.shR[R]===2);
 if(two){const ct=t=>`<div class="sh-cont">${CALL(GG,p.id,R)}（${t}）<small>　${H.main}</small></div>`;
  return `<div class="sheet sf" data-r="${R}" data-sh="2">${hd}<div class="sbody">${units.join('')}</div><div class="sh-ft">${RD(R)}　1枚目 表　（裏に続く）</div></div>`
  +`<div class="sheet sb" data-r="${R}">${ct('1枚目 裏')}<div class="sbody"></div><div class="sh-ft">${RD(R)}　1枚目 裏　（2枚目に続く）</div></div>`
  +`<div class="sheet sf s2" data-r="${R}">${ct('2枚目 表')}<div class="sbody"></div><div class="sh-ft">${RD(R)}　2枚目 表　（裏に続く）</div></div>`
  +`<div class="sheet sb" data-r="${R}">${ct('2枚目 裏')}<div class="sbody"></div><div class="sh-ft">${RD(R)}　2枚目 裏</div></div>`;}
 return `<div class="sheet sf" data-r="${R}">${hd}<div class="sbody">${units.join('')}</div><div class="sh-ft">${RD(R)}　表　（裏に続く）</div></div>`
  +`<div class="sheet sb" data-r="${R}"><div class="sh-cont">${CALL(GG,p.id,R)}（裏）<small>　${H.main}</small></div><div class="sbody"></div><div class="sh-ft">${RD(R)}　裏</div></div>`;}

function gLay(sf){const sb=sf.nextElementSibling;const B1=sf.querySelector('.sbody'),B2=sb.querySelector('.sbody');
 /* 2026-11-01 作図の問題（.su.nocalc）は計算の枠が無い。枠の無い面は、入るかどうかだけを見る。
    19:25 川上さん「グラフも計算の枠に入る。ただ小さめでもいいかもね」→ 入らないときの順：
    ① グラフの図（.ch.g6.gr）を 40mm から 34mm まで小さくする（枠は全部 20mm 以上）
    ② グラフを選ぶ問題の枠だけ 20mm より小さくしてよい（下限 10mm）。グラフは 40〜34mm のうち、グラフの枠が 15mm 以上になる一番大きい図（無ければ 10mm 以上になる一番大きい図）。ほかの問題の枠は 20mm 以上のまま
    ③ グラフを 33〜24mm（3列2段のまま。m2u4p3 B-1・B-2 は裏の (4)(5) と (6)(7) の枠 20mm で 34mm が入らない）④ 最後の手：グラフの問題を後ろから1つずつ 1段6列（.r1）⑤ 作図の図を 28mm まで */
 const U=[...B1.children,...B2.children];U.forEach(u=>{const c=u.querySelector('.calc');if(c)c.style.height='0px';B1.appendChild(u);});
 const lim=(sh,b)=>{const ft=sh.querySelector('.sh-ft');return ft.offsetTop-16-b.offsetTop;};const H1=lim(sf,B1),H2=lim(sb,B2);
 const MIN=20*3.78,MING=10*3.78;let GMIN=MIN;/* GMIN＝グラフを選ぶ問題の枠の下限。はじめは 20mm、②から 10mm */
 const nc=U.map(u=>u.querySelector('.calc')?1:0),ng=U.map(u=>u.querySelector('.calc')&&u.querySelector('.ch.g6.gr')?1:0);const sum=(A,i,j)=>A.slice(i,j).reduce((x,y)=>x+y,0);
 const side=(H,used,i,j)=>{const n=sum(nc,i,j),g=sum(ng,i,j),o=n-g,free=H-used;if(!n)return free>=0?{ok:1,hn:0,hg:0,g:0,v:Infinity}:{ok:0,hn:0,hg:0,g:0,v:-1};
  const e=free/n;if(e>=MIN)return {ok:1,hn:e,hg:e,g,v:e};
  if(g&&GMIN<MIN){const hg=(free-o*MIN)/g;if(hg>=GMIN)return {ok:1,hn:MIN,hg,g,v:hg};}
  return {ok:0,hn:Math.max(e,0),hg:Math.max(e,0),g,v:e};};
 const at=k=>{const h=U.map(u=>u.offsetHeight);return [side(H1,sum(h,0,k),0,k),side(H2,sum(h,k),k,U.length)];};
 const find=()=>{let best=null;for(let k=1;k<U.length;k++){const [A,B]=at(k);if(!A.ok||!B.ok)continue;const v=[A.v,B.v].filter(x=>x!==Infinity);const sc=v.length?Math.min(...v)-(v.length>1?Math.abs(v[0]-v[1])*.3:0):0;if(!best||sc>best.sc)best={k,A,B,sc};}return best;};
 const G=[...B1.querySelectorAll('.ch.g6')];G.forEach(g=>{g.style.removeProperty('--gh');g.classList.remove('r1');});
 const setG=(sel,gh)=>G.filter(g=>g.matches(sel)&&!g.classList.contains('r1')).forEach(g=>gh>=40?g.style.removeProperty('--gh'):g.style.setProperty('--gh',gh+'mm'));
 const hasGr=G.some(g=>g.matches('.gr'));
 let best=find();
 if(hasGr)for(let gh=39;!best&&gh>=34;gh--){setG('.gr',gh);best=find();}
 if(!best&&hasGr){GMIN=MING;let c15=null,c10=null;
  for(let gh=40;gh>=34;gh--){setG('.gr',gh);const b=find();if(!b)continue;const mg=Math.min(Infinity,...[b.A,b.B].filter(x=>x.g).map(x=>x.hg));if(!c10)c10={gh,b};if(!c15&&mg>=15*3.78)c15={gh,b};}
  const c=c15||c10;if(c){setG('.gr',c.gh);best=c.b;}}
 if(hasGr)for(let gh=33;!best&&gh>=24;gh--){setG('.gr',gh);best=find();}
 if(!best&&hasGr){const gr=G.filter(g=>g.matches('.gr')).reverse();for(let i=0;!best&&i<gr.length;i++){gr[i].classList.add('r1');if(chOver(gr[i])){gr[i].classList.remove('r1');continue;}   /* 2026-11-21 横長の図（箱ひげ図）は1段6列にすると段からはみ出すので使わない */for(let gh=40;!best&&gh>=30;gh--){setG('.gr',gh);best=find();}}}
 for(let gh=39;!best&&gh>=28;gh--){setG('.zu',gh);if(!G.some(g=>g.matches('.zu')))break;best=find();}
 if(!best){let bk=null;for(let k=1;k<U.length;k++){const [A,B]=at(k);const m=Math.min(A.v,B.v);if(!bk||m>bk.m)bk={k,A,B,m};}best=bk;}
 /* 分け方が決まったあと、小さくした図（作図・グラフ）を、その面に入るかぎり 40mm まで戻す（同じ面の同じ種類は同じ大きさ） */
 {const base=at(best.k);const ok=()=>at(best.k).every((x,i)=>x.ok||(!base[i].ok&&x.v>=base[i].v-.5));/* 入らない回（前から枠が 20mm に少し足りない m1u6p1 C-2 など）でも、今より悪くしないかぎり戻す *//* 面ごと・種類ごと（作図／グラフ）に、同じ大きさのまま 40mm に近づける（例：m2u4p3 B-1 は表のグラフ (3) だけ大きく戻る） */
  const grow=Z=>{if(!Z.length)return;let gh=parseFloat(Z[0].style.getPropertyValue('--gh'));while(gh<40){Z.forEach(g=>g.style.setProperty('--gh',(gh+1)+'mm'));if(!ok()){Z.forEach(g=>g.style.setProperty('--gh',gh+'mm'));break;}gh++;}if(gh>=40)Z.forEach(g=>g.style.removeProperty('--gh'));};
  [[0,best.k],[best.k,U.length]].forEach(([i,j])=>{const S=U.slice(i,j);['.zu','.gr'].forEach(sel=>grow(G.filter(g=>g.matches(sel)&&!g.classList.contains('r1')&&g.style.getPropertyValue('--gh')&&S.some(u=>u.contains(g)))));});
  const [A,B]=at(best.k);best.A=A;best.B=B;}
 U.forEach((u,i)=>{const c=u.querySelector('.calc');if(i>=best.k)B2.appendChild(u);const S=i<best.k?best.A:best.B;if(c)c.style.height=Math.floor(ng[i]?S.hg:S.hn)+'px';});
 sf.dataset.k=best.k;}

/* 2026-11-03 21:25 2列の選択肢で、1つが列の幅に入らない（長い文の選択肢）ときは、その問題だけ1列にする。A4 の正しい幅で測ると 1次方程式の C-1・C-2 と入試パターンの B-1・B-2 が右へはみ出していた */
const chFit=root=>root.querySelectorAll('.sq .ch.l2').forEach(c=>{if([...c.children].some(x=>x.scrollWidth>x.clientWidth+1||x.getBoundingClientRect().right>c.getBoundingClientRect().right+1))c.classList.add('l1');});
/* 2026-11-20 23:20 問題文の図（右に浮かせた .grq）の横に選択肢が来るとき、選択肢の列が狭くなって文字が図に重なっていた（入試パターン 確率 A-1 の紙・川上さん「A4表裏1枚にはなんとか収めて」）。
   図の横で 3列→2列→1列 の順に、どの選択肢も列の幅に入る並べ方を探す。どれでも入らなければ、選択肢を図の下から始める（clear）。図の横に置ける問題は高さを使わない */
const chOver=c=>{const R=c.getBoundingClientRect().right;return [...c.children].some(x=>x.scrollWidth>x.clientWidth+1||x.getBoundingClientRect().right>R+1);};
/* 2026-11-20 23:50 表だけの図（.grq の中が table）：表を横に並べ、幅が段の 55% 以下なら右に浮かせる（問題文は「右の表は」）。m1n05 B-1・B-2 は表が縦に積まれて、計算の枠を 0 にしても表裏1枚に入っていなかった */
const tbFlt=root=>root.querySelectorAll('.sq .qq .grq').forEach(g=>{if(g.querySelector('svg')||!g.querySelector(':scope > table'))return;Object.assign(g.style,{display:'flex',flexWrap:'wrap',gap:'2mm 4mm',alignItems:'flex-start',width:'max-content',maxWidth:'100%'});
 if(g.offsetWidth<=g.parentElement.clientWidth*0.55)Object.assign(g.style,{float:'right',margin:'0 0 2px 8px'});else g.style.width='';});
const chFlt=root=>{tbFlt(root);root.querySelectorAll('.sq').forEach(sq=>{const F=[...sq.querySelectorAll('.qq .grq')].filter(g=>getComputedStyle(g).float!=='none');if(!F.length)return;
 sq.querySelectorAll('.ch').forEach(c=>{const side=()=>{const b=c.getBoundingClientRect();return F.some(g=>{const a=g.getBoundingClientRect();return b.top<a.bottom-1&&a.left<b.right+12;});};
  if(c.classList.contains('g6')){if(side())c.style.clear='both';return;}   /* グラフや図を選ぶ問題（.g6）は、あとで gLay が図の大きさを変えるので、図の横に来るなら必ず下から（m2n13 B-1 の箱ひげ図が問題文の図に重なっていた） */
  if(!side()||!chOver(c))return;const l2=c.classList.contains('l2'),l1=c.classList.contains('l1');
  if(!l2&&!l1){c.classList.add('l2');if(!chOver(c))return;}
  if(!l1){c.classList.add('l1');if(!chOver(c))return;}
  c.classList.remove('l2','l1');if(l2)c.classList.add('l2');if(l1)c.classList.add('l1');c.style.clear='both';});})};
/* 2026-11-21 00:56 川上さん「ア」：計算の枠を問題の右に縦長に置く（式を改行して縦につなげて書くため）。
   1問を左右に分け、左（約6割）に問題文・図・選択肢、右（38%）に計算の枠（.su.sd）。記号の枠は計算の枠の右下（.anw）。
   枠の大きさは解説の式の行数（data-l）で、その面の平均の 0.6〜1.8 倍（先生が解説を書きこむので、式の少ない問題も平均の6割は残す）。問題が枠より長ければ枠を問題の下まで伸ばす。
   左に入らない問題（グラフを選ぶ6択・3列→2列→1列でも入らない選択肢・はみ出す式）は今の形（枠は下に横長）。
   紙ごとに今の形（gLay）と組みくらべ、入らない・いちばん小さい枠が今より小さくなる（20mm 未満のとき）回は今の形にもどす（m2n10 B-1 など） */
const gLaySd=sf=>{const sb=sf.nextElementSibling;const B1=sf.querySelector('.sbody'),B2=sb.querySelector('.sbody');
 const U=[...B1.children,...B2.children];U.forEach(u=>{const c=u.querySelector(':scope>.calc');if(c)c.style.height='0px';B1.appendChild(u);});
 const toSd=u=>{const c=u.querySelector(':scope>.calc');u.classList.add('sd');const sec=!!u.querySelector(':scope>.sh-sec');c.style.gridRow=(sec?2:1)+' / span '+u.querySelectorAll(':scope>.sq').length;const w=document.createElement('div');w.className='anw';u.querySelectorAll(':scope>.sq>.an').forEach(a=>w.appendChild(a));c.appendChild(w);u._anw=w;};
 const toSt=u=>{const c=u.querySelector(':scope>.calc');u.classList.remove('sd');c.style.gridRow='';const Q=[...u.querySelectorAll(':scope>.sq')];[...u._anw.children].forEach((a,i)=>{if(Q[i])Q[i].appendChild(a);});u._anw.remove();u._anw=null;};
 U.forEach(u=>{if(u.querySelector(':scope>.calc')&&!u.querySelector('.ch.g6'))toSd(u);});
 chFlt(sf);
 U.forEach(u=>{if(!u.classList.contains('sd'))return;const keep=[...u.querySelectorAll('.sq .ch')].map(c=>[c,c.className,c.style.clear]);
  u.querySelectorAll('.sq .ch').forEach(c=>{if(!chOver(c))return;if(!c.classList.contains('l2')&&!c.classList.contains('l1')){c.classList.add('l2');if(!chOver(c))return;}c.classList.add('l1');});
  const bad=[...u.querySelectorAll('.sq *')].some(e=>e.clientWidth>0&&e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow==='visible'&&!e.closest('.katex'))||[...u.querySelectorAll('.sq .ch')].some(chOver);
  if(bad){keep.forEach(([c,k,cl])=>{c.className=k;c.style.clear=cl;});toSt(u);}});
 chFlt(sf);
 const lim=(sh,b)=>{const ft=sh.querySelector('.sh-ft');return ft.offsetTop-16-b.offsetTop;};const H1=lim(sf,B1),H2=lim(sb,B2);
 const Ls=U.map(u=>Number(u.dataset.l||0)),mL=(Ls.reduce((a,b)=>a+b,0)/Ls.length)||1;
 const X=U.map((u,i)=>{const c=u.querySelector(':scope>.calc'),sec=u.querySelector(':scope>.sh-sec');return {u,c,sd:u.classList.contains('sd'),q:u.offsetHeight,s:sec?sec.offsetHeight:0,wt:Math.min(1.8,Math.max(0.6,0.5+0.5*Ls[i]/mL)),aw:u._anw?u._anw.offsetHeight+30:0};});
 const h=(x,c)=>!x.c?x.q:x.sd?Math.max(x.q,x.s+Math.max(c*x.wt,x.aw)+12):x.q+c*x.wt;
 const cmax=(i,j,H)=>{const S=X.slice(i,j);if(!S.some(x=>x.c))return S.reduce((a,x)=>a+x.q,0)<=H?Infinity:-1;let lo=-1,hi=1500;for(let t=0;t<30;t++){const m=(lo+hi)/2;S.reduce((a,x)=>a+h(x,m),0)<=H?lo=m:hi=m;}return lo;};
 let best=null;for(let k=1;k<U.length;k++){const a=cmax(0,k,H1),b=cmax(k,U.length,H2);const v=[a,b].filter(x=>x!==Infinity);const sc=v.length?Math.min(...v)-(v.length>1?Math.abs(v[0]-v[1])*.3:0):0;if(!best||sc>best.sc)best={k,a,b,sc};}
 X.forEach((x,i)=>{if(i>=best.k)B2.appendChild(x.u);});
 const setH=(i,j,c)=>X.slice(i,j).forEach(x=>{if(!x.c)return;const v=x.sd?Math.max(c*x.wt,x.aw,x.q-x.s-12):c*x.wt;x.c.style.height=Math.floor(Math.max(0,v))+'px';});
 [[sf,B1,0,best.k,best.a],[sb,B2,best.k,U.length,best.b]].forEach(([sh,B,i,j,c])=>{c=Math.max(0,c===Infinity?0:c);setH(i,j,c);const ft=sh.querySelector('.sh-ft').getBoundingClientRect().top;const bot=()=>Math.max(0,...[...B.children].map(e=>e.getBoundingClientRect().bottom));for(let g=0;g<200&&c>0&&bot()>ft-16;g++){c-=2;setH(i,j,c);}});
 sf.dataset.k=best.k;};
const pairOk=sf=>{const S=[sf,sf.nextElementSibling];const over=S.some(sh=>{const B=sh.querySelector('.sbody');const ft=sh.querySelector('.sh-ft').getBoundingClientRect().top;return Math.max(0,...[...B.children].map(e=>e.getBoundingClientRect().bottom))>ft-4;});
 const cs=S.flatMap(sh=>[...sh.querySelectorAll('.calc')].map(c=>c.getBoundingClientRect().height));return {over,min:cs.length?Math.min(...cs):Infinity};};
/* 2026-11-21 図の6択（.g6）が段の幅に入らないとき（箱ひげ図のような横長の図・1段6列 .r1）は、その問題の図だけ 1mm ずつ小さくする。m2n13 B-1 の箱ひげ図が紙の右へ、m2n09 B-1 のグラフが記号の枠へはみ出していた */
const g6Fit=sh=>sh.querySelectorAll('.sq .ch.g6').forEach(c=>{if(!chOver(c))return;const n=c.classList.contains('r1')?6:3,gap=c.classList.contains('r1')?1.5:6;const W=c.getBoundingClientRect().width;c.querySelectorAll(':scope>span').forEach(sp=>{const sv=sp.querySelector('svg:not(.katex svg)'),k=sp.querySelector('.gk');if(!sv)return;const mw=(W-(n-1)*gap*3.78)/n-(k?k.getBoundingClientRect().width+4:0);if(sv.getBoundingClientRect().width>mw){sv.style.setProperty('width',Math.floor(mw)+'px','important');sv.style.setProperty('height','auto');}});});
const gLay2=sf=>{const sb=sf.nextElementSibling;const h0=[sf.innerHTML,sb.innerHTML];
 gLay(sf);const now=pairOk(sf);const h1=[sf.innerHTML,sb.innerHTML];
 sf.innerHTML=h0[0];sb.innerHTML=h0[1];
 try{gLaySd(sf);const sd=pairOk(sf);if(!sd.over&&sd.min>=Math.min(now.min,20*3.78)-1){g6Fit(sf);g6Fit(sb);return;}}catch(e){}
 sf.innerHTML=h1[0];sb.innerHTML=h1[1];g6Fit(sf);g6Fit(sb);};
/* 2026-11-23 2枚の回（data-sh="2"）：問題のかたまりを前から m 個を1枚目・残りを2枚目にし、それぞれの紙を1枚の回と同じ gLay2 で組む（表と裏の分け方・計算の枠の高さの決まりは同じ）。
   m は、はみ出しが無く、いちばん小さい計算の枠がいちばん大きくなるものを選ぶ（どの紙も問題のかたまりを2つ以上） */
const gLay4=sf=>{const sb=sf.nextElementSibling,s3=sb&&sb.nextElementSibling,s4=s3&&s3.nextElementSibling;if(!s4||!s3.classList.contains('s2')){gLay2(sf);return;}
 const S=[sf,sb,s3,s4],h0=S.map(x=>x.innerHTML),n=sf.querySelector('.sbody').children.length;let best=null;
 const tryM=m=>{S.forEach((x,i)=>{x.innerHTML=h0[i];});const B3=s3.querySelector('.sbody');[...sf.querySelector('.sbody').children].slice(m).forEach(u=>B3.appendChild(u));
  try{gLay2(sf);gLay2(s3);}catch(e){return;}const a=pairOk(sf),b=pairOk(s3),over=a.over||b.over,mn=Math.min(a.min,b.min);const sc=(over?-1e6:0)+mn;
  if(!best||sc>best.sc)best={sc,m,h:S.map(x=>x.innerHTML),k1:sf.dataset.k,k2:s3.dataset.k};};
 for(let m=2;m<=n-2;m++)tryM(m);if(!best)tryM(Math.ceil(n/2));
 S.forEach((x,i)=>{x.innerHTML=best.h[i];});sf.dataset.m=best.m;sf.dataset.k=best.k1;s3.dataset.k=best.k2;};
/* 2026-11-23 紙の直し係P：わくと図の重なり。右に浮かせた問題文の図（.qq .grq）が、図を中に持たないわく（線のある div。証明の点線のわく .prf・例のわく など）にかかったら、
   そのわくだけに .fbx（図の横によける）を付けて、その回を組み直す（m3n21 の証明のわくの右はしに図がかかり、わくの線が図の下を通っていた）。かからない回は1回組むだけで今までと同じ */
const bxOf=d=>{if(d.closest('.grq'))return false;const cs=getComputedStyle(d);return parseFloat(cs.borderTopWidth)>0&&cs.borderTopStyle!=='none'&&parseFloat(cs.borderRightWidth)>0;};
const fbxBad=S=>{const L=[];S.forEach(sh=>sh.querySelectorAll('.sq').forEach(sq=>{const F=[...sq.querySelectorAll('.qq .grq')].filter(g=>getComputedStyle(g).float!=='none'&&g.getBoundingClientRect().width>0);if(!F.length)return;
 sq.querySelectorAll('.qq div[data-bx]').forEach(d=>{if(d.classList.contains('fbx'))return;const c=d.getBoundingClientRect();if(F.some(g=>{if(d.contains(g))return false;const a=g.getBoundingClientRect();return Math.min(a.right,c.right)-Math.max(a.left,c.left)>1&&Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top)>1;}))L.push(d.dataset.bx);});}));return L;};
const layOne=sf=>{const two=sf.dataset.sh==='2';const S=[sf];let x=sf;for(let i=0;i<(two?3:1)&&x.nextElementSibling;i++){x=x.nextElementSibling;S.push(x);}
 const run=()=>two?gLay4(sf):gLay2(sf);let h0=S.map(y=>y.innerHTML);run();
 for(let t=0;t<3;t++){const bad=fbxBad(S);if(!bad.length)break;S.forEach((y,i)=>{y.innerHTML=h0[i];});bad.forEach(id=>S.forEach(y=>{const d=y.querySelector('[data-bx="'+id+'"]');if(d)d.classList.add('fbx');}));h0=S.map(y=>y.innerHTML);run();}};
const CSS='.ggp{color:#111}.ggp,.ggp *{box-sizing:border-box}\n'+   /* shell2.html の *{box-sizing:border-box} と同じ（無いと .sheet が 234×317mm になる。2026-11-03 21:20） */
'.ggp .pwrap{background:#e5e7eb;padding:16px 0;border-radius:8px}\n.ggp .sheet{width:210mm;height:297mm;overflow:hidden;margin:0 auto 16px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2);padding:11mm 10mm 9mm 14mm;position:relative;font-size:12.5px;line-height:1.45;color:#111}\n.ggp .sh-h{display:flex;align-items:flex-start;gap:12px;border-bottom:2.5px solid #111;padding-bottom:5px}\n.ggp .sh-l{flex:1;min-width:0}\n.ggp .sh-k{font-size:11.5px;color:#374151;line-height:1.3}.sh-k b{border:1.3px solid #111;border-radius:4px;padding:0 5px;margin-left:5px;color:#111;font-weight:700}\n.ggp .sh-tt{font-size:28px;font-weight:900;line-height:1.12;margin:1px 0 0;white-space:nowrap}.sh-tt .mr{font-size:30px}\n.ggp .sh-ps{font-size:13.5px;font-weight:700;line-height:1.3;margin-top:1px}.sh-ps small{font-weight:500;color:#4b5563;font-size:11.5px}\n.ggp .sh-dots{display:flex;gap:5px;margin-top:4px;align-items:center}.sh-dots span{width:19px;height:19px;border-radius:50%;border:1.4px solid #111;font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center;box-sizing:border-box}.sh-dots span.on{background:#111;color:#fff}\n/* 2026-11-02 00:50 川上さん「B」：丸は単元名の横（パート名の下に置かない）・直径8mm・1パートの単元は出さない */\n.ggp .sh-tt .sh-di{display:inline-flex;vertical-align:middle;margin:0 0 5px 4mm;gap:1.6mm}.sh-tt .sh-di span{width:8mm;height:8mm;font-size:15px;border-width:1.8px}.sh-dots i{font-style:normal;font-size:10px;color:#4b5563;margin-left:3px}\n.ggp .sh-r{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:none}\n.ggp .sh-rd{border:2.5px solid #111;border-radius:7px;padding:0 12px;font-size:25px;font-weight:900;line-height:1.3}\n.ggp .sh-rt{font-size:11.5px;font-weight:700}\n.ggp .sh-qr{width:17mm;height:17mm;border:1px dashed #64748b;font-size:9px;color:#64748b;display:flex;align-items:center;justify-content:center;text-align:center;flex:none}\n.ggp .sh-f{display:flex;gap:8px;margin:6px 0 2px;font-size:12px}\n.ggp .sh-f .b{border:1px solid #111;border-radius:4px;padding:2px 8px;height:9mm;display:flex;align-items:center}\n.ggp .sh-f .nm{flex:1}.sh-f .sc{width:32mm;justify-content:space-between}\n.ggp .sh-ins{font-size:11.5px;margin:4px 0 2px}\n.ggp .sh-sec{font-weight:800;font-size:12.5px;margin:7px 0 2px;border-left:4px solid #111;padding-left:6px}\n.ggp .sq{display:flex;gap:8px;border-bottom:1px solid #cbd5e1;padding:2px 0 3px;break-inside:avoid}\n.ggp .sq .no{flex:none;width:7mm;height:7mm;border:1.5px solid #111;border-radius:3px;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:13px}\n.ggp .sq .bd{flex:1;min-width:0}.sq .bd:after{content:\'\';display:block;clear:both}\n.ggp .sq .qq .grq:has(svg){float:right;margin:0 0 2px 8px}\n.ggp .su.sd{display:grid;grid-template-columns:minmax(0,1fr) 38%;column-gap:3mm;align-items:stretch}.ggp .su.sd>.sh-sec{grid-column:1/-1}.ggp .su.sd>.sq{grid-column:1}.ggp .su.sd>.calc{grid-column:2;margin:3px 0 6px 0;align-self:start}\n.ggp .calc .anw{position:absolute;right:4px;bottom:4px;display:flex;gap:4px;align-items:flex-end}.ggp .calc .anw .an{flex:0 0 auto;width:17mm;height:12mm;border:1.5px solid #111;border-radius:4px;position:relative;background:#fff}.ggp .calc .anw .an::before{content:"記号";position:absolute;top:-1px;left:3px;font-size:8.5px;color:#475569}.ggp .calc .anw .an .ank{position:absolute;left:auto;top:auto;right:2px;bottom:0;font-size:9px;color:#475569;line-height:1.2}\n.ggp .sq .tb,.ggp .sq .tb.inc{font-size:11.5px;margin:2px 0}.ggp .sq .tb th,.ggp .sq .tb td,.ggp .sq .tb.inc th,.ggp .sq .tb.inc td{padding:0 5px;min-width:26px;line-height:1.3}\n.ggp .sq .qq svg:not(.katex svg){width:auto!important;height:25mm}\n/* 2026-11-23 資料のわく付きの表（m2n13 の SIRYO・data-k=t）は入試（令和5 問3(イ)）と同じくらいの大きさにする（もとの大きさの 0.75 倍）。25mm の高さにそろえると資料が大きすぎた */.ggp .sq .qq svg[data-k=\"t\"]:not(.katex svg){height:auto!important;width:auto!important;zoom:.75}.ggp .gzi{display:inline-block;margin:0 0 0 6px;padding:0 5px;border:1.2px solid #111;border-radius:4px;color:#111;font-size:11px;font-weight:700;line-height:1.45;vertical-align:baseline}.ggp .gzi>span>span{display:inline-block}.ggp .gzil{margin:0 0 1mm}.ggp .gzil .gzi{margin-left:0}.ggp .gzi .za{display:none}.ggp .gzi .zp{display:inline}\n.ggp .sq .qq table{border-collapse:collapse;font-size:12px}.sq .qq td,.sq .qq th{border:1px solid #111;padding:1px 8px;text-align:center}\n.ggp .sq .ch{display:grid;grid-template-columns:repeat(3,1fr);gap:5px 10px;margin-top:5px;align-items:center}\n.ggp .sq .ch.l2{grid-template-columns:repeat(2,1fr)}\n.ggp .sq .ch.l1{grid-template-columns:1fr;gap:3px}\n.ggp .sq .ch span{white-space:nowrap;line-height:1.2}\n.ggp .sq .ch svg:not(.katex svg){height:22mm;width:auto!important;vertical-align:top}\n/* 2026-11-01 図の6択（作図・グラフ）：3列2段・1つ約 40mm。ア〜カは図のすぐ左上（文字と図を1つの組にする）。前は6列で、文字が左どなりの図の右はしに寄って見えた。\n   --gh＝図の高さ。紙に入らないときだけ gLay がグラフ（.gr）から 1mm ずつ小さくする（まず 34mm まで）。\n   それでも入らない回（グラフの問題が3つある m2u4p3 B-1・B-2）は、グラフを選ぶ問題の計算の枠だけを小さくする（下限 10mm。19:25 川上さん）。1段6列（.r1・図 21mm）はそれでも入らないときの最後の手。作図（.zu）は計算の枠を出さない */\n.ggp .sq .ch.g6{grid-template-columns:repeat(3,minmax(0,max-content));column-gap:6mm;row-gap:2mm;justify-content:start;align-items:start;margin-top:4px}\n.ggp .sq .ch.g6 span{display:flex;gap:1mm;align-items:flex-start;white-space:nowrap;min-width:0}\n.ggp .sq .ch.g6 .gk{flex:none;font-weight:800;font-size:13px;line-height:1;padding-top:1px}\n.ggp .sq .ch.g6 svg:not(.katex svg){height:var(--gh,40mm);width:auto!important;max-width:none}\n/* 2026-11-21 横長の図（箱ひげ図など）は高さで決めると段の幅からはみ出す（m2n13 B-1）。図の幅が段の 1/3（1段6列は 1/6）を超えるときだけ、幅に合わせて縮める（gW） */\n.ggp .sq .ch.g6.r1{grid-template-columns:repeat(6,minmax(0,max-content));column-gap:1.5mm}.sq .ch.g6.r1 .gk{font-size:12px}.sq .ch.g6.r1 svg:not(.katex svg){height:var(--gr1,21mm)}\n/* 2026-11-23 箱ひげ図を選ぶ6択（m2n13 の BOX・BOXF・data-k=b）は高さでなく幅で決める（3列2段・1つ 44mm）。高さ（--gh・1段6列の 21mm）で決めると横長の図が小さくなり、目もりの数が読めなかった（m2n13 A-1 の裏） */.ggp .sq .ch.g6 svg[data-k=\"b\"]:not(.katex svg),.ggp .sq .ch.g6.r1 svg[data-k=\"b\"]:not(.katex svg){height:auto!important;width:44mm!important;max-width:none;flex:none}\n/* 2026-11-23 図をよけるわく（.fbx。layout の fbxFix が付ける）：右に浮かせた問題文の図がかかったわくだけ、図の横によける（overflow:hidden） */.ggp .sq .qq .fbx{overflow:hidden}\n.ggp .sq .an{flex:none;width:17mm;height:12mm;border:1.5px solid #111;border-radius:4px;align-self:center;position:relative}\n.ggp .sq .an:before{content:"記号";position:absolute;top:-1px;left:3px;font-size:8.5px;color:#475569}\n.ggp .sq .no.sub{border-color:transparent}.sq .an .ank{position:absolute;right:2px;bottom:0;font-size:9px;color:#475569;line-height:1.2}\n.ggp .sh-ft{position:absolute;bottom:9mm;left:0;right:0;text-align:center;font-size:10px;color:#475569}\n.ggp .su{break-inside:avoid}.calc{position:relative;border:1.2px dashed #94a3b8;border-radius:4px;margin:3px 0 6px 9mm;box-sizing:border-box}.calc span{position:absolute;top:2px;left:5px;font-size:9px;color:#64748b}\n.ggp .sheet.sb .sh-cont,.ggp .sheet.s2 .sh-cont{border-bottom:2px solid #111;padding-bottom:4px;margin-bottom:6px;font-size:12.5px;font-weight:700;color:#111}.sheet.sb .sh-cont small,.sheet.s2 .sh-cont small{font-weight:500;color:#4b5563;font-size:11px}\n.ggp .sh-cont{font-size:11px;color:#475569;margin:0 0 4px}\n.ggp .sheet .katex{font-size:1.02em}\n'
 +'\n@media print{@page{size:A4;margin:0}.ggp .sheet{margin:0!important;box-shadow:none!important;break-after:page}}';
G.ggPaper={css:CSS,round:(GG,id,R)=>{const p=(GG.parts||[]).find(x=>x.id===id);if(!p||!p.rounds[R])return '';return sheetHtml(GG,p,R);},
 layout:root=>{chFit(root);chFlt(root);let n=0;root.querySelectorAll('.sq .qq div').forEach(d=>{if(bxOf(d))d.dataset.bx=String(++n);});root.querySelectorAll('.sheet.sf:not(.s2)').forEach(layOne);},KX,HD,CALL,RD};
})(typeof window!=='undefined'?window:globalThis);
