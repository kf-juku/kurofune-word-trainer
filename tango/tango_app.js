/* 単語タブ（中学英語スタートダッシュ）の1回分を動かす部品 2026-11-25 ジョブス
   決まり＝ジョブス用\仕様書\ぐるぐる英語_作り方の決まり.md の D3・D7・D12〜D19（見本 KWT 直下 20261125_モック_単語タブ.html）
   流れ＝見る → なぞる（指で）→ 意味（英語を見て4択）→ 英語を書く（意味を見て1文字ずつ。フレーズは語ずつ）→ 小テスト（前の回の5語を先に・その回の5語）→ 採点の画面
   練習（意味・英語を書く）は、まちがえた問題を全部正解になるまで出し直す。記録は1周目の正答数。小テストは1回きり・点は「前の回」と「その回」に分ける（D17）
   使い方：TangoApp.mount(host,{data, no, mode:'round'|'redo', rec:{記録}, onDone:function(state){…}, onClose:function(){…}})
   データ＝tango\sd_tango.json（作り方＝ジョブス用\作業\20261125_単語タブ\tango.py app）。生徒アプリ・ほかの画面のものは使わない（自前の CSS は .tg- で始める） */
(function(){
'use strict';
var CSS='.tg{font-family:inherit;color:#111;max-width:560px;margin:0 auto;padding:4px 2px 30px}.tg *{box-sizing:border-box}'
+'.tg-st{display:flex;gap:4px;margin:4px 0 12px}.tg-st span{flex:1;text-align:center;font-size:11px;padding:5px 2px;border-radius:6px;background:#eef0f3;color:#6b7280;font-weight:700}.tg-st span.d{background:#d1fae5;color:#047857}.tg-st span.c{background:#2563eb;color:#fff}'
+'.tg-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;text-align:center}'
+'.tg-cnt{font-size:12px;color:#6b7280}.tg-tip{font-size:13px;margin-top:2px}.tg-big{font-size:44px;font-weight:800;margin:10px 0 4px;word-break:break-word;line-height:1.15}.tg-big.tg-phr{font-size:30px}'
+'.tg-yomi{font-size:16px;color:#374151}.tg-ja{font-size:20px;font-weight:700;margin-top:4px}'
+'.tg-hint{margin-top:12px;font-size:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:9px;text-align:left;line-height:1.6}'
+'.tg-spk{display:inline-flex;align-items:center;gap:4px;margin-top:10px;border:1px solid #d1d5db;background:#fff;border-radius:999px;padding:7px 16px;font-size:14px;cursor:pointer}'
+'.tg-row{display:flex;gap:8px;margin-top:14px}.tg-btn{flex:1;padding:13px;border:0;border-radius:10px;background:#111;color:#fff;font-size:16px;font-weight:700;cursor:pointer}.tg-btn.sub{background:#fff;color:#111;border:1px solid #d1d5db}.tg-btn:disabled{opacity:.4}'
+'.tg-q{font-size:15px;font-weight:700;text-align:left;margin-bottom:10px}'
+'.tg-tr{position:relative;width:100%;height:210px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;touch-action:none;overflow:hidden}.tg-tr canvas{position:absolute;inset:0;width:100%;height:100%}'
+'.tg-chc{display:grid;grid-template-columns:1fr 1fr;gap:8px}.tg-chc button{font:inherit;font-size:17px;padding:14px 8px;border:1px solid #d1d5db;border-radius:10px;background:#fff;cursor:pointer}.tg-chc button.ok{border:2px solid #059669;background:#ecfdf5}.tg-chc button.ng{border:2px solid #dc2626;background:#fef2f2}'
+'.tg-slots{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:6px 0 12px;min-height:50px}.tg-slots span{min-width:38px;height:46px;padding:0 6px;border:2px dashed #93c5fd;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700}.tg-slots span.f{border-style:solid;border-color:#2563eb;background:#eff6ff}.tg-slots span.fix{border:0;min-width:10px;padding:0 1px}'
+'.tg-tiles{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.tg-tiles button{font:inherit;min-width:44px;height:48px;padding:0 10px;border:2px solid #d1d5db;border-radius:8px;background:#fff;font-size:21px;font-weight:700;cursor:pointer}.tg-tiles button.ng{border-color:#dc2626;background:#fef2f2;animation:tgsh .3s}.tg-tiles button:disabled{opacity:.25}'
+'@keyframes tgsh{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}'
+'.tg-fb{margin-top:12px;font-size:15px;min-height:24px}.tg-fb.ok{color:#047857;font-weight:700}.tg-fb.ng{color:#b91c1c}'
+'.tg-res .tg-sc{font-size:40px;font-weight:800}.tg-res .tg-sc small{font-size:16px}.tg-two{display:flex;gap:8px;margin:12px 0}.tg-two>div{flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:10px;background:#fff}.tg-two b{font-size:26px}.tg-two .k{font-size:12px;color:#6b7280}'
+'.tg-teach{border:2px solid #111;border-radius:10px;padding:10px;text-align:center;font-weight:800;margin:10px 0;background:#fff}.tg-teach small{display:block;font-weight:400;font-size:12px;color:#555;margin-top:2px}'
+'.tg-ml{text-align:left;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:4px 12px}.tg-ml div{display:flex;gap:8px;padding:8px 0;border-top:1px solid #f1f2f4;font-size:15px}.tg-ml div:first-child{border-top:0}.tg-ml .x{color:#dc2626;font-weight:800}.tg-ml .o{color:#059669;font-weight:800}.tg-ml .a{font-weight:800}.tg-ml .y{color:#6b7280;font-size:13px}'
+'.tg-row3{display:flex;gap:6px;margin-top:12px}.tg-row3 .tg-btn{padding:12px 6px;font-size:15px}.tg-rp{display:flex;justify-content:flex-end;margin:-4px 0 6px}.tg-rp button{border:1.5px solid #ea580c;color:#c2410c;background:#fff7ed;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:700;font-family:inherit;cursor:pointer}.tg-row3[hidden],.tg-btn[hidden]{display:none}.tg-btn:disabled{background:#d1d5db;color:#4b5563;cursor:default}.tg-bj{font-size:26px;font-weight:800;margin:6px 0 2px}.tg-ans{font-family:inherit;font-size:30px;font-weight:800;margin:8px 0 0;color:#1d4ed8;min-height:38px}'
+'.tg-perf{font-size:22px;font-weight:800;color:#b45309;margin:4px 0}';
var cssDone=false;
/* 2026-11-26 単語タブ：書き順つきの字（決まり D23）。tango_app.js の中に入れて使う部品の下書き。
   座標＝4本線：y 0＝1本目・1＝2本目・2＝3本目（下の太い線）・3＝4本目。x は字の左はしを0。
   1字＝{w:幅, s:[画, …]}。画＝点の並び（点＝[x,y]）。描く向きは並びの順＝書き順の向き。
   書き順の元（PC のフォルダ ジョブス用\データ\参考書\英語\入門\）＝大文字は はじめてのアルファベット.pdf（PDF 4〜10ページ・2026-11-26 に全部照らした）、小文字は アルファベットの名人(フォニックス付き)_本体.pdf の6ページ（はじめての〜に小文字が無いため）。 */
var ABC=(function(){
  function L(){var a=[];for(var i=0;i<arguments.length;i+=2)a.push([arguments[i],arguments[i+1]]);return a;}
  /* だ円の弧：中心 cx,cy・半径 rx,ry・角度 a0→a1（度。0＝右・90＝下・-90＝上）。a0>a1 なら反時計回り（画面で左回り） */
  function A(cx,cy,rx,ry,a0,a1,n){var o=[],k,N=n||Math.max(8,Math.round(Math.abs(a1-a0)/8));for(k=0;k<=N;k++){var t=(a0+(a1-a0)*k/N)*Math.PI/180;o.push([cx+rx*Math.cos(t),cy+ry*Math.sin(t)]);}return o;}
  function J(){var o=[];for(var i=0;i<arguments.length;i++){var p=arguments[i];if(o.length&&p.length&&Math.abs(o[o.length-1][0]-p[0][0])<1e-6&&Math.abs(o[o.length-1][1]-p[0][1])<1e-6)p=p.slice(1);o=o.concat(p);}return o;}
  var G={
  /* 2026-11-26 19:20 川上さん「アルファベットに決まった書き順は無い。本をベースに、書きやすい一筆にする」：V・W・v・w・L・Z・a・d・q・g・b・p・h・n・m・r・u は一筆（縦の線は戻って山・丸に続ける） */
  
  /* ===== 大文字（1本目〜3本目） ===== */
  A:{w:1,s:[L(.5,0,0,2),L(.5,0,1,2),L(.2,1.35,.8,1.35)]},
  B:{w:.82,s:[L(0,0,0,2),J(L(0,0,.42,0),A(.42,.5,.36,.5,-90,90),L(.42,1,0,1)),J(L(0,1,.46,1),A(.46,1.5,.36,.5,-90,90),L(.46,2,0,2))]},
  C:{w:.95,s:[A(.5,1,.48,1,-40,-320)]},
  D:{w:.9,s:[L(0,0,0,2),J(L(0,0,.32,0),A(.32,1,.56,1,-90,90),L(.32,2,0,2))]},
  E:{w:.78,s:[L(0,0,0,2),L(0,2,.78,2),L(0,0,.78,0),L(0,1,.68,1)]},
  F:{w:.75,s:[L(0,0,0,2),L(0,0,.75,0),L(0,1,.65,1)]},
  G:{w:1,s:[A(.5,1,.48,1,-40,-345),L(.55,1,.98,1),L(.98,1,.98,1.95)]},
  H:{w:.9,s:[L(0,0,0,2),L(.9,0,.9,2),L(0,1,.9,1)]},
  I:{w:.5,s:[L(.25,0,.25,2),L(0,0,.5,0),L(0,2,.5,2)]},
  J:{w:.7,s:[J(L(.65,0,.65,1.55),A(.35,1.55,.3,.45,0,170))]},
  K:{w:.85,s:[L(0,0,0,2),L(.85,0,0,1.15),L(.28,.85,.85,2)]},
  L:{w:.7,s:[L(0,0,0,2,.7,2)]},
  M:{w:1.05,s:[L(0,0,0,2),L(1.05,0,1.05,2),L(0,0,.525,2),L(1.05,0,.525,2)]},
  N:{w:.9,s:[L(0,0,0,2),L(.9,0,.9,2),L(0,0,.9,2)]},
  O:{w:1.05,s:[A(.525,1,.52,1,-90,-450)]},
  P:{w:.8,s:[L(0,0,0,2),J(L(0,0,.42,0),A(.42,.55,.38,.55,-90,90),L(.42,1.1,0,1.1))]},
  Q:{w:1.05,s:[A(.525,1,.52,1,-90,-450),L(.6,1.35,1.02,2)]},
  R:{w:.85,s:[L(0,0,0,2),J(L(0,0,.42,0),A(.42,.55,.38,.55,-90,90),L(.42,1.1,0,1.1)),L(.35,1.1,.85,2)]},
  S:{w:.8,s:[J(A(.4,.5,.38,.48,-25,-270),A(.4,1.5,.38,.5,-90,155))]},
  T:{w:.9,s:[L(.45,0,.45,2),L(0,0,.9,0)]},
  U:{w:.9,s:[J(L(0,0,0,1.45),A(.45,1.45,.45,.55,180,0),L(.9,1.45,.9,0))]},
  V:{w:.95,s:[L(0,0,.475,2,.95,0)]},
  W:{w:1.3,s:[L(0,0,.3,2,.65,0,1,2,1.3,0)]},
  X:{w:.9,s:[L(0,0,.9,2),L(.9,0,0,2)]},
  Y:{w:.9,s:[L(0,0,.45,1),L(.9,0,.45,1),L(.45,1,.45,2)]},
  Z:{w:.85,s:[L(0,0,.85,0,0,2,.85,2)]},
  /* ===== 小文字（2本目〜3本目・上は1本目・下は4本目） ===== */
  a:{w:.72,s:[J(A(.33,1.5,.33,.5,-20,-380),L(.68,1,.68,2))]},
  b:{w:.75,s:[J(L(0,0,0,2,0,1.5),A(.37,1.5,.37,.5,180,540))]},
  c:{w:.68,s:[A(.36,1.5,.34,.5,-40,-320)]},
  d:{w:.75,s:[J(A(.38,1.5,.36,.5,-20,-380),L(.74,0,.74,2))]},
  e:{w:.72,s:[J(L(.02,1.5,.7,1.5),A(.36,1.5,.34,.5,0,-310))]},
  f:{w:.55,s:[J(A(.42,.35,.18,.33,-30,-180),L(.24,.35,.24,2)),L(0,1,.5,1)]},
  g:{w:.72,s:[J(A(.34,1.5,.33,.5,-20,-380),L(.68,1,.68,2.5),A(.36,2.5,.32,.42,0,165))]},
  h:{w:.72,s:[J(L(0,0,0,2,0,1.45),A(.36,1.45,.36,.45,180,360),L(.72,1.45,.72,2))]},
  i:{w:.2,s:[L(.1,1,.1,2),L(.1,.5,.1,.56)]},
  j:{w:.45,s:[J(L(.38,1,.38,2.5),A(.1,2.5,.28,.42,0,165)),L(.38,.5,.38,.56)]},
  k:{w:.7,s:[L(0,0,0,2),L(.65,1,0,1.6),L(.18,1.48,.7,2)]},
  l:{w:.2,s:[L(.1,0,.1,2)]},
  m:{w:1.15,s:[J(L(0,1,0,2,0,1.4),A(.29,1.4,.29,.4,180,360),L(.58,1.4,.58,2,.58,1.4),A(.86,1.4,.28,.4,180,360),L(1.14,1.4,1.14,2))]},
  n:{w:.72,s:[J(L(0,1,0,2,0,1.45),A(.36,1.45,.36,.45,180,360),L(.72,1.45,.72,2))]},
  o:{w:.75,s:[A(.375,1.5,.37,.5,-90,-450)]},
  p:{w:.75,s:[J(L(0,1,0,3,0,1.5),A(.37,1.5,.37,.5,180,540))]},
  q:{w:.75,s:[J(A(.36,1.5,.35,.5,-20,-380),L(.72,1,.72,3))]},
  r:{w:.55,s:[J(L(0,1,0,2,0,1.45),A(.3,1.45,.3,.42,180,300))]},
  s:{w:.62,s:[J(A(.31,1.25,.29,.24,-25,-270),A(.31,1.75,.29,.25,-90,155))]},
  t:{w:.5,s:[J(L(.18,.4,.18,1.8),A(.38,1.8,.2,.2,180,90),L(.38,2,.48,1.95)),L(0,1,.45,1)]},
  u:{w:.72,s:[J(L(0,1,0,1.55),A(.35,1.55,.35,.45,180,0),L(.7,1.55,.7,1,.7,2))]},
  v:{w:.72,s:[L(0,1,.36,2,.72,1)]},
  w:{w:1.05,s:[L(0,1,.25,2,.52,1,.79,2,1.05,1)]},
  x:{w:.68,s:[L(0,1,.68,2),L(.68,1,0,2)]},
  y:{w:.72,s:[L(0,1,.36,2),L(.72,1,.15,3)]},
  z:{w:.68,s:[J(L(0,1,.68,1),L(.68,1,0,2),L(0,2,.68,2))]},
  /* ===== 記号 ===== */
  '.':{w:.2,s:[L(.1,1.95,.1,2)]},
  ',':{w:.2,s:[L(.12,1.92,.04,2.3)]},
  "'":{w:.2,s:[L(.12,0,.08,.35)]},
  '?':{w:.7,s:[J(A(.35,.5,.33,.45,190,450),L(.35,.95,.35,1.4)),L(.35,1.95,.35,2)]},
  '!':{w:.2,s:[L(.1,0,.1,1.45),L(.1,1.95,.1,2)]},
  '-':{w:.4,s:[L(0,1.5,.4,1.5)]},
  ' ':{w:.8,s:[]}
  };
  /* 文字列 → 置いた字の並び。gap＝字のあいだ（単位） */
  function layout(txt,gap){var x=0,o=[];gap=gap==null?.28:gap;String(txt).replace(/[～~]/g,' ').split('').forEach(function(ch){var g=G[ch];if(!g){if(/[　-￿]/.test(ch))return;g=G[' '];}o.push({ch:ch,x:x,g:g});x+=g.w+gap;});return {items:o,w:Math.max(.1,x-gap)};}
  /* 描くための変換：箱 W×H に4本線（Y＝[1本目,2本目,3本目,4本目] の高さの割合）で、左右の余白 pad */
  function fit(txt,W,H,Y,pad){var lay=layout(txt,/\s/.test(String(txt).trim())?.5:.75),u=(Y[2]-Y[0])*H/2;/* 番号の丸が箱の外に切れないように、左右の余白は字の高さの2割以上（11-26 19:0x）*/var sc=Math.min(u,(W-2*Math.max(pad||12,24))/lay.w);
    var ox=(W-lay.w*sc)/2;function yy(v){var i=Math.floor(v),f=v-i;if(i>=3)return Y[3]*H+(v-3)*(Y[3]-Y[2])*H;return (Y[i]+(Y[i+1]-Y[i])*f)*H;}
    /* 縦の目盛りは4本線にそろえ、横は sc で縮める（字が細長くならないように、縦も同じ割合でちぢめる＝ちぢんだら線の真ん中にそろえる） */
    var k=sc/u;function P(x,y){var Y0=yy(y),Yb=yy(2);return [ox+x*sc,Yb+(Y0-Yb)*k];}
    return {lay:lay,P:P,sc:sc};}
  /* 画の点を画面の点に */
  function strokes(txt,W,H,Y,pad){var f=fit(txt,W,H,Y,pad),o=[];f.lay.items.forEach(function(it,ci){it.g.s.forEach(function(st,si){o.push({ci:ci,si:si,ch:it.ch,pts:st.map(function(p){return f.P(it.x+p[0],p[1]);})});});});return {list:o,sc:f.sc};}
  function path(g,pts){g.beginPath();pts.forEach(function(p,i){if(i)g.lineTo(p[0],p[1]);else g.moveTo(p[0],p[1]);});if(pts.length===1)g.lineTo(pts[0][0]+.1,pts[0][1]);}
  /* うすい字（なぞる元）：太い灰色の線 */
  function drawGuide(g,S,col){g.save();g.strokeStyle=col||'#d1d5db';g.lineCap='round';g.lineJoin='round';g.lineWidth=Math.max(6,S.sc*.16);S.list.forEach(function(s){path(g,s.pts);g.stroke();});g.restore();}
  /* 書き始めの番号と矢印（字ごとに 1・2・3…） */
  function drawNums(g,S){g.save();var r=Math.max(6,S.sc*.085);g.font='700 '+Math.round(r*1.25)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';
    var used=[];S.list.forEach(function(s){var p=s.pts[0],q=s.pts[Math.min(s.pts.length-1,3)];if(s.pts.length<2)return;var dx=q[0]-p[0],dy=q[1]-p[1],d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
      /* 矢印（2026-11-26 15:39 川上さん「矢印の向き分かりづらい」）：うすい字の線の上を、書き始めから画の半分ほどまでオレンジの線でなぞり、先に矢じり＝曲がる字も向きが分かる */
      var Lm=Math.min(S.sc*.62,(function(){var L=0;for(var k=1;k<s.pts.length;k++)L+=Math.hypot(s.pts[k][0]-s.pts[k-1][0],s.pts[k][1]-s.pts[k-1][1]);return L;})()*.55),run=[p],acc=0;
      for(var k=1;k<s.pts.length&&acc<Lm;k++){var e=Math.hypot(s.pts[k][0]-s.pts[k-1][0],s.pts[k][1]-s.pts[k-1][1]);if(acc+e>Lm){var f=(Lm-acc)/e;run.push([s.pts[k-1][0]+(s.pts[k][0]-s.pts[k-1][0])*f,s.pts[k-1][1]+(s.pts[k][1]-s.pts[k-1][1])*f]);acc=Lm;break;}run.push(s.pts[k]);acc+=e;}
      if(acc>r*1.5){g.strokeStyle='#f97316';g.lineWidth=Math.max(2,r*.45);g.lineCap='round';g.lineJoin='round';g.beginPath();run.forEach(function(q,i){if(i)g.lineTo(q[0],q[1]);else g.moveTo(q[0],q[1]);});g.stroke();
        var e1=run[run.length-1],e0=run[Math.max(0,run.length-3)],ex=e1[0]-e0[0],ey=e1[1]-e0[1],ed=Math.hypot(ex,ey)||1;ex/=ed;ey/=ed;var h=r*1.15;
        g.fillStyle='#f97316';g.beginPath();g.moveTo(e1[0]+ex*h*.6,e1[1]+ey*h*.6);g.lineTo(e1[0]-ex*h*.6-ey*h*.7,e1[1]-ey*h*.6+ex*h*.7);g.lineTo(e1[0]-ex*h*.6+ey*h*.7,e1[1]-ey*h*.6-ex*h*.7);g.closePath();g.fill();}
      /* 番号：書き始めの点の、進む向きと反対側 */
      var c=[p[0]-dx*r*1.2-dy*r*.2,p[1]-dy*r*1.2+dx*r*.2],t=0;   /* 同じ所から始まる画の番号は重ならないようにずらす */
      used.push({c:c,n:s.si+1,ci:s.ci});});/* 2026-11-26 19:0x 川上さん「Wの書き順直して」：同じ所から始まる画の番号（W・w の 2 と 3 など）は、重なった組ごとに、書く順に左から右へ横に並べる。前は後の番号を左へずらしていて、w の 4 が 1 より左に出ていた */var grp=[];used.forEach(function(u){var G=null;grp.some(function(q){if(q[0].ci===u.ci&&q.some(function(v){return Math.hypot(v.c[0]-u.c[0],v.c[1]-u.c[1])<r*2.05;})){G=q;return true;}return false;});if(G)G.push(u);else grp.push([u]);});grp.forEach(function(q){var cx=q.reduce(function(a,v){return a+v.c[0];},0)/q.length,cy=Math.min.apply(null,q.map(function(v){return v.c[1];}));q.forEach(function(v,k){var x=q.length>1?cx+(k-(q.length-1)/2)*r*2.15:v.c[0],y=q.length>1?cy:v.c[1];g.fillStyle='#f97316';g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();g.fillStyle='#fff';g.fillText(String(v.n),x,y+.5);});});
    g.restore();}
  /* 書き順を動かして見せる：1画ずつ線をのばす。done で終わり。返り＝止める関数 */
  function animate(g,S,redraw,done,msPer){var i=0,t0=0,stop=false,ms=msPer||520,win=g.canvas.ownerDocument.defaultView;
    function len(p){var L=0;for(var k=1;k<p.length;k++)L+=Math.hypot(p[k][0]-p[k-1][0],p[k][1]-p[k-1][1]);return L;}
    function part(p,f){var T=len(p)*f,o=[p[0]],L=0;for(var k=1;k<p.length;k++){var d=Math.hypot(p[k][0]-p[k-1][0],p[k][1]-p[k-1][1]);if(L+d>=T){var r=d?(T-L)/d:0;o.push([p[k-1][0]+(p[k][0]-p[k-1][0])*r,p[k-1][1]+(p[k][1]-p[k-1][1])*r]);break;}o.push(p[k]);L+=d;}return o;}
    /* 2026-11-26 19:30 川上さん「鉛筆マークもアニメーションで動かすのどう？」：書いている所に鉛筆の先を出す＝一筆の字で線を戻る所も、鉛筆が上へ戻るので分かる */function pencil(pt){var u=Math.max(14,S.sc*.5);g.save();g.translate(pt[0],pt[1]);g.rotate(-Math.PI/4);g.fillStyle='#f5d0a9';g.beginPath();g.moveTo(0,0);g.lineTo(u*.55,-u*.16);g.lineTo(u*.55,u*.16);g.closePath();g.fill();g.fillStyle='#374151';g.beginPath();g.moveTo(0,0);g.lineTo(u*.18,-u*.055);g.lineTo(u*.18,u*.055);g.closePath();g.fill();g.fillStyle='#facc15';g.fillRect(u*.55,-u*.16,u*1.25,u*.32);g.fillStyle='#9ca3af';g.fillRect(u*1.8,-u*.16,u*.14,u*.32);g.fillStyle='#f9a8d4';g.fillRect(u*1.94,-u*.16,u*.26,u*.32);g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;g.strokeRect(u*.55,-u*.16,u*1.65,u*.32);g.restore();}
    function frame(ts){if(stop)return;if(!t0)t0=ts;/* 2026-11-26 19:23 川上さん「一筆書きは丸1だけだと分からないかも」：1画の時間を線の長さに合わせる（縦線1本＝ms。一筆の m・h などは長いぶんゆっくり動き、戻る所が見える） */var msI=Math.max(ms*.7,ms*len(S.list[i].pts)/(2*S.sc));var f=Math.min(1,(ts-t0)/msI);redraw();g.save();g.strokeStyle='#2563eb';g.lineCap='round';g.lineJoin='round';g.lineWidth=Math.max(5,S.sc*.13);
      for(var k=0;k<i;k++){path(g,S.list[k].pts);g.stroke();}if(i<S.list.length){var pp=part(S.list[i].pts,f);path(g,pp);g.stroke();g.restore();pencil(pp[pp.length-1]);}else g.restore();
      if(f>=1){i++;t0=0;if(i>=S.list.length){if(done)done();return;}}win.requestAnimationFrame(frame);}
    if(S.list.length)win.requestAnimationFrame(frame);else if(done)done();
    return function(){stop=true;};}
  return {G:G,layout:layout,strokes:strokes,drawGuide:drawGuide,drawNums:drawNums,animate:animate};
})();

function addCss(doc){if(cssDone)return;var s=doc.createElement('style');s.textContent=CSS;doc.head.appendChild(s);cssDone=true;}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function shuffle(a,seed){a=a.slice();var x=seed||(Date.now()%2147483647)||7;for(var i=a.length-1;i>0;i--){x=(x*16807)%2147483647;var j=x%(i+1);var t=a[i];a[i]=a[j];a[j]=t;}return a;}
var AU=null;function play(it,base){try{if(AU){AU.pause();AU=null;}var L=it.au||[];if(!L.length)return;var p=L[Math.floor(Math.random()*L.length)];AU=new Audio((base||'')+p);AU.play().catch(function(){});}catch(e){}}
function isPh(it){return /\s/.test(it.en.trim())||/[.?!]$/.test(it.en.trim());}
/* 英語を書くときの部品：1語の語は1文字ずつ、フレーズは語ずつ（D15。フレーズを1文字ずつは長すぎる） */
function pieces(it){var en=it.en.replace(/～/g,'').trim();
  if(isPh(it)){var w=en.match(/[A-Za-z']+|[.?!,]/g)||[];return {kind:'w',ans:w.filter(function(x){return /[A-Za-z]/.test(x);}),fix:w};}
  var s=en.split('');return {kind:'c',ans:s.filter(function(c){return /[A-Za-z]/.test(c);}),fix:s};}
function mount(host,o){
  var doc=host.ownerDocument;addCss(doc);
  var D=o.data,R=D.rounds[o.no-1],PREV=o.no>1?D.rounds[o.no-2]:null,base=o.audioBase||'';
  var mode=o.mode||'round';
  var st={stage:mode==='redo'?5:0,i:0,first:{},queue:[],test:[],ti:0,res:[],t0:Date.now()};
  var root=doc.createElement('div');root.className='tg';host.innerHTML='';host.appendChild(root);
  var STG=['見る','なぞる','見ないで書く','意味','英語を書く','小テスト'];
  /* 2026-11-26 おかしい所を知らせる（student.html の window.kwtReport を呼ぶ。無い所＝試す画面では出さない） */
  function curItem(){try{if(st.stage===5){var q=st.test[st.ti];return q&&q.it;}if(st.stage===2){return R.items[st.bq&&st.bq[0]];}if(st.stage===3||st.stage===4){return R.items[st.queue[0]];}return R.items[st.i];}catch(e){return null;}}
  function rpRow(){var w=doc.defaultView;return (w&&w.kwtReport)?'<div class="tg-rp"><button type="button" data-rp="1">⚠ おかしい所を知らせる</button></div>':'';}
  root.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-rp]');if(!b)return;var w=doc.defaultView,it=curItem();if(!w||!w.kwtReport)return;
    w.kwtReport({screen:'単語タブ（中学英語スタートダッシュ）',where:'中学英語スタートダッシュ　単語　'+o.no+'回目　'+(STG[st.stage]||'')+(mode==='redo'?'（小テストのやり直し）':''),q:it?(it.en+'／'+it.ja):'',ids:{round:o.no,stage:st.stage,en:it&&it.en}});});
  function bar(){return bar0()+rpRow();}
  function bar0(){return '<div class="tg-st">'+STG.map(function(t,k){if(mode==='redo'&&k<5)return '';return '<span class="'+(k<st.stage?'d':k===st.stage?'c':'')+'">'+(mode==='redo'?'小テストのやり直し':(k+1)+' '+t)+'</span>';}).join('')+'</div>';}
  /* 2026-11-26 修正メモ箱「途中でやめたら続きから再開できない」：画面が変わるたびに今の場所を端末に残し、開き直したら「続きから／はじめから」を選べる（o.skey があるときだけ・14日まで・結果まで行ったら消す） */
  function sv(){if(!o.skey)return;try{st.el=Date.now()-st.t0;localStorage.setItem(o.skey,JSON.stringify({v:2,at:Date.now(),mode:mode,no:o.no,n:R.items.length,st:st}));}catch(e){}}
  function svClear(){if(!o.skey)return;try{localStorage.removeItem(o.skey);}catch(e){}}
  function svLoad(){if(!o.skey)return null;try{var x=JSON.parse(localStorage.getItem(o.skey)||'null');if(!x||x.v!==2||x.mode!==mode||x.no!==o.no||x.n!==R.items.length||Date.now()-x.at>14*864e5)return null;var t=x.st;if(!t||typeof t.stage!=='number')return null;if(t.stage===0&&t.i===0)return null;return t;}catch(e){return null;}}
  function head(){return '<div class="tg-cnt">'+o.no+'回目　'+esc(R.tip)+'</div>';}
  /* 1 見る */
  function see(){sv();var it=R.items[st.i];
    root.innerHTML=bar()+'<div class="tg-card">'+head()+'<div class="tg-cnt" style="margin-top:6px">'+(st.i+1)+' / '+R.items.length+'</div><div class="tg-big'+(isPh(it)?' tg-phr':'')+'">'+esc(it.en)+'</div><div class="tg-yomi">'+esc(it.yomi)+'</div><div class="tg-ja">'+esc(it.ja)+'</div>'
      +'<button type="button" class="tg-spk">🔊 聞く</button>'+(it.hint?'<div class="tg-hint">'+esc(it.hint)+'</div>':'')+'</div>'
      +'<div class="tg-row">'+(st.i>0?'<button type="button" class="tg-btn sub" data-a="prev">← 前の語</button>':'')+'<button type="button" class="tg-btn" data-a="next">'+(st.i<R.items.length-1?'つぎの語へ':'なぞる')+'</button></div>';
    root.querySelector('.tg-spk').onclick=function(){play(it,base);};play(it,base);
    root.querySelector('[data-a=next]').onclick=function(){if(st.i<R.items.length-1){st.i++;see();}else{st.stage=1;st.i=0;trace();}};
    var p=root.querySelector('[data-a=prev]');if(p)p.onclick=function(){st.i--;see();};}
  /* 2 なぞる：うすい字を指でなぞる。字が合っているかは見ない（D15） */
  /* 4本線の書く所（なぞる・見ないで書く で同じ部品）。mode＝'trace'（うすい字と番号）／'blank'（白紙・答えを見るで重ねる） */
  /* 4本線の書く所（なぞる・見ないで書く で同じ部品）。mode＝'trace'（うすい字と番号）／'blank'（白紙・答えを見るで重ねる）。o.onInk＝書いたとき・o.onDemoEnd＝書き順の動きが終わった／止まったとき */
  function pad(cv,txt,mode,o){o=o||{};var bx=cv.parentNode.getBoundingClientRect(),dpr=(doc.defaultView.devicePixelRatio||1);cv.width=Math.max(10,bx.width*dpr);cv.height=Math.max(10,bx.height*dpr);
    var g=cv.getContext('2d');g.scale(dpr,dpr);var W=bx.width,H=bx.height,Y=[0.22,0.45,0.68,0.85],S=ABC.strokes(txt,W,H,Y,14),ink=[],cur=null,show=mode==='trace',stopA=null;
    /* なぞった割合：うすい字の線を小さく区切った点のうち、書いた線の近く（線の太さの7割）にある点の割合。書き順は見ない */
    var smp=[];S.list.forEach(function(s){for(var k=1;k<s.pts.length;k++){var a=s.pts[k-1],b=s.pts[k],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/4));for(var t=0;t<n;t++)smp.push([a[0]+(b[0]-a[0])*t/n,a[1]+(b[1]-a[1])*t/n]);}if(s.pts.length===1)smp.push(s.pts[0]);});
    var hit=smp.map(function(){return 0;}),tol=Math.max(9,S.sc*.17);
    function mark(q){for(var k=0;k<smp.length;k++)if(!hit[k]&&Math.abs(smp[k][0]-q[0])<tol&&Math.abs(smp[k][1]-q[1])<tol&&Math.hypot(smp[k][0]-q[0],smp[k][1]-q[1])<tol)hit[k]=1;}
    function recount(){hit=smp.map(function(){return 0;});ink.forEach(function(L){L.forEach(mark);});}
    var gLen=smp.length*4;function inkLen(){var L=0;ink.forEach(function(A){for(var k=1;k<A.length;k++)L+=Math.hypot(A[k][0]-A[k-1][0],A[k][1]-A[k-1][1]);});return L;}
    function cover(){if(!smp.length)return 1;var c=0;for(var k=0;k<hit.length;k++)c+=hit[k];var v=c/smp.length;if(mode==='trace'&&inkLen()>gLen*2.2)return -1;return v;}   /* 塗りつぶし（うすい字の線の2.2倍より長く書いた）は -1＝なぞったことにしない */
    function lines(){g.clearRect(0,0,W,H);g.strokeStyle='#e5e7eb';Y.forEach(function(y,k){g.beginPath();g.setLineDash(k===1?[4,4]:[]);g.lineWidth=k===2?2:1;g.moveTo(8,H*y);g.lineTo(W-8,H*y);g.stroke();});g.setLineDash([]);}
    function base(){lines();if(show){ABC.drawGuide(g,S,mode==='trace'?'#d1d5db':'#bfdbfe');ABC.drawNums(g,S);}}
    function inkDraw(){g.save();g.strokeStyle='#111827';g.lineWidth=5;g.lineCap='round';g.lineJoin='round';ink.forEach(function(L){g.beginPath();L.forEach(function(q,i){if(i)g.lineTo(q[0],q[1]);else g.moveTo(q[0],q[1]);});if(L.length===1)g.lineTo(L[0][0]+.1,L[0][1]);g.stroke();});g.restore();}
    function full(){base();inkDraw();}
    function changed(){if(o.onInk)o.onInk(cover(),ink.length);}
    function endDemo(){if(stopA){stopA();stopA=null;full();if(o.onDemoEnd)o.onDemoEnd();}}
    function pt(e){var r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}
    cv.addEventListener('pointerdown',function(e){if(stopA&&o.lock&&o.lock())return;endDemo();cur=[pt(e)];ink.push(cur);mark(cur[0]);try{cv.setPointerCapture(e.pointerId);}catch(x){}full();});
    cv.addEventListener('pointermove',function(e){if(!cur)return;var q=pt(e);cur.push(q);mark(q);full();});
    ['pointerup','pointercancel','pointerleave'].forEach(function(t){cv.addEventListener(t,function(){if(cur){cur=null;changed();}});});
    full();
    return {clear:function(){ink=[];recount();full();changed();},undo:function(){ink.pop();recount();full();changed();},show:function(v){show=v;full();},cover:cover,
      demo:function(){if(stopA)stopA();stopA=ABC.animate(g,S,function(){lines();ABC.drawGuide(g,S,'#e5e7eb');},function(){stopA=null;full();if(o.onDemoEnd)o.onDemoEnd();},380);},
      skip:endDemo,stop:function(){if(stopA){stopA();stopA=null;}}};}
  /* 2 なぞる（D15・D23・2026-11-26 15:45 川上さん）：開いたら書き順が動く（その間は［スキップ］だけ）→ 書く段＝［書き順を見る］［1つ戻す］［全部消す］［できた］。
     ［できた］は、うすい字の線の7割以上をなぞったら押せる（書き順は機械で見ない） */
  var TR_OK=0.7;
  function trace(){sv();var it=R.items[st.i];
    root.innerHTML=bar()+'<div class="tg-card"><div class="tg-q">うすい字を指でなぞろう　'+esc(it.ja)+'</div><div class="tg-tr"><canvas></canvas></div>'

      +'<div class="tg-row3" data-r="draw" hidden><button type="button" class="tg-btn sub" data-a="demo">書き順を見る</button><button type="button" class="tg-btn sub" data-a="undo">1つ戻す</button><button type="button" class="tg-btn sub" data-a="clr">全部消す</button></div>'
      +'<button type="button" class="tg-btn" data-a="ok" hidden disabled style="margin-top:8px;width:100%">できた</button>'
      +'<div class="tg-cnt" data-m="1" style="margin-top:8px">'+(st.i+1)+' / '+R.items.length+'　書き順を見よう（オレンジの数字は書く順番）</div></div>';
    var q=function(x){return root.querySelector(x);},okB=q('[data-a=ok]');
    function mode(m){q('[data-r=draw]').hidden=m==='demo';okB.hidden=m==='demo';
      q('[data-m="1"]').textContent=(st.i+1)+' / '+R.items.length+'　'+(m==='demo'?(first?'まず書き順を見よう（オレンジの数字は書く順番）':'書き順を見よう（さわると止まる）'):'うすい字の上を、書き順どおりになぞろう');}
    function upd(c){okB.disabled=c<TR_OK;okB.textContent=c<0?'うすい字の上だけをなぞろう（1つ戻す・全部消す）':c<TR_OK?'できた（もう少しなぞろう）':'できた';}
    var first=true;   /* 2026-11-26 15:54 川上さん「スキップいらんか」＝最初の1回は最後まで見せる（さわっても止まらない）。［書き順を見る］で見直すときはさわると止まる */
    var P=pad(q('canvas'),it.en,'trace',{lock:function(){return first;},onDemoEnd:function(){first=false;mode('draw');},onInk:function(c){upd(c);}});mode('demo');P.demo();
        q('[data-a=demo]').onclick=function(){mode('demo');P.demo();};
    q('[data-a=undo]').onclick=function(){P.undo();};
    q('[data-a=clr]').onclick=function(){P.clear();};
    okB.onclick=function(){if(okB.disabled)return;P.stop();if(st.i<R.items.length-1){st.i++;trace();}else{st.stage=2;st.bq=null;blind();}};}
  /* 3 見ないで書く（D24）：日本語と音だけで、4本線に指で書く → ［答えを見る］で書き順の線を重ねる → 自分で「できた／まちがえた」。まちがえた語は最後にもう一度。記録は1周目の「できた」の数 */
  function blind(){if(!st.bq){st.bq=R.items.map(function(x,k){return k;});st.bf={};}sv();
    if(!st.bq.length){st.stage=3;startQ('m');return;}
    var k=st.bq[0],it=R.items[k];
    root.innerHTML=bar()+'<div class="tg-card"><div class="tg-q">英語を見ないで書いてみよう</div><div class="tg-bj">'+esc(it.ja)+'</div><button type="button" class="tg-spk" data-a="au">🔊 聞く</button>'
      +'<div class="tg-tr" style="margin-top:10px"><canvas></canvas></div><div class="tg-ans"></div>'
      +'<div class="tg-row3" data-r="1"><button type="button" class="tg-btn sub" data-a="undo">1つ戻す</button><button type="button" class="tg-btn sub" data-a="clr">全部消す</button><button type="button" class="tg-btn" data-a="see">答えを見る</button></div>'
      +'<div class="tg-row3" data-r="2" hidden><button type="button" class="tg-btn sub" data-a="ng">まちがえた</button><button type="button" class="tg-btn" data-a="ok">できた</button></div>'
      +'<div class="tg-cnt" style="margin-top:8px">のこり '+st.bq.length+' 語</div></div>';
    play(it,base);var P=pad(root.querySelector('canvas'),it.en,'blank');
    root.querySelector('[data-a=au]').onclick=function(){play(it,base);};
    root.querySelector('[data-a=clr]').onclick=function(){P.clear();};root.querySelector('[data-a=undo]').onclick=function(){P.undo();};
    root.querySelector('[data-a=see]').onclick=function(){P.show(true);root.querySelector('.tg-ans').textContent=it.en;root.querySelector('[data-r="1"]').hidden=true;root.querySelector('[data-r="2"]').hidden=false;play(it,base);};
    function judge(ok){if(!(k in st.bf))st.bf[k]=ok?1:0;st.bq.shift();if(!ok)st.bq.push(k);blind();}
    root.querySelector('[data-a=ok]').onclick=function(){judge(true);};
    root.querySelector('[data-a=ng]').onclick=function(){judge(false);};}
  /* 3・4 練習：まちがえたら最後にもう一度（全部正解になるまで）。記録は1周目 */
  function startQ(kind){st.qk=kind;st.queue=shuffle(R.items.map(function(x,k){return k;}));st.done=0;st.total=R.items.length;next();}
  function next(){sv();if(!st.queue.length){if(st.qk==='m'){st.stage=4;startQ('s');}else{st.stage=5;startTest();}return;}
    var k=st.queue[0];if(st.qk==='m')mean(k);else spell(k,false);}
  function fin(k,ok,el){var key=st.qk+k,firstTime=!(key in st.first);if(firstTime)st.first[key]=ok?1:0;
    st.queue.shift();if(!ok)st.queue.push(k);
    var b=doc.createElement('button');b.type='button';b.className='tg-btn';b.textContent='つぎへ';b.style.marginTop='12px';b.onclick=next;var sp=doc.createElement('button');sp.type='button';sp.className='tg-spk';sp.textContent='🔊 もう一回聞く';sp.style.display='flex';sp.style.margin='12px auto 0';sp.onclick=function(){play(R.items[k],base);};el.appendChild(sp);el.appendChild(b);}
  function mean(k){var it=R.items[k],pool=R.items.map(function(x){return x.ja;});var ch=[it.ja];shuffle(pool,k+7).forEach(function(j){if(ch.length<4&&ch.indexOf(j)<0)ch.push(j);});
    (D.rounds||[]).forEach(function(r){r.items.forEach(function(x){if(ch.length<4&&ch.indexOf(x.ja)<0&&r.no!==R.no&&r.kind===R.kind)ch.push(x.ja);});});ch=shuffle(ch);
    root.innerHTML=bar()+'<div class="tg-card"><div class="tg-q">'+esc(it.en)+' の意味は？</div><button type="button" class="tg-spk" style="margin:0 0 10px">🔊 聞く</button><div class="tg-chc">'+ch.map(function(c){return '<button type="button">'+esc(c)+'</button>';}).join('')+'</div><div class="tg-fb"></div></div>';
    root.querySelector('.tg-spk').onclick=function(){play(it,base);};
    root.querySelectorAll('.tg-chc button').forEach(function(b){b.onclick=function(){var ok=b.textContent===it.ja;root.querySelectorAll('.tg-chc button').forEach(function(x){x.disabled=true;if(x.textContent===it.ja)x.classList.add('ok');});if(!ok)b.classList.add('ng');
      var fb=root.querySelector('.tg-fb');fb.className='tg-fb '+(ok?'ok':'ng');fb.textContent=ok?'正解！':'正しくは「'+it.ja+'」。あとでもう一度出ます';play(it,base);fin(k,ok,root.querySelector('.tg-card'));};});}
  /* 英語を書く（意味を見て1文字ずつ・フレーズは語ずつ）。test＝小テスト（1回きり） */
  function spell(k,test,item,cb){var it=item||R.items[k],P=pieces(it),pos=0,miss=false,used={};
    var extra=P.kind==='c'?shuffle('aeiouyrstnlmdbcgkph'.split('').filter(function(c){return P.ans.map(function(x){return x.toLowerCase();}).indexOf(c)<0;}),k+3).slice(0,3):[];
    if(P.kind==='w'){(D.rounds||[]).some(function(r){return r.items.some(function(x){if(extra.length>=2)return true;if(x.en===it.en||!isPh(x))return false;var w=(x.en.match(/[A-Za-z']+/g)||[]).filter(function(y){return P.ans.indexOf(y)<0;});if(w[0]&&extra.indexOf(w[0])<0)extra.push(w[0]);return false;});});}
    var tiles=shuffle(P.ans.concat(extra),k+11);
    function slotsHtml(){var n=0;return P.fix.map(function(c){var isAns=P.kind==='c'?/[A-Za-z]/.test(c):/[A-Za-z]/.test(c);if(!isAns)return '<span class="fix">'+esc(c===' '?' ':c)+'</span>';var i=n++;return '<span class="'+(i<pos?'f':'')+'">'+(i<pos?esc(P.ans[i]):'')+'</span>';}).join('');}
    root.innerHTML=bar()+'<div class="tg-card">'+(test?'<div class="tg-cnt">小テスト　'+(st.ti+1)+' / '+st.test.length+(st.nPrev?(st.ti<st.nPrev?'（前回）':'（今回）'):'')+'</div>':'')+'<div class="tg-q">「'+esc(it.ja)+'」を英語で書こう'+(P.kind==='c'?'（1文字ずつ選ぶ）':'（語を順に選ぶ）')+'</div><div class="tg-slots">'+slotsHtml()+'</div><div class="tg-tiles">'+tiles.map(function(t,i){return '<button type="button" data-i="'+i+'">'+esc(t)+'</button>';}).join('')+'</div><div class="tg-fb"></div></div>';
    var card=root.querySelector('.tg-card');
    root.querySelectorAll('.tg-tiles button').forEach(function(b){b.onclick=function(){if(pos>=P.ans.length)return;var t=tiles[+b.dataset.i],want=P.ans[pos];
      if(t===want||(P.kind==='c'&&pos===0&&t.toLowerCase()===want.toLowerCase())){b.disabled=true;pos++;root.querySelector('.tg-slots').innerHTML=slotsHtml();
        if(pos>=P.ans.length){var fb=root.querySelector('.tg-fb');var ok=!miss;fb.className='tg-fb '+(ok?'ok':'ng');fb.textContent=ok?'正解！':'できた。まちがえた所があったので、あとでもう一度出ます';if(test)fb.textContent=ok?'正解！':'正しくは '+it.en;play(it,base);
          root.querySelectorAll('.tg-tiles button').forEach(function(x){x.disabled=true;});if(test){cb(ok);}else fin(k,ok,card);}}
      else{miss=true;b.classList.remove('ng');void b.offsetWidth;b.classList.add('ng');
        if(test){var you=P.ans.slice(0,pos).concat([t]).join(P.kind==='c'?'':' ');var fb2=root.querySelector('.tg-fb');fb2.className='tg-fb ng';fb2.textContent='×　正しくは '+it.en;pos=P.ans.length;root.querySelector('.tg-slots').innerHTML=P.fix.map(function(c){return '<span class="'+(/[A-Za-z]/.test(c)?'f':'fix')+'">'+esc(c===' '?' ':c)+'</span>';}).join('');root.querySelectorAll('.tg-tiles button').forEach(function(x){x.disabled=true;});play(it,base);cb(false,you);}}};});}
  /* 5 小テスト：前の回の5語（順を変えて先に）＋その回の5語（D17）。やり直しも同じ10問 */
  function startTest(){var pv=PREV?shuffle(PREV.items.map(function(x){return {it:x,prev:1};}),o.no*31):[],cu=shuffle(R.items.map(function(x){return {it:x,prev:0};}),o.no*17);
    st.test=pv.concat(cu);st.nPrev=pv.length;st.ti=0;st.res=[];tq();}
  function tq(){if(st.ti>=st.test.length){result();return;}sv();var q=st.test[st.ti];
    spell(st.ti,true,q.it,function(ok,you){st.res.push({en:q.it.en,ja:q.it.ja,prev:q.prev,ok:ok?1:0,you:you||'',it:q.it});var sp=doc.createElement('button');sp.type='button';sp.className='tg-spk';sp.textContent='🔊 もう一回聞く';sp.style.display='flex';sp.style.margin='12px auto 0';sp.onclick=function(){play(q.it,base);};root.querySelector('.tg-card').appendChild(sp);var b=doc.createElement('button');b.type='button';b.className='tg-btn';b.style.marginTop='12px';b.textContent=st.ti<st.test.length-1?'つぎへ':'結果を見る';b.onclick=function(){st.ti++;tq();};root.querySelector('.tg-card').appendChild(b);});}
  function result(){svClear();var pv=st.res.filter(function(r){return r.prev;}),cu=st.res.filter(function(r){return !r.prev;});
    var pOk=pv.filter(function(r){return r.ok;}).length,cOk=cu.filter(function(r){return r.ok;}).length,allOk=st.res.every(function(r){return r.ok;});
    var fk=Object.keys(st.first),pr={ok:fk.filter(function(k){return st.first[k];}).length,n:fk.length};
    var _bf=st.bf||{},_bk=Object.keys(_bf);var S={at:new Date().toISOString(),mode:mode,blind:mode==='redo'?null:{ok:_bk.filter(function(x){return _bf[x];}).length,n:_bk.length},prac:mode==='redo'?null:pr,test:{prev:{ok:pOk,n:pv.length,miss:pv.filter(function(r){return !r.ok;}).map(function(r){return r.en;})},cur:{ok:cOk,n:cu.length,miss:cu.filter(function(r){return !r.ok;}).map(function(r){return r.en;})}},allOk:allOk?1:0};
    var miss=st.res.filter(function(r){return !r.ok;});
    S.ms=Date.now()-st.t0;
    if(o.onResult){try{if(o.onDone)o.onDone(S);}catch(e){}o.onResult(S,{round:R,no:o.no,mode:mode,res:st.res.map(function(r){return {en:r.en,ja:r.ja,prev:r.prev,ok:r.ok,you:r.you,au:(r.it&&r.it.au)||[],hint:(r.it&&r.it.hint)||''};}),base:base});return;}
    root.innerHTML='<div class="tg-res">'+(mode==='redo'?'<div class="tg-st"><span class="c">小テストのやり直し</span></div>':bar())+'<div class="tg-card">'+head()+(allOk?'<div class="tg-perf">全問正解！</div>':'')
      +'<div class="tg-two">'+(pv.length?'<div><div class="k">前の回の語</div><b>'+pOk+'</b> / '+pv.length+'</div>':'')+'<div><div class="k">'+(pv.length?'この回の語':'小テスト')+'</div><b>'+cOk+'</b> / '+cu.length+'</div></div>'
      +(mode==='redo'?(allOk?'<div class="tg-tip">この回は「小テストのやり直し」から外れます</div>':'<div class="tg-tip">まちがえた語を見直して、もう一度やってみよう</div>'):'')+'</div>'
      +'<div class="tg-teach">先生に見せよう<small>'+(miss.length?'まちがえた語を一緒に確かめよう':'点を見てもらおう')+'</small></div>'
      +(miss.length?'<div class="tg-ml">'+miss.map(function(r){return '<div><span class="x">×</span><span class="a">'+esc(r.en)+'</span><span>'+esc(r.ja)+'</span><span class="y">'+(r.prev?'前の回':'この回')+'</span></div>';}).join('')+'</div>':'')
      +'<div class="tg-row"><button type="button" class="tg-btn" data-a="close">一覧にもどる</button></div></div>';
    root.querySelector('[data-a=close]').onclick=function(){if(o.onClose)o.onClose();};
    try{if(o.onDone)o.onDone(S);}catch(e){}}
  function go(){if(mode==='redo'){startTest();}else see();}
  var SV=svLoad();
  if(SV){var where=(mode==='redo'?'小テストのやり直し':(SV.stage+1)+' '+STG[SV.stage])+(SV.stage===5?'（'+((SV.ti||0)+1)+'問目）':SV.stage<2?'（'+((SV.i||0)+1)+'語目）':'');
    root.innerHTML='<div class="tg-card" style="text-align:center">'+head()+'<div style="font-size:17px;font-weight:700;margin:14px 0 6px">前回の続きがあります</div><div style="color:#6b7280;margin-bottom:16px">'+esc(where)+'</div>'
      +'<button type="button" class="tg-btn" data-a="cont">続きから始める</button><button type="button" class="tg-btn sub" data-a="new" style="margin-top:10px;background:#fff;color:#111;border:1px solid #d1d5db">はじめからやる</button></div>';
    root.querySelector('[data-a=cont]').onclick=function(){st=SV;st.t0=Date.now()-(SV.el||0);st.first=st.first||{};st.queue=st.queue||[];st.test=st.test||[];st.res=st.res||[];
      if(st.stage===0)see();else if(st.stage===1)trace();else if(st.stage===2)blind();else if(st.stage<5){if(st.qk)next();else startQ(st.stage===3?'m':'s');}else{if(st.test.length)tq();else startTest();}};
    root.querySelector('[data-a=new]').onclick=function(){svClear();go();};}
  else go();
  return {destroy:function(){try{if(AU)AU.pause();}catch(e){}root.remove();}};
}
var api={mount:mount,pieces:pieces};
if(typeof window!=='undefined')window.TangoApp=api;
if(typeof module!=='undefined')module.exports=api;
})();
