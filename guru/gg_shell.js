/* gg_shell.js：ぐるぐる（数学）の外側の画面＝左の一覧（単元の本・パート・回・入試パターン・章まとめテスト・絞り込み）と、回を選んだら ggMount で開く所。
   tools\gg_shell_build.py が tools\gg_shell_src.js（この元）とモックの shell2.html の CSS から作る。手で直さない（直すときは gg_shell_src.js を直して作り直す）。
   2026-11-02 本番係。元＝モック /tmp/claude-0/g/v2/shell2.html の外側。モックだけのもの（モックの送り・Artifact の db（確かめる画面の OK・直して・メモ）・演出の写し DFX・紙）は入れていない。確かめる画面（rvW）は 2026-11-02 に先生のプレビューに入れたが、2026-11-03 に外した（決まり §0c 解説の決まり 24：先生のプレビューはワークシートと同じ形＝解く画面と下の黒いバーだけ）。
   使い方：var api=ggShellMount(root, GG, opt)
     root＝外側を描く要素（Shadow DOM に描く）。GG＝ggBuildData（gg_load.js）の返り（図は描いたあと）
     opt.katexCss＝KaTeX の CSS（省くと 'ws/katex/katex.min.css'）。字の形（@font-face）は、ページのほうでも読んでおく（Shadow DOM の中では効かないため）
     opt.dark＝暗い画面。opt.grade＝その子の学年（最初に開く学年のタブ）。opt.grades＝タブを押せる学年（省くと GG にある学年）
     opt.keyPrefix＝端末（localStorage）の記録の名前の頭（省くと 'kwtgg_'。生徒ごとに分けるときは student.html が付ける）
     opt.preview＝先生のプレビュー：記録しない（端末にも書かない・回が終わったら消す）・全部の回を開ける・解く画面に ggMount の preview のバー（下の黒いバー ◀ ▶・答え・解説を出す）。
       2026-11-03 ぐるぐる：上の帯の［確かめる］（確かめる画面）は外した。先生画面の［中身］と、生徒アプリの #pv=（テスト用アカウント）の両方で使う
     生徒の記録（送り先はあとで決める）：
       opt.tstateOf(行id)＝サーバーにある、その回の最後の記録（無ければ undefined）。行id＝parts の行の id（gg_m1u4p1_A1・gg_ctm1u4k_A1 など）
       opt.onRecord(ev)＝記録が変わったときに呼ぶ。ev＝{kind:'round'|'ct', rowId, pid, r, state, submit:true|false, res}（submit＝採点したとき・res＝{score,correct,total,…}）
       opt.resFx(lv,o)＝ぐるぐるの回が完了・全問正解になったとき（ggMount にそのまま渡す。student.html の _wsResFx_ と同じ口）
       opt.ctFx(lv,o)＝章まとめテストに合格したとき（lv＝'perfect'（100点）｜'mid'）
       opt.onClose()＝［← 一覧］より外（タブを閉じる）は外側で
     opt.imgBase・opt.libV＝ノートの書き方の絵 img/gg/*.svg の場所と版（opt.noteImg:false で出さない）
     opt.loadParts(行idの配列, {backs:true|false})＝問題をあとで読む（2026-11-02 段3）。GG が ggBuildData(rows,{lazy:true}) で作ったものなら、回・章まとめを開く前に
       そのパートの行（回6つ＋類題・章まとめの回）の words を Promise で返してもらい、ggFillWords（gg_load.js）で入れる。backs＝章まとめテストの「類題へ戻る所」の類題の行も一緒に（先生画面は GAS の gg_preview_part・生徒アプリの #pv= は gg_unit_part 2026-11-03）
   記録をサーバーに送る形：window.ggRecBridge(call, records)（下）＝ opt.tstateOf と opt.onRecord を作る（GAS の gg_records・gg_submit・gg_state）
   返り＝{render(), open(パートid, 回), openCt(テストid, 回), state(), paperLoad(種類, id, 回), paperMount(種類, id, 回, host), destroy()}（review は 2026-11-03 に外した）
   ぐるぐる英語（2026-11-03。川上さん 17:47 の質問への答え 18:19「進めて」＝一覧の見出しで教科を切り替える）：
     GG の units・parts・ny・cts の subj（'ma' 数学｜'en' 英語。gg_load.js が materials.subject から入れる）で教科を分ける。
     両方の教科があるときだけ、一覧の見出しの「数学」の所を［数学｜英語］の切り替えにする（1教科だけのときは今までと同じ字）。前に開いた教科を覚える（端末の subj）。opt.subject＝最初に開く教科
     1回の問題の数はパートごと（英語 12問・数学 7問＝p.nq の最初の回）。表紙の行の rs（問題のある回）に無い回は、一覧で「準備中」（押せない）
     英語の回は ggMount に opt.en・guru.en（表紙の行 meta）・min（13分）を渡し、ノートの書き方の絵は出さない
   重要マーク ◆（2026-11-03 ぐるぐる。決まり §0c「解説の決まり」16・KWT_生徒アプリ.md 2026-10-19 作業4の1・2・4の3「左端の決まり」）：
     データ＝gg_load.js の units[].parts[].imp・parts[].imp・cts[].imp（入試パターンは ◆ なし）
     左の一覧＝パート・入試パターン・章まとめテストの行の名前の左はしに ◆ の場所（.imps・決まった幅）。◆ の無い行も場所を空けて、名前の書き出しをそろえる。英検の _impSlot_ と同じ色（明るい #c2410c・暗い #fb923c）
     表紙の題・解く画面の帯・完了の見出し（ggMount の中＝gg_app.js）＝ggMount の影（shadowRoot）に CSS_APP_IMP を足し、host に data-imp を付ける（gg_app.js は変えない）。
       ◆ は「◆No.・パート名」の形で、帯（.prog・.ghl）と完了（.wr-top）の左はし、表紙はパート名（.gcvs）、開始画面は名前（.tsn）の頭。◆ の無いパートには何も出さない（場所も空けない＝英検の _hImp_ と同じ）
       gg_app の暗い画面は .app に filter:invert(.92) hue-rotate(180deg) がかかるので、暗い画面の ◆ の色は filter を通ったあとが #fb923c に近くなる #d24b00 を当てる */
