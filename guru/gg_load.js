/* gg_load.js：ぐるぐる（数学）のシートの行（materials・parts・words）から、外側の画面（gg_shell.js）と ggMount（gg_app.js）が受け取るデータを組み立てる。
   ws_load.js の wsBuildUnit に当たる。2026-11-02 本番係。行は tools\gg_export.js が作る形（description の JSON は {"gg":{k,…}}）。
   使い方：var GG=ggBuildData(rows, {fig:true})
     rows＝{materials:[…], parts:[…], words:[…]}（何単元でも）か、ws_unit の返事と同じ形 {material:{…}, parts:[…], words:[…]}（1単元）
     返り＝{units:[{key,mid,grade,unit,ui,parts:[{id,no,name,ready,cu,imp}]}], parts:[パート], ny:[入試パターン], cts:[章まとめテスト], pid:{パートの行の id → {k,pid,r}}}
       パート＝{id, ready:true, grade, unit, ui, no, name, catch, cover, types, kiso, rounds:{A1:[問題],…,C2}, rui:{a1:[問題],…}, nq:[小問の数×6], ny?, rowIds:{A1:'gg_m1u4p1_A1',…,RU:'…'}}
       章まとめテスト＝{id, grade, ukey, unit, ui, kind, rng, upto, name, ut, after, rounds:{A1:TEST,…}, rowIds:{A1:'gg_ctm1u4k_A1',…}}
     opt.fig＝true（省いたとき）なら、図の印（⟦F:…⟧）を MathFig.data で描いた形にして返す。先に ws\math_fig.js・guru\gg_fig.js を読んでおく
     opt.lazy＝true：words が無くても（parts の行だけで）一覧を作る（2026-11-02 段3・先生のプレビューを速くする）。回の行（RD）が6つそろったパートを「問題あり」にし、
       問題は空のまま（p.rounds={}・章まとめは c.rounds[R].items=null）。あとで ggFillWords(GG, words) で、読んだパートの分だけ入れる
   ggFillWords(GG, words, opt)：words（回・類題・章まとめ・図の行）を GG の中の該当するパート・テストに入れる。返り＝入れた行の id（parts の行）の一覧。opt.fig は ggBuildData と同じ
   重要マーク ◆（2026-11-03 ぐるぐる）：表紙の行・章まとめテストの行の description の gg.imp（gg_export.js が ◆ の行に "imp":1 を入れる）か、行の important 列が「◆」なら imp:true。
     units[].parts[].imp・parts[].imp・cts[].imp に入る。入試パターンは ◆ なし（imp を見ない）
   ぐるぐる英語（2026-11-03）：materials.subject が 'english' の教材は subj:'en'（それ以外は 'ma'）。units[]・units[].parts[]・parts[]・ny[]・cts[] に subj が入る。
     表紙の行の gg.rs（問題のある回の一覧。見本は ['A1'] だけ）があるパートは、その回がそろえば「問題あり」（無い回は gg_shell.js が「準備中」にする）。rs が無い行（数学）は今までどおり6回そろって「問題あり」。
     表紙の行の gg.min（分）・gg.meta（表紙の「何問・何分」の行）は parts[].min・parts[].meta に入る
   会話表現（2026-11-17 ぐるぐる英語）：表紙の行の gg.kaiwa が 1 のパートは units[].parts[].kaiwa・parts[].kaiwa＝true（gg_shell.js がローズの帯と札を付け、文法のパートの番号に数えない）
   問題用紙の枚数（2026-11-23 紙の直し係P・川上さん「Aア」）：回の行の description の gg.sh が 2 の回は parts[].shR[回]＝2（guru\gg_paper.js が A4 両面2枚に組む）。無い回は1枚
   図の行（qtype ws_gg_fig）：大きい問題の SVG を別の行にしたもの。MathFig.ns.ggref.S(md5の頭12字) で引けるようにしてから描く */
