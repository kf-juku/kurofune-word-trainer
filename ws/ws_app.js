/* ws_app.js：単元ワークシート（数学）の生徒の画面。自動で作る（mkapp.py・元＝ジョブス用\道具\20261016_単元ワークシート中2数学\mock\m.html）。手で直さない
   使い方：wsMount(root, D, opt)。D＝{UNIT_TITLE, PATS, REVIEW, TEST, POOL}（図の印は MathFig.data で描いたあとのもの）。
   画面は root の Shadow DOM に描く。KaTeX（katex.min.js・auto-render）は先に読んでおく。 */
(function(){
var WS_CSS="\n:host{--ink:#1a1a1a;--sub:#555;--w:#2563eb;--t:#0f766e;--e:#b45309;--p:#6b21a8;--bg:#f4f5f7;--ok:#15803d;--ng:#b91c1c}\n*{box-sizing:border-box}:host{margin:0;background:var(--bg);color:var(--ink);font-family:\"Noto Sans JP\",\"Yu Gothic\",sans-serif;line-height:1.7}\n.bar{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #ddd;padding:8px 16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}\n.bar b{margin-right:8px}.bar button{border:1px solid #bbb;background:#fff;border-radius:8px;padding:6px 12px;font:inherit;font-size:14px;cursor:pointer}\n.bar button.on{background:var(--ink);color:#fff;border-color:var(--ink)}\nmain{max-width:980px;margin:0 auto;padding:16px 16px 60px}\n.note{color:var(--sub);font-size:13px}\n.emb .note,.emb .bar>b{display:none}.emb .bar{padding:6px 10px}.emb main{padding:8px 10px 60px;max-width:none}\n.tag{display:inline-block;border-radius:6px;padding:0 8px;font-weight:700;font-size:12px;color:#fff;vertical-align:middle}\n.P{background:var(--p)}.W{background:var(--w)}.T{background:var(--t)}.E{background:var(--e)}\n/* アプリ */\n.app{display:grid;grid-template-columns:300px 1fr;gap:16px}@media(max-width:760px){.app{grid-template-columns:1fr}}\n.side{background:#fff;border:1px solid #ddd;border-radius:10px;padding:10px}\n.side .u{font-size:12px;color:var(--sub)}.side .pt{font-weight:700;margin:4px 0 8px}\n.side button{display:block;width:100%;text-align:left;border:1px solid #ddd;background:#fff;border-radius:8px;padding:6px 8px;margin:4px 0;font:inherit;font-size:14px;cursor:pointer}\n.side button.on{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}\n.phone{background:#fff;border:1px solid #ddd;border-radius:14px;padding:16px;max-width:520px}@media (min-width:900px){.phone.tres{max-width:860px}}\n.phone.wu{border:2px solid var(--w);background:#f5f9ff}\n.pcard{border:2px solid var(--p);border-radius:10px;padding:10px 14px;background:#faf5ff;margin-bottom:12px}\n.pcard h3{margin:0 0 4px;font-size:15px;color:var(--p)}\n.pcard table{border-collapse:collapse;width:100%;font-size:14px}.pcard td{border-bottom:1px solid #e9d5ff;padding:3px 4px}\n.pc{border:2px solid var(--p);border-radius:10px;padding:10px 14px;background:#faf5ff;margin-bottom:10px}\n.pch{font-weight:700;color:var(--p);margin-bottom:4px}.pcw{font-weight:700;margin-bottom:6px}.pcl{margin:2px 0}\n.pcn,.pcx{background:#fff;border-radius:8px;padding:6px 10px;margin:4px 0;font-size:14.5px}\n.lb{display:inline-block;font-size:11px;font-weight:700;border-radius:4px;padding:0 6px;margin-right:8px;background:#e9d5ff;color:#4c1d95}.lb.x{background:#4c1d95;color:#fff}\n.hj{display:flex;gap:12px;align-items:center;margin:6px 0;font-size:13.5px}.hj svg{flex-shrink:0}\n.pr{display:flex;gap:8px;align-items:flex-start;background:#fff;border-radius:8px;padding:6px 10px;margin:5px 0;font-size:15px}.pr .lb{margin-top:3px;flex-shrink:0;min-width:72px;text-align:center}.pr .pt{line-height:2;flex:1;min-width:0}.pr.stk{flex-direction:column;gap:2px}.pr.stk .lb{min-width:0;align-self:flex-start}.pr.stk>.pt{flex:none;width:100%}\n.sm{font-size:12.5px;color:var(--sub)}\n.bl{position:relative;display:inline-block;text-align:center;min-width:52px;padding:0 8px;margin:0 2px;border-radius:7px;background:#ede9fe;border:1.5px dashed #6b21a8;color:#6b21a8;font-weight:800;cursor:pointer;line-height:1.6}\n.bl.open{background:#6b21a8;color:#fff;border-style:solid}\n.bl.fill{min-width:0;padding:0 4px;background:none;border:0;border-bottom:2px solid #c4b5fd;border-radius:0;color:var(--ink);cursor:default}.bl.fill.miss{border-bottom-color:#f59e0b}\n.pt-fb{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#15803d;color:#fff;font-size:12px;border-radius:6px;padding:0 6px;white-space:nowrap;margin-bottom:4px}.pt-fb.miss{background:#f59e0b}\n.pt-left{font-size:13px;color:var(--sub);text-align:right;min-height:18px}\n.pt-pick{margin-top:6px;padding-top:10px;border-top:1px solid #ddd}.pt-chs{display:flex;flex-wrap:wrap;gap:8px}\n.pt-ch{background:#fff;border:1.5px solid #ccc;border-radius:12px;padding:8px 16px;font:inherit;font-size:16px;font-weight:700;cursor:pointer;min-height:44px}\n.pt-ch.dim{opacity:.3}.pt-ch.hit{border-color:#15803d;background:#dcfce7;color:#15803d}\n.next:disabled{background:#bbb;cursor:default}\n.pbl{display:inline-block;border:1px solid #888;min-width:60px;text-align:left;font-size:10px;color:#888;padding:0 3px;height:24px;vertical-align:middle;margin:0 2px}\n.pgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px}\n.pgrid .pc,.pgrid .pr,.pgrid .pt{min-width:0}\n.pgrid svg{max-width:100%;height:auto}\n.pgrid .pc:has(table.cv){grid-column:1/-1}\n#v-q .pgrid{display:block;column-count:2;column-gap:6px}\n#v-q .pgrid .pc{break-inside:avoid;display:block;margin:0 0 6px}\n#v-q .pgrid .pc:has(table.cv),#v-q .pgrid .pc.wide{column-span:all}\n#v-q .pgrid .eqg,#v-a .pgrid .eqg{grid-template-columns:max-content max-content minmax(5em,1fr)}\n#v-q .pgrid .eqg .eqn,#v-a .pgrid .eqg .eqn{font-size:10px;padding-left:4px}.pgrid .pc{margin:0;padding:6px 8px}.pgrid .pr{font-size:12px;padding:2px 4px;margin:2px 0}.pgrid .pr .lb{min-width:56px;font-size:10px}.pgrid .pr .pt{line-height:1.8}.pgrid .hj svg{width:64px;height:auto}.pgrid .hj{font-size:10.5px;gap:6px}.pgrid .pch{font-size:12.5px;margin:0}\n.dv{margin:4px 0}.dv .we{font-size:16px;font-weight:700;color:var(--ink);margin:4px 0 6px}.dv .wn{margin:2px 0 2px 1.2em;padding:0;font-size:13px;color:#444;font-weight:400}.dv .wt{font-size:13px;color:#444;margin:6px 0 2px;font-weight:400}\n.sheet .dv .we{font-size:13.5px}.sheet .dv .wn{font-size:12px}\n.tb{border-collapse:collapse;margin:4px 0;font-size:15px}.tb th,.tb td{border:1px solid #9ca3af;padding:2px 10px;text-align:center;min-width:44px;background:#fff}.tb th{background:#f3f4f6}\n.pgrid .tb{font-size:11.5px}.pgrid .tb th,.pgrid .tb td{padding:0 4px;min-width:26px}\n.side .pt2{font-weight:700;font-size:13px;margin:10px 0 2px}.side .prow{display:flex;flex-direction:column}\n.tag.X{background:#374151}.fillbox{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:8px 10px}\n.blank.s{min-width:60px}.opts{font-size:13px}.opt6{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;line-height:2;margin:2px 0 2px 1.4em;font-size:13px}\n.score{font-size:40px;font-weight:800;text-align:center;margin:10px 0}.score span{font-size:18px;color:var(--sub)}\n.tr{border-top:1px solid #eee;padding:6px 0;font-size:14px}.tr.x{background:#fff7ed}.ta{font-size:13px;color:#444;margin:2px 0}\n.tba td{min-width:22px;padding:2px 4px}.tba tr.yn td,.tba tr.xn td{border:0;background:none;font-size:13px;color:#c2410c;font-weight:700;padding:0}.tba tr.xn td{color:#2563eb}.tba tr.yn th,.tba tr.xn th{border:0;background:none}\n.wtb{margin:4px 0;overflow-x:auto}.calc{display:inline-block;font-size:13px;font-weight:700;border:1.5px solid #374151;border-radius:6px;padding:1px 8px;margin:0 0 8px}\n#pv-bar{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;align-items:center;gap:8px;padding:8px 12px;background:#1f2937;color:#fff;font-size:13px;font-weight:700;flex-wrap:wrap}\n#pv-bar button{font:inherit;border:0;border-radius:8px;padding:6px 11px;background:#374151;color:#fff;cursor:pointer}#pv-bar #pv-pos{min-width:200px;text-align:center}\n#pv-bar label{display:inline-flex;align-items:center;gap:4px}#pv-bar .pvn{margin-left:auto;color:#cbd5e1;font-weight:500}\n:host{padding-bottom:56px}@media print{#pv-bar{display:none}}\n.eqg{display:grid;grid-template-columns:max-content max-content minmax(5em,1fr);column-gap:2px;row-gap:4px;align-items:baseline;margin:4px 0}.eqg .eql{text-align:right}.eqg .eqr{text-align:left}.eqg .eqn{font-size:12px;color:#555;padding-left:12px;line-height:1.4}.eqg .eqn:not(:empty)::before{content:'… ';color:#999}\n#v-q .eqg,#v-a .eqg{grid-template-columns:max-content max-content minmax(7em,1fr)}\n#v-q .eqg .eqn,#v-a .eqg .eqn{font-size:10.5px;padding-left:6px}\n.gr{display:block;margin:4px 0;max-width:100%}.g2{display:flex;gap:10px;flex-wrap:wrap}.gc{font-size:13px;text-align:center}.tb.inc{display:inline-table;margin:2px 6px 2px 0;font-size:13px;vertical-align:middle}.tb.inc td,.tb.inc th{min-width:40px;padding:1px 8px}.grq{margin:6px 0}.pgrid .gr{width:150px;height:150px}\n.gzoom{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:99}.gzoom svg{width:min(92vw,92vh);height:min(92vw,92vh);background:#fff;border-radius:10px}#ph svg.gr{cursor:zoom-in}#v-a svg.gr-big,#v-q svg.gr-big{width:300px;height:300px}@media print{.gzoom{display:none}}\n.pdots{font-size:12px;color:var(--sub);margin:4px 0 8px}\n.fb .okm{color:var(--ok);font-weight:700}.fb .dv{color:var(--ink)}\n.q{background:#fff8e1;border:1px solid #f0d58a;border-radius:8px;padding:10px 14px;margin:8px 0}\n.prog{font-size:12px;color:var(--sub)}\n.stepq{font-weight:700;margin:10px 0 6px}\n.ch{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ch.long{grid-template-columns:1fr}\n.ch button{border:1px solid #bbb;background:#fff;border-radius:10px;padding:10px;font:inherit;font-size:16px;cursor:pointer;min-height:48px}\n.ch button.ok{border-color:var(--ok);background:#dcfce7}.ch button.ng{border-color:var(--ng);background:#fee2e2}\n.fb{margin-top:8px;font-size:14px;min-height:24px}.fb.ok{color:var(--ok);font-weight:700}.fb.ng{color:var(--ng)}\n.done{display:flex;flex-direction:column;gap:6px;margin-top:6px}\n.done div{font-size:14px;border-left:3px solid #ccc;padding-left:8px}\n.next{margin-top:10px;border:0;background:var(--ink);color:#fff;border-radius:10px;padding:8px 18px;font:inherit;cursor:pointer}\n/* 紙 */\n.sheet{background:#fff;border:1px solid #bbb;box-shadow:0 1px 4px rgba(0,0,0,.08);width:min(100%,186mm);margin:0 auto 16px;padding:10mm 10mm 12mm;font-size:13.5px}\n.sh-top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid var(--ink);padding-bottom:4px;margin-bottom:8px}\n.sh-top .t{font-weight:700;font-size:16px}.sh-top{gap:12px}.sh-top .f{font-size:12px;display:flex;gap:10px;white-space:nowrap;flex-shrink:0}\n.sh-top .f span{border-bottom:1px solid #666;min-width:60px;display:inline-block}\n.sec{margin:10px 0 4px;font-weight:700;display:flex;align-items:center;gap:6px}\n.pbox{border:1.5px solid var(--p);border-radius:6px;padding:6px 10px}\n.peek{float:right;font-size:12px;padding:3px 10px;border:1.5px solid var(--p);border-radius:999px;background:#fff;color:var(--p);font-weight:700;cursor:pointer}\n.peekov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:50;overflow:auto;padding:16px}\n.peekin{background:#fff;max-width:560px;margin:0 auto;border-radius:10px;padding:10px 12px}\n.peekin .pc{margin:8px 0}\n.peekh{position:sticky;top:-10px;background:#fff;padding:6px 0;border-bottom:1px solid #e9d5ff;z-index:1}\n.peekx{float:right;font-size:13px;padding:3px 12px;border-radius:999px;border:1px solid #999;background:#f5f5f5}\n.pbox table.pt{border-collapse:collapse;font-size:12px;width:100%;margin-top:4px}.pbox .pt td,.pbox .pt th{border:1px solid #d8b4fe;padding:3px 6px;vertical-align:top;text-align:left}.pbox .pt th{background:#f3e8ff}.pbox .hj{margin:2px 0}\n.qq{margin:6px 0 2px}.qq .n{font-weight:700;margin-right:4px}\n.blank{display:inline-block;border:1px solid #888;min-width:130px;height:26px;vertical-align:middle;margin:0 4px}\n.blank.w{min-width:220px}\n.row{margin:4px 0 4px 1.4em}\n.memo{border:1px dashed #aaa;height:22mm;margin:4px 0 6px 1.4em;color:#aaa;font-size:11px;padding:1px 6px}\n.memo.s{height:14mm}\n.ans{color:#c00;font-weight:700}.sheet .ans{color:#b91c1c;font-weight:700;border:1.5px solid #1a1a1a;border-radius:4px;padding:2px 6px;background:#fff;display:inline-block;line-height:1.5}.sheet .ans::before{content:'答え';font-size:10px;font-weight:700;color:#fff;background:#1a1a1a;border-radius:3px;padding:0 4px;margin-right:6px;vertical-align:2px}.sheet .pgrid .ans::before{content:none}.sheet .exp::before{content:'解説';display:inline-block;font-size:10px;font-weight:700;border:1px solid #1a1a1a;border-radius:3px;padding:0 4px;margin-bottom:2px}.sheet .tag{background:#fff!important;border:1.5px solid currentColor}.sheet .tag.W{color:var(--w)}.sheet .tag.T{color:var(--t)}.sheet .tag.E{color:var(--e)}\n.exp{font-size:12.5px;color:#333;margin:0 0 6px 1.4em;border-left:2px solid #ddd;padding-left:8px}\n@media print{.bar,.only-screen{display:none}:host{background:#fff}.sheet{box-shadow:none;border:0;padding:0}}\n@page{size:A4 portrait;margin:13mm 10mm 12mm}\n.dn{display:inline-block;border:1.6px solid currentColor;min-width:1.75em;padding:0 .3em;text-align:center;font-weight:700;line-height:1.4;margin-right:6px;border-radius:2px;font-style:normal}\n.sn{font-weight:700;margin-right:4px}\n.sqs{display:flex;flex-direction:column;gap:4px;margin:6px 0 2px}\n.sq{font-size:14.5px;border-left:3px solid #d1d5db;padding:2px 8px;color:#374151}\n.sq.cur{border-left:4px solid var(--ink);background:#fff;font-weight:700;color:var(--ink)}\n.sq.fut{color:#9ca3af}\n.sq .sa{font-weight:700;color:var(--ok);margin-left:6px}\n.sq .now{font-size:11px;font-weight:700;background:var(--ink);color:#fff;border-radius:4px;padding:0 5px;margin-left:6px;white-space:nowrap;display:inline-block}\n.gq{margin:8px 0 2px;font-weight:700}\n.dq>.qq{font-weight:400}\n.sqp{margin:5px 0 2px 1.4em}\n.ah{font-weight:700;margin:2px 0}\n.ah .st{font-weight:400;font-size:12px;color:#333}\n#selp{max-width:980px;margin:8px auto 0;padding:8px 16px;background:#fff;border:1px solid #ddd;border-radius:10px;font-size:13px}\n#selp table{border-collapse:collapse}#selp td{padding:2px 8px 2px 0;white-space:nowrap}\n#selp .sb button{font:inherit;font-size:13px;border:1px solid #bbb;background:#fff;border-radius:8px;padding:3px 10px;margin:4px 6px 0 0;cursor:pointer}\n#selp .sb button.pr{background:var(--ink);color:#fff;border-color:var(--ink)}\n.cut{display:none!important}\n.fgrow{display:flex;flex-wrap:wrap;gap:4mm;align-items:stretch;margin:4px 0 4px 1.4em;break-inside:avoid}\n.fgrow .grq{margin:0;flex:0 0 auto}\n.fgrow .memo.fm{flex:1 1 60mm;min-width:60mm;height:auto;min-height:32mm;margin:0}\n/* 紙のページを減らす（作り方の決まり F-21・2026-10-16 17:04 川上さん「やる」） */\n#v-q .qs{display:flex;flex-wrap:wrap;align-items:center;column-gap:10px}\n#v-q .qs>.sqp,#v-q .qs>.row{margin-top:2px;margin-bottom:2px}\n#v-a svg.gr{width:190px!important;height:auto!important}#v-a svg.gr-big{width:210px!important;height:auto!important}\n.memo.s{height:11mm}.fgrow .memo.fm{min-height:22mm}\n.opt6.c3{grid-template-columns:1fr 1fr 1fr}\n/* 紙の見出し（F-25）：紙の名前は四角の札でタイトルの横に大きく。配点と時間は別の行に名札つきで */\n.sh-top .t .tt{font-size:15px}.sh-top .tv{display:inline-block;min-width:1.4em;margin-left:6px;padding:0 .2em;background:#111;color:#fff;border-radius:4px;text-align:center;font-size:20px;line-height:1.3;font-weight:800;vertical-align:1px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.sh-top .kind{display:inline-block;border:2px solid var(--ink);border-radius:4px;padding:0 10px;margin-left:10px;font-size:17px;font-weight:800;letter-spacing:.1em;vertical-align:2px;line-height:1.5}.sh-top .tinfo{display:inline-block;white-space:nowrap;font-size:11.5px;font-weight:400;margin-left:12px}\n/* 答えを書く解答用紙（F-23） */\n.asheet{break-before:page}.asbody{display:flex;gap:6mm;align-items:center;margin:4px 0 10px}.qr{width:26mm;height:26mm;border:1.5px dashed #888;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;font-size:16px;text-align:center}.qr span{font-size:8px;font-weight:400;color:#666;padding:0 2px}.asnote{font-size:12px}\n.asrow{display:flex;align-items:flex-start;gap:4mm;margin:0 0 3mm;break-inside:avoid}.asn{flex:0 0 12mm;padding-top:2mm}.ascells{display:flex;flex-wrap:wrap;gap:2mm 4mm}.ascell{display:flex;align-items:center;gap:1.5mm}.ascell span{font-size:11px;font-weight:700;min-width:6mm}.ascell b{display:inline-block;width:16mm;height:11mm;border:1.2px solid #333}\n.tcalc .memo.tm{flex:1}\n.bk{font-size:11px;color:#333;margin:0 0 6px 1.4em}.bk::before{content:'↩ '}\n.passn{text-align:center;font-weight:700;margin:4px 0 8px}.redogo{display:block;width:100%;margin-top:8px}\n.redo{border:2px solid var(--ink);border-radius:10px;padding:8px 10px;margin:8px 0 10px}.redoh{font-weight:700;margin-bottom:4px}.redoi{font-size:13.5px;margin:8px 0 2px;line-height:1.6}.redor{display:flex;align-items:center;gap:8px;padding:4px 0;border-top:1px solid #eee;font-size:14px}.redor span:first-child{flex:1}.redon{color:var(--ng);font-weight:700;white-space:nowrap}.redob{border:1.5px solid var(--ink);border-radius:999px;padding:3px 10px;font:inherit;font-size:12px;font-weight:700;background:#fff;color:var(--ink);text-decoration:none;white-space:nowrap;cursor:pointer}\n.tsec{display:flex;gap:12px;justify-content:center;margin:4px 0 8px;font-size:15px}.tsec b{font-size:20px}\n.tsum{border-collapse:collapse;width:100%;font-size:13px;margin:4px 0 10px}.tsum td{border-bottom:1px solid #eee;padding:3px 4px}\n/* テストの紙の計算欄（F-22）：選択肢の下に、右に答え欄 */\n.tcalc{display:flex;align-items:flex-end;gap:6mm;margin:2px 0 6px 1.4em;break-inside:avoid}.tcalc .memo.tm{flex:1;height:24mm;margin:0}.tcalc .row{margin:0;white-space:nowrap}\n/* グラフを選ぶ選択肢（svg.gch）：3列。紙は 3.4cm 角 */\n.ch:has(svg.gch){grid-template-columns:repeat(3,minmax(0,1fr))}.ch button:has(svg.gch){padding:4px}.ch svg.gch{display:block;width:100%;max-width:150px;height:auto;margin:0 auto}.opt6:has(svg.gch){grid-template-columns:repeat(3,1fr);line-height:1.2;gap:8px 10px}.opt6 svg.gch{vertical-align:top;width:130px;height:130px}.ans svg.gch,.ta svg.gch{width:110px;height:110px;vertical-align:middle}.qq.dq,.fgrow{break-after:avoid}\n#v-q .qs>.sqp{min-width:62mm}\n@media print{#selp{display:none}}\n.qi,.pgrid .pc,.sec,.sh-top,.opt6,.pans{break-inside:avoid}\n.qi.qm{break-inside:auto}.qs{break-inside:avoid}.qq{break-after:avoid}\n.sec{break-after:avoid}\n.sheet+.sheet{break-before:page}\n#v-a .sheet .acol{column-count:2;column-gap:7mm;column-rule:1px solid #ddd}\n#v-a .acol .qi{break-inside:avoid;margin-bottom:6px}#v-a .acol .qi.qm{break-inside:auto}\n#v-a .acol .sec{column-span:none}\n#v-a .acol svg{max-width:100%;height:auto}\n#v-a .acol .exp{font-size:12px}\n#v-a .acol .eqg{grid-template-columns:max-content max-content minmax(4em,1fr)}\n.pans{font-size:12px;border:1.5px solid var(--p);border-radius:6px;padding:4px 8px;margin:4px 0 8px}\n.pans div{margin:1px 0}\n.qq.gh{font-weight:700;margin-top:8px;break-after:avoid}\n#v-a .acol .ah{break-after:avoid}\n\n/* ===== 2026-10-17 ③ 共通の部品 ===== */\n.R{background:#475569}.EP{background:#92400e}.Y{background:#0e7490}\n.pno{display:inline-block;font-size:11px;font-weight:700;color:#4b5563;background:#e5e7eb;border-radius:4px;padding:0 6px;margin-right:6px;vertical-align:1px}\n.pnb{display:inline-block;border:1.5px solid var(--ink);border-radius:2px;font-size:11px;font-weight:700;padding:0 4px;margin-right:6px;vertical-align:2px;line-height:1.4}\n.side .un{font-weight:800;font-size:15px;margin:0 0 4px}.side .pnm{font-weight:700}\n.bl.lock{background:#f3f4f6;border-color:#c5cad3;color:#9ca3af;cursor:default}\n.kc,.kl{background-image:linear-gradient(#caa24a,#caa24a);background-repeat:no-repeat;background-position:left 100%;background-size:0% 3px;transition:background-size .12s linear}.kl{padding-bottom:1px}.kc.on,.kl.on{background-size:100% 3px}\n.pr.keyf{outline:2.5px solid #caa24a;outline-offset:3px;border-radius:6px;animation:keyin .45s ease-out}@keyframes keyin{0%{outline-color:rgba(202,162,74,0);outline-offset:12px}100%{outline-color:#caa24a;outline-offset:3px}}\n.kk{border-bottom:3px solid transparent;transition:border-color .12s}.kk.on{border-bottom-color:#caa24a}\n.cdots{display:flex;gap:6px;margin:6px 0 8px}.cdots i{flex:1;height:5px;border-radius:3px;background:#e5e7eb}.cdots i.on{background:#caa24a}\n.ptitle{font-weight:700;margin:0 0 6px}\n.chunk .pick{margin:2px 0 8px 18px;padding:6px 8px;border-left:3px solid #6b21a8;background:#fff;border-radius:6px}\n.pt-ch.ng{border-color:var(--ng);background:#fee2e2;color:var(--ng)}\n.again{display:inline-block;border:1px solid #ccc;background:#fff;color:#555;border-radius:999px;padding:3px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;margin:2px 0 6px}\n.ck{border:2px solid #93c5fd;border-radius:12px;padding:10px 12px;background:#eff6ff;margin-top:6px}.ckh{font-size:11.5px;font-weight:800;color:#1d4ed8}.ckq{font-weight:700;margin:2px 0 6px}.ckback{margin-top:8px}\n.okbox{text-align:center;padding:12px 0}.okq{font-weight:800;font-size:17px;margin:6px 0 10px}.two{display:flex;gap:8px;justify-content:center}.next.sub{background:#fff;color:var(--ink);border:1px solid #bbb}\n.phone.ez{border:2px solid #0e7490;background:#f0fdfa}.ezlead{margin:6px 0}.ezfig{display:flex;justify-content:center;margin:6px 0}.ezfig.p{justify-content:flex-start;margin-left:1.4em}.ezfig.p svg{width:150px;height:auto}\n.ezsort{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;border-top:1px dashed #ccc}.ezsort .ab{display:flex;gap:6px}\n.sl{display:flex;align-items:center;gap:10px;margin:6px 0}.sl input{flex:1}.sl b{width:40px;text-align:right}.eqc{text-align:center;font-size:20px;margin:4px 0}\n.eztb{border-collapse:collapse;margin:4px 0 4px 1.4em;font-size:13px}.eztb td{border:1px solid #9ca3af;padding:2px 14px;text-align:center}.eztb td:first-child{text-align:left}.eztb td.ezans{outline:2px solid #b91c1c;outline-offset:-3px;border-radius:40%}\n.tlh{font-weight:700;margin:10px 0 4px}\n.trh{display:flex;align-items:center;gap:6px;width:100%;text-align:left;border:0;background:none;font:inherit;font-size:14px;cursor:pointer;padding:4px 0}\n.trm{font-weight:800;width:1.2em}.tr.x .trm{color:var(--ng)}.tr.o .trm{color:var(--ok)}\n.trq{flex:1;min-width:0;color:#333;font-size:13px}\n.must{font-size:11px;font-weight:800;border-radius:4px;padding:0 6px;background:var(--ng);color:#fff;white-space:nowrap}.must.seen{background:#e5e7eb;color:#555}\n.tro{font-size:12px;color:#555;white-space:nowrap}\n.trb{padding:4px 0 6px 1.6em}.trq2{font-size:13.5px;margin-bottom:4px}\n.redogo:disabled{background:#9ca3af;cursor:default}\n.tfix{border:1.5px solid var(--ng);color:var(--ng);border-radius:8px;padding:4px 10px;margin:6px 0;font-size:13.5px;font-weight:700}.tfix.done{border-color:var(--ok);color:var(--ok)}\n.tst{display:block;font-size:12px;font-weight:700;color:var(--ng);margin-top:2px}.tst.done{color:var(--ok)}\n.tstart{text-align:left}.tsn{font-size:22px;font-weight:800;margin:4px 0 0}.tsr{color:var(--sub);font-size:13px;margin-bottom:8px}\n.tsinfo{border-collapse:collapse;margin:6px 0 10px;font-size:14px}.tsinfo th{text-align:left;padding:3px 14px 3px 0;color:var(--sub);font-weight:700}.tsinfo td{padding:3px 0}\n.tsl{margin:0 0 12px;padding-left:1.3em;font-size:14px;line-height:1.8}.tsd{font-size:13px;margin:4px 0 6px;color:#92400e}.tsgo{width:100%;font-size:17px;padding:12px}\n.ttime{display:inline-block;font-weight:800;color:var(--ink);background:#f3f4f6;border-radius:6px;padding:0 8px}.ttime.over{color:#fff;background:var(--ng)}\n.tstrip{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0}.tstrip button{min-width:34px;border:1.5px solid #9ca3af;background:#fff;border-radius:4px;font:inherit;font-weight:700;font-size:13px;padding:2px 6px;cursor:pointer}\n.tstrip button.done{background:#374151;color:#fff;border-color:#374151}.tstrip button.part{background:#e5e7eb}.tstrip button.on{outline:3px solid #f59e0b;outline-offset:1px}.tstrip button.rv{margin-left:auto}\n.tsq{border-top:1px dashed #ddd;padding-top:4px;margin-top:6px}.ch button.sel{border-color:var(--ink);background:#111827;color:#fff}.ch button.sel .katex{color:#fff}\n.tnav{display:flex;gap:8px;justify-content:space-between;margin-top:6px}\n.tvh{font-weight:800;margin:6px 0}.tvu{margin-left:8px;color:var(--ng)}.tvok{margin-left:8px;color:var(--ok)}\n.tvl{display:flex;flex-direction:column}.tvr{display:flex;gap:8px;align-items:center;border:0;border-bottom:1px solid #eee;background:none;font:inherit;font-size:14px;text-align:left;padding:5px 2px;cursor:pointer}.tvr .tva{flex:1}.tvr.un .tva{color:var(--ng);font-weight:700}\n.tcf{border:2px solid var(--ng);border-radius:8px;padding:8px 10px;margin:8px 0;font-weight:700}.tover{text-align:center;color:var(--ng);font-weight:700;margin:-4px 0 6px}\n.tra{font-size:13px;color:#374151;margin:-2px 0 4px 2.6em}.tr.x .tra{color:#7f1d1d}.trsep{margin:0 8px;color:#9ca3af}.trfig{margin:4px 0}\n.tstep{border:1.5px solid #d1d5db;border-radius:10px;padding:8px 10px;margin:10px 0;background:#fff}.tsh{font-weight:800;font-size:15.5px;display:flex;align-items:center;gap:8px}.tsno{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--ink);color:#fff;font-size:13px}.tsc{margin-left:auto;font-size:12.5px;color:var(--sub);font-weight:700;white-space:nowrap}.tr .trh{flex-wrap:wrap;row-gap:2px}.tr .trq{order:9;flex:1 0 100%;padding-left:1.8em}.tr .must,.tr.o .tro{margin-left:auto}.tsd{font-size:13px;color:var(--sub);margin:2px 0 6px}\n.tnext{background:#f9fafb}.tnext .passn,.tnext .okm{text-align:left;font-size:14px;margin:4px 0}\n.trs .score{font-size:30px;margin:4px 0 2px}.trs .tdl{margin:0 0 4px}\n.tres .wd1{margin:6px 2px 8px}.tlead{font-size:13.5px;font-weight:700;color:#0a6cff;margin:2px 0 6px}\n.tcur{border:2px solid #0a6cff;box-shadow:0 2px 10px rgba(10,108,255,.10)}.tcur .tsno{background:#0a6cff}\n.tcur .tsgo,.tcur .redogo,.tcur .tagain{display:block;width:100%;margin-top:10px;padding:11px 18px;font-weight:700}\n.tcur .tsgo:disabled{background:#9ca3af;cursor:default}.tsneed{font-size:12.5px;color:var(--ng);text-align:center;margin-top:8px;font-weight:700}\n.tsback{border:0;background:none;color:var(--sub);font:inherit;font-size:13px;padding:6px 2px;cursor:pointer}\n.tmk{border:1.5px solid #333;border-radius:6px;overflow:hidden;margin:6px 0}.tmr{display:flex;border-top:1px solid #ccc}.tmr:first-child{border-top:0}\n.tmn{min-width:40px;display:flex;align-items:center;justify-content:center;border-right:1px solid #ccc;background:#f4f5f7}.tmc{display:flex;flex-wrap:wrap;gap:5px;padding:5px}\n.tmx{display:inline-flex;align-items:center;gap:3px;border:1px solid #bbb;border-radius:5px;padding:2px 6px;font-size:13px;background:#fff}.tmx b{font-size:17px}\n.tmx.o b{color:var(--ok)}.tmx.x{border-color:var(--ng);background:#fff5f3}.tmx.x b{color:var(--ng)}.tmx i{font-style:normal;color:var(--ng);font-weight:800;font-size:14px}\n.tnl{margin:4px 0}.tnr{display:flex;align-items:center;gap:6px;padding:5px 0;border-top:1px solid #eee;font-size:14px}.tnr .trq{flex:1;min-width:0}\n.tres{position:relative}.hanko{position:absolute;right:14px;top:44px;width:78px;height:78px;border:4px solid #d93025;border-radius:50%;color:#d93025;display:flex;align-items:center;justify-content:center;transform:rotate(-14deg);background:rgba(255,255,255,.6);pointer-events:none;z-index:2}\n.hanko span{font-size:24px;font-weight:900;letter-spacing:2px;border-top:2px solid #d93025;border-bottom:2px solid #d93025;padding:1px 4px;line-height:1.2}\n.hanko.pop{animation:hanko .55s cubic-bezier(.2,1.4,.5,1) .25s both}\n@keyframes hanko{0%{transform:rotate(-14deg) scale(2.6);opacity:0}60%{transform:rotate(-14deg) scale(.88);opacity:1}100%{transform:rotate(-14deg) scale(1);opacity:1}}\n.tdet.tok summary{display:list-item}\n.tdet{margin:8px 0;border-top:1px solid #e5e7eb;padding-top:6px}.tdet summary{cursor:pointer;font-weight:700;font-size:14px;color:#374151}\n.tra b{font-weight:800;color:var(--ink)}.trmy{margin-left:12px;font-size:12px;color:#9ca3af}\n.cdots i.now{background:#111827}\n/* 進み具合 D1＋EB（2026-10-19 作業4の5・生徒アプリの .d1 と同じ形）：要点 → 問題「今/全部」→ もう一度（黄）→ 旗。札＝今の形。右に「N連続」 */\n.wd1{display:flex;align-items:center;white-space:nowrap;min-height:22px;margin:9px 2px 2px}\n.wd1 .ws{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:800;color:#8a8f99;flex:none}\n.wd1 .wc{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.05);color:#8a8f99;flex:none}\n.wd1 .wc svg{width:12px;height:12px}\n.wd1 .ws.w-ok .wc{background:#1faa6b;color:#fff}.wd1 .ws.w-ok{color:#1faa6b}\n.wd1 .ws.w-now .wc{background:#e8f0ff;color:#0a6cff;box-shadow:0 0 0 2px #0a6cff;animation:wd1p 1.6s ease-in-out infinite}.wd1 .ws.w-now{color:#0a6cff}.wd1 .ws.w-now b{font-size:12.5px}\n@keyframes wd1p{0%,100%{box-shadow:0 0 0 2px #0a6cff}50%{box-shadow:0 0 0 5px rgba(10,108,255,.18)}}\n.wd1 .ws.w-fx .wc{background:#fff4dc;color:#e8a317;box-shadow:0 0 0 2px #e8a317}.wd1 .ws.w-fx{color:#e8a317}\n.wd1 .ws.w-gl .wc{background:rgba(202,162,74,.14);color:#caa24a}\n.wd1 .wl{flex:1;min-width:8px;height:2.5px;border-radius:2px;background:#dfe4ee;margin:0 4px}.wd1 .wl.lk{background:#1faa6b}\n.wd1 .wl.part{background:linear-gradient(90deg,#0a6cff var(--v),#dfe4ee 0)}.wd1 .wl.fxp{background:linear-gradient(90deg,#e8a317 var(--v),#dfe4ee 0)}\n.wd1-cmb{flex:none;margin-left:8px;font-size:11.5px;font-weight:800;color:#caa24a}.wd1-cmb:empty{display:none}\n.wd1-chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:800;color:#0a6cff;background:#e8f0ff;border-radius:999px;padding:2px 9px;margin:2px 0 6px}\n.wd1-chip.ez{color:#0f766e;background:#e6f6f3}\n.pprog{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:6px 0 8px;font-size:12px;color:#6b7280}\n.pg{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.pg b{font-weight:700}.pg.cur{color:#111827}.pg.cur b{font-weight:800}.pg.fin{color:#374151}\n.pgn{font-weight:800}.pgs{display:inline-flex;gap:3px}.pgs i{display:inline-block;width:14px;height:6px;border-radius:3px;background:#e5e7eb}.pgs i.on{background:#caa24a}.pgs i.now{background:#111827}.pgsep{color:#9ca3af}\n.side.ws{padding:0;overflow:hidden;border-left:4px solid #caa24a;align-self:start}\n.wsh{padding:10px 12px;border-bottom:1px solid #e5e7eb}.wst{font-weight:800;font-size:14px}.wss{font-size:12px;color:var(--sub);margin-top:3px;display:flex;gap:8px;align-items:center}.wsb{font-size:11.5px;font-weight:700;color:#374151;background:#f3f4f6;border-radius:4px;padding:0 6px}\n.wsbar{height:5px;background:#e5e7eb;border-radius:3px;margin-top:6px;overflow:hidden}.wsbar i{display:block;height:100%;background:#caa24a}\n.side .wsr{display:flex;align-items:center;gap:8px;width:100%;margin:0;border:0;border-bottom:1px solid #eef0f2;border-radius:0;padding:9px 12px;background:#fff;text-align:left}\n.side .wsr.on{box-shadow:inset 3px 0 0 #111827;background:#f9fafb}\n.wsm{flex:1;min-width:0;font-size:13.5px;line-height:1.45}.wsm b{font-weight:700}.wsu{display:block;font-size:11.5px;color:var(--sub)}\n.wsd{font-size:11px;color:var(--sub);white-space:nowrap;font-weight:700;display:inline-flex;align-items:center;gap:3px}.wsd svg{width:11px;height:11px}.wsd.ok{color:var(--ok)}.wsd.ok svg{width:13px;height:13px}\n.wsgo{display:inline-flex;align-items:center;gap:8px;flex:none}.wsar{width:30px;height:30px;border-radius:9px;background:#0a6cff;color:#fff;display:flex;align-items:center;justify-content:center;flex:none}.wsar svg{width:16px;height:16px}\n.side .wst2{background:#f1edff}.side .wst2.on{background:#e9e3ff}\n.wsc{border-bottom:6px solid #f3f4f6}.wsch{display:flex;align-items:center;gap:6px;padding:9px 12px 4px;font-size:13.5px}.wsch b{font-weight:800}.wsch .pno{white-space:nowrap;flex:none}.wscn{flex:none;margin-left:auto;font-size:11.5px;color:var(--sub);font-weight:700}\n.wsc .wsr{padding-left:20px}.wsc:first-of-type .wsr,.wsc .wst2{padding-left:12px}\n.wsrole{font-size:12.5px;color:#374151;background:#f9fafb;border-left:3px solid #caa24a;padding:4px 8px;margin:0 0 8px}\n.wsx{font-size:11px;color:var(--sub);flex-basis:100%;margin-top:-2px}.wss{flex-wrap:wrap}.wsb{white-space:nowrap}\n.wsnote{margin:4px 0 0;padding-left:1.2em;font-size:12.5px;color:#111827;font-weight:700}\n\n.tdl{text-align:center;margin:2px 0 8px}.tdp{display:inline-block;font-weight:800;font-size:14px;padding:5px 13px;border-radius:20px}\n.tdp.up{background:rgba(31,170,107,.15);color:#15803d}.tdp.dn{background:rgba(224,83,60,.13);color:#b91c1c}.tdp.same{background:#eef1f5;color:#555}\n.pplead{font-size:14px;margin:6px 0 10px;line-height:1.6}.pplead span{font-size:12px;color:#555}\n.pck{display:flex;flex-direction:column;border:1.5px solid #333;border-radius:6px;overflow:hidden;margin-bottom:8px;background:#fff}\n.pcr{display:flex;align-items:stretch;border-top:1px solid #bbb}.pcr:first-child{border-top:0}.pcn{min-width:44px;display:flex;align-items:center;justify-content:center;border-right:1px solid #bbb;background:#f4f5f7}\n.pcc{display:flex;flex-wrap:wrap;gap:6px;padding:6px}\n.pcx{display:inline-flex;align-items:center;gap:4px;border:1.5px solid #999;border-radius:5px;padding:3px 7px;min-width:62px;background:#fff;font-size:13px;cursor:pointer;user-select:none;scroll-margin:12px 0 210px}\n.pcx b{font-size:19px;min-width:1.2em;text-align:center}.pcx.un{border-color:#e0a800;background:#fff7e0}\n.pcx.cur{border-color:#0b6bff;box-shadow:0 0 0 3px rgba(11,107,255,.35);background:#eef5ff}\n.ppaper{padding-bottom:0}.ppad{position:sticky;bottom:0;z-index:3;background:#fff;border-top:1px solid #ccc;margin:10px -14px 0;padding:10px 12px 14px;box-shadow:0 -4px 10px rgba(0,0,0,.06)}\n.pph{font-size:12.5px;color:#555;margin-bottom:6px;text-align:center}.pph b{color:#0b6bff;font-size:14px}\n.ppk{display:grid;gap:6px}.ppk button{height:52px;border:1px solid #999;border-radius:10px;background:#fff;font:inherit;font-size:21px;font-weight:700;cursor:pointer}.ppk button:active{background:#ddd}\n.ppad .ppgo{display:block;width:100%;margin-top:8px}.pcx.miss{animation:pcxM .5s ease 2}@keyframes pcxM{0%,100%{transform:none}50%{transform:translateY(-3px)}}\n.wsd.rdy-go{background:var(--accent,#2f6fed);color:#fff;border-radius:12px;padding:3px 10px;font-weight:800}\n.wsd.rdy-can{background:transparent;color:var(--accent,#2f6fed);border:1px solid var(--accent,#2f6fed);border-radius:12px;padding:2px 9px;font-weight:800}\n.wsd.rdy-late{background:transparent;border:1px dashed #c3ccd8;border-radius:12px;padding:2px 9px}\n.wsbody.dk{background:#15171c;min-height:100%}.wsbody.dk .app{filter:invert(.92) hue-rotate(180deg)}\n.wsbody.dk .app svg.gr,.wsbody.dk .app table,.wsbody.dk .app img{background:#fff;filter:invert(1) hue-rotate(180deg)}\n.phw{min-width:0}.wsbk{display:none}\n@media(max-width:760px){.app.live.ml .phw{display:none}.app.live.mq .side{display:none}.app.live.mq .wsbk{display:block;margin:0 0 8px}\n .wsbkb{border:1px solid #ccc;background:#fff;border-radius:8px;padding:8px 12px;font:inherit;font-size:14px;cursor:pointer}}\n";
var WS_BODY="\n<div id=\"selp\" hidden></div><div id=\"v-app\"></div><div id=\"v-q\" hidden></div><div id=\"v-a\" hidden></div>\n";
window.WS_PAPER_CSS=".wsp{font-size:16px}.wsp *{margin:revert;padding:revert}.wsp table,.wsp thead,.wsp tbody,.wsp tr,.wsp th,.wsp td{all:revert}.wsp{--ink:#1a1a1a;--sub:#555;--w:#2563eb;--t:#0f766e;--e:#b45309;--p:#6b21a8;--bg:#f4f5f7;--ok:#15803d;--ng:#b91c1c}.wsp *{box-sizing:border-box}.wsp{margin:0;background:var(--bg);color:var(--ink);font-family:\"Noto Sans JP\",\"Yu Gothic\",sans-serif;line-height:1.7}.wsp .bar{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #ddd;padding:8px 16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}.wsp .bar b{margin-right:8px}.wsp .bar button{border:1px solid #bbb;background:#fff;border-radius:8px;padding:6px 12px;font:inherit;font-size:14px;cursor:pointer}.wsp .bar button.on{background:var(--ink);color:#fff;border-color:var(--ink)}.wsp main{max-width:980px;margin:0 auto;padding:16px 16px 60px}.wsp .note{color:var(--sub);font-size:13px}.wsp .emb .note,.wsp .emb .bar>b{display:none}.wsp .emb .bar{padding:6px 10px}.wsp .emb main{padding:8px 10px 60px;max-width:none}.wsp .tag{display:inline-block;border-radius:6px;padding:0 8px;font-weight:700;font-size:12px;color:#fff;vertical-align:middle}.wsp .P{background:var(--p)}.wsp .W{background:var(--w)}.wsp .T{background:var(--t)}.wsp .E{background:var(--e)}.wsp .app{display:grid;grid-template-columns:300px 1fr;gap:16px}@media(max-width:760px){.wsp .app{grid-template-columns:1fr}}.wsp .side{background:#fff;border:1px solid #ddd;border-radius:10px;padding:10px}.wsp .side .u{font-size:12px;color:var(--sub)}.wsp .side .pt{font-weight:700;margin:4px 0 8px}.wsp .side button{display:block;width:100%;text-align:left;border:1px solid #ddd;background:#fff;border-radius:8px;padding:6px 8px;margin:4px 0;font:inherit;font-size:14px;cursor:pointer}.wsp .side button.on{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}.wsp .phone{background:#fff;border:1px solid #ddd;border-radius:14px;padding:16px;max-width:520px}.wsp .phone.wu{border:2px solid var(--w);background:#f5f9ff}.wsp .pcard{border:2px solid var(--p);border-radius:10px;padding:10px 14px;background:#faf5ff;margin-bottom:12px}.wsp .pcard h3{margin:0 0 4px;font-size:15px;color:var(--p)}.wsp .pcard table{border-collapse:collapse;width:100%;font-size:14px}.wsp .pcard td{border-bottom:1px solid #e9d5ff;padding:3px 4px}.wsp .pc{border:2px solid var(--p);border-radius:10px;padding:10px 14px;background:#faf5ff;margin-bottom:10px}.wsp .pch{font-weight:700;color:var(--p);margin-bottom:4px}.wsp .pcw{font-weight:700;margin-bottom:6px}.wsp .pcl{margin:2px 0}.wsp .pcn,.wsp .pcx{background:#fff;border-radius:8px;padding:6px 10px;margin:4px 0;font-size:14.5px}.wsp .lb{display:inline-block;font-size:11px;font-weight:700;border-radius:4px;padding:0 6px;margin-right:8px;background:#e9d5ff;color:#4c1d95}.wsp .lb.x{background:#4c1d95;color:#fff}.wsp .hj{display:flex;gap:12px;align-items:center;margin:6px 0;font-size:13.5px}.wsp .hj svg{flex-shrink:0}.wsp .pr{display:flex;gap:8px;align-items:flex-start;background:#fff;border-radius:8px;padding:6px 10px;margin:5px 0;font-size:15px}.wsp .pr .lb{margin-top:3px;flex-shrink:0;min-width:72px;text-align:center}.wsp .pr .pt{line-height:2;flex:1;min-width:0}.wsp .pr.stk{flex-direction:column;gap:2px}.wsp .pr.stk .lb{min-width:0;align-self:flex-start}.wsp .pr.stk>.pt{flex:none;width:100%}.wsp .sm{font-size:12.5px;color:var(--sub)}.wsp .bl{position:relative;display:inline-block;text-align:center;min-width:52px;padding:0 8px;margin:0 2px;border-radius:7px;background:#ede9fe;border:1.5px dashed #6b21a8;color:#6b21a8;font-weight:800;cursor:pointer;line-height:1.6}.wsp .bl.open{background:#6b21a8;color:#fff;border-style:solid}.wsp .bl.fill{min-width:0;padding:0 4px;background:none;border:0;border-bottom:2px solid #c4b5fd;border-radius:0;color:var(--ink);cursor:default}.wsp .bl.fill.miss{border-bottom-color:#f59e0b}.wsp .pt-fb{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#15803d;color:#fff;font-size:12px;border-radius:6px;padding:0 6px;white-space:nowrap;margin-bottom:4px}.wsp .pt-fb.miss{background:#f59e0b}.wsp .pt-left{font-size:13px;color:var(--sub);text-align:right;min-height:18px}.wsp .pt-pick{margin-top:6px;padding-top:10px;border-top:1px solid #ddd}.wsp .pt-chs{display:flex;flex-wrap:wrap;gap:8px}.wsp .pt-ch{background:#fff;border:1.5px solid #ccc;border-radius:12px;padding:8px 16px;font:inherit;font-size:16px;font-weight:700;cursor:pointer;min-height:44px}.wsp .pt-ch.dim{opacity:.3}.wsp .pt-ch.hit{border-color:#15803d;background:#dcfce7;color:#15803d}.wsp .next:disabled{background:#bbb;cursor:default}.wsp .pbl{display:inline-block;border:1px solid #888;min-width:60px;text-align:left;font-size:10px;color:#888;padding:0 3px;height:24px;vertical-align:middle;margin:0 2px}.wsp .pgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px}.wsp .pgrid .pc,.wsp .pgrid .pr,.wsp .pgrid .pt{min-width:0}.wsp .pgrid svg{max-width:100%;height:auto}.wsp .pgrid .pc:has(table.cv){grid-column:1/-1}.wsp.vq .pgrid{display:block;column-count:2;column-gap:6px}.wsp.vq .pgrid .pc{break-inside:avoid;display:block;margin:0 0 6px}.wsp.vq .pgrid .pc:has(table.cv),.wsp.vq .pgrid .pc.wide{column-span:all}.wsp.vq .pgrid .eqg,.wsp.va .pgrid .eqg{grid-template-columns:max-content max-content minmax(5em,1fr)}.wsp.vq .pgrid .eqg .eqn,.wsp.va .pgrid .eqg .eqn{font-size:10px;padding-left:4px}.wsp .pgrid .pc{margin:0;padding:6px 8px}.wsp .pgrid .pr{font-size:12px;padding:2px 4px;margin:2px 0}.wsp .pgrid .pr .lb{min-width:56px;font-size:10px}.wsp .pgrid .pr .pt{line-height:1.8}.wsp .pgrid .hj svg{width:64px;height:auto}.wsp .pgrid .hj{font-size:10.5px;gap:6px}.wsp .pgrid .pch{font-size:12.5px;margin:0}.wsp .dv{margin:4px 0}.wsp .dv .we{font-size:16px;font-weight:700;color:var(--ink);margin:4px 0 6px}.wsp .dv .wn{margin:2px 0 2px 1.2em;padding:0;font-size:13px;color:#444;font-weight:400}.wsp .dv .wt{font-size:13px;color:#444;margin:6px 0 2px;font-weight:400}.wsp .sheet .dv .we{font-size:13.5px}.wsp .sheet .dv .wn{font-size:12px}.wsp .tb{border-collapse:collapse;margin:4px 0;font-size:15px}.wsp .tb th,.wsp .tb td{border:1px solid #9ca3af;padding:2px 10px;text-align:center;min-width:44px;background:#fff}.wsp .tb th{background:#f3f4f6}.wsp .pgrid .tb{font-size:11.5px}.wsp .pgrid .tb th,.wsp .pgrid .tb td{padding:0 4px;min-width:26px}.wsp .side .pt2{font-weight:700;font-size:13px;margin:10px 0 2px}.wsp .side .prow{display:flex;flex-direction:column}.wsp .tag.X{background:#374151}.wsp .fillbox{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:8px 10px}.wsp .blank.s{min-width:60px}.wsp .opts{font-size:13px}.wsp .opt6{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;line-height:2;margin:2px 0 2px 1.4em;font-size:13px}.wsp .score{font-size:40px;font-weight:800;text-align:center;margin:10px 0}.wsp .score span{font-size:18px;color:var(--sub)}.wsp .tr{border-top:1px solid #eee;padding:6px 0;font-size:14px}.wsp .tr.x{background:#fff7ed}.wsp .ta{font-size:13px;color:#444;margin:2px 0}.wsp .tba td{min-width:22px;padding:2px 4px}.wsp .tba tr.yn td,.wsp .tba tr.xn td{border:0;background:none;font-size:13px;color:#c2410c;font-weight:700;padding:0}.wsp .tba tr.xn td{color:#2563eb}.wsp .tba tr.yn th,.wsp .tba tr.xn th{border:0;background:none}.wsp .wtb{margin:4px 0;overflow-x:auto}.wsp .calc{display:inline-block;font-size:13px;font-weight:700;border:1.5px solid #374151;border-radius:6px;padding:1px 8px;margin:0 0 8px}.wsp #pv-bar{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;align-items:center;gap:8px;padding:8px 12px;background:#1f2937;color:#fff;font-size:13px;font-weight:700;flex-wrap:wrap}.wsp #pv-bar button{font:inherit;border:0;border-radius:8px;padding:6px 11px;background:#374151;color:#fff;cursor:pointer}.wsp #pv-bar #pv-pos{min-width:200px;text-align:center}.wsp #pv-bar label{display:inline-flex;align-items:center;gap:4px}.wsp #pv-bar .pvn{margin-left:auto;color:#cbd5e1;font-weight:500}.wsp{padding-bottom:56px}.wsp .eqg{display:grid;grid-template-columns:max-content max-content minmax(5em,1fr);column-gap:2px;row-gap:4px;align-items:baseline;margin:4px 0}.wsp .eqg .eql{text-align:right}.wsp .eqg .eqr{text-align:left}.wsp .eqg .eqn{font-size:12px;color:#555;padding-left:12px;line-height:1.4}.wsp .eqg .eqn:not(:empty)::before{content:'… ';color:#999}.wsp.vq .eqg,.wsp.va .eqg{grid-template-columns:max-content max-content minmax(7em,1fr)}.wsp.vq .eqg .eqn,.wsp.va .eqg .eqn{font-size:10.5px;padding-left:6px}.wsp .gr{display:block;margin:4px 0;max-width:100%}.wsp .g2{display:flex;gap:10px;flex-wrap:wrap}.wsp .gc{font-size:13px;text-align:center}.wsp .tb.inc{display:inline-table;margin:2px 6px 2px 0;font-size:13px;vertical-align:middle}.wsp .tb.inc td,.wsp .tb.inc th{min-width:40px;padding:1px 8px}.wsp .grq{margin:6px 0}.wsp .pgrid .gr{width:150px;height:150px}.wsp .gzoom{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:99}.wsp .gzoom svg{width:min(92vw,92vh);height:min(92vw,92vh);background:#fff;border-radius:10px}.wsp #ph svg.gr{cursor:zoom-in}.wsp.va svg.gr-big,.wsp.vq svg.gr-big{width:300px;height:300px}.wsp .pdots{font-size:12px;color:var(--sub);margin:4px 0 8px}.wsp .fb .okm{color:var(--ok);font-weight:700}.wsp .fb .dv{color:var(--ink)}.wsp .q{background:#fff8e1;border:1px solid #f0d58a;border-radius:8px;padding:10px 14px;margin:8px 0}.wsp .prog{font-size:12px;color:var(--sub)}.wsp .stepq{font-weight:700;margin:10px 0 6px}.wsp .ch{display:grid;grid-template-columns:1fr 1fr;gap:8px}.wsp .ch.long{grid-template-columns:1fr}.wsp .ch button{border:1px solid #bbb;background:#fff;border-radius:10px;padding:10px;font:inherit;font-size:16px;cursor:pointer;min-height:48px}.wsp .ch button.ok{border-color:var(--ok);background:#dcfce7}.wsp .ch button.ng{border-color:var(--ng);background:#fee2e2}.wsp .fb{margin-top:8px;font-size:14px;min-height:24px}.wsp .fb.ok{color:var(--ok);font-weight:700}.wsp .fb.ng{color:var(--ng)}.wsp .done{display:flex;flex-direction:column;gap:6px;margin-top:6px}.wsp .done div{font-size:14px;border-left:3px solid #ccc;padding-left:8px}.wsp .next{margin-top:10px;border:0;background:var(--ink);color:#fff;border-radius:10px;padding:8px 18px;font:inherit;cursor:pointer}.wsp .sheet{background:#fff;border:1px solid #bbb;box-shadow:0 1px 4px rgba(0,0,0,.08);width:min(100%,186mm);margin:0 auto 16px;padding:10mm 10mm 12mm;font-size:13.5px}.wsp .sh-top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid var(--ink);padding-bottom:4px;margin-bottom:8px}.wsp .sh-top .t{font-weight:700;font-size:16px}.wsp .sh-top{gap:12px}.wsp .sh-top .f{font-size:12px;display:flex;gap:10px;white-space:nowrap;flex-shrink:0}.wsp .sh-top .f span{border-bottom:1px solid #666;min-width:60px;display:inline-block}.wsp .sec{margin:10px 0 4px;font-weight:700;display:flex;align-items:center;gap:6px}.wsp .pbox{border:1.5px solid var(--p);border-radius:6px;padding:6px 10px}.wsp .peek{float:right;font-size:12px;padding:3px 10px;border:1.5px solid var(--p);border-radius:999px;background:#fff;color:var(--p);font-weight:700;cursor:pointer}.wsp .peekov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:50;overflow:auto;padding:16px}.wsp .peekin{background:#fff;max-width:560px;margin:0 auto;border-radius:10px;padding:10px 12px}.wsp .peekin .pc{margin:8px 0}.wsp .peekh{position:sticky;top:-10px;background:#fff;padding:6px 0;border-bottom:1px solid #e9d5ff;z-index:1}.wsp .peekx{float:right;font-size:13px;padding:3px 12px;border-radius:999px;border:1px solid #999;background:#f5f5f5}.wsp .pbox table.pt{border-collapse:collapse;font-size:12px;width:100%;margin-top:4px}.wsp .pbox .pt td,.wsp .pbox .pt th{border:1px solid #d8b4fe;padding:3px 6px;vertical-align:top;text-align:left}.wsp .pbox .pt th{background:#f3e8ff}.wsp .pbox .hj{margin:2px 0}.wsp .qq{margin:6px 0 2px}.wsp .qq .n{font-weight:700;margin-right:4px}.wsp .blank{display:inline-block;border:1px solid #888;min-width:130px;height:26px;vertical-align:middle;margin:0 4px}.wsp .blank.w{min-width:220px}.wsp .row{margin:4px 0 4px 1.4em}.wsp .memo{border:1px dashed #aaa;height:22mm;margin:4px 0 6px 1.4em;color:#aaa;font-size:11px;padding:1px 6px}.wsp .memo.s{height:14mm}.wsp .ans{color:#c00;font-weight:700}.wsp .sheet .ans{color:#b91c1c;font-weight:700;border:1.5px solid #1a1a1a;border-radius:4px;padding:2px 6px;background:#fff;display:inline-block;line-height:1.5}.wsp .sheet .ans::before{content:'答え';font-size:10px;font-weight:700;color:#fff;background:#1a1a1a;border-radius:3px;padding:0 4px;margin-right:6px;vertical-align:2px}.wsp .sheet .pgrid .ans::before{content:none}.wsp .sheet .exp::before{content:'解説';display:inline-block;font-size:10px;font-weight:700;border:1px solid #1a1a1a;border-radius:3px;padding:0 4px;margin-bottom:2px}.wsp .sheet .tag{background:#fff!important;border:1.5px solid currentColor}.wsp .sheet .tag.W{color:var(--w)}.wsp .sheet .tag.T{color:var(--t)}.wsp .sheet .tag.E{color:var(--e)}.wsp .exp{font-size:12.5px;color:#333;margin:0 0 6px 1.4em;border-left:2px solid #ddd;padding-left:8px}.wsp .dn{display:inline-block;border:1.6px solid currentColor;min-width:1.75em;padding:0 .3em;text-align:center;font-weight:700;line-height:1.4;margin-right:6px;border-radius:2px;font-style:normal}.wsp .sn{font-weight:700;margin-right:4px}.wsp .sqs{display:flex;flex-direction:column;gap:4px;margin:6px 0 2px}.wsp .sq{font-size:14.5px;border-left:3px solid #d1d5db;padding:2px 8px;color:#374151}.wsp .sq.cur{border-left:4px solid var(--ink);background:#fff;font-weight:700;color:var(--ink)}.wsp .sq.fut{color:#9ca3af}.wsp .sq .sa{font-weight:700;color:var(--ok);margin-left:6px}.wsp .sq .now{font-size:11px;font-weight:700;background:var(--ink);color:#fff;border-radius:4px;padding:0 5px;margin-left:6px;white-space:nowrap;display:inline-block}.wsp .gq{margin:8px 0 2px;font-weight:700}.wsp .dq>.qq{font-weight:400}.wsp .sqp{margin:5px 0 2px 1.4em}.wsp .ah{font-weight:700;margin:2px 0}.wsp .ah .st{font-weight:400;font-size:12px;color:#333}.wsp #selp{max-width:980px;margin:8px auto 0;padding:8px 16px;background:#fff;border:1px solid #ddd;border-radius:10px;font-size:13px}.wsp #selp table{border-collapse:collapse}.wsp #selp td{padding:2px 8px 2px 0;white-space:nowrap}.wsp #selp .sb button{font:inherit;font-size:13px;border:1px solid #bbb;background:#fff;border-radius:8px;padding:3px 10px;margin:4px 6px 0 0;cursor:pointer}.wsp #selp .sb button.pr{background:var(--ink);color:#fff;border-color:var(--ink)}.wsp .cut{display:none!important}.wsp .fgrow{display:flex;flex-wrap:wrap;gap:4mm;align-items:stretch;margin:4px 0 4px 1.4em;break-inside:avoid}.wsp .fgrow .grq{margin:0;flex:0 0 auto}.wsp .fgrow .memo.fm{flex:1 1 60mm;min-width:60mm;height:auto;min-height:32mm;margin:0}.wsp.vq .qs{display:flex;flex-wrap:wrap;align-items:center;column-gap:10px}.wsp.vq .qs>.sqp,.wsp.vq .qs>.row{margin-top:2px;margin-bottom:2px}.wsp.va svg.gr{width:190px!important;height:auto!important}.wsp.va svg.gr-big{width:210px!important;height:auto!important}.wsp .memo.s{height:11mm}.wsp .fgrow .memo.fm{min-height:22mm}.wsp .opt6.c3{grid-template-columns:1fr 1fr 1fr}.wsp .sh-top .t .tt{font-size:15px}.wsp .sh-top .tv{display:inline-block;min-width:1.4em;margin-left:6px;padding:0 .2em;background:#111;color:#fff;border-radius:4px;text-align:center;font-size:20px;line-height:1.3;font-weight:800;vertical-align:1px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.wsp .sh-top .kind{display:inline-block;border:2px solid var(--ink);border-radius:4px;padding:0 10px;margin-left:10px;font-size:17px;font-weight:800;letter-spacing:.1em;vertical-align:2px;line-height:1.5}.wsp .sh-top .tinfo{display:inline-block;white-space:nowrap;font-size:11.5px;font-weight:400;margin-left:12px}.wsp .asheet{break-before:page}.wsp .asbody{display:flex;gap:6mm;align-items:center;margin:4px 0 10px}.wsp .qr{width:26mm;height:26mm;border:1.5px dashed #888;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;font-size:16px;text-align:center}.wsp .qr span{font-size:8px;font-weight:400;color:#666;padding:0 2px}.wsp .asnote{font-size:12px}.wsp .asrow{display:flex;align-items:flex-start;gap:4mm;margin:0 0 3mm;break-inside:avoid}.wsp .asn{flex:0 0 12mm;padding-top:2mm}.wsp .ascells{display:flex;flex-wrap:wrap;gap:2mm 4mm}.wsp .ascell{display:flex;align-items:center;gap:1.5mm}.wsp .ascell span{font-size:11px;font-weight:700;min-width:6mm}.wsp .ascell b{display:inline-block;width:16mm;height:11mm;border:1.2px solid #333}.wsp .tcalc .memo.tm{flex:1}.wsp .bk{font-size:11px;color:#333;margin:0 0 6px 1.4em}.wsp .bk::before{content:'↩ '}.wsp .passn{text-align:center;font-weight:700;margin:4px 0 8px}.wsp .redogo{display:block;width:100%;margin-top:8px}.wsp .redo{border:2px solid var(--ink);border-radius:10px;padding:8px 10px;margin:8px 0 10px}.wsp .redoh{font-weight:700;margin-bottom:4px}.wsp .redoi{font-size:13.5px;margin:8px 0 2px;line-height:1.6}.wsp .redor{display:flex;align-items:center;gap:8px;padding:4px 0;border-top:1px solid #eee;font-size:14px}.wsp .redor span:first-child{flex:1}.wsp .redon{color:var(--ng);font-weight:700;white-space:nowrap}.wsp .redob{border:1.5px solid var(--ink);border-radius:999px;padding:3px 10px;font:inherit;font-size:12px;font-weight:700;background:#fff;color:var(--ink);text-decoration:none;white-space:nowrap;cursor:pointer}.wsp .tsec{display:flex;gap:12px;justify-content:center;margin:4px 0 8px;font-size:15px}.wsp .tsec b{font-size:20px}.wsp .tsum{border-collapse:collapse;width:100%;font-size:13px;margin:4px 0 10px}.wsp .tsum td{border-bottom:1px solid #eee;padding:3px 4px}.wsp .tcalc{display:flex;align-items:flex-end;gap:6mm;margin:2px 0 6px 1.4em;break-inside:avoid}.wsp .tcalc .memo.tm{flex:1;height:24mm;margin:0}.wsp .tcalc .row{margin:0;white-space:nowrap}.wsp .ch:has(svg.gch){grid-template-columns:repeat(3,minmax(0,1fr))}.wsp .ch button:has(svg.gch){padding:4px}.wsp .ch svg.gch{display:block;width:100%;max-width:150px;height:auto;margin:0 auto}.wsp .opt6:has(svg.gch){grid-template-columns:repeat(3,1fr);line-height:1.2;gap:8px 10px}.wsp .opt6 svg.gch{vertical-align:top;width:130px;height:130px}.wsp .ans svg.gch,.wsp .ta svg.gch{width:110px;height:110px;vertical-align:middle}.wsp .qq.dq,.wsp .fgrow{break-after:avoid}.wsp.vq .qs>.sqp{min-width:62mm}.wsp .qi,.wsp .pgrid .pc,.wsp .sec,.wsp .sh-top,.wsp .opt6,.wsp .pans{break-inside:avoid}.wsp .qi.qm{break-inside:auto}.wsp .qs{break-inside:avoid}.wsp .qq{break-after:avoid}.wsp .sec{break-after:avoid}.wsp .sheet+.sheet{break-before:page}.wsp.va .sheet .acol{column-count:2;column-gap:7mm;column-rule:1px solid #ddd}.wsp.va .acol .qi{break-inside:avoid;margin-bottom:6px}.wsp.va .acol .qi.qm{break-inside:auto}.wsp.va .acol .sec{column-span:none}.wsp.va .acol svg{max-width:100%;height:auto}.wsp.va .acol .exp{font-size:12px}.wsp.va .acol .eqg{grid-template-columns:max-content max-content minmax(4em,1fr)}.wsp .pans{font-size:12px;border:1.5px solid var(--p);border-radius:6px;padding:4px 8px;margin:4px 0 8px}.wsp .pans div{margin:1px 0}.wsp .qq.gh{font-weight:700;margin-top:8px;break-after:avoid}.wsp.va .acol .ah{break-after:avoid}.wsp .R{background:#475569}.wsp .EP{background:#92400e}.wsp .Y{background:#0e7490}.wsp .pno{display:inline-block;font-size:11px;font-weight:700;color:#4b5563;background:#e5e7eb;border-radius:4px;padding:0 6px;margin-right:6px;vertical-align:1px}.wsp .pnb{display:inline-block;border:1.5px solid var(--ink);border-radius:2px;font-size:11px;font-weight:700;padding:0 4px;margin-right:6px;vertical-align:2px;line-height:1.4}.wsp .side .un{font-weight:800;font-size:15px;margin:0 0 4px}.wsp .side .pnm{font-weight:700}.wsp .bl.lock{background:#f3f4f6;border-color:#c5cad3;color:#9ca3af;cursor:default}.wsp .kc,.wsp .kl{background-image:linear-gradient(#caa24a,#caa24a);background-repeat:no-repeat;background-position:left 100%;background-size:0% 3px;transition:background-size .12s linear}.wsp .kl{padding-bottom:1px}.wsp .kc.on,.wsp .kl.on{background-size:100% 3px}.wsp .pr.keyf{outline:2.5px solid #caa24a;outline-offset:3px;border-radius:6px;animation:keyin .45s ease-out}.wsp .kk{border-bottom:3px solid transparent;transition:border-color .12s}.wsp .kk.on{border-bottom-color:#caa24a}.wsp .cdots{display:flex;gap:6px;margin:6px 0 8px}.wsp .cdots i{flex:1;height:5px;border-radius:3px;background:#e5e7eb}.wsp .cdots i.on{background:#caa24a}.wsp .ptitle{font-weight:700;margin:0 0 6px}.wsp .chunk .pick{margin:2px 0 8px 18px;padding:6px 8px;border-left:3px solid #6b21a8;background:#fff;border-radius:6px}.wsp .pt-ch.ng{border-color:var(--ng);background:#fee2e2;color:var(--ng)}.wsp .again{display:inline-block;border:1px solid #ccc;background:#fff;color:#555;border-radius:999px;padding:3px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;margin:2px 0 6px}.wsp .ck{border:2px solid #93c5fd;border-radius:12px;padding:10px 12px;background:#eff6ff;margin-top:6px}.wsp .ckh{font-size:11.5px;font-weight:800;color:#1d4ed8}.wsp .ckq{font-weight:700;margin:2px 0 6px}.wsp .ckback{margin-top:8px}.wsp .okbox{text-align:center;padding:12px 0}.wsp .okq{font-weight:800;font-size:17px;margin:6px 0 10px}.wsp .two{display:flex;gap:8px;justify-content:center}.wsp .next.sub{background:#fff;color:var(--ink);border:1px solid #bbb}.wsp .phone.ez{border:2px solid #0e7490;background:#f0fdfa}.wsp .ezlead{margin:6px 0}.wsp .ezfig{display:flex;justify-content:center;margin:6px 0}.wsp .ezfig.p{justify-content:flex-start;margin-left:1.4em}.wsp .ezfig.p svg{width:150px;height:auto}.wsp .ezsort{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;border-top:1px dashed #ccc}.wsp .ezsort .ab{display:flex;gap:6px}.wsp .sl{display:flex;align-items:center;gap:10px;margin:6px 0}.wsp .sl input{flex:1}.wsp .sl b{width:40px;text-align:right}.wsp .eqc{text-align:center;font-size:20px;margin:4px 0}.wsp .eztb{border-collapse:collapse;margin:4px 0 4px 1.4em;font-size:13px}.wsp .eztb td{border:1px solid #9ca3af;padding:2px 14px;text-align:center}.wsp .eztb td:first-child{text-align:left}.wsp .eztb td.ezans{outline:2px solid #b91c1c;outline-offset:-3px;border-radius:40%}.wsp .tlh{font-weight:700;margin:10px 0 4px}.wsp .trh{display:flex;align-items:center;gap:6px;width:100%;text-align:left;border:0;background:none;font:inherit;font-size:14px;cursor:pointer;padding:4px 0}.wsp .trm{font-weight:800;width:1.2em}.wsp .tr.x .trm{color:var(--ng)}.wsp .tr.o .trm{color:var(--ok)}.wsp .trq{flex:1;min-width:0;color:#333;font-size:13px}.wsp .must{font-size:11px;font-weight:800;border-radius:4px;padding:0 6px;background:var(--ng);color:#fff;white-space:nowrap}.wsp .must.seen{background:#e5e7eb;color:#555}.wsp .tro{font-size:12px;color:#555;white-space:nowrap}.wsp .trb{padding:4px 0 6px 1.6em}.wsp .trq2{font-size:13.5px;margin-bottom:4px}.wsp .redogo:disabled{background:#9ca3af;cursor:default}.wsp .tfix{border:1.5px solid var(--ng);color:var(--ng);border-radius:8px;padding:4px 10px;margin:6px 0;font-size:13.5px;font-weight:700}.wsp .tfix.done{border-color:var(--ok);color:var(--ok)}.wsp .tst{display:block;font-size:12px;font-weight:700;color:var(--ng);margin-top:2px}.wsp .tst.done{color:var(--ok)}.wsp .tstart{text-align:left}.wsp .tsn{font-size:22px;font-weight:800;margin:4px 0 0}.wsp .tsr{color:var(--sub);font-size:13px;margin-bottom:8px}.wsp .tsinfo{border-collapse:collapse;margin:6px 0 10px;font-size:14px}.wsp .tsinfo th{text-align:left;padding:3px 14px 3px 0;color:var(--sub);font-weight:700}.wsp .tsinfo td{padding:3px 0}.wsp .tsl{margin:0 0 12px;padding-left:1.3em;font-size:14px;line-height:1.8}.wsp .tsd{font-size:13px;margin:4px 0 6px;color:#92400e}.wsp .tsgo{width:100%;font-size:17px;padding:12px}.wsp .ttime{display:inline-block;font-weight:800;color:var(--ink);background:#f3f4f6;border-radius:6px;padding:0 8px}.wsp .ttime.over{color:#fff;background:var(--ng)}.wsp .tstrip{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0}.wsp .tstrip button{min-width:34px;border:1.5px solid #9ca3af;background:#fff;border-radius:4px;font:inherit;font-weight:700;font-size:13px;padding:2px 6px;cursor:pointer}.wsp .tstrip button.done{background:#374151;color:#fff;border-color:#374151}.wsp .tstrip button.part{background:#e5e7eb}.wsp .tstrip button.on{outline:3px solid #f59e0b;outline-offset:1px}.wsp .tstrip button.rv{margin-left:auto}.wsp .tsq{border-top:1px dashed #ddd;padding-top:4px;margin-top:6px}.wsp .ch button.sel{border-color:var(--ink);background:#111827;color:#fff}.wsp .ch button.sel .katex{color:#fff}.wsp .tnav{display:flex;gap:8px;justify-content:space-between;margin-top:6px}.wsp .tvh{font-weight:800;margin:6px 0}.wsp .tvu{margin-left:8px;color:var(--ng)}.wsp .tvok{margin-left:8px;color:var(--ok)}.wsp .tvl{display:flex;flex-direction:column}.wsp .tvr{display:flex;gap:8px;align-items:center;border:0;border-bottom:1px solid #eee;background:none;font:inherit;font-size:14px;text-align:left;padding:5px 2px;cursor:pointer}.wsp .tvr .tva{flex:1}.wsp .tvr.un .tva{color:var(--ng);font-weight:700}.wsp .tcf{border:2px solid var(--ng);border-radius:8px;padding:8px 10px;margin:8px 0;font-weight:700}.wsp .tover{text-align:center;color:var(--ng);font-weight:700;margin:-4px 0 6px}.wsp .tra{font-size:13px;color:#374151;margin:-2px 0 4px 2.6em}.wsp .tr.x .tra{color:#7f1d1d}.wsp .trsep{margin:0 8px;color:#9ca3af}.wsp .trfig{margin:4px 0}.wsp .tstep{border:1.5px solid #d1d5db;border-radius:10px;padding:8px 10px;margin:10px 0;background:#fff}.wsp .tsh{font-weight:800;font-size:15.5px;display:flex;align-items:center;gap:8px}.wsp .tsno{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--ink);color:#fff;font-size:13px}.wsp .tsc{margin-left:auto;font-size:12.5px;color:var(--sub);font-weight:700}.wsp .tsd{font-size:13px;color:var(--sub);margin:2px 0 6px}.wsp .tnext{background:#f9fafb}.wsp .tnext .passn,.wsp .tnext .okm{text-align:left;font-size:14px;margin:4px 0}.wsp .trs .score{font-size:30px;margin:4px 0 2px}.wsp .trs .tdl{margin:0 0 4px}.wsp .tres .wd1{margin:6px 2px 8px}.wsp .tlead{font-size:13.5px;font-weight:700;color:#0a6cff;margin:2px 0 6px}.wsp .tcur{border:2px solid #0a6cff;box-shadow:0 2px 10px rgba(10,108,255,.10)}.wsp .tcur .tsno{background:#0a6cff}.wsp .tcur .tsgo,.wsp .tcur .redogo,.wsp .tcur .tagain{display:block;width:100%;margin-top:10px;padding:11px 18px;font-weight:700}.wsp .tcur .tsgo:disabled{background:#9ca3af;cursor:default}.wsp .tsneed{font-size:12.5px;color:var(--ng);text-align:center;margin-top:8px;font-weight:700}.wsp .tsback{border:0;background:none;color:var(--sub);font:inherit;font-size:13px;padding:6px 2px;cursor:pointer}.wsp .tmk{border:1.5px solid #333;border-radius:6px;overflow:hidden;margin:6px 0}.wsp .tmr{display:flex;border-top:1px solid #ccc}.wsp .tmr:first-child{border-top:0}.wsp .tmn{min-width:40px;display:flex;align-items:center;justify-content:center;border-right:1px solid #ccc;background:#f4f5f7}.wsp .tmc{display:flex;flex-wrap:wrap;gap:5px;padding:5px}.wsp .tmx{display:inline-flex;align-items:center;gap:3px;border:1px solid #bbb;border-radius:5px;padding:2px 6px;font-size:13px;background:#fff}.wsp .tmx b{font-size:17px}.wsp .tmx.o b{color:var(--ok)}.wsp .tmx.x{border-color:var(--ng);background:#fff5f3}.wsp .tmx.x b{color:var(--ng)}.wsp .tmx i{font-style:normal;color:var(--ng);font-weight:800;font-size:14px}.wsp .tnl{margin:4px 0}.wsp .tnr{display:flex;align-items:center;gap:6px;padding:5px 0;border-top:1px solid #eee;font-size:14px}.wsp .tnr .trq{flex:1;min-width:0}.wsp .tres{position:relative}.wsp .hanko{position:absolute;right:14px;top:44px;width:78px;height:78px;border:4px solid #d93025;border-radius:50%;color:#d93025;display:flex;align-items:center;justify-content:center;transform:rotate(-14deg);background:rgba(255,255,255,.6);pointer-events:none;z-index:2}.wsp .hanko span{font-size:24px;font-weight:900;letter-spacing:2px;border-top:2px solid #d93025;border-bottom:2px solid #d93025;padding:1px 4px;line-height:1.2}.wsp .hanko.pop{animation:hanko .55s cubic-bezier(.2,1.4,.5,1) .25s both}.wsp .tdet.tok summary{display:list-item}.wsp .tdet{margin:8px 0;border-top:1px solid #e5e7eb;padding-top:6px}.wsp .tdet summary{cursor:pointer;font-weight:700;font-size:14px;color:#374151}.wsp .tra b{font-weight:800;color:var(--ink)}.wsp .trmy{margin-left:12px;font-size:12px;color:#9ca3af}.wsp .cdots i.now{background:#111827}.wsp .wd1{display:flex;align-items:center;white-space:nowrap;min-height:22px;margin:9px 2px 2px}.wsp .wd1 .ws{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:800;color:#8a8f99;flex:none}.wsp .wd1 .wc{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.05);color:#8a8f99;flex:none}.wsp .wd1 .wc svg{width:12px;height:12px}.wsp .wd1 .ws.w-ok .wc{background:#1faa6b;color:#fff}.wsp .wd1 .ws.w-ok{color:#1faa6b}.wsp .wd1 .ws.w-now .wc{background:#e8f0ff;color:#0a6cff;box-shadow:0 0 0 2px #0a6cff;animation:wd1p 1.6s ease-in-out infinite}.wsp .wd1 .ws.w-now{color:#0a6cff}.wsp .wd1 .ws.w-now b{font-size:12.5px}.wsp .wd1 .ws.w-fx .wc{background:#fff4dc;color:#e8a317;box-shadow:0 0 0 2px #e8a317}.wsp .wd1 .ws.w-fx{color:#e8a317}.wsp .wd1 .ws.w-gl .wc{background:rgba(202,162,74,.14);color:#caa24a}.wsp .wd1 .wl{flex:1;min-width:8px;height:2.5px;border-radius:2px;background:#dfe4ee;margin:0 4px}.wsp .wd1 .wl.lk{background:#1faa6b}.wsp .wd1 .wl.part{background:linear-gradient(90deg,#0a6cff var(--v),#dfe4ee 0)}.wsp .wd1 .wl.fxp{background:linear-gradient(90deg,#e8a317 var(--v),#dfe4ee 0)}.wsp .wd1-cmb{flex:none;margin-left:8px;font-size:11.5px;font-weight:800;color:#caa24a}.wsp .wd1-cmb:empty{display:none}.wsp .wd1-chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:800;color:#0a6cff;background:#e8f0ff;border-radius:999px;padding:2px 9px;margin:2px 0 6px}.wsp .wd1-chip.ez{color:#0f766e;background:#e6f6f3}.wsp .pprog{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:6px 0 8px;font-size:12px;color:#6b7280}.wsp .pg{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.wsp .pg b{font-weight:700}.wsp .pg.cur{color:#111827}.wsp .pg.cur b{font-weight:800}.wsp .pg.fin{color:#374151}.wsp .pgn{font-weight:800}.wsp .pgs{display:inline-flex;gap:3px}.wsp .pgs i{display:inline-block;width:14px;height:6px;border-radius:3px;background:#e5e7eb}.wsp .pgs i.on{background:#caa24a}.wsp .pgs i.now{background:#111827}.wsp .pgsep{color:#9ca3af}.wsp .side.ws{padding:0;overflow:hidden;border-left:4px solid #caa24a;align-self:start}.wsp .wsh{padding:10px 12px;border-bottom:1px solid #e5e7eb}.wsp .wst{font-weight:800;font-size:14px}.wsp .wss{font-size:12px;color:var(--sub);margin-top:3px;display:flex;gap:8px;align-items:center}.wsp .wsb{font-size:11.5px;font-weight:700;color:#374151;background:#f3f4f6;border-radius:4px;padding:0 6px}.wsp .wsbar{height:5px;background:#e5e7eb;border-radius:3px;margin-top:6px;overflow:hidden}.wsp .wsbar i{display:block;height:100%;background:#caa24a}.wsp .side .wsr{display:flex;align-items:center;gap:8px;width:100%;margin:0;border:0;border-bottom:1px solid #eef0f2;border-radius:0;padding:9px 12px;background:#fff;text-align:left}.wsp .side .wsr.on{box-shadow:inset 3px 0 0 #111827;background:#f9fafb}.wsp .wsm{flex:1;min-width:0;font-size:13.5px;line-height:1.45}.wsp .wsm b{font-weight:700}.wsp .wsu{display:block;font-size:11.5px;color:var(--sub)}.wsp .wsd{font-size:11px;color:var(--sub);white-space:nowrap;font-weight:700;display:inline-flex;align-items:center;gap:3px}.wsp .wsd svg{width:11px;height:11px}.wsp .wsd.ok{color:var(--ok)}.wsp .wsd.ok svg{width:13px;height:13px}.wsp .wsgo{display:inline-flex;align-items:center;gap:8px;flex:none}.wsp .wsar{width:30px;height:30px;border-radius:9px;background:#0a6cff;color:#fff;display:flex;align-items:center;justify-content:center;flex:none}.wsp .wsar svg{width:16px;height:16px}.wsp .side .wst2{background:#f1edff}.wsp .side .wst2.on{background:#e9e3ff}.wsp .wsc{border-bottom:6px solid #f3f4f6}.wsp .wsch{display:flex;align-items:center;gap:6px;padding:9px 12px 4px;font-size:13.5px}.wsp .wsch b{font-weight:800}.wsp .wsch .pno{white-space:nowrap;flex:none}.wsp .wscn{flex:none;margin-left:auto;font-size:11.5px;color:var(--sub);font-weight:700}.wsp .wsc .wsr{padding-left:20px}.wsp .wsc:first-of-type .wsr,.wsp .wsc .wst2{padding-left:12px}.wsp .wsrole{font-size:12.5px;color:#374151;background:#f9fafb;border-left:3px solid #caa24a;padding:4px 8px;margin:0 0 8px}.wsp .wsx{font-size:11px;color:var(--sub);flex-basis:100%;margin-top:-2px}.wsp .wss{flex-wrap:wrap}.wsp .wsb{white-space:nowrap}.wsp .wsnote{margin:4px 0 0;padding-left:1.2em;font-size:12.5px;color:#111827;font-weight:700}.wsp .tdl{text-align:center;margin:2px 0 8px}.wsp .tdp{display:inline-block;font-weight:800;font-size:14px;padding:5px 13px;border-radius:20px}.wsp .tdp.up{background:rgba(31,170,107,.15);color:#15803d}.wsp .tdp.dn{background:rgba(224,83,60,.13);color:#b91c1c}.wsp .tdp.same{background:#eef1f5;color:#555}.wsp .pplead{font-size:14px;margin:6px 0 10px;line-height:1.6}.wsp .pplead span{font-size:12px;color:#555}.wsp .pck{display:flex;flex-direction:column;border:1.5px solid #333;border-radius:6px;overflow:hidden;margin-bottom:8px;background:#fff}.wsp .pcr{display:flex;align-items:stretch;border-top:1px solid #bbb}.wsp .pcr:first-child{border-top:0}.wsp .pcn{min-width:44px;display:flex;align-items:center;justify-content:center;border-right:1px solid #bbb;background:#f4f5f7}.wsp .pcc{display:flex;flex-wrap:wrap;gap:6px;padding:6px}.wsp .pcx{display:inline-flex;align-items:center;gap:4px;border:1.5px solid #999;border-radius:5px;padding:3px 7px;min-width:62px;background:#fff;font-size:13px;cursor:pointer;user-select:none;scroll-margin:12px 0 210px}.wsp .pcx b{font-size:19px;min-width:1.2em;text-align:center}.wsp .pcx.un{border-color:#e0a800;background:#fff7e0}.wsp .pcx.cur{border-color:#0b6bff;box-shadow:0 0 0 3px rgba(11,107,255,.35);background:#eef5ff}.wsp .ppaper{padding-bottom:0}.wsp .ppad{position:sticky;bottom:0;z-index:3;background:#fff;border-top:1px solid #ccc;margin:10px -14px 0;padding:10px 12px 14px;box-shadow:0 -4px 10px rgba(0,0,0,.06)}.wsp .pph{font-size:12.5px;color:#555;margin-bottom:6px;text-align:center}.wsp .pph b{color:#0b6bff;font-size:14px}.wsp .ppk{display:grid;gap:6px}.wsp .ppk button{height:52px;border:1px solid #999;border-radius:10px;background:#fff;font:inherit;font-size:21px;font-weight:700;cursor:pointer}.wsp .ppk button:active{background:#ddd}.wsp .ppad .ppgo{display:block;width:100%;margin-top:8px}.wsp .pcx.miss{animation:pcxM .5s ease 2}.wsp .wsd.rdy-go{background:var(--accent,#2f6fed);color:#fff;border-radius:12px;padding:3px 10px;font-weight:800}.wsp .wsd.rdy-can{background:transparent;color:var(--accent,#2f6fed);border:1px solid var(--accent,#2f6fed);border-radius:12px;padding:2px 9px;font-weight:800}.wsp .wsd.rdy-late{background:transparent;border:1px dashed #c3ccd8;border-radius:12px;padding:2px 9px}.wsp.dk{background:#15171c;min-height:100%}.wsp.dk .app{filter:invert(.92) hue-rotate(180deg)}.wsp.dk .app svg.gr,.wsp.dk .app table,.wsp.dk .app img{background:#fff;filter:invert(1) hue-rotate(180deg)}.wsp .phw{min-width:0}.wsp .wsbk{display:none}@media(max-width:760px){.wsp .app.live.ml .phw{display:none}.wsp .app.live.mq .side{display:none}.wsp .app.live.mq .wsbk{display:block;margin:0 0 8px}.wsp .wsbkb{border:1px solid #ccc;background:#fff;border-radius:8px;padding:8px 12px;font:inherit;font-size:14px;cursor:pointer}}.wsp #pv-bar{display:none}.wsp .gzoom{display:none}.wsp .bar,.wsp .only-screen{display:none}.wsp{background:#fff}.wsp .sheet{box-shadow:none;border:0;padding:0}.wsp #selp{display:none}";
window.wsMount=function(root,D,opt){
 opt=opt||{};
 if(!root.getAttribute('lang'))root.setAttribute('lang','ja');
 var sh=root.shadowRoot||root.attachShadow({mode:'open'});
 sh.innerHTML='<link rel="stylesheet" href="'+(opt.katexCss||'ws/katex/katex.min.css')+'"><style>'+WS_CSS+'</style><div class="wsbody">'+WS_BODY+'</div>';
 var __realDoc=window.document;
 var document={getElementById:function(id){return sh.getElementById(id);},querySelector:function(q){return sh.querySelector(q);},querySelectorAll:function(q){return sh.querySelectorAll(q);},
   createElement:function(t){return __realDoc.createElement(t);},createElementNS:function(a,b){return __realDoc.createElementNS(a,b);},createTextNode:function(t){return __realDoc.createTextNode(t);},createDocumentFragment:function(){return __realDoc.createDocumentFragment();},createRange:function(){return __realDoc.createRange();},get defaultView(){return window;},get hidden(){return __realDoc.hidden;},
   addEventListener:function(a,b,c){return sh.addEventListener(a,b,c);},removeEventListener:function(a,b,c){return sh.removeEventListener(a,b,c);},
   get body(){return sh.querySelector('.wsbody');},get head(){return sh;},get documentElement(){return sh.querySelector('.wsbody');},get activeElement(){return sh.activeElement;}};
 var setInterval=function(f,t){var id=window.setInterval(function(){if(!root.isConnected){window.clearInterval(id);return;}f();},t);return id;};
 const UNIT_TITLE=D.UNIT_TITLE, PATS=D.PATS||[], REVIEW=D.REVIEW||undefined, TEST=D.TEST, POOL=D.POOL||{};
 
const HAJIKI=`<svg viewBox="0 0 160 120" width="150" aria-label="はじきの図"><circle cx="80" cy="60" r="56" fill="#fff" stroke="#6b21a8" stroke-width="2.5"/><line x1="24" y1="60" x2="136" y2="60" stroke="#6b21a8" stroke-width="2.5"/><line x1="80" y1="60" x2="80" y2="116" stroke="#6b21a8" stroke-width="2.5"/><text x="72" y="46" text-anchor="middle" font-size="26" font-weight="700" fill="#1a1a1a">み</text><text x="100" y="45" text-anchor="middle" font-size="13" fill="#555">(き)</text><text x="54" y="96" text-anchor="middle" font-size="26" font-weight="700" fill="#1a1a1a">は</text><text x="106" y="96" text-anchor="middle" font-size="26" font-weight="700" fill="#1a1a1a">じ</text></svg>`;

const BLRE=/\[\[(.+?)\]\]/g;
const HJ_TXT='み＝道のり、は＝速さ、じ＝時間。求めたいものを指でかくす。残りの2つが上下なら「÷」、横に並んでいれば「×」。<br>み（道のり）をかくす → は × じ　／　じ（時間）をかくす → み ÷ は　／　は（速さ）をかくす → み ÷ じ<br><span style="font-size:12px;color:#555">「き・は・じ」（き＝きょり）と覚えている人も、中身は同じ。</span>';
const EQSPLIT=l=>{const m=/^\\\((.*)\\\)$/.exec(l);if(!m)return null;const t=m[1];if(t.indexOf('\\(')>=0||t.indexOf('\\begin')>=0)return null;let d=0;for(let i=0;i<t.length;i++){const c=t[i];if(c==='{')d++;else if(c==='}')d--;else if(c==='='&&d===0)return [t.slice(0,i),t.slice(i+1)];}return null;};
const TERMS=t=>{t=t.replace(/\s+/g,'');const r=[];let d=0,cur='';for(let i=0;i<t.length;i++){const c=t[i];if(c==='{'||c==='(')d++;else if(c==='}'||c===')')d--;if((c==='+'||c==='-')&&d===0&&cur!==''&&!/\\times$|\\div$/.test(cur)){r.push(cur);cur=c==='-'?'-':'';continue;}cur+=c;}if(cur!=='')r.push(cur);return r.map(x=>x[0]==='+'?x.slice(1):x);};
const NEG=x=>x[0]==='-'?x.slice(1):'-'+x;
const TX=x=>`\\(${x}\\)`;
const AUTONOTE=(p,c)=>{const pl=p[0].trim(),pr=p[1].trim(),cl=c[0].trim(),cr=c[1].trim();
 if(/\\dfrac\{y|\\text\{ の/.test(cr))return null;
 if(/\\quad/.test(pl+pr)&&/\\quad/.test(cl+cr))return null;
 if(/\\text/.test(cl)&&cl!==pl)return null;
 if(/\\text/.test(pl)&&!/\\text/.test(cl))return null;
 if(pl===cl&&/\\text\{/.test(pr)&&!/\\text\{/.test(cr))return '数を入れる';
 if(/ax/.test(pr)&&!/ax/.test(cr)){if(cl===pl)return 'わかった数を入れる';return '通る点の座標を代入';}
 if(pl===cl&&pr.replace(/\+0$/,'')===cr)return '＋0 は書かない';
 if(/ax/.test(cr)&&!/ax/.test(pr))return null;
 if(/^[a-z]$/.test(pl)&&/^-?\d+(\.\d+)?$/.test(cl)&&pr.replace(/\s+/g,'')===cr.replace(/\s+/g,''))return `${TX(pl+'='+cl)} を代入`;
 const A=/^(-?\d+(?:\.\d+)?)([a-z])$/,m1=A.exec(pl),m2=A.exec(pr);
 if(m1&&cl===m1[2])return `${TX(m1[2])} の係数 ${TX(m1[1])} で両辺をわる`;if(m2&&cl===m2[2])return `${TX(m2[2])} の係数 ${TX(m2[1])} で両辺をわって、左右を入れかえる`;if(pl==='-'+cl&&cl.length===1)return `両辺に ${TX('-1')} をかける`;if(pr==='-'+cl&&cl.length===1)return `両辺に ${TX('-1')} をかけて、左右を入れかえる`;
 if(/^[a-z]$/.test(pl)&&pl!==cl&&new RegExp('(^|[^a-z\\\\])'+pl+'($|[^a-z])').test(cr.replace(/\\[a-z]+/g,'')))return null;
 if(/^[a-z]$/.test(pl)&&/^[a-z]$/.test(cl)&&pl!==cl&&!/[a-z]/.test(pr.replace(/\\[a-z]+/g,''))){const pv=pr.split('=').pop();return /^[ab]$/.test(pl)?`${TX(pl+'='+pv)} を式に入れる`:`${TX(pl+'='+pv)} を代入`;}
 if(pl===cr&&pr===cl)return '左右を入れかえる';
 if(pl===cl&&/(^|[^a-z\\])x/.test(cr.replace(/\\[a-z]+/g,''))&&!/(^|[^a-z\\])x/.test(pr.replace(/\\[a-z]+/g,'')))return null;
 if(/\\times|\\div/.test(cl)&&cl!==pl)return null;
 if(pl===cl){const ub=t=>t.replace(/\\underbrace\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}_\{\\color\{#c2410c\}\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}\}/g,'$1').replace(/\s+/g,'');
  const P=ub(pr),Cc=ub(cr);
  if(/(^|[^a-z\\])x/.test(P)&&!/x/.test(Cc.replace(/\\[a-z]+/g,''))){
   const V='(\\(?-?(?:\\d+|\\\\dfrac\\{\\d+\\}\\{\\d+\\})\\)?|\\\\left\\(-?\\\\dfrac\\{\\d+\\}\\{\\d+\\}\\\\right\\))';
   const rxs=P.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/x/g,'(?:\\\\times)?'+V);
   let m=null;try{m=new RegExp('^'+rxs+'$').exec(Cc);}catch(e){}
   if(m){let v=m.slice(1).find(z=>z)||'';v=v.replace(/^\\left\(|\\right\)$/g,'').replace(/^\((.*)\)$/,'$1');return `${TX('x='+v)} を代入`;}
   return '\\(x\\) に数を代入';}}
 if(/\\underbrace/.test(p.join('')))return cl===pl?'':null;
 const dm=/\\dfrac\{[^{}]*[a-z][^{}]*\}\{(\d+)\}|\\dfrac\{[^{}]*\}\{(\d+)\}\s*[a-z(]/.exec(p.join('').replace(/\\text\{[^{}]*\}/g,''));if(dm&&!/\\dfrac/.test(c.join('')))return `両辺に ${dm[1]||dm[2]} をかける`;
 const PL=TERMS(pl),PR=TERMS(pr),CL=TERMS(cl),CR=TERMS(cr);
 if(/^[a-z]$/.test(cl)&&/^-?(\d+(\.\d+)?|\\dfrac\{\d+\}\{\d+\})$/.test(cr)&&pl!==cl){
  if(PR.indexOf(cl)>=0){const o=PR.filter(x=>x!==cl);return o.length?`${o.map(TX).join('、')} を左へ移して計算し、左右を入れかえる`:'左辺を計算して、左右を入れかえる';}
  if(PL.indexOf(cl)>=0){const o=PL.filter(x=>x!==cl);if(o.length)return `${o.map(TX).join('、')} を右へ移して計算する`;}}
 const toL=CL.filter(x=>PL.indexOf(x)<0&&PR.indexOf(NEG(x))>=0).map(NEG),toR=CR.filter(x=>PR.indexOf(x)<0&&PL.indexOf(NEG(x))>=0).map(NEG);
 const a=[];if(toL.length)a.push(toL.map(TX).join('、')+' を左へ');if(toR.length)a.push(toR.map(TX).join('、')+' を右へ');
 if(a.length)return a.join('、')+'移す';
 if(pl===cl){const P2=pr.replace(/\s+/g,''),C2=cr.replace(/\s+/g,'');
  const md=/^(-?\d+)\\times\((.*)\)\\div(\d+)$/.exec(P2);if(md)return `${TX(md[1]+'\\div '+md[3])} を先に計算する`;
  const mk=/^(-?\d+)\((.*)\)$/.exec(P2);if(mk&&!/\(/.test(C2))return `かっこをはずす（${TX(mk[1])} をかっこの中の両方にかける）`;
  if(PR.length>1&&PR.slice().sort().join()===CR.slice().sort().join()){const v=(CR[0].match(/[a-z]/)||['x'])[0];return `${TX(v)} の項を前に書く`;}}
 if(pr===cr)return '左辺を計算する';if(pl===cl)return '右辺を計算する';return 'それぞれの辺を計算する';};
const EQROW=(lh,rh,nt)=>`<div class="eql">${lh}</div><div class="eqr">${rh}</div><div class="eqn">${nt||''}</div>`;
/* 数の計算は下かっこ（2026-10-16 川上さん）。UBTOK＝深さ0の＋−で分ける（元の文字のまま） */
const UBTOK=t=>{const r=[];let d=0,cur='',op='';for(let i=0;i<t.length;i++){const c=t[i];if(c==='{'||c==='(')d++;else if(c==='}'||c===')')d--;
  if((c==='+'||c==='-')&&d===0&&cur.trim()!==''&&!/(\\times|\\div|\\cdot)\s*$/.test(cur)){r.push([op,cur]);op=c;cur='';continue;}
  if((c==='+'||c==='-')&&d===0&&cur.trim()===''&&r.length===0&&op===''){cur+=c;continue;}cur+=c;}
 if(cur.trim()!=='')r.push([op,cur]);return r;};
const UBN=t=>(t[0]+t[1]).replace(/\s+/g,'');
const UBJ=(a,first)=>a.map((t,i)=>(i===0&&first?(t[0]==='-'?'-':''):t[0])+t[1]).join('');
const UBLET=t=>t.replace(/\\text\{[^{}]*\}/g,'').replace(/\\[a-z]+/g,'').replace(/[^a-z]/g,'');
const UB=(ps,cs)=>{if(/\\underbrace/.test(ps))return null;const P=UBTOK(ps),C=UBTOK(cs);let i=0;while(i<P.length&&i<C.length&&UBN(P[i])===UBN(C[i]))i++;
 let j=0;while(j<P.length-i&&j<C.length-i&&UBN(P[P.length-1-j])===UBN(C[C.length-1-j]))j++;
 if(i===0&&j>0&&C.length-j===0)j--;const Pm=P.slice(i,P.length-j),Cm=C.slice(i,C.length-j);if(!Pm.length)return null;if(/\\text\{/.test(Pm.map(t=>t[1]).join('')))return null;if(!Cm.length){if(i===0)return null;Cm.push(['','0']);}
 if(Pm.map(UBN).sort().join()===Cm.map(UBN).sort().join())return null;
 const lets=UBLET(Pm.map(t=>t[1]).join(''));
 if(lets){if(Pm.some(t=>/[()]/.test(t[1])))return null;const L=new Set(lets.split(''));if(L.size!==1)return null;if(Pm.length===1&&Cm.length===1){}else{
  const v=[...L][0];if(!Pm.every(t=>new RegExp('^\\s*-?[\\d.\\s]*'+v+'\\s*$|^\\s*-?0\\s*$').test(t[1].replace(/\\dfrac\{\d+\}\{\d+\}/g,'1'))))return null;if(Cm.length!==1)return null;}}
 const mid=UBJ(Pm,i===0),lab=UBJ(Cm,i===0);
 return UBJ(P.slice(0,i),true)+`\\underbrace{${mid}}_{\\color{#c2410c}{${lab}}}`+(P.length-j<P.length?UBJ(P.slice(P.length-j),false):'');};
const EQS=rows=>{rows=rows.map(r=>r.slice());const raw=x=>{const m=/^\\\((?:\{\}=)?([\s\S]*)\\\)$/.exec(x||'');return m&&x.indexOf('[[')<0&&x.indexOf('\\(',2)<0?m[1]:null;};
 for(let i=1;i<rows.length;i++){const r=rows[i],p=rows[i-1],nt=r[2]||'';if(nt==='計算して、左右を入れかえる'&&r[1].indexOf('[[')>=0){const pl0=raw(p[0]);if(pl0!==null&&!/[a-z]/.test(UBLET(pl0))&&!/\\underbrace/.test(pl0)){p[0]=`\\(\\underbrace{${pl0}}_{\\color{#c2410c}{\\square}}\\)`;r[2]='左右を入れかえる';}continue;}if(!/^((右辺|左辺|それぞれの辺)を)?計算する$/.test(nt))continue;
  const pl=raw(p[0]),pr=raw(p[1]);if(pr===null||/\\underbrace/.test(p[0]+p[1]))continue;const cl=raw(r[0]),cr=raw(r[1]);let ok=false;
  if(cr===null&&r[1].indexOf('[[')>=0){if(nt!=='左辺を計算する'&&!/[()]/.test(pr)&&new Set(UBLET(pr).split('').filter(z=>z)).size<=1){p[1]=`\\({}=\\underbrace{${pr}}_{\\color{#c2410c}{\\square}}\\)`;ok=true;}}
  else if(cr!==null){const nr=UB(pr,cr);if(nr){p[1]=`\\({}=${nr}\\)`;ok=true;}if(pl!==null&&cl!==null&&pl!==cl){const nl=UB(pl,cl);if(nl){p[0]=`\\(${nl}\\)`;ok=true;}}}
  if(ok)r[2]='';}
 return `<div class="eqg">${rows.map(r=>EQROW(r[0],r[1],r[2])).join('')}</div>`;};
const UBCALC=/^(左辺|右辺|それぞれの辺)を計算する$/;
const WTXT=w=>{const L=Array.isArray(w)?w:[w];let h='',g=null,pend=null;const rg=()=>g.map(r=>EQROW(`\\(${r[0]}\\)`,`\\({}=${r[1]}\\)`,r[2])).join('');
 const flush=()=>{L._p=null;if(g){h+=`<div class="eqg">${rg()}</div>`;g=null;}if(pend!==null){h+=`<div class="wn">${pend}</div>`;pend=null;}};
 L.forEach((l,k)=>{const sp=typeof l==='string'?EQSPLIT(l):null;
  if(sp){let nt=(g&&pend!==null)?pend:null;
   if(!nt&&g&&L._p){nt=AUTONOTE(L._p,sp);if(nt===null){h+=`<div class="eqg">${rg()}</div>`;g=[];nt='';}
    else if(UBCALC.test(nt)&&g.length){const pr=g[g.length-1];let ok=false;const nl=nt!=='右辺を計算する'?UB(pr[0],sp[0]):null,nr=nt!=='左辺を計算する'?UB(pr[1],sp[1]):null;
     if(nt==='それぞれの辺を計算する'){if(nl&&nr){pr[0]=nl;pr[1]=nr;ok=true;}}else if(nl||nr){if(nl)pr[0]=nl;if(nr)pr[1]=nr;ok=true;}
     if(ok)nt='';}
    else if(nt==='左辺を計算して、左右を入れかえる'&&g.length){const pr=g[g.length-1],nl=UB(pr[0],sp[1]);if(nl){pr[0]=nl;nt='左右を入れかえる';}}}
   L._p=sp;if(!g){if(pend!==null){h+=`<div class="wn">${pend}</div>`;}g=[];}pend=null;g.push([sp[0],sp[1],nt]);return;}
  if(typeof l==='string'&&l[0]==='>'){const nx=L[k+1];if(g&&typeof nx==='string'&&EQSPLIT(nx)){pend=l.slice(1);return;}flush();h+=`<div class="wn">${l.slice(1)}</div>`;return;}
  flush();h+=l[0]==='<'?`<div class="wtb">${l}</div>`:l[0]==='#'?`<div class="wt">${l.slice(1)}</div>`:`<div class="we">${l}</div>`;});
 flush();return `<div class="dv">${h}</div>`;};
const pointCardHtml=(c,mode)=>{let n=0;const body=c.rows.map(r=>`<div class="pr"><span class="lb ${r.lb==='文字にする'?'x':''}">${r.lb}</span><div class="pt">${r.t.replace(BLRE,(m,g)=>{n++;const p=g.split('|');return mode==='paper'?`<span class="pbl">${'①②③④⑤⑥'[n-1]}</span>`:mode==='ans'?`<span class="ans">${'①②③④⑤⑥'[n-1]} ${p[0]}</span>`:`<span class="bl" data-n="${n}" data-c="${encodeURIComponent(g)}">${'①②③④⑤⑥'[n-1]}</span>`})}</div></div>`).join('');
 return `<div class="pc"><div class="pch">${c.h}</div>${c.hajiki&&mode!=='ans'?`<div class="hj">${HAJIKI}<div class="hjt">${HJ_TXT}</div></div>`:''}${body}</div>`;};

const K=el=>{try{renderMathInElement(el,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false})}catch(e){}};
const esc=s=>s;
const TBA=(xs,ys,yn,xn)=>{const n=xs.length;const gap=(arr,cls)=>arr?`<tr class="${cls}"><th></th><td class="g"></td>${arr.map(t=>`<td colspan="2" class="g">${t?`<span>${t}</span>`:''}</td>`).join('')}<td class="g"></td></tr>`:'';
 return `<table class="tb tba">${gap(xn,'xn')}<tr><th>\\(x\\)</th>${xs.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr><tr><th>\\(y\\)</th>${ys.map(v=>`<td colspan="2">${v}</td>`).join('')}</tr>${gap(yn,'yn')}</table>`;};


 
/* ---- 穴埋め（Point と表で共通） ---- */
const NUM='①②③④⑤⑥⑦⑧⑨';
const needCalc=w=>(Array.isArray(w)?w:[w]).filter(l=>typeof l==='string'&&l.startsWith('\\(')).length>=3;
const CALC='<div class="calc">✎ ノートに式を書いて計算しよう</div>';
const blHtml=(t,mode)=>{let n=0;return t.replace(BLRE,(m,g)=>{n++;const p=g.split('|');return mode==='paper'?`<span class="pbl">${NUM[n-1]}</span>`:mode==='ans'?`<span class="ans">${NUM[n-1]} ${p[0]}</span>`:mode==='done'?`<span class="bl fill">${p[0]}</span>`:`<span class="bl" data-c="${encodeURIComponent(g)}">${NUM[n-1]}</span>`})};
function fillRun(box,onDone){
 const chs=box.querySelector('.pt-chs'),left=box.querySelector('.pt-left');let busy=false;
 const sync=()=>{const r=box.querySelectorAll('.bl:not(.fill)').length;if(left)left.textContent=r?`あと${r}つ`:'';if(!r){const pk=box.querySelector('.pt-pick');if(pk)pk.remove();onDone();}return r;};
 const openBl=b=>{box.querySelectorAll('.bl.open').forEach(x=>x.classList.remove('open'));b.classList.add('open');
  const p=decodeURIComponent(b.dataset.c).split('|'),ans=p[0];const o=p.slice().sort(()=>Math.random()-.5);
  chs.innerHTML=o.map(v=>`<button class="pt-ch" data-v="${encodeURIComponent(v)}">${v}</button>`).join('');K(chs);
  chs.querySelectorAll('.pt-ch').forEach(btn=>btn.onclick=()=>{if(busy)return;busy=true;const ok=decodeURIComponent(btn.dataset.v)===ans;
   chs.querySelectorAll('.pt-ch').forEach(x=>{x.disabled=true;x.classList.add(decodeURIComponent(x.dataset.v)===ans?'hit':'dim')});
   const fb=document.createElement('span');fb.className='pt-fb'+(ok?'':' miss');fb.textContent=ok?'正解！':'こっちだね';b.appendChild(fb);
   setTimeout(()=>{b.className='bl fill'+(ok?'':' miss');b.innerHTML=ans;K(b);busy=false;if(sync())openBl(box.querySelector('.bl:not(.fill)'));},ok?700:900);});};
 box.querySelectorAll('.bl').forEach(b=>b.onclick=()=>{if(!b.classList.contains('fill')&&!busy)openBl(b)});
 if(sync())openBl(box.querySelector('.bl'));
}
/* ===== 2026-10-17 ③ 共通の部品（作り方の決まり E-30・E-35・F-26・F-27・F-29〜F-35） ===== */
/* 名前（E-30・F-26）：「単元2 直線の式を求める」→「②直線の式を求める」。本の名前は BOOK に1回だけ */
const BOOK='中2数学 1次関数';
const CIRC='①②③④⑤⑥⑦⑧⑨';
const UTN=()=>{const m=/^単元(\d+)\s*(.*)$/.exec(UT());return m?CIRC[+m[1]-1]+m[2]:'';};
const HEAD1=()=>UTN()?`${BOOK} ${UTN()}`:BOOK;
const PNO=no=>`<span class="pno">パターン${no}</span>`;
const HAS_RV=()=>typeof REVIEW!=='undefined'&&REVIEW&&REVIEW.items&&REVIEW.items.length>0;
/* ---- なぞり（F-35）：音は鳴らさない。英語の解説と同じく、文字数に合わせて金の下線を伸ばす。数式・穴・図は1かたまり ---- */
function wrapKC(el){const units=[];const walk=n=>{[...n.childNodes].forEach(ch=>{
  if(ch.nodeType===3){if(!ch.textContent.trim())return;const f=document.createDocumentFragment();[...ch.textContent].forEach(c=>{const s=document.createElement('span');s.className='kc';s.textContent=c;f.appendChild(s);if(c.trim())units.push(s);});ch.replaceWith(f);}
  else if(ch.nodeType===1){if(ch.classList.contains('katex')){const lv=[...ch.querySelectorAll('.katex-html *')].filter(e=>!e.children.length&&e.textContent.trim());
    if(lv.length){const R=lv.map(e=>{const r=e.getBoundingClientRect();return [e,Math.round(r.left/6),r.top];});R.sort((a,b)=>a[1]-b[1]||a[2]-b[2]);R.forEach(([e])=>{e.classList.add('kl');units.push(e);});}else{ch.classList.add('kk');units.push(ch);}}
   else if(ch.classList.contains('bl')){ch.classList.add('kk');units.push(ch);}
   else if(ch.tagName.toLowerCase()!=='svg'&&!ch.classList.contains('kc')&&!ch.classList.contains('eqn'))walk(ch);}});};walk(el);return units;}
let TRACE_RUN=0;const TRACE_MS=120;const KEYLB=/^(覚える|言葉の式|公式)$/;
function traceEls(els,my,cap){return new Promise(res=>{let ri=0;let PER=0;if(cap){let n=0;els.forEach(e=>{n+=wrapKC(e).length;});PER=Math.max(12,Math.min(85,cap/Math.max(1,n)));}
  const nextRow=()=>{if(my!==TRACE_RUN)return res(false);if(ri>=els.length)return res(true);
   const el=els[ri++];const units=cap?[...el.querySelectorAll('.kc,.kk')].filter(u=>u.classList.contains('kk')||u.textContent.trim()):wrapKC(el);if(!units.length)return nextRow();
   if(!cap){let i=0;const row=el.closest('.pr'),lbt=row&&row.querySelector('.lb')?row.querySelector('.lb').textContent.trim():'',key=KEYLB.test(lbt),SP=TRACE_MS*(key?1.3:1);
    const W=u=>u.classList.contains('kl')?Math.max(1,Math.min(4,u.textContent.replace(/\s/g,'').length)):u.classList.contains('kk')?3:1;
    const step=()=>{if(my!==TRACE_RUN)return res(false);if(i>=units.length){if(key&&row)row.classList.add('keyf');setTimeout(()=>{units.forEach(u=>{u.classList.remove('on');u.style.transitionDuration='';});nextRow();},key?420:200);return;}
     const u=units[i++];
     if(u.classList.contains('bl')&&!u.classList.contains('fill')){u.classList.remove('lock');u.classList.add('on');if(!u.classList.contains('open'))u.click();
      const wait=()=>{if(my!==TRACE_RUN)return res(false);if(u.classList.contains('fill'))setTimeout(step,250);else setTimeout(wait,150);};wait();return;}
     const d=SP*W(u);u.style.transitionDuration=d+'ms';u.classList.add('on');setTimeout(step,d);};
    setTimeout(step,key?300:0);return;}
   const per=PER;let i=0;
   const t=setInterval(()=>{if(my!==TRACE_RUN){clearInterval(t);return res(false);}if(i>=units.length){clearInterval(t);setTimeout(()=>{units.forEach(u=>u.classList.remove('on'));nextRow();},cap?40:180);return;}units[i++].classList.add('on');},per);};
  nextRow();});}
/* ---- Point の区切りと流れ（F-30・F-31・F-35） ---- */
const PST={};const pst=pa=>PST[pa.no]||(PST[pa.no]={miss:0,seen:{}});
function autoChunks(n){if(n<=3)return [[...Array(n).keys()]];const k=Math.ceil(n/3),out=[];let s=0;for(let g=0;g<k;g++){const sz=Math.floor(n/k)+(g<n%k?1:0);out.push([...Array(sz).keys()].map(x=>x+s));s+=sz;}return out;}
function PSL(pa){if(pa._psl)return pa._psl;const ch=pa.point.chunks||autoChunks(pa.point.cards.length);const L=ch.map((ids,ci)=>({t:'chunk',ci,ids}));
 if(pa.easy){L.push({t:'ok'});(pa.easy.items||[]).forEach((x,k)=>L.push({t:'easy',k}));if(pa.easy.sort)L.push({t:'sort'});}
 if(pa.touch)L.push({t:'touch'});pa._psl=L;pa._nch=ch.length;return L;}
const firstEasy=pa=>PSL(pa).findIndex(x=>x.t==='easy'||x.t==='sort');
/* カードを区切りの画面用に描く。穴は ①② の札（押すと、その行のすぐ下に選択肢） */
function chunkCardHtml(c,ci,show){let n=0;const rows=c.rows.map((r,ri)=>`<div class="pr" data-ri="${ri}"><span class="lb ${r.lb==='文字にする'?'x':''}">${r.lb}</span><div class="pt">${r.t.replace(BLRE,(m,g)=>{n++;const a=g.split('|')[0];return show?`<span class="bl fill">${a}</span>`:`<span class="bl lock" data-c="${encodeURIComponent(g)}">${CIRC[n-1]}</span>`})}</div></div>`).join('');
 return `<div class="pc" data-card="${ci}"><div class="pch">${c.h}</div>${c.hajiki?`<div class="hj">${HAJIKI}<div class="hjt">${HJ_TXT}</div></div>`:''}${rows}</div>`;}
/* 答えの入った1行（確認でまちがえたとき・Point を見るの窓） */
function ansRowHtml(pa,ci,lb){const c=pa.point.cards[ci];if(!c)return '';const ri=lb?c.rows.findIndex(r=>r.lb===lb):-1;
 const rs=ri>=0?[c.rows[ri]]:c.rows;return `<div class="pc"><div class="pch">${c.h}</div>${rs.map(r=>`<div class="pr"><span class="lb">${r.lb}</span><div class="pt">${r.t.replace(BLRE,(m,g)=>`<span class="bl fill">${g.split('|')[0]}</span>`)}</div></div>`).join('')}</div>`;}
function shuf(a){return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);}
function goWU(){const pa=curPat();cur.pt=PSL(pa).length;drawPhone();}
function ptNext(){const pa=curPat(),L=PSL(pa),x=L[cur.pt];
 if(x.t==='chunk'){if(x.ci<pa._nch-1){cur.pt++;return drawPhone();}
  if(!pa.easy)return goWU();cur.pt=pst(pa).miss>0?firstEasy(pa):L.findIndex(y=>y.t==='ok');return drawPhone();}
 if(cur.pt+1>=L.length)return goWU();cur.pt++;drawPhone();}
/* パートの中の進み具合（2026-10-17 15:06 川上さん：Point は題数に入らない・やさしい説明に飛ぶと、今どこか分からない） */
/* 進み具合（2026-10-19 作業4の5：全画面共通の D1＋EB にそろえた。川上さん 2026-10-18 18:46「全教材・全画面で1つの形」）。
   学ぶパート＝ 要点（Point）→ 問題（WarmUp のステップ＋Try の題の通し）→ 旗。札＝「WarmUp 2/4」「Try 3/4」「やさしい説明 2/3（寄り道）」。
   練習・もっと練習＝ 問題 → 旗。復習パート＝ 問題 → もう一度（まちがえた問題・黄）→ 旗。類題＝ 類題 → 旗。テストは番号の帯のまま。
   右はしの「N連続」は WD1CMB()（本番だけ数を返す＝live_patch で差しかえ） */
const WD1I={chk:'<path d="M5 12l5 5l10 -10"/>',bulb:'<path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"/><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"/><path d="M9.7 17l4.6 0"/>',pen:'<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/><path d="M13.5 6.5l4 4"/>',book:'<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6l0 13"/><path d="M12 6l0 13"/><path d="M21 6l0 13"/>',note:'<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"/><path d="M13 8l2 0"/><path d="M13 12l2 0"/>',rep:'<path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"/><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"/>',flag:'<path d="M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z"/><path d="M5 21v-7"/>'};
const WD1SVG=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${WD1I[k]}</svg>`;
var WD1CMB=function(){return 0;};
function WD1(nodes,chip,ez){let h='';nodes.forEach((n,j)=>{
  if(j>0){const p=nodes[j-1];h+=(p.cls==='now'||p.cls==='fx')?`<span class="wl ${p.cls==='fx'?'fxp':'part'}" style="--v:${Math.round((p.v||0)*100)}%"></span>`:`<span class="wl${p.cls==='done'&&(n.cls==='now'||n.cls==='fx'||n.cls==='done')?' lk':''}"></span>`;}
  h+=`<span class="ws${n.cls?' w-'+({done:'ok',now:'now',fx:'fx',goal:'gl'})[n.cls]:''}"><span class="wc">${WD1SVG(n.cls==='done'?'chk':n.ic)}</span>${n.t?`<span>${n.t}</span>`:''}</span>`;});
 const c=WD1CMB();
 return `<div class="wd1">${h}<span class="wd1-cmb">${c>=2?c+'連続':''}</span></div>${chip?`<div><span class="wd1-chip${ez?' ez':''}">${chip}</span></div>`:''}`;}
const WD1G={ic:'flag',cls:'goal'};
/* 学ぶパートの問題の数＝WarmUp のステップ数＋Try の題数 */
function WD1NUM(pa){const wu=pa.parts.find(p=>p.wu),t=pa.parts.find(p=>p.k==='T');return {nw:wu&&wu.items[0]?wu.items[0].steps.length:0,nt:t?t.items.length:0};}
function PPROG(pa,g,k){PSL(pa);const S=pst(pa);if(g==='Y'||g==='T')S.ez=1;const E=pa.easy,ny=E?(E.items||[]).length+(E.sort?1:0):0;
 const {nw,nt}=WD1NUM(pa),N=nw+nt,np=pa._nch;
 if(g==='P'){const fin=k>=np;return WD1([fin?{cls:'done',ic:'bulb',t:'要点'}:{cls:'now',ic:'bulb',t:`要点 <b>${k+1}/${np}</b>`,v:k/np},{ic:'pen',t:'問題'},WD1G]);}
 if(g==='Y'||g==='T')return WD1([{cls:'now',ic:'bulb',t:'要点',v:0},{ic:'pen',t:'問題'},WD1G],g==='Y'?`やさしい説明 ${Math.min(k+1,ny)}/${ny}（寄り道）`:'さわってみよう（寄り道）',1);
 /* W＝WarmUp の k ステップ目 */
 return WD1([{cls:'done',ic:'bulb',t:'要点'},{cls:'now',ic:'pen',t:`問題 <b>${k+1}/${N}</b>`,v:k/N},WD1G],nt?`WarmUp ${k+1}/${nw}`:'');}
/* 学ぶパート以外（Try・練習・もっと練習・復習パート）の進み具合 */
function WPROG(pa,P){
 if(P.k==='T'&&pa){const {nw,nt}=WD1NUM(pa),N=nw+nt;return WD1([{cls:'done',ic:'bulb',t:'要点'},{cls:'now',ic:'pen',t:`問題 <b>${nw+cur.i+1}/${N}</b>`,v:(nw+cur.i)/N},WD1G],`Try ${cur.i+1}/${nt}`);}
 if(isRV(P)&&RV.round){const m=RV.round.length,q=RV.round.indexOf(cur.i);return WD1([{cls:'done',ic:'pen',t:'問題'},{cls:'fx',ic:'rep',t:`もう一度 <b>${q+1}/${m}</b>`,v:q/m},WD1G]);}
 const n=P.items.length;return WD1([{cls:'now',ic:'pen',t:`問題 <b>${cur.i+1}/${n}</b>`,v:cur.i/n},WD1G]);}
function drawPoint(ph,pa,P){const L=PSL(pa),x=L[cur.pt],S=pst(pa),show=typeof pvShowAns!=='undefined'&&pvShowAns&&typeof SCR!=='undefined'&&SCR.length>0;
 const top=t=>`<div class="prog"><span class="tag ${t.k}">${t.name}</span>　${PNO(pa.no)} ${pa.name}</div>`;
 if(x.t==='chunk'){const ids=x.ids;const dots=PPROG(pa,'P',x.ci)+(x.ci===0?`<div class="wsrole">① 学ぶ：${ROLETXT(pa,P)}${NOTE1}</div>`:'');
  const ck=pa.point.checks&&pa.point.checks[x.ci];
  ph.innerHTML=`<div class="phone wu">${top({k:'P',name:'Point'})}${dots}<div class="ptitle">${pa.point.title}</div><div class="chunk">${ids.map(k=>chunkCardHtml(pa.point.cards[k],k,show)).join('')}</div><button type="button" class="again">もう一度なぞる</button><div class="ckarea"></div><button class="next" style="display:none">${x.ci<pa._nch-1?'次へ':'Point おわり'}</button></div>`;
  K(ph);const box=ph.querySelector('.phone'),go=box.querySelector('.next'),ckA=box.querySelector('.ckarea');go.onclick=ptNext;
  const holes=()=>[...box.querySelectorAll('.chunk .bl')];
  const unlock=()=>holes().forEach(h=>h.classList.remove('lock'));
  const showCheck=()=>{if(!ck){go.style.display='';return;}if(ckA.innerHTML)return;
   ckA.innerHTML=`<div class="ck"><div class="ckh">確認</div><div class="ckq">${ck.q}</div><div class="pt-chs ckc"></div><div class="ckb"></div></div>`;
   const cc=ckA.querySelector('.ckc');const order=show?ck.c.map((_,i)=>i):shuf(ck.c.map((_,i)=>i));
   order.forEach(i=>{const b=document.createElement('button');b.className='pt-ch';b.innerHTML=ck.c[i];
    if(show&&i===(ck.a||0))b.classList.add('hit');
    b.onclick=()=>{if(i===(ck.a||0)){b.classList.add('hit');cc.querySelectorAll('.pt-ch').forEach(z=>z.disabled=true);ckA.querySelector('.ckb').innerHTML='';go.style.display='';}
     else{if(b.classList.contains('ng'))return;b.classList.add('ng');S.miss++;const bk=ck.back||[];ckA.querySelector('.ckb').innerHTML=`<div class="ckback">${ansRowHtml(pa,bk[0]!==undefined?bk[0]:ids[0],bk[1])}</div>`;K(ckA.querySelector('.ckb'));}};cc.appendChild(b);});
   K(ckA);if(show)go.style.display='';};
  const check=()=>{if(holes().every(h=>h.classList.contains('fill')))showCheck();};
  holes().forEach(h=>h.onclick=()=>{if(h.classList.contains('fill'))return;if(h.classList.contains('lock')){h.animate([{transform:'translateX(0)'},{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'translateX(0)'}],{duration:240});return;}
   box.querySelectorAll('.chunk .pick').forEach(z=>z.remove());box.querySelectorAll('.chunk .bl.open').forEach(z=>z.classList.remove('open'));h.classList.add('open');
   const p=decodeURIComponent(h.dataset.c).split('|'),ans=p[0];const row=h.closest('.pr');const pick=document.createElement('div');pick.className='pick pt-chs';row.after(pick);
   shuf(p).forEach(v=>{const b=document.createElement('button');b.className='pt-ch';b.innerHTML=v;b.dataset.v=encodeURIComponent(v);b.onclick=()=>{
     if(v===ans){h.className='bl fill'+(h.dataset.m?' miss':'');h.innerHTML=ans;K(h);pick.remove();const nx=holes().find(z=>!z.classList.contains('fill'));check();}
     else{if(b.classList.contains('ng'))return;b.classList.add('ng');b.disabled=true;h.dataset.m=1;S.miss++;}};pick.appendChild(b);});K(pick);});
  if(show){box.querySelectorAll('.chunk .pr').forEach(r=>{const l=r.querySelector('.lb');if(l&&KEYLB.test(l.textContent.trim()))r.classList.add('keyf');});check();return;}
  const first=!S.seen[x.ci];if(!first)unlock();
  const run=()=>{const my=++TRACE_RUN;traceEls([...box.querySelectorAll('.chunk .pr .pt')],my).then(done=>{if(done){S.seen[x.ci]=1;unlock();}});};
  box.querySelector('.again').onclick=()=>{box.querySelectorAll('.chunk .kc.on,.chunk .kk.on').forEach(z=>z.classList.remove('on'));run();};
  run();check();return;}
 if(x.t==='ok'){const q=(pa.easy&&pa.easy.okq)||`${pa.name}、分かった？`;
  ph.innerHTML=`<div class="phone wu">${top({k:'P',name:'Point'})}${PPROG(pa,'P',pa._nch)}<div class="okbox"><div class="okq">${q}</div><div class="two"><button class="next" data-a="ok">分かった</button><button class="next sub" data-a="ng">まだ分からない</button></div></div></div>`;
  K(ph);ph.querySelector('[data-a=ok]').onclick=goWU;ph.querySelector('[data-a=ng]').onclick=()=>{cur.pt=firstEasy(pa);drawPhone();};return;}
 if(x.t==='easy'||x.t==='sort'){const E=pa.easy,its=E.items||[];const tot=its.length+(E.sort?1:0),k=x.t==='easy'?x.k:its.length;
  const dots=PPROG(pa,'Y',k);
  let body='';
  if(x.t==='easy'){const it=its[x.k];body=`<div class="ezlead">${it.lead||''}</div>${it.fig?`<div class="ezfig">${it.fig}</div>`:''}<div class="stepq">${it.q}</div><div class="pt-chs ezc"></div>`;}
  else{const cats=E.cats||['\\(a\\)','\\(b\\)'];body=`<div class="ezlead">${E.sortq||'どちらに入るか、分けよう'}</div>${E.sort.map((w,j)=>`<div class="ezsort" data-a="${w[1]}"><span>${w[0]}</span><span class="ab">${cats.map((c,ci)=>`<button class="pt-ch" data-c="${ci}">${c}</button>`).join('')}</span></div>`).join('')}`;}
  ph.innerHTML=`<div class="phone ez">${top({k:'Y',name:'やさしい説明'})}${dots}<div class="ezcard">${body}</div><div class="fb"></div><button class="next" style="display:none">次へ</button></div>`;
  K(ph);const go=ph.querySelector('.next'),fb=ph.querySelector('.fb');go.onclick=ptNext;
  if(x.t==='easy'){const it=its[x.k],cc=ph.querySelector('.ezc');(show?it.c.map((_,i)=>i):shuf(it.c.map((_,i)=>i))).forEach(i=>{const b=document.createElement('button');b.className='pt-ch';b.innerHTML=it.c[i];
    b.onclick=()=>{if(i===it.a){b.classList.add('hit');cc.querySelectorAll('.pt-ch').forEach(z=>z.disabled=true);fb.className='fb ok';fb.innerHTML=`<div class="okm">正解！</div>${Array.isArray(it.w)?WTXT(it.w):(it.w||'')}`;K(fb);go.style.display='';}else{b.classList.add('ng');b.disabled=true;}};
    if(show&&i===it.a)setTimeout(()=>b.click(),0);cc.appendChild(b);});K(cc);}
  else{const rows=[...ph.querySelectorAll('.ezsort')];let done=0;rows.forEach(r=>r.querySelectorAll('.pt-ch').forEach(b=>{b.onclick=()=>{if(r.dataset.ok)return;
     if(+b.dataset.c===+r.dataset.a){b.classList.add('hit');r.dataset.ok=1;if(++done===rows.length){fb.className='fb ok';fb.innerHTML='<div class="okm">全部正解！</div>';go.style.display='';}}else{b.classList.add('ng');b.disabled=true;}};
     if(show&&+b.dataset.c===+r.dataset.a)setTimeout(()=>b.click(),0);}));}
  return;}
 if(x.t==='touch'){ph.innerHTML=`<div class="phone ez">${top({k:'Y',name:'さわってみよう'})}${PPROG(pa,'T',0)}<div class="ezlead">${(pa.touch&&pa.touch.lead)||'\\(a\\) と \\(b\\) を動かして、直線がどう変わるか見よう'}</div><div class="eqc"></div><div class="ezfig tfig"></div>
  <div class="sl"><span>\\(a\\)（傾き）</span><input type="range" class="sa" min="-3" max="3" step="1" value="2"><b class="sav"></b></div>
  <div class="sl"><span>\\(b\\)（切片）</span><input type="range" class="sb" min="-4" max="4" step="1" value="-1"><b class="sbv"></b></div><button class="next">WarmUp へ</button></div>`;
  const sa=ph.querySelector('.sa'),sb=ph.querySelector('.sb');const d=()=>{const a=+sa.value,b=+sb.value;ph.querySelector('.sav').textContent=a;ph.querySelector('.sbv').textContent=b;ph.querySelector('.tfig').innerHTML=TGR(a,b);
   ph.querySelector('.eqc').innerHTML=`\\(y=${a===0?'':a===1?'x':a===-1?'-x':a+'x'}${a===0?b:b===0?'':(b<0?'-':'+')+Math.abs(b)}\\)`;K(ph.querySelector('.eqc'));};
  sa.oninput=d;sb.oninput=d;d();K(ph);ph.querySelector('.next').onclick=goWU;return;}
}
/* さわってみよう のグラフ（−5〜5・1マス＝1。切片の点と「右へ1・上へ a」の階段） */
function TGR(a,b){const R=5,U=22,W=(2*R+1)*U,c=W/2,X=x=>c+x*U,Y=y=>c-y*U;let s=`<svg viewBox="0 0 ${W} ${W}" width="230" height="230">`;
 for(let i=-R;i<=R;i++)s+=`<line x1="${X(i)}" y1="0" x2="${X(i)}" y2="${W}" stroke="#e5e7eb"/><line x1="0" y1="${Y(i)}" x2="${W}" y2="${Y(i)}" stroke="#e5e7eb"/>`;
 s+=`<line x1="0" y1="${c}" x2="${W}" y2="${c}" stroke="#111" stroke-width="1.6"/><line x1="${c}" y1="0" x2="${c}" y2="${W}" stroke="#111" stroke-width="1.6"/><text x="${W-10}" y="${c-6}" font-size="12" font-style="italic">x</text><text x="${c+6}" y="12" font-size="12" font-style="italic">y</text><text x="${c-12}" y="${c+14}" font-size="11">O</text>`;
 s+=`<clipPath id="tgc"><rect x="0" y="0" width="${W}" height="${W}"/></clipPath><line clip-path="url(#tgc)" x1="${X(-R-1)}" y1="${Y(a*(-R-1)+b)}" x2="${X(R+1)}" y2="${Y(a*(R+1)+b)}" stroke="#111" stroke-width="2.6"/>`;
 if(a!==0)s+=`<polyline points="${X(0)},${Y(b)} ${X(1)},${Y(b)} ${X(1)},${Y(b+a)}" fill="none" stroke="#111" stroke-width="2.4" stroke-dasharray="5 3"/><text x="${X(1)+5}" y="${Y(b+a/2)+4}" font-size="12" font-weight="700">${a>0?'上へ'+a:'下へ'+(-a)}</text><text x="${X(.5)}" y="${Y(b)+(a>0?15:-6)}" font-size="12" font-weight="700" text-anchor="middle">右へ1</text>`;
 s+=`<circle cx="${X(0)}" cy="${Y(b)}" r="5" fill="#111"/><text x="${X(0)-8}" y="${Y(b)+4}" font-size="12" font-weight="700" text-anchor="end">切片 ${b}</text>`;return s+'</svg>';}
/* ---- 紙のやさしい説明（F-34）：書き込んで答える形。QR は付けない ---- */
function easyPaper(pa,ans){const E=pa.easy;if(!E)return '';let h=`<div data-sel="p${pa.no}-Y"><div class="sec"><span class="tag Y">やさしい説明</span><span style="font-weight:400;font-size:12px">Point で分からなかったら</span></div><div class="ezp">`;
 (E.items||[]).forEach((it,k)=>{h+=`<div class="qi"><div class="qq">${CIRC[k]} ${it.lead||''}</div>${it.fig?`<div class="ezfig p">${it.fig}</div>`:''}<div class="row">${it.q}　${ans?`<span class="ans">${it.c[it.a]}</span>`:'<span class="blank"></span>'}</div></div>`;});
 if(E.sort){const cats=E.cats||['\\(a\\)','\\(b\\)'];h+=`<div class="qi"><div class="qq">${CIRC[(E.items||[]).length]} ${E.sortq||'どちらに入るか、分けよう'}（${cats.join(' か ')}を○で囲む）</div><table class="eztb">${E.sort.map(w=>`<tr><td>${w[0]}</td>${cats.map((c,ci)=>`<td class="${ans&&+w[1]===ci?'ezans':''}">${c}</td>`).join('')}</tr>`).join('')}</table></div>`;}
 return h+'</div></div>';}
/* ---- テストの結果（E-35）：全部の小問を並べ、押すと解説（なぞり）。まちがえた小問は「必ず見る」→ 見ると「見た」。全部見るまで類題は押せない ---- */
let TSEEN={};
/* 直しの進み具合（E-35 ⑦⑧・2026-10-17 02:20）：最後に受けた回の答え・見た解説・類題が済んだか。本番はサーバーに残す。モックはこの端末の中だけ */
const TKEY=opt.tkey||'kwtws_'+decodeURIComponent(location.pathname.split('/').pop())+'_'+TEST.name;
let TSTATE=null,TFRESH=false;try{TSTATE=opt.tstate!==undefined?(opt.tstate||null):JSON.parse(localStorage.getItem(TKEY)||'null');}catch(e){}
const LIVE=()=>!(typeof pvShowAns!=='undefined'&&pvShowAns);
const tSave=()=>{if(!LIVE()||!TSTATE)return;TSTATE.pass=!!((TEST.ver||opt.live)&&TSTATE.got>=80&&tDone(TSTATE));__tSideUpd();if(opt.onTestSubmit){__tSend();return;}try{localStorage.setItem(TKEY,JSON.stringify(TSTATE));}catch(e){}};
const RANGE=()=>TEST.ver?TEST.name.replace(/\s*[ABC]$/,''):'';
/* 同じ範囲の A・B・C のうち、合格したもの（この端末の記録から） */
function rangePass(){if(!TEST.ver)return null;if(opt.rangePass)return opt.rangePass();const r=RANGE();try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!/^kwtws_/.test(k)||/_draft$/.test(k)||k.indexOf(r)<0)continue;const v=JSON.parse(localStorage.getItem(k)||'null');if(v&&v.pass)return k.slice(-1);}}catch(e){}return null;}
const tWrongOf=ans=>TFL.map((x,j)=>ans[j]!==x.st.a?j:-1).filter(j=>j>=0);
const tNoteOk=S=>S.v===2?!!S.note:true;
const tDone=S=>{if(!S)return false;const w=tWrongOf(S.ans);return w.every(j=>S.seen[j])&&(w.length===0||(tNoteOk(S)&&(!S.nq||S.redo)));};
function tFixHtml(){const S=LIVE()&&TSTATE?TSTATE:Object.assign({ans:tans,seen:TSEEN,redo:false,nq:REDO_PLAN.length},TLOC);const w=tWrongOf(S.ans);if(!w.length)return '<div class="tfix done">直し済み（まちがいなし）</div>';
 const sn=w.filter(j=>S.seen[j]).length;if(tDone(S))return '<div class="tfix done">直し済み</div>';
 return `<div class="tfix">直し途中：解説 ${sn} / ${w.length} 見た・ノート ${tNoteOk(S)?'済み':'まだ'}・類題 ${S.nq?(S.redo?'済み':'まだ'):'なし'}</div>`;}
function tPassHtml(got){if(!TEST.ver&&opt.live)return __tPassU(got);if(!TEST.ver)return '';const d=LIVE()&&TSTATE?tDone(TSTATE):false;const rp=LIVE()?rangePass():null;const nx=NEXTV(TEST.ver);
 if(got>=80)return d?`<div class="okm tpass">合格！　${RANGE()}に合格した。</div>`:`<div class="passn tpass">80点以上取れた。直し（解説・ノート・類題）が終わると、${RANGE()}に合格。</div>`;
 if(rp)return `<div class="passn tpass">${RANGE()}は ${rp} で合格している。直しをして、まちがえた所を残さないようにしよう。</div>`;
 return `<div class="passn tpass">まだ合格ではない。直しが終わったら、${nx} で80点以上を目指そう（${RANGE()}は A・B・C のどれかで80点以上を取って直しを終えれば合格）。</div>`;}
function tSideTxt(){if(!LIVE())return '';const rp=rangePass();if(!TSTATE)return rp?`<span class="tst done">${RANGE()}は ${rp} で合格</span>`:'';const d=tDone(TSTATE);return `<span class="tst ${d?'done':''}">${TSTATE.got}点・${d?'直し済み':'直し途中'}${rp?'・範囲は合格':''}</span>`;}
function tlist(js){js=js||TFL.map((x,j)=>j);return js.map(j=>{const x=TFL[j],b=TEST.blocks[x.b],o=tans[j]===x.st.a,st=x.st;const lab=b.ren?`${DN(b.num)}${SN(x.k)}`:b.grp?`${DN(b.num)}${SNB(b,x.k)}`:DN(b.num);
  const fq=String(x.it.q||''),fi=fq.indexOf('<div class="grq">'),fig=fi>=0?fq.slice(fi):'';
  const CV=c=>/<svg/.test(String(c))?'（グラフ）':c;const my=tans[j]===undefined?'未回答':`${KANA[tans[j]]}　${CV(st.c[tans[j]])}`;
  return `<div class="tr ${o?'o':'x'}" data-j="${j}"><button type="button" class="trh"><span class="trm">${o?'○':'×'}</span>${lab}<span class="trq">${(b.ren?SHORT(STRIP(st.s)):SHORT(x.it.q))||SHORT(b.head||'')}</span>${o?'':`<span class="must ${TSEEN[j]?'seen':''}">${TSEEN[j]?'見た':'必ず見る'}</span>`}<span class="tro">解説 ▼</span></button>${o?'':`<div class="tra"><b>正解　${KANA[st.a]}　${CV(st.c[st.a])}</b>${tans[j]===-1?'':`<span class="trmy">あなたは ${tans[j]===undefined?'未回答':KANA[tans[j]]}</span>`}</div>`}<div class="trb" hidden>${fig?`<div class="trfig">${fig}</div>`:''}<div class="trw">${WTXT(st.w)}</div></div></div>`}).join('');}
function tbind(ph){const wrong=TFL.map((x,j)=>tans[j]!==x.st.a?j:-1).filter(j=>j>=0);
 const upd=()=>{const sc=ph.querySelector('.tsc');if(sc)sc.textContent=`${wrong.filter(j=>TSEEN[j]).length} / ${wrong.length} 見た`;const bb=ph.querySelector('.wd1 .w-now b');if(bb)bb.textContent=`${wrong.filter(j=>TSEEN[j]).length}/${wrong.length}`;if(LIVE()&&TSTATE){TSTATE.seen=Object.assign({},TSEEN);tSave();}const f=ph.querySelector('.tfix');if(f)f.outerHTML=tFixHtml();const nb=ph.querySelector('.tsgo[data-need]');if(nb){const ok=wrong.every(j=>TSEEN[j]);nb.disabled=!ok;const hn=ph.querySelector('.tsneed');if(hn)hn.hidden=ok;}const p=ph.querySelector('.tpass');if(p){const got=TFL.filter((x,j)=>tans[j]===x.st.a).length*TEST.pt;p.outerHTML=tPassHtml(got);}};
 ph.querySelectorAll('.tr').forEach(tr=>{const j=+tr.dataset.j,bd=tr.querySelector('.trb');tr.querySelector('.trh').onclick=()=>{bd.hidden=!bd.hidden;tr.querySelector('.tro').textContent=bd.hidden?'解説 ▼':'閉じる ▲';
   if(!bd.hidden){if(!bd.dataset.k){K(bd);bd.dataset.k=1;}const my=++TRACE_RUN;traceEls([...bd.querySelectorAll('.trw .we,.trw .wn,.trw .wt,.trw .eql,.trw .eqr')],my,6000).then(done=>{if(done&&tans[j]!==TFL[j].st.a){TSEEN[j]=1;const m=tr.querySelector('.must');if(m){m.textContent='見た';m.classList.add('seen');}upd();}});}};});
 upd();}

const ALLP=()=>[...(HAS_RV()?[REVIEW]:[]),...PATS.flatMap(pa=>pa.parts)];
if(HAS_RV()){REVIEW.k=REVIEW.k||'R';REVIEW.name=REVIEW.name||'復習パート';}
/* ---- アプリ ---- */
/* ===== 大問と小問（作り方の決まり E-13〜E-16・F-16） =====
   連問（it.ren）＝大問1つ。小問＝it.steps（(1)(2)(3)）
   WarmUp の連問でない問題・ステップが2つ以上の問題＝大問1つ（手助けのステップ）
   それ以外の1問で終わる問題＝となり合うものを「次の問いに答えなさい。」の大問にまとめる（小問＝(1)(2)…）
   大問番号は単元の中で通し。単元まとめテストは1から */
const STRIP=t=>String(t).replace(/^ステップ\s*\d+\s*/,'');
const PLAIN=h=>String(h).replace(/<div class="grq">[\s\S]*$/,'').replace(/<[^>]+>/g,'');
const SHORT=t=>{t=PLAIN(t).replace(/次の問いに答えなさい。?$/,'').replace(/を求めなさい。?$/,'').replace(/なさい。?$/,'').replace(/[。？?]$/,'');
 /* 長いときは、数式の外の区切り（。、）で切る。数式の途中では切らない */
 let vis=0,inM=false,cut=-1;for(let i=0;i<t.length;i++){if(t.startsWith('\\(',i)){inM=true;i++;continue;}if(t.startsWith('\\)',i)){inM=false;i++;vis+=3;continue;}if(!inM){vis++;if((t[i]==='。'||t[i]==='、')&&vis<=48)cut=i;}}
 if(vis<=48)return t;return cut>0?t.slice(0,cut)+'…':t;};
function mkBlocks(items,wu,start){const B=[];let g=null,num=start;
 items.forEach((it,i)=>{const n=(it.steps||[]).length;
  if(it.ren||wu||n>1){B.push({ren:!!it.ren,one:!it.ren,items:[i]});g=null;return;}
  if(!g||g.key!==(it.g||'')){g={grp:true,items:[],key:it.g||'',head:it.gh||'次の問いに答えなさい。'};B.push(g);}g.items.push(i);});
 B.forEach(b=>{if(b.grp&&b.items.length===1&&!items[b.items[0]].gh){b.grp=false;b.one=true;}b.num=++num;});
 const map=[];B.forEach((b,bi)=>b.items.forEach((i,k)=>map[i]={b:bi,k}));
 return {B,map,last:num};}
/* 選択肢の並び：正解の位置が同じに続かないように、問題文から決まる順番で並べかえる（毎回同じ並び。テストは E-10 で並べてあるので触らない。記号で選ぶ pc は並びを変えない） */
{const H=t=>{let h=7;for(const ch of String(t))h=(h*31+ch.charCodeAt(0))>>>0;return h;};let prev=-1;
 ALLP().forEach(P=>P.items.forEach(it=>it.steps.forEach(st=>{if(st.fill||st.pc||!Array.isArray(st.c)||st.c.length<2)return;
  const n=st.c.length;let sh=H(it.q+st.s)%n;if((st.a+sh)%n===prev)sh=(sh+1)%n;
  st.c=st.c.map((_,k)=>st.c[(k-sh+n)%n]);st.a=(st.a+sh)%n;prev=st.a;})));}
{let num=0;if(HAS_RV()){const r=mkBlocks(REVIEW.items,false,num);REVIEW.blocks=r.B;REVIEW.bmap=r.map;num=r.last;}PATS.forEach(pa=>pa.parts.forEach(P=>{const r=mkBlocks(P.items,P.wu,num);P.blocks=r.B;P.bmap=r.map;num=r.last;}));}
/* テストは小問を1列に並べる（1問＝5点） */
TEST.items.forEach(it=>{if(it.ren&&!it.steps)it.steps=it.subs;});
{const r=mkBlocks(TEST.items.map(it=>it.ren?it:{steps:[0],g:it.g,gh:it.gh}),false,0);TEST.blocks=r.B;TEST.bmap=r.map;}
const TFL=[];TEST.items.forEach((it,i)=>{if(it.ren)it.steps.forEach((st,k)=>TFL.push({it,st,i,k,b:TEST.bmap[i].b}));else TFL.push({it,st:it,i,k:TEST.bmap[i].k,b:TEST.bmap[i].b});});
/* 選択肢の見た目の長さ（数式の命令をのぞいた文字数）。短いときだけ3列にする */
const OPTLEN=cs=>Math.max(...cs.map(c=>String(c).replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g,'$1$2').replace(/\\[a-z]+/g,'').replace(/[\\(){} ]/g,'').length));
/* ===== クロトレの単元の一覧（戻る所の正本・作り方の決まり E-25） =====
   問題の back に 'm2c3u4p3'（中2数学 第3章 単元4 パターン3）を書く。名前はここから引くので、パターン名を変えてもテストは直さなくてよい。
   単元を新しく作ったら、ここに1行足す。クロトレに教材が無い所（前の章など）は back を書かない */
const KWT_UNITS={m2c3:{title:'中2数学 1次関数',units:{
 1:{name:'文章を式にする',file:'20261016_モック_単元ワークシート_中2数学_単元1パターン1.html',p:{1:'言葉の式を作る',2:'表で見分ける',3:'式の形で見分ける'}},
 2:{name:'直線の式を求める',file:'20261016_モック_単元ワークシート_中2数学_単元2.html',p:{1:'a と b を読み取る',2:'1点を代入して b を出す',3:'2点から求める'}},
 3:{name:'変域',file:'20261016_モック_単元ワークシート_中2数学_単元3.html',p:{1:'y の変域を求める',2:'線分のグラフを読む・かく',3:'変域から式の文字を求める'}},
 4:{name:'交点と面積',file:'20261016_モック_単元ワークシート_中2数学_単元4.html',p:{1:'2直線の交点',2:'x 軸・y 軸との交点',3:'三角形の面積',4:'中点と面積を2等分する直線'}},
 5:{name:'グラフを読む利用問題',file:'20261016_モック_単元ワークシート_中2数学_単元5.html',p:{1:'文章から式を作って使う',2:'グラフを読む・単位の直し方',3:'動点'}}}}};
const BACK=id=>{const m=/^(m\d+c\d+)u(\d+)p(\d+)$/.exec(id||'');if(!m)return null;const C=KWT_UNITS[m[1]];const U=C&&C.units[m[2]];if(!U||!U.p[m[3]])return null;return {id,u:+m[2],p:+m[3],name:`${CIRC[+m[2]-1]}${U.name} › ${U.p[m[3]]}`,file:U.file};};
const DN=n=>`<span class="dn">${n}</span>`;
const SN=k=>`<span class="sn">(${k+1})</span>`;
/* 小問が1つだけの大問では (1) を付けない */
const SNB=(b,k)=>b.items.length>1?SN(k):'';
const NAV=[];if(HAS_RV())NAV.push({rv:true});PATS.forEach((pa,pi)=>pa.parts.forEach((p,k)=>NAV.push({pi,k})));NAV.push({test:true});
let cur={n:0,i:0,s:0,pt:0},tans=[];
const curPart=()=>{const v=NAV[cur.n];return v.test?TEST:v.rv?REVIEW:PATS[v.pi].parts[v.k]};
const curPat=()=>{const v=NAV[cur.n];return (v.test||v.rv)?null:PATS[v.pi]};
const navName=n=>{const v=NAV[n%NAV.length];return v.test?TEST.name:v.rv?REVIEW.name:`パターン${PATS[v.pi].no} ${PATS[v.pi].parts[v.k].name}`};
let RV={miss:new Set(),round:null};
const isRV=P=>typeof REVIEW!=='undefined'&&P===REVIEW;
function RVORD(P,st){const o=st.c.map((_,k)=>k);if(!(isRV(P)&&RV.round))return __ord(st,o);for(let t=0;t<20;t++){const r=shuf(o);if(r.indexOf(st.a)!==o.indexOf(st.a))return r;}return o.slice(1).concat(o[0]);}
function goPart(n){RV={miss:new Set(),round:null};cur={n:n%NAV.length,i:0,s:0,pt:0};tans=[];TSEEN={};TRACE_RUN++;__enter(true);appView();}
/* パートの一覧（2026-10-17 16:23 川上さん「パートがどこで分かれているか分からない。スマホの教材パートを選ぶ所を再現して」）。
   本番のワークシートを開いた画面と同じ区切り：復習パート／パターンごとに「Point・WarmUp・Try」「Exercise」「Exercise＋」／単元まとめテスト */
const PDKEY=g=>'kwtws_'+decodeURIComponent(location.pathname.split('/').pop())+'_done_'+g;
const pdGet=g=>{if(opt.done)return !!opt.done(__gPid(g));try{return localStorage.getItem(PDKEY(g))==='1';}catch(e){return false;}};
const pdSet=g=>{if(typeof LIVE==='function'&&!LIVE())return;if(opt.onPartDone){__partDone(g);return;}try{localStorage.setItem(PDKEY(g),'1');}catch(e){}};
function PGROUPS(){const G=[];if(HAS_RV())G.push({g:'rv',pno:'',name:REVIEW.name,sub:'',ns:[NAV.findIndex(x=>x.rv)]});
 PATS.forEach((pa,pi)=>{const ns=k=>NAV.findIndex(x=>x.pi===pi&&x.k===k);const ks=pa.parts.map((p,k)=>[p,k]);
  const a=ks.filter(([p])=>p.wu||p.k==='T').map(([p,k])=>ns(k)),e=ks.filter(([p])=>p.k==='E').map(([p,k])=>ns(k)),ep=ks.filter(([p])=>p.k==='EP').map(([p,k])=>ns(k));
  if(a.length)G.push({g:'p'+pi+'a',pno:PNO(pa.no),name:pa.name,sub:'Point・WarmUp・Try',ns:a});
  if(e.length)G.push({g:'p'+pi+'e',pno:PNO(pa.no),name:pa.name,sub:'Exercise',ns:e});
  if(ep.length)G.push({g:'p'+pi+'p',pno:PNO(pa.no),name:pa.name,sub:'Exercise＋',ns:ep,opt:1});});
 return G;}
/* 2026-10-17 16:35 川上さん「いいね」：パターンごとに1枚のカード。中に ①学ぶ ②練習 ③もっと練習。役割は日本語、英語の名前は小さく右に */
const NOTE1='<ul class="wsnote"><li>ノートと鉛筆を用意しよう。</li><li>計算はノートに書いてから答えを選ぼう。</li></ul>';
const ROLE={a:['学ぶ','Point・WarmUp・Try'],e:['練習','Exercise'],p:['もっと練習','Exercise＋']};
function ROLETXT(pa,P){if(P.k==='R'||(typeof REVIEW!=='undefined'&&P===REVIEW))return '前回の内容と、大事な計算のおさらい。まちがえた問題は最後にもう一度出て、全問正解で終わる';
 if(P.k==='E')return '同じやり方の問題を、1人で解く';if(P.k==='EP')return '同じやり方の問題を、もっと解いて力をつける（宿題にもなる）';
 const t=pa&&pa.parts.find(q=>q.k==='T');return `やり方を読んで、先生と一緒に1問、自分で${t?t.items.length:4}問`;}
const WSGO=(d,t,c)=>d?`<span class="wsgo"><span class="wsd ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg> できた</span></span>`:`<span class="wsgo"><span class="${c||'wsd'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16l13 -8z"/></svg> ${t}</span><span class="wsar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/></svg></span></span>`;
function appView(){
 const v=document.getElementById('v-app');const G=PGROUPS();const req=G,dn=req.filter(x=>pdGet(x.g)).length;
 let side=`<div class="wsh"><div class="wst">${BOOK} ${UTN()}</div><div class="wss"><span class="wsb">ワークシート</span>できたパート ${dn} / ${req.length}</div><div class="wsbar"><i style="width:${req.length?Math.round(dn/req.length*100):0}%"></i></div></div>`;
 const row=(x,lab,sub,cnt)=>{const on=x.ns.includes(cur.n),d=pdGet(x.g);return `<button type="button" class="wsr ${on?'on':''}" data-n="${x.ns[0]}"><span class="wsm"><b>${lab}</b><span class="wsu">${sub}${cnt?`　${cnt}`:''}</span></span>${WSGO(d,'まだ')}</button>`;};
 G.filter(x=>x.g==='rv').forEach(x=>{side+=`<div class="wsc">${row(x,REVIEW.name,`前回の内容と、大事な計算のおさらい<br>${REVIEW.items.length}題・全問正解で終わり`,'')}</div>`;});
 PATS.forEach((pa,pi)=>{const gs=G.filter(x=>x.g.indexOf('p'+pi)===0);if(!gs.length)return;const rq=gs.filter(x=>!x.opt),d=rq.filter(x=>pdGet(x.g)).length;
  side+=`<div class="wsc"><div class="wsch">${PNO(pa.no)} <b>${pa.name}</b></div>`;
  gs.forEach((x,k)=>{const t=x.g.slice(-1),r=ROLE[t];const P0=NAV[x.ns[0]]&&!NAV[x.ns[0]].test&&!NAV[x.ns[0]].rv?PATS[NAV[x.ns[0]].pi].parts[NAV[x.ns[0]].k]:null;
   side+=row(x,`${CIRC[k]} ${r[0]}`,r[1],t==='a'?'':(P0?P0.items.length+'題':''));});
  side+='</div>';});
 const tn=NAV.length-1;side+=`<div class="wsc"><button type="button" class="wsr wst2 ${tn===cur.n?'on':''}" data-n="${tn}"><span class="wsm"><b>${TEST.name}</b><span class="wsu">${TFL.length}問・${TEST.min||20}分・80点で合格</span>${tSideTxt()}</span>${WSGO(false,'受ける','wsd '+__tRdy())}</button></div>`;
 v.innerHTML=`<div class="app ${opt.live?'live '+(__mv==='list'?'ml':'mq'):''}"><div class="side ws">${side}</div><div class="phw">${opt.live&&opt.innerBack!==false?'<div class="wsbk"><button type="button" class="wsbkb">← パートの一覧</button></div>':''}<div id="ph"></div></div></div>`;{const bk=v.querySelector('.wsbkb');if(bk)bk.onclick=()=>{__mv='list';appView();try{v.scrollIntoView();}catch(e){}};}
 K(v.querySelector('.side'));
 v.querySelectorAll('.side button').forEach(b=>b.onclick=()=>{__mv='q';goPart(+b.dataset.n);try{v.scrollIntoView();}catch(e){}});
 drawPhone();
}
function nextBtn(ph,P,it){
 const last=isRV(P)?(cur.s===it.steps.length-1&&(RV.round?RV.round.indexOf(cur.i)===RV.round.length-1:cur.i===P.items.length-1)&&!RV.miss.size):cur.s===it.steps.length-1&&cur.i===P.items.length-1;
 const nb=document.createElement('button');nb.className='next';nb.textContent=last?`次へ：${navName(cur.n+1)}`:'次へ';
 nb.onclick=()=>{if(cur.s<it.steps.length-1)cur.s++;
 else if(isRV(P)){const seq=RV.round||P.items.map((_,j)=>j),pos=seq.indexOf(cur.i);
  if(pos<seq.length-1){cur.i=seq[pos+1];cur.s=0;}
  else if(RV.miss.size){RV.round=[...RV.miss].sort((a,b)=>a-b);RV.miss=new Set();cur.i=RV.round[0];cur.s=0;}
  else{pdSet('rv');RV={miss:new Set(),round:null};goPart(cur.n+1);return}}
 else if(cur.i<P.items.length-1){cur.i++;cur.s=0}else{const g=PGROUPS().find(x=>x.ns[x.ns.length-1]===cur.n);if(g)pdSet(g.g);goPart(cur.n+1);return}drawPhone()};
 ph.querySelector('.phone').appendChild(nb);
}
var drawPhone=function(){
 const P=curPart(),pa=curPat(),ph=document.getElementById('ph');
 if(P.test)return drawTest(ph);
 if(P.wu&&cur.pt<PSL(pa).length)return drawPoint(ph,pa,P);
 TRACE_RUN++;
 const it=P.items[cur.i],st=it.steps[cur.s];
 const bm=P.bmap[cur.i],blk=P.blocks[bm.b];
 const ansTxt=x=>x.fill?blHtml(x.t,'done'):x.c[x.a];
 let qh,doneSteps='',stq=STRIP(st.s);
 if(blk.ren){qh=`<div class="q">${DN(blk.num)}${it.q}<div class="sqs">${it.steps.map((x,k)=>`<div class="sq ${k<cur.s?'fin':k===cur.s?'cur':'fut'}">${SN(k)}${STRIP(x.s)}${k<cur.s?`<span class="sa">${ansTxt(x)}</span>`:k===cur.s?'<span class="now">いまここ</span>':''}</div>`).join('')}</div></div>`;stq=`${SN(cur.s)}${STRIP(st.s)}`;}
 else if(blk.grp){qh=`<div class="q">${DN(blk.num)}${blk.head}<div class="gq">${SNB(blk,bm.k)}${it.q}</div></div>`;}
 else{qh=`<div class="q">${DN(blk.num)}${it.q}</div>`;doneSteps=it.steps.slice(0,cur.s).map((x,k)=>`<div>ステップ${k+1}　${STRIP(x.s).replace(/（ ）をうめよう/,'')}：<b>${ansTxt(x)}</b></div>`).join('');if(it.steps.length>1)stq=`ステップ${cur.s+1}　${STRIP(st.s)}`;}
 const head=`<div class="prog"><span class="tag ${P.k}">${P.name}</span>　${pa?PNO(pa.no):''}${P.wu?'　（先生と一緒に）':''}${P.wu?'<button class="peek" type="button">Point を見る</button>':''}</div>${P.wu&&pa?PPROG(pa,'W',cur.s):WPROG(pa,P)}${cur.i===0&&cur.s===0&&!P.wu&&P.k!=='T'?`<div class="wsrole">${P.k==='E'?'② 練習':P.k==='EP'?'③ もっと練習':P.name}：${ROLETXT(pa,P)}${NOTE1}</div>`:''}${qh}${doneSteps?`<div class="done">${doneSteps}</div>`:''}`;
 if(st.fill){
  ph.innerHTML=`<div class="phone ${P.wu?'wu':''}">${head}<div class="stepq">${stq}</div><div class="fillbox">${blHtml(st.t,'app')}<div class="pt-left"></div><div class="pt-pick"><div class="pt-chs"></div></div></div><div class="fb"></div></div>`;
  K(ph);fillRun(ph.querySelector('.fillbox'),()=>{const fb=ph.querySelector('.fb');fb.className='fb ok';fb.innerHTML=`<div class="okm">うまった！</div>${WTXT(st.w)}`;K(fb);nextBtn(ph,P,it);});return}
 ph.innerHTML=`<div class="phone ${P.wu?'wu':''}">${head}<div class="stepq">${blk.ren?'':stq}</div>${needCalc(st.w)?CALC:''}<div class="ch ${st.c.some(c=>c.length>14)?'long':''}">${RVORD(P,st).map(k=>`<button data-k="${k}">${st.c[k]}</button>`).join('')}</div><div class="fb"></div></div>`;
 K(ph);
 ph.querySelectorAll('.ch button').forEach(b=>b.onclick=()=>{
  const k=+b.dataset.k,fb=ph.querySelector('.fb');__first(P,it,st,k===st.a);__fx(k===st.a,cur.n+'_'+cur.i+'_'+cur.s,null);
  if(k===st.a){b.classList.add('ok');fb.className='fb ok';fb.innerHTML=`<div class="okm">正解！</div>${WTXT(st.w)}`;ph.querySelectorAll('.ch button').forEach(x=>x.disabled=true);nextBtn(ph,P,it);}
  else if(isRV(P)){RV.miss.add(cur.i);b.classList.add('ng');ph.querySelector(`.ch button[data-k="${st.a}"]`).classList.add('ok');ph.querySelectorAll('.ch button').forEach(x=>x.disabled=true);fb.className='fb ng';fb.innerHTML=`<div>正解は ${st.c[st.a]}（緑の枠）。解説を読もう。この問題は、あとでもう一度出る。</div>${WTXT(st.w)}`;nextBtn(ph,P,it);}
  else{b.classList.add('ng');fb.className='fb ng';fb.innerHTML='もう一度。'+(P.wu?'先生と一緒に確かめよう。<div style="font-size:13px">右上の「Point を見る」で確かめられる。</div>':'<div style="font-size:13px">式をもう一度たどってみよう。</div>');}
  K(fb);
 });
}
/* ===== スマホで横にはみ出す物を収める（2026-10-18 川上さん「Point の図がスマホではみ出す」）=====
   ①はみ出した Point の行（.pr）があるカードだけ、札を上・中身を下にして横幅を空ける ②それでもはみ出す図（SVG）は幅に合わせて縮める
   ③表・縦の式・筆算・長い数式は zoom で縮める（0.55 倍まで）。はみ出していない物は触らない＝PC の画面と紙は今までどおり */
function __fit(el){if(!el||!el.getBoundingClientRect().width)return;
 el.querySelectorAll('.pr.stk').forEach(e=>e.classList.remove('stk'));
 el.querySelectorAll('[data-fz]').forEach(e=>{e.style.zoom='';e.style.width='';e.style.height='';e.removeAttribute('data-fz');});
 el.querySelectorAll('.pr').forEach(pr=>{const t=pr.querySelector(':scope>.pt');if(t&&t.scrollWidth>t.clientWidth+1)pr.classList.add('stk');});
 el.querySelectorAll('.pr.stk').forEach(pr=>{const c=pr.closest('.pc');if(c)c.querySelectorAll('.pr').forEach(x=>x.classList.add('stk'));}); /* 同じカードの行は並べ方をそろえる */
 /* 入れ物＝いちばん近いブロックの箱。使える幅＝その箱の中身の右端から、この物の左端まで（行の途中から始まる数式もはかれる） */
 const box=e=>{let p=e.parentElement;while(p&&p!==el&&/^inline/.test(getComputedStyle(p).display))p=p.parentElement;return p;};
 const avl=(e,r)=>{const p=box(e);if(!p)return 1e9;const pr=p.getBoundingClientRect(),cs=getComputedStyle(p);return pr.left+p.clientLeft+p.clientWidth-(parseFloat(cs.paddingRight)||0)-r.left;};
 const C=[...el.querySelectorAll('svg,table,.eqg,.pt>span,.katex-display,.katex')].filter(e=>!(e.parentElement&&e.parentElement.closest('.katex'))&&!e.closest('.ch'));
 C.forEach(e=>{if(C.some(a=>a!==e&&a.contains(e)&&a.hasAttribute('data-fz')))return;const r=e.getBoundingClientRect();if(!r.width)return;const a=avl(e,r),w=Math.max(r.width,e.scrollWidth||0);if(!(w>a+1)||a<=0)return;
  const vb=e.tagName.toLowerCase()==='svg'&&e.viewBox&&e.viewBox.baseVal&&e.viewBox.baseVal.width;
  if(vb){e.style.width=a+'px';e.style.height=(r.height*a/r.width)+'px';}else e.style.zoom=String(Math.max(0.55,Math.floor(a/w*1000)/1000));
  e.setAttribute('data-fz','1');});}
/* 描いたあと・字の読み込みのあと・幅や高さが変わったとき（答えて解説が出た・Point のなぞりで行が出た）に __fit */
function __fitL(el){if(!el)return;__fit(el);try{requestAnimationFrame(()=>__fit(el));}catch(e){}
 try{const FD=window.document;if(FD.fonts&&FD.fonts.status!=='loaded')FD.fonts.ready.then(()=>__fit(el));}catch(e){}
 if(!el.__fro&&typeof ResizeObserver!=='undefined'){let lw=0,q=0;let lh=0;el.__fro=new ResizeObserver(()=>{if(q)return;q=1;requestAnimationFrame(()=>{q=0;const w=el.clientWidth,h=el.scrollHeight;if(w!==lw||h!==lh){lw=w;__fit(el);lh=el.scrollHeight;}});});el.__fro.observe(el);}}
/* ページ（問題・Point の区切り・テストの画面）が替わったら、いちばん上へ（2026-10-18 川上さん）。答えて解説が出ただけでは動かさない。
   本番は Shadow DOM の外の箱（生徒アプリの #ws-host）が動くので、外まで上って scrollTop を0にする */
function __toTop(){const ph=document.getElementById('ph');if(!ph)return;let e=ph;
 while(e){const p=e.parentNode;e=p&&p.nodeType===11?p.host:p;if(!e||e.nodeType!==1)break;const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowY)&&e.scrollTop>0)e.scrollTop=0;}
 try{const r=ph.getBoundingClientRect();if(window.scrollY>0&&r.top<0)window.scrollTo(0,Math.max(0,window.scrollY+r.top-8));}catch(e){}}
{const _dpF=drawPhone;let _pk=null;drawPhone=function(){const r=_dpF.apply(this,arguments);
 try{const P=curPart();const k=(P&&P.test)?['t',cur.n,cur.i,cur.s,cur.pt].join('_'):[cur.n,cur.i,cur.pt,RV&&RV.round?RV.round.join(','):''].join('_');if(k!==_pk){_pk=k;__toTop();}}catch(e){}
 __fitL(document.getElementById('ph'));return r;};}
/* WarmUp だけ Point を見られる（2026-10-16 川上さん。Try・Exercise・テストでは見せない） */
document.addEventListener('click',e=>{const b=e.target.closest('.peek');if(!b)return;const pa=curPat();if(!pa)return;
 const ov=document.createElement('div');ov.className='peekov';const _P=curPart(),_st=_P&&_P.items&&_P.items[cur.i]&&_P.items[cur.i].steps[cur.s];ov.innerHTML=`<div class="peekin"><div class="peekh"><b>Point</b>　${pa.point.title}<button type="button" class="peekx">閉じる</button></div>${_st&&_st.pk?_st.pk.map(r=>ansRowHtml(pa,r[0],r[1])).join(''):pa.point.cards.map(c=>pointCardHtml(c,'ans')).join('').replace(/id="/g,'id="pk_').replace(/url\(#/g,'url(#pk_')}</div>`;
 document.body.appendChild(ov);K(ov);__fitL(ov.querySelector('.peekin'));ov.addEventListener('click',ev=>{if(ev.target===ov||ev.target.closest('.peekx'))ov.remove();});});
/* テストの結果：大問ごとの点と、TEST.secs（小問の数で区切る。例 [{name:'前の章',n:6},{name:'1次関数',n:14}]）ごとの点（2026-10-16 川上さん ④推奨で OK） */
function TSUM(){const T=TEST;const okAt=j=>tans[j]===TFL[j].st.a;
 const bl=T.blocks.map((b,bi)=>{const js=TFL.map((x,j)=>x.b===bi?j:-1).filter(j=>j>=0);const got=js.filter(okAt).length*T.pt;return `<tr><td>${DN(b.num)}</td><td>${(()=>{const bs=js.map(j=>(TFL[j].st.back||TFL[j].it.back)||'');const B=bs.every(x=>x&&x===bs[0])?BACK(bs[0]):null;return B?B.name:(b.grp?b.head:SHORT(T.items[b.items[0]].q));})()}</td><td style="text-align:right;white-space:nowrap">${got} / ${js.length*T.pt}</td></tr>`;}).join('');
 let sec='';if(T.secs){let j0=0;sec='<div class="tsec">'+T.secs.map(c=>{const js=[...Array(c.n).keys()].map(k=>k+j0);j0+=c.n;return `<span>${c.name} <b>${js.filter(okAt).length*T.pt}</b> / ${c.n*T.pt}</span>`;}).join('')+'</div>';}
 const miss={};TFL.forEach((x,j)=>{if(okAt(j))return;const B=BACK(x.st.back||x.it.back);if(!B)return;(miss[B.id]=miss[B.id]||{B,n:0}).n++;});
 const ms=Object.values(miss).sort((a,b)=>b.n-a.n).slice(0,3);
 const got=TFL.filter((x,j)=>okAt(j)).length*T.pt;
 REDO_PLAN=redoPlan(ms);const nq=REDO_PLAN.reduce((a,x)=>a+x.it.steps.length,0);
 const wr=TFL.map((x,j)=>okAt(j)?-1:j).filter(j=>j>=0),rt=TFL.map((x,j)=>okAt(j)?j:-1).filter(j=>j>=0);
 return {bl,sec,ms,nq,got,wr,rt};}
/* ===== 採点後の画面（2026-10-19 川上さん「解いてる時のような感じで、何をやるのかはっきり」）=====
   上に進み具合のバー（問題を解くときと同じ wd1）。やることを1つずつ出す：
   ①丸つけ（紙で解いたとき＝自動採点・○×入力のどちらも。2026-10-19 16:10 川上さん「丸つけして点数を書こうで統一」）→ ②解説 → ③ノート → ④類題 → 旗（このあと）。
   アプリで受けたときは①を飛ばす。どこまで済んだかは TSTATE（本番）／TLOC（モック）に残す */
let TSTEP=null,TLOC={};
const TSR=()=>LIVE()&&TSTATE?TSTATE:TLOC;
function tSteps(R){const S=TSR(),L=[];
 if(S.paper)L.push({k:'mark',ic:'pen',t:'丸つけ',done:!!S.mark});
 if(R.wr.length){const sn=R.wr.filter(j=>TSEEN[j]).length;L.push({k:'read',ic:'book',t:'解説',done:sn===R.wr.length,c:`${sn}/${R.wr.length}`});
  L.push({k:'note',ic:'note',t:'ノート',done:tNoteOk(S)});
  if(R.nq)L.push({k:'redo',ic:'rep',t:'類題',done:!!S.redo});}
 else L.push({k:'read',ic:'book',t:'解説',done:true,opt:1});
 return L;}
const TLAB=j=>{const x=TFL[j],b=TEST.blocks[x.b];return b.ren?`${DN(b.num)}${SN(x.k)}`:b.grp?`${DN(b.num)}${SNB(b,x.k)}`:DN(b.num);};
function drawTRes(ph,ok,ov){const T=TEST,R=TSUM(),S=TSR(),L=tSteps(R),pp=S.paper||'';
 if(TSTEP===null||TSTEP>L.length){const i=L.findIndex(x=>!x.done&&!x.opt);TSTEP=i<0?L.length:i;}
 const at=TSTEP,st=L[at];
 const bar=WD1(L.map((x,i)=>({cls:i===at?'now':x.done?'done':'',ic:x.ic,t:(i===at&&x.k==='read'&&!x.opt)?`解説 <b>${x.c}</b>`:x.t,v:0})).concat([at>=L.length?{cls:'now',ic:'flag',t:'このあと'}:WD1G]));
 const head=`<div class="trs"><div class="score">${ok*T.pt}点 <span>／100点</span></div>${__tDelta(ok*T.pt)}${ov?`<div class="tover">時間切れ（制限時間を ${mmss(ov)} こえた）</div>`:''}${ok===TFL.length?'<div class="okm" style="text-align:center">全問正解！おめでとう</div>':''}</div>`;
 const no=at+1,card=(t,d,body,btn)=>`<div class="tstep tcur"><div class="tsh"><span class="tsno">${no}</span>${t}</div>${d?`<div class="tsd">${d}</div>`:''}${body||''}${btn||''}</div>`;
 /* ①を飛ばしたときは、なぜ飛ばしたかを1行で */
 const lead=(at===0&&st&&st.k!=='mark')?`<div class="tlead">${pp?'':'採点はアプリが済ませた。'}次は${st.k==='read'&&!st.opt?'まちがえた問題の解説を読もう。':'解説を見よう。'}</div>`:'';
 let h='';
 const PASS=!st&&R.got>=80&&tDone(Object.assign({ans:tans,seen:TSEEN},S)),POP=PASS&&!S.stamp;
 if(!st){h=`<div class="tstep tcur tnext"><div class="tsh">このあと</div>${tPassHtml(R.got)||`<div class="passn tpass">${R.wr.length?(tDone(Object.assign({ans:tans,seen:TSEEN},S))?'直し済み。':'直しが残っている。上のバーで残りを確かめよう。'):'直し済み。'}</div>`}${tFixHtml()}<button class="next sub tagain">このテストをもう一度受ける</button></div><details class="tdet"><summary>大問ごとの点</summary>${R.sec}<table class="tsum">${R.bl}</table></details>`;}
 else if(st.k==='mark'){const rows=T.blocks.map((b,bi)=>`<div class="tmr"><div class="tmn">${DN(b.num)}</div><div class="tmc">${tJs(bi).map(j=>{const o=tans[j]===TFL[j].st.a;const sb=b.ren?SN(TFL[j].k):b.grp?SNB(b,TFL[j].k):'';return `<span class="tmx ${o?'o':'x'}">${sb}<b>${o?'○':'×'}</b></span>`;}).join('')}</div></div>`).join('');
  h=card('丸つけして点数を書こう',`答えを書いた紙（解答用紙・ノート・プリント）に○×をつけて、上に <b>${ok*T.pt}点</b> と書こう。`,`<div class="tmk">${rows}</div>`,`<button class="next tsgo" data-go="mark">丸つけした</button>`);}
 else if(st.k==='read'&&!st.opt){const all=R.wr.every(j=>TSEEN[j]);
  h=card(`まちがえた問題の解説を読もう<span class="tsc">${R.wr.filter(j=>TSEEN[j]).length} / ${R.wr.length} 見た</span>`,'押すと解説が開く。×の解説を全部読むと、次へ進める。',tlist(R.wr)+(R.rt.length?`<details class="tdet tok"><summary>○の問題の解説も見る</summary><div class="tsd">勘で合っていた問題があれば読んでおこう。</div>${tlist(R.rt)}</details>`:''),`<div class="tsneed" ${all?'hidden':''}>まだ読んでいない解説がある</div><button class="next tsgo" data-go="read" data-need="1" ${all?'':'disabled'}>次へ</button>`);}
 else if(st.k==='read'){h=card('解説を見よう','全問正解。勘で合っていた問題があれば、押して解説を読んでおこう。',tlist(),`<button class="next tsgo" data-go="read">次へ</button>`);}
 else if(st.k==='note'){h=card('ノートにもう一度解こう',`解説を閉じて、まちがえた ${R.wr.length}問を自分の力でノートに解き直そう。解けたら下のボタンを押す。`,`<div class="tnl">${R.wr.map(j=>`<div class="tnr">${TLAB(j)}<span class="trq">${(TEST.blocks[TFL[j].b].ren?SHORT(STRIP(TFL[j].st.s)):SHORT(TFL[j].it.q))}</span></div>`).join('')}</div>`,`<button class="next tsgo" data-go="note">解き直した</button>`);}
 else if(st.k==='redo'){h=card('類題を解こう',`まちがえた所から ${R.nq}問。同じ型の問題で、できるようになったかを確かめる。`,R.ms.map(m=>`<div class="redor"><span>${m.B.name}</span><span class="redon">× ${m.n}問</span></div>`).join(''),`<button type="button" class="next redogo" data-n="${R.nq}">類題 ${R.nq}問</button>`);}
 const back=at>0?`<button type="button" class="tsback">← ひとつ前にもどる</button>`:'';
 if(POP){S.stamp=true;if(LIVE()&&TSTATE)tSave();}
 ph.innerHTML=`<div class="phone tres"><div class="prog"><span class="tag X">${T.name}</span></div>${PASS?`<div class="hanko${POP?' pop':''}"><span>合格</span></div>`:''}${head}${bar}${lead}${h}${back}</div>`;
 K(ph);tbind(ph);
 const ag=ph.querySelector('.tagain');if(ag)ag.onclick=()=>{TFRESH=true;TSTEP=null;goPart(cur.n);};
 ph.querySelectorAll('.tsgo').forEach(b=>b.onclick=()=>{const k=b.dataset.go,S=TSR();if(k==='mark')S.mark=true;if(k==='note')S.note=true;if(LIVE()&&TSTATE)tSave();TSTEP=null;drawTRes(ph,ok,ov);try{ph.scrollIntoView({block:'start'});}catch(e){}});
 const bk=ph.querySelector('.tsback');if(bk)bk.onclick=()=>{TSTEP=at-1;drawTRes(ph,ok,ov);};}
/* ===== やり直し（作り方の決まり E-27）：まちがえた戻る所ごとに、そのパターンの Try・Exercise（POOL）から類題。最大5問。まちがえたら同じパターンからもう1問 ===== */
const NEXTV=v=>({A:'B',B:'C',C:'A'})[v]||'B';
let REDO_PLAN=[],REDO=null;
const POOLOF=id=>(typeof POOL!=='undefined'&&POOL[id])?POOL[id]:[];
const H32=t=>{let h=7;for(const ch of String(t))h=(h*31+ch.charCodeAt(0))>>>0;return h;};
function redoPlan(ms){const out=[];let n=0;const used=new Set();
 ms.forEach((m,mi)=>{const pool=POOLOF(m.B.id).slice().sort((a,b)=>H32(a.q+mi)-H32(b.q+mi));const want=mi===0?2:1;let k=0;
  for(const it of pool){if(k>=want||n>=5)break;if(n+it.steps.length>5&&out.length)continue;out.push({id:m.B.id,it});used.add(it.q);n+=it.steps.length;k++;}});
 return out;}
function redoNext(id,usedQ){const pool=POOLOF(id).filter(it=>!usedQ.has(it.q)&&it.steps.length===1);return pool.length?pool[H32(id+usedQ.size)%pool.length]:null;}
function drawRedo(ph){const L=REDO.list;
 if(REDO.i>=L.length){ph.innerHTML=`<div class="phone"><div class="prog"><span class="tag X">${TEST.name}</span>　やり直し</div><div class="score" style="font-size:28px">類題 おわり！</div>${(()=>{if(LIVE()&&TSTATE){TSTATE.redo=true;tSave();}return tFixHtml()+tPassHtml(REDO.got);})()}<button class="next">結果にもどる</button></div>`;
  ph.querySelector('.next').onclick=()=>{REDO=null;TSTEP=null;drawPhone();};return;}
 const x=L[REDO.i],it=x.it,st=it.steps[REDO.s],B=BACK(x.id);
 const ren=it.steps.length>1;
 const sq=ren?`<div class="sqs">${it.steps.map((y,k)=>`<div class="sq ${k<REDO.s?'fin':k===REDO.s?'cur':'fut'}">${SN(k)}${STRIP(y.s)}${k===REDO.s?'<span class="now">いまここ</span>':''}</div>`).join('')}</div>`:'';
 ph.innerHTML=`<div class="phone"><div class="prog"><span class="tag X">やり直し</span>　${B?B.name:''}</div>${WD1([{cls:'now',ic:'pen',t:`類題 <b>${REDO.i+1}/${L.length}</b>`,v:REDO.i/L.length},WD1G])}<div class="q">${it.q}${sq}</div><div class="stepq">${ren?'':STRIP(st.s)}</div>${needCalc(st.w)?CALC:''}<div class="ch ${st.c.some(c=>String(c).length>14)?'long':''}">${st.c.map((c,k)=>`<button data-k="${k}">${c}</button>`).join('')}</div><div class="fb"></div></div>`;
 K(ph);ph.querySelectorAll('.ch button').forEach(b=>b.onclick=()=>{const k=+b.dataset.k,fb=ph.querySelector('.fb');ph.querySelectorAll('.ch button').forEach(z=>z.disabled=true);__fx(k===st.a,'r'+REDO.i+'_'+REDO.s,REDO);
  if(k===st.a){b.classList.add('ok');fb.className='fb ok';fb.innerHTML=`<div class="okm">正解！</div>${WTXT(st.w)}`;}
  else{b.classList.add('ng');ph.querySelectorAll('.ch button')[st.a].classList.add('ok');fb.className='fb ng';fb.innerHTML=`<div>解説を読んで、同じ型をもう1問。</div>${WTXT(st.w)}`;
   if(!REDO.extra[x.id]){const more=redoNext(x.id,REDO.used);if(more){REDO.extra[x.id]=1;REDO.used.add(more.q);L.splice(REDO.i+1,0,{id:x.id,it:more});}}}
  K(fb);const nb=document.createElement('button');nb.className='next';nb.textContent='次へ';nb.onclick=()=>{if(REDO.s<it.steps.length-1)REDO.s++;else{REDO.i++;REDO.s=0;}drawRedo(ph);};ph.querySelector('.phone').appendChild(nb);});}
{const _drF=drawRedo;drawRedo=function(ph){__toTop();const r=_drF.apply(this,arguments);__fitL(ph);return r;};} /* 類題も1問ごとに上へ・はみ出しを収める（2026-10-18）*/
document.addEventListener('click',e=>{if(!e.target.closest('.redogo'))return;const ph=document.getElementById('ph');const got=TFL.filter((x,j)=>tans[j]===x.st.a).length*TEST.pt;
 REDO={list:REDO_PLAN.map(x=>({id:x.id,it:x.it})),i:0,s:0,extra:{},used:new Set(REDO_PLAN.map(x=>x.it.q)),got};drawRedo(ph);});
function drawTest(ph){if(__PAPER)return __drawPaper(ph);
 const T=TEST;
 if(cur.i===0&&cur.s===0&&!tans.length&&!TFRESH&&LIVE()&&TSTATE){__tPerm(TSTATE.perm||null);tans=TSTATE.ans.map(a=>a===null?undefined:a);TSEEN=Object.assign({},TSTATE.seen);cur.i=TFL.length;cur.loaded=true;}
 if(cur.i>=TFL.length){const ok=TFL.filter((x,j)=>tans[j]===x.st.a).length;const ov=cur.loaded&&TSTATE?(TSTATE.over||0):(window._tOver||0);
  if(!cur.loaded){TSUM();TSTEP=null;TLOC={v:2,note:false,mark:false,paper:''};}
  if(!cur.loaded&&LIVE()){__tNew=true;TSTATE={prev:(TSTATE&&TSTATE.got!=null?TSTATE.got:null),got:ok*T.pt,ans:tans.slice(),seen:{},redo:false,nq:REDO_PLAN.length,over:window._tOver||0,perm:__TP,paper:__tPaperMode||'',at:new Date().toLocaleString('ja-JP'),v:2,note:false,mark:false};TFRESH=false;cur.loaded=true;tSave();}
  cur.loaded=true;drawTRes(ph,ok,ov);return}
 return drawTestTaking(ph);
}
/* ===== テストの解き方（E-36・2026-10-17 02:40 川上さん）：開始画面 → 大問ごとの画面（番号の帯で行き来・選び直せる・正誤は出さない）→ 見直し → ［提出して採点］ ===== */
const TDKEY=()=>TKEY+'_draft';
let TEL=0,TDRAFT=null;
function tDraftLoad(){try{return JSON.parse(localStorage.getItem(TDKEY())||'null');}catch(e){return null;}}
function tDraftSave(){if(!LIVE())return;try{localStorage.setItem(TDKEY(),JSON.stringify({ans:tans.slice(),el:TEL,perm:__TP}));}catch(e){}__tProg();}
function tDraftClear(){try{localStorage.removeItem(TDKEY());}catch(e){}}
const tJs=bi=>TFL.map((x,j)=>x.b===bi?j:-1).filter(j=>j>=0);
const tUnans=()=>TFL.map((x,j)=>tans[j]===undefined?j:-1).filter(j=>j>=0);
const mmss=ms=>{const s=Math.floor(Math.abs(ms)/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
function tTimeHtml(){const lim=(TEST.min||20)*60000,left=lim-TEL;return left>=0?`<span class="ttime">残り ${mmss(left)}</span>`:`<span class="ttime over">時間切れ ＋${mmss(-left)}</span>`;}
setInterval(()=>{const el=document.querySelector('#ph .ttime');if(!el||!LIVE())return;TEL+=1000;el.outerHTML=tTimeHtml();if((TEL/1000)%5===0)tDraftSave();},1000);
function tStrip(){const B=TEST.blocks;return `<div class="tstrip">${B.map((b,bi)=>{const js=tJs(bi),n=js.filter(j=>tans[j]!==undefined).length;return `<button type="button" data-s="${bi+1}" class="${cur.s===bi+1?'on ':''}${n===js.length?'done':n?'part':''}">${b.num}</button>`;}).join('')}<button type="button" data-s="${B.length+1}" class="rv ${cur.s===B.length+1?'on':''}">見直し</button></div>`;}
function drawTestTaking(ph){const T=TEST,B=T.blocks,show=!LIVE();
 const head=`<div class="prog"><span class="tag X">${T.name}</span>　${TFL.length}問（各${T.pt}点）${cur.s>0?'　'+tTimeHtml():''}</div>`;
 /* 開始画面 */
 if(cur.s===0){const d=LIVE()?tDraftLoad():null;
  ph.innerHTML=`<div class="phone"><div class="tstart"><div class="tsn">${T.name}</div><div class="tsr">${HEAD1()}</div>
  <table class="tsinfo"><tr><th>問題</th><td>${B.length}題（小問 ${TFL.length}問）</td></tr><tr><th>配点</th><td>各${T.pt}点（100点満点）</td></tr><tr><th>制限時間</th><td>${T.min||20}分</td></tr></table>
  <ul class="tsl"><li>ノートと鉛筆を用意しよう。</li><li>計算はノートに書いてから答えを選ぼう。</li></ul>
  ${d?`<div class="tsd">前の続きがあります（答えた問題 ${d.ans.filter(a=>a!==undefined&&a!==null).length} / ${TFL.length}・${mmss(d.el)} 経過）</div><button class="next" data-a="cont">続きから</button> <button class="next sub" data-a="new">はじめから</button>`:`<button class="next tsgo" data-a="new">準備ができたらスタート</button>`}</div></div>`;
  ph.querySelectorAll('[data-a]').forEach(bt=>bt.onclick=()=>{if(bt.dataset.a==='cont'){tans=d.ans.map(a=>a===null?undefined:a);TEL=d.el;__tPerm(d.perm||null);}else{tans=[];TEL=0;tDraftClear();__tPerm('new');}cur.s=1;if(opt.live&&opt.onTestStart){try{opt.onTestStart(TEST.part_id);}catch(e){}}drawPhone();});K(ph);return;}
 /* 見直し */
 if(cur.s===B.length+1){const un=tUnans();
  const rows=TFL.map((x,j)=>{const b=B[x.b];const lab=b.ren?`${DN(b.num)}${SN(x.k)}`:b.grp?`${DN(b.num)}${SNB(b,x.k)}`:DN(b.num);const a=tans[j];
   return `<button type="button" class="tvr ${a===undefined?'un':''}" data-s="${x.b+1}">${lab}<span class="tva">${a===undefined?'未回答':KANA[a]+'　'+x.st.c[a]}</span></button>`;}).join('');
  ph.innerHTML=`<div class="phone">${head}${tStrip()}<div class="tvh">見直し${un.length?`<span class="tvu">未回答 ${un.length}問</span>`:'<span class="tvok">全部答えた</span>'}</div><div class="tvl">${rows}</div><div class="tconf"></div><button class="next tsub">提出して採点</button></div>`;
  K(ph);bindStrip(ph);ph.querySelectorAll('.tvr').forEach(r=>r.onclick=()=>{cur.s=+r.dataset.s;drawPhone();});
  ph.querySelector('.tsub').onclick=()=>{const u=tUnans().length;const cf=ph.querySelector('.tconf');
   if(u&&!cf.innerHTML){cf.innerHTML=`<div class="tcf">未回答が ${u}問あります。このまま提出しますか？<div class="two"><button class="next" data-a="go">提出する</button><button class="next sub" data-a="back">もどる</button></div></div>`;
    cf.querySelector('[data-a=go]').onclick=tSubmit;cf.querySelector('[data-a=back]').onclick=()=>{cf.innerHTML='';};return;}
   tSubmit();};return;}
 /* 大問の画面 */
 const bi=cur.s-1,b=B[bi],js=tJs(bi),it0=TFL[js[0]].it;
 const q=b.ren?`<div class="q">${DN(b.num)}${it0.q}</div>`:b.grp?`<div class="q">${DN(b.num)}${b.head}</div>`:`<div class="q">${DN(b.num)}${it0.q}</div>`;
 const subs=js.map(j=>{const x=TFL[j],st=x.st;const sq=b.ren?`${SN(x.k)}${STRIP(st.s)}`:b.grp?`${SNB(b,x.k)}${x.it.q}`:(x.it.ins||T.ins||'');
  return `<div class="tsq" data-j="${j}"><div class="stepq">${sq}</div>${needCalc(st.w)?CALC:''}<div class="ch ${st.c.some(c=>String(c).length>14)?'long':''}">${st.c.map((c,k)=>`<button data-k="${k}" class="${tans[j]===k?'sel':''}${show&&k===st.a?' ok':''}">${KANA[k]}　${c}</button>`).join('')}</div></div>`;}).join('');
 const last=bi===B.length-1;
 ph.innerHTML=`<div class="phone">${head}${tStrip()}${q}${subs}<div class="tnav">${bi>0?'<button class="next sub" data-a="prev">◀ 前の大問</button>':''}<button class="next" data-a="next">${last?'見直しへ':'次の大問 ▶'}</button></div></div>`;
 K(ph);bindStrip(ph);
 ph.querySelectorAll('.tsq').forEach(sq=>{const j=+sq.dataset.j;sq.querySelectorAll('.ch button').forEach(bt=>bt.onclick=()=>{tans[j]=+bt.dataset.k;sq.querySelectorAll('.ch button').forEach(z=>z.classList.toggle('sel',z===bt));tDraftSave();const st=ph.querySelector('.tstrip');if(st){st.outerHTML=tStrip();bindStrip(ph);}});});
 ph.querySelectorAll('.tnav [data-a]').forEach(bt=>bt.onclick=()=>{cur.s+=bt.dataset.a==='prev'?-1:1;drawPhone();ph.scrollIntoView&&window.scrollTo(0,0);});}
function bindStrip(ph){ph.querySelectorAll('.tstrip button').forEach(bt=>bt.onclick=()=>{cur.s=+bt.dataset.s;drawPhone();});}
function tSubmit(){const over=TEL-(TEST.min||20)*60000;TFRESH=false;cur.i=TFL.length;cur.loaded=false;tDraftClear();window._tOver=over>0?over:0;drawPhone();}

/* ---- 紙 ---- */
const KANA='アイウエオカキク';
const blankFor=(s)=>s.s.includes('言葉の式')?'<span class="blank w"></span>':'<span class="blank"></span>';
function stepPaper(s,P,ans,L){
 const lab=L!==undefined?L:s.s.replace(/^ステップ(\d)\s*/,'ステップ$1　');
 if(s.fill)return ans?`<div class="row">${lab}</div><div class="row">${blHtml(s.t,'ans')}</div><div class="exp">${WTXT(s.w)}</div>`:`<div class="row">${lab}</div><div class="row">${blHtml(s.t,'paper')}</div>`;
 if(s.pc){const opts=s.c.map((c,k)=>`${KANA[k]} ${c}`).join('　');return ans?`<div class="row">${P.k==='E'?'':lab+'　'}<span class="ans">${KANA[s.a]} ${s.c[s.a]}</span></div><div class="exp">${WTXT(s.w)}</div>`:`<div class="row">${P.k==='E'?'':lab+'　'}<span class="opts">${opts}</span>　記号 <span class="blank s"></span></div>`;}
 if(P.k==='E')return ans?`<div class="row"><span class="ans">${s.c[s.a]}</span></div><div class="exp">${WTXT(s.w)}</div>`:(/^\\\(y=/.test(s.c[s.a])?`<div class="row">\\(y=\\) <span class="blank"></span></div>`:`<div class="row">${s.s.replace(/は？$/,'')}：<span class="blank w"></span></div>`)+`<div class="memo s">計算</div>`;
 return ans?`<div class="row">${lab}　<span class="ans">${s.c[s.a]}</span></div><div class="exp">${WTXT(s.w)}</div>`:`<div class="row">${lab}　${blankFor(s)}</div>`;
}
const pointAns=pa=>`<div class="pans"><b style="color:var(--p)">Point の答え</b>${pa.point.cards.map(c=>{let n=0;const a=[];c.rows.forEach(r=>{String(r.t).replace(BLRE,(m,g)=>{n++;a.push(`${'①②③④⑤⑥'[n-1]} ${g.split('|')[0]}`);return m;});});return a.length?`<div>${c.h}：${a.join('　')}</div>`:'';}).join('')}</div>`;
const UT=()=>typeof UNIT_TITLE!=='undefined'?UNIT_TITLE:'単元1'+' 文章を式にする';
/* 小問（連問の (1)(2)・まとめた (1)(2)）の答え欄 */
function subPaper(st,P,ans,lab){
 if(st.fill)return ans?`<div class="row">${lab}${blHtml(st.t,'ans')}</div><div class="exp">${WTXT(st.w)}</div>`:`<div class="row">${lab}${blHtml(st.t,'paper')}</div>`;
 if(st.pc){const opts=st.c.map((c,k)=>`${KANA[k]} ${c}`).join('　');return ans?`<div class="row">${lab}<span class="ans">${KANA[st.a]} ${st.c[st.a]}</span></div><div class="exp">${WTXT(st.w)}</div>`:`<div class="row">${lab}<span class="opts">${opts}</span>　記号 <span class="blank s"></span></div>`;}
 const isY=/^\\\(y=/.test(st.c[st.a]);
 return ans?`<div class="row">${lab}<span class="ans">${st.c[st.a]}</span></div><div class="exp">${WTXT(st.w)}</div>`:`<div class="row">${lab}${isY?'\\(y=\\) <span class="blank"></span>':'<span class="blank w"></span>'}</div>`;
}
/* 問題文の図を右の計算欄と横に並べる。幅が足りなければ計算欄は図の下に回る（flex-wrap） */
const QFIG=(head,q,cls)=>{const i=String(q).indexOf('<div class="grq">');if(i<0)return {h:`<div class="qq${cls||''}">${head}${q}</div>`,fig:false};
 return {h:`<div class="qq${cls||''}">${head}${q.slice(0,i)}</div><div class="fgrow">${q.slice(i)}<div class="memo fm">計算</div></div>`,fig:true};};
const NOMEMO=h=>h.replace(/<div class="memo s">計算<\/div>/g,'');
function blockPaper(P,b,ans){
 const its=b.items.map(i=>P.items[i]);let h='';
 const memo=(!ans&&P.k!=='W')?'<div class="memo s">計算</div>':'';
 if(b.ren){const it=its[0];
  if(ans){h+=`<div class="qi"><div class="ah">${DN(b.num)}<span class="st">${SHORT(it.q)}</span></div>`;it.steps.forEach((st,k)=>{h+=`<div class="qs"><div class="ah sqp">${SN(k)}<span class="st">${SHORT(STRIP(st.s))}</span></div>${subPaper(st,P,true,'')}</div>`;});return h+'</div>';}
  const F=QFIG(DN(b.num),it.q);h+=`<div class="qi qm dq">${F.h}`;it.steps.forEach((st,k)=>{h+=`<div class="qs"><div class="sqp">${SN(k)}${STRIP(st.s)}</div>${subPaper(st,P,false,'')}</div>`;});return h+(F.fig?'':memo)+'</div>';}
 if(b.grp){
  if(ans){h+=`<div class="ah">${DN(b.num)}<span class="st">${b.head}</span></div>`;its.forEach((it,k)=>{const st=it.steps[0];h+=`<div class="qi"><div class="ah sqp">${SN(k)}<span class="st">${SHORT(it.q)}</span></div>${subPaper(st,P,true,'')}</div>`;});return h;}
  h+=`<div class="qq gh">${DN(b.num)}${b.head}</div>`;its.forEach((it,k)=>{const st=it.steps[0];const F=QFIG(SN(k),it.q,' sqp');h+=`<div class="qi">${F.h}${subPaper(st,P,false,'')}${F.fig?'':memo}</div>`;});return h;}
 const it=its[0];const multi=it.steps.length>1;
 if(ans){h+=`<div class="qi${multi?' qm':''}"><div class="ah">${DN(b.num)}<span class="st">${SHORT(it.q)}</span></div>`;it.steps.forEach((st,k)=>{h+=`<div class="qs">${stepPaper(st,P,true,multi?`ステップ${k+1}　${STRIP(st.s)}`:STRIP(st.s))}</div>`;});return h+'</div>';}
 const F=QFIG(DN(b.num),it.q);h+=`<div class="qi${multi?' qm':''}">${F.h}`;it.steps.forEach((st,k)=>{const sp=stepPaper(st,P,false,multi?`ステップ${k+1}　${STRIP(st.s)}`:STRIP(st.s));h+=`<div class="qs">${F.fig?NOMEMO(sp):sp}</div>`;});
 return h+(!F.fig&&P.k==='T'?'<div class="memo s">計算</div>':'')+'</div>';
}
function paper(ans){
 const kk=ans?'a':'q';let h='';
 if(HAS_RV()){h+=`<div class="sheet" data-sel="rv" style="page:${kk}r"><div class="sh-top"><div class="t">${HEAD1()}<br><span class="tt">${REVIEW.name}</span><span class="kind">${ans?'解答解説':'問題用紙'}</span></div>${ans?'':'<div class="f">日付 <span></span> 名前 <span style="min-width:110px"></span></div>'}</div>${ans?'<div class="acol">':''}<div class="sec"><span class="tag R">${REVIEW.name}</span><span style="font-weight:400;font-size:12px">${REVIEW.sub||'前に習ったことを思い出そう'}</span></div>`;REVIEW.blocks.forEach(b=>{h+=blockPaper(REVIEW,b,ans);});h+=(ans?'</div>':'')+'</div>';}
 PATS.forEach(pa=>{
  h+=`<div class="sheet" data-pat="${pa.no}" style="page:${kk}p${pa.no}"><div class="sh-top"><div class="t">${HEAD1()}<br><span class="tt"><span class="pnb">パターン${pa.no}</span>${pa.name}</span>${ans?'<span class="kind">解答解説</span>':'<span class="kind">問題用紙</span>'}</div>${ans?'':'<div class="f">日付 <span></span> 名前 <span style="min-width:110px"></span></div>'}</div>`;
  h+=`<div data-sel="p${pa.no}-P">`+(ans?pointAns(pa):`<div class="pbox"><b style="color:var(--p)">Point</b>　${pa.point.title}　（ ）に入るものを書こう<div class="pgrid">${pa.point.cards.map(c=>pointCardHtml(c,'paper')).join('')}</div>${pa.hj?`<div style="font-size:12px">はじき：${HJ_TXT}</div>`:''}<div style="font-size:12px">${pa.point.foot}</div></div>`)+'</div>';
  h+=easyPaper(pa,ans);
  if(ans)h+='<div class="acol">';
  pa.parts.forEach(P=>{
   const sub=P.wu?'先生と一緒に解こう':P.k==='T'?'自分で解こう':P.k==='EP'?'自分で解こう（順番はばらばら・宿題にもできる）':'自分で解こう（順番はばらばら）';
   h+=`<div data-sel="p${pa.no}-${P.k==='EP'?'EP':'Q'}"><div class="sec"><span class="tag ${P.k}">${P.name}</span><span style="font-weight:400;font-size:12px">${sub}</span></div>`;
   P.blocks.forEach(b=>{h+=blockPaper(P,b,ans);});
   h+='</div>';
  });
  if(ans)h+='</div>';
  h+='</div>';
 });
 const TT=`<div class="sh-top"><div class="t">${HEAD1()}<br><span class="tt">${String(TEST.name).replace(/）([A-C])$/,'）<span class="tv">$1</span>')}</span>${ans?'<span class="kind">解答解説</span>':'<span class="kind">問題用紙</span>'}<div class="tinfo">配点：各5点（100点満点）／ 制限時間：${TEST.min||20}分</div></div>${ans?'':'<div class="f">名前 <span style="min-width:110px"></span></div>'}</div>`;
 h+=`<div class="sheet" data-sel="test" style="page:${kk}t">${TT}${ans?'<div class="acol">':`<div style="font-size:13px;margin-bottom:4px">正しいものを、ア〜カから1つずつ選び、解答用紙に記号で答えなさい。</div>`}`;
 const tsub=(st,lab,bk)=>ans?`<div class="row">${lab}<span class="ans">${KANA[st.a]} ${st.c[st.a]}</span>　（5点）</div><div class="exp">${WTXT(st.w)}</div>${BACK(bk)?`<div class="bk">戻る所：${BACK(bk).name}</div>`:''}`:`<div class="row">${lab}</div><div class="opt6${OPTLEN(st.c)<=14?' c3':''}">${st.c.map((c,k)=>`<div>${KANA[k]}　${c}</div>`).join('')}</div>${needCalc(st.w)?`<div class="tcalc"><div class="memo tm">計算</div></div>`:''}`;
 TEST.blocks.forEach(b=>{const its=b.items.map(i=>TEST.items[i]);
  if(b.ren){const it=its[0];h+=ans?`<div class="ah">${DN(b.num)}<span class="st">${SHORT(it.q)}</span></div>`:QFIG(DN(b.num),it.q,' dq').h;it.steps.forEach((st,k)=>{h+=`<div class="qi">${ans?`<div class="ah sqp">${SN(k)}<span class="st">${SHORT(STRIP(st.s))}</span></div>`:`<div class="sqp">${SN(k)}${STRIP(st.s)}</div>`}${tsub(st,'',st.back||it.back)}</div>`;});return;}
  if(b.grp){h+=`<div class="qq gh">${DN(b.num)}${ans?`<span class="st">${b.head}</span>`:b.head}</div>`;its.forEach((it,k)=>{h+=`<div class="qi">${ans?`<div class="ah sqp">${SNB(b,k)}<span class="st">${SHORT(it.q)}</span></div>`:QFIG(SNB(b,k),it.q,' sqp').h}${tsub(it,'',it.back)}</div>`;});return;}
  const it=its[0];h+=`<div class="qi">${ans?`<div class="ah">${DN(b.num)}<span class="st">${SHORT(it.q)}</span></div>`:QFIG(DN(b.num),it.q).h}${tsub(it,'',it.back)}</div>`;});
 h+=(ans?'</div>':'')+'</div>';
 if(!ans){let g='';TEST.blocks.forEach((b,bi)=>{const js=TFL.map((x,j)=>x.b===bi?j:-1).filter(j=>j>=0);g+=`<div class="asrow"><div class="asn">${DN(b.num)}</div><div class="ascells">${js.map((j,k)=>`<div class="ascell"><span>${js.length>1?`(${k+1})`:''}</span><b></b></div>`).join('')}</div></div>`;});
  h+=`<div class="sheet asheet" data-sel="ansheet" style="page:qs"><div class="sh-top"><div class="t">${HEAD1()}<br><span class="tt">${String(TEST.name).replace(/）([A-C])$/,'）<span class="tv">$1</span>')}</span><span class="kind">解答用紙</span><div class="tinfo">配点：各5点（100点満点）／ 制限時間：${TEST.min||20}分</div></div><div class="f">日付 <span></span> 名前 <span style="min-width:110px"></span> 点数 <span></span>／100</div></div><div class="asbody"><div class="qr">QR<br><span>（本番では、読むと答えを入れる画面が開く）</span></div><div class="asnote">答えは記号（ア〜カ）で書く。</div></div>${g}</div>`;}
 return h;
}
/* ページの上（単元・パターン）と下（問題 5／20）＝作り方の決まり F-17。名前つきのページで切りかえる */
(function(){const TXT=t=>String(t).replace(/\\\(|\\\)/g,'').replace(/\\[a-z]+/g,'').replace(/[{}"]/g,'');const ut=TXT(UTN()||BOOK);let css='';
 const top=t=>`@top-left{content:"${t}";font-size:9pt;color:#333;vertical-align:bottom;padding-bottom:2mm}`;
 const bot=l=>`@bottom-center{content:"${l} " counter(page) "／" counter(pages);font-size:9pt;color:#333}`;
 PATS.forEach(pa=>{['q','a'].forEach(k=>{css+=`@page ${k}p${pa.no}{${top(`${ut}／パターン${pa.no}｜${TXT(pa.name)}`)}${bot(k==='q'?'問題用紙':'解答解説')}}\n`;});});
 if(HAS_RV())['q','a'].forEach(k=>{css+=`@page ${k}r{${top(`${ut}／${TXT(REVIEW.name)}`)}${bot(k==='q'?'問題用紙':'解答解説')}}\n`;});
 ['q','a'].forEach(k=>{css+=`@page ${k}t{${top(`${ut}／${TXT(TEST.name)}`)}${bot(k==='q'?'問題用紙':'解答解説')}}\n`;});css+=`@page qs{${top(`${ut}／${TXT(TEST.name)}`)}${bot('解答用紙')}}\n`;
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);})();
document.getElementById('v-q').innerHTML=paper(false);
document.getElementById('v-a').innerHTML=paper(true);
/* 印刷の選択（作り方の決まり F-19）：通し／カット／抜粋。問題用紙と解答解説で同じ選び方 */
const SEL={};
function selApply(){document.querySelectorAll('[data-sel]').forEach(e=>e.classList.toggle('cut',SEL[e.dataset.sel]===false));
 document.querySelectorAll('.sheet[data-pat]').forEach(sh=>{const ks=[...sh.querySelectorAll('[data-sel]')];sh.classList.toggle('cut',ks.length>0&&ks.every(e=>e.classList.contains('cut')));});}
function selPanel(){const d=document.getElementById('selp');const cb=(k,nm)=>`<label><input type="checkbox" data-k="${k}" ${SEL[k]===false?'':'checked'}> ${nm}</label>`;
 let h='<b>印刷するところ</b>（チェックを外すと印刷しない。問題番号は変わらない。ページ番号は刷った束の中で通し）<table>';
 if(HAS_RV())h+=`<tr><td>はじめに</td><td colspan="4">${cb('rv',REVIEW.name)}</td></tr>`;
 PATS.forEach(pa=>{const hasEP=pa.parts.some(P=>P.k==='EP');h+=`<tr><td>パターン${pa.no} ${pa.name}</td><td>${cb('p'+pa.no+'-P','Point')}</td><td>${pa.easy?cb('p'+pa.no+'-Y','やさしい説明'):''}</td><td>${cb('p'+pa.no+'-Q','WarmUp・Try・Exercise')}</td><td>${hasEP?cb('p'+pa.no+'-EP','Exercise＋'):''}</td></tr>`;});
 h+=`<tr><td>まとめ</td><td colspan="3">${cb('test',TEST.name+'（問題用紙・解答解説）')}</td><td>${cb('ansheet','解答用紙')}</td></tr></table><div class="sb"><button type="button" data-a="all">全部選ぶ</button><button type="button" data-a="none">全部外す</button><button type="button" data-a="test">テストだけ</button><button type="button" data-a="ws">テストを外す</button>${PATS.some(pa=>pa.parts.some(P=>P.k==='EP'))?'<button type="button" data-a="ep">Exercise＋だけ（宿題）</button>':''}<button type="button" class="pr" data-a="print">この内容で印刷</button></div>`;
 d.innerHTML=h;K(d);
 d.querySelectorAll('input').forEach(c=>c.onchange=()=>{SEL[c.dataset.k]=c.checked;selApply();});
 d.querySelectorAll('.sb button').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='print'){window.print();return;}
  d.querySelectorAll('input').forEach(c=>{const k=c.dataset.k;SEL[k]=a==='all'?true:a==='none'?false:a==='test'?(k==='test'||k==='ansheet'):a==='ep'?/-EP$/.test(k):(k!=='test'&&k!=='ansheet');});selPanel();selApply();});}
selPanel();
document.querySelectorAll('.bar button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.bar button').forEach(x=>x.classList.toggle('on',x===b));
 ['app','q','a'].forEach(k=>document.getElementById('v-'+k).hidden=(k!==b.dataset.v));document.getElementById('selp').hidden=(b.dataset.v==='app');const pb=document.getElementById('pv-bar');if(pb)pb.style.display=(b.dataset.v==='app'?'':'none');
});
/* ===== 先生用プレビューと同じ送り（◀ ▶）2026-10-16 川上さん「モックの原則」 =====
   解かずに全画面を順に見られる。「答え・解説を出す」を入れると、穴は埋めた状態・選択肢は正解を押した状態で出る */
const SCR=[];
NAV.forEach((v,n)=>{if(v.rv){REVIEW.items.forEach((it,i)=>it.steps.forEach((st,s)=>SCR.push({n,i,s,pt:99})));return;}if(v.test){for(let k=0;k<=TEST.blocks.length+1;k++)SCR.push({n,i:0,s:k,pt:99});SCR.push({n,i:TFL.length,s:0,pt:99});return;}
 const pa=PATS[v.pi],P=pa.parts[v.k];if(P.wu)PSL(pa).forEach((x,k)=>SCR.push({n,i:0,s:0,pt:k}));
 P.items.forEach((it,i)=>it.steps.forEach((st,s)=>SCR.push({n,i,s,pt:99})));});
let pvShowAns=true;
const scrIdx=()=>SCR.findIndex(x=>x.n===cur.n&&x.i===cur.i&&x.s===cur.s&&(x.pt===cur.pt||(x.pt===99&&cur.pt>=99)));
function pvGo(k){k=Math.max(0,Math.min(SCR.length-1,k));const x=SCR[k];const prevN=cur.n;cur={n:x.n,i:x.i,s:x.s,pt:x.pt};
 if(NAV[x.n].test&&x.i<TFL.length)tans=pvShowAns?TFL.map(y=>y.st.a):[];
 if(NAV[x.n].test&&x.i>=TFL.length)tans=TFL.map((y,i)=>pvShowAns?(i%4===1?(y.st.a+1)%6:y.st.a):undefined);
 if(prevN!==x.n||!document.querySelector('#ph'))appView();else{document.querySelectorAll('.side button').forEach(b=>b.classList.toggle('on',+b.dataset.n===cur.n));drawPhone();}}
function pvAuto(){
 if(!pvShowAns)return;const ph=document.getElementById('ph');if(!ph)return;
 const bls=ph.querySelectorAll('.bl:not(.fill)');
 if(bls.length){bls.forEach(b=>{const a=decodeURIComponent(b.dataset.c).split('|')[0];b.className='bl fill';b.innerHTML=a;});K(ph);
  const pk=ph.querySelector('.pt-pick');if(pk)pk.remove();const l=ph.querySelector('.pt-left');if(l)l.textContent='';
  const go=ph.querySelector('.phone > .next');if(go)go.disabled=false;
  const P=curPart();if(!P.test&&!(P.wu&&cur.pt<99)){const st=P.items[cur.i].steps[cur.s];if(st.fill){const fb=ph.querySelector('.fb');fb.className='fb ok';fb.innerHTML=`<div class="okm">うまった！</div>${WTXT(st.w)}`;K(fb);}}
 }
 const P=curPart();
 if(P.test)return;
 if(P.wu&&cur.pt<99)return;
 const st=P.items[cur.i].steps[cur.s];if(!st.fill){const b=ph.querySelectorAll('.ch button')[st.a];if(b&&!b.disabled)b.click();}
}
function pvBar(){
 const d=document.createElement('div');d.id='pv-bar';
 d.innerHTML='<button type="button" id="pv-p10">◀◀</button><button type="button" id="pv-prev">◀</button><span id="pv-pos"></span><button type="button" id="pv-next">▶</button><button type="button" id="pv-n10">▶▶</button><label><input type="checkbox" id="pv-ans" checked> 答え・解説を出す</label><span class="pvn">プレビュー（解かずに送れる）</span>';
 document.body.appendChild(d);
 const pos=()=>{const k=scrIdx();document.getElementById('pv-pos').textContent=`${k+1} / ${SCR.length}　${navName(cur.n)}`;};
 document.getElementById('pv-prev').onclick=()=>{pvGo(scrIdx()-1)};document.getElementById('pv-next').onclick=()=>{pvGo(scrIdx()+1)};
 document.getElementById('pv-p10').onclick=()=>{const k=scrIdx();const n=SCR.findIndex(x=>x.n===cur.n);pvGo(n<k?n:SCR.findIndex(x=>x.n===Math.max(0,cur.n-1)))};
 document.getElementById('pv-n10').onclick=()=>{const k=SCR.findIndex(x=>x.n===cur.n+1);pvGo(k<0?SCR.length-1:k)};
 const a=document.getElementById('pv-ans');a.onchange=()=>{pvShowAns=a.checked;appView();};if(/[?&]live/.test(location.search)||/^#live$/.test(location.hash)){a.checked=false;pvShowAns=false;}
 const _dp=drawPhone;drawPhone=function(){_dp.apply(this,arguments);try{pvAuto()}catch(e){console.log(e)}pos();};
 document.addEventListener('keydown',e=>{if(document.getElementById('v-app').hidden)return;if(e.key==='ArrowRight')pvGo(scrIdx()+1);if(e.key==='ArrowLeft')pvGo(scrIdx()-1);});
 pos();
}

const __WS_BOOT=()=>{appView();{const m=/^#p(\d+)$/.exec(location.hash);if(m){const pi=PATS.findIndex(pa=>pa.no===+m[1]);const n=NAV.findIndex(v=>!v.test&&v.pi===pi&&PATS[v.pi].parts[v.k].k==='T');if(n>=0)goPart(n);}}K(document.getElementById('v-q'));K(document.getElementById('v-a'))};

/* 紙：中身がカードの幅に入らないカードは横いっぱいに広げる */
setInterval(()=>document.querySelectorAll('.pgrid .pc').forEach(c=>{if(!c.style.gridColumn&&c.scrollWidth>c.clientWidth+2){c.style.gridColumn='1/-1';c.classList.add('wide');}}),400);

/* ===== 紙（先生画面の練習プリントの窓で使う・2026-10-18 段③）=====
   モックの paper()（#v-q・#v-a に書いたもの）をそのまま渡す。ページの上の帯の文字（F-17）と、範囲の選択（selPanel と同じ行）も返す */
function __paperBand(sh){const TXT=t=>String(t).replace(/\\\(|\\\)/g,'').replace(/\\[a-z]+/g,'').replace(/[{}"]/g,'');const ut=TXT(UTN()||BOOK);
 const sel=sh.getAttribute('data-sel'),pat=sh.getAttribute('data-pat');
 if(pat){const pa=PATS.find(x=>String(x.no)===String(pat));return pa?`${ut}／パターン${pa.no}｜${TXT(pa.name)}`:ut;}
 if(sel==='rv')return `${ut}／${TXT(REVIEW.name)}`;
 if(sel==='test'||sel==='ansheet')return `${ut}／${TXT(TEST.name)}`;
 return ut;}
function __selRows(){const R=[];if(HAS_RV())R.push({t:'はじめに',ks:[['rv',REVIEW.name]]});
 PATS.forEach(pa=>{const hasEP=pa.parts.some(P=>P.k==='EP');const ks=[['p'+pa.no+'-P','Point']];if(pa.easy)ks.push(['p'+pa.no+'-Y','やさしい説明']);ks.push(['p'+pa.no+'-Q','WarmUp・Try・Exercise']);if(hasEP)ks.push(['p'+pa.no+'-EP','Exercise＋']);R.push({t:'パターン'+pa.no+' '+pa.name,ks:ks});});
 R.push({t:'まとめ',ks:[['test',TEST.name+'（問題用紙・解答解説）'],['ansheet','解答用紙']]});return R;}
/* ===== 本番のつなぎ口（mkapp.py の live_patch.py が足す・2026-10-17 段③） =====
   opt.live＝生徒アプリ。opt.done(part_id)→できたか／opt.onPartDone(part_id, 記録)／opt.onRush()→適当押しのポップ／
   opt.shuffle＝選択肢を毎回入れかえる／opt.resumeKey＝続きからの保存の名前／opt.capMs＝1問の時間の上限 */
var __mv='list';
function __gOf(n){const G=PGROUPS();return G.find(x=>x.ns.includes(n))||null;}
function __gPid(g){const x=PGROUPS().find(y=>y.g===g);if(!x)return null;const v=NAV[x.ns[0]];const P=v.test?TEST:v.rv?REVIEW:PATS[v.pi].parts[v.k];return P&&P.part_id||null;}
let __S=null;
function __newS(g){return {g,pid:__gPid(g),tot:0,ok:0,miss:[],wids:[],act:0,t0:Date.now(),hid:0,rw:0,pops:0,run:0,seen:{}};}
function __enter(u){const x=__gOf(cur.n);const g=x?x.g:null;if(!__S||__S.g!==g){__S=g?__newS(g):null;if(u&&__S&&opt.live&&opt.onStart){try{opt.onStart(__S.pid);}catch(e){}}}}
let __shownAt=Date.now();
function __first(P,it,st,ok){if(!opt.live||!LIVE())return;if(!__S)__enter();if(!__S)return;
 const key=cur.n+'_'+cur.i+'_'+cur.s;if(__S.seen[key])return;__S.seen[key]=1;
 const dt=Date.now()-__shownAt;__S.act+=Math.min(dt,opt.capMs||30000);__S.tot++;if(ok)__S.ok++;
 const wid=it&&it.wid;if(wid&&__S.wids.indexOf(wid)<0)__S.wids.push(wid);if(!ok&&wid&&__S.miss.indexOf(wid)<0)__S.miss.push(wid);
 if(!ok&&dt<2000){__S.rw++;__S.run++;if(__S.run>=3&&__S.pops<2&&opt.onRush){__S.pops++;__S.run=0;try{const _t0=Date.now();opt.onRush(()=>{const d=Date.now()-_t0;__shownAt+=d;if(__S)__S.hid+=d;});}catch(e){}}}else __S.run=0;
 __resSave();}
function __partDone(g){if(!__S||__S.g!==g)__S=__newS(g);const P0=__S;__S=null;__resClear();
 const x=PGROUPS().find(y=>y.g===g);const wids=[];if(x)x.ns.forEach(n=>{const v=NAV[n];const P=v.test?null:v.rv?REVIEW:PATS[v.pi].parts[v.k];if(P&&P.items)P.items.forEach(it=>{if(it.wid&&wids.indexOf(it.wid)<0)wids.push(it.wid);});});
 try{opt.onPartDone(P0.pid,{total:P0.tot,correct:P0.ok,miss_word_ids:P0.miss,word_ids:wids.length?wids:P0.wids,active_ms:Math.round(P0.act),duration_ms:Math.max(0,Date.now()-P0.t0-P0.hid),rush_wrong_count:P0.rw,rush_pops:P0.pops,started_at:new Date(P0.t0).toISOString()});}catch(e){console.log(e);}}
const __ORD={};
function __ord(st,o){if(!opt.shuffle)return o;const c=st.c||[];if(c.length&&c.every(x=>/^\s*(\\\(\s*)?[ア-ンA-Za-z①-⑳]\s*(\\\))?\s*$/.test(String(x))))return o;
 const key=cur.n+'_'+cur.i+'_'+cur.s;if(!__ORD[key])__ORD[key]=shuf(o);return __ORD[key];}
function __day(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function __resSave(){if(!opt.resumeKey||!opt.live)return;const v=NAV[cur.n];if(!v||v.test)return;if(!(cur.i||cur.s||cur.pt||(__S&&__S.tot)||RV.round)){__resClear();return;}
 try{localStorage.setItem(opt.resumeKey,JSON.stringify({day:__day(),n:cur.n,i:cur.i,s:cur.s,pt:cur.pt,rv:{miss:[...RV.miss],round:RV.round},S:__S?Object.assign({},__S,{el:Date.now()-__S.t0-__S.hid}):null}));}catch(e){}}
function __resClear(){if(!opt.resumeKey)return;try{localStorage.removeItem(opt.resumeKey);}catch(e){}}
function __resLoad(){if(!opt.resumeKey)return null;try{const r=JSON.parse(localStorage.getItem(opt.resumeKey)||'null');if(!r||r.day!==__day()||!NAV[r.n]||NAV[r.n].test){__resClear();return null;}return r;}catch(e){return null;}}
{let __hidAt=0;__realDoc.addEventListener('visibilitychange',()=>{if(!root.isConnected)return;if(__realDoc.hidden)__hidAt=Date.now();else if(__hidAt){const d=Date.now()-__hidAt;__hidAt=0;if(__S)__S.hid+=d;__shownAt+=d;}});}
{const _d0=drawPhone;drawPhone=function(){__shownAt=Date.now();const r=_d0.apply(this,arguments);if(opt.live)__resSave();return r;};}

/* ===== テスト（段④ 2026-10-18）=====
   opt.tstate＝サーバーにある最後の回の記録／opt.onTestSubmit(part_id, 記録, 送るもの)＝提出／opt.onTestState(part_id, 記録)＝直しの進み／
   opt.onTestStart(part_id)＝［スタート］を押した／opt.onTestProg(part_id, 答えた数, 全部)＝途中の様子（5問ごと）／opt.rangePass()＝範囲で合格した版（A・B・C）／opt.testReady(part_id)＝'go'(青の塗り)・'can'(枠)・'late'(点線)／opt.tkey＝下書きの保存の名前 */
let __TP=null,__tNew=false;
/* テストの途中の様子（リアルタイムモード 2026-10-19 作業5の残り）：答えた小問の数が5の倍数か全部になったら opt.onTestProg(part_id, 答えた数, 全部)。正誤は送らない（テストは提出まで採点しない） */
let __tPA=-1;
function __tProg(){if(!opt.live||!opt.onTestProg||!LIVE()||typeof TEST==='undefined'||!TEST||!TFL||!TFL.length)return;const a=tans.filter(x=>x!==undefined&&x!==null).length;if(a===__tPA)return;const up=a>__tPA;__tPA=a;if(up&&(a%5===0||a===TFL.length)){try{opt.onTestProg(TEST.part_id,a,TFL.length);}catch(e){}}}

/* ===== 答えたときの音とコンボ（F-43・2026-10-18 川上さん「全部音とか演出を合わせるべき」）=====
   1問ずつ答えるもの（復習パート・WarmUp・Try・Exercise・Exercise＋・類題）の選択肢だけ。穴埋め（fillRun）とテストの答えている間は鳴らさない。
   opt.fx(t, n)：'hit'＝1回目で正解（n＝連続の数）／'miss'＝1回目でまちがい（連続は0に）／'ok'・'ng'＝2回目からの答え（連続は数えない）。
   連続はパートの区切り（学ぶ／練習／もっと練習／復習・類題のひとまとまり）ごとに0から。毎日学習の「記録とコンボは1回目で済んでいる」と同じ */
let __FXS={},__CMB=0,__CMBG=undefined;
function __fx(ok,key,redo){if(!opt.live||!opt.fx||!LIVE())return;
 const g=redo||((__gOf(cur.n)||{}).g);if(g!==__CMBG){__CMBG=g;__CMB=0;__FXS={};}
 const first=!__FXS[key];__FXS[key]=1;
 try{if(!first)opt.fx(ok?'ok':'ng',__CMB);else if(ok){__CMB++;opt.fx('hit',__CMB);}else{__CMB=0;opt.fx('miss',0);}}catch(e){}
 try{const c=document.querySelector('#ph .wd1-cmb');if(c)c.textContent=__CMB>=2?__CMB+'連続':'';}catch(e){}}
/* 進み具合の右はしの「N連続」（2026-10-19 作業4の5）。描き直したときも同じ数を出す。ひとまとまり（学ぶ／練習／もっと練習／復習・類題）が替わったら出さない */
WD1CMB=function(){if(!opt.live||!opt.fx||!LIVE())return 0;const g=(typeof REDO!=='undefined'&&REDO)?REDO:((__gOf(cur.n)||{}).g);return g===__CMBG?__CMB:0;};
const __TKEEP=st=>{const c=st.c||[];return !c.length||c.every(x=>/^\s*(\\\(\s*)?[ア-ンA-Za-z①-⑳]\s*(\\\))?\s*$/.test(String(x)));};
/* 選択肢の順（E-31）：問題・小問の順は変えず、選択肢だけを受けるたびに入れかえる。ア〜カ は見えている順に付く。perm[j]＝その小問の「見せる順 → 元の番号」 */
function __tPerm(p){TFL.forEach(x=>{if(!x.st0)x.st0=x.st;});
 if(p==='new'){p=(opt.live&&opt.shuffle)?TFL.map(x=>__TKEEP(x.st0)?null:shuf(x.st0.c.map((_,k)=>k))):null;}
 __TP=p&&p.length===TFL.length?p:null;
 TFL.forEach((x,j)=>{const s0=x.st0,o=__TP&&__TP[j];if(!o||o.length!==s0.c.length){x.st=s0;return;}x.st=Object.assign({},s0,{c:o.map(k=>s0.c[k]),a:o.indexOf(s0.a)});});}
/* 左の欄のテストの行（「◯点・直し途中」）を、いまの TSTATE に合わせる。採点（アプリ・紙）・解説を見た・類題のたびに呼ぶ。
   前は左の欄を描き直さなかったので、紙の答えを採点したあとも前の点が残っていた（川上さん 2026-10-18 12:50「直して」） */
function __tSideUpd(){try{const w=document.querySelector('.wst2 .wsm');if(!w)return;const o=w.querySelector('.tst'),h=tSideTxt();if(o){if(h)o.outerHTML=h;else o.remove();}else if(h)w.insertAdjacentHTML('beforeend',h);}catch(e){}}
function __tSend(){const pid=TEST.part_id,S=Object.assign({},TSTATE,{done:tDone(TSTATE)});
 if(__tNew){__tNew=false;const ok=TFL.filter((x,j)=>TSTATE.ans[j]===x.st.a).length;const miss=[];TFL.forEach((x,j)=>{if(TSTATE.ans[j]!==x.st.a&&x.it.wid&&miss.indexOf(x.it.wid)<0)miss.push(x.it.wid);});
  try{opt.onTestSubmit(pid,S,{score:TSTATE.got,correct:ok,total:TFL.length,miss_word_ids:miss,over_ms:TSTATE.over||0,paper:TSTATE.paper||''});}catch(e){console.log(e);}return;}
 if(opt.onTestState){try{opt.onTestState(pid,S);}catch(e){console.log(e);}}}
/* 単元まとめテストの「このあと」（合格＝80点以上を取って直しを終える・川上さん 2026-10-18 02:11 A）。文は章まとめテスト（E-38）と同じ形 */
function __tPassU(got){const d=TSTATE?tDone(TSTATE):false;const nm=TEST.name;
 const was=!!(opt.unitPassed&&opt.unitPassed(TEST.part_id));
 if(got>=80)return d?`<div class="okm tpass">合格！　${nm}に合格した。</div>`:`<div class="passn tpass">80点以上取れた。直し（解説・ノート・類題）が終わると、${nm}に合格。</div>`;
 if(was)return `<div class="passn tpass">${nm}には前に合格している。直しをして、まちがえた所を残さないようにしよう。</div>`;
 return `<div class="passn tpass">まだ合格ではない。直しが終わったら、もう一度受けて80点以上を目指そう（${nm}は80点以上を取って直しを終えれば合格）。</div>`;}
function __tRdy(){if(!opt.live||!opt.testReady)return '';try{const r=opt.testReady(TEST.part_id);return r?'rdy-'+r:'';}catch(e){return '';}}

/* ===== 紙のテストの答え（段⑤ 2026-10-18）=====
   opt.paper＝'sym'（自動採点：解答用紙に書いた記号を入れる）／'ox'（○×入力：丸付けした正誤を入れる）。
   紙の選択肢は決まった並び（入れかえない）なので、ア〜カは紙と同じ。入れ終わったら、アプリで受けたのと同じ結果画面・記録 */
let __PAPER=null,__PA=null,__tPaperMode='';
function __plab(x){const b=TEST.blocks[x.b];return b.ren?`${DN(b.num)}${SN(x.k)}`:b.grp?`${DN(b.num)}${SNB(b,x.k)}`:DN(b.num);}
/* 入力＝解答用紙と同じ形の表＋下にいつも出ている記号のボタン（2026-10-18 03:42 川上さん「解答用紙に合わせた方がわかりやすい」・モック\20261018_モック_紙の答えの入力_2案.html の案B）。
   押すと青いマスに入って次のマスへ進む。直すときはマスを押す。ボタンは画面の下に固定し、表と重ならないように下に空きを取り、入れるマスはボタンより上に見える位置まで動かす */
let __PCUR=0;
function __psub(x){const b=TEST.blocks[x.b];return b.ren?SN(x.k):b.grp?SNB(b,x.k):'';}
function __pval(j){const v=__PA[j];return v===undefined?'':(__PAPER==='ox'?(v==='o'?'○':'×'):KANA[v]);}
function __pnext(j){let n=j+1;while(n<TFL.length&&__PA[n]!==undefined)n++;if(n>=TFL.length){n=__PA.findIndex(v=>v===undefined);}return n;}
/* 入れるマスが下のボタンに隠れないように、外側のスクロールを動かす（Shadow DOM の外の箱も見る） */
function __pscroller(el,any){let n=el;while(n){n=n.parentElement||(n.getRootNode&&n.getRootNode().host)||null;if(!n||n===__realDoc.body||n===__realDoc.documentElement)break;const s=getComputedStyle(n);if(/(auto|scroll)/.test(s.overflowY)&&(any||n.scrollHeight>n.clientHeight))return n;}return null;}
function __pshow(c,pad){try{const r=c.getBoundingClientRect(),pt=pad?pad.getBoundingClientRect().top:innerHeight,sc=__pscroller(c);let d=0;
 if(r.bottom>pt-12)d=r.bottom-(pt-12);else if(r.top<60)d=r.top-60;if(!d)return;if(sc)sc.scrollTop+=d;else window.scrollBy(0,d);}catch(e){}}
function __drawPaper(ph){const T=TEST,ox=__PAPER==='ox',B=T.blocks;__tPerm(null);if(!__PA){__PA=TFL.map(()=>undefined);__PCUR=0;}
 const nk=ox?2:Math.max(...TFL.map(x=>x.st.c.length));
 const keys=ox?[['o','○'],['x','×']]:[...Array(nk).keys()].map(k=>[k,KANA[k]]);
 const rows=B.map((b,bi)=>{const js=tJs(bi);return `<div class="pcr"><div class="pcn">${DN(b.num)}</div><div class="pcc">${js.map(j=>`<span class="pcx" data-j="${j}">${__psub(TFL[j])}<b></b></span>`).join('')}</div></div>`;}).join('');
 ph.innerHTML=`<div class="phone ppaper"><div class="prog"><span class="tag X">${T.name}</span>　紙の答え（${ox?'○×入力':'自動採点'}）</div>
  <div class="pplead">${ox?'丸付けした解答用紙を見て、○×を入力しよう。':'解答用紙に書いた記号を入力しよう。'}</div>
  <div class="pck">${rows}</div><div class="tvh"></div><div class="tconf"></div>
  <div class="ppad"><div class="pph"></div><div class="ppk${ox?' ox':''}" style="grid-template-columns:repeat(${keys.length},1fr)">${keys.map(([v,l])=>`<button type="button" data-v="${v}">${l}</button>`).join('')}</div>
  <button class="next ppgo">${ox?'記録する':'採点する'}</button></div></div>`;
 K(ph);
 const upd=(scroll)=>{const u=__PA.filter(v=>v===undefined).length;
  ph.querySelectorAll('.pcx').forEach(c=>{const j=+c.dataset.j;c.classList.toggle('un',__PA[j]===undefined);c.classList.toggle('cur',j===__PCUR);c.querySelector('b').textContent=__pval(j)||'　';});
  const x=TFL[__PCUR];const h=ph.querySelector('.pph');
  h.innerHTML=x?`いま入れる所：<b>${DN(TEST.blocks[x.b].num)} ${__psub(x)}</b>`:'全部のマスに入った。解答用紙と見比べてから採点しよう';K(h);
  ph.querySelector('.tvh').innerHTML=u?`<span class="tvu">まだ ${u}問</span>`:'<span class="tvok">全部入れた</span>';
  if(scroll){const c=ph.querySelector('.pcx.cur');if(c)__pshow(c,ph.querySelector('.ppad'));}};
 ph.querySelectorAll('.pcx').forEach(c=>c.onclick=()=>{__PCUR=+c.dataset.j;upd(true);});
 ph.querySelectorAll('.ppk button').forEach(b=>b.onclick=()=>{if(__PCUR<0||__PCUR>=TFL.length)return;const v=b.dataset.v;
  if(!ox&&+v>=TFL[__PCUR].st.c.length)return; /* その小問に無い記号は入れない */
  __PA[__PCUR]=ox?v:+v;__PCUR=__pnext(__PCUR);const cf=ph.querySelector('.tconf');if(cf)cf.innerHTML='';upd(true);});
 ph.querySelector('.ppgo').onclick=()=>{const u=__PA.filter(v=>v===undefined).length;const cf=ph.querySelector('.tconf');
  /* ○×入力は全部入れてから記録する。ボタンは押せるままにし、押したら最初の未入力のマスへ連れていく（仕上げプリントの「送る」と同じ・2026-09-01 の決まり） */
  if(u&&ox){__PCUR=__PA.findIndex(v=>v===undefined);upd(true);const c=ph.querySelector('.pcx.cur');if(c){c.classList.remove('miss');void c.offsetWidth;c.classList.add('miss');setTimeout(()=>c.classList.remove('miss'),1600);}
   if(opt.toast){try{opt.toast(u);}catch(e){}}return;}
  if(u&&!ox&&!cf.innerHTML){cf.innerHTML=`<div class="tcf">まだ入れていない問題が ${u}問あります。未回答として採点しますか？<div class="two"><button class="next" data-a="go">採点する</button><button class="next sub" data-a="back">もどる</button></div></div>`;
   cf.querySelector('[data-a=go]').onclick=__paperDone;cf.querySelector('[data-a=back]').onclick=()=>{cf.innerHTML='';};try{cf.scrollIntoView({block:'nearest'});}catch(e){}return;}
  __paperDone();};
 {const pd=ph.querySelector('.ppad'),sc=__pscroller(pd,true);if(sc){const pb=parseFloat(getComputedStyle(sc).paddingBottom)||0;pd.style.bottom=(-pb)+'px';}} /* 外の箱の下の余白のぶん下げて、画面のいちばん下に付ける */
 upd(false);__ptip(ph);}
/* 初めて開いたときだけ、使い方の吹き出しを2つ（青いマス＝ここに入る／下のボタン＝ここで選ぶ）。吹き出しは生徒アプリの「ヒント」（_gdTip_）と同じ見た目で出す＝opt.tip に任せる（2026-10-18 03:56・04:01 川上さん） */
function __ptip(ph){if(!opt.live||!opt.tip)return;try{opt.tip([ph.querySelector('.pcx.cur'),ph.querySelector('.ppk')],__PAPER);}catch(e){}}
function __paperDone(){const ox=__PAPER==='ox';tans=__PA.map((v,j)=>ox?(v==='o'?TFL[j].st.a:-1):v);__tPaperMode=__PAPER;__PAPER=null;__PA=null;
 window._tOver=0;TFRESH=false;cur.i=TFL.length;cur.s=0;cur.loaded=false;tDraftClear();drawPhone();try{root.scrollIntoView&&window.scrollTo(0,0);}catch(e){}}

/* 結果の点の下に、前回との差（確認テストと同じ色と言い方：初めての受験／前回より ＋◯点／前回より −◯点／前回と同じ） */
function __tDelta(got){if(!opt.live)return '';const p=cur.loaded?(TSTATE?TSTATE.prev:null):(TSTATE&&TSTATE.got!=null?TSTATE.got:null);
 if(p==null||p===undefined)return '<div class="tdl"><span class="tdp same">初めての受験</span></div>';const d=got-p;
 return `<div class="tdl"><span class="tdp ${d>0?'up':d<0?'dn':'same'}">${d>0?'前回より ＋'+d+'点':d<0?'前回より '+d+'点':'前回と同じ'}</span></div>`;}

 /* 図の文字が点・赤丸・線・ほかの文字と重ならないように置き直す */
function lfFix(svg){const all=[...svg.querySelectorAll('text')];if(!all.length)return true;
 let bbx;try{bbx=svg.getBBox();}catch(e){return false;}if(!bbx.width)return false;
 const vb=(svg.getAttribute('viewBox')||'0 0 0 0').split(/\s+/).map(Number),W=vb[2],H=vb[3];
 const C=[...svg.querySelectorAll('circle')].map(c=>({x:+c.getAttribute('cx'),y:+c.getAttribute('cy'),r:+c.getAttribute('r')}));
 const Ls=[...svg.querySelectorAll('line')].map(l=>({x1:+l.getAttribute('x1'),y1:+l.getAttribute('y1'),x2:+l.getAttribute('x2'),y2:+l.getAttribute('y2'),w:+(l.getAttribute('stroke-width')||1)})).filter(l=>l.w>=1.5);
 const mov=all.filter(t=>t.getAttribute('font-weight')==='700');const fixed=all.filter(t=>mov.indexOf(t)<0);
 const R=t=>{const b=t.getBBox();return {x:b.x-1,y:b.y,w:b.width+2,h:b.height};};
 const rr=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
 const rc=(a,c)=>{const nx=Math.max(a.x,Math.min(c.x,a.x+a.w)),ny=Math.max(a.y,Math.min(c.y,a.y+a.h));return (nx-c.x)**2+(ny-c.y)**2<(c.r+1)**2;};
 const seg=(p,q,r)=>{const ccw=(a,b,c)=>(c.y-a.y)*(b.x-a.x)>(b.y-a.y)*(c.x-a.x);const x=(a,b,c,d)=>ccw(a,c,d)!==ccw(b,c,d)&&ccw(a,b,c)!==ccw(a,b,d);const s=[[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y}],[{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h}],[{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}],[{x:r.x,y:r.y+r.h},{x:r.x,y:r.y}]];const inside=p.x>r.x&&p.x<r.x+r.w&&p.y>r.y&&p.y<r.y+r.h;return inside||s.some(e=>x(p,q,e[0],e[1]));};
 const placed=fixed.map(R);
 const cost=(a)=>{let c=0;if(a.x<0||a.y<0||a.x+a.w>W||a.y+a.h>H)c+=6;C.forEach(k=>{if(rc(a,k))c+=4;});placed.forEach(b=>{if(rr(a,b))c+=4;});Ls.forEach(l=>{if(seg({x:l.x1,y:l.y1},{x:l.x2,y:l.y2},a))c+=(l.w>=2?3:1);});return c;};
 mov.forEach(t=>{const a=R(t);const cx=a.x+a.w/2,cy=a.y+a.h/2;let an=null,best=1e9;C.forEach(k=>{const d=Math.hypot(k.x-cx,k.y-cy);if(d<Math.max(30,a.w*0.75)&&d<best){best=d;an=k;}});
  const now=cost(a);if(now===0){placed.push(a);return;}
  const ax=an?an.x:cx,ay=an?an.y:cy,ar=an?an.r:0;let bc=now,bp=null,bd=0;
  for(const d of [4,9,15,22,30,40,52,66])for(let i=0;i<16;i++){const th=i*Math.PI/8,ux=Math.cos(th),uy=Math.sin(th);
   const px=ax+ux*(ar+d+a.w/2)-a.w/2,py=ay+uy*(ar+d+a.h/2)-a.h/2;const b={x:px,y:py,w:a.w,h:a.h};const c=cost(b);const dd=Math.hypot(px+a.w/2-cx,py+a.h/2-cy);
   if(c<bc||(c===bc&&bp&&dd<bd)){bc=c;bp=b;bd=dd;}}
  if(bp&&bc<now){const dx=bp.x-a.x,dy=bp.y-a.y;t.setAttribute('x',(+t.getAttribute('x'))+dx);t.setAttribute('y',(+t.getAttribute('y'))+dy);placed.push(bp);}else placed.push(a);});
 return true;}
function lfRun(){document.querySelectorAll('svg.gr:not([data-lf])').forEach(s=>{if(s.getBoundingClientRect().width>0&&lfFix(s))s.setAttribute('data-lf','1');});}
setInterval(lfRun,300);document.addEventListener('click',()=>setTimeout(lfRun,60));

/* 図をタップで拡大（アプリの画面だけ） */
document.addEventListener('click',e=>{const z=document.querySelector('.gzoom');if(z){z.remove();return;}
 const g=e.target.closest&&e.target.closest('#ph svg.gr');if(!g)return;
 const d=document.createElement('div');d.className='gzoom';const c=g.cloneNode(true);c.removeAttribute('width');c.removeAttribute('height');
 c.querySelectorAll('[id]').forEach(n=>n.id+='z');c.querySelectorAll('[clip-path]').forEach(n=>n.setAttribute('clip-path',n.getAttribute('clip-path').replace(')','z)')));
 d.appendChild(c);document.body.appendChild(d);});


 if(opt.dark){const wb=sh.querySelector('.wsbody');if(wb)wb.classList.add('dk');}
 if(opt.live){
  pvShowAns=false;__PAPER=(opt.paper==='sym'||opt.paper==='ox')?opt.paper:null;
  if(opt.shuffle){Object.keys(POOL).forEach(id=>POOL[id].forEach(it=>it.steps.forEach(s=>{if(__TKEEP(s))return;const o=shuf(s.c.map((_,k)=>k));const c0=s.c.slice();s.c=o.map(k=>c0[k]);s.a=o.indexOf(s.a);})));}
  const r=__PAPER?null:__resLoad();
  /* 生徒アプリのワークシートの一覧でパートを押したとき（opt.startPid・2026-10-19 川上さん「他の教材に合わせて」）：その パートから始める。続きの記録が同じパートなら続きから */
  const __SPN=opt.startPid?NAV.findIndex(v=>{const P=v.test?TEST:v.rv?REVIEW:PATS[v.pi].parts[v.k];return P&&String(P.part_id)===String(opt.startPid);}):-1;
  if(__PAPER){cur={n:NAV.length-1,i:0,s:0,pt:0};tans=[];__mv='q';appView();}
  else if(__SPN>=0&&!(r&&r.n===__SPN)){RV={miss:new Set(),round:null};cur={n:__SPN,i:0,s:0,pt:0};tans=[];TSEEN={};__enter(true);__mv='q';appView();}
  else if(r){RV={miss:new Set(r.rv&&r.rv.miss||[]),round:r.rv&&r.rv.round||null};cur={n:r.n,i:r.i,s:r.s,pt:r.pt};tans=[];TSEEN={};__S=r.S||null;if(__S&&!__S.seen)__S.seen={};if(__S){__S.t0=Date.now()-(__S.el||0);__S.hid=0;if(opt.onStart){try{opt.onStart(__S.pid);}catch(e){}}}__mv='q';appView();}
  else{const G=PGROUPS();const g=G.find(x=>!x.opt&&!pdGet(x.g))||G[0];cur={n:g?g.ns[0]:0,i:0,s:0,pt:0};__enter();__mv='list';appView();}
 } else __WS_BOOT();
 /* 先生のプレビュー（opt.preview）：モックのプレビューのバー（◀ ▶・答え・解説を出す）をそのまま出す。opt.startPid のパートから */
 if(opt.preview&&!opt.live){try{pvBar();}catch(e){console.log(e);}
  if(opt.startPid){const n=NAV.findIndex(v=>{const P=v.test?TEST:v.rv?REVIEW:PATS[v.pi].parts[v.k];return P&&String(P.part_id)===String(opt.startPid);});const k=SCR.findIndex(x=>x.n===n);if(k>=0)pvGo(k);}}
 return {pvHook:function(){const _dp=drawPhone;drawPhone=function(){_dp.apply(this,arguments);try{pvAuto()}catch(e){}};},pvGo:function(k){return pvGo(k);},SCR:SCR,setShowAns:function(v){pvShowAns=!!v;},appView:function(){return appView();},cur:function(){return cur;},goList:function(){__mv='list';appView();},paperHtml:function(a){const e=sh.getElementById(a?'v-a':'v-q');return e?e.innerHTML:'';},paperBand:function(el){return __paperBand(el);},selRows:function(){return __selRows();},lfFix:function(s){try{return lfFix(s);}catch(e){return false;}},K:function(el){K(el);},mv:function(){return __mv;},goPart:function(n){return goPart(n);},testPid:function(){return TEST&&TEST.part_id||'';},sh:sh};
};
})();
