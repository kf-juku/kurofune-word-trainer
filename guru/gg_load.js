/* gg_load.js：ぐるぐる（数学）のシートの行（materials・parts・words）から、外側の画面（gg_shell.js）と ggMount（gg_app.js）が受け取るデータを組み立てる。
   ws_load.js の wsBuildUnit に当たる。2026-11-02 本番係。行は tools\gg_export.js が作る形（description の JSON は {"gg":{k,…}}）。
   使い方：var GG=ggBuildData(rows, {fig:true})
     rows＝{materials:[…], parts:[…], words:[…]}（何単元でも）か、ws_unit の返事と同じ形 {material:{…}, parts:[…], words:[…]}（1単元）
     返り＝{units:[{key,mid,grade,unit,ui,parts:[{id,no,name,ready,cu}]}], parts:[パート], ny:[入試パターン], cts:[章まとめテスト], pid:{パートの行の id → {k,pid,r}}}
       パート＝{id, ready:true, grade, unit, ui, no, name, catch, cover, types, kiso, rounds:{A1:[問題],…,C2}, rui:{a1:[問題],…}, nq:[小問の数×6], ny?, rowIds:{A1:'gg_m1u4p1_A1',…,RU:'…'}}
       章まとめテスト＝{id, grade, ukey, unit, ui, kind, rng, upto, name, ut, after, rounds:{A1:TEST,…}, rowIds:{A1:'gg_ctm1u4k_A1',…}}
     opt.fig＝true（省いたとき）なら、図の印（⟦F:…⟧）を MathFig.data で描いた形にして返す。先に ws\math_fig.js・guru\gg_fig.js を読んでおく
     opt.lazy＝true：words が無くても（parts の行だけで）一覧を作る（2026-11-02 段3・先生のプレビューを速くする）。回の行（RD）が6つそろったパートを「問題あり」にし、
       問題は空のまま（p.rounds={}・章まとめは c.rounds[R].items=null）。あとで ggFillWords(GG, words) で、読んだパートの分だけ入れる
   ggFillWords(GG, words, opt)：words（回・類題・章まとめ・図の行）を GG の中の該当するパート・テストに入れる。返り＝入れた行の id（parts の行）の一覧。opt.fig は ggBuildData と同じ
   図の行（qtype ws_gg_fig）：大きい問題の SVG を別の行にしたもの。MathFig.ns.ggref.S(md5の頭12字) で引けるようにしてから描く */
