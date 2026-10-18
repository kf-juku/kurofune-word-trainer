/* math_fig.js：単元ワークシート（数学）の図を描く関数。自動で作る（元＝ジョブス用\道具\20261016_単元ワークシート中2数学 の u*.js・ct*.js・mock/m.html）。手で直さない */
(function(){
const NS={};
NS["u1"]=(function(){
let TB=(xs,ys)=>`<table class="tb"><tr><th>\\(x\\)</th>${xs.map(v=>`<td>${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map(v=>`<td>${v}</td>`).join('')}</tr></table>`;
let TBA=(xs,ys,yn,xn)=>{const n=xs.length;const gap=(arr,cls)=>arr?`<tr class="${cls}"><th></th><td class="g"></td>${arr.map(t=>`<td colspan="2" class="g">${t?`<span>${t}</span>`:''}</td>`).join('')}<td class="g"></td></tr>`:'';
 return `<table class="tb tba">${gap(xn,'xn')}<tr><th>\\(x\\)</th>${xs.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr>${gap(yn,'yn')}</table>`;};
return {TBA,TB};
})();
NS["u2"]=(function(){
let TBA=(xs,ys,yn,xn)=>{const n=xs.length;const gap=(arr,cls)=>arr?`<tr class="${cls}"><th></th><td class="g"></td>${arr.map(t=>`<td colspan="2" class="g">${t?`<span>${t}</span>`:''}</td>`).join('')}<td class="g"></td></tr>`:'';
 return `<table class="tb tba">${gap(xn,'xn')}<tr><th>\\(x\\)</th>${xs.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr>${gap(yn,'yn')}</table>`;};
let TB=(xs,ys,hl)=>{const H=[].concat(hl===undefined?[]:hl),S=(i,top)=>H.includes(i)?` style="border-left:3px solid #111;border-right:3px solid #111;${top?'border-top':'border-bottom'}:3px solid #111;font-weight:700"`:'';return `<table class="tb"><tr><th>\\(x\\)</th>${xs.map((v,i)=>`<td${S(i,1)}>${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map((v,i)=>`<td${S(i,0)}>${v}</td>`).join('')}</tr></table>`;};
function GR(a,b,o){o=o||{};const R=o.R||5,K=Math.max(1,(2*R+1)/11),U=20,W=(2*R+1)*U,cx=W/2,cy=W/2,X=x=>cx+x*U,Y=y=>cy-y*U;
 let s=`<svg class="gr" viewBox="0 0 ${W} ${W}" width="${o.w||210}" height="${o.w||210}">`;
 for(let i=-R;i<=R;i++){s+=`<line x1="${X(i)}" y1="${Y(-R-.5)}" x2="${X(i)}" y2="${Y(R+.5)}" stroke="#d1d5db" stroke-width="1"/><line x1="${X(-R-.5)}" y1="${Y(i)}" x2="${X(R+.5)}" y2="${Y(i)}" stroke="#d1d5db" stroke-width="1"/>`;}
 s+=`<line x1="${X(-R-.5)}" y1="${cy}" x2="${X(R+.5)}" y2="${cy}" stroke="#111" stroke-width="1.6"/><line x1="${cx}" y1="${Y(-R-.5)}" x2="${cx}" y2="${Y(R+.5)}" stroke="#111" stroke-width="1.6"/>`;
 s+=`<text x="${X(R+.5)-8}" y="${cy-5}" font-size="${13*K}" font-style="italic">x</text><text x="${cx+5}" y="${Y(R+.5)+12}" font-size="${13*K}" font-style="italic">y</text><text x="${cx-13}" y="${cy+14}" font-size="${12*K}">O</text>`;
 (R>5?[-6,-4,-2,2,4,6]:[-4,-2,2,4]).forEach(v=>{s+=`<text x="${X(v)}" y="${cy+14}" font-size="${11*K}" text-anchor="middle">${v}</text><text x="${cx-5}" y="${Y(v)+4}" font-size="${11*K}" text-anchor="end">${v}</text>`;});
 const x1=-R-.5,x2=R+.5;let p=[[x1,a*x1+b],[x2,a*x2+b]];
 s+=`<clipPath id="cp${o.id||0}"><rect x="${X(-R-.5)}" y="${Y(R+.5)}" width="${(2*R+1)*U}" height="${(2*R+1)*U}"/></clipPath><line clip-path="url(#cp${o.id||0})" x1="${X(p[0][0])}" y1="${Y(p[0][1])}" x2="${X(p[1][0])}" y2="${Y(p[1][1])}" stroke="#111" stroke-width="2.4"/>`;
 (o.pts||[]).forEach(q=>{const L=q[0]===0||q[0]>=3;s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4.5" fill="#2563eb"/>`+(q[2]?`<text x="${L?X(q[0])-8:X(q[0])+7}" y="${L?Y(q[1])+4:Y(q[1])-7}" text-anchor="${L?'end':'start'}" font-size="${13*K}" font-weight="700" fill="#2563eb" stroke="#fff" stroke-width="${4*K}" paint-order="stroke">${q[2]}</text>`:'');});
 for(const ST of (o.sts||(o.st?[o.st]:[]))){const [x0,y0,dx,dy]=ST;const H='stroke="#fff" stroke-width="${4*K}" paint-order="stroke"';s+=`<line x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x0+dx)}" y2="${Y(y0)}" stroke="#c2410c" stroke-width="2.6"/><line x1="${X(x0+dx)}" y1="${Y(y0)}" x2="${X(x0+dx)}" y2="${Y(y0+dy)}" stroke="#c2410c" stroke-width="2.6"/><text x="${(X(x0)+X(x0+dx))/2}" y="${Y(y0)+(dy>0?17:-8)}" font-size="${13*K}" font-weight="700" fill="#c2410c" text-anchor="middle" ${H}>右へ${dx}</text><text x="${X(x0+dx)+6}" y="${(Y(y0)+Y(y0+dy))/2+5}" font-size="${13*K}" font-weight="700" fill="#c2410c" ${H}>${dy>0?'上へ'+dy:'下へ'+(-dy)}</text>`;}
 const HH='stroke="#fff" stroke-width="${4*K}" paint-order="stroke"',TW=t=>[...String(t)].reduce((a,c)=>a+(c.charCodeAt(0)>255?12.5*K:7.2*K),0),FX=(x,t,an)=>{const w=TW(t);let st=an==='end'?x-w:an==='middle'?x-w/2:x;return Math.max(3,Math.min(st,W-3-w));};
 (o.lines2||[]).forEach((l,k)=>{const [a2,b2,nm,lx,dash]=l;s+=`<line clip-path="url(#cp${o.id||0})" x1="${X(-R-.5)}" y1="${Y(a2*(-R-.5)+b2)}" x2="${X(R+.5)}" y2="${Y(a2*(R+.5)+b2)}" stroke="#111" stroke-width="2.2" ${dash?'stroke-dasharray="6 4"':''}/>`;if(nm)s+=`<text x="${FX(X(lx)+7,nm,'start')}" y="${Y(a2*lx+b2)-5}" font-size="${13*K}" font-weight="700" ${HH}>${nm}</text>`;});
 if(o.lab){const [nm,lx]=o.lab;s+=`<text x="${FX(X(lx)+7,nm,'start')}" y="${Y(a*lx+b)-5}" font-size="${13*K}" font-weight="700" ${HH}>${nm}</text>`;}
 (o.dsh||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#c2410c" stroke-width="1.6" stroke-dasharray="4 3"/>`;});
 (o.dots||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="${4.5*K}" fill="#111"/>`+(q[2]?`<text x="${FX(X(q[0])+8,q[2],'start')}" y="${Y(q[1])-8}" font-size="${13*K}" font-weight="700" ${HH}>${q[2]}</text>`:'');});
 (o.rings||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="10" fill="none" stroke="#c2410c" stroke-width="2.4"/>`;});
 (o.notes||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${FX(X(x)+(dx||0),t,an||'start')}" y="${Y(y)+(dy||0)}" font-size="${12.5*K}" font-weight="700" fill="#c2410c" ${HH}>${t}</text>`;});
 return s+'</svg>';};
return {GR,TB,TBA};
})();
NS["u3"]=(function(){
let mi=v=>String(v).replace('-','−');
function GS(a,b,o){o=o||{};const x1=o.x1,x2=o.x2,y1=a*x1+b,y2=a*x2+b;
 const R=Math.max(5,Math.ceil(Math.max(Math.abs(x1),Math.abs(x2),Math.abs(y1),Math.abs(y2)))+1);
 const K=Math.max(1,(2*R+1)/11);
 const U=20,W=(2*R+1)*U,cx=W/2,cy=W/2,X=x=>cx+x*U,Y=y=>cy-y*U,id=o.id||'s';
 let s=`<svg class="gr${R>7?' gr-big':''}" viewBox="0 0 ${W} ${W}" width="${o.w||210}" height="${o.w||210}">`;
 for(let i=-R;i<=R;i++){s+=`<line x1="${X(i)}" y1="${Y(-R-.5)}" x2="${X(i)}" y2="${Y(R+.5)}" stroke="#d1d5db" stroke-width="1"/><line x1="${X(-R-.5)}" y1="${Y(i)}" x2="${X(R+.5)}" y2="${Y(i)}" stroke="#d1d5db" stroke-width="1"/>`;}
 s+=`<line x1="${X(-R-.5)}" y1="${cy}" x2="${X(R+.5)}" y2="${cy}" stroke="#111" stroke-width="1.6"/><line x1="${cx}" y1="${Y(-R-.5)}" x2="${cx}" y2="${Y(R+.5)}" stroke="#111" stroke-width="1.6"/>`;
 s+=`<text x="${X(R+.5)-8}" y="${cy-5}" font-size="${13*K}" font-style="italic">x</text><text x="${cx+5}" y="${Y(R+.5)+12}" font-size="${13*K}" font-style="italic">y</text><text x="${cx-13}" y="${cy+14}" font-size="${12*K}">O</text>`;
 const H=`stroke="#fff" stroke-width="${4*K}" paint-order="stroke"`;
 const TW=t=>[...String(t)].reduce((a,c)=>a+(c.charCodeAt(0)>255?12.5*K:7.2*K),0),FX=(x,t,an)=>{const w=TW(t);let st=an==='end'?x-w:an==='middle'?x-w/2:x;return Math.max(3,Math.min(st,W-3-w));};
 for(let v=-R+1;v<R;v++){if(v===0||v%2)continue;s+=`<text x="${X(v)}" y="${cy+14}" font-size="${11*K}" text-anchor="middle" ${H}>${mi(v)}</text><text x="${cx-5}" y="${Y(v)+4}" font-size="${11*K}" text-anchor="end" ${H}>${mi(v)}</text>`;}
 if(o.full){s+=`<clipPath id="cs${id}"><rect x="${X(-R-.5)}" y="${Y(R+.5)}" width="${W}" height="${W}"/></clipPath><line clip-path="url(#cs${id})" x1="${X(-R-.5)}" y1="${Y(a*(-R-.5)+b)}" x2="${X(R+.5)}" y2="${Y(a*(R+.5)+b)}" stroke="#9ca3af" stroke-width="1.6" stroke-dasharray="5 4"/>`;}
 if(o.proj){[[x1,y1],[x2,y2]].forEach(p=>{s+=`<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(p[0])}" y2="${cy}" stroke="#2563eb" stroke-width="1.4" stroke-dasharray="4 3"/><line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${cx}" y2="${Y(p[1])}" stroke="#c2410c" stroke-width="1.4" stroke-dasharray="4 3"/>`;});
  s+=`<line x1="${X(x1)}" y1="${cy}" x2="${X(x2)}" y2="${cy}" stroke="#2563eb" stroke-width="6"/><line x1="${cx}" y1="${Y(y1)}" x2="${cx}" y2="${Y(y2)}" stroke="#c2410c" stroke-width="6"/>`;
}
 if(!o.noline)s+=`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#111" stroke-width="3"/>`;
 [[x1,y1,o.c1!==false],[x2,y2,o.c2!==false]].forEach(p=>{s+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${5.5*K}" fill="${p[2]?'#111':'#fff'}" stroke="#111" stroke-width="2"/>`;});
 if(o.lab){const up=y1>=y2?0:1;[[x1,y1],[x2,y2]].forEach((p,k)=>{if(!Number.isInteger(p[1])&&!o.labs)return;const top=(k===up);let tx=Math.min(Math.max(X(p[0]),34),W-34);s+=`<text x="${tx}" y="${top?Y(p[1])-11:Y(p[1])+21}" text-anchor="middle" font-size="${13*K}" font-weight="700" ${H}>${o.labs?o.labs[k]:'('+mi(p[0])+', '+mi(p[1])+')'}</text>`;});}
 (o.rings||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="${11*K}" fill="none" stroke="#c2410c" stroke-width="2.4"/>`;});
 (o.notes||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${FX(X(x)+(dx||0),t,an||'start')}" y="${Y(y)+(dy||0)}" font-size="${12.5*K}" font-weight="700" fill="#c2410c" ${H}>${t}</text>`;});
 if(o.tag){o.tag.forEach(t=>{s+=`<text x="${t[0]}" y="${t[1]}" font-size="${12*K}" font-weight="700" fill="${t[3]||'#111'}" ${H}>${t[2]}</text>`;});}
 return s+'</svg>';};
function NLI(lo,hi,c1,c2,o){o=o||{};const a=Math.min(lo,-1)-1,b=Math.max(hi,1)+1,W=320,L=16,S=(W-2*L)/(b-a),X=v=>L+(v-a)*S,y=34;
 let s=`<svg class="nl" viewBox="0 0 ${W} 60" width="${o.w||300}" height="${(o.w||300)*60/W}"><line x1="${L-6}" y1="${y}" x2="${W-L+6}" y2="${y}" stroke="#111" stroke-width="1.5"/>`;
 for(let v=a;v<=b;v++){s+=`<line x1="${X(v)}" y1="${y-4}" x2="${X(v)}" y2="${y+4}" stroke="#111"/><text x="${X(v)}" y="${y+18}" text-anchor="middle" font-size="11" fill="#555">${mi(v)}</text>`;}
 s+=`<line x1="${X(lo)}" y1="${y}" x2="${X(hi)}" y2="${y}" stroke="#2563eb" stroke-width="5"/>`;
 [[lo,c1],[hi,c2]].forEach(p=>{s+=`<circle cx="${X(p[0])}" cy="${y}" r="6" fill="${p[1]?'#111':'#fff'}" stroke="#111" stroke-width="2"/>`;});
 if(o.t)s+=`<text x="${(X(lo)+X(hi))/2}" y="${y-12}" text-anchor="middle" font-size="12" font-weight="700">${o.t}</text>`;
 return s+'</svg>';};
let RD=(a,b,x1,x2,c1,c2,id)=>'<div class="grq">'+GS(a,b,{x1,x2,c1,c2,id,w:200})+'</div>';
let RDW=(a,b,x1,x2,c1,c2,id)=>GS(a,b,{x1,x2,c1,c2,id,w:210,proj:true,lab:true});
return {GS,NLI,RD,RDW};
})();
NS["u4"]=(function(){
let mi=v=>String(v).replace('-','−');
function GL(o){const R=o.R||6,U=20,W=(2*R+1)*U,cx=W/2,cy=W/2,X=x=>cx+x*U,Y=y=>cy-y*U,id=o.id||'g';
 const K=Math.max(1,(2*R+1)/11),H=`stroke="#fff" stroke-width="${4*K}" paint-order="stroke"`;
 const TW=t=>[...String(t)].reduce((a,c)=>a+(c.charCodeAt(0)>255?12.5*K:7.2*K),0);
 const FX=(x,t,an)=>{const w=TW(t);let st=an==='end'?x-w:an==='middle'?x-w/2:x;st=Math.max(3,Math.min(st,W-3-w));return st;};
 let s=`<svg class="gr${R>7?' gr-big':''}" viewBox="0 0 ${W} ${W}" width="${o.w||220}" height="${o.w||220}"><defs><pattern id="hp${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#d97706" stroke-width="2.2"/></pattern><clipPath id="cl${id}"><rect x="${X(-R-.5)}" y="${Y(R+.5)}" width="${W}" height="${W}"/></clipPath></defs>`;
 for(let i=-R;i<=R;i++){s+=`<line x1="${X(i)}" y1="${Y(-R-.5)}" x2="${X(i)}" y2="${Y(R+.5)}" stroke="#e5e7eb" stroke-width="1"/><line x1="${X(-R-.5)}" y1="${Y(i)}" x2="${X(R+.5)}" y2="${Y(i)}" stroke="#e5e7eb" stroke-width="1"/>`;}
 (o.tri?[o.tri]:[]).forEach(t=>{s+=`<polygon points="${t.map(p=>X(p[0])+','+Y(p[1])).join(' ')}" fill="url(#hp${id})" stroke="none"/>`;});
 s+=`<line x1="${X(-R-.5)}" y1="${cy}" x2="${X(R+.5)}" y2="${cy}" stroke="#111" stroke-width="1.6"/><line x1="${cx}" y1="${Y(-R-.5)}" x2="${cx}" y2="${Y(R+.5)}" stroke="#111" stroke-width="1.6"/>`;
 s+=`<text x="${X(R+.5)-8}" y="${cy-5}" font-size="${13*K}" font-style="italic">x</text><text x="${cx+5}" y="${Y(R+.5)+12}" font-size="${13*K}" font-style="italic">y</text><text x="${cx-13}" y="${cy+14}" font-size="${12*K}">O</text>`;
 for(let v=-R+1;v<R;v++){if(v===0||v%2)continue;s+=`<text x="${X(v)}" y="${cy+14}" font-size="${11*K}" text-anchor="middle" fill="#555" ${H}>${mi(v)}</text><text x="${cx-5}" y="${Y(v)+4}" font-size="${11*K}" text-anchor="end" fill="#555" ${H}>${mi(v)}</text>`;}
 (o.lines||[]).forEach(l=>{const [a,b,nm,lx]=l;s+=`<line clip-path="url(#cl${id})" x1="${X(-R-.5)}" y1="${Y(a*(-R-.5)+b)}" x2="${X(R+.5)}" y2="${Y(a*(R+.5)+b)}" stroke="#111" stroke-width="2.2"/>`;if(nm)s+=`<text x="${FX(X(lx)+7,nm,'start')}" y="${Math.max(14,Math.min(W-4,Y(a*lx+b)-4))}" font-size="${13*K}" font-weight="700" ${H}>${nm}</text>`;});
 if(o.base){const [x1,y1,x2,y2,t,dx,dy]=o.base;s+=`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#2563eb" stroke-width="5"/><text x="${(X(x1)+X(x2))/2+(dx||0)}" y="${(Y(y1)+Y(y2))/2+(dy||0)}" text-anchor="middle" font-size="${13*K}" font-weight="700" ${H}>${t}</text>`;}
 if(o.h){const [x1,y1,x2,y2,t,dx,dy]=o.h;s+=`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#c2410c" stroke-width="2.6" stroke-dasharray="6 4"/><text x="${(X(x1)+X(x2))/2+(dx||0)}" y="${(Y(y1)+Y(y2))/2+(dy||0)}" text-anchor="middle" font-size="${13*K}" font-weight="700" ${H}>${t}</text>`;}
 if(o.yax){s+=`<line x1="${cx}" y1="${Y(R+.3)}" x2="${cx}" y2="${Y(-R-.3)}" stroke="#c2410c" stroke-width="5" stroke-opacity=".55"/>`;}
 if(o.xax){s+=`<line x1="${X(-R-.3)}" y1="${cy}" x2="${X(R+.3)}" y2="${cy}" stroke="#c2410c" stroke-width="5" stroke-opacity=".55"/>`;}
 (o.segs||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#111" stroke-width="2.4" ${q[4]?'stroke-dasharray="6 4"':''}/>`;});
 const OF={r:[8,4,'start'],l:[-8,4,'end'],t:[0,-9,'middle'],b:[0,18,'middle'],tr:[6,-7,'start'],tl:[-6,-7,'end'],br:[6,16,'start'],bl:[-6,16,'end']};
 (o.pts||[]).forEach(q=>{const f=OF[q[3]||'tr'];s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="${4.5*K}" fill="#111"/>`+(q[2]?`<text x="${FX(X(q[0])+f[0],q[2],f[2])}" y="${Y(q[1])+f[1]}" font-size="${13*K}" font-weight="700" ${H}>${q[2]}</text>`:'');});
 (o.rings||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="${10*K}" fill="none" stroke="#c2410c" stroke-width="${2.4*K}"/>`;});
 (o.notes||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${FX(X(x)+(dx||0),t,an||'start')}" y="${Y(y)+(dy||0)}" font-size="${12.5*K}" font-weight="700" fill="#c2410c" ${H}>${t}</text>`;});
 return s+'</svg>';};
function NL(a,b,o){o=o||{};const lo=Math.min(a,b)-1,hi=Math.max(a,b)+1,n=hi-lo,W=320,L=20,S=(W-2*L)/n,X=v=>L+(v-lo)*S,m=(a+b)/2,y=46;
 const H='stroke="#fff" stroke-width="4" paint-order="stroke"';
 let s=`<svg class="nl" viewBox="0 0 ${W} 92" width="${o.w||300}" height="${(o.w||300)*92/W}"><line x1="${L-8}" y1="${y}" x2="${W-L+8}" y2="${y}" stroke="#111" stroke-width="1.6"/>`;
 for(let v=lo;v<=hi;v++){s+=`<line x1="${X(v)}" y1="${y-5}" x2="${X(v)}" y2="${y+5}" stroke="#111" stroke-width="1.2"/><text x="${X(v)}" y="${y+21}" text-anchor="middle" font-size="12" fill="#555">${mi(v)}</text>`;}
 s+=`<line x1="${X(a)}" y1="${y-14}" x2="${X(m)}" y2="${y-14}" stroke="#2563eb" stroke-width="3"/><line x1="${X(m)}" y1="${y-14}" x2="${X(b)}" y2="${y-14}" stroke="#2563eb" stroke-width="3" stroke-dasharray="6 3"/>`;
 s+=`<text x="${(X(a)+X(m))/2}" y="${y-20}" text-anchor="middle" font-size="12" font-weight="700" ${H}>${o.d||''}</text><text x="${(X(m)+X(b))/2}" y="${y-20}" text-anchor="middle" font-size="12" font-weight="700" ${H}>${o.d||''}</text>`;
 [a,b].forEach(v=>{s+=`<circle cx="${X(v)}" cy="${y}" r="5" fill="#111"/>`;});
 s+=`<polygon points="${X(m)-6},${y+33} ${X(m)+6},${y+33} ${X(m)},${y+25}" fill="#111"/>`;
 if(o.show!==false)s+=`<text x="${X(m)}" y="${y+46}" text-anchor="middle" font-size="12" font-weight="700" ${H}>まん中${o.v&&Number.isInteger(m)?' '+mi(m):''}</text>`;
 return s+'</svg>';};
let GRP=(t)=>`<div class="g2">${t.map(x=>`<div>${x[0]}<div class="gc">${x[1]}</div></div>`).join('')}</div>`;
let G5=(o)=>GL(Object.assign({R:6,w:270,lines:[[1,5,'ℓ：y=x+5',0.4],[-1,1,'m：y=−x+1',2.4]]},o));
let GW=(o)=>GL(Object.assign({R:9,lines:[[2,8,'ℓ',0.3],[-1/3,1,'m',6]],pts:[[-3,2,'A','tl'],[-4,0,'B','bl'],[3,0,'C','b'],[0,8,'D','r'],[0,1,'E','tr']]},o));
return {GL,GRP,G5,GW,NL};
})();
NS["u5"]=(function(){
let TB=(xs,ys,xl,yl)=>`<table class="tb"><tr><th>${xl||'\\(x\\)'}</th>${xs.map(v=>`<td>${v}</td>`).join('')}</tr><tr><th>${yl||'\\(y\\)'}</th>${ys.map(v=>`<td>${v}</td>`).join('')}</tr></table>`;
let SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
function GQ(o){const nx=o.xmax/o.xs,ny=o.ymax/o.ys,csx=230/nx,csy=Math.min(170/ny,csx*1.6),L=42,B=28,T=24,Rm=56,PW=nx*csx,PH=ny*csy,W=L+PW+Rm,H=T+PH+B;
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
 (o.pts||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4" fill="#111"/>`+(q[2]?`<text x="${X(q[0])+7}" y="${Y(q[1])-7}" font-size="12" font-weight="700" ${SH}>${q[2]}</text>`:'');});
 (o.rings||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="9" fill="none" stroke="#c2410c" stroke-width="2.2"/>`;});
 (o.notes||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${X(x)+(dx||0)}" y="${Y(y)+(dy||0)}" text-anchor="${an||'start'}" font-size="12" font-weight="700" fill="#c2410c" ${SH}>${t}</text>`;});
 (o.labs||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${X(x)+(dx||0)}" y="${Y(y)+(dy||0)}" text-anchor="${an||'start'}" font-size="12" font-weight="700" ${SH}>${t}</text>`;});
 return s+'</svg>';};
let TANK=(v,cap,lab,w)=>{const H=90,h=H*v/cap;return `<svg viewBox="0 0 90 120" width="${w||70}" height="${(w||70)*120/90}"><rect x="15" y="10" width="60" height="${H}" fill="#fff" stroke="#111" stroke-width="2"/><rect x="16" y="${10+H-h}" width="58" height="${h}" fill="#93c5fd" stroke="none"/><line x1="16" y1="${10+H-h}" x2="74" y2="${10+H-h}" stroke="#1d4ed8" stroke-width="1.6"/><text x="45" y="116" text-anchor="middle" font-size="12" font-weight="700">${lab}</text></svg>`;};
let CANDLE=(len,max,lab,w)=>{const H=80,h=H*len/max;return `<svg viewBox="0 0 70 120" width="${w||56}" height="${(w||56)*120/70}"><rect x="25" y="${12+H-h}" width="20" height="${h}" fill="#fef3c7" stroke="#111" stroke-width="2"/><path d="M35 ${12+H-h-12} q5 6 0 11 q-5 -5 0 -11" fill="#f59e0b" stroke="#b45309"/><text x="35" y="114" text-anchor="middle" font-size="12" font-weight="700">${lab}</text></svg>`;};
let TAPE60=(top,bot)=>{let s=`<svg viewBox="0 0 320 96" width="300" height="90"><text x="160" y="14" text-anchor="middle" font-size="12" font-weight="700">${top}</text><rect x="10" y="22" width="300" height="24" fill="#fff" stroke="#111" stroke-width="2"/>`;for(let i=1;i<60;i++)s+=`<line x1="${10+5*i}" y1="${i%10?36:26}" x2="${10+5*i}" y2="46" stroke="#555" stroke-width="${i%10?0.8:1.4}"/>`;s+=`<rect x="10" y="22" width="5" height="24" fill="#c2410c"/><path d="M12 50 L12 62" stroke="#c2410c" stroke-width="1.6"/><text x="16" y="74" font-size="12" font-weight="700" fill="#c2410c">${bot}</text><text x="310" y="62" text-anchor="end" font-size="11" fill="#555">60 こに分ける</text></svg>`;return s;};
let TWD=t=>[...String(t)].reduce((a,c)=>a+(c.charCodeAt(0)>255?12.5:7),0);
function RECTP(AD,AB,s,o){o=o||{};const k=Math.min(110/AD,110/AB),Wd=AD*k,Hd=AB*k;let L1=(o.seg&&s<=AB)?36+TWD(o.seg):30,R1=(o.seg&&s>AB+AD)?36+TWD(o.seg):40;
 const need=Math.max(o.ad?TWD(o.ad)+40:0,o.path?Math.max(...o.path.split('|').map(TWD))+16:0,(o.ad&&s>AB+AD&&o.seg)?0:0);if(L1+Wd+R1<need){const e=need-(L1+Wd+R1);L1+=e/2;R1+=e/2;}
 const x0=L1,y0=o.ad?38:(o.dims?26:20);let px,py;
 if(s<=AB){px=x0;py=y0+s*k;}else if(s<=AB+AD){px=x0+(s-AB)*k;py=y0+Hd;}else{px=x0+Wd;py=y0+Hd-(s-AB-AD)*k;}
 const W=Wd+L1+R1,H=Hd+y0+(o.path?58:30);let t=`<svg viewBox="0 0 ${W} ${H}" width="${Math.min(Math.max(o.w||150,W),330)}" height="${Math.min(Math.max(o.w||150,W),330)*H/W}"><defs><pattern id="rp${o.id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#d97706" stroke-width="2"/></pattern></defs>`;
 if(s>0&&s<AB+AD+AB)t+=`<polygon points="${x0},${y0} ${px},${py} ${x0+Wd},${y0}" fill="url(#rp${o.id})" stroke="#111" stroke-width="1.4"/>`;
 t+=`<rect x="${x0}" y="${y0}" width="${Wd}" height="${Hd}" fill="none" stroke="#111" stroke-width="2"/>`;
 t+=`<text x="${x0-6}" y="${y0-4}" text-anchor="end" font-size="13" font-weight="700">A</text><text x="${x0-6}" y="${y0+Hd+14}" text-anchor="end" font-size="13" font-weight="700">B</text><text x="${x0+Wd+6}" y="${y0+Hd+14}" font-size="13" font-weight="700">C</text><text x="${x0+Wd+6}" y="${y0-4}" font-size="13" font-weight="700">D</text>`;
 if(o.dims||o.ad){const lw=TWD(o.ad||AD+' cm'),lx=Math.min(Math.max(x0+Wd/2,lw/2+4),W-lw/2-4);t+=`<text x="${lx}" y="${o.ad?y0-20:y0-7}" text-anchor="middle" font-size="12" font-weight="700">${o.ad||AD+' cm'}</text>`;}
 if(o.dims)t+=`<text x="${x0+Wd+6}" y="${y0+Hd/2+4}" font-size="12">${AB} cm</text>`;
 if(o.seg){const c='#c2410c';if(s<=AB){const bx=x0-24;t+=`<line x1="${bx}" y1="${y0}" x2="${bx}" y2="${py}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${y0}" x2="${bx+4}" y2="${y0}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${py}" x2="${bx+4}" y2="${py}" stroke="${c}" stroke-width="1.6"/><text x="${bx-5}" y="${(y0+py)/2+4}" text-anchor="end" font-size="12" font-weight="700" fill="${c}" ${SH}>${o.seg}</text>`;}
  else if(s>AB+AD){const bx=x0+Wd+22;t+=`<line x1="${bx}" y1="${y0}" x2="${bx}" y2="${py}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${y0}" x2="${bx+4}" y2="${y0}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${py}" x2="${bx+4}" y2="${py}" stroke="${c}" stroke-width="1.6"/><text x="${bx+5}" y="${(y0+py)/2+4}" font-size="12" font-weight="700" fill="${c}" ${SH}>${o.seg}</text>`;}}
 if(o.path){const c='#c2410c',pts=[[x0,y0]];if(s>AB)pts.push([x0,y0+Hd]);if(s>AB+AD)pts.push([x0+Wd,y0+Hd]);pts.push([px,py]);
  t+=`<polyline points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="6" stroke-opacity=".45" stroke-linejoin="round"/>`;
  if(s>AB+AD)t+=`<line x1="${px}" y1="${py}" x2="${x0+Wd}" y2="${y0}" stroke="#1d4ed8" stroke-width="4" stroke-dasharray="5 4"/>`;
  o.path.split('|').forEach((pl,i)=>{t+=`<text x="${W/2}" y="${y0+Hd+30+i*15}" text-anchor="middle" font-size="12" font-weight="700" fill="${c}" ${SH}>${pl}</text>`;});}
 t+=`<circle cx="${px}" cy="${py}" r="4.5" fill="#c2410c"/><text x="${px+(s<=AB?-8:8)}" y="${py+(s<=AB?4:(s<=AB+AD?16:4))}" text-anchor="${s<=AB?'end':'start'}" font-size="13" font-weight="700" fill="#c2410c" ${SH}>P</text>`;
 t+='</svg>';return o.lab?`<div style="display:inline-block">${t}<div class="gc"><b>${o.lab}</b></div></div>`:t;};
function PATHT(AD,AB,o){o=o||{};const tot=AB+AD+AB,k=Math.min(36,300/tot),x0=20,y0=46,W=tot*k+40;const HH=o.split?116:92;let t=`<svg viewBox="0 0 ${W} ${HH}" width="${Math.min(W,340)}" height="${HH*Math.min(W,340)/W}">`;
 t+=`<line x1="${x0}" y1="${y0}" x2="${x0+tot*k}" y2="${y0}" stroke="#111" stroke-width="2.5"/>`;
 for(let i=0;i<=tot;i++)t+=`<line x1="${x0+i*k}" y1="${y0-4}" x2="${x0+i*k}" y2="${y0+4}" stroke="#555" stroke-width="1"/>`;
 [[0,'A'],[AB,'B'],[AB+AD,'C'],[tot,'D']].forEach(([v,n])=>{t+=`<line x1="${x0+v*k}" y1="${y0-8}" x2="${x0+v*k}" y2="${y0+8}" stroke="#111" stroke-width="2"/><text x="${x0+v*k}" y="${y0+22}" text-anchor="middle" font-size="12" font-weight="700">${n}</text><text x="${x0+v*k}" y="${y0+36}" text-anchor="middle" font-size="10" fill="#555">${v} cm</text>`;});
 if(o.split){const [v,l1,l2]=o.split;t+=`<line x1="${x0}" y1="${y0-12}" x2="${x0+v*k}" y2="${y0-12}" stroke="#c2410c" stroke-width="6" stroke-opacity=".45"/><text x="${x0+v*k/2}" y="${y0-20}" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c" ${SH}>${l1}</text><line x1="${x0+v*k}" y1="${y0-12}" x2="${x0+tot*k}" y2="${y0-12}" stroke="#1d4ed8" stroke-width="4" stroke-dasharray="5 4"/><text x="${x0+(v+tot)*k/2}" y="${y0-20}" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8" ${SH}>${l2}</text><circle cx="${x0+v*k}" cy="${y0}" r="4" fill="#c2410c"/><text x="${x0+v*k}" y="${y0+22}" text-anchor="middle" font-size="12" font-weight="700" fill="#c2410c">P</text>`;
  t+=`<path d="M${x0} ${y0+44} v6 H${x0+tot*k} v-6" fill="none" stroke="#111" stroke-width="1.2"/><text x="${x0+tot*k/2}" y="${y0+62}" text-anchor="middle" font-size="11" font-weight="700">${o.total||'全部で '+tot+' cm'}</text>`;}
 (o.marks||[]).forEach(([v,lab],i)=>{const yy=y0-10-i*12;t+=`<line x1="${x0}" y1="${yy}" x2="${x0+v*k}" y2="${yy}" stroke="#c2410c" stroke-width="1.6"/><circle cx="${x0+v*k}" cy="${y0}" r="4" fill="#c2410c"/><text x="${x0+v*k+4}" y="${yy+4}" font-size="11" font-weight="700" fill="#c2410c" ${SH}>${lab}</text>`;});
 return t+'</svg>';};
let FIGS=a=>`<div class="g2">${a.map(x=>`<div>${x[0]}${x[1]?`<div class="gc">${x[1]}</div>`:''}</div>`).join('')}</div>`;
let GW=(o)=>GQ(Object.assign({xmax:40,ymax:10,xs:5,ys:1,xt:10,yt:2,xu:'分',yu:'km',w:300,polys:[[[0,0],[15,2],[25,2],[38.33,10]]]},o));
return {TANK,FIGS,TB,GQ,CANDLE,GW,TAPE60,RECTP,PATHT};
})();
NS["ct1"]=(function(){
let TBA=(xs,ys,yn,xn)=>{const n=xs.length;const gap=(arr,cls)=>arr?`<tr class="${cls}"><th></th><td class="g"></td>${arr.map(t=>`<td colspan="2" class="g">${t?`<span>${t}</span>`:''}</td>`).join('')}<td class="g"></td></tr>`:'';
 return `<table class="tb tba">${gap(xn,'xn')}<tr><th>\\(x\\)</th>${xs.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr>${gap(yn,'yn')}</table>`;};
let TB=(xs,ys)=>`<table class="tb"><tr><th>\\(x\\)</th>${xs.map(v=>`<td>${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map(v=>`<td>${v}</td>`).join('')}</tr></table>`;
let mi=v=>String(v).replace(/^-/,'−');
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
 return s+'</svg>';};
let G6=(a,b)=>GS({sm:true,w:140,lines:[[a,b]]});
let G6N=(a,b)=>GS({sm:true,w:140,grid:false,nums:false,lines:[[a,b]]});
return {GS,G6N,TB,TBA,G6};
})();
NS["ct2"]=(function(){
let mi=v=>String(v).replace(/^-/,'−');
let SH='stroke="#fff" stroke-width="4" paint-order="stroke"';
function GL(o){const R=o.R||6,U=20,W=(2*R+1)*U,cx=W/2,cy=W/2,X=x=>cx+x*U,Y=y=>cy-y*U,id=o.id||'g';
 const K=Math.max(1,(2*R+1)/11),H=`stroke="#fff" stroke-width="${4*K}" paint-order="stroke"`;
 const TW=t=>[...String(t)].reduce((a,c)=>a+(c.charCodeAt(0)>255?12.5*K:7.2*K),0);
 const FX=(x,t,an)=>{const w=TW(t);let st=an==='end'?x-w:an==='middle'?x-w/2:x;st=Math.max(3,Math.min(st,W-3-w));return st;};
 let s=`<svg class="gr${R>7?' gr-big':''}" viewBox="0 0 ${W} ${W}" width="${o.w||220}" height="${o.w||220}"><defs><pattern id="hp${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#d97706" stroke-width="2.2"/></pattern><clipPath id="cl${id}"><rect x="${X(-R-.5)}" y="${Y(R+.5)}" width="${W}" height="${W}"/></clipPath></defs>`;
 for(let i=-R;i<=R;i++){s+=`<line x1="${X(i)}" y1="${Y(-R-.5)}" x2="${X(i)}" y2="${Y(R+.5)}" stroke="#e5e7eb" stroke-width="1"/><line x1="${X(-R-.5)}" y1="${Y(i)}" x2="${X(R+.5)}" y2="${Y(i)}" stroke="#e5e7eb" stroke-width="1"/>`;}
 (o.tri?[o.tri]:[]).forEach(t=>{s+=`<polygon points="${t.map(p=>X(p[0])+','+Y(p[1])).join(' ')}" fill="url(#hp${id})" stroke="none"/>`;});
 s+=`<line x1="${X(-R-.5)}" y1="${cy}" x2="${X(R+.5)}" y2="${cy}" stroke="#111" stroke-width="1.6"/><line x1="${cx}" y1="${Y(-R-.5)}" x2="${cx}" y2="${Y(R+.5)}" stroke="#111" stroke-width="1.6"/>`;
 s+=`<text x="${X(R+.5)-8}" y="${cy-5}" font-size="${13*K}" font-style="italic">x</text><text x="${cx+5}" y="${Y(R+.5)+12}" font-size="${13*K}" font-style="italic">y</text><text x="${cx-13}" y="${cy+14}" font-size="${12*K}">O</text>`;
 for(let v=-R+1;v<R;v++){if(v===0||v%2)continue;s+=`<text x="${X(v)}" y="${cy+14}" font-size="${11*K}" text-anchor="middle" fill="#555" ${H}>${mi(v)}</text><text x="${cx-5}" y="${Y(v)+4}" font-size="${11*K}" text-anchor="end" fill="#555" ${H}>${mi(v)}</text>`;}
 (o.lines||[]).forEach(l=>{const [a,b,nm,lx]=l;s+=`<line clip-path="url(#cl${id})" x1="${X(-R-.5)}" y1="${Y(a*(-R-.5)+b)}" x2="${X(R+.5)}" y2="${Y(a*(R+.5)+b)}" stroke="#111" stroke-width="2.2"/>`;if(nm)s+=`<text x="${FX(X(lx)+7,nm,'start')}" y="${Math.max(14,Math.min(W-4,Y(a*lx+b)-4))}" font-size="${13*K}" font-weight="700" ${H}>${nm}</text>`;});
 if(o.base){const [x1,y1,x2,y2,t,dx,dy]=o.base;s+=`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#2563eb" stroke-width="5"/><text x="${(X(x1)+X(x2))/2+(dx||0)}" y="${(Y(y1)+Y(y2))/2+(dy||0)}" text-anchor="middle" font-size="${13*K}" font-weight="700" ${H}>${t}</text>`;}
 if(o.h){const [x1,y1,x2,y2,t,dx,dy]=o.h;s+=`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#c2410c" stroke-width="2.6" stroke-dasharray="6 4"/><text x="${(X(x1)+X(x2))/2+(dx||0)}" y="${(Y(y1)+Y(y2))/2+(dy||0)}" text-anchor="middle" font-size="${13*K}" font-weight="700" ${H}>${t}</text>`;}
 if(o.yax){s+=`<line x1="${cx}" y1="${Y(R+.3)}" x2="${cx}" y2="${Y(-R-.3)}" stroke="#c2410c" stroke-width="5" stroke-opacity=".55"/>`;}
 if(o.xax){s+=`<line x1="${X(-R-.3)}" y1="${cy}" x2="${X(R+.3)}" y2="${cy}" stroke="#c2410c" stroke-width="5" stroke-opacity=".55"/>`;}
 (o.segs||[]).forEach(q=>{s+=`<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[2])}" y2="${Y(q[3])}" stroke="#111" stroke-width="2.4" ${q[4]?'stroke-dasharray="6 4"':''}/>`;});
 const OF={r:[8,4,'start'],l:[-8,4,'end'],t:[0,-9,'middle'],b:[0,18,'middle'],tr:[6,-7,'start'],tl:[-6,-7,'end'],br:[6,16,'start'],bl:[-6,16,'end']};
 (o.pts||[]).forEach(q=>{const f=OF[q[3]||'tr'];s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="${4.5*K}" fill="#111"/>`+(q[2]?`<text x="${FX(X(q[0])+f[0],q[2],f[2])}" y="${Y(q[1])+f[1]}" font-size="${13*K}" font-weight="700" ${H}>${q[2]}</text>`:'');});
 (o.rings||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="${10*K}" fill="none" stroke="#c2410c" stroke-width="${2.4*K}"/>`;});
 (o.notes||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${FX(X(x)+(dx||0),t,an||'start')}" y="${Y(y)+(dy||0)}" font-size="${12.5*K}" font-weight="700" fill="#c2410c" ${H}>${t}</text>`;});
 return s+'</svg>';};
function GQ(o){const nx=o.xmax/o.xs,ny=o.ymax/o.ys,csx=230/nx,csy=Math.min(170/ny,csx*1.6),L=42,B=28,T=24,Rm=56,PW=nx*csx,PH=ny*csy,W=L+PW+Rm,H=T+PH+B;
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
 (o.pts||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="4" fill="#111"/>`+(q[2]?`<text x="${X(q[0])+7}" y="${Y(q[1])-7}" font-size="12" font-weight="700" ${SH}>${q[2]}</text>`:'');});
 (o.rings||[]).forEach(q=>{s+=`<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="9" fill="none" stroke="#c2410c" stroke-width="2.2"/>`;});
 (o.notes||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${X(x)+(dx||0)}" y="${Y(y)+(dy||0)}" text-anchor="${an||'start'}" font-size="12" font-weight="700" fill="#c2410c" ${SH}>${t}</text>`;});
 (o.labs||[]).forEach(q=>{const [x,y,t,an,dx,dy]=q;s+=`<text x="${X(x)+(dx||0)}" y="${Y(y)+(dy||0)}" text-anchor="${an||'start'}" font-size="12" font-weight="700" ${SH}>${t}</text>`;});
 return s+'</svg>';};
let TWD=t=>[...String(t)].reduce((a,c)=>a+(c.charCodeAt(0)>255?12.5:7),0);
function RECTP(AD,AB,s,o){o=o||{};const k=Math.min(110/AD,110/AB),Wd=AD*k,Hd=AB*k;let L1=(o.seg&&s<=AB)?36+TWD(o.seg):30,R1=(o.seg&&s>AB+AD)?36+TWD(o.seg):40;
 const need=Math.max(o.ad?TWD(o.ad)+40:0,o.path?Math.max(...o.path.split('|').map(TWD))+16:0,(o.ad&&s>AB+AD&&o.seg)?0:0);if(L1+Wd+R1<need){const e=need-(L1+Wd+R1);L1+=e/2;R1+=e/2;}
 const x0=L1,y0=o.ad?38:(o.dims?26:20);let px,py;
 if(s<=AB){px=x0;py=y0+s*k;}else if(s<=AB+AD){px=x0+(s-AB)*k;py=y0+Hd;}else{px=x0+Wd;py=y0+Hd-(s-AB-AD)*k;}
 const W=Wd+L1+R1,H=Hd+y0+(o.path?58:30);let t=`<svg viewBox="0 0 ${W} ${H}" width="${Math.min(Math.max(o.w||150,W),330)}" height="${Math.min(Math.max(o.w||150,W),330)*H/W}"><defs><pattern id="rp${o.id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#d97706" stroke-width="2"/></pattern></defs>`;
 if(s>0&&s<AB+AD+AB)t+=`<polygon points="${x0},${y0} ${px},${py} ${x0+Wd},${y0}" fill="url(#rp${o.id})" stroke="#111" stroke-width="1.4"/>`;
 t+=`<rect x="${x0}" y="${y0}" width="${Wd}" height="${Hd}" fill="none" stroke="#111" stroke-width="2"/>`;
 t+=`<text x="${x0-6}" y="${y0-4}" text-anchor="end" font-size="13" font-weight="700">A</text><text x="${x0-6}" y="${y0+Hd+14}" text-anchor="end" font-size="13" font-weight="700">B</text><text x="${x0+Wd+6}" y="${y0+Hd+14}" font-size="13" font-weight="700">C</text><text x="${x0+Wd+6}" y="${y0-4}" font-size="13" font-weight="700">D</text>`;
 if(o.dims||o.ad){const lw=TWD(o.ad||AD+' cm'),lx=Math.min(Math.max(x0+Wd/2,lw/2+4),W-lw/2-4);t+=`<text x="${lx}" y="${o.ad?y0-20:y0-7}" text-anchor="middle" font-size="12" font-weight="700">${o.ad||AD+' cm'}</text>`;}
 if(o.dims)t+=`<text x="${x0+Wd+6}" y="${y0+Hd/2+4}" font-size="12">${AB} cm</text>`;
 if(o.seg){const c='#c2410c';if(s<=AB){const bx=x0-24;t+=`<line x1="${bx}" y1="${y0}" x2="${bx}" y2="${py}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${y0}" x2="${bx+4}" y2="${y0}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${py}" x2="${bx+4}" y2="${py}" stroke="${c}" stroke-width="1.6"/><text x="${bx-5}" y="${(y0+py)/2+4}" text-anchor="end" font-size="12" font-weight="700" fill="${c}" ${SH}>${o.seg}</text>`;}
  else if(s>AB+AD){const bx=x0+Wd+22;t+=`<line x1="${bx}" y1="${y0}" x2="${bx}" y2="${py}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${y0}" x2="${bx+4}" y2="${y0}" stroke="${c}" stroke-width="1.6"/><line x1="${bx-4}" y1="${py}" x2="${bx+4}" y2="${py}" stroke="${c}" stroke-width="1.6"/><text x="${bx+5}" y="${(y0+py)/2+4}" font-size="12" font-weight="700" fill="${c}" ${SH}>${o.seg}</text>`;}}
 if(o.path){const c='#c2410c',pts=[[x0,y0]];if(s>AB)pts.push([x0,y0+Hd]);if(s>AB+AD)pts.push([x0+Wd,y0+Hd]);pts.push([px,py]);
  t+=`<polyline points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="6" stroke-opacity=".45" stroke-linejoin="round"/>`;
  if(s>AB+AD)t+=`<line x1="${px}" y1="${py}" x2="${x0+Wd}" y2="${y0}" stroke="#1d4ed8" stroke-width="4" stroke-dasharray="5 4"/>`;
  o.path.split('|').forEach((pl,i)=>{t+=`<text x="${W/2}" y="${y0+Hd+30+i*15}" text-anchor="middle" font-size="12" font-weight="700" fill="${c}" ${SH}>${pl}</text>`;});}
 t+=`<circle cx="${px}" cy="${py}" r="4.5" fill="#c2410c"/><text x="${px+(s<=AB?-8:8)}" y="${py+(s<=AB?4:(s<=AB+AD?16:4))}" text-anchor="${s<=AB?'end':'start'}" font-size="13" font-weight="700" fill="#c2410c" ${SH}>P</text>`;
 t+='</svg>';return o.lab?`<div style="display:inline-block">${t}<div class="gc"><b>${o.lab}</b></div></div>`:t;};
function PATHT(AD,AB,o){o=o||{};const tot=AB+AD+AB,k=Math.min(36,300/tot),x0=20,y0=46,W=tot*k+40;const HH=o.split?116:92;let t=`<svg viewBox="0 0 ${W} ${HH}" width="${Math.min(W,340)}" height="${HH*Math.min(W,340)/W}">`;
 t+=`<line x1="${x0}" y1="${y0}" x2="${x0+tot*k}" y2="${y0}" stroke="#111" stroke-width="2.5"/>`;
 for(let i=0;i<=tot;i++)t+=`<line x1="${x0+i*k}" y1="${y0-4}" x2="${x0+i*k}" y2="${y0+4}" stroke="#555" stroke-width="1"/>`;
 [[0,'A'],[AB,'B'],[AB+AD,'C'],[tot,'D']].forEach(([v,n])=>{t+=`<line x1="${x0+v*k}" y1="${y0-8}" x2="${x0+v*k}" y2="${y0+8}" stroke="#111" stroke-width="2"/><text x="${x0+v*k}" y="${y0+22}" text-anchor="middle" font-size="12" font-weight="700">${n}</text><text x="${x0+v*k}" y="${y0+36}" text-anchor="middle" font-size="10" fill="#555">${v} cm</text>`;});
 if(o.split){const [v,l1,l2]=o.split;t+=`<line x1="${x0}" y1="${y0-12}" x2="${x0+v*k}" y2="${y0-12}" stroke="#c2410c" stroke-width="6" stroke-opacity=".45"/><text x="${x0+v*k/2}" y="${y0-20}" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c" ${SH}>${l1}</text><line x1="${x0+v*k}" y1="${y0-12}" x2="${x0+tot*k}" y2="${y0-12}" stroke="#1d4ed8" stroke-width="4" stroke-dasharray="5 4"/><text x="${x0+(v+tot)*k/2}" y="${y0-20}" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8" ${SH}>${l2}</text><circle cx="${x0+v*k}" cy="${y0}" r="4" fill="#c2410c"/><text x="${x0+v*k}" y="${y0+22}" text-anchor="middle" font-size="12" font-weight="700" fill="#c2410c">P</text>`;
  t+=`<path d="M${x0} ${y0+44} v6 H${x0+tot*k} v-6" fill="none" stroke="#111" stroke-width="1.2"/><text x="${x0+tot*k/2}" y="${y0+62}" text-anchor="middle" font-size="11" font-weight="700">${o.total||'全部で '+tot+' cm'}</text>`;}
 (o.marks||[]).forEach(([v,lab],i)=>{const yy=y0-10-i*12;t+=`<line x1="${x0}" y1="${yy}" x2="${x0+v*k}" y2="${yy}" stroke="#c2410c" stroke-width="1.6"/><circle cx="${x0+v*k}" cy="${y0}" r="4" fill="#c2410c"/><text x="${x0+v*k+4}" y="${yy+4}" font-size="11" font-weight="700" fill="#c2410c" ${SH}>${lab}</text>`;});
 return t+'</svg>';};
function SG(L){const R=6,U=20,W=(2*R+1)*U,c=W/2,X=x=>c+x*U,Y=y=>c-y*U,E=R+.5;
 let s=`<svg class="gch" viewBox="0 0 ${W} ${W}" width="150" height="150">`;
 for(let i=-R;i<=R;i++)s+=`<line x1="${X(i)}" y1="${Y(-E)}" x2="${X(i)}" y2="${Y(E)}" stroke="#d1d5db" stroke-width="1"/><line x1="${X(-E)}" y1="${Y(i)}" x2="${X(E)}" y2="${Y(i)}" stroke="#d1d5db" stroke-width="1"/>`;
 s+=`<line x1="${X(-E)}" y1="${c}" x2="${X(E)}" y2="${c}" stroke="#111" stroke-width="1.8"/><line x1="${c}" y1="${Y(-E)}" x2="${c}" y2="${Y(E)}" stroke="#111" stroke-width="1.8"/>`;
 s+=`<text x="${X(E)-12}" y="${c-6}" font-size="17" font-style="italic">x</text><text x="${c+6}" y="${Y(E)+15}" font-size="17" font-style="italic">y</text><text x="${c-16}" y="${c+17}" font-size="16">O</text>`;
 let x1,y1,x2,y2;
 if(!Array.isArray(L)){x1=x2=L.x;y1=-E;y2=E;}
 else{const [a,b]=L;if(a===0){x1=-E;x2=E;y1=y2=b;}else{const xa=(-E-b)/a,xb=(E-b)/a;x1=Math.max(-E,Math.min(xa,xb));x2=Math.min(E,Math.max(xa,xb));y1=a*x1+b;y2=a*x2+b;}}
 s+=`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#111" stroke-width="3.4"/>`;
 [-4,-2,2,4].forEach(v=>{s+=`<text x="${X(v)}" y="${c+17}" font-size="15" text-anchor="middle" fill="#333" ${SH}>${mi(v)}</text><text x="${c-5}" y="${Y(v)+5}" font-size="15" text-anchor="end" fill="#333" ${SH}>${mi(v)}</text>`;});
 return s+'</svg>';};
return {SG,GL,GQ,RECTP,PATHT};
})();

function wsDe(v,call){ if(Array.isArray(v)) return v.map(x=>wsDe(x,call));
  if(v&&typeof v==='object'){ if('$a' in v&&'$p' in v){const a=v.$a.map(x=>wsDe(x,call));for(const k in v.$p)a[k]=wsDe(v.$p[k],call);return a;} const r={};for(const k in v)r[k]=wsDe(v[k],call);if(v.wid!=null)Object.defineProperty(r,'wid',{value:v.wid,enumerable:false});return r;}
  if(typeof v==='string'&&v.indexOf('\u27e6F:')>=0) return wsExpand(v,call); return v; }
function wsExpand(s,call){ let out='',i=0;
  while(true){ const k=s.indexOf('\u27e6F:',i); if(k<0){out+=s.slice(i);break;}
    out+=s.slice(i,k); const c=s.indexOf(':',k+3); const name=s.slice(k+3,c);
    let d=1,j=c+1; for(;j<s.length;j++){ const ch=s[j]; if(ch==='\u27e6')d++; else if(ch==='\u27e7'){d--; if(!d)break;} }
    if(d) throw new Error('figure token not closed: '+name);
    const args=wsDe(JSON.parse(s.slice(c+1,j)),call); out+=call(name,args); i=j+1; }
  return out; }
function call(name,args){ const p=name.split('.'); const f=NS[p[0]]&&NS[p[0]][p[1]]; if(!f) return '<span class="ws-figerr">図が読めません（'+name+'）</span>'; return f(...args); }
/* 公開：MathFig.data(qdata) ＝ qdata の中の図の印をすべて描いた形にして返す／MathFig.str(文字) */
window.MathFig={data:v=>wsDe(v,call),str:s=>wsExpand(String(s),call),ns:NS};
})();