(function(){
var CSS=":host{--ink:#1a1a1a;--sub:#555;--line:#d6dae1;--bg:#f4f5f7;--blue:#2563eb;--ok:#15803d;--fx:#b45309;--pt:#6b21a8}\n:host{--c111:#111;--c334155:#334155;--c475569:#475569;--c64748b:#64748b;--c94a3b8:#94a3b8;--c991b1b:#991b1b;--cc4b5fd:#c4b5fd;--cc7d2fe:#c7d2fe;--ccbd5e1:#cbd5e1;--cdbe3ee:#dbe3ee;--cdbe3ff:#dbe3ff;--ce5e7eb:#e5e7eb;--ce9d5ff:#e9d5ff;--cede9fe:#ede9fe;--ceef0f3:#eef0f3;--ceff6ff:#eff6ff;--cf0fdf4:#f0fdf4;--cf1f5f9:#f1f5f9;--cf3e8ff:#f3e8ff;--cf8fafc:#f8fafc;--cfaf5ff:#faf5ff;--cfafbff:#fafbff;--cfbfaf6:#fbfaf6;--cfca5a5:#fca5a5;--cfef2f2:#fef2f2;--cfff:#fff}\n\n\n:host([data-dk]){--c111:#e6e8ec;--c334155:#c5cbd5;--c475569:#aab2bf;--c64748b:#8d96a5;--c94a3b8:#6b7486;--c991b1b:#fca5a5;--cc4b5fd:#5b4d8a;--cc7d2fe:#3b4572;--ccbd5e1:#475163;--cdbe3ee:#323a48;--cdbe3ff:#323a5c;--ce5e7eb:#343b48;--ce9d5ff:#4a3a66;--cede9fe:#2e2645;--ceef0f3:#2c3340;--ceff6ff:#1d2a44;--cf0fdf4:#16301f;--cf1f5f9:#262c37;--cf3e8ff:#33264a;--cf8fafc:#222833;--cfaf5ff:#261f33;--cfafbff:#1e2230;--cfbfaf6:#23221d;--cfca5a5:#7f3434;--cfef2f2:#3a1d1d;--cfff:#1b1f27;--ink:#e6e8ec;--sub:#a0a7b3;--line:#394150;--bg:#12151b;--line2:rgba(255,255,255,.09);--n-track:#2c3340;--accent-soft:#1d2a44;--n-goldsoft:rgba(202,162,74,.18);--sub2:#9aa1ad;--blue:#6ea0ff;--accent:#3b82f6;--ok:#4ade80;--fx:#fbbf24;--pt:#c084fc;--quiz:#a78bfa;color-scheme:dark}\n*{box-sizing:border-box}\n:host([data-dk]) button,:host([data-dk]) textarea{color:inherit}\n:host{margin:0;background:var(--bg);color:var(--ink);font-family:\"Hiragino Sans\",\"Noto Sans JP\",\"Yu Gothic UI\",sans-serif;font-size:16px;line-height:1.6}\nbutton{font:inherit;cursor:pointer}\n#app{display:grid;grid-template-columns:330px 1fr;gap:16px;max-width:1200px;margin:0 auto;padding:12px 16px 120px;align-items:start}\n#left{position:sticky;top:12px;background:var(--cfff);border:1px solid var(--line);border-radius:12px;padding:10px;max-height:calc(100vh - 110px);overflow:auto}\n#right{min-width:0}\n.lh{display:flex;align-items:baseline;gap:8px;padding:2px 4px 8px;border-bottom:1px solid var(--ceef0f3);margin-bottom:6px}\n.lh b{font-size:18px}.lh span{font-size:12px;color:var(--sub)}\n.lu{font-size:13px;font-weight:800;color:var(--sub);margin:10px 4px 4px}\n.lp{display:block;width:100%;text-align:left;border:1px solid transparent;background:var(--cfff);border-radius:8px;padding:7px 8px;margin:2px 0}\n.lp:hover{background:var(--cf8fafc)}\n.lp.on{border-color:var(--blue);background:var(--ceff6ff)}\n.lp .n{font-weight:700}.lp .s{display:block;font-size:12px;color:var(--sub)}\n.lp .s .ok{color:var(--ok);font-weight:700}.lp .s .fx{color:var(--fx);font-weight:700}\n.lp.off{color:var(--c64748b)}\n.lrs{margin:2px 0 8px 14px;border-left:2px solid var(--cdbe3ee);padding-left:6px}\n.lrh{font-size:11px;font-weight:700;color:var(--sub);margin:6px 4px 2px}\n.lr{display:flex;width:100%;align-items:baseline;gap:8px;text-align:left;border:1px solid transparent;background:var(--cfff);border-radius:7px;padding:5px 8px;margin:1px 0;font-size:13px}\n.lr:hover{background:var(--cf8fafc)}.lr.on{border-color:var(--blue);background:var(--ceff6ff)}.lr.nx .rn{color:var(--blue)}\n.lr .rn{flex:none;width:24px;font-weight:800}.lr .rs{flex:1;min-width:0;color:var(--sub);font-size:12px}.lr .rs .ok{color:var(--ok);font-weight:700}.lr .rs .fx{color:var(--fx);font-weight:700}\n.lct{margin-top:10px;border-top:1px solid var(--ceef0f3);padding-top:6px}\n.ctic{color:var(--quiz);margin-right:5px;font-size:15px}.ctw>.nchap .ncf-nm{color:var(--ink)}.ctpsw{display:inline-flex;gap:6px;margin:0 6px}\n.card{background:var(--cfff);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:0 0 12px}\n.back{border:1px solid var(--line);background:var(--cfff);border-radius:8px;padding:5px 12px;font-size:14px;margin:0 0 10px}\n\n:host{--accent:#0a6cff;--accent-soft:#e8f0ff;--gold:#caa24a;--n-goldsoft:rgba(202,162,74,.14);--n-track:#dfe4ee;--okg:#1faa6b;--quiz:#7c3aed;--sub2:#8a8f99;--line2:rgba(0,0,0,.07)}\n.svi{width:1em;height:1em;display:inline-block;vertical-align:-.12em}\n.gtab{display:flex;gap:6px;margin:0 0 10px}.gtab button{flex:1;border:1px solid var(--line);background:var(--cf1f5f9);border-radius:10px;padding:7px 0;font-weight:700;font-size:15px;color:var(--c64748b)}.gtab button.on{background:var(--cfff);border:2px solid var(--ink);color:var(--c111);font-weight:900;box-shadow:0 2px 6px rgba(0,0,0,.08)}.gtab button:disabled{background:var(--cf8fafc);color:var(--ccbd5e1);border-color:var(--ceef0f3);cursor:default}\n.lg{font-size:12px;font-weight:800;color:var(--sub2);margin:12px 4px 6px;letter-spacing:.04em}\n.nbook{background:var(--cfff);border:1px solid var(--line2);border-radius:16px;box-shadow:0 2px 20px rgba(20,24,40,.06);margin-bottom:8px;overflow:hidden;border-left:4px solid var(--gold)}\n.nbook-head{padding:11px 13px;display:flex;align-items:center;gap:11px;cursor:pointer}\n.nbk-ic{width:34px;height:34px;border-radius:10px;background:var(--n-goldsoft);color:var(--gold);display:flex;align-items:center;justify-content:center;font-size:18px;flex:0 0 auto}\n.nbk-body{flex:1;min-width:0}.nbk-nm{font-weight:700;font-size:14px}\n.nbk-meta{font-size:11px;color:var(--sub2);margin-top:2px}\n.nbk-bar{height:4px;border-radius:2px;background:var(--n-track);margin-top:7px;overflow:hidden}.nbk-bar i{display:block;height:100%;background:var(--gold);border-radius:2px}\n.nbk-arw{color:var(--sub2);font-size:19px;transition:transform .2s;flex:none}\n.nbook.open>.nbook-head .nbk-arw{transform:rotate(180deg)}\n.nbk-detail{display:none;border-top:1px solid var(--line2);padding:2px 13px 6px}.nbook.open>.nbk-detail{display:block}\n.nbook.soon{border-left-color:var(--ccbd5e1)}.nbook.soon .nbk-ic{background:var(--cf1f5f9);color:var(--c94a3b8)}\n.qchw{border-bottom:1px solid var(--line2)}.qchw:last-child{border-bottom:none}\n.nchap{display:flex;align-items:center;gap:9px;padding:10px 0;cursor:pointer}\n.ncf-nm{flex:1;font-size:13.5px;font-weight:600;line-height:1.3;min-width:0}.ncf-nm small{display:block;font-weight:500;font-size:10.5px;color:var(--sub2);margin-top:1px}\n.ncf-go{width:30px;height:30px;border-radius:9px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;flex:0 0 auto}\n.ncf-done{color:var(--okg);font-size:17px;flex:none}\n.ncf-soon{flex:none;font-size:10.5px;font-weight:700;color:var(--c64748b);border:1px solid var(--ccbd5e1);border-radius:6px;padding:1px 6px}\n.ncf-arw{color:var(--sub2);font-size:19px;transition:transform .2s;flex:0 0 auto;padding:7px;margin:-7px -3px;cursor:pointer}\n.qchw.open .ncf-arw{transform:rotate(180deg)}\n.nqparts{display:none;padding:0 0 4px 10px}.qchw.open .nqparts{display:block}\n.nqp{display:flex;align-items:center;gap:9px;padding:9px 6px;border-top:1px solid var(--line2);cursor:pointer;border-radius:8px}\n.nqp.on,.nchap.on{background:var(--accent-soft)}\n.nqp-nm{flex:1;font-size:13px;font-weight:600;line-height:1.3;min-width:0}.nqp-nm .rn{font-weight:800;color:var(--accent);margin-right:6px}\n.nqg{display:flex;align-items:center;gap:7px;padding:10px 0 4px;border-top:1px solid var(--line2)}.nqg+.nqp{border-top:0}\n.rpair{display:flex;align-items:stretch;gap:8px;border:1.5px solid var(--cc7d2fe);border-radius:12px;margin:8px 0;padding:4px 8px 4px 6px;background:var(--cfafbff)}\n.rpl{flex:none;width:30px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:var(--accent);border-right:1px solid var(--cdbe3ff);padding-right:6px}\n.rpr{flex:1;min-width:0}.rpr .nqp:first-child{border-top:0}.nqg{border-top:0;padding:8px 0 0}\n\n.nqg-no{flex:none;background:#1f2937;color:#fff;font-size:10.5px;font-weight:800;border-radius:6px;padding:2px 7px}\n.nqg-nm{flex:1;font-size:12px;font-weight:700;color:var(--sub2)}\n.utag{display:inline-flex;align-items:center;gap:3px;font-size:10.5px;font-weight:700;color:var(--sub2);white-space:nowrap}\n.utag.done{color:var(--okg)}.utag.warn{color:var(--gold)}\n\n.lflt{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}.lflt button{border:1.5px solid var(--accent);color:var(--accent);background:var(--cfff);border-radius:999px;padding:4px 11px;font-size:13px;font-weight:700}.lflt button.on{background:var(--accent);color:#fff}\n.dprog-dots{display:flex;gap:4px;margin-top:6px;max-width:150px}.dprog-dots.d4{max-width:100px}.dprog-dots i{height:7px;flex:1;border-radius:4px;background:var(--n-track)}.dprog-dots i.on{background:var(--okg)}\n.tg{display:inline-block;font-size:10.5px;font-weight:800;line-height:1.5;border:1.5px solid var(--ink);color:var(--ink);background:var(--cfff);border-radius:5px;padding:0 5px;margin-right:5px;vertical-align:1px;white-space:nowrap}.tg.ct{border-color:var(--quiz);color:var(--quiz)}\n.lnote{font-size:12px;color:var(--sub);background:var(--cf1f5f9);border-radius:8px;padding:6px 8px;margin:0 0 8px}\n.lcnt{font-size:13px;font-weight:700;margin:2px 2px 6px}.lcnt .nbk-bar{margin-top:5px}\n.lfg{font-size:12.5px;font-weight:800;color:var(--sub);margin:12px 2px 0;padding-bottom:3px;border-bottom:1px solid var(--line)}\n.chp-cur{outline:2px solid var(--accent);outline-offset:-2px;border-radius:8px}\n\n.st-t{font-size:22px;font-weight:800;margin:2px 0}.st-u{font-size:13px;color:var(--sub)}\n.st-tb{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:8px}.st-tb th,.st-tb td{border:1px solid var(--ce5e7eb);padding:5px 7px;vertical-align:top;text-align:left}.st-tb th{background:var(--cf8fafc);font-size:12px;white-space:nowrap}\n.st-tb td.no{width:38px;text-align:center;font-weight:700;color:var(--c475569)}.st-tb tr.rv td{background:var(--cfbfaf6)}\n.st-pt{margin:6px 0 0 0;padding-left:20px;font-size:13.5px}.st-note{font-size:12.5px;color:var(--c475569);margin-top:8px}\n.st-badge{display:inline-block;font-size:11px;font-weight:700;color:#b45309;border:1px solid #f59e0b;border-radius:6px;padding:0 6px;margin-left:6px;vertical-align:3px}\n\n.cv-u{font-size:13px;color:var(--sub)}\n\n.hdb{margin:0 0 6px}.hdk{font-size:12.5px;color:var(--sub)}.hdt{font-size:28px;font-weight:900;line-height:1.2;margin:2px 0}.hds{font-size:15px;font-weight:700}.hds small{display:block;font-size:12.5px;font-weight:500;color:var(--sub)}\n.hdd{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:8px}.hdd span{width:24px;height:24px;border-radius:50%;border:1.5px solid var(--c94a3b8);color:var(--c334155);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center}.hdd span.on{background:var(--accent);border-color:var(--accent);color:#fff}\n.hdt .hdi{display:inline-flex;vertical-align:middle;margin:0 0 5px 10px;gap:6px}.hdt .hdi span{width:30px;height:30px;font-size:15px}.hdd i{font-style:normal;font-size:12px;color:var(--sub);margin-left:4px}\n.ncf-nm .mr{font-weight:800;margin-right:5px}.nbk-n{font-size:12px;font-weight:600;color:var(--sub2);margin-left:6px}\n.cv-t{font-size:26px;font-weight:800;line-height:1.3;margin:2px 0}\n.cv-c{font-size:15px;color:var(--c334155)}\n.cv-l{font-size:13px;font-weight:700;color:var(--sub);margin:14px 0 6px}\n.cv-x{border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin:0 0 8px;display:flex;gap:10px}\n.cv-x .k{flex:none;font-size:12px;font-weight:700;border:1px solid var(--c94a3b8);border-radius:6px;padding:0 6px;height:22px;color:var(--c475569)}\n.cv-x .q{flex:1;min-width:0}\n.cv-go{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}\n.btn{border:0;border-radius:10px;padding:12px 18px;font-weight:700;font-size:16px}\n.btn.p{background:var(--ink);color:var(--cfff)}.btn.s{background:var(--cfff);border:2px solid var(--pt);color:var(--pt)}.btn.g{background:var(--cfff);border:1px solid var(--line)}\n.cv-note{font-size:13px;color:var(--sub);margin-top:6px}\n.rt{width:100%;border-collapse:collapse;font-size:14px}\n.rt th,.rt td{border-bottom:1px solid var(--ceef0f3);padding:7px 6px;text-align:left;vertical-align:middle}\n.rt th{font-size:12px;color:var(--sub);font-weight:700}\n.rt .rn{font-weight:800;font-size:16px;width:48px}\n.rt .hist{font-size:13px}.rt .hist .ok{color:var(--ok);font-weight:700}.rt .hist .fx{color:var(--fx);font-weight:700}\n.rt .ex td{color:var(--c475569)}\n.rt .sep td{font-size:12px;font-weight:700;color:var(--sub);background:var(--cf8fafc)}\n.rb{border:1px solid var(--ccbd5e1);background:var(--cfff);border-radius:8px;padding:4px 10px;font-size:13px;white-space:nowrap}\n.rb.next{border:2px solid var(--blue);color:var(--blue);font-weight:700}\n\n.pt-top{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px}\n.pt-top .t{font-size:20px;font-weight:800;margin-right:auto}\n.ptmae{border:1px solid var(--ce9d5ff);border-radius:12px;padding:4px 10px 8px;margin:10px 0 6px;background:var(--cfaf5ff)}.ptmae .pt-sec small{display:block;font-weight:500;color:var(--sub);font-size:12px}.ptmg{display:grid;grid-template-columns:1fr 1fr;gap:0 8px}.ptmg .pc[open]{grid-column:1/-1}.ptmg .pc>summary{padding:6px 8px;font-size:14px}@media(max-width:700px){.ptmg{grid-template-columns:1fr}}\n.pt-sec{font-size:14px;font-weight:800;color:var(--pt);margin:14px 0 6px;border-left:4px solid var(--pt);padding-left:8px}\n.pc{border:1px solid var(--line);border-radius:10px;margin:0 0 8px;background:var(--cfff);overflow:hidden}\n.pc>summary{list-style:none;display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;font-weight:700}\n.pc>summary::-webkit-details-marker{display:none}\n.pc .no{flex:none;width:24px;height:24px;border-radius:50%;background:var(--cf3e8ff);color:var(--pt);font-size:12px;display:flex;align-items:center;justify-content:center}\n.pc .ck{margin-left:auto;font-size:12px;color:var(--sub);white-space:nowrap}\n.pc .ck.ok{color:var(--ok)}\n.pc .bd{padding:0 12px 12px}\n.pr{display:flex;gap:10px;padding:6px 0;border-top:1px dashed var(--ce5e7eb)}\n.pr .lb{flex:none;min-width:58px;font-size:12px;font-weight:700;color:var(--pt);background:var(--cfaf5ff);border-radius:6px;padding:2px 6px;height:max-content;text-align:center}\n.pr .tx{flex:1;min-width:0}\n.bl{display:inline-block;min-width:3.2em;border:2px dashed #a78bfa;border-radius:6px;padding:0 8px;margin:0 2px;text-align:center;color:#7c3aed;font-weight:700;cursor:pointer;background:var(--cfff)}\n.bl.fill{border-style:solid;border-color:#16a34a;color:var(--c111);background:var(--cf0fdf4);cursor:default}\n.bl.open{background:var(--cede9fe)}\n.pick{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 4px 68px}\n.pick button{border:1px solid var(--cc4b5fd);background:var(--cfff);border-radius:8px;padding:6px 14px;font-size:15px}\n.pick button.ng{border-color:var(--cfca5a5);background:var(--cfef2f2);color:var(--c991b1b)}\n.pfb{margin:4px 0 0 68px;font-size:14px;font-weight:700}\n.pfb.ok{color:var(--ok)}.pfb.ng{color:#b91c1c}\n.pnext{margin-top:8px}\n.grq{margin:4px 0}.pc table{border-collapse:collapse;margin:4px 0}.pc td,.pc th{border:1px solid var(--c94a3b8);padding:2px 10px;text-align:center}.pc th{background:var(--cf8fafc)}\nsvg.gr{max-width:100%;height:auto}\n\n.wshead{display:flex;gap:8px;align-items:center;margin:0 0 6px;flex-wrap:wrap}\n.wshead .t{font-weight:700}\n#host{display:block}\n\n\n#host.dkhost{background:#15171c;color-scheme:light}\n@media (max-width:899px){\n #app{grid-template-columns:1fr;padding:10px 12px 120px}\n #left{position:static;max-height:none}\n :host([data-inpart]) #left{display:none}\n :host(:not([data-inpart])) #right{display:none}\n \n}\n@media (min-width:900px){.mback{display:none}.nrw{display:none}}\n:host{display:block}\n";
/* 2026-11-03 ぐるぐる 重要マーク ◆：左の一覧の ◆ の場所（.imps）・見出しの ◆（.imp）。CSS（上）は shell2.html から作るので、足す分はここに書く */
var CSS_IMP='.ncf-nm{position:relative;padding-left:1.05em}.ncf-nm>.imps{position:absolute;left:0;top:.1em;width:1.05em;font-size:.85em;line-height:1.53;color:#c2410c}'
 +':host([data-dk]) .ncf-nm>.imps{color:#fb923c}.imp{color:#c2410c;font-size:.85em;margin-right:3px;vertical-align:1px}:host([data-dk]) .imp{color:#fb923c}'
 /* 2026-11-03 ぐるぐる英語：一覧の見出しの教科の切り替え［数学｜英語］ */
 +'.gsj{display:inline-flex;border:1.5px solid #2563eb;border-radius:999px;overflow:hidden;vertical-align:1px}.gsj button{font:inherit;font-size:13px;font-weight:700;min-height:30px;padding:0 12px;border:0;background:transparent;color:#2563eb;cursor:pointer}'
 +'.gsj button.on{background:#2563eb;color:#fff}:host([data-dk]) .gsj{border-color:#60a5fa}:host([data-dk]) .gsj button{color:#93c5fd}:host([data-dk]) .gsj button.on{background:#3b82f6;color:#0b1220}';
/* ggMount（gg_app.js）の影に足す：表紙の題（.gcvs）・開始画面の名前（.tsn）・帯（.prog・.ghl）・完了の見出し（ぐるぐるの回＝.wr-top の札の左・章まとめテスト＝.wr-sub のテストの名前の左）。
   host の data-imp＝part（ぐるぐるの回）｜ct（章まとめテスト） */
var CSS_APP_IMP=(function(){const B='content:"\u25c6";content:"\u25c6"/"重要マーク";color:#c2410c;font-size:.85em;',
  IN=[':host([data-imp]) .gcvs',':host([data-imp]) .tsn',':host([data-imp]) .prog',':host([data-imp=ct]) .wr-sub'],FL=[':host([data-imp]) .ghl',':host([data-imp=part]) .wr-top'];
 return IN.map(x=>x+'::before').join(',')+'{'+B+'margin-right:3px;vertical-align:1px}'+FL.map(x=>x+'::before').join(',')+'{'+B+'flex:none;margin-right:-3px}'
  +IN.concat(FL).map(x=>x.replace(') ',') .wsbody.dk ')+'::before').join(',')+'{color:#d24b00}';})();
window.ggShellMount=function(root,GG,opt){
 opt=opt||{};
 const sh=root.shadowRoot||root.attachShadow({mode:'open'});
 const KCSS=opt.katexCss||'ws/katex/katex.min.css';
 sh.innerHTML='<link rel="stylesheet" href="'+KCSS+'"><style>'+CSS+CSS_IMP+'</style><div id="app"><nav id="left"></nav><main id="right"></main></div>';
 if(!root.getAttribute('lang'))root.setAttribute('lang','ja');
 const $id=id=>sh.getElementById(id);
 const PV=!!opt.preview;
 /* 問題をあとで読む（2026-11-02 段3） */
 const LZ=!!GG.lazy&&typeof opt.loadParts==='function';let LDTOK=0;
 /* 問題の写し：words の id（wid・数えない印）を残す（JSON で写すと消える＝まちがえた問題の id が記録に入らない）2026-11-02 段3 */
 const CL=v=>{if(Array.isArray(v))return v.map(CL);if(v&&typeof v==='object'){const r={};for(const k in v)r[k]=CL(v[k]);if(v.wid!=null)Object.defineProperty(r,'wid',{value:v.wid,enumerable:false});return r;}return v;};
 if(opt.dark)root.setAttribute('data-dk','');else root.removeAttribute('data-dk');
 const isDark=()=>!!opt.dark;
 const KANA='アイウエオカ';
 /* 2026-11-03 ぐるぐる 重要マーク ◆：行の左はしの場所（◆ の無い行も同じ幅を空ける）・見出しの ◆・ggMount の影に CSS を足す */
 const IMPS=on=>'<span class="imps"'+(on?' aria-label="重要マーク">\u25c6':'>')+'</span>';
 const IMP=on=>on?'<span class="imp" aria-label="重要マーク">\u25c6</span>':'';
 const appImp=(host,on,k)=>{if(!on||!host||!host.shadowRoot)return;host.setAttribute('data-imp',k);const st=document.createElement('style');st.textContent=CSS_APP_IMP;host.shadowRoot.appendChild(st);};
 const RS=['A1','A2','B1','B2','C1','C2'];
 const RD=r=>String(r||'').replace(/^([ABC])([12])$/,'$1-$2');/* 画面に出す回の名前＝A-1（中の記号は A1 のまま） */
 /* 数式（モックの shell2 の KX・GMAC・gDeco・gArrDraw をそのまま。いまは「問題はまだ」のパートの型の表で使う。2026-11-03 確かめる画面は外した） */
 const GMAC={'\\UA':'\\htmlClass{gsa}{#1}','\\UB':'\\htmlClass{gsb}{#1}','\\UC':'\\htmlClass{gsc}{#1}','\\UD':'\\htmlClass{gsd}{#1}','\\UE':'\\htmlClass{gse}{#1}','\\UR':'\\htmlClass{gsr}{#1}','\\AF':'\\htmlData{af=#1}{#2}','\\AT':'\\htmlData{at=1}{#1}','\\ATD':'\\htmlData{atd=1}{#1}'};
 const gArrDraw=host=>{host.querySelectorAll(':scope>svg.garsv').forEach(s=>s.remove());const R=host.getBoundingClientRect();if(!R.width)return;const NS='http://www.w3.org/2000/svg';const sv=document.createElementNS(NS,'svg');sv.setAttribute('class','garsv');sv.setAttribute('width',R.width);sv.setAttribute('height',R.height);let s='<defs><marker id="garm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="garf"/></marker></defs>';
  host.querySelectorAll('[data-af]').forEach(f=>{const a=f.getBoundingClientRect(),lab=f.dataset.af||'';const ts=[...host.querySelectorAll('[data-at],[data-atd]')];
   [[ts.filter(t=>t.dataset.at),1],[ts.filter(t=>t.dataset.atd),-1]].forEach(([arr,dir])=>{const P=arr.map(t=>{const b=t.getBoundingClientRect();return{x1:a.left+a.width/2-R.left,x2:b.left+b.width/2-R.left,ya:dir>0?a.top-R.top+2:a.bottom-R.top-2,yb:dir>0?b.top-R.top+2:b.bottom-R.top-2}}).sort((p,q)=>Math.abs(p.x2-p.x1)-Math.abs(q.x2-q.x1));
    P.forEach((p,k)=>{const h=12+k*14,base=dir>0?Math.min(p.ya,p.yb):Math.max(p.ya,p.yb),top=base-dir*h;s+=`<path d="M${p.x1},${p.ya} C${p.x1},${top} ${p.x2},${top} ${p.x2},${p.yb-dir}" class="garp" marker-end="url(#garm)"/>`;
     if(lab&&k===P.length-1&&(dir>0||!ts.some(t=>t.dataset.at)))s+=`<text x="${(p.x1+p.x2)/2}" y="${dir>0?base-h-6:base+h+12}" class="gart" text-anchor="middle">${lab}</text>`;});});});
  sv.innerHTML=s;host.appendChild(sv);};
 const gDeco=root=>{try{root.querySelectorAll('.katex').forEach(k=>{const n=new Set([...k.querySelectorAll('.gsa,.gsb,.gsc,.gsd,.gse')].map(e=>e.className.match(/gs[a-e]/)[0]));if(n.size>=3)k.classList.add('gnum');
   if(k.querySelector('[data-af]')){const host=k.closest('.we,.wn,div')||k.parentNode;host.classList.add('garh');if(k.querySelector('[data-atd]'))host.classList.add('garhd');if(!host._gro){host._gro=1;try{new ResizeObserver(()=>gArrDraw(host)).observe(host);}catch(e){gArrDraw(host);}}}});}catch(e){}};
 const KX=el=>{try{renderMathInElement(el,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false,trust:true,strict:false,macros:GMAC});gDeco(el);}catch(e){}};
 /* 端末の記録。プレビューは端末に書かない（このページのあいだだけ覚える） */
 const PFX=PV?'ggpv_':(opt.keyPrefix||'kwtgg_');const MEM={};
 const raw={get(k){if(PV)return k in MEM?MEM[k]:null;try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){if(PV){MEM[k]=v;return;}try{localStorage.setItem(k,v);}catch(e){}},del(k){if(PV){delete MEM[k];return;}try{localStorage.removeItem(k);}catch(e){}}};
 const LS={get(k){try{return JSON.parse(raw.get(PFX+k)||'null');}catch(e){return null;}},set(k,v){raw.set(PFX+k,JSON.stringify(v));}};
 const SJS=['ma','en'].filter(k=>(GG.units||[]).some(u=>(u.subj||'ma')===k)||(GG.ny||[]).some(q=>(q.subj||'ma')===k));
 const SJN={ma:'数学',en:'英語'};const SJ_=x=>(x&&x.subj)||'ma';
 let SUBJ=(()=>{const s=opt.subject||LS.get('subj');return SJS.includes(s)?s:(SJS[0]||'ma');})();
 const PARTS=GG.parts||[];
 const P_=id=>PARTS.find(p=>p.id===id);
 /* 呼び名＝単元名＋丸数字＋回（例「1次方程式① A-1」）。パート名＝単元表の name の最初の「（」より前（main）。（ ）の中＝説明（sub） */
 const MARU='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮';
 function NMS(name){const s=String(name||''),i=s.indexOf('（');if(i<0)return {main:s,sub:''};const j=s.indexOf('）',i);return j<0?{main:s.slice(0,i).trim(),sub:s.slice(i+1)}:{main:(s.slice(0,i)+s.slice(j+1)).trim(),sub:s.slice(i+1,j)};}
 const NY_=id=>(GG.ny||[]).find(q=>q.id===id)||null;
 const NYAFT=q=>{const h=q&&q.after?HD(q.after):null;return h?h.unit+' '+h.maru:'';};
 function HD(id){const q=NY_(id);if(q){const nm=NMS(q.name);return {subj:SJ_(q),grade:q.grade,unit:'入試パターン',k:0,n:0,maru:'',main:nm.main,sub:nm.sub,name:q.name,ny:true,aft:NYAFT(q)};}
  for(const u of GG.units){const k=u.parts.findIndex(x=>x.id===id);if(k>=0){const x=u.parts[k],nm=NMS(x.name);return {subj:SJ_(u),grade:u.grade,unit:u.unit,k:k+1,n:u.parts.length,maru:MARU[k]||'('+(k+1)+')',main:nm.main,sub:nm.sub,name:x.name,imp:!!x.imp};}}return null;}
 const CALL=(id,R)=>{const h=HD(id);return h?(h.ny?'入試パターン '+h.main:h.unit+h.maru)+(R?' '+RD(R):''):RD(R);};
 const MARU_='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮';
 function HDBLK(id,kick){const h=HD(id);if(!h)return '';if(h.ny)return `<div class="hdk">${h.grade}${SJN[h.subj]||'数学'}　ぐるぐる${kick||''}</div><div class="hdt"><span class="tg" style="font-size:14px;vertical-align:5px">入試</span>${h.main}</div>${h.sub?`<div class="hds"><small>${h.sub}</small></div>`:''}<div class="hdk">${h.aft} が終わったら挑戦</div>`;const dots=Array.from({length:h.n},(_,i)=>`<span class="${i+1===h.k?'on':''}">${i+1}</span>`).join('');
  return `<div class="hdk">${h.grade}${SJN[h.subj]||'数学'}　ぐるぐる${kick||''}</div><div class="hdt">${h.unit}${h.n>1?`<span class="hdd hdi" aria-label="${h.unit}の${h.k}番目のパート（全${h.n}パート）">${dots}</span>`:''}</div><div class="hds">${IMP(h.imp)}${h.main}${h.sub?`<small>${h.sub}</small>`:''}</div>`;}
 /* 回の記録：サーバーの記録（opt.tstateOf）があればそれ、無ければ端末 */
 const rowOf=(id,R)=>{const p=P_(id);return p&&p.rowIds&&p.rowIds[R]||('gg_'+id+'_'+R);};
 const tkey=(id,R)=>PFX+'t_'+id+R;
 const tGet=(id,R)=>{if(!PV&&opt.tstateOf){const s=opt.tstateOf(rowOf(id,R));if(s!==undefined)return s;}try{return JSON.parse(raw.get(tkey(id,R))||'null');}catch(e){return null;}};
 const L=$id('left'),M=$id('right');
 /* 最初に開いておく本・パート：学年ごとに、問題のある最初の単元とそのパート */
 const GRADES_IN=['中1','中2','中3'].filter(g=>GG.units.some(u=>u.grade===g));
 const FOCUS_BK={},FOCUS_CH={};SJS.forEach(sj=>GRADES_IN.forEach(g=>{const p=PARTS.find(x=>x.grade===g&&!x.ny&&SJ_(x)===sj);const u0=GG.units.find(x=>x.grade===g&&SJ_(x)===sj);if(p){FOCUS_BK[sj+g]=(u0&&GG.units.find(x=>x.grade===g&&SJ_(x)===sj&&x.unit===p.unit)||{}).key||(g+'_'+p.unit);FOCUS_CH[sj+g]=p.id;}else if(u0)FOCUS_BK[sj+g]=u0.key;}));
 const DEF_BK=()=>Object.values(FOCUS_BK);
 const DEF_CH=()=>Object.values(FOCUS_CH).filter(Boolean);
 /* 1回の問題の数（決まり §0c）。記録の got は 100点満点（1問＝100/GN 点） */
 const GN=7,GPT=100/GN;
 const GNof=id=>{const p=P_(id);const n=p&&p.nq&&(p.nq.find(x=>x>0)||0);return n||GN;};   /* 2026-11-03 ぐるぐる英語：英語は12問 */
 const GPTof=id=>100/GNof(id);
 let SEL=null,VIEW='cover',API=null,CUR_R=null;
 /* できた（完了）の読み方：アプリの tDone と同じ（まちがえた問題の解説を全部見た・ノート・類題があれば類題） */
 function gDone(id,R,S){if(!S||S.got==null)return false;if(S.done)return true;const p=P_(id);if(!p||!p.rounds||!p.rounds[R])return false;   /* 問題をまだ読んでいない回は S.done だけで見る */
  const a=[];p.rounds[R].forEach(it=>(it.ren?it.steps:[it]).forEach(st=>a.push(st.a)));const w=a.map((x,j)=>(S.ans||[])[j]!==x?j:-1).filter(j=>j>=0);
  return w.every(j=>(S.seen||{})[j])&&(!w.length||((S.v===2?!!S.note:true)&&(!S.nq||S.redo)));}
 function hist(id,R){const H=LS.get('h_'+id+R)||[];const S=tGet(id,R);
  if(S&&gDone(id,R,S)&&!H.some(h=>h.at===S.at)){const rr=S.redo_res||[];const r1=rr.filter(r=>r.r!==2);H.push({at:S.at,got:Math.round(S.got/GPTof(id)),n:GNof(id),ro:r1.filter(r=>r.o).length,rn:r1.length});LS.set('h_'+id+R,H);}
  return H;}
 function rState(id,R){const S=tGet(id,R),H=hist(id,R);if(!S||S.got==null)return {k:'mada',H};if(gDone(id,R,S))return {k:'done',S,H};return {k:'fx',S,H};}
 function nextR(id){for(const R of ['A1','A2']){if(!hasR(id,R))continue;const s=rState(id,R);if(s.k!=='done')return R;}return hasR(id,'A2')?'A2':'A1';}
 const SV=(d,c)=>`<svg class="svi ${c||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
 const IC={go:SV('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),dn:SV('<path d="M6 9l6 6l6 -6"/>'),ok:SV('<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/>'),
  play:SV('<path d="M7 4v16l13 -8z"/>'),ck:SV('<path d="M5 12l5 5l10 -10"/>'),pen:SV('<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/>'),book:SV('<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6l0 13"/><path d="M12 6l0 13"/><path d="M21 6l0 13"/>')};
 /* 本＝単元（単元表の単元・パートの名前と順）。問題のそろったパートだけ ready。章まとめテストは ukey が本の key と同じもの */
 function BOOKS(){return GG.units.map(u=>{const parts=u.parts.map(x=>({id:x.id,no:x.no,name:x.name,ready:!!x.ready&&!!P_(x.id),cu:x.cu,pre:x.pre,imp:!!x.imp}));
   return {key:u.key,subj:SJ_(u),grade:u.grade,unit:u.unit,ui:u.ui,lin:parts.some(p=>p.ready),cts:(GG.cts||[]).filter(c=>c.ukey===u.key),parts};});}
 const OPEN={get(k){return LS.get('open_'+k);},set(k,v){LS.set('open_'+k,v);}};
 /* 学年のタブ：その子の学年が最初。押せるのは opt.grades（省くとデータにある学年）。プレビューは全部 */
 const ASSIGNED=(opt.grades&&opt.grades.length?opt.grades:GRADES_IN).filter(g=>GRADES_IN.includes(g));
 let MY_GRADE=(()=>{const g=opt.grade||LS.get('grade');return ASSIGNED.includes(g)?g:(ASSIGNED[0]||'中1');})();let GR=null;
 let FLT=(()=>{const f=LS.get('flt');return ['all','ny','ct'].includes(f)?f:'all';})();
 function guruTag(st,id){if(st.k==='mada')return `<span class="utag">${IC.play}まだ</span>`;const pt=Math.round((st.S.got||0)/GPTof(id))+'/'+GNof(id)+'問';
  if(st.k==='fx')return `<span class="utag warn">${IC.pen}${pt} ・ 解き直しの途中</span>`;return `<span class="utag done">${IC.ck}できた ${pt}</span>`;}
 const DOTS=(on,cl)=>`<div class="dprog-dots ${cl||''}" aria-label="${on.length}回のうち できた回 ${on.filter(Boolean).length}">${on.map(o=>`<i class="${o?'on':''}"></i>`).join('')}</div>`;
 const hasR=(id,R)=>{const p=P_(id);return !p||!p.rs||p.rs.includes(R);};   /* 2026-11-03 ぐるぐる英語：表紙の行の rs に無い回はまだ無い */
 function guruRow(id,ttl,oc){const st=RS.map(R=>rState(id,R)),on=st.map(x=>x.k==='done'),all=on.every(Boolean),nx=RS.find((R,i)=>!on[i]&&hasR(id,R))||RS.find(R=>hasR(id,R));
  const row=(R,i)=>!hasR(id,R)?`<div class="nqp" style="cursor:default;opacity:.55"><div class="nqp-nm"><span class="rn">${RD(R)}</span></div><span class="ncf-soon">準備中</span></div>`:`<div class="nqp ${VIEW==='ws'&&SEL===id&&CUR_R===R?'on':''}" data-p="${id}" data-r="${R}"><div class="nqp-nm"><span class="rn">${RD(R)}</span></div>${guruTag(st[i],id)}${st[i].k==='done'?'':`<span class="ncf-go">${IC.go}</span>`}</div>`;
  return `<div class="qchw ${oc.includes(id)?'open':''}" data-ch="${id}"><div class="nchap" data-tg="${id}"><div class="ncf-nm">${ttl}${DOTS(on)}</div>${all?`<span class="ncf-done">${IC.ok}</span>`:`<span class="ncf-go" data-go1="${id}" data-gor="${nx}" title="${RD(nx)} を解く">${IC.go}</span>`}<span class="ncf-arw">${IC.dn}</span></div>`
   +`<div class="nqparts">${RS.map(row).join('')}</div></div>`;}
 const soonRow=(ttl,attr,on,sm)=>`<div class="qchw"><div class="nchap ${on?'on':''}" ${attr}><div class="ncf-nm">${ttl}<small>${sm}</small></div><span class="ncf-soon">準備中</span></div></div>`;
 function nyRow(q,oc,where){const x=NMS(q.name);const ttl=IMPS(false)+(where==='ny'?`<span class="tg">${q.grade}</span>${x.main}${x.sub?`<small>${x.sub}</small>`:''}<small>${NYAFT(q)} が終わったら挑戦</small>`:`<span class="tg">入試</span>${x.main}${x.sub?`<small>${x.sub}</small>`:''}`);
  return q.ready&&P_(q.id)?guruRow(q.id,ttl,oc):soonRow(ttl,`data-ny="${q.id}"`,VIEW==='nys'&&SEL===q.id,'問題はまだ');}
 const nyDone=q=>q.ready&&P_(q.id)&&['A1','A2'].every(R=>rState(q.id,R).k==='done');
 function drawLeft(){if(!GR){GR=LS.get('grade')||MY_GRADE;if(!ASSIGNED.includes(GR))GR=MY_GRADE;}const all=BOOKS(),bks=all.filter(b=>b.grade===GR&&b.subj===SUBJ);
  const SJH=SJS.length>1?`<span class="gsj" role="group" aria-label="教科">${SJS.map(k=>`<button type="button" class="${k===SUBJ?'on':''}" data-sj="${k}" aria-pressed="${k===SUBJ}">${SJN[k]}</button>`).join('')}</span>`:(SJN[SJS[0]]||'数学');
  /* 2026-11-04 01:17 川上さん「こんな2行にする必要あんの？」：左の見出しは1行（折り返さない）。「先生のプレビュー：記録しない」は先生画面の右の列と下の黒いバーに出ているので外した */
  let h=`<div class="lh" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>ぐるぐる</b><span>${SJH}</span></div><div class="gtab">${['中1','中2','中3'].map(g=>{const has=ASSIGNED.includes(g);return `<button type="button" class="${g===GR?'on':''}" data-gr="${g}" ${has?'':'disabled'}>${g}</button>`;}).join('')}</div>`
   +`<div class="lflt" role="group" aria-label="絞り込み">${[['all','全部'],['ny','入試パターン'],['ct','章まとめテスト']].map(([k,t])=>`<button type="button" class="${FLT===k?'on':''}" data-flt="${k}" aria-pressed="${FLT===k}">${t}</button>`).join('')}</div>`;
  const ob=OPEN.get('bk')||DEF_BK(),oc=OPEN.get('ch')||DEF_CH();const NY=(GG.ny||[]).filter(q=>SJ_(q)===SUBJ);
  if(FLT==='ny'){/* 学年のタブに関係なく、中1〜中3 の入試パターンを分野ごとに */
   const dn=NY.filter(nyDone).length;
   h+=`<div class="lnote">中1〜中3 の入試パターンを、学年に関係なく全部ならべています。</div><div class="lcnt">入試パターン ${dn} / ${NY.length} 本<div class="nbk-bar"><i style="width:${NY.length?Math.round(dn/NY.length*100):0}%"></i></div></div>`;
   const FL=[];NY.forEach(q=>{if(!FL.includes(q.field))FL.push(q.field);});
   ['数と式','方程式','関数','図形','確率・データ'].filter(f=>FL.includes(f)).concat(FL.filter(f=>!['数と式','方程式','関数','図形','確率・データ'].includes(f))).forEach(f=>{
    h+=`<div class="lfg">${f}</div>`+NY.filter(q=>q.field===f).map(q=>nyRow(q,oc,'ny')).join('');});}
  else if(FLT==='ct'){const cb=bks.filter(b=>b.cts.length);if(!cb.length)h+=`<div class="cv-note" style="margin:10px 4px">${GR} の章まとめテストは、まだありません。</div>`;
   cb.forEach(b=>{h+=`<div class="lfg">${b.unit}</div>`+b.cts.map(c=>ctLeftRow(c,oc)).join('');});}
  else{
   if(!bks.length)h+=`<div class="cv-note" style="margin:10px 4px">${GR} のぐるぐるは、まだありません。</div>`;
   bks.forEach(b=>{
    const rdy=b.parts.filter(p=>p.ready);
    const fin=rdy.filter(p=>['A1','A2'].every(R=>rState(p.id,R).k==='done')).length;
    const meta=[b.cts.length?'章まとめテスト '+b.cts.map(c=>c.kind).join('・'):'',b.lin?`A-1・A-2 まで終わったパート ${fin} / ${rdy.length}`:'問題はまだ'].filter(Boolean).join('<br>');
    let rows='';
    b.parts.forEach((p,pi)=>{const x=NMS(p.name),mr=IMPS(p.imp)+`<span class="mr">${b.unit} ${MARU[pi]||'('+p.no+')'}</span>`;
     if(p.ready)rows+=guruRow(p.id,mr+x.main+(x.sub?`<small>${x.sub}</small>`:''),oc);
     else rows+=soonRow(mr+x.main+(x.sub?`<small>${x.sub}</small>`:''),`data-s="${p.id}"`,VIEW==='struct'&&SEL===p.id,b.subj==='en'?'問題はまだ':'ぐるぐるの型だけ（問題はまだ）');
     NY.filter(q=>q.after===p.id).forEach(q=>{rows+=nyRow(q,oc,'all');});
     b.cts.filter(c=>c.after===p.id).forEach(c=>{rows+=ctLeftRow(c,oc);});});
    h+=`<div class="nbook ${b.lin?'':'soon'} ${ob.includes(b.key)?'open':''}" data-bk="${b.key}"><div class="nbook-head"><div class="nbk-ic">${IC.book}</div><div class="nbk-body"><div class="nbk-nm">${b.unit}${b.parts.length>1?`<span class="nbk-n">${b.parts.length===2?MARU_[0]+MARU_[1]:MARU_[0]+'〜'+MARU_[b.parts.length-1]}</span>`:''}</div><div class="nbk-meta">${meta}</div>${b.lin?`<div class="nbk-bar"><i style="width:${rdy.length?Math.round(fin/rdy.length*100):0}%"></i></div>`:''}</div><span class="nbk-arw">${IC.dn}</span></div><div class="nbk-detail">${rows}</div></div>`;});}
  L.innerHTML=h;
  const tg=(k,v)=>{const a=OPEN.get(k)||(k==='bk'?DEF_BK():DEF_CH());const i=a.indexOf(v);if(i<0)a.push(v);else a.splice(i,1);OPEN.set(k,a);};
  L.querySelectorAll('[data-gr]').forEach(x=>x.onclick=()=>{GR=x.dataset.gr;LS.set('grade',GR);drawLeft();L.scrollTop=0;});
  L.querySelectorAll('[data-sj]').forEach(x=>x.onclick=()=>{if(SUBJ===x.dataset.sj)return;SUBJ=x.dataset.sj;LS.set('subj',SUBJ);SEL=null;VIEW='cover';CUR_R=null;render();L.scrollTop=0;});
  L.querySelectorAll('[data-flt]').forEach(x=>x.onclick=()=>{FLT=x.dataset.flt;LS.set('flt',FLT);drawLeft();L.scrollTop=0;});
  L.querySelectorAll('.nbook-head').forEach(x=>x.onclick=()=>{const b=x.parentNode;b.classList.toggle('open');tg('bk',b.dataset.bk);});
  L.querySelectorAll('[data-tg]').forEach(x=>x.onclick=()=>{const w=x.closest('.qchw');w.classList.toggle('open');tg('ch',w.dataset.ch);});
  L.querySelectorAll('[data-r]').forEach(x=>x.onclick=()=>{const id=x.dataset.p;const w=x.closest('.qchw');if(w&&!w.classList.contains('open')){w.classList.add('open');tg('ch',id);}openRound(id,x.dataset.r);});
  L.querySelectorAll('[data-go1]').forEach(x=>x.onclick=e=>{e.stopPropagation();openRound(x.dataset.go1,x.dataset.gor);});
  L.querySelectorAll('[data-cgo]').forEach(x=>x.onclick=e=>{e.stopPropagation();openCt(x.dataset.cgo,x.dataset.cgr);});
  L.querySelectorAll('[data-s]').forEach(x=>x.onclick=()=>{SEL=x.dataset.s;VIEW='struct';render();});
  L.querySelectorAll('[data-ny]').forEach(x=>x.onclick=()=>{SEL=x.dataset.ny;VIEW='nys';render();});
  L.querySelectorAll('[data-cr]').forEach(x=>x.onclick=()=>openCt(x.dataset.ct,x.dataset.cr));
  const on=L.querySelector('.nqp.on,.nchap.on')||(SEL&&L.querySelector(`.qchw[data-ch="${SEL}"]`));if(on){try{const r=on.getBoundingClientRect(),lr=L.getBoundingClientRect();if(r.top<lr.top||r.bottom>lr.bottom)L.scrollTop+=r.top-lr.top-60;}catch(e){}}}
 const inpart=v=>{if(v)root.setAttribute('data-inpart','');else root.removeAttribute('data-inpart');};
 function render(){LDTOK++;inpart(!!SEL||VIEW==='ct');drawLeft();if(!SEL){API=null;M.innerHTML='<div class="card"><div class="cv-note" style="margin:0">左の一覧から、学校で習ったパートを選ぼう。青い矢印は、次にやる回。</div></div>';return;}
  if(VIEW==='struct')return drawStruct();
  if(VIEW==='nys')return drawNyStruct();
  if(VIEW==='cover'){const p=P_(SEL);if(p&&p.ready)return openRound(SEL,nextR(SEL));return drawStruct();}}
 const BACKB=`<button class="back mback" data-home="1">← ぐるぐるの一覧</button>`;
 const bindHome=()=>M.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>{SEL=null;VIEW='cover';CUR_R=null;render();});
 /* ===== 問題はまだのパート：単元表の型（A・B・C の q1〜q7） ===== */
 function partOf(id){for(const b of BOOKS())for(const p of b.parts)if(p.id===id)return {b,p};return null;}
 function drawStruct(){const o=partOf(SEL);if(!o){M.innerHTML='';return;}const {p}=o,c=p.cu||{};
  if(o.b.subj==='en'){M.innerHTML=`${BACKB}<div class="card"><div class="hdb">${HDBLK(p.id,'<span class="st-badge">問題はまだ</span>')}</div><div class="cv-note">このパートの問題は、まだありません。</div></div>`;bindHome();return;}   /* 2026-11-03 ぐるぐる英語 */
  const q=(L_,k)=>((c[L_]||{})['q'+k]||'');
  let tr='';for(let k=1;k<=7;k++)tr+=`<tr class="${k<=3?'rv':''}"><td class="no">(${k})</td><td>${q('A',k)}</td><td>${q('B',k)}</td><td>${q('C',k)}</td></tr>`;
  const nt=[c.forest?`元にしたページ：フォレスタ ${c.forest}`:'',c.teiki?`定期テスト：${c.teiki}`:'',c.note?`メモ：${c.note}`:''].filter(Boolean);
  M.innerHTML=`${BACKB}<div class="card"><div class="hdb">${HDBLK(p.id,'<span class="st-badge">問題はまだ</span>')}</div>
   <div class="cv-l">ぐるぐるの型（単元表。A1＝A2・B1＝B2・C1＝C2）。(1)(2) は基礎計算、(3) は前の単元・前の学年、(4)〜(7) はこのパート</div>
   <div style="overflow-x:auto"><table class="st-tb"><tr><th></th><th>A</th><th>B</th><th>C</th></tr>${tr}</table></div>
   ${nt.map(x=>`<div class="st-note">${x}</div>`).join('')}</div>`;KX(M);bindHome();}
 function drawNyStruct(){const q=NY_(SEL);if(!q){M.innerHTML='';return;}
  M.innerHTML=`${BACKB}<div class="card"><div class="hdb">${HDBLK(q.id,'<span class="st-badge">問題はまだ</span>')}</div><div class="cv-note">このパターンの問題は、まだありません。</div></div>`;KX(M);bindHome();}
 /* ===== ぐるぐるの回（入口・解く・採点・解説・解き直し・類題）＝ggMount ===== */
 /* ノートの書き方の絵：img/gg/*.svg を <img> で出す（ジョブスの決め 4：要るときだけ読む。画面に出たときにブラウザが読み、あとはキャッシュ）。opt.imgBase＝img の前に付ける場所（省くと ''）、opt.libV＝?v= の版 */
 const NOTE_K=['start','fix','r0','r1','r2'];
 function noteSvg(id){if(opt.noteImg===false)return null;const e=/^m1u1p/.test(id)?'e_':'';const src=k=>(opt.imgBase||'')+'img/gg/'+e+k+'.svg'+(opt.libV?'?v='+opt.libV:'');
  const o={};NOTE_K.forEach(k=>{o[k]=`<img src="${src(k)}" alt="" decoding="async" style="display:block;width:100%;height:auto${/^r/.test(k)?';max-width:300px':''}">`;});return o;}
 /* 類題の結果 {ty,k,o,p,r} に、その類題の words の id（w）を足して送る（2026-11-02 段3・gg_rui_log の word_id） */
 const ruiW=(id,L)=>{const p=P_(id);return (L||[]).map(r=>{const a=p&&p.rui&&p.rui[r.ty];const q=a&&a.length?a[(+r.k||0)%a.length]:null;return q&&q.wid?Object.assign({},r,{w:q.wid}):r;});};
 function onRec(kind,id,R,rowId,key,S,submit,res){if(PV)return;raw.set(key,JSON.stringify(S));if(opt.onRecord){try{const S2=(kind==='round'&&S&&S.redo_res&&S.redo_res.length)?Object.assign({},S,{redo_res:ruiW(id,S.redo_res)}):S;opt.onRecord({kind,rowId,pid:id,r:R,state:S2,submit:!!submit,res:res||null});}catch(e){}}}
 function wsHead(extra){return `<div class="wshead noprint"><button class="back" style="margin:0" id="wsb">← 一覧</button>${extra||''}</div><div id="host"></div>`;}
 /* 2026-11-03 ぐるぐる：先生のプレビューの上の帯の［確かめる］（PVB・bindPv）は外した（決まり §0c 解説の決まり 24） */
 /* 問題をあとで読む：開く前に、まだ読んでいない行を opt.loadParts で読む。読んでいるあいだに別の所を押したら、読み終わっても開かない（LDTOK） */
 const esc_=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function ctBackRU(c,rs){const L=[];rs.forEach(R=>{const T=c.rounds[R];if(!T||!T.items)return;T.items.forEach(it=>[it].concat(it.steps||[]).forEach(x=>{const m=/^gg:([^:]+):/.exec(x.back||'');const q=m&&P_(m[1]);if(q&&q.rowIds.RU&&!(q.ld||{}).RU&&!L.includes(q.rowIds.RU))L.push(q.rowIds.RU);}));});return L;}
 function needOf(kind,id,R){if(!LZ)return {L:[]};
  if(kind==='part'){const p=P_(id);if(!p)return {L:[]};const L=RS.filter(r=>p.rowIds[r]&&!(p.ld||{})[r]).map(r=>p.rowIds[r]);if(p.rowIds.RU&&!(p.ld||{}).RU)L.push(p.rowIds.RU);return {L,backs:false};}
  const c=CT_(id);if(!c)return {L:[]};const rs=R?[R]:CT_RS.filter(x=>c.rounds[x]);const L=rs.filter(r=>c.rowIds[r]&&!(c.ld||{})[r]).map(r=>c.rowIds[r]);
  return L.length?{L,backs:true}:{L:ctBackRU(c,rs),backs:false};}
 function withData(kind,id,R,go){const n=needOf(kind,id,R);if(!n.L.length)return go();const tk=++LDTOK;
  M.innerHTML=`${BACKB}<div class="card"><div class="cv-note" style="margin:0">問題を読み込み中…</div></div>`;bindHome();
  Promise.resolve().then(()=>opt.loadParts(n.L,{backs:!!n.backs})).then(ws=>{ggFillWords(GG,ws||[]);
   if(tk!==LDTOK)return;go();})
  .catch(e=>{if(tk!==LDTOK)return;M.innerHTML=`${BACKB}<div class="card"><div class="cv-note" style="margin:0;color:#b91c1c">問題を読めませんでした（${esc_(e&&e.message||e)}）。もう一度、左の一覧から開いてください。</div></div>`;bindHome();});}
 function openRound(id,R){const p=P_(id);if(!p)return;if(p.grade)GR=p.grade;if(SJS.includes(SJ_(p)))SUBJ=SJ_(p);VIEW='ws';SEL=id;CUR_R=R;drawLeft();inpart(true);API=null;withData('part',id,null,()=>openRound_(id,R));}
 function openRound_(id,R){const p=P_(id);if(!p)return;if(p.grade)GR=p.grade;VIEW='ws';SEL=id;CUR_R=R;drawLeft();inpart(true);
  const items=CL(p.rounds[R]);
  const H=HD(id);const rowId=rowOf(id,R);const EN=SJ_(p)==='en';const T={k:'X',min:p.min||10,name:CALL(id,R),ver:R,test:true,pt:GPTof(id),ins:'正しいものを選ぼう',items,part_id:rowId};
  const cards=((p.point&&p.point.sections)||[]).flatMap(s=>s.cards).map(c=>({h:c.h,rows:c.rows}));
  /* 2026-11-03 ぐるぐる：入試パターンは単元の番号が 0＝アプリの小見出し（BOOK＋丸数字＋名前）が「入試パターン undefined…」になっていた（段3 から）。入試パターンは UNIT_TITLE に「単元」を付けず、本の名前（book）にパターンの名前を入れる */
  const D={UNIT_TITLE:H.ny?H.main:'単元'+H.k+' '+H.main,PATS:[{no:p.no,name:H.main,point:{title:'ポイント',cards},parts:[{k:'W',wu:true,name:'ポイント',part_id:'gp_'+p.id,items:[{q:'',steps:[{s:'',c:['ア','イ'],a:0,w:[]}]}]}]}],TEST:T,POOL:{}};
  M.innerHTML=wsHead();$id('wsb').onclick=()=>{SEL=null;VIEW='cover';CUR_R=null;render();};
  const host=$id('host');host.classList.toggle('dkhost',isDark());
  const key=tkey(id,R);
  const SN=SJN[SJ_(p)]||'数学';
  const o={katexCss:KCSS,dark:isDark(),book:H.ny?p.grade+SN+' 入試パターン '+H.main:p.grade+SN+' '+p.unit,shuffle:false,innerBack:false,tkey:key,startPid:T.part_id,
   guru:{id,no:p.no,name:p.name,hd:H,unit:p.grade+SN+'　'+p.unit,catch:p.catch,cover:false,pointDone:true,examples:p.cover,onEntry:()=>openRound(id,R),kiso:p.kiso||{},noteSvg:EN?null:noteSvg(id),types:p.types,rui:p.rui,onNext:r=>openRound(id,r)}};
  if(EN){o.en=true;o.guru.en={meta:p.meta||''};if(opt.audioBase)o.audioBase=opt.audioBase;}   /* 2026-11-03 ぐるぐる英語 */
  if(PV)Object.assign(o,{preview:true});
  else{Object.assign(o,{live:true,resumeKey:PFX+'res_'+id+R});if(opt.resFx)o.resFx=(lv,x)=>{try{opt.resFx(lv,x);}catch(e){}};
   if(opt.onRecord||opt.tstateOf)Object.assign(o,{tstate:tGet(id,R),onTestSubmit:(pid,S,res)=>onRec('round',id,R,rowId,key,S,true,res),onTestState:(pid,S)=>onRec('round',id,R,rowId,key,S,false)});}
  API=ggMount(host,D,o);appImp(host,!!p.imp,'part');   /* 2026-11-03 ぐるぐる 重要マーク ◆（表紙・帯・完了） */
  host.addEventListener('click',()=>setTimeout(()=>{if(VIEW==='ws'&&SEL===id)drawLeft();},400));}
 /* ===== 章まとめテスト（1単元に 基礎・利用。A-1・A-2・B-1・B-2。1回20問前後・80点で合格）。解く画面・採点・合格・直しは ws_app と同じ（opt.guru なし） ===== */
 const CT_RS=['A1','A2','B1','B2'];
 const CT_=id=>(GG.cts||[]).find(c=>c.id===id)||null;
 const ctRow=(c,R)=>c.rowIds&&c.rowIds[R]||('gg_'+c.id+'_'+R);
 const ctKey=(id,R)=>PFX+'ct_'+id+R;
 const ctGet=(id,R)=>{const c=CT_(id);if(!PV&&opt.tstateOf&&c){const s=opt.tstateOf(ctRow(c,R));if(s!==undefined)return s;}try{return JSON.parse(raw.get(ctKey(id,R))||'null');}catch(e){return null;}};
 const ctTag=(c,R)=>`${c.unit} 章まとめ ${c.kind}${R?' '+RD(R):''}`;
 const ctNq=(c,R)=>{const T=c.rounds[R];return T?(T.items?T.items.reduce((n,it)=>n+(it.ren?it.steps.length:1),0):(T.nq||0)):0;};   /* 問題をまだ読んでいないときは行の nq */
 function ctState(c,R){const S=ctGet(c.id,R);if(!S||S.got==null)return {k:'mada'};if(S.pass)return {k:'pass',S};
  const a=[];((c.rounds[R]&&c.rounds[R].items)||[]).forEach(it=>(it.ren?it.steps:[it]).forEach(st=>a.push(st.a)));
  const w=a.map((x,j)=>(S.ans||[])[j]!==x?j:-1).filter(j=>j>=0);const dn=w.every(j=>(S.seen||{})[j])&&(!w.length||((S.v===2?!!S.note:true)&&(!S.nq||S.redo)));
  return {k:dn?'done':'fx',S};}
 function ctLeftRow(c,oc){const rs=CT_RS.filter(R=>c.rounds[R]);const sts=rs.map(R=>ctState(c,R));const ps=rs.find((R,i)=>sts[i].k==='pass');const T0=c.rounds[rs[0]]||{};
  const tag=st=>st.k==='mada'?`<span class="utag">${IC.play}まだ</span>`:st.k==='pass'?`<span class="utag done">${IC.ck}できた ${st.S.got}点</span>`:st.k==='fx'?`<span class="utag warn">${IC.pen}${st.S.got}点 ・ 解き直しの途中</span>`:`<span class="utag">${IC.pen}${st.S.got}点 ・ 直し済み</span>`;
  const row=(R,i)=>`<div class="nqp ${VIEW==='ct'&&SEL===c.id&&CUR_R===R?'on':''}" data-ct="${c.id}" data-cr="${R}"><div class="nqp-nm"><span class="rn">${RD(R)}</span></div>${tag(sts[i])}${sts[i].k==='mada'||sts[i].k==='fx'?`<span class="ncf-go">${IC.go}</span>`:''}</div>`;
  const nx=rs[sts.findIndex(x=>x.k==='fx'||x.k==='mada')]||rs[sts.findIndex(x=>x.k!=='pass')]||rs[0];
  const nm=String(c.name).replace(/^章まとめテスト\s*/,'');
  return `<div class="qchw ctw ${oc.includes(c.id)?'open':''}" data-ch="${c.id}"><div class="nchap" data-tg="${c.id}"><div class="ncf-nm">${IMPS(c.imp)}<span class="tg ct">章まとめ</span>${nm}<small>1回 ${ctNq(c,rs[0])}問・${T0.min||30}分・80点で合格</small>${DOTS(sts.map(x=>x.k==='pass'),'d4')}</div>${ps?`<span class="ncf-done">${IC.ok}</span>`:`<span class="ncf-go" data-cgo="${c.id}" data-cgr="${nx}" title="${RD(nx)} を解く">${IC.go}</span>`}<span class="ncf-arw">${IC.dn}</span></div>`
   +`<div class="nqparts">${rs.map(row).join('')}</div></div>`;}
 /* 戻る所（back）：前の単元ワークシートの番号（m2c3u5p1 など）は外す。'gg:{パートid}:{型,型}' は類題をつなぐ所として残す */
 function ctNoBack(T){let n=0;const bad=b=>b&&!/^gg:/.test(b);T.items.forEach(it=>{if(bad(it.back)){n++;delete it.back;}(it.steps||[]).forEach(st=>{if(bad(st.back)){n++;delete st.back;}});});return n;}
 /* 章まとめテストの類題：back ごとに、そのパートのぐるぐるの類題（rui）を POOL の形 {q, steps:[{s,c,a,w}]} にして渡す。名前（BACKN）＝「1次方程式 ② 方程式の解き方」 */
 const RUI_GH0='次の問いに答えなさい。';
 function ctPool(T){const pool={},nm={};
  const add=k=>{if(!k||!/^gg:/.test(k)||pool[k])return;const [,pid,ts]=k.split(':');const p=P_(pid),h=HD(pid);if(!p||!h||!p.rui)return;
   const L_=[];ts.split(',').forEach(t=>(p.rui[t]||[]).forEach(it=>{if(!Array.isArray(it.c)||it.a==null)return;
    L_.push({q:(it.gh&&it.gh!==RUI_GH0?`<div style="margin:0 0 6px">${it.gh}</div>`:'')+it.q,steps:[{s:it.ins||'',c:it.c.slice(),a:it.a,w:(it.w||[]).slice()}]});}));
   if(!L_.length)return;pool[k]=L_;nm[k]=`${h.unit} ${h.maru} ${h.main}`;};
  T.items.forEach(it=>{add(it.back);(it.steps||[]).forEach(st=>add(st.back));});
  T.items.forEach(it=>{if(it.back&&!pool[it.back])delete it.back;(it.steps||[]).forEach(st=>{if(st.back&&!pool[st.back])delete st.back;});});
  return {pool,nm};}
 function ctTest(c,R){const T=CL(c.rounds[R]);T.part_id=ctRow(c,R);T.tag=ctTag(c,R);T.range=`章まとめテスト ${c.kind} ${c.rng}`;T.vers=CT_RS.filter(x=>c.rounds[x]);T.lb='ぐるぐる';ctNoBack(T);const pb=ctPool(T);T.__pool=pb.pool;T.__nm=pb.nm;return T;}
 function ctOnState(c,R,S,first,res){const was=!!((ctGet(c.id,R)||{}).pass);onRec('ct',c.id,R,ctRow(c,R),ctKey(c.id,R),S,first,res);
  if(S&&S.pass&&!was&&opt.ctFx){try{opt.ctFx(S.got>=100?'perfect':'mid',{t:S.got>=100?'全問正解':'合格',score:S.got});}catch(e){}}}
 function ctMount(host,c,R){const T=ctTest(c,R),pool=T.__pool,nm=T.__nm;delete T.__pool;delete T.__nm;
  host.classList.toggle('dkhost',isDark());
  const o={katexCss:KCSS,dark:isDark(),book:c.grade+(SJN[SJ_(c)]||'数学')+' '+c.unit,shuffle:false,innerBack:false,tkey:ctKey(c.id,R),startPid:T.part_id,en:SJ_(c)==='en',audioBase:opt.audioBase,
   rangePass:()=>{const r=CT_RS.find(x=>{const S=ctGet(c.id,x);return S&&S.pass;});return r?RD(r):null;}};
  if(PV)o.preview=true;else Object.assign(o,{live:true,tstate:ctGet(c.id,R),onTestSubmit:(pid,S,res)=>ctOnState(c,R,S,true,res),onTestState:(pid,S)=>ctOnState(c,R,S,false)});
  return ggMount(host,{UNIT_TITLE:c.ut,PATS:[],TEST:T,POOL:pool,BACKN:nm},o);}
 function openCt(id,R){const c=CT_(id);if(!c)return;R=c.rounds[R]?R:CT_RS.find(x=>c.rounds[x]);if(c.grade)GR=c.grade;if(SJS.includes(SJ_(c)))SUBJ=SJ_(c);VIEW='ct';SEL=id;CUR_R=R;drawLeft();inpart(true);API=null;withData('ct',id,R,()=>openCt_(id,R));}
 function openCt_(id,R){const c=CT_(id);if(!c)return;R=c.rounds[R]?R:CT_RS.find(x=>c.rounds[x]);if(c.grade)GR=c.grade;VIEW='ct';SEL=id;CUR_R=R;
  {const o=OPEN.get('ch')||DEF_CH();if(!o.includes(id)){o.push(id);OPEN.set('ch',o);}const ob=OPEN.get('bk')||DEF_BK();if(!ob.includes(c.ukey)){ob.push(c.ukey);OPEN.set('bk',ob);}}
  drawLeft();inpart(true);
  M.innerHTML=wsHead();$id('wsb').onclick=()=>{SEL=null;VIEW='cover';CUR_R=null;render();};
  const host=$id('host');API=ctMount(host,c,R);appImp(host,!!c.imp,'ct');   /* 2026-11-03 ぐるぐる 重要マーク ◆ */
  host.addEventListener('click',()=>setTimeout(()=>{if(VIEW==='ct'&&SEL===id)drawLeft();},400));}
 /* 2026-11-03 ぐるぐる：確かめる画面（rvW の形・openReview・drawReview・rvEntries・RVP・rvW・rvRow）は外した（決まり §0c 解説の決まり 24。モックの叩き台の点検用だった） */
 /* 2026-11-03 ぐるぐる印刷（先生画面）：紙を組むためだけのアプリを、見えない host に置く。画面（左の一覧・M）にはさわらない。
    load(kind,id,R)＝その回の問題をまだ読んでいなければ読む（Promise）。paper(kind,id,R,host)＝ggMount の返り（paperHtml(解答解説か)・K(要素) を使う）。
    kind＝'part'（通常回・入試パターン）｜'ct'（章まとめテスト）。通常回はテストの形（T.test）で置き、paperHtml(true) が「問題・正解・解説」の解答解説になる */
 function paperLoad(kind,id,R){const n=needOf(kind,id,R);if(!n.L.length)return Promise.resolve();return Promise.resolve().then(()=>opt.loadParts(n.L,{backs:!!n.backs})).then(ws=>{ggFillWords(GG,ws||[]);});}
 function paperMount(kind,id,R,host){
  if(kind==='ct'){const c=CT_(id);if(!c||!c.rounds[R]||!c.rounds[R].items)return null;const T=ctTest(c,R);delete T.__pool;delete T.__nm;
   return ggMount(host,{UNIT_TITLE:c.ut,PATS:[],TEST:T,POOL:{}},{katexCss:KCSS,dark:false,book:c.grade+(SJN[SJ_(c)]||'数学')+' '+c.unit,shuffle:false,innerBack:false,tkey:'ggpp_'+c.id+R,startPid:T.part_id,en:SJ_(c)==='en',audioBase:opt.audioBase,preview:true});}
  const p=P_(id);if(!p||!p.rounds[R])return null;const H=HD(id);const SN=SJN[SJ_(p)]||'数学';
  const T={k:'X',min:p.min||10,name:CALL(id,R),ver:R,test:true,pt:GPTof(id),ins:'正しいものを選ぼう',items:CL(p.rounds[R]),part_id:rowOf(id,R),gr:1};
  return ggMount(host,{UNIT_TITLE:H.ny?H.main:'単元'+H.k+' '+H.main,PATS:[],TEST:T,POOL:{}},{katexCss:KCSS,dark:false,book:H.ny?p.grade+SN+' 入試パターン '+H.main:p.grade+SN+' '+p.unit,shuffle:false,innerBack:false,tkey:'ggpp_'+id+R,startPid:T.part_id,en:SJ_(p)==='en',audioBase:opt.audioBase,preview:true});}
 render();
 return {render,open:(id,R)=>openRound(id,R||nextR(id)),openCt:(id,R)=>openCt(id,R),state:()=>({SEL,VIEW,CUR_R,GR,FLT}),app:()=>API,paperLoad,paperMount,
  destroy:()=>{API=null;sh.innerHTML='';if(PV)Object.keys(localStorage).filter(k=>/^ggpv_/.test(k)).forEach(k=>{try{localStorage.removeItem(k);}catch(e){}});}};
};
/* 記録をサーバーに送る形（2026-11-02 段3・生徒にはまだ出していない＝student.html はまだ使っていない）
   var B=ggRecBridge(call, records)：call(送るもの)＝Promise({ok,data})（student.html の call）・records＝GAS の gg_records の data.records（{回の行id:{state,…}}）
   ggShellMount(root, GG, {tstateOf:B.tstateOf, onRecord:B.onRecord, …})
   提出（ev.submit）＝gg_submit、それ以外（解説を見た・ノート・類題・完了）＝gg_state。同じ回の行は順番に送る（提出が届く前に直しを送らない）。
   送れなかったときの送り直し（student.html の未送信キュー）は、生徒に出すときにつなぐ。B.last＝最後の返事（確かめ用） */
window.ggRecBridge=function(call,records){
 const R=records||{},Q={};let n=0;
 const B={records:R,last:null,
  tstateOf:id=>R[id]?R[id].state:undefined,
  onRecord:ev=>{if(!ev||!ev.rowId)return;R[ev.rowId]=Object.assign(R[ev.rowId]||{},{state:ev.state});
   const body=ev.submit?{action:'gg_submit',part_id:ev.rowId,state:JSON.stringify(ev.state),score:ev.res&&ev.res.score,correct:ev.res&&ev.res.correct,total:ev.res&&ev.res.total,miss_word_ids:(ev.res&&ev.res.miss_word_ids)||[],send_id:'gg'+Date.now().toString(36)+(n++)}
    :{action:'gg_state',part_id:ev.rowId,state:JSON.stringify(ev.state)};
   const go=()=>Promise.resolve(call(body)).then(d=>{B.last=d;if(d&&d.ok&&d.data&&d.data.state)R[ev.rowId].state=d.data.state;return d;});
   Q[ev.rowId]=(Q[ev.rowId]||Promise.resolve()).then(go,go);return Q[ev.rowId];},
  flush:()=>Promise.all(Object.values(Q))};
 return B;
};
})();
