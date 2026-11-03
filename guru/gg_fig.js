/* gg_fig.js：ぐるぐる（数学）の図を描く関数。tools\gg_export.js が問題データ（helpers.js・{パート}_meta.js）から作る。手で直さない（直すときは問題データを直して gg_export.js を回し直す）
   本番の ws\math_fig.js のあとに読む。MathFig.ns に名前空間を足すだけ（math_fig.js は変えない）。
   gg＝helpers.js の図の道具（GS・G6・TB・TBA）／gg_<パートid>＝そのパートの meta.js の図の道具
   シートの問題（words の qdata）には図の印 ⟦F:名前空間.関数:[引数]⟧ だけが入っている。MathFig.data(qdata) で SVG にもどる */
(function(){
var NS=window.MathFig&&window.MathFig.ns;if(!NS){if(window.console)console.log('gg_fig.js：math_fig.js を先に読んでください');return;}
NS["gg"]=(function(){
const TB=(xs,ys)=>`<table class="tb"><tr><th>\\(x\\)</th>${xs.map(v=>`<td>${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map(v=>`<td>${v}</td>`).join('')}</tr></table>`;
const mi=v=>String(v).replace(/^-/,'−');
function GS(o){const R=o.R||5,U=20,L=R+.5,W=(2*R+1)*U,c=W/2,X=x=>c+x*U,Y=y=>c-y*U,sm=!!o.sm,K=sm?1.35:1;
 const H=`stroke="#fff" stroke-width="${4*K}" paint-order="stroke"`;
 let s=`<svg class="${sm?'gch':'gr'}" viewBox="0 0 ${W} ${W}" width="${o.w||200}" height="${o.w||200}">`;
 if(o.grid!==false)for(let i=-R;i<=R;i++){s+=`<line x1="${X(i)}" y1="${Y(-L)}" x2="${X(i)}" y2="${Y(L)}" stroke="#d1d5db" stroke-width="1"/><line x1="${X(-L)}" y1="${Y(i)}" x2="${X(L)}" y2="${Y(i)}" stroke="#d1d5db" stroke-width="1"/>`;}
 (o.yhl?[o.yhl]:[]).forEach(q=>{s+=`<line x1="${c}" y1="${Y(q[0])}" x2="${c}" y2="${Y(q[1])}" stroke="#c2410c" stroke-width="6" stroke-opacity=".55"/>`;});
 s+=`<line x1="${X(-L)}" y1="${c}" x2="${X(L)}" y2="${c}" stroke="#111" stroke-width="1.4"/><line x1="${c}" y1="${Y(-L)}" x2="${c}" y2="${Y(L)}" stroke="#111" stroke-width="1.4"/>`;
 s+=`<text x="${X(L)-9*K}" y="${c-6}" font-size="${13*K}" font-style="italic">x</text><text x="${c+6}" y="${Y(L)+13*K}" font-size="${13*K}" font-style="italic">y</text><text x="${c-4}" y="${c+14*K}" font-size="${12*K}" text-anchor="end">O</text>`;
 if(o.nums!==false)[-4,-2,2,4].forEach(v=>{s+=`<text x="${X(v)}" y="${c+14*K}" font-size="${11*K}" text-anchor="middle" fill="#555" ${H}>${mi(v)}</text><text x="${c-5}" y="${Y(v)+4*K}" font-size="${11*K}" text-anchor="end" fill="#555" ${H}>${mi(v)}</text>`;});
 const CL=(a,b)=>{let p=[];[-L,L].forEach(x=>{const y=a*x+b;if(y>=-L-1e-9&&y<=L+1e-9)p.push([x,y]);});if(a!==0)[-L,L].forEach(y=>{const x=(y-b)/a;if(x>-L&&x<L)p.push([x,y]);});p.sort((u,v)=>u[0]-v[0]);return [p[0],p[p.length-1]];};
 (o.lines||[]).forEach(l=>{const [p,q]=CL(l[0],l[1]);s+=`<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" stroke="#111" stroke-width="${sm?3:2.4}"/>`;});
 (o.dsh||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#c2410c" stroke-width="1.4" stroke-dasharray="4 3"/>`;});
 (o.segs||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#111" stroke-width="2.6"/>`;});
 if(o.st){const [x0,y0,dx,dy]=o.st;s+=`<line x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x0+dx)}" y2="${Y(y0)}" stroke="#c2410c" stroke-width="2.6"/><line x1="${X(x0+dx)}" y1="${Y(y0)}" x2="${X(x0+dx)}" y2="${Y(y0+dy)}" stroke="#c2410c" stroke-width="2.6"/><text x="${(X(x0)+X(x0+dx))/2}" y="${Y(y0)+(dy>0?17:-8)}" font-size="13" font-weight="700" fill="#c2410c" text-anchor="middle" ${H}>右へ${dx}</text><text x="${X(x0+dx)+6}" y="${(Y(y0)+Y(y0+dy))/2+5}" font-size="13" font-weight="700" fill="#c2410c" ${H}>${dy>0?'上へ'+dy:'下へ'+(-dy)}</text>`;}
 const OF={r:[8,4,'start'],l:[-8,4,'end'],t:[0,-9,'middle'],b:[0,18,'middle'],tr:[6,-7,'start'],tl:[-6,-7,'end'],br:[6,16,'start'],bl:[-6,16,'end']};
 (o.pts||[]).forEach(q=>{const f=OF[q[3]||'tr'];s+=q[4]?`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4.5" fill="#fff" stroke="#111" stroke-width="2"/>`:`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4.5" fill="#111"/>`;if(q[2])s+=`<text x="${X(q[0])+f[0]}" y="${Y(q[1])+f[1]}" text-anchor="${f[2]}" font-size="13" font-weight="700" ${H}>${q[2]}</text>`;});
 return s+'</svg>';}
const G6=(a,b)=>GS({sm:true,w:140,lines:[[a,b]]});
const TBA=(xs,ys,yn,xn)=>{const n=xs.length;const gap=(arr,cls)=>arr?`<tr class="${cls}"><th></th><td class="g"></td>${arr.map(t=>`<td colspan="2" class="g">${t?`<span>${t}</span>`:''}</td>`).join('')}<td class="g"></td></tr>`:'';
 return `<table class="tb tba">${gap(xn,'xn')}<tr><th>\\(x\\)</th>${xs.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr>${gap(yn,'yn')}</table>`;};
return {"GS":GS,"G6":G6,"TB":TB,"TBA":TBA};
})();
NS["gg_m1u1p1"]=(function(){
const M1U1P1_ZU=(()=>{
const C='style="min-width:22px;padding:1px 5px"',HB='style="min-width:22px;padding:1px 5px;font-weight:700"',HI='style="min-width:22px;padding:1px 5px;font-weight:700;background:#ffd9c7"';
const nr=v=>Math.round(v*100)/100,FS='font-size="13"',RD='#FF4B00';
const divs=n=>{const r=[];for(let k=1;k<=n;k++)if(n%k===0)r.push(k);return r;};
const T=rows=>`<table class="tb inc">${rows.join('')}</table>`;
/* 約数の表：小さいほうの数の約数を並べ、大きいほうの数もわり切るかを ○・× で。いちばん大きい ○ に色 */
function YAKU(a,b){const s=Math.min(a,b),l=Math.max(a,b),d=divs(s),g=d.filter(k=>l%k===0).pop();const st=k=>k===g?HI:(l%k===0?HB:C);
 return T([`<tr><th ${C}>${s} の約数</th>${d.map(k=>`<td ${st(k)}>${k}</td>`).join('')}</tr>`,`<tr><th ${C}>${l} をわり切る</th>${d.map(k=>`<td ${st(k)}>${l%k===0?'○':'×'}</td>`).join('')}</tr>`]);}
/* 倍数の表：いちばん大きい数の倍数を upto まで並べ、ほかの数でわり切れるかを ○・× で。両方 ○ の列に色（first＝最初の1列だけ） */
function BAI(nums,upto,first){const m=Math.max(...nums),o=nums.filter(n=>n!==m),cols=[];for(let v=m;v<=upto;v+=m)cols.push(v);
 const ok=v=>o.every(n=>v%n===0),L=cols.find(ok);const st=v=>ok(v)&&(!first||v===L)?HI:C;
 return T([`<tr><th ${C}>${m} の倍数</th>${cols.map(v=>`<td ${st(v)}>${v}</td>`).join('')}</tr>`].concat(o.map(n=>`<tr><th ${C}>${n} でわり切れる</th>${cols.map(v=>`<td ${st(v)}>${v%n===0?'○':'×'}</td>`).join('')}</tr>`)));}
/* 分ける表（最大公約数の文章題） */
function WAKE(h,rows){return T([`<tr><th ${C}></th>${h.map(x=>`<th ${C}>${x}</th>`).join('')}</tr>`].concat(rows.map((r,i)=>`<tr><th ${C}>${r[0]}</th>${r.slice(1).map(x=>`<td ${i===1?HI:C}>${x}</td>`).join('')}</tr>`)));}
/* 線・字（x の属性を使わない：chk_m1u1p1.py は x の文字を見ているため。線は path、字は transform） */
const LN=(x1,y1,x2,y2,st)=>`<path d="M${nr(x1)},${nr(y1)} L${nr(x2)},${nr(y2)}" ${st||'stroke="#111" stroke-width="1.6"'}/>`;
const TX=(x,y,t,an,ex)=>`<text transform="translate(${nr(x)},${nr(y)})" ${ex||FS} text-anchor="${an||'middle'}" font-weight="700">${t}</text>`;
/* 2つの目もりの図（最小公倍数の文章題）：a ごと・b ごとの目もりを 0 から L まで。L の所に朱の線 */
function MEMORI(na,a,nb,b,L,u){const W=250,x0=74,K=W/L,X=v=>nr(x0+v*K);let s='';
 const row=(y,step,lab)=>{let t=LN(x0,y,X(L)+8,y)+TX(x0-8,y+5,lab,'end');
  for(let v=0;v<=L;v+=step)t+=LN(X(v),y-6,X(v),y+6)+TX(X(v),y-10,v,'middle',FS+' stroke="#f5f6f8" stroke-width="4" paint-order="stroke"');return t;};
 s+=LN(X(L),34,X(L),104,`stroke="${RD}" stroke-width="2.4" stroke-opacity=".75"`);
 s+=row(40,a,na)+row(86,b,nb)+TX(X(L),118,L+' '+u,'middle',`${FS} fill="${RD}"`);
 return `<svg viewBox="0 0 ${x0+W+30} 124" width="${x0+W+30}" height="124" aria-label="目もりの図">${s}</svg>`;}
/* わり算の筆算（商の途中に 0 が立たないときだけ） */
function HISSAN(n,d){const ds=String(n).split('').map(Number),k=ds.length,cw=12,x0=62,X=c=>x0+c*cw+cw/2;let s='',row=2,cur=0,started=false,q=[];
 const F='font-size="16" font-family="monospace"';
 const put=(str,endCol,r,ex)=>{str=String(str);for(let i=0;i<str.length;i++)s+=`<text transform="translate(${X(endCol-str.length+1+i)},${16+r*20})" ${F} text-anchor="middle" ${ex||''}>${str[i]}</text>`;};
 put(n,k-1,1);s+=`<text transform="translate(${x0-6},36)" ${F} text-anchor="end">${d}</text><path d="M${x0-2},22 Q${x0+4},30 ${x0-2},42" fill="none" stroke="#111" stroke-width="1.6"/>`+LN(x0-2,22,X(k-1)+cw/2+2,22);
 for(let i=0;i<k;i++){cur=cur*10+ds[i];const qd=Math.floor(cur/d);if(!started&&qd===0)continue;if(started&&qd===0)return null;started=true;q.push([qd,i]);
  const p=qd*d;put(p,i,row,`fill="${RD}"`);s+=LN(X(i-String(cur).length+1)-cw/2,16+row*20+5,X(i)+cw/2,16+row*20+5,'stroke="#111" stroke-width="1.4"');row++;cur-=p;
  if(i<k-1)put(String(cur===0?'':cur)+ds[i+1],i+1,row);else put(cur,i,row);row++;}
 q.forEach(([v,i])=>put(v,i,0,'font-weight="700"'));
 return `<svg viewBox="0 0 ${X(k-1)+30} ${16+row*20-8}" width="${X(k-1)+30}" height="${16+row*20-8}" aria-label="わり算の筆算">${s}</svg>`;}
return {YAKU,BAI,WAKE,MEMORI,HISSAN};})();
return {"M1U1P1_ZU_HISSAN":(...a)=>M1U1P1_ZU.HISSAN(...a),"M1U1P1_ZU_YAKU":(...a)=>M1U1P1_ZU.YAKU(...a),"M1U1P1_ZU_BAI":(...a)=>M1U1P1_ZU.BAI(...a),"M1U1P1_ZU_WAKE":(...a)=>M1U1P1_ZU.WAKE(...a),"M1U1P1_ZU_MEMORI":(...a)=>M1U1P1_ZU.MEMORI(...a)};
})();
NS["gg_m1u6p1"]=(function(){
const M1U6P1_ZU=(()=>{
const FS='font-size="13"',RD='#FF4B00',GR='#6b7280';
const nr=v=>Math.round(v*100)/100;
const SVG=(W,H,b,lab)=>`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-label="${lab}">${b}</svg>`;
const ln=(x1,y1,x2,y2,st)=>`<line x1="${nr(x1)}" y1="${nr(y1)}" x2="${nr(x2)}" y2="${nr(y2)}" ${st||'stroke="#111" stroke-width="1.6"'}/>`;
const tx=(x,y,t,an,ex)=>`<text x="${nr(x)}" y="${nr(y)}" ${FS} text-anchor="${an||'middle'}" font-weight="700" ${ex||''}>${t}</text>`;
const dot=(x,y)=>`<circle cx="${nr(x)}" cy="${nr(y)}" r="3" fill="#111"/>`;
const sq=(x,y,ux,uy,s)=>{s=s||9;const vx=-uy,vy=ux;return `<polyline points="${nr(x+ux*s)},${nr(y+uy*s)} ${nr(x+ux*s+vx*s)},${nr(y+uy*s+vy*s)} ${nr(x+vx*s)},${nr(y+vy*s)}" fill="none" stroke="#111" stroke-width="1.2"/>`;};
const tick=(x1,y1,x2,y2,n)=>{const mx=(x1+x2)/2,my=(y1+y2)/2,L=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/L,uy=(y2-y1)/L,vx=-uy,vy=ux;let s='';for(let i=0;i<n;i++){const o=(i-(n-1)/2)*4;s+=ln(mx+ux*o-vx*5,my+uy*o-vy*5,mx+ux*o+vx*5,my+uy*o+vy*5,`stroke="${RD}" stroke-width="1.6"`);}return s;};
const arc=(cx,cy,r,a1,a2,st)=>{const p=a=>[cx+r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)];const [x1,y1]=p(a1),[x2,y2]=p(a2);return `<path d="M${nr(x1)},${nr(y1)} A${r},${r} 0 ${a2-a1>180?1:0} 0 ${nr(x2)},${nr(y2)}" fill="none" ${st||'stroke="#111" stroke-width="1.3"'}/>`;};
/* 一直線の角：secs＝右から順の [角度, 字]。90 は直角の印 */
function ANG(secs){const cx=130,cy=96,R=78;let s=ln(14,cy,246,cy),a=0;
 secs.forEach(([d,t],i)=>{const b=a+d;if(i<secs.length-1){const e=b*Math.PI/180;s+=ln(cx,cy,cx+R*Math.cos(e),cy-R*Math.sin(e));}
  const m=(a+b)/2*Math.PI/180,r=d===90?0:24+i*4;
  if(d===90)s+=`<polyline points="${nr(cx+12*Math.cos(a*Math.PI/180))},${nr(cy-12*Math.sin(a*Math.PI/180))} ${nr(cx+17*Math.cos(m))},${nr(cy-17*Math.sin(m))} ${nr(cx+12*Math.cos(b*Math.PI/180))},${nr(cy-12*Math.sin(b*Math.PI/180))}" fill="none" stroke="#111" stroke-width="1.2"/>`;
  else s+=arc(cx,cy,r,a,b,t==='?'?`stroke="${RD}" stroke-width="2"`:undefined);
  const lr=d===90?32:r+(d<40?30:16);s+=tx(cx+lr*Math.cos(m),cy-lr*Math.sin(m)+5,t,'middle',t==='?'?`fill="${RD}"`:'');a=b;});
 s+=dot(cx,cy)+tx(cx,cy+18,'180°（一直線）');return SVG(260,120,s,'一直線の角の図');}
/* 直線・線分・半直線 */
function LINES3(){let s='';const row=(y,k,lab)=>{const ax=70,bx=150;let t='';const x1=k==='seg'||k==='ray'?ax:30,x2=k==='seg'?bx:200;t+=ln(x1,y,x2,y,'stroke="#111" stroke-width="2"');
  if(k!=='seg')t+=`<polygon points="${x2},${y-4} ${x2+8},${y} ${x2},${y+4}" fill="#111"/>`;if(k==='line')t+=`<polygon points="${x1},${y-4} ${x1-8},${y} ${x1},${y+4}" fill="#111"/>`;
  t+=dot(ax,y)+dot(bx,y)+tx(ax,y-8,'A')+tx(bx,y-8,'B')+tx(214,y+5,lab,'start');return t;};
 s+=row(24,'line','直線 AB')+row(58,'seg','線分 AB')+row(92,'ray','半直線 AB');return SVG(290,104,s,'直線・線分・半直線の図');}
/* 平行と垂直 */
function PARPERP(){let s=ln(14,24,124,24)+ln(14,54,124,54)+tx(18,18,'A','start')+tx(120,18,'B','end')+tx(18,72,'C','start')+tx(120,72,'D','end')+tx(70,94,'AB∥CD');
 s+=ln(150,60,250,60)+ln(200,12,200,78)+sq(200,60,1,0)+tx(154,54,'A','start')+tx(246,54,'B','end')+tx(208,22,'C','start')+tx(208,80,'D','start')+tx(200,102,'AB⊥CD');return SVG(270,110,s,'平行と垂直の図');}
/* 点と直線の距離 */
function DIST(){let s=ln(14,84,250,84)+tx(244,78,'ℓ')+dot(100,22)+tx(92,20,'P','end')+ln(100,22,100,84,`stroke="${RD}" stroke-width="2.6"`)+sq(100,84,1,0)+dot(100,84)+tx(100,102,'H');
 s+=ln(100,22,196,84,'stroke="#9ca3af" stroke-width="1.4" stroke-dasharray="5 4"')+dot(196,84)+tx(196,102,'Q');return SVG(260,110,s,'点と直線の距離の図');}
/* 垂直二等分線 */
function BISECT(a,b){a=a||'A';b=b||'B';const y=92,ax=40,bx=200,mx=120;let s=ln(ax,y,bx,y,'stroke="#111" stroke-width="2"')+ln(mx,8,mx,116,`stroke="${RD}" stroke-width="2"`)+sq(mx,y,1,0)+tick(ax,y,mx,y,1)+tick(mx,y,bx,y,1);
 s+=ln(mx,30,ax,y,'stroke="#6b7280" stroke-width="1.3" stroke-dasharray="5 4"')+ln(mx,30,bx,y,'stroke="#6b7280" stroke-width="1.3" stroke-dasharray="5 4"')+tick(mx,30,ax,y,2)+tick(mx,30,bx,y,2);
 s+=dot(ax,y)+dot(bx,y)+dot(mx,30)+tx(ax-4,y+18,a)+tx(bx+4,y+18,b)+tx(mx+16,y+18,'M')+tx(mx+10,30,'P','start');return SVG(240,124,s,'垂直二等分線の図');}
/* 垂線（on＝直線上の点を通る） */
function PERP(on,pt,lab){pt=pt||'P';lab=lab||'ℓ';const y=84;let s=ln(14,y,226,y)+tx(222,y-6,lab,'end')+ln(110,10,110,104,`stroke="${RD}" stroke-width="2"`)+sq(110,y,1,0);
 s+=on?dot(110,y)+tx(98,y+18,pt):dot(110,30)+tx(120,32,pt,'start');return SVG(240,110,s,on?'直線上の点を通る垂線の図':'直線上にない点を通る垂線の図');}
/* 鈍角三角形の高さ */
function HEIGHT(ob){if(!ob){const B=[24,96],C=[214,96],A=[90,22],H=[90,96];let s=`<polygon points="${B} ${C} ${A}" fill="none" stroke="#111" stroke-width="1.8"/>`+ln(A[0],A[1],H[0],H[1],`stroke="${RD}" stroke-width="2.4"`)+sq(H[0],96,1,0);
  return SVG(240,122,s+tx(B[0],114,'B')+tx(C[0],114,'C')+tx(A[0],16,'A')+tx(H[0],114,'H')+tx(H[0]+20,64,'高さ','start',`fill="${RD}"`),'三角形の高さの図');}
 const B=[24,96],C=[130,96],A=[196,24],H=[196,96];let s=`<polygon points="${B} ${C} ${A}" fill="none" stroke="#111" stroke-width="1.8"/>`+ln(C[0],96,H[0]+14,96,'stroke="#6b7280" stroke-width="1.4" stroke-dasharray="5 4"');
 s+=ln(A[0],A[1],H[0],H[1],`stroke="${RD}" stroke-width="2.4"`)+sq(H[0],96,-1,0)+tx(B[0],114,'B')+tx(C[0],114,'C')+tx(A[0],16,'A')+tx(H[0]+2,114,'H')+tx(H[0]+8,64,'高さ','start',`fill="${RD}"`);
 return SVG(250,122,s,'三角形の高さの図');}
/* 60° の作図（正三角形） */
function TRI60(){const c=Math.cos(Math.PI/3),sn=Math.sin(Math.PI/3),O=[30,110],U=[122,110],X=[30+92*c,110-92*sn],RL=124;let s=ln(20,110,236,110)+ln(O[0],O[1],O[0]+RL*c,110-RL*sn,`stroke="${RD}" stroke-width="2"`);
 s+=`<polygon points="${O} ${U} ${nr(X[0])},${nr(X[1])}" fill="none" stroke="#6b7280" stroke-width="1.3" stroke-dasharray="5 4"/>`+tick(O[0],O[1],U[0],U[1],1)+tick(O[0],O[1],X[0],X[1],1)+tick(U[0],U[1],X[0],X[1],1);
 s+=arc(O[0],O[1],22,0,60)+tx(O[0]+30,O[1]-8,'60°','start')+dot(...O)+dot(...U)+dot(X[0],X[1])+tx(O[0],128,'O')+tx(U[0],128,'U')+tx(X[0]-10,X[1]+4,'X','end')+tx(230,128,'B')+tx(O[0]+RL*c+8,110-RL*sn+10,'A','start');
 return SVG(250,134,s,'正三角形で 60° をつくる図');}
/* 線分の上の点：pts＝[[字, 0〜1]]、dims＝[[i, j, 字, 段]]（段 1・2…＝上、−1＝下）、tk＝[[i, j, 本数]] */
function SEG(pts,dims,tk){const L=24,W=220,X=p=>L+p*W,mx=Math.max(0,...(dims||[]).map(d=>d[3])),Y=22+mx*20;let s=ln(X(0),Y,X(1),Y,'stroke="#111" stroke-width="2"');
 (tk||[]).forEach(([i,j,n])=>{s+=tick(X(pts[i][1]),Y,X(pts[j][1]),Y,n);});
 (dims||[]).forEach(([i,j,t,lv])=>{const y=Y-12-(lv-1)*20,x1=X(pts[i][1]),x2=X(pts[j][1]);s+=ln(x1,y,x2,y,`stroke="${GR}" stroke-width="1.2"`)+ln(x1,y-4,x1,y+4,`stroke="${GR}" stroke-width="1.2"`)+ln(x2,y-4,x2,y+4,`stroke="${GR}" stroke-width="1.2"`)+`<text x="${nr((x1+x2)/2)}" y="${nr(y-4)}" ${FS} text-anchor="middle" font-weight="700" stroke="#f5f6f8" stroke-width="4" paint-order="stroke">${t}</text>`;});
 pts.forEach(([t,p])=>{s+=dot(X(p),Y)+tx(X(p),Y+18,t);});return SVG(L*2+W,Y+26,s,'線分の図');}
/* 表（x と y の値） */
function TBL(rows){return `<table class="tb inc">${rows.map(r=>`<tr>${r.map((c,j)=>j===0?`<th style="min-width:24px;padding:1px 6px">${c}</th>`:`<td style="min-width:24px;padding:1px 6px">${c}</td>`).join('')}</tr>`).join('')}</table>`;}
return {ANG,LINES3,PARPERP,DIST,BISECT,PERP,HEIGHT,TRI60,SEG,TBL};})();
return {"M1U6P1_ZU_ANG":(...a)=>M1U6P1_ZU.ANG(...a),"M1U6P1_ZU_TBL":(...a)=>M1U6P1_ZU.TBL(...a),"M1U6P1_ZU_LINES3":(...a)=>M1U6P1_ZU.LINES3(...a),"M1U6P1_ZU_PARPERP":(...a)=>M1U6P1_ZU.PARPERP(...a),"M1U6P1_ZU_DIST":(...a)=>M1U6P1_ZU.DIST(...a),"M1U6P1_ZU_BISECT":(...a)=>M1U6P1_ZU.BISECT(...a),"M1U6P1_ZU_PERP":(...a)=>M1U6P1_ZU.PERP(...a),"M1U6P1_ZU_HEIGHT":(...a)=>M1U6P1_ZU.HEIGHT(...a),"M1U6P1_ZU_SEG":(...a)=>M1U6P1_ZU.SEG(...a),"M1U6P1_ZU_TRI60":(...a)=>M1U6P1_ZU.TRI60(...a)};
})();
NS["gg_m2u4p4"]=(function(){
function GQ4(o){const nx=o.xmax/o.xs,ny=o.ymax/o.ys,csx=230/nx,csy=Math.min(170/ny,csx*1.6),L=42,B=28,T=24,Rm=56,PW=nx*csx,PH=ny*csy,W=L+PW+Rm,H=T+PH+B;
 const X=x=>L+x/o.xs*csx,Y=y=>T+PH-y/o.ys*csy;
 let s=`<svg class="gr" viewBox="0 0 ${W} ${H}" width="${o.w||280}" height="${(o.w||280)*H/W}">`;
 for(let i=0;i<=nx;i++)s+=`<line x1="${X(i*o.xs)}" y1="${T}" x2="${X(i*o.xs)}" y2="${T+PH}" stroke="#e5e7eb" stroke-width="1"/>`;
 for(let j=0;j<=ny;j++)s+=`<line x1="${L}" y1="${Y(j*o.ys)}" x2="${L+PW}" y2="${Y(j*o.ys)}" stroke="#e5e7eb" stroke-width="1"/>`;
 s+=`<line x1="${L}" y1="${T+PH}" x2="${L+PW+10}" y2="${T+PH}" stroke="#111" stroke-width="1.6"/><line x1="${L}" y1="${T+PH}" x2="${L}" y2="${T-8}" stroke="#111" stroke-width="1.6"/>`;
 for(let v=o.xt;v<=o.xmax+1e-9;v+=o.xt)s+=`<text x="${X(v)}" y="${T+PH+15}" font-size="11" text-anchor="middle" fill="#555">${+v.toFixed(2)}</text>`;
 for(let v=o.yt;v<=o.ymax+1e-9;v+=o.yt)s+=`<text x="${L-5}" y="${Y(v)+4}" font-size="11" text-anchor="end" fill="#555">${+v.toFixed(2)}</text>`;
 s+=`<text x="${L-5}" y="${T+PH+15}" font-size="11" text-anchor="end">O</text><text x="${L+PW+14}" y="${T+PH+4}" font-size="12"><tspan font-style="italic">x</tspan>（${o.xu||''}）</text><text x="${L+6}" y="${T-8}" font-size="12"><tspan font-style="italic">y</tspan>（${o.yu||''}）</text>`;
 (o.hl||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#c2410c" stroke-width="5" stroke-opacity=".5"/>`;});
 (o.dsh||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#c2410c" stroke-width="1.6" stroke-dasharray="4 3"/>`;});
 (o.polys||[]).forEach(p=>{let pts,d;if(Array.isArray(p[0][0])){pts=p[0];d=p[1];}else{pts=p.filter(q=>Array.isArray(q));d=p.some(q=>q===1);}s+=`<polyline points="${pts.map(q=>X(q[0])+','+Y(q[1])).join(' ')}" fill="none" stroke="#111" stroke-width="2.4" ${d?'stroke-dasharray="7 4"':''}/>`;for(let i=0;i+1<pts.length;i++)s+=`<line x1="${X(pts[i][0])}" y1="${Y(pts[i][1])}" x2="${X(pts[i+1][0])}" y2="${Y(pts[i+1][1])}" stroke="none" stroke-width="2.4"/>`;});
 (o.pts||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4" fill="#111"/>`+(q[2]?`<text x="${X(q[0])+7}" y="${Y(q[1])-7}" font-size="12" font-weight="700" stroke="#fff" stroke-width="4" paint-order="stroke">${q[2]}</text>`:'');});
 (o.rings||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="9" fill="none" stroke="#c2410c" stroke-width="2.2"/>`;});
 (o.notes||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${X(x)+(dx||0)}" y="${Y(y)+(dy||0)}" text-anchor="${an||'start'}" font-size="12" font-weight="700" fill="#c2410c" stroke="#fff" stroke-width="4" paint-order="stroke">${t}</text>`;});
 (o.labs||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${X(x)+(dx||0)}" y="${Y(y)+(dy||0)}" text-anchor="${an||'start'}" font-size="12" font-weight="700" stroke="#fff" stroke-width="4" paint-order="stroke">${t}</text>`;});
 return s+'</svg>';}
return {"GQ4":GQ4};
})();
NS["gg_m2u4p5"]=(function(){
const RATEA='\\(a=\\dfrac{y\\text{ の増加量}}{x\\text{ の増加量}}\\)';
const mi=v=>String(v).replace(/^-/,'−');
function GS(o){const R=o.R||5,U=20,L=R+.5,W=(2*R+1)*U,c=W/2,X=x=>c+x*U,Y=y=>c-y*U,sm=!!o.sm,K=sm?1.35:1;
 const H=`stroke="#fff" stroke-width="${4*K}" paint-order="stroke"`;
 let s=`<svg class="${sm?'gch':'gr'}" viewBox="0 0 ${W} ${W}" width="${o.w||200}" height="${o.w||200}">`;
 if(o.grid!==false)for(let i=-R;i<=R;i++){s+=`<line x1="${X(i)}" y1="${Y(-L)}" x2="${X(i)}" y2="${Y(L)}" stroke="#d1d5db" stroke-width="1"/><line x1="${X(-L)}" y1="${Y(i)}" x2="${X(L)}" y2="${Y(i)}" stroke="#d1d5db" stroke-width="1"/>`;}
 (o.yhl?[o.yhl]:[]).forEach(q=>{s+=`<line x1="${c}" y1="${Y(q[0])}" x2="${c}" y2="${Y(q[1])}" stroke="#c2410c" stroke-width="6" stroke-opacity=".55"/>`;});
 s+=`<line x1="${X(-L)}" y1="${c}" x2="${X(L)}" y2="${c}" stroke="#111" stroke-width="1.4"/><line x1="${c}" y1="${Y(-L)}" x2="${c}" y2="${Y(L)}" stroke="#111" stroke-width="1.4"/>`;
 s+=`<text x="${X(L)-9*K}" y="${c-6}" font-size="${13*K}" font-style="italic">x</text><text x="${c+6}" y="${Y(L)+13*K}" font-size="${13*K}" font-style="italic">y</text><text x="${c-4}" y="${c+14*K}" font-size="${12*K}" text-anchor="end">O</text>`;
 if(o.nums!==false)[-4,-2,2,4].forEach(v=>{s+=`<text x="${X(v)}" y="${c+14*K}" font-size="${11*K}" text-anchor="middle" fill="#555" ${H}>${mi(v)}</text><text x="${c-5}" y="${Y(v)+4*K}" font-size="${11*K}" text-anchor="end" fill="#555" ${H}>${mi(v)}</text>`;});
 const CL=(a,b)=>{let p=[];[-L,L].forEach(x=>{const y=a*x+b;if(y>=-L-1e-9&&y<=L+1e-9)p.push([x,y]);});if(a!==0)[-L,L].forEach(y=>{const x=(y-b)/a;if(x>-L&&x<L)p.push([x,y]);});p.sort((u,v)=>u[0]-v[0]);return [p[0],p[p.length-1]];};
 (o.lines||[]).forEach(l=>{const [p,q]=CL(l[0],l[1]);s+=`<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" stroke="#111" stroke-width="${sm?3:2.4}"/>`;});
 (o.dsh||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#c2410c" stroke-width="1.4" stroke-dasharray="4 3"/>`;});
 (o.segs||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#111" stroke-width="2.6"/>`;});
 if(o.st){const [x0,y0,dx,dy]=o.st;s+=`<line x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x0+dx)}" y2="${Y(y0)}" stroke="#c2410c" stroke-width="2.6"/><line x1="${X(x0+dx)}" y1="${Y(y0)}" x2="${X(x0+dx)}" y2="${Y(y0+dy)}" stroke="#c2410c" stroke-width="2.6"/><text x="${(X(x0)+X(x0+dx))/2}" y="${Y(y0)+(dy>0?17:-8)}" font-size="13" font-weight="700" fill="#c2410c" text-anchor="middle" ${H}>右へ${dx}</text><text x="${X(x0+dx)+6}" y="${(Y(y0)+Y(y0+dy))/2+5}" font-size="13" font-weight="700" fill="#c2410c" ${H}>${dy>0?'上へ'+dy:'下へ'+(-dy)}</text>`;}
 const OF={r:[8,4,'start'],l:[-8,4,'end'],t:[0,-9,'middle'],b:[0,18,'middle'],tr:[6,-7,'start'],tl:[-6,-7,'end'],br:[6,16,'start'],bl:[-6,16,'end']};
 (o.pts||[]).forEach(q=>{const f=OF[q[3]||'tr'];s+=q[4]?`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4.5" fill="#fff" stroke="#111" stroke-width="2"/>`:`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4.5" fill="#111"/>`;if(q[2])s+=`<text x="${X(q[0])+f[0]}" y="${Y(q[1])+f[1]}" text-anchor="${f[2]}" font-size="13" font-weight="700" ${H}>${q[2]}</text>`;});
 return s+'</svg>';}
const C6=(r,ws,p)=>{const a=ws.slice();a.splice(p,0,r);a.r=p;return a;};
const S=(o)=>{if(o.ren){o.steps.forEach(st=>st.a=st.c.r);}else o.a=o.c.r;return o;};
const M2U4P5_H=(()=>{
const R=String.raw;
const SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
/* ===== 解説の書き方の道具（2026-11-02 係5。決まり §0c「解説の決まり 1〜14」）=====
   ④（m2u4p4。データの解説はこの道具で書き出したもの）と ⑤（m2u4p5。下の関数がこの道具で解説を作る）で使う。
   \UA〜\UE＝代入の線（代入した順）／\UR＝結果の下線／\AF{札}{…}・\AT{…}＝矢印／"&段|段"＝補足ボックス（!札・<図） */
const XW=(()=>{
const R=String.raw;
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;};
const nr=v=>Math.round(v*1e6)/1e6;
/* 有理数 [分子, 分母] */
const Q=(n,d)=>{if(d===undefined)d=1;if(!Number.isInteger(n)||!Number.isInteger(d)){const k=1e6;n=Math.round(n*k);d=Math.round(d*k);}if(d<0){n=-n;d=-d;}const g=gcd(n,d);return [n/g,d/g];};
const qa=(a,b)=>Q(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),qs=(a,b)=>Q(a[0]*b[1]-b[0]*a[1],a[1]*b[1]),qm=(a,b)=>Q(a[0]*b[0],a[1]*b[1]),qd=(a,b)=>Q(a[0]*b[1],a[1]*b[0]),qn=a=>[-a[0],a[1]];
const qz=a=>a[0]===0,qi=a=>a[1]===1,qv=a=>a[0]/a[1];
const qq=v=>Array.isArray(v)?v:Q(v);
/* 式の中の数（負は -）。分数は \dfrac */
const qt=v=>{const q=qq(v);if(q[1]===1)return String(q[0]);return (q[0]<0?'-':'')+R`\dfrac{${Math.abs(q[0])}}{${q[1]}}`;};
/* 負の数はかっこ（分数は \left( \right)） */
const qp=v=>{const q=qq(v);if(q[0]>=0)return qt(q);return q[1]===1?`(${qt(q)})`:R`\left(${qt(q)}\right)`;};
/* 文の中の数（負は −） */
const qw=v=>{const q=qq(v);return q[1]===1?String(q[0]).replace(/^-/,'−'):R`\(${qt(q)}\)`;};
const M=s=>R`\(${s}\)`;
const U=(t,b)=>R`\underbrace{${t}}_{\color{#c2410c}{${b}}}`;
const UA=s=>R`\UA{${s}}`,UB=s=>R`\UB{${s}}`,UC=s=>R`\UC{${s}}`,UD=s=>R`\UD{${s}}`,UR=s=>R`\UR{${s}}`;
const UL=[UA,UB,UC,UD];
const AF=(l,s)=>R`\AF{${l}}{${s}}`,AT=s=>R`\AT{${s}}`;
const TX=s=>R`\text{${s}}`;
const BOX=(...r)=>'&'+r.filter(x=>x!=null&&x!=='').join('|');
/* 項 {c:有理数, v:文字（''＝数の項）}。t＝表示を変えるとき（符号もふくめた字） */
const tm=(c,v)=>({c:qq(c),v:v||''});
const ft=(t,first)=>{if(t.t!==undefined)return t.t;const c=t.c;let s;
 if(t.v){s=(c[0]===c[1]?'':c[0]===-c[1]?'-':qt(c))+t.v;}else s=qt(c);
 return (!first&&c[0]>=0?'+':'')+s;};
const fs=(ts,o)=>{o=o||{};if(!ts.length)return '0';return ts.map((t,i)=>{let s=ft(t,i===0);if(o.af===i)s=AF('移項',s);if(o.at===i)s=AT(s);if(o.w&&o.w[i])s=o.w[i](s);return s;}).join('');};
const kx=(c,v)=>fs([tm(c,v)]);   /* 係数 c の項 */
/* 項の和（同じ種類）を1つに */
const sum=ts=>ts.reduce((a,t)=>qa(a,t.c),Q(0));

/* ---------- 補足ボックス ---------- */
const BX={
 ikou:()=>BOX(R`\(A+b=C\)`,R`\(A=C\UR{-b}\)`,'!移項：符号を変えて反対の辺へ'),
 swap:(l,r)=>BOX(M(`${l}=${r}`),M(`${r}=${l}`),'!左右の入れかえは符号を変えない'),
 bunpai:()=>BOX(R`\(a(b+c)=ab+ac\)`,'!分配法則'),
 kagen:()=>BOX('2つの式をたしたり引いたりして、文字を1つ消す','!加減法'),
 dainyuho:()=>BOX('一方の式を、もう一方の式の文字に代入して、文字を1つ消す','!代入法'),
 sign:(eq,ng,lab)=>BOX(M(eq),M(UR(ng)),`!${lab} の各項の符号を変える`),
 dai:(o,s,tag)=>BOX('代入＝式の中の文字を、数や式に置きかえること',M(o),M(R`\rightarrow\ ${s}`),tag?'!'+tag:null),
 zouka:()=>BOX(R`\(\text{増加量}=\UA{\text{あと}}-\UB{\text{まえ}}\)`,R`!\(x\) も \(y\) も同じ順`),
 heniki:fig=>BOX(fig,R`\(x\) や \(y\) がとる値の範囲`,'!変域：太い線。● はふくむ'),
 douri:(a,b)=>BOX(a,b,'!同類項：文字の部分が同じ項')
};
/* 代入のボックス（解説で1回目の代入だけ）。C＝その問題の印 */
const DAI=(C,o,s,neg,ex)=>{if(C.dai)return null;C.dai=1;return BX.dai(o,s,neg?(ex?'式はかっこをつけて代入':'負の数はかっこをつけて代入'):(ex?'式はかっこをつけて代入':null));};
const once=(C,k,b)=>{if(C[k])return null;C[k]=1;return b;};
const push=(w,...a)=>{a.forEach(x=>{if(x!=null&&x!=='')w.push(x);});return w;};

/* ---------- 1次方程式を解く（決まり 3・7・8・9） ----------
   L・R＝項の配列、v＝求める文字。o.note＝初めの行のメモ、o.after＝初めの行のすぐ後ろに置くボックス、o.skip＝初めの行を書かない（前の行と同じ形のとき）
   o.wl・o.wr＝初めの行の左辺・右辺の項を飾る関数（例：代入の線） */
function SOLVE(C,L,R0,v,o){o=o||{};const w=[];let Rr=R0;const mode=o.mode||'std';
 const hasV=ts=>ts.some(t=>t.v===v);const pl=ts=>ts.map(z=>({c:z.c,v:z.v}));
 const vs=mode==='R'?'R':'L';
 /* 動かす項：fl＝左辺から右辺へ、fr＝右辺から左辺へ */
 const moves=(l,r)=>vs==='L'?{fl:l.map((t,i)=>t.v!==v&&!qz(t.c)&&!(mode==='noswap'&&false)?i:-1).filter(i=>i>=0),fr:r.map((t,i)=>t.v===v?i:-1).filter(i=>i>=0)}
  :{fl:l.map((t,i)=>t.v===v?i:-1).filter(i=>i>=0),fr:r.map((t,i)=>t.v!==v&&!qz(t.c)?i:-1).filter(i=>i>=0)};
 const pick=mv=>{const pr=mode==='std'?['l','r']:['r','l'];for(const s of pr){if(s==='l'&&mv.fl.length)return ['l',mv.fl[mv.fl.length-1]];if(s==='r'&&mv.fr.length)return ['r',mode==='R'?mv.fr[mv.fr.length-1]:mv.fr[0]];}return null;};
 const startLine=(l,r,deco,arrow)=>{let ol={},or={};
  if(arrow){const pk=pick(moves(l,r));if(pk){if(pk[0]==='l'){ol.af=pk[1];or.at=0;}else{or.af=pk[1];ol.at=0;}}}
  if(deco&&deco.l)ol.w=deco.l;if(deco&&deco.r)or.w=deco.r;
  let a=fs(l,ol),b=fs(r,or);if(deco&&deco.L)a=deco.L(a);if(deco&&deco.R)b=deco.R(b);return arrow?M(`${a}\\mathrel{=}${b}`):M(`${a}=${b}`);};
 const swapNow=(lt,rt,arrow)=>{push(w,'>左右を入れかえる（移項とちがって、符号は変えない）'+(arrow?'。移項する':''));const t=pl(L);L=pl(Rr);Rr=t;push(w,startLine(L,Rr,null,arrow));push(w,once(C,'bswap',BX.swap(lt,rt)));};
 let swap=mode==='std'&&!hasV(L)&&hasV(Rr);
 const mv0=swap?moves(Rr,L):moves(L,Rr);const willMove=mv0.fl.length+mv0.fr.length>0;
 const arrow=willMove&&!C.arrow;
 if(swap){
  if(!o.skip){if(o.note)push(w,'>'+o.note);push(w,startLine(L,Rr,{l:o.wl,r:o.wr,L:o.wL,R:o.wR},false));}
  push(w,...(o.after||[]));swapNow(fs(pl(L)),fs(pl(Rr)),arrow);
 } else {
  if(!o.skip||arrow){if(o.note)push(w,'>'+o.note);push(w,startLine(L,Rr,{l:o.wl,r:o.wr,L:o.wL,R:o.wR},arrow));}
  push(w,...(o.after||[]));
 }
 if(arrow){C.arrow=1;push(w,once(C,'bikou',BX.ikou()));}
 L=pl(L);Rr=pl(Rr);
 /* 移項 */
 const mv=moves(L,Rr);
 if(mv.fl.length||mv.fr.length){
  const used=arrow?pick(mv):null;const others=[];
  mv.fl.forEach(i=>{if(!(used&&used[0]==='l'&&used[1]===i))others.push([L[i],'右辺']);});mv.fr.forEach(i=>{if(!(used&&used[0]==='r'&&used[1]===i))others.push([Rr[i],'左辺']);});
  const keepL=L.filter((t,i)=>!mv.fl.includes(i)&&!(qz(t.c)&&L.length>1)),keepR=Rr.filter((t,i)=>!mv.fr.includes(i)&&!(qz(t.c)&&Rr.length>1));
  const SL=[...keepL,...mv.fr.map(i=>({c:qn(Rr[i].c),v:Rr[i].v,m:1}))].filter(t=>!(qz(t.c)&&!t.m)),SR=[...keepR,...mv.fl.map(i=>({c:qn(L[i].c),v:L[i].v,m:1}))].filter(t=>!(qz(t.c)&&!t.m));
  const side=(ts)=>{const raw=ts.map((t,i)=>{const s=ft(t,i===0);return t.m&&!/dfrac/.test(s)?UR(s):s;}).join('');
   if(ts.length>1){const c=sum(ts);const vv=ts[0].v;return {tex:U(raw,vv?kx(c,vv):qt(c)),c,v:vv};}return {tex:raw||'0',c:ts.length?ts[0].c:Q(0),v:ts.length?ts[0].v:''};};
  const a=side(SL),b=side(SR);
  const nt=others.length&&arrow?others.map(([t,s])=>`\\(${ft(t,true)}\\) も${s}へ移項する`).join('。'):(arrow?'':'移項する');
  if(nt)push(w,'>'+nt);
  push(w,M(`${a.tex}=${b.tex}`));
  L=[tm(a.c,a.v)];Rr=[tm(b.c,b.v)];
  if(SL.length>1||SR.length>1)push(w,M(`${fs(L)}=${fs(Rr)}`));
 }
 /* 求める文字が右辺だけ → 左右を入れかえる（決まり 7） */
 if(!hasV(L)&&hasV(Rr))swapNow(fs(L),fs(Rr),false);
 /* 係数 */
 let k=sum(L.filter(t=>t.v===v)),r=sum(Rr);
 if(!qi(k)){const d=k[1];
  push(w,`>両辺に ${d} をかける（分母をはらう）`,M(`${U(`${kx(k,v)}\\times ${d}`,kx(qm(k,Q(d)),v))}=${U(`${qp(r)}\\times ${d}`,qt(qm(r,Q(d))))}`));
  push(w,once(C,'bbunbo',BOX(M(`${kx(k,v)}=${qt(r)}`),M(`${kx(k,v)}${UR('\\times '+d)}=${qp(r)}${UR('\\times '+d)}`),`!分母をはらう：両辺の全部の項に ${d} をかける`)));
  k=qm(k,Q(d));r=qm(r,Q(d));push(w,M(`${kx(k,v)}=${qt(r)}`));}
 const x=qd(r,k);const xs=o.dec&&Number.isFinite(qv(x))&&String(nr(qv(x))).length<8?String(nr(qv(x))):qt(x);
 if(k[0]===-1&&k[1]===1)push(w,`>両辺に \\(-1\\) をかける`,M(`${v}=${xs}`));
 else if(!(k[0]===1&&k[1]===1))push(w,`>両辺を \\(${v}\\) の係数 ${qw(k)} でわる`,M(`${v}=${xs}`));
 return {w,x};}

/* 文字に数を代入して計算する：tsは項の配列。sub＝{文字:[値, 線の関数]}。lhs＝左辺の字（y など）
   1行目＝元の式（文字に線）、2行目＝代入した式（数に線・かけ算に下かっこ）、そのあと計算 */
function EVAL(C,lhs,ts,sub,o){o=o||{};const w=[];
 const orig=ts.map((t,i)=>{if(t.v&&sub[t.v]){const f=sub[t.v][1];const c=t.c;const pre=(c[0]===c[1]?(i?'+':''):c[0]===-c[1]?'-':(i&&c[0]>0?'+':'')+qt(c));return pre+f(t.v);}return ft(t,i===0);}).join('');
 let neg=false;const vals=[];
 const sb=ts.map((t,i)=>{if(t.v&&sub[t.v]){const [val,f]=sub[t.v];const vq=qq(val),c=t.c,pr=qm(c,vq);vals.push(pr);if(vq[0]<0)neg=true;
   if(c[0]===c[1])return (i?'+':'')+f(qp(vq));
   if(c[0]===-c[1])return U('-'+f(qp(vq)),qt(pr));
   return (i&&c[0]>0?'+':'')+U(`${qt(c)}\\times ${f(qp(vq))}`,qt(pr));}
  vals.push(t.c);return ft(t,i===0);}).join('');
 if(!o.noOrig){if(o.origNote)push(w,'>'+o.origNote);push(w,M(`${lhs}=${orig}${o.tag||''}`));}
 push(w,'>'+(o.note||Object.keys(sub).map(k=>`\\(${k}\\) に ${qw(sub[k][0])} を代入する`).join('、')),M(`${lhs}=${sb.replace(/^\+/,'')}`));
 push(w,DAI(C,`${lhs}=${orig}`,`${lhs}=${sb.replace(/\\underbrace\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}_\{\\color\{#c2410c\}\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}\}/g,'$1')}`,neg));
 let tot=vals.reduce((a,b)=>qa(a,b),Q(0));
 if(vals.length>1){const raw=vals.map((q,i)=>(i&&q[0]>=0?'+':'')+qt(q)).join('');push(w,M(`${lhs}=${U(raw,qt(tot))}`));}
 if(!o.noLast)push(w,M(`${lhs}=${qt(tot)}`));
 return {w,val:tot};}

/* y＝ax＋b に a・b を代入（決まり 2・12）。a・b＝有理数 */
function AB(C,a,b,o){o=o||{};const w=[];const aq=qq(a),bq=qq(b);
 push(w,M(R`y=\UA{a}x+\UB{b}`),'>'+(o.note||`\\(a\\) に ${qw(aq)}、\\(b\\) に ${qw(bq)} を代入する`));
 const s=R`y=\UA{${qp(aq)}}\times x+\UB{${qp(bq)}}`;push(w,M(s));
 push(w,DAI(C,R`y=\UA{a}x+\UB{b}`,s,aq[0]<0||bq[0]<0));
 push(w,'>'+(aq[0]<0||bq[0]<0?'× とかっこをはぶく':'× をはぶく')+(qz(bq)?'。＋0 は書かない':''));
 return w;}

/* 加減法（決まり 6）：上の式 − 下の式 を、下の式の符号を変えてたす形で。
   top・bot＝[左辺の項, 右辺の項]、lab＝[上の名前, 下の名前]、res＝[左辺, 右辺]（計算した結果の字） */
function KAGEN(C,note,eq,ng,lab){return [ '>'+note+`。${lab} の各項の符号を変えてたす`, once(C,'bkagen',BX.kagen()), BX.sign(eq,ng,lab)].filter(x=>x!=null);}

/* ---------- 図（補足ボックスの図。字は 12px 以上） ---------- */
const BL='#005AFF',FS='font-size="12"',SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
const SVG=(W,H,body,lab)=>`<svg viewBox="0 0 ${nr(W)} ${nr(H)}" width="${nr(W)}" height="${nr(H)}"${lab?` aria-label="${lab}"`:''}>${body}</svg>`;
const TW=t=>[...String(t)].reduce((a,c)=>a+(c.charCodeAt(0)>255?12.5:7),0);
/* テープ図：segs＝[[字, 長さ, 色]]（色：'b'青・'g'灰・'w'白）。top＝上の字（全体）、bot＝[[i,j,字]]（区切り i〜j の下の字） */
function TAPE(segs,o){o=o||{};const tot=segs.reduce((a,s)=>a+s[1],0),PW=o.pw||220,L=10,Y0=o.top?26:8,H=28;let x=L,t='';const xs=[L];
 segs.forEach(s=>{const w=Math.max(PW*s[1]/tot,TW(s[0])+10);const f=s[2]==='b'?`fill="${BL}" fill-opacity=".18"`:s[2]==='g'?'fill="#9ca3af" fill-opacity=".35"':'fill="#fff"';
  t+=`<rect x="${nr(x)}" y="${Y0}" width="${nr(w)}" height="${H}" ${f} stroke="#111" stroke-width="1.4"${s[2]==='w'?' stroke-dasharray="4 2"':''}/><text x="${nr(x+w/2)}" y="${Y0+18}" text-anchor="middle" ${FS} font-weight="700">${s[0]}</text>`;x+=w;xs.push(x);});
 const W=x+L;let H2=Y0+H;
 if(o.top){t+=`<path d="M${L},${Y0-4} L${L},${Y0-12} L${nr(x)},${Y0-12} L${nr(x)},${Y0-4}" fill="none" stroke="#6b7280" stroke-width="1.2"/><text x="${nr((L+x)/2)}" y="${Y0-16}" text-anchor="middle" ${FS} font-weight="700" ${SH}>${o.top}</text>`;}
 (o.bot||[]).forEach((b,k)=>{const a=xs[b[0]],c=xs[b[1]],yy=Y0+H+6+k*20;t+=`<path d="M${nr(a)},${yy} L${nr(a)},${yy+6} L${nr(c)},${yy+6} L${nr(c)},${yy}" fill="none" stroke="#6b7280" stroke-width="1.2"/><text x="${nr((a+c)/2)}" y="${yy+19}" text-anchor="middle" ${FS} font-weight="700">${b[2]}</text>`;H2=yy+24;});
 return SVG(W,H2+4,t,o.lab||'テープ図');}
/* 道のりの線分図：pts＝[[字, 位置(0〜1)]]、segs＝[[i,j,上の字,下の字]] */
function ROUTE(pts,segs,o){o=o||{};const PW=o.pw||230,L=30,Y0=34;const X=p=>L+p*PW;let t=`<line x1="${L}" y1="${Y0}" x2="${L+PW}" y2="${Y0}" stroke="#111" stroke-width="2"/>`;
 pts.forEach(p=>{t+=`<line x1="${nr(X(p[1]))}" y1="${Y0-6}" x2="${nr(X(p[1]))}" y2="${Y0+6}" stroke="#111" stroke-width="2"/><text x="${nr(X(p[1]))}" y="${Y0+22}" text-anchor="middle" ${FS} font-weight="700">${p[0]}</text>`;});
 segs.forEach(g=>{const a=X(pts[g[0]][1])+3,b=X(pts[g[1]][1])-3,m=nr((a+b)/2);t+=`<path d="M${nr(a)},${Y0-8} Q${m},${Y0-24} ${nr(b)},${Y0-8}" fill="none" stroke="#6b7280" stroke-width="1.4"/><text x="${m}" y="${Y0-22}" text-anchor="middle" ${FS} font-weight="700" ${SH}>${g[2]}</text>`;
  if(g[3])t+=`<text x="${m}" y="${Y0+38}" text-anchor="middle" ${FS} font-weight="700" fill="#c2410c" ${SH}>${g[3]}</text>`;});
 return SVG(L*2+PW,Y0+(segs.some(g=>g[3])?44:28),t,o.lab||'線分図');}
/* 表（補足ボックス用）。1列目は見出し */
const TBL=rows=>`<table class="tb inc">${rows.map(r=>`<tr>${r.map((c,j)=>j===0?`<th style="padding:2px 6px;white-space:nowrap">${c}</th>`:`<td style="padding:2px 6px;text-align:center;white-space:nowrap">${c}</td>`).join('')}</tr>`).join('')}</table>`;
/* 変域の図（第1象限）：(0,b0) から (X,0) の線分。x 軸・y 軸の変域を太い線、両はしを●。o.xu・o.yu＝単位 */
function HGR(X,Y0,o){o=o||{};const PW=170,PH=110,L=40,T=18,B=26,Rm=40;const x=v=>nr(L+v/X*PW*0.86),y=v=>nr(T+PH-v/Y0*PH*0.86);
 let t=`<line x1="${L}" y1="${T+PH}" x2="${L+PW+6}" y2="${T+PH}" stroke="#111" stroke-width="1.4"/><line x1="${L}" y1="${T+PH}" x2="${L}" y2="${T-6}" stroke="#111" stroke-width="1.4"/>`;
 t+=`<line x1="${x(0)}" y1="${y(Y0)}" x2="${x(X)}" y2="${y(0)}" stroke="#111" stroke-width="3"/>`;
 t+=`<line x1="${x(0)}" y1="${T+PH}" x2="${x(X)}" y2="${T+PH}" stroke="#c2410c" stroke-width="6" stroke-opacity=".6"/><line x1="${L}" y1="${y(0)}" x2="${L}" y2="${y(Y0)}" stroke="#c2410c" stroke-width="6" stroke-opacity=".6"/>`;
 t+=`<line x1="${x(X)}" y1="${y(0)}" x2="${x(X)}" y2="${T+PH}" stroke="#9ca3af" stroke-dasharray="3 3"/><line x1="${L}" y1="${y(Y0)}" x2="${x(0)}" y2="${y(Y0)}" stroke="#9ca3af" stroke-dasharray="3 3"/>`;
 [[x(0),y(Y0)],[x(X),y(0)],[x(X),T+PH],[L,y(Y0)],[L,T+PH]].forEach(p=>{t+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#111"/>`;});
 t+=`<text x="${x(X)}" y="${T+PH+16}" text-anchor="middle" ${FS} font-weight="700">${o.xl||X}</text><text x="${L-6}" y="${nr(y(Y0)+4)}" text-anchor="end" ${FS} font-weight="700">${o.yl||Y0}</text><text x="${L-6}" y="${T+PH+14}" text-anchor="end" ${FS}>O</text>`;
 t+=`<text x="${L+PW+8}" y="${T+PH+4}" ${FS}><tspan font-style="italic">x</tspan>${o.xu?'（'+o.xu+'）':''}</text><text x="${L+6}" y="${T-6}" ${FS}><tspan font-style="italic">y</tspan>${o.yu?'（'+o.yu+'）':''}</text>`;
 return SVG(L+PW+Rm+10,T+PH+B,t,'変域の図');}
/* 時間の数直線（動点の変域）：pts＝[[時刻, 字]]、hl＝[i,j]（太くする区間） */
function NLINE(pts,hl,o){o=o||{};const PW=220,L=24,Y0=30,mx=Math.max(...pts.map(p=>p[0]));const X=v=>nr(L+v/mx*PW);
 let t=`<line x1="${L}" y1="${Y0}" x2="${L+PW+10}" y2="${Y0}" stroke="#111" stroke-width="1.6"/>`;
 t+=`<line x1="${X(pts[hl[0]][0])}" y1="${Y0}" x2="${X(pts[hl[1]][0])}" y2="${Y0}" stroke="#c2410c" stroke-width="6" stroke-opacity=".6"/>`;
 pts.forEach((p,i)=>{t+=`<line x1="${X(p[0])}" y1="${Y0-5}" x2="${X(p[0])}" y2="${Y0+5}" stroke="#111" stroke-width="1.6"/><text x="${X(p[0])}" y="${Y0+20}" text-anchor="middle" ${FS} font-weight="700">${p[0]} 秒</text><text x="${X(p[0])}" y="${Y0-12}" text-anchor="middle" ${FS} font-weight="700">${p[1]}</text>`;
  if(i===hl[0]||i===hl[1])t+=`<circle cx="${X(p[0])}" cy="${Y0}" r="4.5" fill="#111"/>`;});
 return SVG(L*2+PW+10,Y0+28,t,o.lab||'時間の数直線');}
/* 直方体・円柱・三角柱（ななめから見た図） */
function PRISM(kind,lab){const h=70,w=kind==='cyl'?90:110,ox=kind==='cyl'?0:30,oy=kind==='cyl'?0:18,x0=78,y0=14+oy;let s='';
 if(kind==='cyl'){const rx=w/2,ry=12,cx=x0+rx;s+=`<ellipse cx="${cx}" cy="${y0+h}" rx="${rx}" ry="${ry}" fill="#9ca3af" fill-opacity=".5" stroke="#111" stroke-width="1.4"/>`;
  s+=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${BL}" fill-opacity=".10" stroke="none"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0+h}" stroke="#111" stroke-width="1.4"/><line x1="${x0+w}" y1="${y0}" x2="${x0+w}" y2="${y0+h}" stroke="#111" stroke-width="1.4"/>`;
  s+=`<ellipse cx="${cx}" cy="${y0}" rx="${rx}" ry="${ry}" fill="${BL}" fill-opacity=".18" stroke="#111" stroke-width="1.4"/><line x1="${cx}" y1="${y0}" x2="${x0+w}" y2="${y0}" stroke="#c2410c" stroke-width="1.6"/><circle cx="${cx}" cy="${y0}" r="2.5" fill="#111"/>`;
  s+=`<text x="${nr(cx+rx/2)}" y="${y0-16}" text-anchor="middle" ${FS} font-weight="700" fill="#c2410c" ${SH}>${lab.r}</text>`;}
 else if(kind==='tri'){const A=[x0,y0+h],B=[x0+w,y0+h],Cc=[x0,y0+h-50];const o2=p=>[p[0]+ox,p[1]-oy];const P=p=>p.map(nr).join(',');
  s+=`<polygon points="${P(A)} ${P(B)} ${P(Cc)}" fill="#9ca3af" fill-opacity=".5" stroke="#111" stroke-width="1.4"/>`;
  s+=`<polygon points="${P(o2(A))} ${P(o2(B))} ${P(o2(Cc))}" fill="${BL}" fill-opacity=".12" stroke="#111" stroke-width="1.2" stroke-dasharray="4 3"/>`;
  [A,B,Cc].forEach(p=>{s+=`<line x1="${p[0]}" y1="${p[1]}" x2="${o2(p)[0]}" y2="${o2(p)[1]}" stroke="#111" stroke-width="1.2"/>`;});
  s+=`<polyline points="${A[0]+8},${A[1]} ${A[0]+8},${A[1]-8} ${A[0]},${A[1]-8}" fill="none" stroke="#111" stroke-width="1"/>`;
  s+=`<text x="${nr((A[0]+B[0])/2)}" y="${A[1]+16}" text-anchor="middle" ${FS} font-weight="700">${lab.a}</text><text x="${A[0]-6}" y="${nr((A[1]+Cc[1])/2+4)}" text-anchor="end" ${FS} font-weight="700">${lab.b}</text>`;}
 else {const P=(x,y)=>nr(x)+','+nr(y);s+=`<polygon points="${P(x0,y0+h)} ${P(x0+w,y0+h)} ${P(x0+w+ox,y0+h-oy)} ${P(x0+ox,y0+h-oy)}" fill="#9ca3af" fill-opacity=".5" stroke="#111" stroke-width="1"/>`;
  s+=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${BL}" fill-opacity=".10" stroke="#111" stroke-width="1.4"/><polygon points="${P(x0,y0)} ${P(x0+w,y0)} ${P(x0+w+ox,y0-oy)} ${P(x0+ox,y0-oy)}" fill="${BL}" fill-opacity=".18" stroke="#111" stroke-width="1.4"/><polygon points="${P(x0+w,y0)} ${P(x0+w+ox,y0-oy)} ${P(x0+w+ox,y0+h-oy)} ${P(x0+w,y0+h)}" fill="${BL}" fill-opacity=".14" stroke="#111" stroke-width="1.4"/>`;
  s+=`<text x="${x0+w/2}" y="${y0+h+16}" text-anchor="middle" ${FS} font-weight="700">${lab.a}</text><text x="${nr(x0+w+ox/2+6)}" y="${nr(y0+h-oy/2+14)}" ${FS} font-weight="700">${lab.b}</text>`;}
 const lx=x0-8;s+=`<line x1="${lx}" y1="${y0}" x2="${lx}" y2="${y0+h}" stroke="#111" stroke-width="1"/><text x="${lx-4}" y="${y0+h/2+4}" text-anchor="end" ${FS} font-weight="700">${lab.h}</text>`;
 s+=`<text x="${x0+w/2+ox/2}" y="${y0+h+34}" text-anchor="middle" ${FS} font-weight="700" fill="#4b5563">${lab.s||''}</text>`;
 return SVG(x0+w+ox+(kind==='box'?70:24),y0+h+42,s,lab.al||'立体の図');}

/* ---------- 表記の決まり D-12・D-16（2026-11-02 ジョブスの指示）----------
   移項と計算を1行でしている行（下かっこの中に \UR）は、移項した式の行（結果の下線）と計算の行（下かっこ）に分ける。
   計算の行には言葉を書かない。注の無い式の行が式の行のすぐ後ろに続くときは、空の区切り gsep を入れて、アプリが自動の注を付けたり下かっこを二重にしたりするのを止める */
const GS='<span class="gsep"></span>';
const mlineX=l=>(typeof l==='string'&&/^\\\(/.test(l)&&/\\\)$/.test(l)&&l.indexOf('\\(',2)<0)?l.slice(2,-2):null;
const topEq=t=>{if(t==null||/\\begin|\\mathrel/.test(t))return false;let d=0;for(const c of t){if(c==='{')d++;else if(c==='}')d--;else if(c==='='&&d===0)return true;}return false;};
const unUB=s=>{let i;while((i=s.indexOf('\\underbrace{'))>=0){let d=0,j=i+11,k=j;for(;k<s.length;k++){if(s[k]==='{')d++;else if(s[k]==='}'){d--;if(d===0)break;}}const l1=k+2;let d2=0,e=l1;for(;e<s.length;e++){if(s[e]==='{')d2++;else if(s[e]==='}'){d2--;if(d2===0)break;}}s=s.slice(0,i)+s.slice(j+1,k)+s.slice(e+1);}return s;};
const unUR=s=>{let p;do{p=s;s=s.replace(/\\UR\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g,'$1');}while(p!==s);return s;};
const ubUR=t=>/\\underbrace\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\\UR\{/.test(t);
function D16(w){const a=[];w.forEach(l=>{const t=mlineX(l);if(t!==null&&topEq(t)&&ubUR(t)){a.push(M(unUB(t)),GS,M(unUR(t)));}else a.push(l);});
 const out=[];let prevEq=false,note=false;
 a.forEach(l=>{if(typeof l!=='string'){out.push(l);prevEq=false;return;}
  if(l[0]==='&'){out.push(l);return;}
  if(l[0]==='>'){out.push(l);note=true;return;}
  const t=mlineX(l);const eq=t!==null&&topEq(t);
  if(eq&&prevEq&&!note&&out[out.length-1]!==GS)out.push(GS);
  out.push(l);prevEq=eq;note=false;});
 return out;}

/* ---------- 型ごとの解説（④と⑤で同じ形のもの） ---------- */
const sgn=(c,first)=>(c[0]<0?'-':(first?'':'+'));
const cf=c=>c[0]===c[1]?'':c[0]===-c[1]?'-':qt(c);
const T={};
/* k1(A)+k2(B)。A・B＝[x の係数, y の係数] */
T.poly=(C,k1,A,k2,B,fin)=>{k1=qq(k1);k2=qq(k2);const P=a=>fs([tm(a[0],'x'),tm(a[1],'y')].filter(t=>!qz(t.c)));
 const bt=[tm(B[0],'x'),tm(B[1],'y')].filter(t=>!qz(t.c));
 const k2s=k2[0]<0?qt(k2):'+'+qt(k2),lab=`両方に ×${k2[0]<0?'('+qt(k2).replace('-','−')+')':qt(k2)}`;
 const w=[M(`${cf(k1)}(${P(A)})${AF(lab,k2s)}(${bt.map((t,i)=>AT(ft(t,i===0))).join('')})`),BX.bunpai()];
 const pa=[tm(qm(k1,qq(A[0])),'x'),tm(qm(k1,qq(A[1])),'y')].filter(t=>!qz(t.c)),pb=[tm(qm(k2,qq(B[0])),'x'),tm(qm(k2,qq(B[1])),'y')].filter(t=>!qz(t.c));
 const sb=pb.map(t=>ft(t,false)).join('');
 push(w,'>分配法則でかっこをはずす',M(`=${fs(pa)}${UR(sb)}`));
 const xs=[...pa,...pb].filter(t=>t.v==='x'),ys=[...pa,...pb].filter(t=>t.v==='y');
 push(w,'>同類項を集める（項の順番を入れかえる）',M(`=${fs([...xs,...ys])}`));
 if(xs.length>1&&ys.length>1)push(w,BX.douri(xs.map(t=>M(ft(t,true))).join(' と '),ys.map(t=>M(ft(t,true))).join(' と ')));
 const ux=xs.length>1?U(fs(xs),kx(sum(xs),'x')):fs(xs),uy=ys.length>1?U(ys.map(t=>ft(t,false)).join(''),(sum(ys)[0]>=0?'+':'')+kx(sum(ys),'y')):ys.map(t=>ft(t,false)).join('');
 push(w,'>同類項をまとめる',M(`=${ux}${uy}`),fin);return w;};
/* 単項式の乗除 A ÷ B × C。[係数, x の次数, y の次数] */
const KM=(c,ex,ey)=>{const v=(ex===1?'x':ex>1?`x^{${ex}}`:'')+(ey===1?'y':ey>1?`y^{${ey}}`:'');if(v&&Math.abs(c)===1)return (c<0?'-':'')+v;return String(c)+v;};
const FAC=(c,ex,ey)=>[String(Math.abs(c)),...Array(ex).fill('x'),...Array(ey).fill('y')].filter(s=>s!=='1'||(ex+ey===0)).join(R`\times `);
T.mono=(C,A,B,Cc,fin)=>{const [a,ax,ay]=A,[b,bx,by]=B,[c,cx,cy]=Cc;const sB=KM(b,bx,by),dB=b<0?`(${sB})`:sB,dC=c<0?`(${KM(c,cx,cy)})`:KM(c,cx,cy);
 const den=KM(Math.abs(b),bx,by),inv=b<0?R`\left(-\dfrac{1}{${UR(den)}}\right)`:R`\dfrac{1}{${UR(den)}}`,inv0=b<0?R`\left(-\dfrac{1}{${den}}\right)`:R`\dfrac{1}{${den}}`;
 const neg=[a,b,c].filter(v=>v<0).length;
 const w=[M(`${KM(a,ax,ay)}\\div ${dB}\\times ${dC}`),'>わる式の逆数をかける（わり算をかけ算に直す）',M(`=${KM(a,ax,ay)}\\times ${inv}\\times ${dC}`),
  BOX(M(`\\div ${dB}=\\times ${inv0}`),'!わる式は逆数に。文字も分母へ'),
  `>マイナスが ${neg} 個なので、符号は ${neg%2?'−':'＋'}`,M(`=${neg%2?'-':''}\\dfrac{${FAC(a,ax,ay)}\\times ${FAC(c,cx,cy)}}{${FAC(b,bx,by)}}`),'>数どうし、文字どうしを約分する',fin];
 return w;};
/* 加減法：e＝[x の係数, y の係数, 右辺]。係数が同じ文字を ① − ② で消す */
T.kagen=(C,e1,e2,fin)=>{const [a1,b1,c1]=e1,[a2,b2,c2]=e2;const det=a1*b2-a2*b1,x0=(c1*b2-c2*b1)/det,y0=(a1*c2-a2*c1)/det;const elY=(b1===b2);
 const vv=elY?'x':'y',ot=elY?'y':'x',kv=elY?a1-a2:b1-b2,rv=c1-c2,v0=elY?x0:y0,w0=elY?y0:x0;
 const L1=[tm(a1,'x'),tm(b1,'y')].filter(t=>!qz(t.c)),L2=[tm(a2,'x'),tm(b2,'y')].filter(t=>!qz(t.c));const ng=ts=>ts.map(t=>tm(qn(t.c),t.v));
 const w=[M(`${fs(L1)}=${c1}\\quad\\text{…①}`),M(`${fs(L2)}=${c2}\\quad\\text{…②}`)];
 push(w,...KAGEN(C,`① と ② は、\\(${ot}\\) の係数がどちらも ${qw(elY?b1:a1)}。① − ② で \\(${ot}\\) を消す`,`${fs(L2)}=${c2}`,`${fs(ng(L2))}=${-c2}`,'②'));
 push(w,M(R`\begin{array}{rrcl}&${fs(L1)}&=&${c1}\\+)&${UR(fs(ng(L2)))}&=&${UR(String(-c2))}\\\hline&${kx(kv,vv)}&=&${rv}\end{array}`));
 if(kv!==1)push(w,`>両辺を \\(${vv}\\) の係数 ${qw(kv)} でわる`,M(`${vv}=${v0}`));
 /* ② に代入 */
 const kn=elY?a2:b2,ko=elY?b2:a2;const sv=qq(v0);
 const vt=(kn===1)?'+'+UA(qp(sv)):(kn===-1)?'-'+UA(qp(sv)):null;
 const otT=tm(ko,ot);
 const subT=(first)=>{if(vt)return first?vt.replace(/^\+/,''):vt;return (first?'':(kn*v0>=0?'+':''))+U(`${qt(kn)}\\times ${UA(qp(sv))}`,qt(kn*v0));};
 const origL=elY?[{t:(kn===1?'':kn===-1?'-':qt(kn))+UA('x')},{t:ft(otT,false)}]:[{t:ft(otT,true)},{t:(kn===1?'+':kn===-1?'-':(kn>0?'+':'')+qt(kn))+UA('y')}];
 push(w,M(`${origL.map(o=>o.t).join('')}=${c2}\\quad\\text{…②}`));
 const subL=elY?`${subT(true)}${ft(otT,false)}`:`${ft(otT,true)}${subT(false)}`;
 const plain=elY?[tm(kn*v0),otT]:[otT,tm(kn*v0)];
 const simple=!/underbrace|\(/.test(subL);
 const note=`\\(${vv}\\) に ${qw(v0)} を代入する`;const dai=DAI(C,`${origL.map(o=>o.t).join('')}=${c2}`,`${subL}=${c2}`,v0<0);
 let r;
 if(simple){const sl=elY?[{c:Q(kn*v0),v:'',t:subT(true)},otT]:[otT,{c:Q(kn*v0),v:'',t:subT(false)}];r=SOLVE(C,sl,[tm(c2)],ot,{note,after:[dai]});}
 else{push(w,'>'+note,M(`${subL}=${c2}`),dai);r=SOLVE(C,plain,[tm(c2)],ot,{});}
 push(w,...r.w,fin);return w;};
/* 2直線の交点：y＝p1x＋q1 …①、y＝p2x＋q2 …② */
T.cross=(C,p1,q1,p2,q2,intro,fin)=>{const E=(p,q)=>fs([tm(p,'x'),tm(q)].filter(t=>!qz(t.c)));
 const w=[intro,M(`y=${E(p1,q1)}\\quad\\text{…①}`),M(`y=${E(p2,q2)}\\quad\\text{…②}`),M(`${UA('y')}=${E(p2,q2)}\\quad\\text{…②}`)];
 const L=[tm(p1,'x'),tm(q1)].filter(t=>!qz(t.c)),Rr=[tm(p2,'x'),tm(q2)].filter(t=>!qz(t.c));
 const r=SOLVE(C,L,Rr,'x',{note:`① の右辺 \\(${E(p1,q1)}\\) を、② の \\(y\\) に代入する`,wL:UA,after:[DAI(C,`${UA('y')}=${E(p2,q2)}`,`${UA(E(p1,q1))}=${E(p2,q2)}`,false)]});
 push(w,...r.w);const e=EVAL(C,'y',L,{x:[r.x,UA]},{tag:R`\quad\text{…①}`});push(w,...e.w,fin);return w;};
/* 分数の形の式の加減 A/p ± B/q */
T.fpoly=(C,A,p,sg,B,q2,fin)=>{const L=p*q2/gcd(p,q2),m=L/p,mq=L/q2,n=mq*sg;const KXY=a=>fs([tm(a[0],'x'),tm(a[1],'y')].filter(t=>!qz(t.c)));
 const op=sg>0?'+':'-',w=[M(`\\dfrac{${KXY(A)}}{${p}}${op}\\dfrac{${KXY(B)}}{${q2}}`),`>分母を ${p} と ${q2} の最小公倍数 ${L} にそろえる（通分）`,M(`=\\dfrac{${m}(${KXY(A)})}{${L}}${op}\\dfrac{${mq}(${KXY(B)})}{${L}}`)];
 const bt=[tm(B[0],'x'),tm(B[1],'y')].filter(t=>!qz(t.c));const lab=`両方に ×${n<0?'(−'+(-n)+')':n}`;
 push(w,'>1つの分数にまとめる。分子はかっこのまま書く',M(`=\\dfrac{${m}(${KXY(A)})${AF(lab,(n<0?'-':'+')+Math.abs(n))}(${bt.map((t,i)=>AT(ft(t,i===0))).join('')})}{${L}}`));
 if(sg<0)push(w,BOX(M(`-\\dfrac{${mq}(${KXY(B)})}{${L}}=\\dfrac{${UR('-'+mq)}(${KXY(B)})}{${L}}`),'!ひく式は、うしろの分子の全部の項の符号が変わる'));
 push(w,BX.bunpai());
 const pa=[tm(m*A[0],'x'),tm(m*A[1],'y')].filter(t=>!qz(t.c)),pb=[tm(n*B[0],'x'),tm(n*B[1],'y')].filter(t=>!qz(t.c));
 push(w,'>分配法則でかっこをはずす',M(`=\\dfrac{${fs(pa)}${UR(pb.map(t=>ft(t,false)).join(''))}}{${L}}`));
 const xs=[...pa,...pb].filter(t=>t.v==='x'),ys=[...pa,...pb].filter(t=>t.v==='y');
 push(w,'>同類項を集める（項の順番を入れかえる）',M(`=\\dfrac{${fs([...xs,...ys])}}{${L}}`));
 const ux=xs.length>1?U(fs(xs),kx(sum(xs),'x')):fs(xs),uy=ys.length>1?U(ys.map(t=>ft(t,false)).join(''),(sum(ys)[0]>=0?'+':'')+kx(sum(ys),'y')):ys.map(t=>ft(t,false)).join('');
 push(w,'>同類項をまとめる',M(`=\\dfrac{${ux}${uy}}{${L}}`),fin);return w;};

return {D16,GS,T,R,Q,qa,qs,qm,qd,qn,qz,qi,qv,qt,qp,qw,M,U,UA,UB,UC,UD,UR,UL,AF,AT,TX,BOX,BX,DAI,once,push,tm,ft,fs,kx,sum,SOLVE,EVAL,AB,KAGEN,TAPE,ROUTE,TBL,HGR,NLINE,PRISM,SVG,gcd,nr};
})();
const {SOLVE,EVAL,DAI,BX,KAGEN,tm,UA,UR,AF,AT,push,BOX,TBL,ROUTE,NLINE}=XW;
const CL=a=>XW.D16(a.filter(x=>x!=null&&x!==''));

/* ---------- 数の書き方 ---------- */
const nr=v=>Math.round(v*1e6)/1e6;
const N=v=>String(nr(v));                       /* 式の中の数（負は -） */
const T=v=>String(nr(v)).replace(/^-/,'−');     /* 文の中の数（負は −） */
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
/* 分数 n/d を KaTeX で（整数ならそのまま） */
const FR=(n,d)=>{if(d<0){n=-n;d=-d;}const g=gcd(n,d)||1;n/=g;d/=g;if(d===1)return String(n);return (n<0?'-':'')+R`\dfrac{${Math.abs(n)}}{${d}}`;};
/* y=ax+b の形 */
const EQ=(a,b,v)=>{v=v||'x';let s=a===0?'':(a===1?v:a===-1?'-'+v:N(a)+v);if(b!==0||s==='')s+=(s&&b>0?'+':'')+(b<0?'-'+N(-b):(s&&b===0?'':N(b)));return 'y='+s;};
const M=s=>R`\(${s}\)`;
/* 下かっこ */
const U=(t,b)=>R`\underbrace{${t}}_{\color{#c2410c}{${b}}}`;
/* 時刻：ampm＝'午前'/'午後'、h＝時、m＝分（足していく） */
const TM=(ap,h,m)=>{const t=h*60+Math.round(m);const hh=Math.floor(t/60),mm=t%60;return ap+hh+'時'+(mm?mm+'分':'');};
/* まちがいの選択肢：正解と同じ・同じものどうしを外して5つ */
const I=(v,s)=>Number.isInteger(nr(v))?s:null;
const D2=(v,t)=>Number.isInteger(nr(v*100))?t:null;
/* 方眼の目もり：横は5分ごと・数字は10分ごと。たては 100 m ごと（2000 m をこえて全部 200 の倍数なら 200 m ごと）・数字は5目もりごと */
const AX=(X,ys)=>{const top=Math.max(...ys);const s=(top>2000&&ys.every(v=>v%200===0))?200:(ys.every(v=>v%100===0)?100:50);const yt=s*5;return {xmax:Math.ceil((X+1)/10)*10,xs:5,xt:10,ymax:Math.ceil((top+1)/yt)*yt,ys:s,yt};};
const PICK=(ok,cands)=>{const out=[];cands.forEach(c=>{if(c!==ok&&!out.includes(c)&&c!=null)out.push(c);});if(out.length<5)throw new Error('まちがいの選択肢が5つない '+ok+' / '+cands.join(' | '));return out.slice(0,5);};

/* ---------- グラフ（第1象限・方眼）。sm:true は選択肢の小さいグラフ ---------- */
function GQ(o){const sm=!!o.sm,nx=o.xmax/o.xs,ny=o.ymax/o.ys;
 let csx,csy,L,B,Tp,Rm;
 if(sm){L=30;B=20;Tp=18;Rm=14;csx=150/nx;csy=150/ny;}else{L=48;B=28;Tp=24;Rm=58;csx=230/nx;csy=Math.min(Math.max(170/ny,7),csx*1.6);}
 const PW=nx*csx,PH=ny*csy,W=L+PW+Rm,H=Tp+PH+B,K=sm?1.25:1;
 const X=x=>L+x/o.xs*csx,Y=y=>Tp+PH-y/o.ys*csy;
 const w=o.w||(sm?150:280);
 let s=`<svg class="${sm?'gch':'gr'}" viewBox="0 0 ${W} ${H}" width="${w}" height="${nr(w*H/W)}">`;
 for(let i=0;i<=nx;i++)s+=`<line x1="${X(i*o.xs)}" y1="${Tp}" x2="${X(i*o.xs)}" y2="${Tp+PH}" stroke="#d1d5db" stroke-width="1"/>`;
 for(let j=0;j<=ny;j++)s+=`<line x1="${L}" y1="${Y(j*o.ys)}" x2="${L+PW}" y2="${Y(j*o.ys)}" stroke="#d1d5db" stroke-width="1"/>`;
 s+=`<line x1="${L}" y1="${Tp+PH}" x2="${L+PW+(sm?6:10)}" y2="${Tp+PH}" stroke="#111" stroke-width="1.6"/><line x1="${L}" y1="${Tp+PH}" x2="${L}" y2="${Tp-(sm?4:8)}" stroke="#111" stroke-width="1.6"/>`;
 for(let v=o.xt;v<=o.xmax+1e-9;v+=o.xt)s+=`<text x="${X(v)}" y="${Tp+PH+13*K}" font-size="${11*K}" text-anchor="middle" fill="#333">${T(v)}</text>`;
 for(let v=o.yt;v<=o.ymax+1e-9;v+=o.yt)s+=`<text x="${L-4}" y="${Y(v)+4*K}" font-size="${11*K}" text-anchor="end" fill="#333">${T(v)}</text>`;
 s+=`<text x="${L-4}" y="${Tp+PH+13*K}" font-size="${11*K}" text-anchor="end">O</text>`;
 if(sm)s+=`<text x="${L+PW+2}" y="${Tp+PH-4}" font-size="${12*K}" font-style="italic" text-anchor="end">x</text><text x="${L+5}" y="${Tp-4}" font-size="${12*K}" font-style="italic">y</text>`;
 else s+=`<text x="${L+PW+14}" y="${Tp+PH+4}" font-size="12"><tspan font-style="italic">x</tspan>（${o.xu||''}）</text><text x="${L+6}" y="${Tp-8}" font-size="12"><tspan font-style="italic">y</tspan>（${o.yu||''}）</text>`;
 (o.hl||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#c2410c" stroke-width="7" stroke-opacity=".45"/>`;});
 (o.dsh||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#c2410c" stroke-width="1.6" stroke-dasharray="4 3"/>`;});
 (o.polys||[]).forEach(p=>{const pts=p[0],d=p[1];s+=`<polyline points="${pts.map(q=>X(q[0])+','+Y(q[1])).join(' ')}" fill="none" stroke="#111" stroke-width="${sm?3:2.4}" stroke-linejoin="round" ${d?'stroke-dasharray="7 4"':''}/>`;});
 (o.pts||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="${sm?3.5:4}" fill="#111"/>`;});
 (o.rings||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="9" fill="none" stroke="#c2410c" stroke-width="2.2"/>`;});
 (o.labs||[]).forEach(q=>{const [x,y,t,an,dx,dy,red]=q;s+=`<text x="${X(x)+(dx||0)}" y="${Y(y)+(dy||0)}" text-anchor="${an||'start'}" font-size="12" font-weight="700" ${red?'fill="#c2410c"':''} ${SH}>${t}</text>`;});
 return s+'</svg>';}

/* ---------- 長方形 ABCD と点 P（P は A→B→C→D を s cm 進んだ所）。ct2.js の RECTP と同じ形 ---------- */
const TWD=t=>[...String(t)].reduce((a,c)=>a+(c.charCodeAt(0)>255?12.5:7),0);
function RECT(AD,AB,s,o){o=o||{};const k=Math.min(110/AD,110/AB),Wd=AD*k,Hd=AB*k;let L1=(o.seg&&s<=AB)?36+TWD(o.seg):30,R1=(o.seg&&s>AB+AD)?36+TWD(o.seg):40;
 const need=Math.max(o.ad?TWD(o.ad)+40:0,o.path?Math.max(...o.path.split('|').map(TWD))+16:0);if(L1+Wd+R1<need){const e=need-(L1+Wd+R1);L1+=e/2;R1+=e/2;}
 const x0=L1,y0=o.ad?38:(o.dims?26:20);let px,py;
 if(s<=AB){px=x0;py=y0+s*k;}else if(s<=AB+AD){px=x0+(s-AB)*k;py=y0+Hd;}else{px=x0+Wd;py=y0+Hd-(s-AB-AD)*k;}
 const W=Wd+L1+R1,H=Hd+y0+(o.path?58:30),ww=Math.min(Math.max(o.w||150,W),330);
 let t=`<svg viewBox="0 0 ${nr(W)} ${nr(H)}" width="${nr(ww)}" height="${nr(ww*H/W)}"><defs><pattern id="rp${o.id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#d97706" stroke-width="2"/></pattern></defs>`;
 if(s>0&&s<AB+AD+AB)t+=`<polygon points="${x0},${y0} ${px},${py} ${x0+Wd},${y0}" fill="url(#rp${o.id})" stroke="#111" stroke-width="1.4"/>`;
 t+=`<rect x="${x0}" y="${y0}" width="${Wd}" height="${Hd}" fill="none" stroke="#111" stroke-width="2"/>`;
 t+=`<text x="${x0-6}" y="${y0-4}" text-anchor="end" font-size="13" font-weight="700">A</text><text x="${x0-6}" y="${y0+Hd+14}" text-anchor="end" font-size="13" font-weight="700">B</text><text x="${x0+Wd+6}" y="${y0+Hd+14}" font-size="13" font-weight="700">C</text><text x="${x0+Wd+6}" y="${y0-4}" font-size="13" font-weight="700">D</text>`;
 if(o.dims||o.ad){const lw=TWD(o.ad||AD+' cm'),lx=Math.min(Math.max(x0+Wd/2,lw/2+4),W-lw/2-4);t+=`<text x="${lx}" y="${o.ad?y0-20:y0-7}" text-anchor="middle" font-size="12" font-weight="700">${o.ad||AD+' cm'}</text>`;}
 if(o.dims)t+=`<text x="${x0+Wd+6}" y="${y0+Hd/2+4}" font-size="12">${AB} cm</text>`;
 if(o.seg){const c='#c2410c';if(s<=AB){const bx=x0-24;t+=`<line x1="${bx}" y1="${y0}" x2="${bx}" y2="${py}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${y0}" x2="${bx+4}" y2="${y0}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${py}" x2="${bx+4}" y2="${py}" stroke="${c}" stroke-width="1.6"/><text x="${bx-5}" y="${(y0+py)/2+4}" text-anchor="end" font-size="12" font-weight="700" fill="${c}" ${SH}>${o.seg}</text>`;}
  else if(s>AB+AD){const bx=x0+Wd+22;t+=`<line x1="${bx}" y1="${y0}" x2="${bx}" y2="${py}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${y0}" x2="${bx+4}" y2="${y0}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${py}" x2="${bx+4}" y2="${py}" stroke="${c}" stroke-width="1.6"/><text x="${bx+5}" y="${(y0+py)/2+4}" font-size="12" font-weight="700" fill="${c}" ${SH}>${o.seg}</text>`;}}
 if(o.path){const c='#c2410c',pts=[[x0,y0]];if(s>AB)pts.push([x0,y0+Hd]);if(s>AB+AD)pts.push([x0+Wd,y0+Hd]);pts.push([px,py]);
  t+=`<polyline points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="6" stroke-opacity=".45" stroke-linejoin="round"/>`;
  o.path.split('|').forEach((pl,i)=>{t+=`<text x="${W/2}" y="${y0+Hd+30+i*15}" text-anchor="middle" font-size="12" font-weight="700" fill="${c}" ${SH}>${pl}</text>`;});}
 if(s<AB+AD+AB||o.showP)t+=`<circle cx="${px}" cy="${py}" r="4.5" fill="#c2410c"/><text x="${px+(s<=AB?-8:8)}" y="${py+(s<=AB?4:(s<=AB+AD?16:4))}" text-anchor="${s<=AB?'end':'start'}" font-size="13" font-weight="700" fill="#c2410c" ${SH}>P</text>`;
 return t+'</svg>';}

/* ---------- 直角三角形 ABC（∠C＝90°。B 左下・C 右下・A は C の真上）と点 P（B→C→A を s cm 進んだ所）。△ABP に斜線 ---------- */
function TRI(BC,CA,s,o){o=o||{};const k=Math.min(150/BC,120/CA),Wb=BC*k,Hc=CA*k,x0=30,y0=24;const R1=o.seg?44+TWD(o.seg):46;const W=x0+Wb+R1,H=y0+Hc+(o.path?60:34);
 const B=[x0,y0+Hc],C=[x0+Wb,y0+Hc],A=[x0+Wb,y0];let P;if(s<=BC)P=[x0+s*k,y0+Hc];else P=[x0+Wb,y0+Hc-(s-BC)*k];
 const ww=Math.min(Math.max(o.w||200,W),330);
 let t=`<svg viewBox="0 0 ${nr(W)} ${nr(H)}" width="${nr(ww)}" height="${nr(ww*H/W)}"><defs><pattern id="tp${o.id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#d97706" stroke-width="2"/></pattern></defs>`;
 if(s>0&&s<BC+CA)t+=`<polygon points="${A.join(',')} ${B.join(',')} ${P.join(',')}" fill="url(#tp${o.id})" stroke="#111" stroke-width="1.4"/>`;
 t+=`<polygon points="${A.join(',')} ${B.join(',')} ${C.join(',')}" fill="none" stroke="#111" stroke-width="2"/>`;
 t+=`<polyline points="${C[0]-10},${C[1]} ${C[0]-10},${C[1]-10} ${C[0]},${C[1]-10}" fill="none" stroke="#111" stroke-width="1.2"/>`;
 t+=`<text x="${A[0]+6}" y="${A[1]+4}" font-size="13" font-weight="700">A</text><text x="${B[0]-6}" y="${B[1]+5}" text-anchor="end" font-size="13" font-weight="700">B</text><text x="${C[0]+6}" y="${C[1]+12}" font-size="13" font-weight="700">C</text>`;
 if(o.dims){t+=`<text x="${x0+Wb/2}" y="${y0+Hc+(o.path?44:26)}" text-anchor="middle" font-size="12" font-weight="700">${BC} cm</text><text x="${C[0]+8}" y="${y0+Hc/2+4}" font-size="12" font-weight="700">${CA} cm</text>`;}
 if(o.seg&&s>BC){const c='#c2410c',bx=C[0]+26;t+=`<line x1="${bx}" y1="${A[1]}" x2="${bx}" y2="${P[1]}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${A[1]}" x2="${bx+4}" y2="${A[1]}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${P[1]}" x2="${bx+4}" y2="${P[1]}" stroke="${c}" stroke-width="1.6"/><text x="${bx+5}" y="${(A[1]+P[1])/2+4}" font-size="12" font-weight="700" fill="${c}" ${SH}>${o.seg}</text>`;}
 if(o.path!==undefined){const c='#c2410c',pts=[B];if(s>BC)pts.push(C);pts.push(P);t+=`<polyline points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="6" stroke-opacity=".45" stroke-linejoin="round"/>`;
  o.path.split('|').filter(Boolean).forEach((pl,i)=>{t+=`<text x="${x0+Wb/2}" y="${y0+Hc+20+i*15}" text-anchor="middle" font-size="12" font-weight="700" fill="${c}" ${SH}>${pl}</text>`;});}
 t+=`<circle cx="${P[0]}" cy="${P[1]}" r="4.5" fill="#c2410c"/><text x="${P[0]+(s<=BC?0:-8)}" y="${P[1]+(s<=BC?-8:4)}" text-anchor="${s<=BC?'middle':'end'}" font-size="13" font-weight="700" fill="#c2410c" ${SH}>P</text>`;
 return t+'</svg>';}

const G=s=>'<div class="grq">'+s+'</div>';
const AREA='三角形の面積 ＝ 底辺 × 高さ ÷ 2';
const RATEA=R`\(a=\dfrac{y\text{ の増加量}}{x\text{ の増加量}}\)`;
const SPD='速さ ＝ 道のり ÷ 時間';

/* ===== a1 速さ・道のり・時間 ===== k:'d'（道のり）・'t'（時間）・'v'（速さ） */
function dist(o){const {k,v,t,d}=o;let q,ok,c,w;
 if(k==='d'){const ans=v*t;q=`${o.txt||''}分速 ${v} m で ${t} 分間歩いたときに進む道のりは何 m か求めなさい。`;ok=`${ans} m`;
  c=PICK(ok,[`${ans*10} m`,`${nr(ans/10)} m`,`${v+t} m`,`${nr(v*t/60)} m`,`${ans+v} m`,`${ans-v} m`]);
  w=['道のり ＝ 速さ × 時間',`>分速 ${v} m は「1分間に ${v} m 進む」こと。${t} 分間では ${v} m の ${t} つ分`,M(R`\text{道のり}=${U(`${v}\\times ${t}`,ans)}`),M(R`\text{道のり}=${ans}`),`答え　${ans} m`,`#「${v}＋${t}」とたすと ${v+t} m になる。速さ × 時間 でかける`];}
 else if(k==='t'){const ans=d/v;q=`${o.txt||''}${d} m の道のりを、分速 ${v} m で歩くと何分かかるか求めなさい。`;ok=`${T(ans)} 分`;
  c=PICK(ok,[`${T(v/d*60)} 分`,`${T(d*v)} 分`,`${T(ans*60)} 分`,`${T(ans/2)} 分`,`${T(ans+5)} 分`,`${T(ans-5)} 分`,`${T(ans*10)} 分`]);
  w=['時間 ＝ 道のり ÷ 速さ',`>分速 ${v} m は「1分間に ${v} m 進む」こと。${d} m の中に ${v} m がいくつあるかを考える`,M(R`\text{時間}=${U(`${d}\\div ${v}`,T(ans))}`),M(R`\text{時間}=${N(ans)}`),`答え　${T(ans)} 分`,`#${d}×${v} とかけると ${T(d*v)} になる。時間は 道のり ÷ 速さ`];}
 else {const ans=d/t;q=`${o.txt||''}${d} m の道のりを ${t} 分間で歩いたときの速さは、分速何 m か求めなさい。`;ok=`分速 ${T(ans)} m`;
  c=PICK(ok,[`分速 ${T(d*t)} m`,`分速 ${FRT(t,d)} m`,`分速 ${T(ans*60)} m`,`分速 ${T(ans/2)} m`,`分速 ${T(ans*2)} m`,`分速 ${T(d-t)} m`]);
  w=[SPD,`>分速は「1分間に進む道のり」。${t} 分間で ${d} m なので、${d} を ${t} でわる`,M(R`\text{速さ}=${U(`${d}\\div ${t}`,T(ans))}`),M(R`\text{速さ}=${N(ans)}`),`答え　分速 ${T(ans)} m`,`#わる順を逆にして ${t}÷${d} とすると、とても小さい数になる。道のり ÷ 時間`];}
 return {ty:o.ty||'a1',g:o.g||'a1',gh:'次の問いに答えなさい。',q,c:C6(ok,c,o.p),w,chk:{t:'dist',k,v,tm:t,d,ans:ok}};}
const FRT=(n,d)=>{const g=gcd(n,d);return M(R`\dfrac{${n/g}}{${d/g}}`);};

/* ===== a2 連立方程式（代入法）：y＝px＋q …①、ax＋by＝c …② ===== */
function subst(o){const {m:p,q,a,b,c:cc}=o;const k=a+b*p,r=cc-b*q;const x=r/k,y=p*x+q;if(!Number.isInteger(x)||!Number.isInteger(y))throw new Error('subst');
 const S=(X,Y)=>M(R`x=${X},\ y=${Y}`);const ok=S(N(x),N(y));
 /* まちがい：b を q にかけ忘れる（k x ＝ c − q） */
 const x2n=cc-q,y2n=p*(cc-q)+q*k;
 const c=PICK(ok,[S(FR(x2n,k),FR(y2n,k)),S(N(y),N(x)),S(N(x),N(-y)),S(N(-x),N(p*(-x)+q)),S(N(x),N(p*x-q)),S(N(x+1),N(p*(x+1)+q))]);
 const E2=(A,B)=>{let s=(A===1?'':A===-1?'-':N(A))+'x';s+=(B<0?'-':'+')+(Math.abs(B)===1?'':N(Math.abs(B)))+'y';return s;};
 const qq=q<0?`-${N(-q)}`:`+${N(q)}`;const bp=b*p,bq=b*q;
 const inner=`${p===1?'':p===-1?'-':N(p)}x${qq}`;
 /* 解説（決まり 1・2・3・8・12） */
 const C={};const ax=a===1?'':a===-1?'-':N(a);const bs=b<0?'-':'+',ba=Math.abs(b)===1?'':N(Math.abs(b));
 const oL=R`${ax}x${bs}${ba}\UA{y}`,lab=`両方に ×${b<0?'(−'+(-b)+')':b}`;
 const mul=b===1?'+':b>0?'+'+AF(lab,N(b)):AF(lab,b===-1?'-':N(b));
 const inT=(p===1?'':p===-1?'-':N(p))+'x';
 const w=[M(R`${EQ(p,q)}\quad\text{…①}`),M(R`${E2(a,b)}=${N(cc)}\quad\text{…②}`),'>① を ② の \\(y\\) に代入して、\\(y\\) を消す（代入法）',BX.dainyuho(),M(R`${oL}=${N(cc)}\quad\text{…②}`),
  `>\\(y\\) に \\(${inner}\\) を、かっこをつけて代入する`,M(R`${ax}x${mul}\UA{(${AT(inT)}${AT(qq)})}=${N(cc)}`),
  DAI(C,`${oL}=${N(cc)}`,R`${ax}x${bs}${ba}\UA{(${inner})}=${N(cc)}`,false,true),BX.bunpai(),
  '>分配法則でかっこをはずす',M(R`${ax}x${UR(`${bp<0?'-':'+'}${Math.abs(bp)===1?'':N(Math.abs(bp))}x${bq<0?'-':'+'}${N(Math.abs(bq))}`)}=${N(cc)}`),
  '>同類項をまとめる',M(R`${U(`${ax}x${bp<0?'-':'+'}${Math.abs(bp)===1?'':N(Math.abs(bp))}x`,`${k===1?'':k===-1?'-':N(k)}x`)}${bq<0?'-':'+'}${N(Math.abs(bq))}=${N(cc)}`)];
 push(w,...SOLVE(C,[tm(k,'x'),tm(bq)],[tm(cc)],'x',{}).w);
 push(w,...EVAL(C,'y',[tm(p,'x'),tm(q)].filter(t=>t.c[0]!==0),{x:[x,UA]},{origNote:'\\(y\\) を求める。① の式を書く',tag:R`\quad\text{…①}`}).w,M(R`x=${N(x)},\ y=${N(y)}`),
  `#かっこをはずすとき、${T(q)} にも ${T(b)} をかける。かけ忘れると ${M(R`x=${FR(x2n,k)}`)} のようになる`);
 return {ty:o.ty||'a2',g:o.g||'a2',gh:'次の連立方程式を解きなさい。',q:M(R`\begin{cases}${EQ(p,q)}\\${E2(a,b)}=${N(cc)}\end{cases}`),c:C6(ok,c,o.p),w:CL(w),chk:{t:'subst',p,q,a,b,c:cc,ans:[x,y]}};}
/* ===== a3 文章から式（線香・ろうそく・水そう） ===== s：+1 増える／−1 減る */
function bun(o){const {b0,r,s}=o;const ok=M(EQ(s*r,b0));
 const c=PICK(ok,[M(EQ(-s*r,b0)),M(EQ(b0,s*r)),M(EQ(s*r,0)),M(EQ(s*b0,r)),M(EQ(s*r*10,b0)),M(EQ(s*r,-b0))]);
 const C={},sg=s<0?'-':'+',ch=o.chg;
 const fc=R`\text{${ch}}=\UA{\text{1分間に${o.unitw}}}\times\UB{\text{時間}}`,sc=R`\text{${ch}}=\UA{${N(r)}}\times\UB{x}`;
 const fy=R`y=\UA{\text{初めの${o.what}}}${sg}\UB{\text{${ch}}}`,sy=R`y=\UA{${N(b0)}}${sg}\UB{${N(r)}x}`;
 const w=[BOX(TBL([['時間（分）','1','2',M('x')],[`${ch}（${o.u}）`,T(r),M(`${N(r)}\\times 2`),M(`${N(r)}\\times x`)]]),`!${ch} ＝ 1分間に${o.unitw} × 時間`),
  `${o.what} ＝ 初めの${o.what} ${s<0?'−':'＋'} ${ch}`,`${ch} ＝ 1分間に${o.unitw} × 時間`,M(fc),'>代入する',M(R`\text{${ch}}=${U(R`\UA{${N(r)}}\times\UB{x}`,`${N(r)}x`)}`),DAI(C,fc,sc,false),M(R`\text{${ch}}=${N(r)}x`),
  `>\\(y\\) が${o.what}`,M(fy),'>代入する',M(sy),'>\\(x\\) の項を前に書く（項の順番を入れかえる）',M(EQ(s*r,b0)),
  s<0?`#${o.verb2}ので、\\(x\\) の係数はマイナス。\\(y=${N(r)}x+${N(b0)}\\) ではない`:`#初めの ${T(b0)} ${o.u}を入れ忘れると \\(y=${N(r)}x\\) になる`];
 return {ty:o.ty||'a3',g:o.g||'a3',gh:'次の問いに答えなさい。',q:o.q,c:C6(ok,c,o.p),w:CL(w),chk:{t:'bun',b0,r,s,ans:[s*r,b0]}};}
/* ===== a4・a5 道のりのグラフ（1本）と、後から追いかける人 ===== */
function walk(o){const {who,ap,h,dest,T1,D}=o;const ax=o.ax||AX(T1,[D]);const w0=D/T1;const L=o.later;const xm=L.u*L.dl/(L.u-w0),ym=w0*xm;
 const ctx=`${who}は${ap}${h}時に家を出発し、一定の速さで歩いて${dest}へ向かった。下のグラフは、${who}が家を出発してから \\(x\\) 分後に家から \\(y\\) m はなれた所にいるとして、\\(x\\) と \\(y\\) の関係を表したものである。`;
 const fig=GQ({...ax,xu:'分',yu:'m',polys:[[[[0,0],[T1,D]]]],pts:[[T1,D]]});
 const fig1=GQ({...ax,xu:'分',yu:'m',polys:[[[[0,0],[T1,D]]]],pts:[[T1,D]],rings:[[T1,D]],dsh:[[T1,0,T1,D],[0,D,T1,D]],labs:[[T1,D,`(${T1}, ${D})`,'end',-12,-8,1]]});
 const xe=L.dl+D/L.u;
 const fig2=GQ({...ax,xu:'分',yu:'m',polys:[[[[0,0],[T1,D]]],[[[L.dl,0],[Math.min(xe,ax.xmax),L.u*(Math.min(xe,ax.xmax)-L.dl)]],1]],pts:[[L.dl,0]],rings:[[xm,ym]],labs:[[xm,ym,'追いつく','end',-12,-6,1],[L.dl,0,`(${L.dl}, 0)`,'start',6,-6,1]]});
 /* a4 速さ */
 const ok4=`分速 ${T(w0)} m`;
 const c4=PICK(ok4,[I(D/(T1+ax.xs),`分速 ${T(D/(T1+ax.xs))} m`),I(D/(T1-ax.xs),`分速 ${T(D/(T1-ax.xs))} m`),`分速 ${T(D)} m`,`分速 ${T(w0/10)} m`,`分速 ${T(w0*10)} m`,`分速 ${FRT(T1,D)} m`,`分速 ${T(w0*2)} m`,I(w0/2,`分速 ${T(w0/2)} m`),`分速 ${T1} m`]);
 const w4=[fig1,...SPEED({},{from:'家',to:dest,D,T1,v:w0,note:`グラフから、${T1} 分で ${D} m 進んでいる（点 \\((${T1},\\ ${D})\\)）`}),`答え　分速 ${T(w0)} m`,`>この速さは、グラフの傾き（1分間に \\(y\\) が増える量）と同じ`,(c4.includes(I(D/(T1+ax.xs),`分速 ${T(D/(T1+ax.xs))} m`))?`#グラフの終わりを ${T1+ax.xs} 分と読むと ${D}÷${T1+ax.xs} で分速 ${T(D/(T1+ax.xs))} m になる。横の1目もりは ${ax.xs} 分なので、終わりは ${T1} 分`:c4.includes(I(D/(T1-ax.xs),`分速 ${T(D/(T1-ax.xs))} m`))?`#グラフの終わりを ${T1-ax.xs} 分と読むと ${D}÷${T1-ax.xs} で分速 ${T(D/(T1-ax.xs))} m になる。横の1目もりは ${ax.xs} 分なので、終わりは ${T1} 分`:`#グラフから読んだ ${D} m をそのまま速さにすると分速 ${T(D)} m になる。速さ ＝ 道のり ÷ 時間 なので、${T1} 分でわる`)];
 const s4={ty:o.ty4||'a4',s:`${who}の歩く速さは、分速何 m か求めなさい。`,c:C6(ok4,c4,o.p4),w:CL(w4),chk:{t:'walk4',T1,D,ans:w0}};
 /* a5 追いつく時刻 */
 const ok5=TM(ap,h,xm);const b2=-L.u*L.dl;const kx=w0-L.u;
 const c5=PICK(ok5,[TM(ap,h,xm+L.dl),TM(ap,h,L.dl),TM(ap,h,T1),TM(ap,h,xm-L.dl>0?xm-L.dl:xm+2*L.dl),I(L.u*L.dl/(L.u+w0),TM(ap,h,L.u*L.dl/(L.u+w0))),TM(ap,h,xm+5),TM(ap,h,xm-1),TM(ap,h,xm+10),TM(ap,h,xm*2),TM(ap,h,T1+L.dl),TM(ap,h,xm+1)]);
 const C={};
 const w5=[fig2,'追いつく所 ＝ 2つのグラフの交点。2つの直線の式を連立方程式にして解く',`${who}の式`,`>原点を通る直線。傾き ＝ 速さ ＝ 分速 ${T(w0)}`,M(R`y=${N(w0)}x\quad\text{…①}`),
  `${L.who}の式`,...LATER(C,{u:L.u,s:L.dl,lab:'②'}),
  ...MEET(C,{l:[tm(w0,'x')],r:[tm(L.u,'x'),tm(b2)],rt:`${L.u}x-${L.u*L.dl}`,lt:`${N(w0)}x`}),
  `${who}が家を出発してから ${T(xm)} 分後。${ap}${h}時の ${T(xm)} 分後なので`,`答え　${ok5}`,`#${L.who}が出発してからの時間（${T(xm-L.dl)} 分）ではない。\\(x\\) は${who}が家を出てからの時間なので、${ap}${h}時に ${T(xm)} 分をたす`];
 const s5={ty:o.ty5||'a5',s:`${who}が家を出発してから ${L.dl} 分後に、${L.who}が${L.how}分速 ${L.u} m で家を出発し、同じ道を${dest}へ向かった。${L.who}が ${who}に追いつく時刻を求めなさい。`,c:C6(ok5,c5,o.p5),w:CL(w5),chk:{t:'walk5',T1,D,dl:L.dl,u:L.u,h,ans:xm}};
 return {ctx,fig,s4,s5};}
/* 速さ ＝ 道のり ÷ 時間（線分図のボックスつき） */
function SPEED(C,o){const f=R`\text{速さ}=\UA{\text{道のり}}\div\UB{\text{時間}}`,s=R`\text{速さ}=\UA{${o.D}}\div\UB{${o.T1}}`;
 return [BOX(ROUTE([[o.from,0],[o.to,1]],[[0,1,`${o.D} m`,`${o.T1} 分`]]),'!道のり ＝ 速さ × 時間'),M(f),`>${o.note}。代入する`,M(R`\text{速さ}=${U(R`\UA{${o.D}}\div\UB{${o.T1}}`,T(o.v))}`),DAI(C,f,s,false),M(R`\text{速さ}=${N(o.v)}`)];}
/* あとから家を出る人の式：傾き u、点 (s, 0) を通る */
function LATER(C,o){const u=o.u,s=o.s;const w=[M(R`y=\UA{a}x+b`),`>1分間に ${u} m 進むので、傾き \\(a\\) に ${u} を代入する`,M(R`y=\UA{${u}}x+b`),DAI(C,R`y=\UA{a}x+b`,R`y=\UA{${u}}x+b`,false),
  M(R`\UA{y}=${u}\UB{x}+b`),`>${s} 分後に家（0 m）を出るので、点 \\((${s},\\ 0)\\) を通る → \\(x\\) に ${s}、\\(y\\) に 0 を代入する`,M(R`\UA{0}=${U(R`${u}\times\UB{${s}}`,u*s)}+b`)];
 const r=SOLVE(C,[tm(0)],[tm(u*s),tm(1,'b')],'b',{});push(w,...r.w);
 push(w,`>\\(b\\) に ${T(-u*s)} を代入する`,M(R`y=${u}x\UA{-${u*s}}\quad\text{…${o.lab}}`));return w;}
/* 2つの式の y を等しくして x を求める（① を ② の y に代入） */
function MEET(C,o){const w=[M(R`\UA{y}=${o.rt}\quad\text{…②}`)];const r=SOLVE(C,o.l,o.r,'x',{wL:UA,note:`① の右辺 \\(${o.lt}\\) を、② の \\(y\\) に代入する`,after:[DAI(C,R`\UA{y}=${o.rt}`,R`\UA{${o.lt}}=${o.rt}`,false)]});push(w,...r.w);return w;}
/* ===== a6・a7 動点：辺 AB 上だけを動く ===== */
function dotAB(o){const {AD,AB,v,k}=o;const cf=AD*v/2;const x0=k/cf;const tend=AB/v;
 const ctx=`長方形 ABCD（AD ＝ ${AD} cm、AB ＝ ${AB} cm）で、点 P は A を出発して秒速 ${v} cm で辺 AB 上を B まで動く。点 P が A を出発してから \\(x\\) 秒後の △APD の面積を \\(y\\) cm² とする。`;
 const fig=RECT(AD,AB,AB*0.55,{id:o.id+'q',dims:1,w:170});
 const DER=C=>{const fa=R`\text{AP}=\UA{\text{速さ}}\times\UB{\text{時間}}`,sa=R`\text{AP}=\UA{${v}}\times\UB{x}`,fy=R`y=\UA{\text{底辺}}\times\UB{\text{高さ}}\div 2`;
  return [M(fa),BOX(TBL([['時間（秒）','1','2',M('x')],['AP（cm）',String(v),String(2*v),M(`${v}x`)]]),`!秒速 ${v} cm：1秒間に ${v} cm 進む`),`>秒速 ${v} cm で \\(x\\) 秒進む。代入する`,M(R`\text{AP}=${U(R`\UA{${v}}\times\UB{x}`,`${v}x`)}`),DAI(C,fa,sa,false),M(R`\text{AP}=${v}x`),
  RECT(AD,AB,AB*0.55,{id:o.id+'w',w:200,ad:`底辺 AD ＝ ${AD} cm`,seg:`AP ＝ ${v}x cm`}),AREA,M(fy),`>底辺 AD ＝ ${AD}、高さ AP ＝ \\(${v}x\\) を代入する`,
  M(R`y=${U(R`\UA{${AD}}\times\UB{${v}x}`,`${AD*v}x`)}\div 2`),M(R`y=${U(`${AD*v}x\\div 2`,`${N(cf)}x`)}`),M(R`y=${N(cf)}x`)];};
 const ok6=M(EQ(cf,0));
 const c6=PICK(ok6,[M(EQ(AD*v,0)),M(EQ(AD/2,0)),M(EQ(AB*v/2,0)),M(EQ(cf,AD)),M(EQ(v/2,0)),M(EQ(AD*AB/2,0))]);
 const s6={ty:o.ty6||'a6',s:'\\(y\\) を \\(x\\) の式で表しなさい。',c:C6(ok6,c6,o.p6),w:CL([...DER({}),`#÷2 を忘れると \\(y=${AD*v}x\\)。AP を \\(x\\) cm とすると \\(y=${N(AD/2)}x\\) になる。秒速 ${v} cm なので AP は \\(${v}x\\)`]),chk:{t:'dot6',AD,AB,v,ans:cf}};
 const ok7=`${T(x0)} 秒後`;
 const c7=PICK(ok7,[D2(k/(AD*v),`${T(k/(AD*v))} 秒後`),D2(k/(AD/2),`${T(k/(AD/2))} 秒後`),D2(k/AD,`${T(k/AD)} 秒後`),`${T(x0*v)} 秒後`,D2(k/(AB*v/2),`${T(k/(AB*v/2))} 秒後`),`${T(x0+1)} 秒後`,`${T(x0*2)} 秒後`,`${T(x0+0.5)} 秒後`,`${T(x0*3)} 秒後`,`${T(x0+2)} 秒後`]);
 const tail=C=>{const fo=R`\UA{y}=${N(cf)}x`;const r=SOLVE(C,[{c:XW.Q(k),v:'',t:UA(String(k))}],[tm(cf,'x')],'x',{dec:true,note:`\\(y\\) に ${k} を代入する`,after:[DAI(C,fo,R`\UA{${k}}=${N(cf)}x`,false)]});
  return [M(fo),...r.w,`>P が辺 AB 上にあるのは、B に着く ${T(tend)} 秒後まで。${T(x0)} 秒後はその間にある`,`答え　${ok7}`,(c7.includes(D2(k/(AD*v),`${T(k/(AD*v))} 秒後`))?`#(1) で ÷2 を忘れた式 \\(y=${AD*v}x\\) を使うと ${T(k/(AD*v))} 秒後になる。面積の式は \\(y=${N(cf)}x\\)`:`#AP を \\(x\\) cm とした式 \\(y=${N(AD/2)}x\\) を使うと ${T(k/(AD/2))} 秒後になる。秒速 ${v} cm なので AP は \\(${v}x\\) cm`)];};
 const s7={ty:o.ty7||'a7',s:`△APD の面積が ${k} cm² になるのは、点 P が A を出発してから何秒後か求めなさい。`,c:C6(ok7,c7,o.p7),w:CL(['(1) で求めた式',...tail({})]),chk:{t:'dot7',AD,AB,v,k,ans:x0}};
 const C2={};const s7full={...s7,w:CL(['初めに、\\(y\\) を \\(x\\) の式で表す',...DER(C2),...tail(C2)])};
 return {ctx,fig,s6,s7,s7full};}
/* ===== b1 時速を分速（m）に ===== */
function hm(o){const {h}=o;const m=h*1000/60;const ok=`分速 ${T(m)} m`;
 const c=PICK(ok,[`分速 ${T(h*1000)} m`,`分速 ${T(h*60)} m`,`分速 ${T(h/60)} m`,`分速 ${T(h*100/60)} m`,`分速 ${T(m*10)} m`,`分速 ${T(h*1000/100)} m`]);
 const w=[`時速 ${T(h)} km は「1時間に ${T(h)} km 進む」こと`,'>1 km ＝ 1000 m なので、m に直す',M(R`${N(h)}\text{ km}=${U(`${N(h)}\\times 1000`,T(h*1000))}\text{ m}`),`>1時間 ＝ 60 分。1分間に進む道のりは、60 でわる`,M(R`\text{分速}=${U(`${T(h*1000)}\\div 60`,T(m))}`),M(R`\text{分速}=${N(m)}`),`答え　分速 ${T(m)} m`,`#60 でわるのを忘れると「分速 ${T(h*1000)} m」。1時間で進む道のりのままになる`];
 return {ty:o.ty||'b1',g:o.g||'b1',gh:'次の問いに答えなさい。',q:`時速 ${T(h)} km は、分速何 m か求めなさい。`,c:C6(ok,c,o.p),w,chk:{t:'hm',h,ans:m}};}

/* ===== b2 1次方程式 ax＋b＝cx＋d ===== */
function lin(o){const {a,b,c:cc,d}=o;const x=(d-b)/(a-cc);if(!Number.isInteger(x))throw new Error('lin');
 const L=(A,B)=>`${A===1?'':A===-1?'-':N(A)}x${B===0?'':(B<0?'-'+N(-B):'+'+N(B))}`;
 const ok=M(R`x=${N(x)}`);
 const c=PICK(ok,[M(R`x=${FR(d+b,a-cc)}`),M(R`x=${FR(d-b,a+cc)}`),M(R`x=${N(-x)}`),M(R`x=${FR(b-d,a+cc)}`),M(R`x=${FR(a-cc,d-b)}`),M(R`x=${N(x+1)}`)]);
 const k=a-cc,r=d-b;
 const w=SOLVE({},[tm(a,'x'),tm(b)].filter(t=>t.c[0]!==0),[tm(cc,'x'),tm(d)].filter(t=>t.c[0]!==0),'x',{}).w;
 w.push(`#${b<0?'−':''}${T(Math.abs(b))} を右辺へ移項するとき符号を変えずに ${M(R`${k===1?'':k===-1?'-':N(k)}x=${N(d)}${b<0?'-'+N(-b):'+'+N(b)}`)} とすると ${M(R`x=${FR(d+b,a-cc)}`)} になる。移項すると符号が変わる`);
 return {ty:o.ty||'b2',g:o.g||'b2',gh:'次の方程式を解きなさい。',q:M(R`${L(a,b)}=${L(cc,d)}`),c:C6(ok,c,o.p),w:CL(w),chk:{t:'lin',a,b,c:cc,d,ans:x}};}
/* ===== b3 2直線の交点 ===== */
function cross(o){const {p1,q1,p2,q2}=o;const x=(q2-q1)/(p1-p2),y=p1*x+q1;if(!Number.isInteger(x)||!Number.isInteger(y))throw new Error('cross');
 const P=(X,Y)=>M(R`(${N(X)},\ ${N(Y)})`);const ok=P(x,y);
 const c=PICK(ok,[P(y,x),P(x,-y),P(-x,p1*(-x)+q1),P(x,p2*x-q2),P(x,q1),P(x+1,p1*(x+1)+q1)]);
 const w=XW.T.cross({},p1,q1,p2,q2,'交点は、2つの直線の式の両方に合う点。2つの式を連立方程式にして解く',`答え　${ok}`);
 w.push(`#座標は \\((x\\) 座標\\(,\\ y\\) 座標\\()\\) の順。逆に書くと ${P(y,x)} になる`);
 return {ty:o.ty||'b3',g:o.g||'b3',gh:'次の問いに答えなさい。',q:`2直線 \\(${EQ(p1,q1)}\\)、\\(${EQ(p2,q2)}\\) の交点の座標を求めなさい。`,c:C6(ok,c,o.p),w:CL(w),chk:{t:'cross',p1,q1,p2,q2,ans:[x,y]}};}
/* ===== b4・b5・b6 とちゅうで止まったグラフと、反対から来る人 ===== */
function stop(o){const {who,ap,h,shop,dest,w1,t1,t2,w2,t3}=o;const d1=w1*t1,D=d1+w2*(t3-t2);const ax=o.ax||AX(t3,[d1,D]);const S=o.sis;const u=S.kmh*1000/60;
 const xm=(D+u*S.s-d1+w2*t2)/(w2+u),ym=d1+w2*(xm-t2);
 const ctx=`${who}は${ap}${h}時に家を出発し、とちゅうで${shop}に寄ってから、家から ${D} m はなれた${dest}まで行った。下のグラフは、${who}が家を出発してから \\(x\\) 分後に家から \\(y\\) m はなれた所にいるとして、\\(x\\) と \\(y\\) の関係を表したものである。`;
 const poly=[[0,0],[t1,d1],[t2,d1],[t3,D]];
 const fig=GQ({...ax,xu:'分',yu:'m',polys:[[poly]],pts:[[t3,D]]});
 /* b4 止まっていた時間 */
 const st=t2-t1,ok4=`${st} 分間`;
 const c4=PICK(ok4,[`${t1} 分間`,`${t2} 分間`,`${t3-t2} 分間`,`${st+ax.xs} 分間`,`${st*2} 分間`,st-ax.xs>0?`${st-ax.xs} 分間`:null,`${t3} 分間`,`${st+2*ax.xs} 分間`,`${t1+t2} 分間`,`${t3-t1} 分間`,`${st+3*ax.xs} 分間`,`${t3+t2} 分間`]);
 const C4={},f4=R`\text{止まっていた時間}=\UA{\text{出た時刻}}-\UB{\text{着いた時刻}}`,g4=R`\text{止まっていた時間}=\UA{${t2}}-\UB{${t1}}`;
 const w4=[GQ({...ax,xu:'分',yu:'m',polys:[[poly]],hl:[[t1,d1,t2,d1]],dsh:[[t1,0,t1,d1],[t2,0,t2,d1]],labs:[[t1,d1,`${t1} 分`,'end',-4,-10,1],[t2,d1,`${t2} 分`,'start',4,-10,1]]}),
  `>${shop}にいる間は、家からの道のり \\(y\\) が変わらない。グラフが横にまっすぐな所`,M(f4),BOX(R`\(\text{時間}=\UA{\text{あと}}-\UB{\text{まえ}}\)`,'!出た時刻（あと）− 着いた時刻（まえ）'),`>グラフから、${t1} 分後に着いて ${t2} 分後に出た。代入する`,M(R`\text{止まっていた時間}=${U(R`\UA{${t2}}-\UB{${t1}}`,st)}`),DAI(C4,f4,g4,false),M(R`\text{止まっていた時間}=${st}`),`答え　${ok4}`,`#${t1} 分（${shop}に着いた時刻）や ${t2} 分（出た時刻）を答えにしない。止まっていた時間は ${t2} − ${t1}`];
 const s4={ty:o.ty4||'b4',s:`${who}が${shop}にいたのは何分間か求めなさい。`,c:C6(ok4,c4,o.p4),w:CL(w4),chk:{t:'stop4',t1,t2,ans:st}};
 /* b5 止まる前の速さ（時速） */
 const kmh=w1*60/1000,ok5=`時速 ${T(kmh)} km`;
 const c5=PICK(ok5,[`時速 ${T(w1)} km`,`時速 ${T(w1*60)} km`,`時速 ${T(w2*60/1000)} km`,`時速 ${T(d1/1000)} km`,`時速 ${T(kmh*10)} km`,D2(w1/60,`時速 ${T(w1/60)} km`),`時速 ${T(kmh*100)} km`]);
 const C5={},f5=R`\text{分速}=\UA{\text{道のり}}\div\UB{\text{時間}}`,g5=R`\text{分速}=\UA{${d1}}\div\UB{${t1}}`;
 const w5=[GQ({...ax,xu:'分',yu:'m',polys:[[poly]],rings:[[t1,d1]],dsh:[[t1,0,t1,d1],[0,d1,t1,d1]],labs:[[t1,d1,`(${t1}, ${d1})`,'end',-12,-8,1]]}),SPD,M(f5),`>グラフから、${shop}までは ${t1} 分で ${d1} m 進んでいる。代入する`,M(R`\text{分速}=${U(R`\UA{${d1}}\div\UB{${t1}}`,w1)}`),DAI(C5,f5,g5,false),M(R`\text{分速}=${w1}`),
  '>分速 m を時速 km に直す。1時間 ＝ 60 分なので、1時間に進む道のりは分速の 60 倍',M(R`\text{1時間に進む道のり}=\UA{\text{分速}}\times 60`),'>代入する',M(R`\text{1時間に進む道のり}=${U(R`\UA{${w1}}\times 60`,w1*60)}`),
  BOX(TBL([['時間','1 分','60 分（1時間）'],['道のり',`${w1} m`,`${w1*60} m`]]),'!1 km ＝ 1000 m'),M(R`\text{1時間に進む道のり}=${w1*60}`),`>${w1*60} m ＝ ${T(kmh)} km（1000 m ＝ 1 km）。1時間に ${T(kmh)} km 進むので、時速 ${T(kmh)} km`,`答え　${ok5}`,`#分速 ${w1} m のまま「時速 ${w1} km」にしない。60 をかけて、m を km に直す`];
 const s5={ty:o.ty5||'b5',s:`${who}が家から${shop}まで歩いた速さは、時速何 km か求めなさい。`,c:C6(ok5,c5,o.p5),w:CL(w5),chk:{t:'stop5',d1,t1,ans:kmh}};
 /* b6 すれちがう */
 const b1=d1-w2*t2,b2=D+u*S.s;const A6=(tt,dd)=>`${TM(ap,h,tt)}、家から ${T(dd)} m`;const ok6=A6(xm,ym);
 const c6=PICK(ok6,[A6(xm,D-ym),A6(S.s,d1),A6(t3,D),A6(xm-S.s,ym),A6(xm+ax.xs,ym+w2*ax.xs),A6(xm,ym+100)]);
 const xe=S.s+D/u;const C={};
 const w6=[GQ({...ax,xu:'分',yu:'m',polys:[[poly],[[[S.s,D],[Math.min(xe,ax.xmax),D-u*(Math.min(xe,ax.xmax)-S.s)]],1]],pts:[[S.s,D]],rings:[[xm,ym]],labs:[[xm,ym,'すれちがう','start',10,14,1],[S.s,D,`(${S.s}, ${D})`,'end',-8,-8,1]]}),
  'すれちがう所 ＝ 2つのグラフの交点。2つの直線の式を連立方程式にして解く',`${who}が${shop}を出てからの式`,M(R`y=ax+b`),`>2点 \\((${t2},\\ ${d1})\\)、\\((${t3},\\ ${D})\\) を通る`,
  ...SLOPE(C,{x1:t2,y1:d1,x2:t3,y2:D}),...LINE(C,{a:w2,x:t3,y:D,lab:'①'}),
  `${S.who}の式`,BOX(TBL([['時間','1 時間（60 分）','1 分'],['道のり',`${T(S.kmh)} km ＝ ${T(S.kmh*1000)} m`,`${T(S.kmh*1000)}÷60 ＝ ${T(u)} m`]]),'!時速を分速に直す'),
  `>時速 ${T(S.kmh)} km ＝ 分速 ${T(u)} m。家に近づくので \\(y\\) は減る。傾き \\(a\\) に \\(-${N(u)}\\) を代入する`,M(R`y=\UA{-${N(u)}}x+b`),
  ...LINE(C,{a:-u,x:S.s,y:D,lab:'②',pre:`${S.s} 分後に${dest}（${D} m）を出るので、`}),
  ...MEET(C,{l:[tm(w2,'x'),tm(b1)],r:[tm(-u,'x'),tm(b2)],lt:`${N(w2)}x${b1<0?'-'+N(-b1):'+'+N(b1)}`,rt:`-${N(u)}x+${N(b2)}`}),
  ...EVAL(C,'y',[tm(w2,'x'),tm(b1)],{x:[xm,UA]},{origNote:'家からの道のり \\(y\\) を求める。① の式を書く',tag:R`\quad\text{…①}`}).w,
  `${ap}${h}時の ${T(xm)} 分後で、家から ${T(ym)} m`,`答え　${ok6}`,`#\\(y\\) は家からの道のり。${dest}からの道のり（${T(D)} − ${T(ym)} ＝ ${T(D-ym)} m）とまちがえない`];
 const s6={ty:o.ty6||'b6',s:`${S.who}は${ap}${h}時${S.s}分に${dest}を出発し、${S.how}時速 ${T(S.kmh)} km で同じ道を家に向かった。${S.who}が ${who}とすれちがう時刻と、そのときの家からの道のりを求めなさい。`,c:C6(ok6,c6,o.p6),w:CL(w6),chk:{t:'stop6',d1,t2,t3,D,s:S.s,kmh:S.kmh,ans:[xm,ym]}};
 return {ctx,fig,s4,s5,s6};}
/* 2点から傾き（変化の割合）。増加量 ＝ あと − まえ（決まり 2・3・9 の ⑧） */
function SLOPE(C,o){const {x1,y1,x2,y2}=o;const dy=y2-y1,dx=x2-x1,a=dy/dx;
 const w=[M(R`a=\dfrac{y\text{ の増加量}}{x\text{ の増加量}}`),'>増加量 ＝ あと − まえ。代入する',M(R`a=${U(R`(\UA{${y2}}-\UB{${y1}})`,N(dy))}\div${U(R`(\UA{${x2}}-\UB{${x1}})`,N(dx))}`),
  DAI(C,R`a=\dfrac{y\text{ の増加量}}{x\text{ の増加量}}`,R`a=(\UA{${y2}}-\UB{${y1}})\div(\UA{${x2}}-\UB{${x1}})`,false),BX.zouka(),M(R`a=${U(`${N(dy)}\\div ${N(dx)}`,N(a))}`),M(R`a=${N(a)}`),
  `>\\(a\\) に ${T(a)} を代入する`,M(R`y=\UA{${N(a)}}x+b`)];return w;}
/* 傾き a の直線が点 (x, y) を通る → b を求めて、式 …lab */
function LINE(C,o){const {a,x,y}=o;const w=[M(R`\UA{y}=${N(a)}\UB{x}+b`),`>${o.pre||''}点 \\((${x},\\ ${y})\\) を通る → \\(x\\) に ${x}、\\(y\\) に ${y} を代入する`,M(R`\UA{${y}}=${U(R`${N(a)}\times\UB{${x}}`,N(a*x))}+b`)];
 const r=SOLVE(C,[tm(y)],[tm(a*x),tm(1,'b')],'b',{});push(w,...r.w);const b=XW.qv(r.x);
 push(w,`>\\(b\\) に ${T(b)} を代入する`,M(R`y=${N(a)}x\UA{${b<0?'-'+N(-b):'+'+N(b)}}`+(o.lab?R`\quad\text{…${o.lab}}`:'')));return w;}
/* ===== b7 直角三角形の動点：辺 CA 上の式と変域 ===== */
function tri(o){const {BC,CA,v}=o;const L=BC+CA,tc=BC/v,ta=L/v,hb=BC/2;const a=-hb*v,b=hb*L;
 const DM=(lo,hi)=>R`（\(${N(lo)}\leqq x\leqq ${N(hi)}\)）`;const A=(aa,bb,lo,hi)=>M(EQ(aa,bb))+DM(lo,hi);
 const ok=A(a,b,tc,ta);
 const c=PICK(ok,[A(a,b,0,ta),A(a,b,0,tc),A(hb*v,-hb*BC,tc,ta),A(-CA/2*v,CA/2*L,tc,ta),A(-hb,hb*L,tc,ta),A(-BC*v,BC*L,tc,ta)]);
 const q=`直角三角形 ABC（BC ＝ ${BC} cm、CA ＝ ${CA} cm、∠C ＝ 90°）で、点 P は B を出発して秒速 ${v} cm で辺 BC、CA 上を A まで動く。点 P が B を出発してから \\(x\\) 秒後の △ABP の面積を \\(y\\) cm² とする。点 P が辺 CA 上にあるとき、\\(y\\) を \\(x\\) の式で表し、\\(x\\) の変域も求めなさい。`+G(TRI(BC,CA,BC+CA*0.4,{id:o.id+'q',dims:1,w:210}));
 const sP=BC+CA*0.4;const C={};const ft=R`\text{時間}=\UA{\text{道のり}}\div\UB{\text{速さ}}`;
 const w=['初めに、P が頂点に着く時刻を調べる',M(ft),`>C に着くのは、BC（${BC} cm）を進んだとき。代入する`,M(R`\text{時間}=${U(R`\UA{${BC}}\div\UB{${v}}`,N(tc))}`),DAI(C,ft,R`\text{時間}=\UA{${BC}}\div\UB{${v}}`,false),
  `>A に着くのは、BC と CA（${BC}＋${CA} ＝ ${L} cm）を進んだとき`,M(R`\text{時間}=${U(R`\UA{${L}}\div\UB{${v}}`,N(ta))}`),`辺 CA 上にあるのは ${T(tc)} 秒後から ${T(ta)} 秒後まで → \\(${N(tc)}\\leqq x\\leqq ${N(ta)}\\)`,
  BOX(NLINE([[0,'B'],[tc,'C'],[ta,'A']],[1,2]),'!変域：P が辺 CA 上にある時間（太い線。● はふくむ）'),
  TRI(BC,CA,sP,{id:o.id+'w',w:230,seg:'PA ＝ ？',path:''}),`>太い線が、P が進んだ道（B → C → P）。\\(x\\) 秒で ${v}×\\(x\\) ＝ \\(${v}x\\) cm 進む。PA は、全部の長さから進んだ長さを引いて出す`,
  M(R`\text{PA}=\UA{\text{全部の長さ}}-\UB{\text{進んだ長さ}}`),'>代入する',M(R`\text{PA}=\UA{${L}}-\UB{${v}x}`),AREA,M(R`y=\UA{\text{底辺}}\times\UB{\text{高さ}}\div 2`),`>底辺 PA ＝ \\(${L}-${v}x\\)、高さ BC ＝ ${BC}（BC は CA と垂直）を代入する`,M(R`y=\UA{(${L}-${v}x)}\times\UB{${BC}}\div 2`),
  `>${BC}÷2 を先に計算する`,M(R`y=(${L}-${v}x)\times${U(`${BC}\\div 2`,N(hb))}`),'>かけ算の順番を入れかえる',M(R`y=${AF(`両方に ×${N(hb)}`,N(hb))}(${AT(String(L))}${AT('-'+v+'x')})`),BX.bunpai(),
  '>分配法則でかっこをはずす',M(R`y=${N(b)}${UR('-'+N(-a)+'x')}`),'>\\(x\\) の項を前に書く（項の順番を入れかえる）',M(EQ(a,b)),
  `答え　${ok}`,`#変域は辺 CA の上にいる間だけ。\\(0\\leqq x\\leqq ${N(ta)}\\) とすると、辺 BC の上の時間も入ってしまう`];
 return {ty:o.ty||'b7',g:o.g||'b7',q,c:C6(ok,c,o.p),w:CL(w),chk:{t:'tri',BC,CA,v,ans:[a,b,tc,ta]}};}
/* ===== c1 三角形の面積 ===== */
function area(o){const {bb,hh}=o;const S=bb*hh/2,ok=`${T(S)} cm²`;
 const c=PICK(ok,[`${T(bb*hh)} cm²`,`${T(bb+hh)} cm²`,`${T((bb+hh)*2)} cm²`,`${T(S*2+bb)} cm²`,`${T(S/2)} cm²`,`${T(S+hh)} cm²`]);
 const w=[AREA,`>底辺 ${T(bb)}、高さ ${T(hh)} を入れる`,M(R`\text{面積}=${U(`${N(bb)}\\times ${N(hh)}`,N(bb*hh))}\div 2`),M(R`\text{面積}=${N(bb*hh)}\div 2`),M(R`\text{面積}=${N(S)}`),`答え　${ok}`,`#÷2 を忘れると ${T(bb*hh)} cm² になる。三角形は長方形の半分`];
 return {ty:o.ty||'c1',g:o.g||'c1',gh:'次の問いに答えなさい。',q:`底辺 ${T(bb)} cm、高さ ${T(hh)} cm の三角形の面積を求めなさい。`,c:C6(ok,c,o.p),w,chk:{t:'area',bb,hh,ans:S}};}

/* ===== c2 分数の1次方程式 (x＋e)/m ＝ (x＋f)/n ===== */
function frac(o){const {e,f,m,n}=o;const l=m*n/gcd(m,n),A=l/m,B=l/n;const x=(B*f-A*e)/(A-B);if(!Number.isInteger(x))throw new Error('frac');
 const sg=v=>v<0?'-'+N(-v):'+'+N(v);const ok=M(R`x=${N(x)}`);
 const c=PICK(ok,[M(R`x=${FR(f-e,A-B)}`),M(R`x=${N(-x)}`),M(R`x=${FR(B*f+A*e,A-B)}`),M(R`x=${FR(B*f-A*e,A+B)}`),M(R`x=${FR(n*f-m*e,m-n)}`),M(R`x=${N(x+2)}`)]);
 const C={};const lhs=R`\dfrac{x${sg(e)}}{${m}}`,rhs=R`\dfrac{x${sg(f)}}{${n}}`;
 const ka=k=>k===1?'':N(k);
 const w=[M(`${lhs}=${rhs}`),`>方程式なので、両辺に同じ数をかけてよい。分母 ${m} と ${n} の最小公倍数 ${l} を、両辺にかける（分母をはらう）`,M(`${lhs}${UR('\\times '+l)}=${rhs}${UR('\\times '+l)}`),
  BOX(M(R`\dfrac{x${sg(e)}}{${m}}\times ${l}=${ka(A)}(x${sg(e)})`),'!分子の全部の項にかける。かっこをつける'),
  `>約分すると、左辺は ${l}÷${m} ＝ ${A}、右辺は ${l}÷${n} ＝ ${B} が残る`];
 if(A!==1)push(w,M(R`${AF(`両方に ×${A}`,N(A))}(${AT('x')}${AT(sg(e))})=${ka(B)}(x${sg(f)})`),BX.bunpai());
 else push(w,M(R`(x${sg(e)})=${ka(B)}(x${sg(f)})`));
 push(w,...SOLVE(C,[tm(A,'x'),tm(A*e)].filter(t=>t.c[0]!==0),[tm(B,'x'),tm(B*f)].filter(t=>t.c[0]!==0),'x',{note:'分配法則でかっこをはずす'+(B!==1?`（右辺も ${B} を、かっこの中の両方にかける）`:'')}).w);
 { const ws=[A!==1?T(e):null,B!==1?T(f):null].filter(v=>v!==null);
   w.push(`#${l} をかけたとき、分子のかっこの中の数にもかける。${M(R`${A===1?'':N(A)}x${sg(e)}=${B===1?'':N(B)}x${sg(f)}`)} のように、${ws.length===2?ws.join(' と ')+' の両方':ws[0]}にかけ忘れると ${M(R`x=${FR(f-e,A-B)}`)} になる`); }
 return {ty:o.ty||'c2',g:o.g||'c2',gh:'次の方程式を解きなさい。',q:M(R`\dfrac{x${sg(e)}}{${m}}=\dfrac{x${sg(f)}}{${n}}`),c:C6(ok,c,o.p),w:CL(w),chk:{t:'frac',e,f,m,n,ans:x}};}
/* ===== c3 連立方程式の利用：速さ（表をうめる） ===== */
function sys(o){const {D,v1,v2,T:TT}=o;const l=v1*v2/gcd(v1,v2),A=l/v1,B=l/v2;
 /* A x + B y = TT l、x + y = D */
 const x=(TT*l-B*D)/(A-B),y=D-x;if(!Number.isInteger(x)||x<=0||y<=0)throw new Error('sys');
 const AN=(p,q)=>`${o.w1||'歩いた'}道のり ${T(p)} m、${o.w2||'走った'}道のり ${T(q)} m`;const ok=AN(x,y);
 const c=PICK(ok,[AN(y,x),AN(D/2,D/2),AN(x,D+x),AN(x/2,D-x/2),AN(v1*TT,D-v1*TT),AN(x+100,y-100),AN(D-v2*(TT/2),v2*TT/2)]);
 const th=(t)=>`<th style="padding:2px 8px">${t}</th>`,td=(t)=>`<td style="padding:2px 8px">${t}</td>`;
 const tbl=`<table class="tb inc"><tr>${th('')}${th(o.w1||'歩いた')}${th(o.w2||'走った')}${th('全体')}</tr><tr>${th('速さ')}${td('分速 '+v1+' m')}${td('分速 '+v2+' m')}${td('')}</tr><tr>${th('道のり')}${td('\\(x\\) m')}${td('\\(y\\) m')}${td(D+' m')}</tr><tr>${th('時間')}${td(`\\(\\dfrac{x}{${v1}}\\) 分`)}${td(`\\(\\dfrac{y}{${v2}}\\) 分`)}${td(TT+' 分')}</tr></table>`;
 const C={},ka=k=>k===1?'':N(k);const W1=o.w1||'歩いた',W2=o.w2||'走った';
 const w=[BOX(ROUTE([['家',0],['',0.45],[o.place,1]],[[0,1,`${W1} x m`,`分速 ${v1} m`],[1,2,`${W2} y m`,`分速 ${v2} m`]]),`!全部で ${D} m・${TT} 分`),
  `${W1}道のりを \\(x\\) m、${W2}道のりを \\(y\\) m として、表をうめる`,'時間 ＝ 道のり ÷ 速さ',tbl,'道のりの式',M(R`x+y=${D}\quad\text{…①}`),'時間の式',M(R`\dfrac{x}{${v1}}+\dfrac{y}{${v2}}=${TT}\quad\text{…②}`),
  `>② の両辺に ${v1} と ${v2} の最小公倍数 ${l} をかけて、分母をはらう`,M(R`${U(R`\dfrac{x}{${v1}}\times ${l}`,`${ka(A)}x`)}+${U(R`\dfrac{y}{${v2}}\times ${l}`,`${ka(B)}y`)}=${U(R`${TT}\times ${l}`,TT*l)}`),
  BOX(M(R`\dfrac{x}{${v1}}+\dfrac{y}{${v2}}=${TT}`),M(R`\dfrac{x}{${v1}}\UR{\times ${l}}+\dfrac{y}{${v2}}\UR{\times ${l}}=${TT}\UR{\times ${l}}`),`!分母をはらう：右辺もふくめて全部の項に ${l} をかける`),
  M(R`${ka(A)}x+${ka(B)}y=${TT*l}\quad\text{…②'}`)];
 if(B!==1)push(w,`>① の両辺に ${B} をかけて、\\(y\\) の係数をそろえる`,M(R`${AF('右辺にも',R`\times ${B}`)}\quad ${AT('x')}${AT('+y')}\mathrel{=}${AT(String(D))}`),M(R`${B}x+${B}y=${U(UR(R`${B}\times ${D}`),B*D)}\quad\text{…①'}`));
 push(w,...KAGEN(C,"②' − ①' で \\(y\\) を消す",`${ka(B)}x+${ka(B)}y=${B*D}`,`-${ka(B)}x-${ka(B)}y=-${B*D}`,"①'"),
  M(R`\begin{array}{rrcl}&${ka(A)}x+${ka(B)}y&=&${TT*l}\\+)&${UR(`-${ka(B)}x-${ka(B)}y`)}&=&${UR('-'+B*D)}\\\hline&${ka(A-B)}x&=&${TT*l-B*D}\end{array}`));
 if(A-B!==1)push(w,`>両辺を \\(x\\) の係数 ${T(A-B)} でわる`,M(R`x=${N(x)}`));
 push(w,'>\\(y\\) を求める。① の式を書く',M(R`\UA{x}+y=${D}\quad\text{…①}`));
 push(w,...SOLVE(C,[{c:XW.Q(x),v:'',t:UA(N(x))},tm(1,'y')],[tm(D)],'y',{note:`\\(x\\) に ${T(x)} を代入する`,after:[DAI(C,R`\UA{x}+y=${D}`,R`\UA{${N(x)}}+y=${D}`,false)]}).w);
 push(w,`確かめ：${T(x)}÷${v1} ＝ ${T(x/v1)} 分、${T(y)}÷${v2} ＝ ${T(y/v2)} 分。合わせて ${T(x/v1+y/v2)} 分で合う`,`答え　${ok}`,`#時間の式は 道のり ÷ 速さ。速さ × 道のりにしない。答えを出したら、時間が ${TT} 分になるかを確かめる`);
 return {ty:o.ty||'c3',g:o.g||'c3',gh:'次の問いに答えなさい。',q:`家から ${D} m はなれた${o.place}まで行くのに、初めは分速 ${v1} m で${o.how1||'歩き'}、とちゅうから分速 ${v2} m で${o.how2||'走った'}ところ、全部で ${TT} 分かかった。${o.w1||'歩いた'}道のりと${o.w2||'走った'}道のりを、それぞれ求めなさい。`,c:C6(ok,c,o.p),w:CL(w),chk:{t:'sys',D,v1,v2,T:TT,ans:[x,y]}};}
/* ===== c4・c5・c6 往復と、後から出る人 ===== */
function round(o){const {who,ap,h,place,D,T1,T2}=o;const ax=o.ax||AX(T2,[D]);const g1=D/T1,g2=D/(T2-T1),b=g2*T2;const S=o.sib;const xm=(b+S.u*S.s)/(S.u+g2),ym=S.u*(xm-S.s);
 const ctx=`${who}は${ap}${h}時に家を出発し、家から ${D} m はなれた${place}まで、一定の速さで歩いた。${place}に着くとすぐに、行きとはちがう一定の速さで走って、同じ道を家にもどった。下のグラフは、${who}が家を出発してから \\(x\\) 分後に家から \\(y\\) m はなれた所にいるとして、\\(x\\) と \\(y\\) の関係を表したものである。`;
 const poly=[[0,0],[T1,D],[T2,0]];
 const fig=GQ({...ax,xu:'分',yu:'m',polys:[[poly]],pts:[[T1,D]]});
 const ok4=`分速 ${T(g1)} m`;
 const c4=PICK(ok4,[`分速 ${T(g2)} m`,D2(D/T2,`分速 ${T(D/T2)} m`),D2(2*D/T2,`分速 ${T(2*D/T2)} m`),`分速 ${T(D)} m`,`分速 ${T(g1*10)} m`,D2(D/(T1+ax.xs),`分速 ${T(D/(T1+ax.xs))} m`),`分速 ${T(g1*2)} m`,`分速 ${T(g1/2)} m`,`分速 ${T1} m`,`分速 ${T(g1+g2)} m`]);
 const w4=[GQ({...ax,xu:'分',yu:'m',polys:[[poly]],rings:[[T1,D]],dsh:[[T1,0,T1,D],[0,D,T1,D]],labs:[[T1,D,`(${T1}, ${D})`,'start',10,-6,1]]}),...SPEED({},{from:'家',to:place,D,T1,v:g1,note:`グラフから、行きは ${T1} 分で ${D} m 進んでいる`}),`答え　分速 ${T(g1)} m`,`#帰りの速さ（${T2-T1} 分で ${D} m → 分速 ${T(g2)} m）とまちがえない。行きはグラフの右上がりの所`];
 const s4={ty:o.ty4||'c4',s:`${who}が${place}へ行くときの速さは、分速何 m か求めなさい。`,c:C6(ok4,c4,o.p4),w:CL(w4),chk:{t:'round4',D,T1,ans:g1}};
 const ok5=M(EQ(-g2,b));
 const c5=PICK(ok5,[M(EQ(g2,-b)),M(EQ(-g2,D)),M(EQ(-g1,g1*T2)),M(EQ(-g2,-b)),D2(D/T2,M(EQ(-D/T2,D))),M(EQ(-g2,g2*T1)),M(EQ(-g2,b+D)),M(EQ(-g1,D))]);
 const der=(C,lab)=>[M(R`y=ax+b`),`>帰りのグラフは、2点 \\((${T1},\\ ${D})\\)、\\((${T2},\\ 0)\\) を通る`,...SLOPE(C,{x1:T1,y1:D,x2:T2,y2:0}),...LINE(C,{a:-g2,x:T2,y:0,lab})];
 const s5={ty:o.ty5||'c5',s:`${who}が${place}から家にもどるときの、\\(y\\) を \\(x\\) の式で表しなさい。`,c:C6(ok5,c5,o.p5),w:CL([GQ({...ax,xu:'分',yu:'m',polys:[[poly]],rings:[[T1,D],[T2,0]],hl:[[T1,D,T2,0]],labs:[[T1,D,`(${T1}, ${D})`,'start',10,-6,1],[T2,0,`(${T2}, 0)`,'end',-8,-8,1]]}),...der({},null),`答え　${ok5}`,`#家にもどるとき \\(y\\) は減るので、傾きはマイナス。切片は \\(x=0\\) までのばした所なので、${D} ではない`]),chk:{t:'round5',D,T1,T2,ans:[-g2,b]}};
 const ok6=TM(ap,h,xm);const kk=S.u+g2,rr=b+S.u*S.s;
 const c6=PICK(ok6,[TM(ap,h,xm-S.s),TM(ap,h,T1),TM(ap,h,T2),I((D+S.u*S.s)/(S.u+g1),TM(ap,h,(D+S.u*S.s)/(S.u+g1))),TM(ap,h,xm+5),TM(ap,h,xm-1),TM(ap,h,S.s+D/S.u)]);
 const xe=S.s+D/S.u;
 const w6=(full)=>{const C={};return [GQ({...ax,xu:'分',yu:'m',polys:[[poly],[[[S.s,0],[Math.min(xe,ax.xmax),S.u*(Math.min(xe,ax.xmax)-S.s)]],1]],pts:[[S.s,0]],rings:[[xm,ym]],labs:[[xm,ym,'出会う','start',10,4,1],[S.s,0,`(${S.s}, 0)`,'start',6,-6,1]]}),'出会う所 ＝ 2つのグラフの交点。2つの直線の式を連立方程式にして解く',`${who}の帰りの式`,
  ...(full?der(C,'①'):['>(2) で求めた式',M(R`${EQ(-g2,b)}\quad\text{…①}`)]),
  `${S.who}の式`,...LATER(C,{u:S.u,s:S.s,lab:'②'}),
  ...MEET(C,{l:[tm(-g2,'x'),tm(b)],r:[tm(S.u,'x'),tm(-S.u*S.s)],lt:`-${N(g2)}x+${N(b)}`,rt:`${S.u}x-${S.u*S.s}`}),
  `${ap}${h}時の ${T(xm)} 分後`,`答え　${ok6}`,`#${S.who}が出発してからの ${T(xm-S.s)} 分を答えにしない。\\(x\\) は${who}が家を出てからの時間`];};
 const s6={ty:o.ty6||'c6',s:`${S.who}は${ap}${h}時${S.s}分に家を出発し、分速 ${S.u} m で同じ道を${place}へ向かった。${S.who}が ${who}と出会う時刻を求めなさい。`,c:C6(ok6,c6,o.p6),w:CL(w6(false)),chk:{t:'round6',D,T1,T2,s:S.s,u:S.u,ans:xm}};
 const s6full={...s6,w:CL(w6(true))};
 return {ctx,fig,s4,s5,s6,s6full};}
/* ===== c7 動点：A→B→C→D の全体のグラフを選ぶ ===== */
function dotAll(o){const {AD,AB,v}=o;const t1=AB/v,t2=(AB+AD)/v,t3=(2*AB+AD)/v,Mx=AD*AB/2;
 const sw1=AD/v,sw2=(AD+AB)/v,sw3=(2*AD+AB)/v;
 const xmax=Math.ceil(Math.max(t3,sw3)/o.xt)*o.xt,ymax=Math.ceil(2*Mx/o.yt)*o.yt;
 const g=pts=>GQ({sm:true,xmax,ymax,xs:o.xs,ys:o.ys,xt:o.xt,yt:o.yt,polys:[[pts]]});
 const okp=[[0,0],[t1,Mx],[t2,Mx],[t3,0]];
 const wr=[[[0,0],[sw1,Mx],[sw2,Mx],[sw3,0]],[[0,0],[t1,2*Mx],[t2,2*Mx],[t3,0]],[[0,0],[t3/2,Mx],[t3,0]],[[0,0],[t1,Mx],[t3,Mx]],[[0,Mx],[t1,0],[t2,0],[t3,Mx]],[[0,0],[t1,Mx/2],[t2,Mx/2],[t3,0]]];
 const ok=g(okp);const c=PICK(ok,wr.map(g));
 const th=t=>`<th style="padding:2px 8px">${t}</th>`,td=t=>`<td style="padding:2px 8px">${t}</td>`;
 const tbl=`<table class="tb inc"><tr>${th('P の位置')}${td('A')}${td('B')}${td('C')}${td('D')}</tr><tr>${th('\\(x\\)（秒）')}${td(0)}${td(T(t1))}${td(T(t2))}${td(T(t3))}</tr><tr>${th('\\(y\\)（cm²）')}${td(0)}${td(T(Mx))}${td(T(Mx))}${td(0)}</tr></table>`;
 const q=`長方形 ABCD（AD ＝ ${AD} cm、AB ＝ ${AB} cm）で、点 P は A を出発して秒速 ${v} cm で辺 AB、BC、CD 上を D まで動く。点 P が A を出発してから \\(x\\) 秒後の △APD の面積を \\(y\\) cm² とする。\\(x\\) と \\(y\\) の関係を表すグラフとして正しいものを選びなさい。`+G(RECT(AD,AB,AB*0.6,{id:o.id+'q',dims:1,w:170}));
 const C={},ft=R`\text{時間}=\UA{\text{道のり}}\div\UB{\text{速さ}}`,fy=R`y=\UA{\text{底辺}}\times\UB{\text{高さ}}\div 2`;
 const w=['動く点の問題では、初めに P が頂点にあるときの \\(x\\) と \\(y\\) を調べる',M(ft),`>B に着く：AB（${AB} cm）を進んだとき。代入する`,M(R`\text{時間}=${U(R`\UA{${AB}}\div\UB{${v}}`,N(t1))}`),DAI(C,ft,R`\text{時間}=\UA{${AB}}\div\UB{${v}}`,false),
  `>C に着く：AB＋BC（${AB+AD} cm）を進んだとき`,M(R`\text{時間}=${U(R`\UA{${AB+AD}}\div\UB{${v}}`,N(t2))}`),`>D に着く：全部（${2*AB+AD} cm）を進んだとき`,M(R`\text{時間}=${U(R`\UA{${2*AB+AD}}\div\UB{${v}}`,N(t3))}`),
  `P が B・C にあるとき、△APD は底辺 AD ＝ ${AD}、高さ AB ＝ ${AB} の三角形`,AREA,M(fy),'>代入する',M(R`y=${U(R`\UA{${AD}}\times\UB{${AB}}`,AD*AB)}\div 2`),M(R`y=${U(`${AD*AB}\\div 2`,N(Mx))}`),M(R`y=${N(Mx)}`),tbl,
  `辺 AB 上：高さ AP がのびるので、\\(y\\) は 0 から ${T(Mx)} まで増える`,`辺 BC 上：高さはいつも AB（${AB} cm）なので、\\(y\\) は ${T(Mx)} のまま（横にまっすぐ）`,`辺 CD 上：高さ PD が短くなるので、\\(y\\) は ${T(Mx)} から 0 まで減る`,
  '>表の4つの点を、線分でつなぐ',GQ({xmax,ymax,xs:o.xs,ys:o.ys,xt:o.xt,yt:o.yt,xu:'秒',yu:'cm²',polys:[[okp]],pts:okp,labs:[[t1,Mx,`(${T(t1)}, ${T(Mx)})`,'end',-6,-8,1],[t2,Mx,`(${T(t2)}, ${T(Mx)})`,'start',6,-8,1]]}),
  `#AB と AD を取りちがえると、横にまっすぐな所の始まりと終わりがずれる。÷2 を忘れると、高さが ${T(2*Mx)} になる`];
 return {ty:o.ty||'c7',g:o.g||'c7',q,ins:'正しいグラフを選ぼう',c:C6(ok,c,o.p),w:CL(w),chk:{t:'dotAll',AD,AB,v,ans:okp}};}
/* ===== 基礎計算 (1)（中2 の計算）と B(2)（連立方程式）：精査 2026-11-02 の決まり 3 で足した ===== */
const KT=(c,v,first)=>{if(c===0)return '';const s=(v&&Math.abs(c)===1)?(c<0?'-':'')+v:N(c)+v;return (first||c<0)?s:'+'+s;};
const KXY=(X,Y)=>{const s=KT(X,'x',true);const t=KT(Y,'y',!s);return (s+t)||'0';};
const KM=(c,ex,ey)=>{const v=(ex===1?'x':ex>1?`x^{${ex}}`:'')+(ey===1?'y':ey>1?`y^{${ey}}`:'');if(v&&Math.abs(c)===1)return (c<0?'-':'')+v;return N(c)+v;};
/* 単項式の乗除 A ÷ B × C（A・B・C＝[係数, x の次数, y の次数]） */
function mono(o){const [a,ax,ay]=o.A,[b,bx,by]=o.B,[c,cx,cy]=o.C;const k=a*c/b,ex=ax-bx+cx,ey=ay-by+cy;if(!Number.isInteger(k)||ex<0||ey<0)throw new Error('mono');
 const sB=KM(b,bx,by),sC=KM(c,cx,cy),dB=b<0?`(${sB})`:sB,dC=c<0?`(${sC})`:sC;const neg=[a,b,c].filter(v=>v<0).length;
 const q=M(R`${KM(a,ax,ay)}\div ${dB}\times ${dC}`);
 const allm=a/(b*c),gx=ax-bx-cx,gy=ay-by-cy;const mk=(cc,xx,yy)=>(xx<0||yy<0||!Number.isInteger(cc))?null:M(KM(cc,xx,yy));
 const ok=M(KM(k,ex,ey));
 const cs=PICK(ok,[mk(allm,gx,gy),mk(-k,ex,ey),mk(k,ax+cx,ey),(ay&&cy)?mk(k,ex,Math.max(ay,cy)):mk(k,ex,ey+1),mk(a*b*c,ax+bx+cx,ay+by+cy),mk(-allm,gx,gy),mk(k,ex+1,ey),mk(k%2===0?k/2:k*2,ex,ey)]);
 const w=XW.T.mono({},o.A,o.B,o.C,M(R`=${KM(k,ex,ey)}`));
 if(mk(allm,gx,gy))w.push(`#わる式は ${M(dB)} だけ。${M(R`${dB}\times ${dC}`)} をまとめてわったとすると ${mk(allm,gx,gy)} になる。左から順に計算する`);
 else w.push(`#符号のまちがいに気をつける。マイナスの数を数えずに計算したとすると ${mk(-k,ex,ey)} になる`);
 return {ty:o.ty||'b1',g:o.g||'b1',gh:'次の計算をしなさい。',q,c:C6(ok,cs,o.p),w:CL(w),chk:{t:'mono',A:o.A,B:o.B,C:o.C}};}
/* 分数の形の式の加減 A/p ± B/q（sg＝1・−1。A・B＝[x の係数, y の係数]） */
function fpoly(o){const [a1,a2]=o.A,[b1,b2]=o.B,p=o.p_,qq=o.q_,sg=o.sg;const L=p*qq/gcd(p,qq),m=L/p,mq=L/qq,n=mq*sg;const X=m*a1+n*b1,Y=m*a2+n*b2;
 const fr=(P,d)=>R`\dfrac{${KXY(P[0],P[1])}}{${d}}`;const op=sg>0?'+':'-';
 const q=M(fr(o.A,p)+op+fr(o.B,qq));
 const fk=(XX,YY,d,force)=>d===1?M(KXY(XX,YY)):(!force&&gcd(gcd(XX,YY),d)>1?null:M(R`\dfrac{${KXY(XX,YY)}}{${d}}`));   /* 約分できる形は、まちがいだとすぐ分かるので使わない */
 const eSign=fk(X,m*a2-n*b2,L,true),eDen=fk(X,Y,1);const ok=fk(X,Y,L);
 const cs=PICK(ok,[sg<0?eSign:null,eDen,fk(a1+sg*b1,a2+sg*b2,L),fk(X,a2+sg*b2,L),fk(mq*a1+sg*m*b1,mq*a2+sg*m*b2,L),fk(X,Y,p+qq),fk(-X,-Y,L),fk(X+L,Y,L),fk(X,Y+L,L)]);
 const w=XW.T.fpoly({},o.A,p,sg,o.B,qq,M(R`=\dfrac{${KXY(X,Y)}}{${L}}`));
 if(sg<0)w.push(`#ひく式の ${M(KT(b2,'y',true))} にも ${M(N(n))} をかける。符号を変え忘れて ${M(KT(-n*b2,'y',true))} としたとすると ${eSign} になる`);
 else w.push(`#式の計算では、分母をはらうことはできない。方程式と取りちがえて ${L} をかけたとすると ${eDen} になる`);
 return {ty:o.ty||'c1',g:o.g||'c1',gh:'次の計算をしなさい。',q,c:C6(ok,cs,o.p),w:CL(w),chk:{t:'fpoly',A:o.A,p:p,sg,B:o.B,q:qq}};}
/* 連立方程式（加減法）：係数が同じ文字を ① − ② で消す。e＝[x の係数, y の係数, 右辺] */
function kagen(o){const [a1,b1,c1]=o.e1,[a2,b2,c2]=o.e2;const det=a1*b2-a2*b1,x0=(c1*b2-c2*b1)/det,y0=(a1*c2-a2*c1)/det;if(!Number.isInteger(x0)||!Number.isInteger(y0))throw new Error('kagen');
 const elY=(b1===b2);if(!elY&&a1!==a2)throw new Error('kagen 係数');
 const kv=elY?a1-a2:b1-b2;
 const kk=(elY?a2:b2)*(elY?x0:y0),ko=elY?b2:a2,kn=elY?a2:b2,ot=elY?'y':'x';
 const w=XW.T.kagen({},o.e1,o.e2,M(R`x=${N(x0)},\ y=${N(y0)}`));
 const wo=[c2+kk,ko];const eMv=elY?[[x0,1],wo]:[wo,[y0,1]];
 const erv=[c2-c1,kv];const erw=[c2*kv-kn*(c2-c1),ko*kv];const eR=elY?[erv,erw]:[erw,erv];
 const FQ=a=>FR(a[0],a[1]);const PP=(A,B)=>M(R`x=${FQ(A)},\ y=${FQ(B)}`);
 const ok=PP([x0,1],[y0,1]),emv=PP(eMv[0],eMv[1]);
 const cs=PICK(ok,[emv,PP([y0,1],[x0,1]),PP(eR[0],eR[1]),PP([x0,1],[-y0,1]),PP([-x0,1],[y0,1]),PP([x0+1,1],[y0,1]),PP([-x0,1],[-y0,1])]);
 w.push(`#${M(N(kk))} を右辺へ移項するとき符号を変えずに ${M(KT(ko,ot,true)+'='+N(c2)+(kk>0?'+'+N(kk):N(kk)))} としたとすると ${emv} になる。移項すると符号が変わる`);
 return {ty:o.ty||'b2',g:o.g||'b2',gh:'次の連立方程式を解きなさい。',q:M(R`\begin{cases}${KXY(a1,b1)}=${N(c1)}\\${KXY(a2,b2)}=${N(c2)}\end{cases}`),c:C6(ok,cs,o.p),w:CL(w),chk:{t:'kagen',e1:o.e1,e2:o.e2,ans:[x0,y0]}};}
/* 連問にまとめる */
const REN=(ctx,fig,steps,g)=>({ren:true,g,q:ctx+'次の問いに答えなさい。'+G(fig),steps});
/* 類題（連問の型を1問に）：前の文と図をつけた単問 */
const ONE=(ctx,fig,st,g)=>({ty:st.ty,g,q:ctx+'<br>'+st.s+G(fig),c:st.c,w:st.w,chk:st.chk});
return {XW,R,N,T,M,U,EQ,FR,TM,GQ,RECT,TRI,G,dist,subst,bun,walk,dotAB,hm,lin,cross,stop,tri,area,frac,sys,round,dotAll,mono,fpoly,kagen,REN,ONE};
})();
return {"M2U4P5_H_G":(...a)=>M2U4P5_H.G(...a)};
})();
NS["gg_m2u5p4"]=(function(){
const M2U5P4_ZU=(()=>{
const FS='font-size="13"',RD='#FF4B00',GR='#6b7280';
const nr=v=>Math.round(v*100)/100;
const SVG=(W,H,b,lab)=>`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-label="${lab}">${b}</svg>`;
const ln=(x1,y1,x2,y2,st)=>`<line x1="${nr(x1)}" y1="${nr(y1)}" x2="${nr(x2)}" y2="${nr(y2)}" ${st||'stroke="#111" stroke-width="1.6"'}/>`;
const tx=(x,y,t,an,ex)=>`<text x="${nr(x)}" y="${nr(y)}" ${FS} text-anchor="${an||'middle'}" font-weight="700" ${ex||''}>${t}</text>`;
const tick=(a,b,n)=>{const [x1,y1]=a,[x2,y2]=b,mx=(x1+x2)/2,my=(y1+y2)/2,L=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/L,uy=(y2-y1)/L,vx=-uy,vy=ux;let s='';for(let i=0;i<n;i++){const o=(i-(n-1)/2)*4;s+=ln(mx+ux*o-vx*5,my+uy*o-vy*5,mx+ux*o+vx*5,my+uy*o+vy*5,`stroke="${RD}" stroke-width="1.6"`);}return s;};
const dir=(p,q)=>Math.atan2(-(q[1]-p[1]),q[0]-p[0])*180/Math.PI;
/* 頂点 v の、v→a と v→b の間の角に弧（n 本） */
const angm=(v,a,b,n,r)=>{let a1=dir(v,a),a2=dir(v,b);let d=((a2-a1)%360+360)%360;if(d>180){[a1,a2]=[a2,a1];d=360-d;}let s='';
 for(let i=0;i<n;i++){const R=(r||14)+i*4,P=t=>[v[0]+R*Math.cos(t*Math.PI/180),v[1]-R*Math.sin(t*Math.PI/180)],[x1,y1]=P(a1),[x2,y2]=P(a1+d);s+=`<path d="M${nr(x1)},${nr(y1)} A${R},${R} 0 0 0 ${nr(x2)},${nr(y2)}" fill="none" stroke="${RD}" stroke-width="1.6"/>`;}return s;};
const tri=(P)=>`<polygon points="${P.map(p=>p.map(nr).join(',')).join(' ')}" fill="none" stroke="#111" stroke-width="1.6"/>`;
/* 三角形の合同条件の3つの図。k＝この問題で使う条件（1〜3）に朱のわく */
function GOUDOU(k){let s='';const base=[[10,74],[78,74],[52,18]];const cap=['3組の辺','2組の辺と','1組の辺と'],cap2=['','その間の角','その両端の角'];
 for(let i=0;i<3;i++){const dx=i*98,P=base.map(p=>[p[0]+dx,p[1]]);s+=tri(P);
  if(i===0)s+=tick(P[0],P[1],1)+tick(P[1],P[2],2)+tick(P[2],P[0],3);
  if(i===1)s+=tick(P[0],P[1],1)+tick(P[2],P[0],2)+angm(P[0],P[1],P[2],1);
  if(i===2)s+=tick(P[0],P[1],1)+angm(P[0],P[1],P[2],1)+angm(P[1],P[2],P[0],2);
  if(k===i+1)s+=`<rect x="${dx+2}" y="6" width="94" height="${cap2[i]?114:98}" rx="6" fill="none" stroke="${RD}" stroke-width="2"/>`;
  s+=tx(dx+48,94,cap[i])+(cap2[i]?tx(dx+48,110,cap2[i]):'');}
 return SVG(296,124,s,'三角形の合同条件の図');}
/* 平行線と錯角（dou＝同位角の図もならべる） */
function SAKKAKU(dou){const one=(dx,kind)=>{const y1=30,y2=86,A=[dx+30,y1],B=[dx+130,y1],C=[dx+10,y2],D=[dx+110,y2],P=[dx+92,12],Q=[dx+44,104];let s=ln(A[0],y1,B[0],y1)+ln(C[0],y2,D[0],y2)+ln(P[0],P[1],Q[0],Q[1]);
  const X1=[dx+92-(y1-12)*48/92,y1],X2=[dx+92-(y2-12)*48/92,y2];s+=`<polygon points="${nr(dx+72)},${y1-4} ${nr(dx+80)},${y1} ${nr(dx+72)},${y1+4}" fill="#111"/><polygon points="${nr(dx+66)},${y2-4} ${nr(dx+74)},${y2} ${nr(dx+66)},${y2+4}" fill="#111"/>`;
  if(kind==='z')s+=angm(X1,[dx+10,y1],Q,1,16)+angm(X2,[dx+130,y2],P,1,16);else s+=angm(X1,[dx+150,y1],P,1,16)+angm(X2,[dx+150,y2],P,1,16);
  return s+tx(dx+70,124,kind==='z'?'錯角（Z の形）':'同位角（同じ向き）');};
 return dou?SVG(330,132,one(0,'z')+one(170,'f'),'錯角と同位角の図'):SVG(160,132,one(0,'z'),'平行線の錯角の図');}
/* 対頂角 */
function TAICHO(){const O=[80,60];let s=ln(14,24,146,96)+ln(14,96,146,24);s+=angm(O,[14,24],[14,96],1,18)+angm(O,[146,96],[146,24],1,18);
 return SVG(160,118,s+tx(80,114,'向かい合う角が等しい'),'対頂角の図');}
/* 三角形の外角 */
function GAIKAKU(){const A=[70,18],B=[16,92],C=[120,92];let s=tri([A,B,C])+ln(120,92,196,92);s+=angm(A,B,C,1,14)+angm(B,C,A,2,14)+angm(C,[196,92],A,1,18)+angm(C,[196,92],A,1,22);
 s+=tx(70,48,'●')+tx(44,86,'▲')+tx(150,72,'●＋▲','start',`fill="${RD}"`);return SVG(210,104,s,'三角形の外角の図');}
/* 一直線上の4点：AC と DB は等しい。BC は共通 */
function LINE4(p){const X=[24,94,170,236],Y=58;let s=ln(X[0],Y,X[3],Y,'stroke="#111" stroke-width="2"')+ln(X[1],Y,X[2],Y,`stroke="${RD}" stroke-width="4"`);
 const br=(x1,x2,y,up,t)=>{const d=up?-7:7;return `<path d="M${x1},${y} L${x1},${y+d} L${x2},${y+d} L${x2},${y}" fill="none" stroke="${GR}" stroke-width="1.3"/>`+tx((x1+x2)/2,up?y+d-5:y+d+14,t);};
 s+=br(X[0],X[2],Y-20,1,p[0]+p[2])+br(X[1],X[3],Y+20,0,p[3]+p[1]);X.forEach(x=>{s+=`<circle cx="${x}" cy="${Y}" r="3" fill="#111"/>`;});
 s+=tx(X[0]-6,Y+5,p[0],'end')+tx(X[1],Y-6,p[1])+tx(X[2],Y-6,p[2])+tx(X[3]+6,Y+5,p[3],'start');return SVG(262,110,s,'一直線上の4点の図');}
/* 水そうの水の量（帯の図） */
function SUISO(b,a,full){const W=250,x0=10,k=W/full,xb=x0+b*k;let s=`<rect x="${x0}" y="30" width="${nr(b*k)}" height="26" fill="#005AFF" fill-opacity=".30" stroke="#111" stroke-width="1.4"/><rect x="${nr(xb)}" y="30" width="${nr((full-b)*k)}" height="26" fill="#005AFF" fill-opacity=".12" stroke="#111" stroke-width="1.4"/>`;
 s+=tx(x0+b*k/2,48,b+' L')+tx(xb+(full-b)*k/2,48,a+' L × x 分')+tx(x0+b*k/2,22,'初め')+tx(xb+(full-b)*k/2,22,'入れた水')+`<path d="M${x0},64 L${x0},70 L${x0+W},70 L${x0+W},64" fill="none" stroke="${GR}" stroke-width="1.3"/>`+tx(x0+W/2,86,'満水 '+full+' L');
 return SVG(270,94,s,'水の量の図');}
/* 表 */
function TBL(rows){return `<table class="tb inc">${rows.map(r=>`<tr>${r.map((c,j)=>j===0?`<th style="min-width:24px;padding:1px 6px">${c}</th>`:`<td style="min-width:24px;padding:1px 6px">${c}</td>`).join('')}</tr>`).join('')}</table>`;}
return {GOUDOU,SAKKAKU,TAICHO,GAIKAKU,LINE4,SUISO,TBL};})();
return {"M2U5P4_ZU_GOUDOU":(...a)=>M2U5P4_ZU.GOUDOU(...a),"M2U5P4_ZU_SAKKAKU":(...a)=>M2U5P4_ZU.SAKKAKU(...a),"M2U5P4_ZU_TBL":(...a)=>M2U5P4_ZU.TBL(...a),"M2U5P4_ZU_GAIKAKU":(...a)=>M2U5P4_ZU.GAIKAKU(...a),"M2U5P4_ZU_SUISO":(...a)=>M2U5P4_ZU.SUISO(...a),"M2U5P4_ZU_LINE4":(...a)=>M2U5P4_ZU.LINE4(...a),"M2U5P4_ZU_TAICHO":(...a)=>M2U5P4_ZU.TAICHO(...a)};
})();
NS["gg_m3n18"]=(function(){
function NYGP(o){const u=o.u||16,v=o.v||1,[x0,x1]=o.xr,[y0,y1]=o.yr,pd=14,W=(x1-x0)*u+2*pd,Hh=(y1-y0)*u*v+2*pd,X=x=>pd+(x-x0)*u,Y=y=>pd+(y1-y)*u*v;
 const H='stroke="#fff" stroke-width="4" paint-order="stroke"',OR='#c2410c';
 const sw=o.w||Math.min(300,Math.round(W*1.0)),sh=Math.round(sw*Hh/W);
 let s=`<svg class="gr" viewBox="0 0 ${W} ${Hh}" width="${sw}" height="${sh}" font-family="sans-serif">`;
 if(o.grid){for(let i=Math.ceil(x0);i<=x1;i++)s+=`<line x1="${X(i)}" y1="${Y(y0)}" x2="${X(i)}" y2="${Y(y1)}" stroke="#d1d5db" stroke-width="1"/>`;for(let j=Math.ceil(y0);j<=y1;j++)s+=`<line x1="${X(x0)}" y1="${Y(j)}" x2="${X(x1)}" y2="${Y(j)}" stroke="#d1d5db" stroke-width="1"/>`;}
 (o.poly&&o.poly.length&&typeof o.poly[0][0]==='number'?[o.poly]:(o.poly||[])).forEach(P=>{s+=`<polygon points="${P.map(q=>X(q[0])+','+Y(q[1])).join(' ')}" fill="#fdba74" fill-opacity=".45" stroke="none"/>`;});
 if(o.yhl)s+=`<line x1="${X(0)}" y1="${Y(o.yhl[0])}" x2="${X(0)}" y2="${Y(o.yhl[1])}" stroke="${OR}" stroke-width="6" stroke-opacity=".6"/>`;
 if(o.xhl)s+=`<line x1="${X(o.xhl[0])}" y1="${Y(0)}" x2="${X(o.xhl[1])}" y2="${Y(0)}" stroke="${OR}" stroke-width="6" stroke-opacity=".6"/>`;
 if(y0<=0&&y1>=0)s+=`<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="#111" stroke-width="1.3"/><polygon points="${X(x1)},${Y(0)} ${X(x1)-7},${Y(0)-4} ${X(x1)-7},${Y(0)+4}" fill="#111"/><text x="${X(x1)-4}" y="${Y(0)-7}" font-size="13" font-style="italic" text-anchor="end">x</text>`;
 if(x0<=0&&x1>=0)s+=`<line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="#111" stroke-width="1.3"/><polygon points="${X(0)},${Y(y1)} ${X(0)-4},${Y(y1)+7} ${X(0)+4},${Y(y1)+7}" fill="#111"/><text x="${X(0)+7}" y="${Y(y1)+11}" font-size="13" font-style="italic">y</text>`;
 if(x0<=0&&x1>=0&&y0<=0&&y1>=0)s+=`<text x="${X(0)-4}" y="${Y(0)+14}" font-size="12" text-anchor="end" ${H}>O</text>`;
 if(o.grid){for(let i=Math.ceil(x0/2)*2;i<x1;i+=2)if(i)s+=`<text x="${X(i)}" y="${Y(0)+14}" font-size="11" text-anchor="middle" fill="#555" ${H}>${String(i).replace('-','−')}</text>`;for(let j=Math.ceil(y0/2)*2;j<y1;j+=2)if(j)s+=`<text x="${X(0)-5}" y="${Y(j)+4}" font-size="11" text-anchor="end" fill="#555" ${H}>${String(j).replace('-','−')}</text>`;}
 (o.tk||[]).forEach(k=>{if(k[0]==='x')s+=`<line x1="${X(k[1])}" y1="${Y(0)-3}" x2="${X(k[1])}" y2="${Y(0)+3}" stroke="#111"/><text x="${X(k[1])}" y="${Y(0)+(k[3]?-6:15)}" font-size="12" text-anchor="middle" ${H}>${k[2]}</text>`;else s+=`<line x1="${X(0)-3}" y1="${Y(k[1])}" x2="${X(0)+3}" y2="${Y(k[1])}" stroke="#111"/><text x="${X(0)+(k[3]?6:-6)}" y="${Y(k[1])+4}" font-size="12" text-anchor="${k[3]?'start':'end'}" ${H}>${k[2]}</text>`;});
 const clipPath=(f,a,b)=>{let d='',on=false;const N=160;for(let i=0;i<=N;i++){const x=a+(b-a)*i/N,y=f(x);if(y>=y0-.5&&y<=y1+.5&&isFinite(y)){d+=(on?'L':'M')+X(x).toFixed(1)+' '+Y(Math.max(y0-.5,Math.min(y1+.5,y))).toFixed(1);on=true;}else on=false;}return d;};
 const lab=(x,y,t)=>{if(t)s+=`<text x="${X(x)+5}" y="${Y(y)}" font-size="13" font-weight="700" ${H}>${t}</text>`;};
 (o.c||[]).forEach(c=>{s+=`<path d="${clipPath(x=>c[0]*x*x,x0,x1)}" fill="none" stroke="#111" stroke-width="2"/>`;if(c[1]){const lx=c[2]!=null?c[2]:x1*0.7;lab(lx,c[0]*lx*lx,c[1]);}});
 (o.h||[]).forEach(c=>{s+=`<path d="${clipPath(x=>c[0]/x,x0,-0.05)}" fill="none" stroke="#111" stroke-width="2"/><path d="${clipPath(x=>c[0]/x,0.05,x1)}" fill="none" stroke="#111" stroke-width="2"/>`;if(c[1]){const lx=c[2];lab(lx,c[0]/lx,c[1]);}});
 (o.l||[]).forEach(l=>{s+=`<path d="${clipPath(x=>l[0]*x+l[1],x0,x1)}" fill="none" stroke="#111" stroke-width="1.6"/>`;if(l[2]){const lx=l[3];lab(lx,l[0]*lx+l[1],l[2]);}});
 if(o.hl){const [k,a,b,f]=o.hl;s+=`<path d="${clipPath(x=>k*x*x,a,b)}" fill="none" stroke="${OR}" stroke-width="5"/>`;[[a,f&&f[0]],[b,f&&f[1]]].forEach(e=>{s+=`<circle cx="${X(e[0])}" cy="${Y(k*e[0]*e[0])}" r="4.5" fill="${e[1]==='o'?'#fff':OR}" stroke="${OR}" stroke-width="2"/>`;});}
 (o.s||[]).forEach(q=>{const st=q[4]===1?`stroke="${OR}" stroke-width="1.5" stroke-dasharray="4 3"`:q[4]===2?`stroke="${OR}" stroke-width="3.2"`:`stroke="#111" stroke-width="1.8"`;s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" ${st}/>`;});
 const OF={r:[8,4,'start'],l:[-8,4,'end'],t:[0,-9,'middle'],b:[0,18,'middle'],tr:[6,-7,'start'],tl:[-6,-7,'end'],br:[6,16,'start'],bl:[-6,16,'end']};
 (o.p||[]).forEach(q=>{const f=OF[q[3]||'tr'];s+=q[4]?`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="3.8" fill="#fff" stroke="#111" stroke-width="1.8"/>`:`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="3.8" fill="#111"/>`;if(q[2])s+=`<text x="${X(q[0])+f[0]}" y="${Y(q[1])+f[1]}" text-anchor="${f[2]}" font-size="13" font-weight="700" ${H}>${q[2]}</text>`;});
 (o.tx||[]).forEach(q=>{s+=`<text x="${X(q[0])}" y="${Y(q[1])}" text-anchor="${q[3]||'middle'}" font-size="12" font-weight="700" fill="${q[4]?OR:'#111'}" ${H}>${q[2]}</text>`;});
 return s+'</svg>';}
return {"NYGP":NYGP};
})();
NS["gg_m3n19"]=(function(){
function NYGP(o){const u=o.u||16,v=o.v||1,[x0,x1]=o.xr,[y0,y1]=o.yr,pd=14,W=(x1-x0)*u+2*pd,Hh=(y1-y0)*u*v+2*pd,X=x=>pd+(x-x0)*u,Y=y=>pd+(y1-y)*u*v;
 const H='stroke="#fff" stroke-width="4" paint-order="stroke"',OR='#c2410c';
 const sw=o.w||Math.min(300,Math.round(W*1.0)),sh=Math.round(sw*Hh/W);
 let s=`<svg class="gr" viewBox="0 0 ${W} ${Hh}" width="${sw}" height="${sh}" font-family="sans-serif">`;
 if(o.grid){for(let i=Math.ceil(x0);i<=x1;i++)s+=`<line x1="${X(i)}" y1="${Y(y0)}" x2="${X(i)}" y2="${Y(y1)}" stroke="#d1d5db" stroke-width="1"/>`;for(let j=Math.ceil(y0);j<=y1;j++)s+=`<line x1="${X(x0)}" y1="${Y(j)}" x2="${X(x1)}" y2="${Y(j)}" stroke="#d1d5db" stroke-width="1"/>`;}
 (o.poly&&o.poly.length&&typeof o.poly[0][0]==='number'?[o.poly]:(o.poly||[])).forEach(P=>{s+=`<polygon points="${P.map(q=>X(q[0])+','+Y(q[1])).join(' ')}" fill="#fdba74" fill-opacity=".45" stroke="none"/>`;});
 if(o.yhl)s+=`<line x1="${X(0)}" y1="${Y(o.yhl[0])}" x2="${X(0)}" y2="${Y(o.yhl[1])}" stroke="${OR}" stroke-width="6" stroke-opacity=".6"/>`;
 if(o.xhl)s+=`<line x1="${X(o.xhl[0])}" y1="${Y(0)}" x2="${X(o.xhl[1])}" y2="${Y(0)}" stroke="${OR}" stroke-width="6" stroke-opacity=".6"/>`;
 if(y0<=0&&y1>=0)s+=`<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="#111" stroke-width="1.3"/><polygon points="${X(x1)},${Y(0)} ${X(x1)-7},${Y(0)-4} ${X(x1)-7},${Y(0)+4}" fill="#111"/><text x="${X(x1)-4}" y="${Y(0)-7}" font-size="13" font-style="italic" text-anchor="end">x</text>`;
 if(x0<=0&&x1>=0)s+=`<line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="#111" stroke-width="1.3"/><polygon points="${X(0)},${Y(y1)} ${X(0)-4},${Y(y1)+7} ${X(0)+4},${Y(y1)+7}" fill="#111"/><text x="${X(0)+7}" y="${Y(y1)+11}" font-size="13" font-style="italic">y</text>`;
 if(x0<=0&&x1>=0&&y0<=0&&y1>=0)s+=`<text x="${X(0)-4}" y="${Y(0)+14}" font-size="12" text-anchor="end" ${H}>O</text>`;
 if(o.grid){for(let i=Math.ceil(x0/2)*2;i<x1;i+=2)if(i)s+=`<text x="${X(i)}" y="${Y(0)+14}" font-size="11" text-anchor="middle" fill="#555" ${H}>${String(i).replace('-','−')}</text>`;for(let j=Math.ceil(y0/2)*2;j<y1;j+=2)if(j)s+=`<text x="${X(0)-5}" y="${Y(j)+4}" font-size="11" text-anchor="end" fill="#555" ${H}>${String(j).replace('-','−')}</text>`;}
 (o.tk||[]).forEach(k=>{if(k[0]==='x')s+=`<line x1="${X(k[1])}" y1="${Y(0)-3}" x2="${X(k[1])}" y2="${Y(0)+3}" stroke="#111"/><text x="${X(k[1])}" y="${Y(0)+(k[3]?-6:15)}" font-size="12" text-anchor="middle" ${H}>${k[2]}</text>`;else s+=`<line x1="${X(0)-3}" y1="${Y(k[1])}" x2="${X(0)+3}" y2="${Y(k[1])}" stroke="#111"/><text x="${X(0)+(k[3]?6:-6)}" y="${Y(k[1])+4}" font-size="12" text-anchor="${k[3]?'start':'end'}" ${H}>${k[2]}</text>`;});
 const clipPath=(f,a,b)=>{let d='',on=false;const N=160;for(let i=0;i<=N;i++){const x=a+(b-a)*i/N,y=f(x);if(y>=y0-.5&&y<=y1+.5&&isFinite(y)){d+=(on?'L':'M')+X(x).toFixed(1)+' '+Y(Math.max(y0-.5,Math.min(y1+.5,y))).toFixed(1);on=true;}else on=false;}return d;};
 const lab=(x,y,t)=>{if(t)s+=`<text x="${X(x)+5}" y="${Y(y)}" font-size="13" font-weight="700" ${H}>${t}</text>`;};
 (o.c||[]).forEach(c=>{s+=`<path d="${clipPath(x=>c[0]*x*x,x0,x1)}" fill="none" stroke="#111" stroke-width="2"/>`;if(c[1]){const lx=c[2]!=null?c[2]:x1*0.7;lab(lx,c[0]*lx*lx,c[1]);}});
 (o.h||[]).forEach(c=>{s+=`<path d="${clipPath(x=>c[0]/x,x0,-0.05)}" fill="none" stroke="#111" stroke-width="2"/><path d="${clipPath(x=>c[0]/x,0.05,x1)}" fill="none" stroke="#111" stroke-width="2"/>`;if(c[1]){const lx=c[2];lab(lx,c[0]/lx,c[1]);}});
 (o.l||[]).forEach(l=>{s+=`<path d="${clipPath(x=>l[0]*x+l[1],x0,x1)}" fill="none" stroke="#111" stroke-width="1.6"/>`;if(l[2]){const lx=l[3];lab(lx,l[0]*lx+l[1],l[2]);}});
 if(o.hl){const [k,a,b,f]=o.hl;s+=`<path d="${clipPath(x=>k*x*x,a,b)}" fill="none" stroke="${OR}" stroke-width="5"/>`;[[a,f&&f[0]],[b,f&&f[1]]].forEach(e=>{s+=`<circle cx="${X(e[0])}" cy="${Y(k*e[0]*e[0])}" r="4.5" fill="${e[1]==='o'?'#fff':OR}" stroke="${OR}" stroke-width="2"/>`;});}
 (o.s||[]).forEach(q=>{const st=q[4]===1?`stroke="${OR}" stroke-width="1.5" stroke-dasharray="4 3"`:q[4]===2?`stroke="${OR}" stroke-width="3.2"`:`stroke="#111" stroke-width="1.8"`;s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" ${st}/>`;});
 const OF={r:[8,4,'start'],l:[-8,4,'end'],t:[0,-9,'middle'],b:[0,18,'middle'],tr:[6,-7,'start'],tl:[-6,-7,'end'],br:[6,16,'start'],bl:[-6,16,'end']};
 (o.p||[]).forEach(q=>{const f=OF[q[3]||'tr'];s+=q[4]?`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="3.8" fill="#fff" stroke="#111" stroke-width="1.8"/>`:`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="3.8" fill="#111"/>`;if(q[2])s+=`<text x="${X(q[0])+f[0]}" y="${Y(q[1])+f[1]}" text-anchor="${f[2]}" font-size="13" font-weight="700" ${H}>${q[2]}</text>`;});
 (o.tx||[]).forEach(q=>{s+=`<text x="${X(q[0])}" y="${Y(q[1])}" text-anchor="${q[3]||'middle'}" font-size="12" font-weight="700" fill="${q[4]?OR:'#111'}" ${H}>${q[2]}</text>`;});
 return s+'</svg>';}
return {"NYGP":NYGP};
})();
NS["gg_m3n20"]=(function(){
function NYGP(o){const u=o.u||16,v=o.v||1,[x0,x1]=o.xr,[y0,y1]=o.yr,pd=14,W=(x1-x0)*u+2*pd,Hh=(y1-y0)*u*v+2*pd,X=x=>pd+(x-x0)*u,Y=y=>pd+(y1-y)*u*v;
 const H='stroke="#fff" stroke-width="4" paint-order="stroke"',OR='#c2410c';
 const sw=o.w||Math.min(300,Math.round(W*1.0)),sh=Math.round(sw*Hh/W);
 let s=`<svg class="gr" viewBox="0 0 ${W} ${Hh}" width="${sw}" height="${sh}" font-family="sans-serif">`;
 if(o.grid){for(let i=Math.ceil(x0);i<=x1;i++)s+=`<line x1="${X(i)}" y1="${Y(y0)}" x2="${X(i)}" y2="${Y(y1)}" stroke="#d1d5db" stroke-width="1"/>`;for(let j=Math.ceil(y0);j<=y1;j++)s+=`<line x1="${X(x0)}" y1="${Y(j)}" x2="${X(x1)}" y2="${Y(j)}" stroke="#d1d5db" stroke-width="1"/>`;}
 (o.poly&&o.poly.length&&typeof o.poly[0][0]==='number'?[o.poly]:(o.poly||[])).forEach(P=>{s+=`<polygon points="${P.map(q=>X(q[0])+','+Y(q[1])).join(' ')}" fill="#fdba74" fill-opacity=".45" stroke="none"/>`;});
 if(o.yhl)s+=`<line x1="${X(0)}" y1="${Y(o.yhl[0])}" x2="${X(0)}" y2="${Y(o.yhl[1])}" stroke="${OR}" stroke-width="6" stroke-opacity=".6"/>`;
 if(o.xhl)s+=`<line x1="${X(o.xhl[0])}" y1="${Y(0)}" x2="${X(o.xhl[1])}" y2="${Y(0)}" stroke="${OR}" stroke-width="6" stroke-opacity=".6"/>`;
 if(y0<=0&&y1>=0)s+=`<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="#111" stroke-width="1.3"/><polygon points="${X(x1)},${Y(0)} ${X(x1)-7},${Y(0)-4} ${X(x1)-7},${Y(0)+4}" fill="#111"/><text x="${X(x1)-4}" y="${Y(0)-7}" font-size="13" font-style="italic" text-anchor="end">x</text>`;
 if(x0<=0&&x1>=0)s+=`<line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="#111" stroke-width="1.3"/><polygon points="${X(0)},${Y(y1)} ${X(0)-4},${Y(y1)+7} ${X(0)+4},${Y(y1)+7}" fill="#111"/><text x="${X(0)+7}" y="${Y(y1)+11}" font-size="13" font-style="italic">y</text>`;
 if(x0<=0&&x1>=0&&y0<=0&&y1>=0)s+=`<text x="${X(0)-4}" y="${Y(0)+14}" font-size="12" text-anchor="end" ${H}>O</text>`;
 if(o.grid){for(let i=Math.ceil(x0/2)*2;i<x1;i+=2)if(i)s+=`<text x="${X(i)}" y="${Y(0)+14}" font-size="11" text-anchor="middle" fill="#555" ${H}>${String(i).replace('-','−')}</text>`;for(let j=Math.ceil(y0/2)*2;j<y1;j+=2)if(j)s+=`<text x="${X(0)-5}" y="${Y(j)+4}" font-size="11" text-anchor="end" fill="#555" ${H}>${String(j).replace('-','−')}</text>`;}
 (o.tk||[]).forEach(k=>{if(k[0]==='x')s+=`<line x1="${X(k[1])}" y1="${Y(0)-3}" x2="${X(k[1])}" y2="${Y(0)+3}" stroke="#111"/><text x="${X(k[1])}" y="${Y(0)+(k[3]?-6:15)}" font-size="12" text-anchor="middle" ${H}>${k[2]}</text>`;else s+=`<line x1="${X(0)-3}" y1="${Y(k[1])}" x2="${X(0)+3}" y2="${Y(k[1])}" stroke="#111"/><text x="${X(0)+(k[3]?6:-6)}" y="${Y(k[1])+4}" font-size="12" text-anchor="${k[3]?'start':'end'}" ${H}>${k[2]}</text>`;});
 const clipPath=(f,a,b)=>{let d='',on=false;const N=160;for(let i=0;i<=N;i++){const x=a+(b-a)*i/N,y=f(x);if(y>=y0-.5&&y<=y1+.5&&isFinite(y)){d+=(on?'L':'M')+X(x).toFixed(1)+' '+Y(Math.max(y0-.5,Math.min(y1+.5,y))).toFixed(1);on=true;}else on=false;}return d;};
 const lab=(x,y,t)=>{if(t)s+=`<text x="${X(x)+5}" y="${Y(y)}" font-size="13" font-weight="700" ${H}>${t}</text>`;};
 (o.c||[]).forEach(c=>{s+=`<path d="${clipPath(x=>c[0]*x*x,x0,x1)}" fill="none" stroke="#111" stroke-width="2"/>`;if(c[1]){const lx=c[2]!=null?c[2]:x1*0.7;lab(lx,c[0]*lx*lx,c[1]);}});
 (o.h||[]).forEach(c=>{s+=`<path d="${clipPath(x=>c[0]/x,x0,-0.05)}" fill="none" stroke="#111" stroke-width="2"/><path d="${clipPath(x=>c[0]/x,0.05,x1)}" fill="none" stroke="#111" stroke-width="2"/>`;if(c[1]){const lx=c[2];lab(lx,c[0]/lx,c[1]);}});
 (o.l||[]).forEach(l=>{s+=`<path d="${clipPath(x=>l[0]*x+l[1],x0,x1)}" fill="none" stroke="#111" stroke-width="1.6"/>`;if(l[2]){const lx=l[3];lab(lx,l[0]*lx+l[1],l[2]);}});
 if(o.hl){const [k,a,b,f]=o.hl;s+=`<path d="${clipPath(x=>k*x*x,a,b)}" fill="none" stroke="${OR}" stroke-width="5"/>`;[[a,f&&f[0]],[b,f&&f[1]]].forEach(e=>{s+=`<circle cx="${X(e[0])}" cy="${Y(k*e[0]*e[0])}" r="4.5" fill="${e[1]==='o'?'#fff':OR}" stroke="${OR}" stroke-width="2"/>`;});}
 (o.s||[]).forEach(q=>{const st=q[4]===1?`stroke="${OR}" stroke-width="1.5" stroke-dasharray="4 3"`:q[4]===2?`stroke="${OR}" stroke-width="3.2"`:`stroke="#111" stroke-width="1.8"`;s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" ${st}/>`;});
 const OF={r:[8,4,'start'],l:[-8,4,'end'],t:[0,-9,'middle'],b:[0,18,'middle'],tr:[6,-7,'start'],tl:[-6,-7,'end'],br:[6,16,'start'],bl:[-6,16,'end']};
 (o.p||[]).forEach(q=>{const f=OF[q[3]||'tr'];s+=q[4]?`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="3.8" fill="#fff" stroke="#111" stroke-width="1.8"/>`:`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="3.8" fill="#111"/>`;if(q[2])s+=`<text x="${X(q[0])+f[0]}" y="${Y(q[1])+f[1]}" text-anchor="${f[2]}" font-size="13" font-weight="700" ${H}>${q[2]}</text>`;});
 (o.tx||[]).forEach(q=>{s+=`<text x="${X(q[0])}" y="${Y(q[1])}" text-anchor="${q[3]||'middle'}" font-size="12" font-weight="700" fill="${q[4]?OR:'#111'}" ${H}>${q[2]}</text>`;});
 return s+'</svg>';}
return {"NYGP":NYGP};
})();
NS["gg_m3n21"]=(function(){
const S=(o)=>{if(o.ren){o.steps.forEach(st=>st.a=st.c.r);}else o.a=o.c.r;return o;};
const M3N21_ZU=(()=>{
/* FIG({P:{A:[x,y],…}, segs:['AB',…], dash:['AB',…]（説明で足した線・赤の点線）, hid:['AB',…]（見えない辺・黒の点線）, thick:[['AB',赤か],…]（太い線）,
        ticks:[['AB',1,赤か],…], par:[['AB',1,赤か],…], angs:[['B','A','C',1,赤か,半径],…], shade:[['ABC','#c2410c'],…], dots:['O',…],
        texts:[[x,y,'40°',{dx,dy,it,red,size}],…], circ:[['AC',赤か],…],
        rings:[[cx,cy,r,{red,dash}],…]（円）, arcs:[[cx,cy,r,a1,a2,{red,w}],…]（円の弧。a1°から a2°へ左回り）,
        w:200, pad:20, lab:{A:角度(ラジアン・画面の向き)}})
   P の点にはすべて記号を付ける（付けない点は '_' で始まる名前）。座標は数学の向き（y は上向き） */
const FIG=(o)=>{
 const RED='#c2410c',SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
 const n_=v=>{let s=(Math.round(v*10)/10).toFixed(1);s=s.replace(/\.0$/,'');return s==='-0'?'0':s;};
 const seg=s=>s.indexOf('-')>=0?s.split('-'):(s.length===2?[s[0],s[1]]:[s[0],s.slice(1)]);
 const key=s=>{const a=seg(s);return a.slice().sort().join('');};
 const P=o.P,w=o.w||200,pad=o.pad==null?20:o.pad,texts=o.texts||[],rings=o.rings||[],arcs0=o.arcs||[];
 const xs=Object.values(P).map(p=>p[0]).concat(texts.map(t=>t[0])),ys=Object.values(P).map(p=>p[1]).concat(texts.map(t=>t[1]));
 rings.forEach(([cx,cy,r])=>{xs.push(cx-r,cx+r);ys.push(cy-r,cy+r);});
 arcs0.forEach(([cx,cy,r,a1,a2])=>{let b=a2;while(b<a1)b+=360;for(let a=a1;a<=b+1e-9;a+=5){xs.push(cx+r*Math.cos(a*Math.PI/180));ys.push(cy+r*Math.sin(a*Math.PI/180));}});
 const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 let sc=(w-2*pad)/Math.max(x1-x0,1e-9),H=(y1-y0)*sc+2*pad;
 if(H>w*1.1){sc=(w*1.1-2*pad)/(y1-y0);H=w*1.1;}
 const W=(x1-x0)*sc+2*pad,X=x=>pad+(x-x0)*sc,Y=y=>pad+(y1-y)*sc;
 const S={};Object.keys(P).forEach(k=>{S[k]=[X(P[k][0]),Y(P[k][1])];});
 const SEG=(o.segs||[]).map(seg),DSH=(o.dash||[]).map(seg),HID=(o.hid||[]).map(seg);
 const out=[`<svg class="${o.cls||'gr'}" viewBox="0 0 ${n_(W)} ${n_(H)}" width="${n_(W)}" height="${n_(H)}">`];
 (o.shade||[]).forEach(([t,col])=>{const v=t.indexOf('-')>=0?t.split('-'):t.split('');out.push(`<polygon points="${v.map(c=>n_(S[c][0])+','+n_(S[c][1])).join(' ')}" fill="${col}" fill-opacity=".14" stroke="none"/>`);});
 rings.forEach(([cx,cy,r,op])=>{op=op||{};out.push(`<circle cx="${n_(X(cx))}" cy="${n_(Y(cy))}" r="${n_(r*sc)}" fill="none" stroke="${op.red?RED:'#111'}" stroke-width="${op.red?1.6:1.8}"${op.dash?' stroke-dasharray="5 4"':''}/>`);});
 arcs0.forEach(([cx,cy,r,a1,a2,op])=>{op=op||{};let b=a2;while(b<a1)b+=360;const p=a=>[X(cx+r*Math.cos(a*Math.PI/180)),Y(cy+r*Math.sin(a*Math.PI/180))];const [ax,ay]=p(a1),[bx,by]=p(b);
  out.push(`<path d="M${n_(ax)} ${n_(ay)} A${n_(r*sc)} ${n_(r*sc)} 0 ${b-a1>180?1:0} 0 ${n_(bx)} ${n_(by)}" fill="none" stroke="${op.red?RED:'#111'}" stroke-width="${op.w||(op.red?4:1.8)}" stroke-linecap="round"/>`);});
 SEG.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`));
 HID.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="#111" stroke-width="1.5" stroke-dasharray="5 4"/>`));
 DSH.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="${RED}" stroke-width="1.6" stroke-dasharray="5 4"/>`));
 (o.thick||[]).forEach(([s,red])=>{const [a,b]=seg(s);out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="${red?RED:'#111'}" stroke-width="4" stroke-linecap="round"/>`);});
 const along=(a,b,t)=>[S[a][0]+(S[b][0]-S[a][0])*t,S[a][1]+(S[b][1]-S[a][1])*t];
 const clear=(a,b,tt)=>{const [ax,ay]=S[a],[bx,by]=S[b],L2=(bx-ax)**2+(by-ay)**2;const near=[];
  Object.keys(S).forEach(k=>{if(k===a||k===b)return;const [px,py]=S[k];const t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L2;const cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/Math.sqrt(L2);if(cr<1.5&&t>0&&t<1)near.push(t);});
  if(!near.some(t=>Math.abs(t-tt)<.13))return tt;for(const c of [.3,.7,.25,.75,.38,.62])if(!near.some(t=>Math.abs(t-c)<.13))return c;return tt;};
 const norm=(a,b)=>((S[b][0]<S[a][0]-1e-6)||(Math.abs(S[b][0]-S[a][0])<1e-6&&S[b][1]>S[a][1]))?[b,a]:[a,b];
 const pk=new Set((o.par||[]).map(p=>key(p[0]))),tk=new Set((o.ticks||[]).map(t=>key(t[0])));
 (o.ticks||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';if(pk.has(key(s)))[a,b]=norm(a,b);let tt=pk.has(key(s))?.62:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*4,cx=mx+ux*off,cy=my+uy*off;out.push(`<line x1="${n_(cx+nx*6)}" y1="${n_(cy+ny*6)}" x2="${n_(cx-nx*6)}" y2="${n_(cy-ny*6)}" stroke="${col}" stroke-width="2"/>`);}});
 (o.par||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';[a,b]=norm(a,b);let tt=tk.has(key(s))?.34:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*5+3,tx=mx+ux*off,ty=my+uy*off;out.push(`<polyline points="${n_(tx-ux*6+nx*5)},${n_(ty-uy*6+ny*5)} ${n_(tx)},${n_(ty)} ${n_(tx-ux*6-nx*5)},${n_(ty-uy*6-ny*5)}" fill="none" stroke="${col}" stroke-width="2"/>`);}});
 (o.circ||[]).forEach(([s,red])=>{const [a,b]=seg(s);const [mx,my]=along(a,b,.5);out.push(`<circle cx="${n_(mx)}" cy="${n_(my)}" r="4.5" fill="#fff" stroke="${red?RED:'#111'}" stroke-width="2"/>`);});
 const arcs={};
 (o.angs||[]).forEach(([p1,v,p2,n,red,r0])=>{const col=red?RED:'#111';const [vx,vy]=S[v];let a1=Math.atan2(S[p1][1]-vy,S[p1][0]-vx),a2=Math.atan2(S[p2][1]-vy,S[p2][0]-vx);
  let d=((a2-a1)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);if(d>Math.PI){[a1,a2]=[a2,a1];d=2*Math.PI-d;}const rb=r0||13;
  (arcs[v]=arcs[v]||[]).push([a1,d,rb+4*Math.max(n-1,0)]);
  if(Math.abs(d-Math.PI/2)<0.02&&n===-1){const q=9,ux=Math.cos(a1),uy=Math.sin(a1),wx=Math.cos(a1+d),wy=Math.sin(a1+d);out.push(`<polyline points="${n_(vx+ux*q)},${n_(vy+uy*q)} ${n_(vx+ux*q+wx*q)},${n_(vy+uy*q+wy*q)} ${n_(vx+wx*q)},${n_(vy+wy*q)}" fill="none" stroke="${col}" stroke-width="1.5"/>`);return;}
  for(let i=0;i<Math.max(n,1);i++){const r=rb+4*i;if(n===0){const am=a1+d/2;out.push(`<circle cx="${n_(vx+Math.cos(am)*12)}" cy="${n_(vy+Math.sin(am)*12)}" r="2.6" fill="${col}"/>`);break;}
   out.push(`<path d="M${n_(vx+Math.cos(a1)*r)} ${n_(vy+Math.sin(a1)*r)} A${r} ${r} 0 0 1 ${n_(vx+Math.cos(a1+d)*r)} ${n_(vy+Math.sin(a1+d)*r)}" fill="none" stroke="${col}" stroke-width="1.8"/>`);}});
 (o.dots||[]).forEach(k=>out.push(`<circle cx="${n_(S[k][0])}" cy="${n_(S[k][1])}" r="3" fill="#111"/>`));
 texts.forEach(([x,y,t,op])=>{op=op||{};out.push(`<text x="${n_(X(x)+(op.dx||0))}" y="${n_(Y(y)+(op.dy||0)+4)}" text-anchor="middle" font-size="${op.size||12}" font-weight="700"${op.it?' font-style="italic"':''}${op.red?' fill="'+RED+'"':''} ${SH}>${t}</text>`);});
 const free=k=>{const [px,py]=S[k];const dirs=[];SEG.concat(DSH,HID).forEach(([a,b])=>{const [ax,ay]=S[a],[bx,by]=S[b];
   if(k===a)dirs.push(Math.atan2(by-py,bx-px));else if(k===b)dirs.push(Math.atan2(ay-py,ax-px));
   else{const L=Math.hypot(bx-ax,by-ay),cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/L,t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L/L;if(cr<1.5&&t>0&&t<1){dirs.push(Math.atan2(by-py,bx-px));dirs.push(Math.atan2(ay-py,ax-px));}}});
  if(!dirs.length){const vs=Object.values(S);const cx=vs.reduce((s,v)=>s+v[0],0)/vs.length,cy=vs.reduce((s,v)=>s+v[1],0)/vs.length;return Math.atan2(py-cy,px-cx);}
  dirs.sort((a,b)=>a-b);let best=-9,ang=0;dirs.forEach((d,i)=>{const e=dirs[(i+1)%dirs.length]+(i===dirs.length-1?2*Math.PI:0);const m=(d+e)/2;let sc=e-d;
   if((arcs[k]||[]).some(([a1,dd])=>(((m-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<dd))sc-=Math.PI;if(sc>best){best=sc;ang=m;}});return ang;};
 Object.keys(S).forEach(k=>{if(k[0]==='_')return;const [px,py]=S[k];let ang=(o.lab||{})[k];if(ang==null)ang=free(k);let r=11;
  (arcs[k]||[]).forEach(([a1,d,rr])=>{if((((ang-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<d)r=Math.max(r,rr+10);});
  out.push(`<text x="${n_(px+Math.cos(ang)*r)}" y="${n_(py+Math.sin(ang)*r+5)}" text-anchor="middle" font-size="14" font-weight="700" ${SH}>${k}</text>`);});
 return out.join('')+'</svg>';};
/* 円錐：CONE({r:'底面の半径の字', h:'高さの字'（null なら高さの線をかかない・'' なら線だけ）, L:'母線の字', red:'h'|'L'|'r'（その線を赤く）, pts:true|'M'（頂点 O・底面の点 A〔・母線 OA の中点 M〕の記号）}) */
const ZT=(x,y,t,an,ex)=>`<text x="${Math.round(x*10)/10}" y="${Math.round(y*10)/10}" font-size="13" font-weight="700" text-anchor="${an||'middle'}" stroke="#fff" stroke-width="4" paint-order="stroke" ${ex||''}>${t}</text>`;
const CONE=(o)=>{const W=210,H=190,cx=96,top=18,by=150,rx=62,ry=16,RED='#c2410c',cl=k=>o.red===k?RED:'#111';
 let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="sans-serif">`;
 s+=`<path d="M${cx-rx} ${by} A${rx} ${ry} 0 0 0 ${cx+rx} ${by}" fill="none" stroke="#111" stroke-width="1.8"/><path d="M${cx-rx} ${by} A${rx} ${ry} 0 0 1 ${cx+rx} ${by}" fill="none" stroke="#111" stroke-width="1.4" stroke-dasharray="5 4"/>`;
 s+=`<line x1="${cx}" y1="${top}" x2="${cx-rx}" y2="${by}" stroke="#111" stroke-width="1.8"/><line x1="${cx}" y1="${top}" x2="${cx+rx}" y2="${by}" stroke="${cl('L')}" stroke-width="${o.red==='L'?3:1.8}"/>`;
 if(o.h!=null)s+=`<line x1="${cx}" y1="${top}" x2="${cx}" y2="${by}" stroke="${cl('h')}" stroke-width="${o.red==='h'?2.6:1.4}" stroke-dasharray="5 4"/><polyline points="${cx},${by-9} ${cx+9},${by-9} ${cx+9},${by}" fill="none" stroke="#111" stroke-width="1.2"/>`+(o.h?ZT(cx-6,(top+by)/2+4,o.h,'end',o.red==='h'?'fill="'+RED+'"':''):'');
 if(o.r)s+=`<line x1="${cx}" y1="${by}" x2="${cx+rx}" y2="${by}" stroke="${cl('r')}" stroke-width="${o.red==='r'?2.6:1.4}"/>`+ZT(cx+rx/2,by+ry+14,o.r);
 if(o.L)s+=ZT(cx+rx/2+14,(top+by)/2-2,o.L,'start',o.red==='L'?'fill="'+RED+'"':'');
 if(o.pts){s+=ZT(cx,top-4,'O')+ZT(cx+rx+10,by+5,'A')+`<circle cx="${cx+rx}" cy="${by}" r="2.6" fill="#111"/>`;
  if(o.pts==='M'){const mx=(cx+cx+rx)/2,my=(top+by)/2;s+=`<circle cx="${mx}" cy="${my}" r="3" fill="#111"/>`+ZT(mx+12,my+12,'M','start');}}
 s+=`<circle cx="${cx}" cy="${by}" r="2.6" fill="#111"/>`;return s+'</svg>';};
return {FIG,CONE};})();
return {"M3N21_ZU_FIG":(...a)=>M3N21_ZU.FIG(...a)};
})();
NS["gg_m3n22"]=(function(){
const S=(o)=>{if(o.ren){o.steps.forEach(st=>st.a=st.c.r);}else o.a=o.c.r;return o;};
const M3N22_ZU=(()=>{
/* FIG({P:{A:[x,y],…}, segs:['AB',…], dash:['AB',…]（説明で足した線・赤の点線）, hid:['AB',…]（見えない辺・黒の点線）, thick:[['AB',赤か],…]（太い線）,
        ticks:[['AB',1,赤か],…], par:[['AB',1,赤か],…], angs:[['B','A','C',1,赤か,半径],…], shade:[['ABC','#c2410c'],…], dots:['O',…],
        texts:[[x,y,'40°',{dx,dy,it,red,size}],…]（字に \dfrac{分子}{分母} があれば分数を縦にかく）, circ:[['AC',赤か],…],
        rings:[[cx,cy,r,{red,dash}],…]（円）, arcs:[[cx,cy,r,a1,a2,{red,w}],…]（円の弧。a1°から a2°へ左回り）,
        w:200, pad:20, lab:{A:角度(ラジアン・画面の向き)}})
   P の点にはすべて記号を付ける（付けない点は '_' で始まる名前）。座標は数学の向き（y は上向き） */
const FIG=(o)=>{
 const RED='#c2410c',SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
 const n_=v=>{let s=(Math.round(v*10)/10).toFixed(1);s=s.replace(/\.0$/,'');return s==='-0'?'0':s;};
 const seg=s=>s.indexOf('-')>=0?s.split('-'):(s.length===2?[s[0],s[1]]:[s[0],s.slice(1)]);
 const key=s=>{const a=seg(s);return a.slice().sort().join('');};
 const P=o.P,w=o.w||200,pad=o.pad==null?20:o.pad,texts=o.texts||[],rings=o.rings||[],arcs0=o.arcs||[];
 const xs=Object.values(P).map(p=>p[0]).concat(texts.map(t=>t[0])),ys=Object.values(P).map(p=>p[1]).concat(texts.map(t=>t[1]));
 rings.forEach(([cx,cy,r])=>{xs.push(cx-r,cx+r);ys.push(cy-r,cy+r);});
 arcs0.forEach(([cx,cy,r,a1,a2])=>{let b=a2;while(b<a1)b+=360;for(let a=a1;a<=b+1e-9;a+=5){xs.push(cx+r*Math.cos(a*Math.PI/180));ys.push(cy+r*Math.sin(a*Math.PI/180));}});
 const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 let sc=(w-2*pad)/Math.max(x1-x0,1e-9),H=(y1-y0)*sc+2*pad;
 if(H>w*1.1){sc=(w*1.1-2*pad)/(y1-y0);H=w*1.1;}
 const W=(x1-x0)*sc+2*pad,X=x=>pad+(x-x0)*sc,Y=y=>pad+(y1-y)*sc;
 const S={};Object.keys(P).forEach(k=>{S[k]=[X(P[k][0]),Y(P[k][1])];});
 const SEG=(o.segs||[]).map(seg),DSH=(o.dash||[]).map(seg),HID=(o.hid||[]).map(seg);
 const out=[`<svg class="${o.cls||'gr'}" viewBox="0 0 ${n_(W)} ${n_(H)}" width="${n_(W)}" height="${n_(H)}">`];
 (o.shade||[]).forEach(([t,col])=>{const v=t.indexOf('-')>=0?t.split('-'):t.split('');out.push(`<polygon points="${v.map(c=>n_(S[c][0])+','+n_(S[c][1])).join(' ')}" fill="${col}" fill-opacity=".14" stroke="none"/>`);});
 rings.forEach(([cx,cy,r,op])=>{op=op||{};out.push(`<circle cx="${n_(X(cx))}" cy="${n_(Y(cy))}" r="${n_(r*sc)}" fill="none" stroke="${op.red?RED:'#111'}" stroke-width="${op.red?1.6:1.8}"${op.dash?' stroke-dasharray="5 4"':''}/>`);});
 arcs0.forEach(([cx,cy,r,a1,a2,op])=>{op=op||{};let b=a2;while(b<a1)b+=360;const p=a=>[X(cx+r*Math.cos(a*Math.PI/180)),Y(cy+r*Math.sin(a*Math.PI/180))];const [ax,ay]=p(a1),[bx,by]=p(b);
  out.push(`<path d="M${n_(ax)} ${n_(ay)} A${n_(r*sc)} ${n_(r*sc)} 0 ${b-a1>180?1:0} 0 ${n_(bx)} ${n_(by)}" fill="none" stroke="${op.red?RED:'#111'}" stroke-width="${op.w||(op.red?4:1.8)}" stroke-linecap="round"/>`);});
 SEG.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`));
 HID.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="#111" stroke-width="1.5" stroke-dasharray="5 4"/>`));
 DSH.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="${RED}" stroke-width="1.6" stroke-dasharray="5 4"/>`));
 (o.thick||[]).forEach(([s,red])=>{const [a,b]=seg(s);out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="${red?RED:'#111'}" stroke-width="4" stroke-linecap="round"/>`);});
 const along=(a,b,t)=>[S[a][0]+(S[b][0]-S[a][0])*t,S[a][1]+(S[b][1]-S[a][1])*t];
 const clear=(a,b,tt)=>{const [ax,ay]=S[a],[bx,by]=S[b],L2=(bx-ax)**2+(by-ay)**2;const near=[];
  Object.keys(S).forEach(k=>{if(k===a||k===b)return;const [px,py]=S[k];const t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L2;const cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/Math.sqrt(L2);if(cr<1.5&&t>0&&t<1)near.push(t);});
  if(!near.some(t=>Math.abs(t-tt)<.13))return tt;for(const c of [.3,.7,.25,.75,.38,.62])if(!near.some(t=>Math.abs(t-c)<.13))return c;return tt;};
 const norm=(a,b)=>((S[b][0]<S[a][0]-1e-6)||(Math.abs(S[b][0]-S[a][0])<1e-6&&S[b][1]>S[a][1]))?[b,a]:[a,b];
 const pk=new Set((o.par||[]).map(p=>key(p[0]))),tk=new Set((o.ticks||[]).map(t=>key(t[0])));
 (o.ticks||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';if(pk.has(key(s)))[a,b]=norm(a,b);let tt=pk.has(key(s))?.62:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*4,cx=mx+ux*off,cy=my+uy*off;out.push(`<line x1="${n_(cx+nx*6)}" y1="${n_(cy+ny*6)}" x2="${n_(cx-nx*6)}" y2="${n_(cy-ny*6)}" stroke="${col}" stroke-width="2"/>`);}});
 (o.par||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';[a,b]=norm(a,b);let tt=tk.has(key(s))?.34:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*5+3,tx=mx+ux*off,ty=my+uy*off;out.push(`<polyline points="${n_(tx-ux*6+nx*5)},${n_(ty-uy*6+ny*5)} ${n_(tx)},${n_(ty)} ${n_(tx-ux*6-nx*5)},${n_(ty-uy*6-ny*5)}" fill="none" stroke="${col}" stroke-width="2"/>`);}});
 (o.circ||[]).forEach(([s,red])=>{const [a,b]=seg(s);const [mx,my]=along(a,b,.5);out.push(`<circle cx="${n_(mx)}" cy="${n_(my)}" r="4.5" fill="#fff" stroke="${red?RED:'#111'}" stroke-width="2"/>`);});
 const arcs={};
 (o.angs||[]).forEach(([p1,v,p2,n,red,r0])=>{const col=red?RED:'#111';const [vx,vy]=S[v];let a1=Math.atan2(S[p1][1]-vy,S[p1][0]-vx),a2=Math.atan2(S[p2][1]-vy,S[p2][0]-vx);
  let d=((a2-a1)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);if(d>Math.PI){[a1,a2]=[a2,a1];d=2*Math.PI-d;}const rb=r0||13;
  (arcs[v]=arcs[v]||[]).push([a1,d,rb+4*Math.max(n-1,0)]);
  if(Math.abs(d-Math.PI/2)<0.02&&n===-1){const q=9,ux=Math.cos(a1),uy=Math.sin(a1),wx=Math.cos(a1+d),wy=Math.sin(a1+d);out.push(`<polyline points="${n_(vx+ux*q)},${n_(vy+uy*q)} ${n_(vx+ux*q+wx*q)},${n_(vy+uy*q+wy*q)} ${n_(vx+wx*q)},${n_(vy+wy*q)}" fill="none" stroke="${col}" stroke-width="1.5"/>`);return;}
  for(let i=0;i<Math.max(n,1);i++){const r=rb+4*i;if(n===0){const am=a1+d/2;out.push(`<circle cx="${n_(vx+Math.cos(am)*12)}" cy="${n_(vy+Math.sin(am)*12)}" r="2.6" fill="${col}"/>`);break;}
   out.push(`<path d="M${n_(vx+Math.cos(a1)*r)} ${n_(vy+Math.sin(a1)*r)} A${r} ${r} 0 0 1 ${n_(vx+Math.cos(a1+d)*r)} ${n_(vy+Math.sin(a1+d)*r)}" fill="none" stroke="${col}" stroke-width="1.8"/>`);}});
 (o.dots||[]).forEach(k=>out.push(`<circle cx="${n_(S[k][0])}" cy="${n_(S[k][1])}" r="3" fill="#111"/>`));
 /* 図の字に分数（\dfrac{分子}{分母}）があれば、分数を縦に（分子・横線・分母）かき、前後の字は横に並べる（2026-11-03） */
 const tw=(s,f)=>[...s].reduce((a,c)=>a+(/[\x20-\x7e]/.test(c)?(c===' '?.3:.6):1)*f,0);
 texts.forEach(([x,y,t,op])=>{op=op||{};const f=op.size||12,cx=X(x)+(op.dx||0),cy=Y(y)+(op.dy||0),at=`font-size="${f}" font-weight="700"${op.it?' font-style="italic"':''}${op.red?' fill="'+RED+'"':''} ${SH}`;
  const m=/\\dfrac\{(\d+)\}\{(\d+)\}/.exec(t);
  if(!m){out.push(`<text x="${n_(cx)}" y="${n_(cy+4)}" text-anchor="middle" ${at}>${t}</text>`);return;}
  const pre=t.slice(0,m.index),post=t.slice(m.index+m[0].length),fs=f,fw=Math.max(tw(m[1],fs),tw(m[2],fs))+4,wp=tw(pre,f),wq=tw(post,f),x0=cx-(wp+fw+wq)/2,fc=x0+wp+fw/2;
  if(pre)out.push(`<text x="${n_(x0)}" y="${n_(cy+4)}" text-anchor="start" ${at}>${pre}</text>`);
  out.push(`<line x1="${n_(fc-fw/2)}" y1="${n_(cy)}" x2="${n_(fc+fw/2)}" y2="${n_(cy)}" stroke="#fff" stroke-width="4"/><line x1="${n_(fc-fw/2)}" y1="${n_(cy)}" x2="${n_(fc+fw/2)}" y2="${n_(cy)}" stroke="${op.red?RED:'#111'}" stroke-width="1.3"/>`);
  out.push(`<text x="${n_(fc)}" y="${n_(cy-2.5)}" text-anchor="middle" ${at.replace('font-size="'+f+'"','font-size="'+fs+'"')}>${m[1]}</text><text x="${n_(fc)}" y="${n_(cy+fs-0.5)}" text-anchor="middle" ${at.replace('font-size="'+f+'"','font-size="'+fs+'"')}>${m[2]}</text>`);
  if(post)out.push(`<text x="${n_(x0+wp+fw)}" y="${n_(cy+4)}" text-anchor="start" ${at}>${post}</text>`);});
 const free=k=>{const [px,py]=S[k];const dirs=[];SEG.concat(DSH,HID).forEach(([a,b])=>{const [ax,ay]=S[a],[bx,by]=S[b];
   if(k===a)dirs.push(Math.atan2(by-py,bx-px));else if(k===b)dirs.push(Math.atan2(ay-py,ax-px));
   else{const L=Math.hypot(bx-ax,by-ay),cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/L,t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L/L;if(cr<1.5&&t>0&&t<1){dirs.push(Math.atan2(by-py,bx-px));dirs.push(Math.atan2(ay-py,ax-px));}}});
  if(!dirs.length){const vs=Object.values(S);const cx=vs.reduce((s,v)=>s+v[0],0)/vs.length,cy=vs.reduce((s,v)=>s+v[1],0)/vs.length;return Math.atan2(py-cy,px-cx);}
  dirs.sort((a,b)=>a-b);let best=-9,ang=0;dirs.forEach((d,i)=>{const e=dirs[(i+1)%dirs.length]+(i===dirs.length-1?2*Math.PI:0);const m=(d+e)/2;let sc=e-d;
   if((arcs[k]||[]).some(([a1,dd])=>(((m-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<dd))sc-=Math.PI;if(sc>best){best=sc;ang=m;}});return ang;};
 Object.keys(S).forEach(k=>{if(k[0]==='_')return;const [px,py]=S[k];let ang=(o.lab||{})[k];if(ang==null)ang=free(k);let r=11;
  (arcs[k]||[]).forEach(([a1,d,rr])=>{if((((ang-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<d)r=Math.max(r,rr+10);});
  out.push(`<text x="${n_(px+Math.cos(ang)*r)}" y="${n_(py+Math.sin(ang)*r+5)}" text-anchor="middle" font-size="14" font-weight="700" ${SH}>${k}</text>`);});
 return out.join('')+'</svg>';};
/* 円錐：CONE({r:'底面の半径の字', h:'高さの字'（null なら高さの線をかかない・'' なら線だけ）, L:'母線の字', red:'h'|'L'|'r'（その線を赤く）, pts:true|'M'（頂点 O・底面の点 A〔・母線 OA の中点 M〕の記号）}) */
const ZT=(x,y,t,an,ex)=>`<text x="${Math.round(x*10)/10}" y="${Math.round(y*10)/10}" font-size="13" font-weight="700" text-anchor="${an||'middle'}" stroke="#fff" stroke-width="4" paint-order="stroke" ${ex||''}>${t}</text>`;
const CONE=(o)=>{const W=210,H=190,cx=96,top=18,by=150,rx=62,ry=16,RED='#c2410c',cl=k=>o.red===k?RED:'#111';
 let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="sans-serif">`;
 s+=`<path d="M${cx-rx} ${by} A${rx} ${ry} 0 0 0 ${cx+rx} ${by}" fill="none" stroke="#111" stroke-width="1.8"/><path d="M${cx-rx} ${by} A${rx} ${ry} 0 0 1 ${cx+rx} ${by}" fill="none" stroke="#111" stroke-width="1.4" stroke-dasharray="5 4"/>`;
 s+=`<line x1="${cx}" y1="${top}" x2="${cx-rx}" y2="${by}" stroke="#111" stroke-width="1.8"/><line x1="${cx}" y1="${top}" x2="${cx+rx}" y2="${by}" stroke="${cl('L')}" stroke-width="${o.red==='L'?3:1.8}"/>`;
 if(o.h!=null)s+=`<line x1="${cx}" y1="${top}" x2="${cx}" y2="${by}" stroke="${cl('h')}" stroke-width="${o.red==='h'?2.6:1.4}" stroke-dasharray="5 4"/><polyline points="${cx},${by-9} ${cx+9},${by-9} ${cx+9},${by}" fill="none" stroke="#111" stroke-width="1.2"/>`+(o.h?ZT(cx-6,(top+by)/2+4,o.h,'end',o.red==='h'?'fill="'+RED+'"':''):'');
 if(o.r)s+=`<line x1="${cx}" y1="${by}" x2="${cx+rx}" y2="${by}" stroke="${cl('r')}" stroke-width="${o.red==='r'?2.6:1.4}"/>`+ZT(cx+rx/2,by+ry+14,o.r);
 if(o.L)s+=ZT(cx+rx/2+14,(top+by)/2-2,o.L,'start',o.red==='L'?'fill="'+RED+'"':'');
 if(o.pts){s+=ZT(cx,top-4,'O')+ZT(cx+rx+10,by+5,'A')+`<circle cx="${cx+rx}" cy="${by}" r="2.6" fill="#111"/>`;
  if(o.pts==='M'){const mx=(cx+cx+rx)/2,my=(top+by)/2;s+=`<circle cx="${mx}" cy="${my}" r="3" fill="#111"/>`+ZT(mx+12,my+12,'M','start');}}
 s+=`<circle cx="${cx}" cy="${by}" r="2.6" fill="#111"/>`;return s+'</svg>';};
return {FIG,CONE};})();
return {"M3N22_ZU_FIG":(...a)=>M3N22_ZU.FIG(...a)};
})();
NS["gg_m3n23"]=(function(){
const S=(o)=>{if(o.ren){o.steps.forEach(st=>st.a=st.c.r);}else o.a=o.c.r;return o;};
const M3N23_ZU=(()=>{
/* FIG({P:{A:[x,y],…}, segs:['AB',…], dash:['AB',…]（説明で足した線・赤の点線）, hid:['AB',…]（見えない辺・黒の点線）, thick:[['AB',赤か],…]（太い線）,
        ticks:[['AB',1,赤か],…], par:[['AB',1,赤か],…], angs:[['B','A','C',1,赤か,半径],…], shade:[['ABC','#c2410c'],…], dots:['O',…],
        texts:[[x,y,'40°',{dx,dy,it,red,size}],…], circ:[['AC',赤か],…],
        rings:[[cx,cy,r,{red,dash}],…]（円）, arcs:[[cx,cy,r,a1,a2,{red,w}],…]（円の弧。a1°から a2°へ左回り）,
        w:200, pad:20, lab:{A:角度(ラジアン・画面の向き)}})
   P の点にはすべて記号を付ける（付けない点は '_' で始まる名前）。座標は数学の向き（y は上向き） */
const FIG=(o)=>{
 const RED='#c2410c',SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
 const n_=v=>{let s=(Math.round(v*10)/10).toFixed(1);s=s.replace(/\.0$/,'');return s==='-0'?'0':s;};
 const seg=s=>s.indexOf('-')>=0?s.split('-'):(s.length===2?[s[0],s[1]]:[s[0],s.slice(1)]);
 const key=s=>{const a=seg(s);return a.slice().sort().join('');};
 const P=o.P,w=o.w||200,pad=o.pad==null?20:o.pad,texts=o.texts||[],rings=o.rings||[],arcs0=o.arcs||[];
 const xs=Object.values(P).map(p=>p[0]).concat(texts.map(t=>t[0])),ys=Object.values(P).map(p=>p[1]).concat(texts.map(t=>t[1]));
 rings.forEach(([cx,cy,r])=>{xs.push(cx-r,cx+r);ys.push(cy-r,cy+r);});
 arcs0.forEach(([cx,cy,r,a1,a2])=>{let b=a2;while(b<a1)b+=360;for(let a=a1;a<=b+1e-9;a+=5){xs.push(cx+r*Math.cos(a*Math.PI/180));ys.push(cy+r*Math.sin(a*Math.PI/180));}});
 const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 let sc=(w-2*pad)/Math.max(x1-x0,1e-9),H=(y1-y0)*sc+2*pad;
 if(H>w*1.1){sc=(w*1.1-2*pad)/(y1-y0);H=w*1.1;}
 const W=(x1-x0)*sc+2*pad,X=x=>pad+(x-x0)*sc,Y=y=>pad+(y1-y)*sc;
 const S={};Object.keys(P).forEach(k=>{S[k]=[X(P[k][0]),Y(P[k][1])];});
 const SEG=(o.segs||[]).map(seg),DSH=(o.dash||[]).map(seg),HID=(o.hid||[]).map(seg);
 const out=[`<svg class="${o.cls||'gr'}" viewBox="0 0 ${n_(W)} ${n_(H)}" width="${n_(W)}" height="${n_(H)}">`];
 (o.shade||[]).forEach(([t,col])=>{const v=t.indexOf('-')>=0?t.split('-'):t.split('');out.push(`<polygon points="${v.map(c=>n_(S[c][0])+','+n_(S[c][1])).join(' ')}" fill="${col}" fill-opacity=".14" stroke="none"/>`);});
 rings.forEach(([cx,cy,r,op])=>{op=op||{};out.push(`<circle cx="${n_(X(cx))}" cy="${n_(Y(cy))}" r="${n_(r*sc)}" fill="none" stroke="${op.red?RED:'#111'}" stroke-width="${op.red?1.6:1.8}"${op.dash?' stroke-dasharray="5 4"':''}/>`);});
 arcs0.forEach(([cx,cy,r,a1,a2,op])=>{op=op||{};let b=a2;while(b<a1)b+=360;const p=a=>[X(cx+r*Math.cos(a*Math.PI/180)),Y(cy+r*Math.sin(a*Math.PI/180))];const [ax,ay]=p(a1),[bx,by]=p(b);
  out.push(`<path d="M${n_(ax)} ${n_(ay)} A${n_(r*sc)} ${n_(r*sc)} 0 ${b-a1>180?1:0} 0 ${n_(bx)} ${n_(by)}" fill="none" stroke="${op.red?RED:'#111'}" stroke-width="${op.w||(op.red?4:1.8)}" stroke-linecap="round"/>`);});
 SEG.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`));
 HID.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="#111" stroke-width="1.5" stroke-dasharray="5 4"/>`));
 DSH.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="${RED}" stroke-width="1.6" stroke-dasharray="5 4"/>`));
 (o.thick||[]).forEach(([s,red])=>{const [a,b]=seg(s);out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="${red?RED:'#111'}" stroke-width="4" stroke-linecap="round"/>`);});
 const along=(a,b,t)=>[S[a][0]+(S[b][0]-S[a][0])*t,S[a][1]+(S[b][1]-S[a][1])*t];
 const clear=(a,b,tt)=>{const [ax,ay]=S[a],[bx,by]=S[b],L2=(bx-ax)**2+(by-ay)**2;const near=[];
  Object.keys(S).forEach(k=>{if(k===a||k===b)return;const [px,py]=S[k];const t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L2;const cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/Math.sqrt(L2);if(cr<1.5&&t>0&&t<1)near.push(t);});
  if(!near.some(t=>Math.abs(t-tt)<.13))return tt;for(const c of [.3,.7,.25,.75,.38,.62])if(!near.some(t=>Math.abs(t-c)<.13))return c;return tt;};
 const norm=(a,b)=>((S[b][0]<S[a][0]-1e-6)||(Math.abs(S[b][0]-S[a][0])<1e-6&&S[b][1]>S[a][1]))?[b,a]:[a,b];
 const pk=new Set((o.par||[]).map(p=>key(p[0]))),tk=new Set((o.ticks||[]).map(t=>key(t[0])));
 (o.ticks||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';if(pk.has(key(s)))[a,b]=norm(a,b);let tt=pk.has(key(s))?.62:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*4,cx=mx+ux*off,cy=my+uy*off;out.push(`<line x1="${n_(cx+nx*6)}" y1="${n_(cy+ny*6)}" x2="${n_(cx-nx*6)}" y2="${n_(cy-ny*6)}" stroke="${col}" stroke-width="2"/>`);}});
 (o.par||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';[a,b]=norm(a,b);let tt=tk.has(key(s))?.34:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*5+3,tx=mx+ux*off,ty=my+uy*off;out.push(`<polyline points="${n_(tx-ux*6+nx*5)},${n_(ty-uy*6+ny*5)} ${n_(tx)},${n_(ty)} ${n_(tx-ux*6-nx*5)},${n_(ty-uy*6-ny*5)}" fill="none" stroke="${col}" stroke-width="2"/>`);}});
 (o.circ||[]).forEach(([s,red])=>{const [a,b]=seg(s);const [mx,my]=along(a,b,.5);out.push(`<circle cx="${n_(mx)}" cy="${n_(my)}" r="4.5" fill="#fff" stroke="${red?RED:'#111'}" stroke-width="2"/>`);});
 const arcs={};
 (o.angs||[]).forEach(([p1,v,p2,n,red,r0])=>{const col=red?RED:'#111';const [vx,vy]=S[v];let a1=Math.atan2(S[p1][1]-vy,S[p1][0]-vx),a2=Math.atan2(S[p2][1]-vy,S[p2][0]-vx);
  let d=((a2-a1)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);if(d>Math.PI){[a1,a2]=[a2,a1];d=2*Math.PI-d;}const rb=r0||13;
  (arcs[v]=arcs[v]||[]).push([a1,d,rb+4*Math.max(n-1,0)]);
  if(Math.abs(d-Math.PI/2)<0.02&&n===-1){const q=9,ux=Math.cos(a1),uy=Math.sin(a1),wx=Math.cos(a1+d),wy=Math.sin(a1+d);out.push(`<polyline points="${n_(vx+ux*q)},${n_(vy+uy*q)} ${n_(vx+ux*q+wx*q)},${n_(vy+uy*q+wy*q)} ${n_(vx+wx*q)},${n_(vy+wy*q)}" fill="none" stroke="${col}" stroke-width="1.5"/>`);return;}
  for(let i=0;i<Math.max(n,1);i++){const r=rb+4*i;if(n===0){const am=a1+d/2;out.push(`<circle cx="${n_(vx+Math.cos(am)*12)}" cy="${n_(vy+Math.sin(am)*12)}" r="2.6" fill="${col}"/>`);break;}
   out.push(`<path d="M${n_(vx+Math.cos(a1)*r)} ${n_(vy+Math.sin(a1)*r)} A${r} ${r} 0 0 1 ${n_(vx+Math.cos(a1+d)*r)} ${n_(vy+Math.sin(a1+d)*r)}" fill="none" stroke="${col}" stroke-width="1.8"/>`);}});
 (o.dots||[]).forEach(k=>out.push(`<circle cx="${n_(S[k][0])}" cy="${n_(S[k][1])}" r="3" fill="#111"/>`));
 texts.forEach(([x,y,t,op])=>{op=op||{};out.push(`<text x="${n_(X(x)+(op.dx||0))}" y="${n_(Y(y)+(op.dy||0)+4)}" text-anchor="middle" font-size="${op.size||12}" font-weight="700"${op.it?' font-style="italic"':''}${op.red?' fill="'+RED+'"':''} ${SH}>${t}</text>`);});
 const free=k=>{const [px,py]=S[k];const dirs=[];SEG.concat(DSH,HID).forEach(([a,b])=>{const [ax,ay]=S[a],[bx,by]=S[b];
   if(k===a)dirs.push(Math.atan2(by-py,bx-px));else if(k===b)dirs.push(Math.atan2(ay-py,ax-px));
   else{const L=Math.hypot(bx-ax,by-ay),cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/L,t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L/L;if(cr<1.5&&t>0&&t<1){dirs.push(Math.atan2(by-py,bx-px));dirs.push(Math.atan2(ay-py,ax-px));}}});
  if(!dirs.length){const vs=Object.values(S);const cx=vs.reduce((s,v)=>s+v[0],0)/vs.length,cy=vs.reduce((s,v)=>s+v[1],0)/vs.length;return Math.atan2(py-cy,px-cx);}
  dirs.sort((a,b)=>a-b);let best=-9,ang=0;dirs.forEach((d,i)=>{const e=dirs[(i+1)%dirs.length]+(i===dirs.length-1?2*Math.PI:0);const m=(d+e)/2;let sc=e-d;
   if((arcs[k]||[]).some(([a1,dd])=>(((m-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<dd))sc-=Math.PI;if(sc>best){best=sc;ang=m;}});return ang;};
 Object.keys(S).forEach(k=>{if(k[0]==='_')return;const [px,py]=S[k];let ang=(o.lab||{})[k];if(ang==null)ang=free(k);let r=11;
  (arcs[k]||[]).forEach(([a1,d,rr])=>{if((((ang-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<d)r=Math.max(r,rr+10);});
  out.push(`<text x="${n_(px+Math.cos(ang)*r)}" y="${n_(py+Math.sin(ang)*r+5)}" text-anchor="middle" font-size="14" font-weight="700" ${SH}>${k}</text>`);});
 return out.join('')+'</svg>';};
/* 円錐：CONE({r:'底面の半径の字', h:'高さの字'（null なら高さの線をかかない・'' なら線だけ）, L:'母線の字', red:'h'|'L'|'r'（その線を赤く）, pts:true|'M'（頂点 O・底面の点 A〔・母線 OA の中点 M〕の記号）}) */
const ZT=(x,y,t,an,ex)=>`<text x="${Math.round(x*10)/10}" y="${Math.round(y*10)/10}" font-size="13" font-weight="700" text-anchor="${an||'middle'}" stroke="#fff" stroke-width="4" paint-order="stroke" ${ex||''}>${t}</text>`;
const CONE=(o)=>{const W=210,H=190,cx=96,top=18,by=150,rx=62,ry=16,RED='#c2410c',cl=k=>o.red===k?RED:'#111';
 let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="sans-serif">`;
 s+=`<path d="M${cx-rx} ${by} A${rx} ${ry} 0 0 0 ${cx+rx} ${by}" fill="none" stroke="#111" stroke-width="1.8"/><path d="M${cx-rx} ${by} A${rx} ${ry} 0 0 1 ${cx+rx} ${by}" fill="none" stroke="#111" stroke-width="1.4" stroke-dasharray="5 4"/>`;
 s+=`<line x1="${cx}" y1="${top}" x2="${cx-rx}" y2="${by}" stroke="#111" stroke-width="1.8"/><line x1="${cx}" y1="${top}" x2="${cx+rx}" y2="${by}" stroke="${cl('L')}" stroke-width="${o.red==='L'?3:1.8}"/>`;
 if(o.h!=null)s+=`<line x1="${cx}" y1="${top}" x2="${cx}" y2="${by}" stroke="${cl('h')}" stroke-width="${o.red==='h'?2.6:1.4}" stroke-dasharray="5 4"/><polyline points="${cx},${by-9} ${cx+9},${by-9} ${cx+9},${by}" fill="none" stroke="#111" stroke-width="1.2"/>`+(o.h?ZT(cx-6,(top+by)/2+4,o.h,'end',o.red==='h'?'fill="'+RED+'"':''):'');
 if(o.r)s+=`<line x1="${cx}" y1="${by}" x2="${cx+rx}" y2="${by}" stroke="${cl('r')}" stroke-width="${o.red==='r'?2.6:1.4}"/>`+ZT(cx+rx/2,by+ry+14,o.r);
 if(o.L)s+=ZT(cx+rx/2+14,(top+by)/2-2,o.L,'start',o.red==='L'?'fill="'+RED+'"':'');
 if(o.pts){s+=ZT(cx,top-4,'O')+ZT(cx+rx+10,by+5,'A')+`<circle cx="${cx+rx}" cy="${by}" r="2.6" fill="#111"/>`;
  if(o.pts==='M'){const mx=(cx+cx+rx)/2,my=(top+by)/2;s+=`<circle cx="${mx}" cy="${my}" r="3" fill="#111"/>`+ZT(mx+12,my+12,'M','start');}}
 s+=`<circle cx="${cx}" cy="${by}" r="2.6" fill="#111"/>`;return s+'</svg>';};
return {FIG,CONE};})();
return {"M3N23_ZU_CONE":(...a)=>M3N23_ZU.CONE(...a),"M3N23_ZU_FIG":(...a)=>M3N23_ZU.FIG(...a)};
})();
NS["gg_m3u1p3"]=(function(){
const mi=v=>String(v).replace(/^-/,'−');
function GS(o){const R=o.R||5,U=20,L=R+.5,W=(2*R+1)*U,c=W/2,X=x=>c+x*U,Y=y=>c-y*U,sm=!!o.sm,K=sm?1.35:1;
 const H=`stroke="#fff" stroke-width="${4*K}" paint-order="stroke"`;
 let s=`<svg class="${sm?'gch':'gr'}" viewBox="0 0 ${W} ${W}" width="${o.w||200}" height="${o.w||200}">`;
 if(o.grid!==false)for(let i=-R;i<=R;i++){s+=`<line x1="${X(i)}" y1="${Y(-L)}" x2="${X(i)}" y2="${Y(L)}" stroke="#d1d5db" stroke-width="1"/><line x1="${X(-L)}" y1="${Y(i)}" x2="${X(L)}" y2="${Y(i)}" stroke="#d1d5db" stroke-width="1"/>`;}
 (o.yhl?[o.yhl]:[]).forEach(q=>{s+=`<line x1="${c}" y1="${Y(q[0])}" x2="${c}" y2="${Y(q[1])}" stroke="#c2410c" stroke-width="6" stroke-opacity=".55"/>`;});
 s+=`<line x1="${X(-L)}" y1="${c}" x2="${X(L)}" y2="${c}" stroke="#111" stroke-width="1.4"/><line x1="${c}" y1="${Y(-L)}" x2="${c}" y2="${Y(L)}" stroke="#111" stroke-width="1.4"/>`;
 s+=`<text x="${X(L)-9*K}" y="${c-6}" font-size="${13*K}" font-style="italic">x</text><text x="${c+6}" y="${Y(L)+13*K}" font-size="${13*K}" font-style="italic">y</text><text x="${c-4}" y="${c+14*K}" font-size="${12*K}" text-anchor="end">O</text>`;
 if(o.nums!==false)[-4,-2,2,4].forEach(v=>{s+=`<text x="${X(v)}" y="${c+14*K}" font-size="${11*K}" text-anchor="middle" fill="#555" ${H}>${mi(v)}</text><text x="${c-5}" y="${Y(v)+4*K}" font-size="${11*K}" text-anchor="end" fill="#555" ${H}>${mi(v)}</text>`;});
 const CL=(a,b)=>{let p=[];[-L,L].forEach(x=>{const y=a*x+b;if(y>=-L-1e-9&&y<=L+1e-9)p.push([x,y]);});if(a!==0)[-L,L].forEach(y=>{const x=(y-b)/a;if(x>-L&&x<L)p.push([x,y]);});p.sort((u,v)=>u[0]-v[0]);return [p[0],p[p.length-1]];};
 (o.lines||[]).forEach(l=>{const [p,q]=CL(l[0],l[1]);s+=`<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" stroke="#111" stroke-width="${sm?3:2.4}"/>`;});
 (o.dsh||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#c2410c" stroke-width="1.4" stroke-dasharray="4 3"/>`;});
 (o.segs||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#111" stroke-width="2.6"/>`;});
 if(o.st){const [x0,y0,dx,dy]=o.st;s+=`<line x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x0+dx)}" y2="${Y(y0)}" stroke="#c2410c" stroke-width="2.6"/><line x1="${X(x0+dx)}" y1="${Y(y0)}" x2="${X(x0+dx)}" y2="${Y(y0+dy)}" stroke="#c2410c" stroke-width="2.6"/><text x="${(X(x0)+X(x0+dx))/2}" y="${Y(y0)+(dy>0?17:-8)}" font-size="13" font-weight="700" fill="#c2410c" text-anchor="middle" ${H}>右へ${dx}</text><text x="${X(x0+dx)+6}" y="${(Y(y0)+Y(y0+dy))/2+5}" font-size="13" font-weight="700" fill="#c2410c" ${H}>${dy>0?'上へ'+dy:'下へ'+(-dy)}</text>`;}
 const OF={r:[8,4,'start'],l:[-8,4,'end'],t:[0,-9,'middle'],b:[0,18,'middle'],tr:[6,-7,'start'],tl:[-6,-7,'end'],br:[6,16,'start'],bl:[-6,16,'end']};
 (o.pts||[]).forEach(q=>{const f=OF[q[3]||'tr'];s+=q[4]?`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4.5" fill="#fff" stroke="#111" stroke-width="2"/>`:`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4.5" fill="#111"/>`;if(q[2])s+=`<text x="${X(q[0])+f[0]}" y="${Y(q[1])+f[1]}" text-anchor="${f[2]}" font-size="13" font-weight="700" ${H}>${q[2]}</text>`;});
 return s+'</svg>';}
const S=(o)=>{if(o.ren){o.steps.forEach(st=>st.a=st.c.r);}else o.a=o.c.r;return o;};
const M3U1P3_ZU=(()=>{
/* 図形の図（zukei_fig.py を JS に写したもの。引数は1つのオブジェクトで、JSON にできる形）
   FIG({P:{A:[x,y],…}, segs:['AB',…], dash:['AB',…], ticks:[['AB',1,赤か],…], par:[['AB',1,赤か],…],
        angs:[['B','A','C',1,赤か],…], shade:[['ABC','#c2410c'],…], dots:['O',…], texts:[[x,y,'40°',{dx,dy,it,red,size}],…],
        circ:[['AC',赤か],…], w:200, pad:20, lab:{A:角度(ラジアン・画面の向き)}})
   P の点にはすべて記号を付ける（付けない点は '_' で始まる名前）。座標は数学の向き（y は上向き） */
const FIG=(o)=>{
 const RED='#c2410c',SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
 const n_=v=>{let s=(Math.round(v*10)/10).toFixed(1);s=s.replace(/\.0$/,'');return s==='-0'?'0':s;};
 const seg=s=>s.indexOf('-')>=0?s.split('-'):(s.length===2?[s[0],s[1]]:[s[0],s.slice(1)]);
 const key=s=>{const a=seg(s);return a.slice().sort().join('');};
 const P=o.P,w=o.w||200,pad=o.pad==null?20:o.pad,texts=o.texts||[];
 const xs=Object.values(P).map(p=>p[0]).concat(texts.map(t=>t[0])),ys=Object.values(P).map(p=>p[1]).concat(texts.map(t=>t[1]));
 const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 let sc=(w-2*pad)/Math.max(x1-x0,1e-9),H=(y1-y0)*sc+2*pad;
 if(H>w*1.1){sc=(w*1.1-2*pad)/(y1-y0);H=w*1.1;}
 const W=(x1-x0)*sc+2*pad,X=x=>pad+(x-x0)*sc,Y=y=>pad+(y1-y)*sc;
 const S={};Object.keys(P).forEach(k=>{S[k]=[X(P[k][0]),Y(P[k][1])];});
 const SEG=(o.segs||[]).map(seg),DSH=(o.dash||[]).map(seg);
 const out=[`<svg class="${o.cls||'gr'}" viewBox="0 0 ${n_(W)} ${n_(H)}" width="${n_(W)}" height="${n_(H)}">`];
 (o.shade||[]).forEach(([t,col])=>{const v=t.indexOf('-')>=0?t.split('-'):t.split('');out.push(`<polygon points="${v.map(c=>n_(S[c][0])+','+n_(S[c][1])).join(' ')}" fill="${col}" fill-opacity=".14" stroke="none"/>`);});
 SEG.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`));
 DSH.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="${RED}" stroke-width="1.6" stroke-dasharray="5 4"/>`));
 const along=(a,b,t)=>[S[a][0]+(S[b][0]-S[a][0])*t,S[a][1]+(S[b][1]-S[a][1])*t];
 const clear=(a,b,tt)=>{const [ax,ay]=S[a],[bx,by]=S[b],L2=(bx-ax)**2+(by-ay)**2;const near=[];
  Object.keys(S).forEach(k=>{if(k===a||k===b)return;const [px,py]=S[k];const t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L2;const cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/Math.sqrt(L2);if(cr<1.5&&t>0&&t<1)near.push(t);});
  if(!near.some(t=>Math.abs(t-tt)<.13))return tt;for(const c of [.3,.7,.25,.75,.38,.62])if(!near.some(t=>Math.abs(t-c)<.13))return c;return tt;};
 const norm=(a,b)=>((S[b][0]<S[a][0]-1e-6)||(Math.abs(S[b][0]-S[a][0])<1e-6&&S[b][1]>S[a][1]))?[b,a]:[a,b];
 const pk=new Set((o.par||[]).map(p=>key(p[0]))),tk=new Set((o.ticks||[]).map(t=>key(t[0])));
 (o.ticks||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';if(pk.has(key(s)))[a,b]=norm(a,b);let tt=pk.has(key(s))?.62:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*4,cx=mx+ux*off,cy=my+uy*off;out.push(`<line x1="${n_(cx+nx*6)}" y1="${n_(cy+ny*6)}" x2="${n_(cx-nx*6)}" y2="${n_(cy-ny*6)}" stroke="${col}" stroke-width="2"/>`);}});
 (o.par||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';[a,b]=norm(a,b);let tt=tk.has(key(s))?.34:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*5+3,tx=mx+ux*off,ty=my+uy*off;out.push(`<polyline points="${n_(tx-ux*6+nx*5)},${n_(ty-uy*6+ny*5)} ${n_(tx)},${n_(ty)} ${n_(tx-ux*6-nx*5)},${n_(ty-uy*6-ny*5)}" fill="none" stroke="${col}" stroke-width="2"/>`);}});
 (o.circ||[]).forEach(([s,red])=>{const [a,b]=seg(s);const [mx,my]=along(a,b,.5);out.push(`<circle cx="${n_(mx)}" cy="${n_(my)}" r="4.5" fill="#fff" stroke="${red?RED:'#111'}" stroke-width="2"/>`);});
 const arcs={};
 (o.angs||[]).forEach(([p1,v,p2,n,red,r0])=>{const col=red?RED:'#111';const [vx,vy]=S[v];let a1=Math.atan2(S[p1][1]-vy,S[p1][0]-vx),a2=Math.atan2(S[p2][1]-vy,S[p2][0]-vx);
  let d=((a2-a1)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);if(d>Math.PI){[a1,a2]=[a2,a1];d=2*Math.PI-d;}const rb=r0||13;
  (arcs[v]=arcs[v]||[]).push([a1,d,rb+4*Math.max(n-1,0)]);
  for(let i=0;i<Math.max(n,1);i++){const r=rb+4*i;if(n===0){const am=a1+d/2;out.push(`<circle cx="${n_(vx+Math.cos(am)*12)}" cy="${n_(vy+Math.sin(am)*12)}" r="2.6" fill="${col}"/>`);break;}
   out.push(`<path d="M${n_(vx+Math.cos(a1)*r)} ${n_(vy+Math.sin(a1)*r)} A${r} ${r} 0 0 1 ${n_(vx+Math.cos(a1+d)*r)} ${n_(vy+Math.sin(a1+d)*r)}" fill="none" stroke="${col}" stroke-width="1.8"/>`);}});
 (o.dots||[]).forEach(k=>out.push(`<circle cx="${n_(S[k][0])}" cy="${n_(S[k][1])}" r="3" fill="#111"/>`));
 texts.forEach(([x,y,t,op])=>{op=op||{};out.push(`<text x="${n_(X(x)+(op.dx||0))}" y="${n_(Y(y)+(op.dy||0)+4)}" text-anchor="middle" font-size="${op.size||12}" font-weight="700"${op.it?' font-style="italic"':''}${op.red?' fill="'+RED+'"':''} ${SH}>${t}</text>`);});
 const free=k=>{const [px,py]=S[k];const dirs=[];SEG.concat(DSH).forEach(([a,b])=>{const [ax,ay]=S[a],[bx,by]=S[b];
   if(k===a)dirs.push(Math.atan2(by-py,bx-px));else if(k===b)dirs.push(Math.atan2(ay-py,ax-px));
   else{const L=Math.hypot(bx-ax,by-ay),cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/L,t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L/L;if(cr<1.5&&t>0&&t<1){dirs.push(Math.atan2(by-py,bx-px));dirs.push(Math.atan2(ay-py,ax-px));}}});
  if(!dirs.length){const vs=Object.values(S);const cx=vs.reduce((s,v)=>s+v[0],0)/vs.length,cy=vs.reduce((s,v)=>s+v[1],0)/vs.length;return Math.atan2(py-cy,px-cx);}
  dirs.sort((a,b)=>a-b);let best=-9,ang=0;dirs.forEach((d,i)=>{const e=dirs[(i+1)%dirs.length]+(i===dirs.length-1?2*Math.PI:0);const m=(d+e)/2;let sc=e-d;
   if((arcs[k]||[]).some(([a1,dd])=>(((m-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<dd))sc-=Math.PI;if(sc>best){best=sc;ang=m;}});return ang;};
 Object.keys(S).forEach(k=>{if(k[0]==='_')return;const [px,py]=S[k];let ang=(o.lab||{})[k];if(ang==null)ang=free(k);let r=11;
  (arcs[k]||[]).forEach(([a1,d,rr])=>{if((((ang-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<d)r=Math.max(r,rr+10);});
  out.push(`<text x="${n_(px+Math.cos(ang)*r)}" y="${n_(py+Math.sin(ang)*r+5)}" text-anchor="middle" font-size="14" font-weight="700" ${SH}>${k}</text>`);});
 return out.join('')+'</svg>';};
/* グラフ（helpers.js の GS に足す）：GSX({…GS の引数, hyp:[a,…], vl:[h,…], hl:[k,…], labs:[[x,y,'ℓ'],…]})
   hyp＝反比例 y＝a/x の曲線・vl＝直線 x＝h・hl＝直線 y＝k・labs＝直線の名前などの字（数学の座標） */
const GSX=(o)=>{const R=o.R||5,U=20,L=R+.5,W=(2*R+1)*U,c=W/2,X=x=>c+x*U,Y=y=>c-y*U,sm=!!o.sm,K=sm?1.35:1,sw=sm?3:2.4;
 const H=`stroke="#fff" stroke-width="${4*K}" paint-order="stroke"`;const r2=v=>Math.round(v*10)/10;
 let s=GS(Object.assign({},o,{hyp:undefined,vl:undefined,hl:undefined,labs:undefined}));let add='';
 (o.hyp||[]).forEach(a=>{const x0=Math.abs(a)/L;[1,-1].forEach(sg=>{const p=[];for(let i=0;i<=80;i++){const x=sg*(x0+(L-x0)*Math.pow(i/80,1.6));p.push(r2(X(x))+','+r2(Y(a/x)));}
   add+=`<polyline points="${p.join(' ')}" fill="none" stroke="#111" stroke-width="${sw}"/>`;});});
 (o.vl||[]).forEach(h=>{add+=`<line x1="${X(h)}" y1="${Y(-L)}" x2="${X(h)}" y2="${Y(L)}" stroke="#111" stroke-width="${sw}"/>`;});
 (o.hl||[]).forEach(k=>{add+=`<line x1="${X(-L)}" y1="${Y(k)}" x2="${X(L)}" y2="${Y(k)}" stroke="#111" stroke-width="${sw}"/>`;});
 (o.labs||[]).forEach(q=>{add+=`<text x="${X(q[0])}" y="${Y(q[1])+5}" text-anchor="middle" font-size="${15*K}" font-weight="700" font-style="italic" ${H}>${q[2]}</text>`;});
 return s.replace('</svg>',add+'</svg>');};
/* 水そう：TANK({h:はじめの深さ, r:1分間に上がる深さ}) 直方体の水そうと水の深さ */
const TANK=(o)=>{const W=290,Hh=150,x0=66,y0=18,w=150,hh=112,dx=30,dy=16,lv=y0+hh-34;
 let s=`<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" font-family="sans-serif">`;
 s+=`<rect x="${x0}" y="${lv}" width="${w}" height="${y0+hh-lv}" fill="#005AFF" fill-opacity=".22"/>`;
 s+=`<polygon points="${x0},${lv} ${x0+dx},${lv-dy} ${x0+w+dx},${lv-dy} ${x0+w},${lv}" fill="#005AFF" fill-opacity=".12"/>`;
 s+=`<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" fill="none" stroke="#111" stroke-width="1.6"/>`;
 s+=`<polyline points="${x0},${y0} ${x0+dx},${y0-dy+2} ${x0+w+dx},${y0-dy+2} ${x0+w},${y0}" fill="none" stroke="#111" stroke-width="1.4"/><line x1="${x0+w+dx}" y1="${y0-dy+2}" x2="${x0+w+dx}" y2="${y0+hh-dy}" stroke="#111" stroke-width="1.4"/><line x1="${x0+w}" y1="${y0+hh}" x2="${x0+w+dx}" y2="${y0+hh-dy}" stroke="#111" stroke-width="1.4"/>`;
 s+=`<line x1="${x0-8}" y1="${lv}" x2="${x0-8}" y2="${y0+hh}" stroke="#c2410c" stroke-width="2"/><line x1="${x0-12}" y1="${lv}" x2="${x0-4}" y2="${lv}" stroke="#c2410c" stroke-width="2"/><line x1="${x0-12}" y1="${y0+hh}" x2="${x0-4}" y2="${y0+hh}" stroke="#c2410c" stroke-width="2"/>`;
 s+=`<text x="${x0-14}" y="${(lv+y0+hh)/2-2}" text-anchor="end" font-size="12" font-weight="700">はじめ</text><text x="${x0-14}" y="${(lv+y0+hh)/2+13}" text-anchor="end" font-size="12" font-weight="700">${o.h} cm</text>`;
 s+=`<path d="M${x0+w/2} ${lv-6} L${x0+w/2} ${lv-30}" stroke="#111" stroke-width="1.6"/><polygon points="${x0+w/2-5},${lv-26} ${x0+w/2},${lv-34} ${x0+w/2+5},${lv-26}" fill="#111"/>`;
 s+=`<text x="${x0+w/2+8}" y="${lv-14}" font-size="12" font-weight="700">1分間に ${o.r} cm 上がる</text>`;
 return s+'</svg>';};
return {FIG,GSX,TANK};})();
return {"M3U1P3_ZU_GSX":(...a)=>M3U1P3_ZU.GSX(...a),"M3U1P3_ZU_FIG":(...a)=>M3U1P3_ZU.FIG(...a),"M3U1P3_ZU_TANK":(...a)=>M3U1P3_ZU.TANK(...a)};
})();
NS["gg_m3u1p4"]=(function(){
const S=(o)=>{if(o.ren){o.steps.forEach(st=>st.a=st.c.r);}else o.a=o.c.r;return o;};
const M3U1P4_ZU=(()=>{
/* 図形の図（zukei_fig.py を JS に写したもの。引数は1つのオブジェクトで、JSON にできる形）
   FIG({P:{A:[x,y],…}, segs:['AB',…], dash:['AB',…], ticks:[['AB',1,赤か],…], par:[['AB',1,赤か],…],
        angs:[['B','A','C',1,赤か],…], shade:[['ABC','#c2410c'],…], dots:['O',…], texts:[[x,y,'40°',{dx,dy,it,red,size}],…],
        circ:[['AC',赤か],…], w:200, pad:20, lab:{A:角度(ラジアン・画面の向き)}})
   P の点にはすべて記号を付ける（付けない点は '_' で始まる名前）。座標は数学の向き（y は上向き） */
const FIG=(o)=>{
 const RED='#c2410c',SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
 const n_=v=>{let s=(Math.round(v*10)/10).toFixed(1);s=s.replace(/\.0$/,'');return s==='-0'?'0':s;};
 const seg=s=>s.indexOf('-')>=0?s.split('-'):(s.length===2?[s[0],s[1]]:[s[0],s.slice(1)]);
 const key=s=>{const a=seg(s);return a.slice().sort().join('');};
 const P=o.P,w=o.w||200,pad=o.pad==null?20:o.pad,texts=o.texts||[];
 const xs=Object.values(P).map(p=>p[0]).concat(texts.map(t=>t[0])),ys=Object.values(P).map(p=>p[1]).concat(texts.map(t=>t[1]));
 const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 let sc=(w-2*pad)/Math.max(x1-x0,1e-9),H=(y1-y0)*sc+2*pad;
 if(H>w*1.1){sc=(w*1.1-2*pad)/(y1-y0);H=w*1.1;}
 const W=(x1-x0)*sc+2*pad,X=x=>pad+(x-x0)*sc,Y=y=>pad+(y1-y)*sc;
 const S={};Object.keys(P).forEach(k=>{S[k]=[X(P[k][0]),Y(P[k][1])];});
 const SEG=(o.segs||[]).map(seg),DSH=(o.dash||[]).map(seg);
 const out=[`<svg class="${o.cls||'gr'}" viewBox="0 0 ${n_(W)} ${n_(H)}" width="${n_(W)}" height="${n_(H)}">`];
 (o.shade||[]).forEach(([t,col])=>{const v=t.indexOf('-')>=0?t.split('-'):t.split('');out.push(`<polygon points="${v.map(c=>n_(S[c][0])+','+n_(S[c][1])).join(' ')}" fill="${col}" fill-opacity=".14" stroke="none"/>`);});
 SEG.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`));
 DSH.forEach(([a,b])=>out.push(`<line x1="${n_(S[a][0])}" y1="${n_(S[a][1])}" x2="${n_(S[b][0])}" y2="${n_(S[b][1])}" stroke="${RED}" stroke-width="1.6" stroke-dasharray="5 4"/>`));
 const along=(a,b,t)=>[S[a][0]+(S[b][0]-S[a][0])*t,S[a][1]+(S[b][1]-S[a][1])*t];
 const clear=(a,b,tt)=>{const [ax,ay]=S[a],[bx,by]=S[b],L2=(bx-ax)**2+(by-ay)**2;const near=[];
  Object.keys(S).forEach(k=>{if(k===a||k===b)return;const [px,py]=S[k];const t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L2;const cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/Math.sqrt(L2);if(cr<1.5&&t>0&&t<1)near.push(t);});
  if(!near.some(t=>Math.abs(t-tt)<.13))return tt;for(const c of [.3,.7,.25,.75,.38,.62])if(!near.some(t=>Math.abs(t-c)<.13))return c;return tt;};
 const norm=(a,b)=>((S[b][0]<S[a][0]-1e-6)||(Math.abs(S[b][0]-S[a][0])<1e-6&&S[b][1]>S[a][1]))?[b,a]:[a,b];
 const pk=new Set((o.par||[]).map(p=>key(p[0]))),tk=new Set((o.ticks||[]).map(t=>key(t[0])));
 (o.ticks||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';if(pk.has(key(s)))[a,b]=norm(a,b);let tt=pk.has(key(s))?.62:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*4,cx=mx+ux*off,cy=my+uy*off;out.push(`<line x1="${n_(cx+nx*6)}" y1="${n_(cy+ny*6)}" x2="${n_(cx-nx*6)}" y2="${n_(cy-ny*6)}" stroke="${col}" stroke-width="2"/>`);}});
 (o.par||[]).forEach(([s,n,red])=>{let [a,b]=seg(s);const col=red?RED:'#111';[a,b]=norm(a,b);let tt=tk.has(key(s))?.34:.5;tt=clear(a,b,tt);
  const [mx,my]=along(a,b,tt),dx=S[b][0]-S[a][0],dy=S[b][1]-S[a][1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*5+3,tx=mx+ux*off,ty=my+uy*off;out.push(`<polyline points="${n_(tx-ux*6+nx*5)},${n_(ty-uy*6+ny*5)} ${n_(tx)},${n_(ty)} ${n_(tx-ux*6-nx*5)},${n_(ty-uy*6-ny*5)}" fill="none" stroke="${col}" stroke-width="2"/>`);}});
 (o.circ||[]).forEach(([s,red])=>{const [a,b]=seg(s);const [mx,my]=along(a,b,.5);out.push(`<circle cx="${n_(mx)}" cy="${n_(my)}" r="4.5" fill="#fff" stroke="${red?RED:'#111'}" stroke-width="2"/>`);});
 const arcs={};
 (o.angs||[]).forEach(([p1,v,p2,n,red,r0])=>{const col=red?RED:'#111';const [vx,vy]=S[v];let a1=Math.atan2(S[p1][1]-vy,S[p1][0]-vx),a2=Math.atan2(S[p2][1]-vy,S[p2][0]-vx);
  let d=((a2-a1)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);if(d>Math.PI){[a1,a2]=[a2,a1];d=2*Math.PI-d;}const rb=r0||13;
  (arcs[v]=arcs[v]||[]).push([a1,d,rb+4*Math.max(n-1,0)]);
  for(let i=0;i<Math.max(n,1);i++){const r=rb+4*i;if(n===0){const am=a1+d/2;out.push(`<circle cx="${n_(vx+Math.cos(am)*12)}" cy="${n_(vy+Math.sin(am)*12)}" r="2.6" fill="${col}"/>`);break;}
   out.push(`<path d="M${n_(vx+Math.cos(a1)*r)} ${n_(vy+Math.sin(a1)*r)} A${r} ${r} 0 0 1 ${n_(vx+Math.cos(a1+d)*r)} ${n_(vy+Math.sin(a1+d)*r)}" fill="none" stroke="${col}" stroke-width="1.8"/>`);}});
 (o.dots||[]).forEach(k=>out.push(`<circle cx="${n_(S[k][0])}" cy="${n_(S[k][1])}" r="3" fill="#111"/>`));
 texts.forEach(([x,y,t,op])=>{op=op||{};out.push(`<text x="${n_(X(x)+(op.dx||0))}" y="${n_(Y(y)+(op.dy||0)+4)}" text-anchor="middle" font-size="${op.size||12}" font-weight="700"${op.it?' font-style="italic"':''}${op.red?' fill="'+RED+'"':''} ${SH}>${t}</text>`);});
 const free=k=>{const [px,py]=S[k];const dirs=[];SEG.concat(DSH).forEach(([a,b])=>{const [ax,ay]=S[a],[bx,by]=S[b];
   if(k===a)dirs.push(Math.atan2(by-py,bx-px));else if(k===b)dirs.push(Math.atan2(ay-py,ax-px));
   else{const L=Math.hypot(bx-ax,by-ay),cr=Math.abs((bx-ax)*(py-ay)-(by-ay)*(px-ax))/L,t=((px-ax)*(bx-ax)+(py-ay)*(by-ay))/L/L;if(cr<1.5&&t>0&&t<1){dirs.push(Math.atan2(by-py,bx-px));dirs.push(Math.atan2(ay-py,ax-px));}}});
  if(!dirs.length){const vs=Object.values(S);const cx=vs.reduce((s,v)=>s+v[0],0)/vs.length,cy=vs.reduce((s,v)=>s+v[1],0)/vs.length;return Math.atan2(py-cy,px-cx);}
  dirs.sort((a,b)=>a-b);let best=-9,ang=0;dirs.forEach((d,i)=>{const e=dirs[(i+1)%dirs.length]+(i===dirs.length-1?2*Math.PI:0);const m=(d+e)/2;let sc=e-d;
   if((arcs[k]||[]).some(([a1,dd])=>(((m-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<dd))sc-=Math.PI;if(sc>best){best=sc;ang=m;}});return ang;};
 Object.keys(S).forEach(k=>{if(k[0]==='_')return;const [px,py]=S[k];let ang=(o.lab||{})[k];if(ang==null)ang=free(k);let r=11;
  (arcs[k]||[]).forEach(([a1,d,rr])=>{if((((ang-a1)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)<d)r=Math.max(r,rr+10);});
  out.push(`<text x="${n_(px+Math.cos(ang)*r)}" y="${n_(py+Math.sin(ang)*r+5)}" text-anchor="middle" font-size="14" font-weight="700" ${SH}>${k}</text>`);});
 return out.join('')+'</svg>';};
/* 立体・おうぎ形・線分図の図（字は 12px 以上・線は黒・説明で足した印は #c2410c） */
const ZT=(x,y,t,an,ex)=>`<text x="${Math.round(x*10)/10}" y="${Math.round(y*10)/10}" font-size="13" font-weight="700" text-anchor="${an||'middle'}" stroke="#fff" stroke-width="4" paint-order="stroke" ${ex||''}>${t}</text>`;
/* 円錐：CONE({r:'3 cm', h:'8 cm', L:'母線の字'（なくてよい）}) */
const CONE=(o)=>{const W=200,H=190,cx=96,top=18,by=150,rx=62,ry=16;
 let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="sans-serif">`;
 s+=`<path d="M${cx-rx} ${by} A${rx} ${ry} 0 0 0 ${cx+rx} ${by}" fill="none" stroke="#111" stroke-width="1.8"/><path d="M${cx-rx} ${by} A${rx} ${ry} 0 0 1 ${cx+rx} ${by}" fill="none" stroke="#111" stroke-width="1.4" stroke-dasharray="5 4"/>`;
 s+=`<line x1="${cx}" y1="${top}" x2="${cx-rx}" y2="${by}" stroke="#111" stroke-width="1.8"/><line x1="${cx}" y1="${top}" x2="${cx+rx}" y2="${by}" stroke="#111" stroke-width="1.8"/>`;
 if(o.h)s+=`<line x1="${cx}" y1="${top}" x2="${cx}" y2="${by}" stroke="#111" stroke-width="1.4" stroke-dasharray="5 4"/><polyline points="${cx},${by-9} ${cx+9},${by-9} ${cx+9},${by}" fill="none" stroke="#111" stroke-width="1.2"/>`+ZT(cx-6,(top+by)/2+4,o.h,'end');
 if(o.r)s+=`<line x1="${cx}" y1="${by}" x2="${cx+rx}" y2="${by}" stroke="#111" stroke-width="1.4"/>`+ZT(cx+rx/2,by+ry+14,o.r);
 if(o.L)s+=ZT(cx+rx/2+14,(top+by)/2-2,o.L,'start');
 s+=`<circle cx="${cx}" cy="${by}" r="2.6" fill="#111"/>`;return s+'</svg>';};
/* 球：SPHERE({r:'3 cm'}) */
const SPHERE=(o)=>{const W=180,H=170,cx=88,cy=84,R=66;
 let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="sans-serif"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#111" stroke-width="1.8"/>`;
 s+=`<path d="M${cx-R} ${cy} A${R} 18 0 0 0 ${cx+R} ${cy}" fill="none" stroke="#111" stroke-width="1.4"/><path d="M${cx-R} ${cy} A${R} 18 0 0 1 ${cx+R} ${cy}" fill="none" stroke="#111" stroke-width="1.2" stroke-dasharray="5 4"/>`;
 s+=`<line x1="${cx}" y1="${cy}" x2="${cx+R}" y2="${cy}" stroke="#111" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="2.6" fill="#111"/>`+ZT(cx+R/2,cy-8,o.r);return s+'</svg>';};
/* おうぎ形：SECT({deg:80, r:'9 cm', a:'80°', dev:'弧の長さの字（なくてよい）'}) */
const SECT=(o)=>{const W=210,H=170,R=120,d=o.deg,cx=W/2,cy=150;const a0=90+d/2,a1=90-d/2,P=a=>[cx+R*Math.cos(a*Math.PI/180),cy-R*Math.sin(a*Math.PI/180)];
 let Rr=R;const fit=()=>{const xs=[cx],ys=[cy];for(let a=a1;a<=a0;a+=2){const p=[cx+Rr*Math.cos(a*Math.PI/180),cy-Rr*Math.sin(a*Math.PI/180)];xs.push(p[0]);ys.push(p[1]);}return [Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)];};
 let [xa,xb,ya,yb]=fit();const k=Math.min(1,(W-24)/(xb-xa),(H-30)/(yb-ya));Rr=R*k;[xa,xb,ya,yb]=fit();const ox=W/2-(xa+xb)/2,oy=(H-6)-yb;
 const Q=a=>[cx+ox+Rr*Math.cos(a*Math.PI/180),cy+oy-Rr*Math.sin(a*Math.PI/180)],[ax,ay]=Q(a0),[bx,by]=Q(a1),C=[cx+ox,cy+oy];
 let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="sans-serif">`;
 s+=`<path d="M${C[0]} ${C[1]} L${ax.toFixed(1)} ${ay.toFixed(1)} A${Rr.toFixed(1)} ${Rr.toFixed(1)} 0 ${d>180?1:0} 1 ${bx.toFixed(1)} ${by.toFixed(1)} Z" fill="#005AFF" fill-opacity=".08" stroke="#111" stroke-width="1.8"/>`;
 const ar=22;const [p,q]=[[C[0]+ar*Math.cos(a0*Math.PI/180),C[1]-ar*Math.sin(a0*Math.PI/180)],[C[0]+ar*Math.cos(a1*Math.PI/180),C[1]-ar*Math.sin(a1*Math.PI/180)]];
 s+=`<path d="M${p[0].toFixed(1)} ${p[1].toFixed(1)} A${ar} ${ar} 0 ${d>180?1:0} 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)}" fill="none" stroke="#111" stroke-width="1.4"/>`;
 if(o.a)s+=ZT(C[0],C[1]-ar-6,o.a);
 const ml=a0+ (d>200?-20:0);const mx=(C[0]+ax)/2,my=(C[1]+ay)/2;if(o.r)s+=ZT(mx-8,my+4,o.r,'end');
 if(o.arc)s+=ZT(C[0],C[1]-Rr-8>12?C[1]-Rr-8:14,o.arc);
 return s+'</svg>';};
/* 円錐の展開図：DEV({deg, ratio:底面の半径÷母線, L:'母線の字', r:'底面の半径の字', a:'中心角の字'}) おうぎ形（上）と底面の円（下） */
const DEV=(o)=>{const d=o.deg,R=86,rr=R*o.ratio,m=-90,a0=m-d/2,a1=m+d/2,rd=Math.PI/180;
 const P=(cx,cy,r,a)=>[cx+r*Math.cos(a*rd),cy-r*Math.sin(a*rd)];
 const pts=[[0,0]];for(let a=a0;a<=a1+0.01;a+=3)pts.push(P(0,0,R,a));const cc=[0,R+rr];for(let a=0;a<360;a+=10)pts.push(P(cc[0],cc[1],rr,a));
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),pad=26,ox=pad-Math.min(...xs),oy=pad-Math.min(...ys),W=Math.max(...xs)-Math.min(...xs)+2*pad+40,H=Math.max(...ys)-Math.min(...ys)+2*pad;
 const f=v=>v.toFixed(1);const C=[ox,oy],[ax,ay]=P(ox,oy,R,a0),[bx,by]=P(ox,oy,R,a1);
 let s=`<svg viewBox="0 0 ${f(W)} ${f(H)}" width="${f(W)}" height="${f(H)}" font-family="sans-serif">`;
 s+=`<path d="M${f(C[0])} ${f(C[1])} L${f(ax)} ${f(ay)} A${R} ${R} 0 ${d>180?1:0} 0 ${f(bx)} ${f(by)} Z" fill="#005AFF" fill-opacity=".08" stroke="#111" stroke-width="1.8"/>`;
 const c2=[ox+cc[0],oy+cc[1]];s+=`<circle cx="${f(c2[0])}" cy="${f(c2[1])}" r="${f(rr)}" fill="none" stroke="#111" stroke-width="1.8"/><line x1="${f(c2[0])}" y1="${f(c2[1])}" x2="${f(c2[0]+rr)}" y2="${f(c2[1])}" stroke="#111" stroke-width="1.4"/><circle cx="${f(c2[0])}" cy="${f(c2[1])}" r="2.4" fill="#111"/>`;
 if(o.r)s+=ZT(c2[0]+rr/2,c2[1]-6,o.r);
 const ar=18,[p1x,p1y]=P(ox,oy,ar,a0),[p2x,p2y]=P(ox,oy,ar,a1);
 s+=`<path d="M${f(p1x)} ${f(p1y)} A${ar} ${ar} 0 ${d>180?1:0} 0 ${f(p2x)} ${f(p2y)}" fill="none" stroke="#c2410c" stroke-width="1.8"/>`;
 if(o.a){const [tx,ty]=P(ox,oy,ar+16,m);s+=ZT(tx,ty+5,o.a,'middle','fill="#c2410c"');}
 if(o.L){const [lx,ly]=P(ox,oy,R*0.55,a0);s+=ZT(lx-6,ly,o.L,'end');}

 return s+'</svg>';};
/* 線分図（道のり）：SEN({L:'家', R:'駅', tot:'1500 m', a:'歩いた x m', b:'走った y m', sa:'分速 60 m', sb:'分速 150 m', t:'合わせて 16 分'}) */
const SEN=(o)=>{const W=320,H=112,x0=22,x2=298,x1=150,y=58;
 let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="sans-serif">`;
 s+=`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#111" stroke-width="3"/><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#111" stroke-width="3" stroke-dasharray="9 5"/>`;
 [x0,x1,x2].forEach(x=>{s+=`<line x1="${x}" y1="${y-7}" x2="${x}" y2="${y+7}" stroke="#111" stroke-width="1.6"/>`;});
 s+=ZT(x0,y+22,o.L)+ZT(x2,y+22,o.R)+ZT((x0+x1)/2,y-10,o.a)+ZT((x1+x2)/2,y-10,o.b)+ZT((x0+x1)/2,y+22,o.sa)+ZT((x1+x2)/2,y+22,o.sb);
 s+=`<path d="M${x0} ${y+32} L${x0} ${y+38} L${x2} ${y+38} L${x2} ${y+32}" fill="none" stroke="#6b7280" stroke-width="1.3"/>`+ZT((x0+x2)/2,y+52,o.tot+(o.t?'　'+o.t:''));
 s+=`<path d="M${x0} ${y-26} L${x0} ${y-32} L${x2} ${y-32} L${x2} ${y-26}" fill="none" stroke="none"/>`;
 return s+'</svg>';};
return {FIG,CONE,SPHERE,SECT,DEV,SEN};})();
return {"M3U1P4_ZU_FIG":(...a)=>M3U1P4_ZU.FIG(...a),"M3U1P4_ZU_SECT":(...a)=>M3U1P4_ZU.SECT(...a),"M3U1P4_ZU_CONE":(...a)=>M3U1P4_ZU.CONE(...a),"M3U1P4_ZU_SEN":(...a)=>M3U1P4_ZU.SEN(...a),"M3U1P4_ZU_SPHERE":(...a)=>M3U1P4_ZU.SPHERE(...a),"M3U1P4_ZU_DEV":(...a)=>M3U1P4_ZU.DEV(...a)};
})();
})();