(function(G){
var RS=['A1','A2','B1','B2','C1','C2'];
function jp(s,d){try{var v=JSON.parse(String(s==null?'':s));return v==null?d:v;}catch(e){return d;}}
function ggDesc_(pt){var d=jp(pt.description,null);return d&&d.gg?d.gg:null;}
function ggQ_(w){var q=jp(w.qdata,null);if(q&&typeof q==='object'&&w.id!=null)Object.defineProperty(q,'wid',{value:String(w.id),enumerable:false});return q;}
var NQ=function(items){return items.reduce(function(s,it){return s+(it&&it.ren?it.steps.length:1);},0);};
function ggBuildData(rows,opt){
  opt=opt||{};
  var mats=rows.materials||(rows.material?[rows.material]:[]),parts=rows.parts||[],words=rows.words||[];
  var byPart={};words.forEach(function(w){(byPart[String(w.part_id)]=byPart[String(w.part_id)]||[]).push(w);});
  Object.keys(byPart).forEach(function(k){byPart[k].sort(function(a,b){return (+a.display_order||0)-(+b.display_order||0);});});
  var qs=function(pid,t){return (byPart[String(pid)]||[]).filter(function(w){return w.qtype===t;}).map(ggQ_);};
  var LZ=!!opt.lazy;
  regFig_(words);
  var out={units:[],parts:[],ny:[],cts:[],pid:{}};var P={},CT={};
  var ms=mats.slice().sort(function(a,b){return (+a.display_order||0)-(+b.display_order||0);});
  ms.forEach(function(m){
    var ps=parts.filter(function(p){return String(p.material_id)===String(m.id);}).sort(function(a,b){return (+a.part_order||0)-(+b.part_order||0);});
    var u=null;
    ps.forEach(function(pt){var d=ggDesc_(pt);if(!d)return;out.pid[String(pt.id)]={k:d.k,pid:d.pid||d.ct,r:d.r||''};
      if(d.k==='CV'){
        if(d.kind==='ny'){var q={id:d.pid,no:d.ny.no,grade:d.grade,name:d.name,field:d.ny.field,after:d.ny.after,after_ui:d.ny.after_ui,after_pi:d.ny.after_pi,ready:!!d.ready};out.ny.push(q);}
        else{if(!u){u={key:d.grade+'_'+d.unit,mid:m.id,grade:d.grade,unit:d.unit,ui:d.ui,parts:[]};out.units.push(u);}
          u.parts.push({id:d.pid,no:d.pi,name:d.name,ready:!!d.ready,cu:d.cu||{},pre:d.pid});}
        if(d.ready){var x=P[d.pid]={id:d.pid,ready:true,grade:d.grade,unit:d.unit,ui:d.ui||0,no:d.kind==='ny'?d.ny.no:d.pi,name:d.name,catch:d.catch||'',cover:d.cover||[],types:d.types||{},kiso:d.kiso||{},meta_name:d.meta_name||'',rounds:{},rui:{},rowIds:{CV:String(pt.id)},point:{sections:[]}};
          if(d.kind==='ny')x.ny=true;out.parts.push(x);}
        return;}
      if(d.k==='RD'){var p=P[d.pid];if(!p)return;p.rowIds[d.r]=String(pt.id);(p.nqR=p.nqR||{})[d.r]=+d.nq||0;if(!LZ)p.rounds[d.r]=qs(pt.id,'ws_gg_q');return;}
      if(d.k==='RU'){var p2=P[d.pid];if(!p2)return;p2.rowIds.RU=String(pt.id);if(!LZ)ruiPut_(p2,qs(pt.id,'ws_gg_rui'));return;}
      if(d.k==='CT'){var c=CT[d.ct];if(!c){c=CT[d.ct]={id:d.ct,grade:d.grade,ukey:d.grade+'_'+d.unit,unit:d.unit,ui:d.ui,kind:d.kind,rng:d.rng,upto:d.upto,name:d.name,ut:d.ut,after:d.after,rounds:{},rowIds:{}};out.cts.push(c);}
        var T={};Object.keys(d.test||{}).forEach(function(k){T[k]=d.test[k];});T.nq=+d.nq||0;T.items=LZ?null:qs(pt.id,'ws_gg_ct');c.rounds[d.r]=T;c.rowIds[d.r]=String(pt.id);return;}
    });
  });
  if(LZ)out.parts.forEach(function(p){p.lazy=true;p.nq=RS.map(function(R){return (p.nqR||{})[R]||0;});if(RS.some(function(R){return !p.rowIds[R]||!(p.nqR||{})[R];}))p.ready=false;});   /* 問題はまだ読んでいない：回の行が6つそろっていれば「問題あり」 */
  else out.parts.forEach(function(p){p.nq=RS.map(function(R){return p.rounds[R]?NQ(p.rounds[R]):0;});if(RS.some(function(R){return !p.rounds[R]||!p.rounds[R].length;}))p.ready=false;});
  out.parts=out.parts.filter(function(p){return p.ready;});
  /* 問題がそろっていないパートは「問題はまだ」 */
  var ok={};out.parts.forEach(function(p){ok[p.id]=1;});out.units.forEach(function(u){u.parts.forEach(function(x){if(!ok[x.id])x.ready=false;});});out.ny.forEach(function(q){if(!ok[q.id])q.ready=false;});
  out.ny.sort(function(a,b){return a.no-b.no;});
  if(!LZ&&opt.fig!==false&&G.MathFig){out.parts=G.MathFig.data(out.parts);out.cts=G.MathFig.data(out.cts);}
  if(LZ)out.lazy=true;
  return out;
}
function ruiPut_(p,L){L.forEach(function(q){var t=q.ty;delete q.rk;(p.rui[t]=p.rui[t]||[]).push(q);});}
/* 読んだ words を GG に入れる（opt.lazy で作った GG 用）。同じ行をもう一度入れたら入れ直す（上書き）。words に無い行は触らない */
function ggFillWords(GG,words,opt){
  opt=opt||{};var FIG=opt.fig!==false&&G.MathFig,D=FIG?function(v){return G.MathFig.data(v);}:function(v){return v;};
  regFig_(words);
  var byPart={};(words||[]).forEach(function(w){if(w.qtype==='ws_gg_fig')return;(byPart[String(w.part_id)]=byPart[String(w.part_id)]||[]).push(w);});
  var done=[];
  Object.keys(byPart).forEach(function(rid){
    var m=GG.pid&&GG.pid[rid];if(!m)return;
    var L=byPart[rid].sort(function(a,b){return (+a.display_order||0)-(+b.display_order||0);});
    var Q=function(t){return D(L.filter(function(w){return w.qtype===t;}).map(ggQ_));};
    if(m.k==='RD'||m.k==='RU'){var p=null;(GG.parts||[]).forEach(function(x){if(x.id===m.pid)p=x;});if(!p)return;
      if(m.k==='RD')p.rounds[m.r]=Q('ws_gg_q');else{p.rui={};ruiPut_(p,Q('ws_gg_rui'));}
      (p.ld=p.ld||{})[m.k==='RD'?m.r:'RU']=1;done.push(rid);return;}
    if(m.k==='CT'){var c=null;(GG.cts||[]).forEach(function(x){if(x.id===m.pid)c=x;});if(!c||!c.rounds[m.r])return;
      c.rounds[m.r].items=Q('ws_gg_ct');(c.ld=c.ld||{})[m.r]=1;done.push(rid);}
  });
  return done;
}
/* 図の行 → MathFig.ns.ggref（同じページで前に読んだ単元の分も残す） */
function regFig_(words){var REF=(G.__ggRef=G.__ggRef||{});(words||[]).forEach(function(w){if(w.qtype!=='ws_gg_fig')return;var o=jp(w.qdata,null);if(o&&o.h)REF[o.h]=o.svg;});
  if(G.MathFig&&G.MathFig.ns&&!G.MathFig.ns.ggref)G.MathFig.ns.ggref={S:function(h){return REF[h]||'<span class="ws-figerr">図が読めません（'+h+'）</span>';}};}
G.ggBuildData=ggBuildData;G.ggFillWords=ggFillWords;
if(typeof module!=='undefined')module.exports={ggBuildData:ggBuildData,ggFillWords:ggFillWords};
})(typeof window!=='undefined'?window:globalThis);
