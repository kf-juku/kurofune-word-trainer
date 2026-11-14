/* ekmt_paper.js：英検・架け橋のまとめテストの紙（英検の正本・2026-11-15 にぐるぐるから分けた）。
   元＝11-15 の guru\gg_paper.js（095b20fc）＋gg_paper_en.js（fa231cd4）をつないだもの。名前だけ変えた：.ggp→.ekp・ggPaper→ekMtPaper。
   先生画面の ekMtPrint_ が使う。これからはこのファイルを直接直す。ぐるぐるの紙（guru\gg_paper*.js）とは別物 */
/* gg_paper.js：ぐるぐるの紙（2026-11-03 川上さん 20:41「紙を先に作って PDF で見る」）。先生画面の［ぐるぐる印刷］と確かめの道具が使う。
   元＝モック ジョブス用\道具\20261021_ぐるぐる中2数学\shell2.html の sheetHtml・gLay・紙の CSS（川上さんが確かめた形）を、そのまま移した。決まり＝仕様書\ぐるぐる_作り方の決まり.md §5 紙・§0c「名前と見出し」
   使い方：
     ggPaper.css            ＝紙の CSS（.ekp の中だけに効く）。ページに <style> で入れる
     ggPaper.round(GG, パートid, 回)  ＝通常回の紙（表と裏の2枚）の HTML。<div class="ekp">…</div> の中に入れる
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
  return `<div class="su${noCalc?' nocalc':''}">${sec?`<div class="sh-sec">${sec}</div>`:''}${body}${noCalc?'':'<div class="calc"><span>計算</span></div>'}</div>`;};
 const units=rd.map((it,i)=>unit(it,H.ny?(i===0?'基礎':i===5?`入試の形　${H.main}`:''):(i===0?(H.unit==='小学校の総復習'?'基礎計算':'復習'):i===3?`${H.unit}${H.maru}　${H.main}`:''),i));
 const dots=Array.from({length:H.n},(_,i)=>`<span class="${i+1===H.k?'on':''}">${i+1}</span>`).join('');
 const hd=`<div class="sh-h"><div class="sh-l"><div class="sh-k">${H.grade}${SJN[H.subj]||'数学'}<b>ぐるぐる</b></div><div class="sh-tt">${H.ny?`${H.unit} <span class="mr">${H.maru}</span>`:`${H.unit}${H.n>1?`<span class="sh-dots sh-di">${dots}</span>`:''}`}</div><div class="sh-ps">${H.main}${H.sub?` <small>（${H.sub}）</small>`:''}</div>${H.ny?`<div class="sh-dots"><i>${H.aft} が終わったら挑戦</i></div>`:''}</div><div class="sh-r"><div class="sh-rd">${RD(R)}</div><div class="sh-rt">${GN}問・${p.min||10}分</div></div><div class="sh-qr">QR<br>この回を開く</div></div>
 <div class="sh-f"><span class="b" style="width:24mm">　月　　日</span><span class="b nm">名前</span><span class="b sc"><span>正解</span><span>／${GN}</span></span></div>
 <div class="sh-ins">計算の枠に式を書いて解き、答えをア〜カから選んで、右の枠に記号を書きなさい。（${p.min||10}分）</div>`;
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
 if(!best&&hasGr){const gr=G.filter(g=>g.matches('.gr')).reverse();for(let i=0;!best&&i<gr.length;i++){gr[i].classList.add('r1');for(let gh=40;!best&&gh>=30;gh--){setG('.gr',gh);best=find();}}}
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
const CSS='.ekp{color:#111}.ekp,.ekp *{box-sizing:border-box}\n'+   /* shell2.html の *{box-sizing:border-box} と同じ（無いと .sheet が 234×317mm になる。2026-11-03 21:20） */
'.ekp .pwrap{background:#e5e7eb;padding:16px 0;border-radius:8px}\n.ekp .sheet{width:210mm;height:297mm;overflow:hidden;margin:0 auto 16px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2);padding:11mm 10mm 9mm 14mm;position:relative;font-size:12.5px;line-height:1.45;color:#111}\n.ekp .sh-h{display:flex;align-items:flex-start;gap:12px;border-bottom:2.5px solid #111;padding-bottom:5px}\n.ekp .sh-l{flex:1;min-width:0}\n.ekp .sh-k{font-size:11.5px;color:#374151;line-height:1.3}.sh-k b{border:1.3px solid #111;border-radius:4px;padding:0 5px;margin-left:5px;color:#111;font-weight:700}\n.ekp .sh-tt{font-size:28px;font-weight:900;line-height:1.12;margin:1px 0 0;white-space:nowrap}.sh-tt .mr{font-size:30px}\n.ekp .sh-ps{font-size:13.5px;font-weight:700;line-height:1.3;margin-top:1px}.sh-ps small{font-weight:500;color:#4b5563;font-size:11.5px}\n.ekp .sh-dots{display:flex;gap:5px;margin-top:4px;align-items:center}.sh-dots span{width:19px;height:19px;border-radius:50%;border:1.4px solid #111;font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center;box-sizing:border-box}.sh-dots span.on{background:#111;color:#fff}\n/* 2026-11-02 00:50 川上さん「B」：丸は単元名の横（パート名の下に置かない）・直径8mm・1パートの単元は出さない */\n.ekp .sh-tt .sh-di{display:inline-flex;vertical-align:middle;margin:0 0 5px 4mm;gap:1.6mm}.sh-tt .sh-di span{width:8mm;height:8mm;font-size:15px;border-width:1.8px}.sh-dots i{font-style:normal;font-size:10px;color:#4b5563;margin-left:3px}\n.ekp .sh-r{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:none}\n.ekp .sh-rd{border:2.5px solid #111;border-radius:7px;padding:0 12px;font-size:25px;font-weight:900;line-height:1.3}\n.ekp .sh-rt{font-size:11.5px;font-weight:700}\n.ekp .sh-qr{width:17mm;height:17mm;border:1px dashed #64748b;font-size:9px;color:#64748b;display:flex;align-items:center;justify-content:center;text-align:center;flex:none}\n.ekp .sh-f{display:flex;gap:8px;margin:6px 0 2px;font-size:12px}\n.ekp .sh-f .b{border:1px solid #111;border-radius:4px;padding:2px 8px;height:9mm;display:flex;align-items:center}\n.ekp .sh-f .nm{flex:1}.sh-f .sc{width:32mm;justify-content:space-between}\n.ekp .sh-ins{font-size:11.5px;margin:4px 0 2px}\n.ekp .sh-sec{font-weight:800;font-size:12.5px;margin:7px 0 2px;border-left:4px solid #111;padding-left:6px}\n.ekp .sq{display:flex;gap:8px;border-bottom:1px solid #cbd5e1;padding:2px 0 3px;break-inside:avoid}\n.ekp .sq .no{flex:none;width:7mm;height:7mm;border:1.5px solid #111;border-radius:3px;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:13px}\n.ekp .sq .bd{flex:1;min-width:0}.sq .bd:after{content:\'\';display:block;clear:both}\n.ekp .sq .qq .grq:has(svg){float:right;margin:0 0 2px 8px}\n.ekp .sq .qq svg{width:auto!important;height:25mm}.ekp .gzi{display:inline-block;margin:0 0 0 6px;padding:0 5px;border:1.2px solid #111;border-radius:4px;color:#111;font-size:11px;font-weight:700;line-height:1.45;vertical-align:baseline}.ekp .gzi>span>span{display:inline-block}.ekp .gzil{margin:0 0 1mm}.ekp .gzil .gzi{margin-left:0}.ekp .gzi .za{display:none}.ekp .gzi .zp{display:inline}\n.ekp .sq .qq table{border-collapse:collapse;font-size:12px}.sq .qq td,.sq .qq th{border:1px solid #111;padding:1px 8px;text-align:center}\n.ekp .sq .ch{display:grid;grid-template-columns:repeat(3,1fr);gap:5px 10px;margin-top:5px;align-items:center}\n.ekp .sq .ch.l2{grid-template-columns:repeat(2,1fr)}\n.ekp .sq .ch.l1{grid-template-columns:1fr;gap:3px}\n.ekp .sq .ch span{white-space:nowrap;line-height:1.2}\n.ekp .sq .ch svg{height:22mm;width:auto!important;vertical-align:top}\n/* 2026-11-01 図の6択（作図・グラフ）：3列2段・1つ約 40mm。ア〜カは図のすぐ左上（文字と図を1つの組にする）。前は6列で、文字が左どなりの図の右はしに寄って見えた。\n   --gh＝図の高さ。紙に入らないときだけ gLay がグラフ（.gr）から 1mm ずつ小さくする（まず 34mm まで）。\n   それでも入らない回（グラフの問題が3つある m2u4p3 B-1・B-2）は、グラフを選ぶ問題の計算の枠だけを小さくする（下限 10mm。19:25 川上さん）。1段6列（.r1・図 21mm）はそれでも入らないときの最後の手。作図（.zu）は計算の枠を出さない */\n.ekp .sq .ch.g6{grid-template-columns:repeat(3,max-content);column-gap:6mm;row-gap:2mm;justify-content:start;align-items:start;margin-top:4px}\n.ekp .sq .ch.g6 span{display:flex;gap:1mm;align-items:flex-start;white-space:nowrap}\n.ekp .sq .ch.g6 .gk{flex:none;font-weight:800;font-size:13px;line-height:1;padding-top:1px}\n.ekp .sq .ch.g6 svg{height:var(--gh,40mm);width:auto!important;max-width:none}\n.ekp .sq .ch.g6.r1{grid-template-columns:repeat(6,max-content);column-gap:1.5mm}.sq .ch.g6.r1 .gk{font-size:12px}.sq .ch.g6.r1 svg{height:21mm}\n.ekp .sq .an{flex:none;width:17mm;height:12mm;border:1.5px solid #111;border-radius:4px;align-self:center;position:relative}\n.ekp .sq .an:before{content:"記号";position:absolute;top:-1px;left:3px;font-size:8.5px;color:#475569}\n.ekp .sq .no.sub{border-color:transparent}.sq .an .ank{position:absolute;right:2px;bottom:0;font-size:9px;color:#475569;line-height:1.2}\n.ekp .sh-ft{position:absolute;bottom:6mm;left:0;right:0;text-align:center;font-size:10px;color:#475569}\n.ekp .su{break-inside:avoid}.calc{position:relative;border:1.2px dashed #94a3b8;border-radius:4px;margin:3px 0 6px 9mm;box-sizing:border-box}.calc span{position:absolute;top:2px;left:5px;font-size:9px;color:#64748b}\n.ekp .sheet.sb .sh-cont{border-bottom:2px solid #111;padding-bottom:4px;margin-bottom:6px;font-size:12.5px;font-weight:700;color:#111}.sheet.sb .sh-cont small{font-weight:500;color:#4b5563;font-size:11px}\n.ekp .sh-cont{font-size:11px;color:#475569;margin:0 0 4px}\n.ekp .sheet .katex{font-size:1.02em}\n'
 +'\n@media print{@page{size:A4;margin:0}.ekp .sheet{margin:0!important;box-shadow:none!important;break-after:page}}';
