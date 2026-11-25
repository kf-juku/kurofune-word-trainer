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
+'.tg-tr{position:relative;width:100%;height:150px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;touch-action:none;overflow:hidden}.tg-tr canvas{position:absolute;inset:0;width:100%;height:100%}'
+'.tg-chc{display:grid;grid-template-columns:1fr 1fr;gap:8px}.tg-chc button{font:inherit;font-size:17px;padding:14px 8px;border:1px solid #d1d5db;border-radius:10px;background:#fff;cursor:pointer}.tg-chc button.ok{border:2px solid #059669;background:#ecfdf5}.tg-chc button.ng{border:2px solid #dc2626;background:#fef2f2}'
+'.tg-slots{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:6px 0 12px;min-height:50px}.tg-slots span{min-width:38px;height:46px;padding:0 6px;border:2px dashed #93c5fd;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700}.tg-slots span.f{border-style:solid;border-color:#2563eb;background:#eff6ff}.tg-slots span.fix{border:0;min-width:10px;padding:0 1px}'
+'.tg-tiles{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.tg-tiles button{font:inherit;min-width:44px;height:48px;padding:0 10px;border:2px solid #d1d5db;border-radius:8px;background:#fff;font-size:21px;font-weight:700;cursor:pointer}.tg-tiles button.ng{border-color:#dc2626;background:#fef2f2;animation:tgsh .3s}.tg-tiles button:disabled{opacity:.25}'
+'@keyframes tgsh{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}'
+'.tg-fb{margin-top:12px;font-size:15px;min-height:24px}.tg-fb.ok{color:#047857;font-weight:700}.tg-fb.ng{color:#b91c1c}'
+'.tg-res .tg-sc{font-size:40px;font-weight:800}.tg-res .tg-sc small{font-size:16px}.tg-two{display:flex;gap:8px;margin:12px 0}.tg-two>div{flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:10px;background:#fff}.tg-two b{font-size:26px}.tg-two .k{font-size:12px;color:#6b7280}'
+'.tg-teach{border:2px solid #111;border-radius:10px;padding:10px;text-align:center;font-weight:800;margin:10px 0;background:#fff}.tg-teach small{display:block;font-weight:400;font-size:12px;color:#555;margin-top:2px}'
+'.tg-ml{text-align:left;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:4px 12px}.tg-ml div{display:flex;gap:8px;padding:8px 0;border-top:1px solid #f1f2f4;font-size:15px}.tg-ml div:first-child{border-top:0}.tg-ml .x{color:#dc2626;font-weight:800}.tg-ml .o{color:#059669;font-weight:800}.tg-ml .a{font-weight:800}.tg-ml .y{color:#6b7280;font-size:13px}'
+'.tg-perf{font-size:22px;font-weight:800;color:#b45309;margin:4px 0}';
var cssDone=false;
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
  var st={stage:mode==='redo'?4:0,i:0,first:{},queue:[],test:[],ti:0,res:[]};
  var root=doc.createElement('div');root.className='tg';host.innerHTML='';host.appendChild(root);
  var STG=['見る','なぞる','意味','英語を書く','小テスト'];
  function bar(){return '<div class="tg-st">'+STG.map(function(t,k){if(mode==='redo'&&k<4)return '';return '<span class="'+(k<st.stage?'d':k===st.stage?'c':'')+'">'+(mode==='redo'?'小テストのやり直し':(k+1)+' '+t)+'</span>';}).join('')+'</div>';}
  function head(){return '<div class="tg-cnt">'+o.no+'回目　'+esc(R.tip)+'</div>';}
  /* 1 見る */
  function see(){var it=R.items[st.i];
    root.innerHTML=bar()+'<div class="tg-card">'+head()+'<div class="tg-cnt" style="margin-top:6px">'+(st.i+1)+' / '+R.items.length+'</div><div class="tg-big'+(isPh(it)?' tg-phr':'')+'">'+esc(it.en)+'</div><div class="tg-yomi">'+esc(it.yomi)+'</div><div class="tg-ja">'+esc(it.ja)+'</div>'
      +'<button type="button" class="tg-spk">🔊 聞く</button>'+(it.hint?'<div class="tg-hint">'+esc(it.hint)+'</div>':'')+'</div>'
      +'<div class="tg-row">'+(st.i>0?'<button type="button" class="tg-btn sub" data-a="prev">← 前の語</button>':'')+'<button type="button" class="tg-btn" data-a="next">'+(st.i<R.items.length-1?'つぎの語へ':'なぞる')+'</button></div>';
    root.querySelector('.tg-spk').onclick=function(){play(it,base);};play(it,base);
    root.querySelector('[data-a=next]').onclick=function(){if(st.i<R.items.length-1){st.i++;see();}else{st.stage=1;st.i=0;trace();}};
    var p=root.querySelector('[data-a=prev]');if(p)p.onclick=function(){st.i--;see();};}
  /* 2 なぞる：うすい字を指でなぞる。字が合っているかは見ない（D15） */
  function trace(){var it=R.items[st.i];
    root.innerHTML=bar()+'<div class="tg-card"><div class="tg-q">うすい字を指でなぞろう　'+esc(it.ja)+'</div><div class="tg-tr"><canvas></canvas></div>'
      +'<div class="tg-row"><button type="button" class="tg-btn sub" data-a="clr">消す</button><button type="button" class="tg-btn" data-a="ok">できた</button></div><div class="tg-cnt" style="margin-top:8px">'+(st.i+1)+' / '+R.items.length+'</div></div>';
    var cv=root.querySelector('canvas'),bx=cv.parentNode.getBoundingClientRect(),dpr=(doc.defaultView.devicePixelRatio||1);cv.width=Math.max(10,bx.width*dpr);cv.height=Math.max(10,bx.height*dpr);
    var g=cv.getContext('2d');g.scale(dpr,dpr);var W=bx.width,H=bx.height,txt=it.en;
    function guide(){g.clearRect(0,0,W,H);g.strokeStyle='#e5e7eb';g.lineWidth=1;[0.22,0.45,0.68,0.85].forEach(function(y,k){g.beginPath();if(k===1){g.setLineDash([4,4]);}else g.setLineDash([]);g.lineWidth=k===2?2:1;g.moveTo(8,H*y);g.lineTo(W-8,H*y);g.stroke();});g.setLineDash([]);
      var fs=Math.min(H*0.62,(W-24)/Math.max(1,txt.length)*1.75);g.font='700 '+fs+'px "Comic Sans MS","Segoe Print","Hiragino Sans",sans-serif';g.fillStyle='#d1d5db';g.textAlign='center';g.textBaseline='alphabetic';g.fillText(txt,W/2,H*0.68);}
    guide();var dn=false,lx=0,ly=0;
    function pt(e){var r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}
    cv.addEventListener('pointerdown',function(e){dn=true;var p=pt(e);lx=p[0];ly=p[1];try{cv.setPointerCapture(e.pointerId);}catch(x){}});
    cv.addEventListener('pointermove',function(e){if(!dn)return;var p=pt(e);g.strokeStyle='#2563eb';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(lx,ly);g.lineTo(p[0],p[1]);g.stroke();lx=p[0];ly=p[1];});
    ['pointerup','pointercancel','pointerleave'].forEach(function(t){cv.addEventListener(t,function(){dn=false;});});
    root.querySelector('[data-a=clr]').onclick=guide;
    root.querySelector('[data-a=ok]').onclick=function(){if(st.i<R.items.length-1){st.i++;trace();}else{st.stage=2;startQ('m');}};}
  /* 3・4 練習：まちがえたら最後にもう一度（全部正解になるまで）。記録は1周目 */
  function startQ(kind){st.qk=kind;st.queue=shuffle(R.items.map(function(x,k){return k;}));st.done=0;st.total=R.items.length;next();}
  function next(){if(!st.queue.length){if(st.qk==='m'){st.stage=3;startQ('s');}else{st.stage=4;startTest();}return;}
    var k=st.queue[0];if(st.qk==='m')mean(k);else spell(k,false);}
  function fin(k,ok,el){var key=st.qk+k,firstTime=!(key in st.first);if(firstTime)st.first[key]=ok?1:0;
    st.queue.shift();if(!ok)st.queue.push(k);
    var b=doc.createElement('button');b.type='button';b.className='tg-btn';b.textContent='つぎへ';b.style.marginTop='12px';b.onclick=next;el.appendChild(b);}
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
    root.innerHTML=bar()+'<div class="tg-card">'+(test?'<div class="tg-cnt">小テスト　'+(st.ti+1)+' / '+st.test.length+(st.ti<st.nPrev?'（前の回）':'')+'</div>':'')+'<div class="tg-q">「'+esc(it.ja)+'」を英語で書こう'+(P.kind==='c'?'（1文字ずつ選ぶ）':'（語を順に選ぶ）')+'</div><div class="tg-slots">'+slotsHtml()+'</div><div class="tg-tiles">'+tiles.map(function(t,i){return '<button type="button" data-i="'+i+'">'+esc(t)+'</button>';}).join('')+'</div><div class="tg-fb"></div></div>';
    var card=root.querySelector('.tg-card');
    root.querySelectorAll('.tg-tiles button').forEach(function(b){b.onclick=function(){if(pos>=P.ans.length)return;var t=tiles[+b.dataset.i],want=P.ans[pos];
      if(t===want||(P.kind==='c'&&pos===0&&t.toLowerCase()===want.toLowerCase())){b.disabled=true;pos++;root.querySelector('.tg-slots').innerHTML=slotsHtml();
        if(pos>=P.ans.length){var fb=root.querySelector('.tg-fb');var ok=!miss;fb.className='tg-fb '+(ok?'ok':'ng');fb.textContent=ok?'正解！':'できた。まちがえた所があったので、あとでもう一度出ます';if(test)fb.textContent=ok?'正解！':'正しくは '+it.en;play(it,base);
          root.querySelectorAll('.tg-tiles button').forEach(function(x){x.disabled=true;});if(test){cb(ok);}else fin(k,ok,card);}}
      else{miss=true;b.classList.remove('ng');void b.offsetWidth;b.classList.add('ng');
        if(test){var fb2=root.querySelector('.tg-fb');fb2.className='tg-fb ng';fb2.textContent='×　正しくは '+it.en;pos=P.ans.length;root.querySelector('.tg-slots').innerHTML=P.fix.map(function(c){return '<span class="'+(/[A-Za-z]/.test(c)?'f':'fix')+'">'+esc(c===' '?' ':c)+'</span>';}).join('');root.querySelectorAll('.tg-tiles button').forEach(function(x){x.disabled=true;});play(it,base);cb(false);}}};});}
  /* 5 小テスト：前の回の5語（順を変えて先に）＋その回の5語（D17）。やり直しも同じ10問 */
  function startTest(){var pv=PREV?shuffle(PREV.items.map(function(x){return {it:x,prev:1};}),o.no*31):[],cu=shuffle(R.items.map(function(x){return {it:x,prev:0};}),o.no*17);
    st.test=pv.concat(cu);st.nPrev=pv.length;st.ti=0;st.res=[];tq();}
  function tq(){if(st.ti>=st.test.length){result();return;}var q=st.test[st.ti];
    spell(st.ti,true,q.it,function(ok){st.res.push({en:q.it.en,ja:q.it.ja,prev:q.prev,ok:ok?1:0});var b=doc.createElement('button');b.type='button';b.className='tg-btn';b.style.marginTop='12px';b.textContent=st.ti<st.test.length-1?'つぎへ':'結果を見る';b.onclick=function(){st.ti++;tq();};root.querySelector('.tg-card').appendChild(b);});}
  function result(){var pv=st.res.filter(function(r){return r.prev;}),cu=st.res.filter(function(r){return !r.prev;});
    var pOk=pv.filter(function(r){return r.ok;}).length,cOk=cu.filter(function(r){return r.ok;}).length,allOk=st.res.every(function(r){return r.ok;});
    var fk=Object.keys(st.first),pr={ok:fk.filter(function(k){return st.first[k];}).length,n:fk.length};
    var S={at:new Date().toISOString(),mode:mode,prac:mode==='redo'?null:pr,test:{prev:{ok:pOk,n:pv.length,miss:pv.filter(function(r){return !r.ok;}).map(function(r){return r.en;})},cur:{ok:cOk,n:cu.length,miss:cu.filter(function(r){return !r.ok;}).map(function(r){return r.en;})}},allOk:allOk?1:0};
    var miss=st.res.filter(function(r){return !r.ok;});
    root.innerHTML='<div class="tg-res">'+(mode==='redo'?'<div class="tg-st"><span class="c">小テストのやり直し</span></div>':bar())+'<div class="tg-card">'+head()+(allOk?'<div class="tg-perf">全問正解！</div>':'')
      +'<div class="tg-two">'+(pv.length?'<div><div class="k">前の回の語</div><b>'+pOk+'</b> / '+pv.length+'</div>':'')+'<div><div class="k">'+(pv.length?'この回の語':'小テスト')+'</div><b>'+cOk+'</b> / '+cu.length+'</div></div>'
      +(mode==='redo'?(allOk?'<div class="tg-tip">この回は「小テストのやり直し」から外れます</div>':'<div class="tg-tip">まちがえた語を見直して、もう一度やってみよう</div>'):'')+'</div>'
      +'<div class="tg-teach">先生に見せよう<small>'+(miss.length?'まちがえた語を一緒に確かめよう':'点を見てもらおう')+'</small></div>'
      +(miss.length?'<div class="tg-ml">'+miss.map(function(r){return '<div><span class="x">×</span><span class="a">'+esc(r.en)+'</span><span>'+esc(r.ja)+'</span><span class="y">'+(r.prev?'前の回':'この回')+'</span></div>';}).join('')+'</div>':'')
      +'<div class="tg-row"><button type="button" class="tg-btn" data-a="close">一覧にもどる</button></div></div>';
    root.querySelector('[data-a=close]').onclick=function(){if(o.onClose)o.onClose();};
    try{if(o.onDone)o.onDone(S);}catch(e){}}
  if(mode==='redo'){startTest();}else see();
  return {destroy:function(){try{if(AU)AU.pause();}catch(e){}root.remove();}};
}
var api={mount:mount,pieces:pieces};
if(typeof window!=='undefined')window.TangoApp=api;
if(typeof module!=='undefined')module.exports=api;
})();