(function(G){
var RS=['A1','A2','B1','B2','C1','C2'];
function jp(s,d){try{var v=JSON.parse(String(s==null?'':s));return v==null?d:v;}catch(e){return d;}}
function ggDesc_(pt){var d=jp(pt.description,null);return d&&d.gg?d.gg:null;}
function ggImp_(d,pt){return !!(d&&d.imp)||String(pt&&pt.important||'').trim()==='\u25c6';}   /* 2026-11-03 ぐるぐる 重要マーク ◆ */
/* 2026-11-24 箱の名前で呼ぶ（ぐるぐる英語_作り方の決まり.md の S3）：表紙の行（章まとめテストは回の行）の gg.boxes に {名前:'[文法]…'}。解説の行 '&@名前'・'&+@名前'（［もっと見る］の中）を中身に置きかえる。ほかのパートの箱は '&@パートid/名前' */
var BOX_={},CUR_PID='';
function ggBoxReg_(parts){(parts||[]).forEach(function(pt){var d=ggDesc_(pt);var id=d&&(d.k==='CV'?d.pid:d.k==='CT'?d.ct:'');if(id&&d.boxes)Object.keys(d.boxes).forEach(function(k){BOX_[id+'/'+k]=String(d.boxes[k]);});});G.__ggBox=BOX_;}
function ggBoxL_(l){if(typeof l!=='string')return l;var m=/^&(\+?)@(\S+)$/.exec(l);if(!m)return l;var key=m[2].indexOf('/')>=0?m[2]:CUR_PID+'/'+m[2];var t=BOX_[key];return '&'+m[1]+(t!=null?t:'[文法]（箱が見つかりません：'+key+'）');}
function ggBoxW_(o){if(o&&Array.isArray(o.w))o.w=o.w.map(ggBoxL_);if(o&&Array.isArray(o.steps))o.steps.forEach(function(st){if(st&&Array.isArray(st.w))st.w=st.w.map(ggBoxL_);});}
function ggQ_(w){var q=jp(w.qdata,null);if(q&&typeof q==='object'&&w.id!=null)Object.defineProperty(q,'wid',{value:String(w.id),enumerable:false});ggBoxW_(q);ggMk_(q);return q;}
/* 2026-11-04 よくあるまちがいの印：解説の '#' の行の頭の '#[選択肢の文字そのまま]説明' を、その問題の c の番号に直して '#{番号}説明' にする（gg_app.js の WTXT が番号で出し分ける）。
   [] の中が c のどれとも1字も同じでないとき（と、c の無い所＝連問の全体の w）は印を外して、印なしの '#説明' にする。連問は steps の1つずつ。類題・章まとめも ggQ_ を通るので同じ。
   [] の中に [] があってもよい（\sqrt[3]{} など）：c の文字と頭から合わせ、合わなければ [ と ] の数を数えて印の終わりを決める */
function ggMkLine_(l,c){if(typeof l!=='string'||l.charAt(0)!=='#'||l.charAt(1)!=='[')return l;
  var best=-1,bl=-1;(c||[]).forEach(function(x,k){x=String(x);if(l.lastIndexOf('#['+x+']',0)===0&&x.length>bl){best=k;bl=x.length;}});
  if(best>=0)return '#{'+best+'}'+l.slice(bl+3);
  var d=0;for(var i=1;i<l.length;i++){var ch=l.charAt(i);if(ch==='[')d++;else if(ch===']'){d--;if(d===0)return '#'+l.slice(i+1);}}
  return l;}
function ggMkW_(o,c){if(o&&Array.isArray(o.w))o.w=o.w.map(function(l){return ggMkLine_(l,c);});}
function ggMk_(q){if(!q||typeof q!=='object')return;ggMkW_(q,Array.isArray(q.c)?q.c:null);
  if(Array.isArray(q.steps))q.steps.forEach(function(st){if(st&&typeof st==='object')ggMkW_(st,Array.isArray(st.c)?st.c:null);});}
var NQ=function(items){return items.reduce(function(s,it){return s+(it&&it.ren?it.steps.length:1);},0);};
function ggBuildData(rows,opt){
  opt=opt||{};
  var mats=rows.materials||(rows.material?[rows.material]:[]),parts=rows.parts||[],words=rows.words||[];
  var byPart={};words.forEach(function(w){(byPart[String(w.part_id)]=byPart[String(w.part_id)]||[]).push(w);});
  Object.keys(byPart).forEach(function(k){byPart[k].sort(function(a,b){return (+a.display_order||0)-(+b.display_order||0);});});
  var qs=function(pid,t){return (byPart[String(pid)]||[]).filter(function(w){return w.qtype===t;}).map(ggQ_);};
  var LZ=!!opt.lazy;
  regFig_(words);ggBoxReg_(parts);
  var out={units:[],parts:[],ny:[],cts:[],pid:{}};var P={},CT={};
  var ms=mats.slice().sort(function(a,b){return (+a.display_order||0)-(+b.display_order||0);});
  ms.forEach(function(m){
    var ps=parts.filter(function(p){return String(p.material_id)===String(m.id);}).sort(function(a,b){return (+a.part_order||0)-(+b.part_order||0);});
    var u=null;var SJ=String(m.subject||'')==='english'?'en':'ma';
    ps.forEach(function(pt){var d=ggDesc_(pt);if(!d)return;out.pid[String(pt.id)]={k:d.k,pid:d.pid||d.ct,r:d.r||''};
      if(d.k==='CV'){
        if(d.kind==='ny'){var q={id:d.pid,subj:SJ,no:d.ny.no,grade:d.grade,name:d.name,field:d.ny.field,after:d.ny.after,after_ui:d.ny.after_ui,after_pi:d.ny.after_pi,ready:!!d.ready};out.ny.push(q);}
        else{if(!u){u={key:(SJ==='en'?'en_':'')+d.grade+'_'+d.unit,subj:SJ,mid:m.id,grade:d.grade,unit:d.unit,ui:d.ui,parts:[]};out.units.push(u);}
          u.parts.push({id:d.pid,subj:SJ,no:d.pi,name:d.name,ready:!!d.ready,cu:d.cu||{},pre:d.pid,imp:ggImp_(d,pt),kaiwa:!!d.kaiwa});}
        if(d.ready){var x=P[d.pid]={id:d.pid,subj:SJ,ready:true,grade:d.grade,unit:d.unit,ui:d.ui||0,no:d.kind==='ny'?d.ny.no:d.pi,name:d.name,catch:d.catch||'',cover:d.cover||[],types:d.types||{},kiso:d.kiso||{},meta_name:d.meta_name||'',rounds:{},rui:{},rowIds:{CV:String(pt.id)},point:{sections:[]}};
          if(d.kind==='ny')x.ny=true;else x.imp=ggImp_(d,pt);if(d.kaiwa)x.kaiwa=true;if(d.rs)x.rs=d.rs.slice();if(d.min)x.min=+d.min;if(d.meta)x.meta=d.meta;out.parts.push(x);}
        return;}
      if(d.k==='RD'){var p=P[d.pid];if(!p)return;p.rowIds[d.r]=String(pt.id);(p.nqR=p.nqR||{})[d.r]=+d.nq||0;if(+d.sh===2)(p.shR=p.shR||{})[d.r]=2;if(!LZ){CUR_PID=d.pid;p.rounds[d.r]=qs(pt.id,'ws_gg_q');CUR_PID='';}return;}
      if(d.k==='RU'){var p2=P[d.pid];if(!p2)return;p2.rowIds.RU=String(pt.id);if(!LZ){CUR_PID=d.pid;ruiPut_(p2,qs(pt.id,'ws_gg_rui'));CUR_PID='';}return;}
      if(d.k==='CT'){var c=CT[d.ct];if(!c){c=CT[d.ct]={id:d.ct,subj:SJ,grade:d.grade,ukey:(SJ==='en'?'en_':'')+d.grade+'_'+d.unit,unit:d.unit,ui:d.ui,kind:d.kind,rng:d.rng,upto:d.upto,name:d.name,ut:d.ut,after:d.after,rounds:{},rowIds:{},imp:false};out.cts.push(c);}if(ggImp_(d,pt))c.imp=true;
        var T={};Object.keys(d.test||{}).forEach(function(k){T[k]=d.test[k];});T.nq=+d.nq||0;CUR_PID=d.ct;T.items=LZ?null:qs(pt.id,'ws_gg_ct');CUR_PID='';c.rounds[d.r]=T;c.rowIds[d.r]=String(pt.id);return;}
    });
  });
  if(LZ)out.parts.forEach(function(p){p.lazy=true;p.nq=RS.map(function(R){return (p.nqR||{})[R]||0;});if((p.rs||RS).some(function(R){return !p.rowIds[R]||!(p.nqR||{})[R];}))p.ready=false;});   /* 問題はまだ読んでいない：回の行が6つそろっていれば「問題あり」 */
  else out.parts.forEach(function(p){p.nq=RS.map(function(R){return p.rounds[R]?NQ(p.rounds[R]):0;});if((p.rs||RS).some(function(R){return !p.rounds[R]||!p.rounds[R].length;}))p.ready=false;});
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
    CUR_PID=m.pid||'';
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

/* 2026-11-24 英語の解説の箱（ぐるぐる英語_作り方の決まり.md の S1〜S6）。画面（gg_app.js）・紙（gg_app.js と gg_paper_en.js）で同じ1つを使う＝G.ggEnBox。
   CSS に頼らず、字の飾りは全部 style に書く（先生画面の印刷・紙の CSS が別でも同じに出る）。書き方は honban\fix1124_box.py の頭のとおり */
var EN_TAG_={'文法':1,'くらべる':1,'熟語・表現':1,'表':1};
var EN_PC_='-webkit-print-color-adjust:exact;print-color-adjust:exact;';
var EN_MK_='background:linear-gradient(transparent 45%,#fde68a 45%);font-weight:700;color:#111;'+EN_PC_;
var EN_BX_='border:2px solid #374151;border-radius:3px;padding:0 3px;font-weight:700;color:#111;background:#fde68a;'+EN_PC_;
var EN_SERIF_="font-family:'Times New Roman','DejaVu Serif',serif;";
function enMk_(t){return String(t).replace(/==(.+?)==/g,'<span class="emk" style="'+EN_MK_+'">$1</span>');}
function enCell_(t){t=String(t);var m=/^\[(.+)\]$/.exec(t.trim());if(m)return {h:'<span class="ebx" style="'+EN_BX_+'">'+enMk_(m[1])+'</span>',bx:1};return {h:enMk_(t),bx:0};}
function enGrid_(rows){var R=rows.map(function(r){return r.slice(1).split('/');});var nc=Math.max.apply(null,R.map(function(r){return r.length;}))-1;var h='',gr=1,prev=-1;
  var L='position:absolute;top:6px;border-top:2px solid #374151;';
  R.forEach(function(r,ri){var cs=r.slice(1).map(enCell_);var bi=-1;cs.forEach(function(c,k){if(c.bx&&bi<0)bi=k;});
    if(ri>0&&prev>=0&&bi>=0&&bi!==prev){var a=Math.min(prev,bi),b=Math.max(prev,bi);
      for(var k=a;k<=b;k++){var inner='';
        if(k===prev){inner+='<span style="'+L+(prev<bi?'left:50%;right:-5px;':'left:-5px;right:50%;')+'"></span><span style="position:absolute;left:calc(50% - 1px);top:-3px;height:10px;border-left:2px solid #374151;"></span>';}
        else if(k===bi){inner+='<span style="'+L+(prev<bi?'left:-5px;right:50%;':'left:50%;right:-5px;')+'"></span><span style="position:absolute;left:calc(50% - 5px);top:6px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:9px solid #374151;"></span>';}
        else inner+='<span style="'+L+'left:-5px;right:-5px;"></span>';
        h+='<span class="ea" style="position:relative;height:16px;grid-row:'+gr+';grid-column:'+(k+2)+'">'+inner+'</span>';}
      gr++;}
    h+='<span class="el" style="grid-row:'+gr+';grid-column:1;font-family:sans-serif;font-size:11.5px;color:#6b7280;white-space:nowrap;align-self:center">'+(r[0]||'')+'</span>';
    cs.forEach(function(c,k){h+='<span class="ec" style="grid-row:'+gr+';grid-column:'+(k+2)+';white-space:nowrap;padding:3px 0">'+c.h+'</span>';});
    gr++;prev=bi;});
  return '<div class="efg" style="display:grid;grid-template-columns:auto repeat('+nc+',auto) 1fr;column-gap:10px;align-items:center;margin:2px 0 4px;'+EN_SERIF_+'font-size:16.5px">'+h+'</div>';}
function enTab_(rows){var h='<table class="etb" style="border-collapse:collapse;margin:4px 0;font-size:15px">';rows.forEach(function(r){var th=r.slice(0,2)!=='^^';var cs=r.slice(th?1:2).split('/');
  h+='<tr>'+cs.map(function(c){return th?'<th style="border:1px solid #cbd5e1;padding:3px 12px;text-align:left;background:#eef2f7;font-size:12.5px;'+EN_PC_+'">'+enMk_(c)+'</th>':'<td style="border:1px solid #cbd5e1;padding:3px 12px;text-align:left">'+enMk_(c)+'</td>';}).join('')+'</tr>';});return h+'</table>';}
function ggEnBox(l){l=String(l);if(l.charAt(0)==='&')l=l.slice(1);if(l.charAt(0)==='+')l=l.slice(1);var m=/^\[([^\]]+)\]/.exec(l);if(!m||!EN_TAG_[m[1]])return null;var n=m[1];var R=l.slice(m[0].length).split('|');var h='',i=0;
  while(i<R.length){var r=R[i];
    if(r.charAt(0)==='%'){var g=[];while(i<R.length&&R[i].charAt(0)==='%')g.push(R[i++]);h+=enGrid_(g);continue;}
    if(r.charAt(0)==='^'){var t=[];while(i<R.length&&R[i].charAt(0)==='^')t.push(R[i++]);h+=enTab_(t);continue;}
    if(r.charAt(0)==='=')h+='<div class="eru" style="font-size:14px;margin:4px 0 6px">'+enMk_(r.slice(1))+'</div>';
    else if(r.charAt(0)==='~')h+='<div class="efu" style="display:inline-block;font-size:12px;color:#475569;border:1.5px dotted #94a3b8;border-radius:8px;padding:2px 8px;margin:4px 0 2px;background:#fff">'+enMk_(r.slice(1))+'</div>';
    else if(r==='-')h+='<div class="esp" style="border-top:1px dashed #cbd5e1;margin:8px 0"></div>';
    else if(r.charAt(0)==='<')h+='<div class="gbfig">'+r+'</div>';
    else h+='<div class="erl" style="'+EN_SERIF_+'font-size:15.5px;margin:2px 0 0 4px">'+enMk_(r)+'</div>';
    i++;}
  return '<div class="gbox gen" style="float:none;clear:both;max-width:none;margin:8px 0;padding:6px 12px 10px;border:1px solid #c9ced6;border-radius:8px;background:#f5f6f8;'+EN_PC_+'"><div class="gbh" style="font-size:12px;font-weight:700;color:#475569;margin:0 0 2px">'+n+'</div>'+h+'</div>';}
G.ggBuildData=ggBuildData;G.ggFillWords=ggFillWords;G.ggMarkWrong=ggMk_;G.ggEnBox=ggEnBox;
if(typeof module!=='undefined')module.exports={ggBuildData:ggBuildData,ggFillWords:ggFillWords,ggMarkWrong:ggMk_};
})(typeof window!=='undefined'?window:globalThis);