G.ekMtPaper={css:CSS,round:(GG,id,R)=>{const p=(GG.parts||[]).find(x=>x.id===id);if(!p||!p.rounds[R])return '';return sheetHtml(GG,p,R);},
 layout:root=>{chFit(root);root.querySelectorAll('.sheet.sf').forEach(gLay);},KX,HD,CALL,RD};
})(typeof window!=='undefined'?window:globalThis);

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
const PP=G.ekMtPaper;const RD=PP.RD,HD=PP.HD;
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
.ekp .pp-l4{position:relative;display:inline-block;height:7mm;vertical-align:-2.1mm;border-top:0.25mm solid #444;border-bottom:0.25mm solid #444;margin:0.5mm 0}
.ekp .pp-l4:before{content:"";position:absolute;left:0;right:0;top:33%;border-top:0.3mm dotted #444}
.ekp .pp-l4:after{content:"";position:absolute;left:0;right:0;top:66%;border-top:0.6mm solid #000}
.ekp .pp-l4.blk{display:block;width:100%;vertical-align:baseline}
.ekp .sheet.en{font-size:12.5px}
.ekp .sheet.en .sq{padding:4px 0 5px}
.ekp .sheet.en .egh2{font-size:12px;margin:0 0 3px}
.ekp .sheet.en .qq{line-height:1.5}
.ekp .qx{display:flex;gap:5px;align-items:flex-start}.ekp .qsub{flex:none;line-height:1.6;min-width:7mm}.ekp .qc{flex:1;min-width:0}
.ekp .ejp{font-size:12.5px}
.ekp .een,.ekp .eut,.ekp .eqq{font-size:14px}
.ekp .een{margin-top:1px;line-height:2.1}
.ekp .eword{font-size:18px;font-weight:800;letter-spacing:.2px;display:inline-block;margin-left:2px}
.ekp .edlg{margin:2px 0}
.ekp .edl{display:flex;gap:6px;line-height:2.1}
.ekp .esp{flex:none;min-width:9mm;font-weight:700}
.ekp .eut{flex:1}
.ekp .ebl{white-space:nowrap}
.ekp .eqq{font-weight:600;margin:1px 0}
.ekp .ememo,.ekp .edtb{border-collapse:collapse;margin:3px 0 4px;font-size:13px}
.ekp .ememo th,.ekp .ememo td,.ekp .edtb td,.ekp .edtb th{border:1px solid #111;padding:2px 10px;text-align:left}
.ekp .ememo th{background:#f1f5f9;font-weight:700}
.ekp .edoc{border:1.5px solid #111;border-radius:4px;padding:4px 8px 6px;margin:3px 0 5px;display:inline-block;min-width:90mm}
.ekp .edoct{font-weight:800;font-size:14px;text-align:center;margin-bottom:2px}
.ekp .edoc .edtb{width:100%;margin:0}
.ekp .erd{margin:2px 0 4px}
.ekp .ech{display:grid;gap:3px 10px;margin:4px 0 1px;font-size:13.5px}
.ekp .ech.c4{grid-template-columns:repeat(4,1fr)}.ekp .ech.c2{grid-template-columns:repeat(2,1fr)}.ekp .ech.c1{grid-template-columns:1fr}
.ekp .ech span{line-height:1.35}.ekp .ech b{font-weight:800;margin-right:6px}
.ekp .etk{margin:4px 0 2px}
.ekp .etk span{border:1px solid #555;border-radius:1.5mm;padding:0 2.2mm;margin:0 1.6mm 0.8mm 0;display:inline-block;line-height:1.45;font-size:14px}
.ekp .eol{display:flex;align-items:flex-start;gap:2mm;margin:3px 0 1px}
.ekp .eol .pp-l4.blk{flex:1;width:auto}
.ekp .eoln{flex:none;font-size:12px;line-height:7mm;margin-top:0.5mm}
.ekp .epost{flex:none;font-size:15px;line-height:1;padding-top:2.1mm;margin-top:0.5mm;min-width:4mm}
.ekp .sq .an.wd{width:48mm}
.ekp .sh-ca{font-size:12px;margin-top:3px;line-height:1.35;display:flex;flex-wrap:wrap;gap:2px 10px;align-items:baseline}.ekp .sh-ca b{font-weight:700}.ekp .sh-ex .eex{font-family:inherit;font-weight:700}.ekp .sh-ex .eexj{font-size:11px;color:#4b5563;margin-left:3px}\n.ekp .sq .an.wd:before{content:"意味"}
.ekp .sheet.en .sq .an{height:11mm}
/* 章まとめテスト */
.ekp .sh-pt{font-size:11.5px;font-weight:700;margin:5px 0 0;white-space:nowrap}
.ekp .sh-qr.big{width:27mm;height:27mm;font-size:10px}
.ekp .eag{display:grid;grid-template-columns:repeat(6,1fr);gap:2.2mm 3mm;margin:3px 0 2px 2mm}
.ekp .eac{border:1.5px solid #111;border-radius:4px;height:12mm;position:relative}
.ekp .eac span{position:absolute;top:0;left:3px;font-size:10px;color:#334155}
.ekp .cta .eol{margin:4.2mm 0 0 2mm}.ekp .cta .su.ekmany .eol{margin-top:2.4mm}   /* 2026-11-14 英検のまとめテスト40問：並べかえが6問以上なら行の間を詰めて解答用紙を1枚に */.ekp .cta .eoln{min-width:11mm;font-size:12px}
.ekp .egr{display:flex;align-items:center;gap:3mm}.ekp .egr .eword{flex:none;width:34mm;font-size:16px}.ekp .egr .ech{flex:1;margin:0}
.ekp .sh-sec .ls-n{font-size:11px;font-weight:700;margin-left:8px;border:1.3px solid #111;border-radius:4px;padding:0 5px;color:#111}.ekp .sh-sec small{font-weight:600;font-size:11px;margin-left:4px;color:#334155}
.ekp .sheet.blank{display:flex}
`;
PP.cssEn=CSS_EN;PP.roundEn=roundEn;PP.ctEn=ctEn;PP.layoutEn=layoutEn;
})(typeof window!=='undefined'?window:globalThis);
