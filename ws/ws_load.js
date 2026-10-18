/* シートの行（materials・parts・words）から、モックと同じ形のデータ（UNIT_TITLE・REVIEW・PATS・TEST）を組み立てる。
   図の印はここでは描かない（MathFig.data で描く）。2026-10-17 単元ワークシート */
function wsDesc_(pt){ try{ var d=JSON.parse(String(pt.description||'{}')); return d&&d.ws?d.ws:null; }catch(e){ return null; } }
function wsQ_(w){ var q=null; try{ q=JSON.parse(String(w.qdata||'null')); }catch(e){ return null; } if(q&&typeof q==='object'&&w.id!=null) Object.defineProperty(q,'wid',{value:String(w.id),enumerable:false}); return q; } /* wid＝words の id（記録用・数えない値なので JSON に出さない） */
function wsBuildUnit(mat, parts, words){
  var ps=parts.filter(function(p){return String(p.material_id)===String(mat.id);}).sort(function(a,b){return (+a.part_order||0)-(+b.part_order||0);});
  var byPart={}; words.forEach(function(w){ (byPart[String(w.part_id)]=byPart[String(w.part_id)]||[]).push(w); });
  Object.keys(byPart).forEach(function(k){ byPart[k].sort(function(a,b){return (+a.display_order||0)-(+b.display_order||0);}); });
  var title=String(mat.title||''); var m=title.match(/^中[123]数学[ 　]+\S+[ 　]+(.+)$/); var chap=m?m[1]:title;
  var out={UNIT_TITLE:chap, REVIEW:null, PATS:[], TEST:null, parts:{}};
  var pat={};
  ps.forEach(function(p){
    var d=wsDesc_(p)||{}; var ws=byPart[String(p.id)]||[]; out.parts[String(p.id)]={k:d.k,no:d.no};
    var qs=function(t){ return ws.filter(function(w){return w.qtype===t;}).map(wsQ_); };
    if(d.k==='RV'){ out.REVIEW={sub:d.sub,items:qs('ws_q')}; out.REVIEW.part_id=p.id; return; }
    if(d.k==='X'){ var T={}; Object.keys(d).forEach(function(k){ if(k!=='tk'&&k!=='ns'&&k!=='ut')T[k]=d[k]; }); T.k=d.tk; T.items=qs('ws_q'); T.part_id=p.id; out.TEST=T; if(d.ut&&ps.length===1) out.UNIT_TITLE=d.ut; return; }
    var pa=pat[d.no]; if(!pa){ pa=pat[d.no]={no:d.no,name:d.name,point:null,parts:[],back:d.back}; out.PATS.push(pa); }
    if(d.k==='L'){
      pa.point=qs('ws_point')[0]||null;
      var ez=qs('ws_easy'); if(ez.length) pa.easy=ez[0];
      var tc=qs('ws_touch'); if(tc.length) pa.touch=tc[0];
      (d.parts||[]).forEach(function(sp){ var P={k:sp.k,name:sp.name}; if(sp.wu)P.wu=true; P.items=qs(sp.k==='W'?'ws_warm':'ws_q'); P.part_id=p.id; pa.parts.push(P); });
    } else { pa.parts.push({k:d.k,name:d.k==='E'?'Exercise':'Exercise＋',items:qs('ws_q'),part_id:p.id}); }
  });
  return out;
}
/* 類題の在庫（POOL・E-27・E-34）：同じ本のワークシートの Try・Exercise・Exercise＋ の問題を、戻る所（description の back）ごとにまとめる。
   モックの tools\pool.py と同じ決まり＝穴うめのステップがある問題と、選択肢が配列でない問題は入れない。並びは 教材 → パート → 問題 の順。2026-10-18 段④ */
function wsBuildPool(pool){
  var out={}; if(!pool||!pool.parts) return out;
  var ps=pool.parts.slice().sort(function(a,b){return ((+a.display_order||0)-(+b.display_order||0))||((+a.part_order||0)-(+b.part_order||0));});
  var byPart={}; (pool.words||[]).forEach(function(w){ (byPart[String(w.part_id)]=byPart[String(w.part_id)]||[]).push(w); });
  ps.forEach(function(p){
    var d=wsDesc_(p)||{}; if(!d.back||(d.k!=='L'&&d.k!=='E'&&d.k!=='EP')) return;
    (byPart[String(p.id)]||[]).slice().sort(function(a,b){return (+a.display_order||0)-(+b.display_order||0);}).forEach(function(w){
      var q=null; try{ q=JSON.parse(String(w.qdata||'null')); }catch(e){ return; }
      if(!q||!Array.isArray(q.steps)||q.steps.some(function(s){return s.fill||!Array.isArray(s.c);})) return;
      (out[d.back]=out[d.back]||[]).push({q:q.q,steps:q.steps.map(function(s){return {s:s.s,c:s.c,a:s.a,w:s.w};})});
    });
  });
  return out;
}
if(typeof module!=='undefined') module.exports={wsBuildUnit:wsBuildUnit,wsBuildPool:wsBuildPool};
