/* ══════════════════════════════════════════════════════════════
   기계제도 기호 마스터 — 그림 모음 (그림05 · 2026-09-30)
   공용 그리기 도우미 links/fig.js 를 쓴다. index.html(배우기 카드)과 lesson.js(수업 슬라이드)가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', cards:['카드 제목'…], draw:function(){ … } }
       cards — index.html 의 LEARN[영역].cards[].h 와 **똑같이**. 그 카드 제목 바로 아래에 그림이 붙는다.
     순서 = 한 카드 안에서 그림이 나오는 순서.

   근거: 기계제도(서울교과서 2015개정) Ⅰ-6 표면 거칠기(77~83쪽) · Ⅰ-7 치수 공차와 끼워맞춤(90~99쪽) ·
         Ⅰ-8 기하 공차(108~123쪽). 교과서 그림은 모양 확인용으로만 보고 새로 그렸다.
   수치: IT 막대는 index.html 의 IT_TABLE(KS B 0401) 값 그대로. φ45 H7/g6 · k6 · p6 의 허용차는
         이 도구의 카드·문항에 있는 교과서 예제 값. 축 기준식의 G·K·P 는 위치만 보이는 개념도(수치 없음).
         거칠기 곡선의 모양 · 공차 기입 틀의 0.011/0.02 는 예시.
   정답 유출: 슬라이드의 빈칸·퀴즈 답이 되는 글자는 ans:true — 슬라이드는 labels:false 로 불러 ? 로 가린다.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout;

  /* ── 작은 도우미 ── */
  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + (c || C.ink) + '"/>'; }
  /* 함수 f(u) (u:0~1) 를 x0~x1 에 촘촘히 찍은 점들 */
  function sample(x0, x1, y0, f, step) {
    var p = [], s = step || 2;
    for (var x = x0; x <= x1 + 0.01; x += s) p.push([x, y0 - f((x - x0) / (x1 - x0))]);
    return p;
  }
  function wave(x0, x1, y0, f, o) { return F.poly(sample(x0, x1, y0, f, 1.5), o); }
  function S2(u, k, ph) { return Math.sin(2 * Math.PI * k * u + (ph || 0)); }

  /* 거칠기 곡선 하나를 세 그림(Ra·Ry·Rz)이 함께 쓴다 */
  var RX0 = 40, RX1 = 392;
  function rough(u) { return 22 * S2(u, 3.3, 0.3) + 13 * S2(u, 7.9, 1.1) + 6.5 * S2(u, 15.7, 2.3); }
  function roughPts(y0) { return sample(RX0, RX1, y0, rough, 1); }
  /* 극대·극소 찾기 (y 가 작을수록 높다) */
  function extrema(p) {
    var hi = [], lo = [];
    for (var i = 1; i < p.length - 1; i++) {
      if (p[i][1] < p[i - 1][1] && p[i][1] <= p[i + 1][1]) hi.push(p[i]);
      if (p[i][1] > p[i - 1][1] && p[i][1] >= p[i + 1][1]) lo.push(p[i]);
    }
    return { hi: hi, lo: lo };
  }
  function refLen(y) { return F.dim(RX0, y, RX1, y, '기준 길이', { c: C.sub }); }

  /* 공차역 막대: 기준선(zy) 기준 위 허용차 up · 아래 허용차 dn (px 단위, 위가 +) */
  function zone(x, w, zy, up, dn, fill, c, lab, o) {
    o = o || {};
    var y1 = zy - up, y2 = zy - dn;
    return box(x, y1, w, y2 - y1, { fill: fill, c: c, r: 2, w: 1.6 }) +
      (lab ? t(x + w / 2, o.below ? y2 + 14 : y1 - 13, lab, { a: 'm', b: 1, size: o.size || 15, c: c }) : '');
  }

  /* 기하 공차 기호 (가로세로 22 칸 안, 가운데 cx,cy) */
  function gsym(k, cx, cy, c) {
    var o = { c: c || C.ink, w: 2 };
    switch (k) {
      case 'flat': return F.poly([[cx - 10, cy + 6], [cx + 6, cy + 6], [cx + 10, cy - 6], [cx - 6, cy - 6]], { close: 1, c: o.c, w: 1.8 });
      case 'para': return line(cx - 8, cy + 8, cx - 1, cy - 8, o) + line(cx + 1, cy + 8, cx + 8, cy - 8, o);
      case 'perp': return line(cx, cy - 9, cx, cy + 8, o) + line(cx - 10, cy + 8, cx + 10, cy + 8, o);
    }
    return '';
  }
  /* 공차 기입 틀 — cells: [['sym','perp'],['txt','0.011'],['txt','A']] */
  function frame(x, y, cells, h) {
    h = h || 30;
    var s = '', cx = x;
    cells.forEach(function (c) {
      var w = c[2] || (c[0] === 'sym' ? 34 : 14 + String(c[1]).length * 10);
      s += box(cx, y, w, h, { fill: C.paper, r: 0, w: 1.6 });
      s += c[0] === 'sym' ? gsym(c[1], cx + w / 2, y + h / 2) : t(cx + w / 2, y + h / 2 + 1, c[1], { a: 'm', size: 16, halo: false, c: c[3] || C.ink, b: c[3] ? 1 : 0 });
      cx += w;
    });
    return { s: s, x2: cx };
  }
  /* 데이텀 삼각 기호: 면(y) 위의 점 x 에서 아래로 */
  function datum(x, y, letter, dir) {
    var k = dir === 'up' ? -1 : 1;
    return F.poly([[x - 8, y + k * 1], [x + 8, y + k * 1], [x, y + k * 12]], { close: 1, fill: C.ink, w: 1 }) +
      line(x, y + k * 12, x, y + k * 22, { w: 1.4 }) +
      box(x - 13, k > 0 ? y + 22 : y - 48, 26, 26, { fill: C.paper, r: 0, w: 1.6 }) +
      t(x, (k > 0 ? y + 35 : y - 35) + 1, letter, { a: 'm', b: 1, size: 16, halo: false });
  }

  return {

  /* ─────────── 표면 거칠기 ─────────── */
  'rough-kinds': { cards: ['표면 거칠기란?'],
    cap: '가공한 표면 = 큰 휨(표면 형상) + 기복(파상도) + 미세한 요철(표면 거칠기)',
    draw: function () {
      var X0 = 184, X1 = 462, s = '';
      var f1 = function (u) { return 10 * Math.sin(Math.PI * u) - 5; },
          f2 = function (u) { return 5 * S2(u, 4, 0.4); },
          f3 = function (u) { return 2.6 * S2(u, 27) + 1.3 * S2(u, 61, 1); };
      var rows = [
        ['실제 표면', '셋이 겹쳐 있다', function (u) { return f1(u) + f2(u) + f3(u); }, C.ink],
        ['표면 형상', '휨 · 안내면 변형', f1, C.blue],
        ['파상도', '진동 · 떨림', f2, C.green],
        ['표면 거칠기', '작은 간격의 요철', f3, C.orange]];
      rows.forEach(function (r, i) {
        var y = 46 + i * 58;
        if (i) s += line(14, y - 30, 466, y - 30, { c: C.edge, w: 1 });
        s += t(18, y - 9, r[0], { b: 1, c: i ? r[3] : C.ink }) + t(18, y + 13, r[1], { size: 13, c: C.sub, ans: i > 0 });
        s += line(X0, y, X1, y, { c: C.grayM, w: 1, dash: '4 4' });
        s += wave(X0, X1, y, r[2], { c: r[3], w: i ? 2 : 2.2 });
      });
      s += t(170, 104, '=', { a: 'm', b: 1, size: 20, c: C.sub }) +
        t(170, 162, '+', { a: 'm', b: 1, size: 20, c: C.sub }) + t(170, 220, '+', { a: 'm', b: 1, size: 20, c: C.sub });
      return F.svg(480, 250, s);
    } },

  ra: { cards: ['거칠기를 나타내는 3가지 값 (KS B ISO 4287)'],
    cap: 'Ra(산술 평균 거칠기) — 평균 선 윗부분의 넓이(색칠)를 기준 길이로 나눈 값. 도면의 기본값',
    draw: function () {
      var M = 124, p = roughPts(M), e = extrema(p);
      var pk = e.hi.slice().sort(function (a, b) { return a[1] - b[1]; })[0];
      var fill = p.map(function (q) { return [q[0], Math.min(q[1], M)]; });
      fill.push([RX1, M], [RX0, M]);
      var s = t(24, 30, 'Ra = 색칠한 넓이 ÷ 기준 길이', { b: 1, size: 17, c: C.blue });
      s += F.poly(fill, { close: 1, fill: C.blueL, c: 'none', w: 0 });
      s += line(RX0 - 6, M, RX1 + 6, M, { c: C.sub, w: 1.4 }) + t(RX1 + 12, M, '평균 선', { size: 14, c: C.sub });
      s += F.poly(p, { w: 2 });
      s += callout(pk[0], (pk[1] + M) / 2 + 4, pk[0] + 40, 58, '평균 선 윗부분', { c: C.blue, size: 14 });
      s += refLen(196);
      return F.svg(480, 214, s);
    } },

  ry: { cards: ['거칠기를 나타내는 3가지 값 (KS B ISO 4287)'],
    cap: 'Ry(최대 높이 거칠기) — 가장 높은 산봉우리와 가장 깊은 골바닥의 높이 차, Ry = Rp + Rv',
    draw: function () {
      var M = 128, p = roughPts(M), e = extrema(p);
      var top = Math.min.apply(null, e.hi.map(function (q) { return q[1]; })),
          bot = Math.max.apply(null, e.lo.map(function (q) { return q[1]; }));
      var s = t(24, 30, 'Ry = Rp + Rv', { b: 1, size: 17, c: C.orange });
      s += line(RX0, top, 468, top, { c: C.sub, w: 1.2 }) + line(RX0, bot, 468, bot, { c: C.sub, w: 1.2 });
      s += line(RX0 - 6, M, 430, M, { c: C.sub, w: 1.4, dash: '6 4' });
      s += F.poly(p, { w: 2 });
      s += t(RX0, top - 11, '산봉우리 선', { size: 13, c: C.sub }) + t(RX0, bot + 13, '골바닥 선', { size: 13, c: C.sub });
      s += arrow(412, M, 412, top, { w: 1.4, head: 9 }) + t(418, (M + top) / 2 + 2, 'Rp', { b: 1, size: 15 });
      s += arrow(412, M, 412, bot, { w: 1.4, head: 9 }) + t(418, (M + bot) / 2, 'Rv', { b: 1, size: 15 });
      s += arrow(456, top, 456, bot, { w: 1.8, head: 10, both: 1, c: C.orange });
      s += t(448, bot + 14, 'Ry', { b: 1, size: 16, c: C.orange, a: 'm' });
      s += refLen(bot + 34);
      return F.svg(480, bot + 52, s);
    } },

  rz: { cards: ['거칠기를 나타내는 3가지 값 (KS B ISO 4287)'],
    cap: 'Rz(10점 평균 거칠기) — 높은 봉우리 5개의 평균과 깊은 골 5개의 평균의 차',
    draw: function () {
      var M = 128, p = roughPts(M), e = extrema(p);
      var hi = e.hi.slice().sort(function (a, b) { return a[1] - b[1]; }).slice(0, 5),
          lo = e.lo.slice().sort(function (a, b) { return b[1] - a[1]; }).slice(0, 5);
      var ah = hi.reduce(function (a, q) { return a + q[1]; }, 0) / 5,
          al = lo.reduce(function (a, q) { return a + q[1]; }, 0) / 5;
      var s = t(24, 30, 'Rz = 봉우리 5개 평균 − 골 5개 평균', { b: 1, size: 17, c: C.purple });
      s += line(RX0 - 6, M, RX1 + 6, M, { c: C.grayM, w: 1.2, dash: '6 4' });
      s += F.poly(p, { w: 2 });
      s += line(RX0, ah, 440, ah, { c: C.orange, w: 1.4, dash: '6 4' }) + line(RX0, al, 440, al, { c: C.green, w: 1.4, dash: '6 4' });
      hi.forEach(function (q) { s += dot(q[0], q[1], 4.5, C.orange); });
      lo.forEach(function (q) { s += dot(q[0], q[1], 4.5, C.green); });
      s += arrow(432, ah, 432, al, { both: 1, w: 1.8, head: 10, c: C.purple }) + t(442, (ah + al) / 2, 'Rz', { b: 1, c: C.purple });
      var ly = Math.max.apply(null, p.map(function (q) { return q[1]; })) + 28;
      s += dot(40, ly, 5, C.orange) + t(52, ly, '높은 봉우리 5개', { size: 14 });
      s += dot(214, ly, 5, C.green) + t(226, ly, '깊은 골 5개', { size: 14 });
      return F.svg(480, ly + 20, s);
    } },

  cutoff: { cards: ['컷오프와 기준 길이'],
    cap: '컷오프 값(필터)으로 측정한 곡선을 긴 물결(파상도)과 짧은 요철(거칠기)로 가른다',
    draw: function () {
      var fw = function (u) { return 11 * S2(u, 2.2, 0.5); },
          fr = function (u) { return 3.4 * S2(u, 23) + 1.8 * S2(u, 53, 1.3); };
      var s = t(240, 24, '측정한 단면 곡선', { a: 'm', b: 1 });
      s += wave(40, 440, 62, function (u) { return fw(u) + fr(u); }, { w: 2 });
      s += arrow(240, 88, 240, 110, { w: 1.8 });
      s += box(160, 112, 160, 36, { fill: C.purpleL, c: C.purple, label: '컷오프 값 (필터)', lc: C.purple });
      s += F.route([[190, 148], [120, 148], [120, 172]], { w: 1.8 }) + F.route([[290, 148], [360, 148], [360, 172]], { w: 1.8 });
      s += t(120, 190, '파상도 — 긴 물결', { a: 'm', b: 1, size: 15, c: C.green });
      s += wave(28, 212, 226, fw, { c: C.green, w: 2 });
      s += t(360, 190, '거칠기 곡선 — 짧은 요철', { a: 'm', b: 1, size: 15, c: C.orange });
      s += wave(268, 452, 226, fr, { c: C.orange, w: 2 });
      return F.svg(480, 250, s);
    } },

  lengths: { cards: ['컷오프와 기준 길이'],
    cap: '기준 길이는 컷오프 값으로 잡는다 — 평가 길이는 기준 길이 여러 개, 측정(이송) 길이는 그보다 조금 길다',
    draw: function () {
      var X0 = 30, X1 = 450, a = 64, b = 416, n = 5, seg = (b - a) / n, s = '';
      for (var i = 0; i <= n; i++) s += line(a + i * seg, 28, a + i * seg, 104, { c: C.grayM, w: 1.2 });
      s += line(X0, 28, X0, 104, { c: C.grayM, w: 1.2 }) + line(X1, 28, X1, 104, { c: C.grayM, w: 1.2 });
      s += line(X0, 66, X1, 66, { c: C.grayM, w: 1, dash: '4 4' });
      s += wave(X0, X1, 66, function (u) { return 9 * S2(u, 5.6, 0.2) + 4 * S2(u, 29) + 2 * S2(u, 71, 1); }, { w: 1.8 });
      s += box(a, 28, seg, 76, { fill: 'none', c: C.blue, r: 0, w: 2.4 });
      s += F.dim(a, 128, a + seg, 128, '기준 길이', { c: C.blue, ans: 1 });
      s += F.dim(a, 160, b, 160, '평가 길이');
      s += F.dim(X0, 194, X1, 194, '측정 길이 (이송 길이)', { c: C.sub });
      return F.svg(480, 212, s);
    } },

  'surf-pos': { cards: ['표면의 결 지시 기호 읽는 법'],
    cap: '지시 기호 둘레의 자리마다 적는 것이 정해져 있다 — 자리를 알면 숫자만 보고도 읽힌다',
    draw: function () {
      var vx = 118, vy = 196, s = '';
      /* 대상면 */
      s += line(24, vy, 236, vy, { w: 2.2 });
      for (var x = 30; x < 236; x += 14) s += line(x, vy + 2, x - 10, vy + 14, { w: 1, c: C.sub });
      /* 기호 — 60° 로 열린 꺾인 선 */
      var sL = 34, lL = 120, c60 = 0.5, s60 = 0.866;
      s += F.poly([[vx - sL * c60, vy - sL * s60], [vx, vy], [vx + lL * c60, vy - lL * s60]], { w: 2.4 });
      var P = function (x, y, k, c) { return t(x, y, k, { a: 'm', b: 1, size: 19, c: c || C.ink }); };
      s += P(vx - 4, vy - 58, 'a', C.blue) + P(vx + lL * c60 + 2, vy - lL * s60 - 18, 'b', C.orange) +
        P(vx + 58, vy - 58, 'c') + P(vx + 24, vy - 14, 'd') + P(vx - 36, vy - 14, 'e') +
        P(vx + lL * c60 + 2, vy - lL * s60 + 6, 'f') + P(vx + 54, vy - 14, 'g');
      /* 뜻 */
      var key = [['a', '산술 평균 거칠기(Ra) 값', C.blue], ['b', '가공 방법', C.orange], ['c', '컷오프 값 · 평가 길이'],
        ['d', '줄무늬 방향의 기호'], ['e', '다듬질 여유'], ['f', 'Ra 이외의 거칠기 값'], ['g', '표면 파상도']];
      key.forEach(function (k, i) {
        var y = 40 + i * 28;
        s += t(262, y, k[0], { b: 1, size: 16, c: k[2] || C.ink }) + t(280, y, k[1], { size: 14, c: k[2] || C.ink, ans: 1 });
      });
      s += line(250, 22, 250, 226, { c: C.edge, w: 1.2 });
      return F.svg(480, 240, s);
    } },

  /* ─────────── 치수 공차 · 끼워맞춤 ─────────── */
  'tol-terms': { cards: ['치수 공차 용어'],
    cap: '허용 치수 두 개 사이가 치수 공차 — 기준 치수에서 잰 차이가 위·아래 치수 허용차 (공차역은 크게 그림)',
    draw: function () {
      var X0 = 30, mn = 200, bs = 280, mx = 380, Z1 = 96, Z2 = 162, s = '';
      s += line(X0, 60, X0, 262, { w: 2.6 });
      s += box(mn, Z1, mx - mn, Z2 - Z1, { fill: C.blueL, c: C.blue, r: 2 });
      s += line(bs, 40, bs, 262, { c: C.ink, w: 1.4, dash: 'center' });
      s += line(mn, 70, mn, Z2, { c: C.blue, w: 1.2 }) + line(mx, 70, mx, Z2, { c: C.blue, w: 1.2 });
      s += arrow(mn, 78, bs, 78, { both: 1, w: 1.2, head: 9, c: C.green }) + arrow(bs, 78, mx, 78, { both: 1, w: 1.2, head: 9, c: C.orange });
      s += t(240, 50, '아래 치수\n허용차', { a: 'm', size: 13, b: 1, c: C.green }) + t(330, 58, '위 치수 허용차', { a: 'm', size: 13, b: 1, c: C.orange });
      s += arrow(mn + 4, 142, mx - 4, 142, { both: 1, w: 1.4, head: 9, c: C.blue }) + t(290, 122, '치수 공차', { a: 'm', b: 1, c: C.blue });
      s += F.dim(X0, 190, mn, 190, '최소 허용 치수') + F.dim(X0, 222, bs, 222, '기준 치수') + F.dim(X0, 254, mx, 254, '최대 허용 치수');
      s += t(bs + 6, 32, '기준선', { size: 13, c: C.sub });
      return F.svg(480, 272, s);
    } },

  'it-grow': { cards: ['IT 기본 공차 (KS B 0401)'],
    cap: 'IT 기본 공차표를 막대로 — 등급이 높을수록, 기준 치수가 클수록 공차(허용 오차의 폭)가 커진다',
    draw: function () {
      var T = (typeof IT_TABLE !== 'undefined') ? IT_TABLE : null;
      if (!T) return F.svg(480, 80, t(240, 40, 'IT_TABLE 없음', { a: 'm' }));
      var B = 236, H = 150, s = '';
      /* 왼쪽 — 30~50 구간, 등급별 */
      var g = [5, 6, 7, 8, 9, 10, 11], row = T['30~50'], mxL = row[11];
      s += t(118, 24, '등급이 높을수록', { a: 'm', b: 1, c: C.blue }) + t(118, 46, '기준 치수 30~50mm', { a: 'm', size: 13, c: C.sub });
      g.forEach(function (k, i) {
        var x = 18 + i * 30, h = row[k] / mxL * H;
        s += box(x, B - h, 22, h, { fill: k === 7 ? C.blue : C.blueL, c: C.blue, r: 2, w: 1.2 });
        s += t(x + 11, B - h - 10, String(row[k]), { a: 'm', size: 13 }) + t(x + 11, B + 14, String(k), { a: 'm', size: 13 });
      });
      s += t(118, B + 34, 'IT 등급', { a: 'm', size: 13, c: C.sub });
      s += line(240, 20, 240, 276, { c: C.edge, w: 1.2 });
      /* 오른쪽 — IT7, 치수 구간별 */
      var ks = Object.keys(T), ends = ['3', '6', '10', '18', '30', '50', '80', '120'], mxR = T[ks[ks.length - 1]][7];
      s += t(360, 24, '치수가 클수록', { a: 'm', b: 1, c: C.orange }) + t(360, 46, 'IT7', { a: 'm', size: 13, c: C.sub });
      ks.forEach(function (k, i) {
        var x = 252 + i * 27, h = T[k][7] / mxR * H, on = k === '30~50';
        s += box(x, B - h, 20, h, { fill: on ? C.orange : C.orangeL, c: C.orange, r: 2, w: 1.2 });
        s += t(x + 10, B - h - 10, String(T[k][7]), { a: 'm', size: 13 }) + t(x + 10, B + 14, ends[i], { a: 'm', size: 13 });
      });
      s += t(360, B + 34, '기준 치수 구간의 끝(mm)', { a: 'm', size: 13, c: C.sub });
      s += line(14, B, 232, B, { w: 1.4 }) + line(248, B, 468, B, { w: 1.4 });
      s += t(466, 24, 'µm', { a: 'e', size: 13, c: C.sub });
      return F.svg(480, 286, s);
    } },

  basis: { cards: ['구멍 기준 / 축 기준 끼워맞춤'],
    cap: '구멍 기준식은 H 를, 축 기준식은 h 를 고정하고 상대 쪽 기호를 바꿔 헐거운·중간·억지를 만든다 (위치만 보인 개념도)',
    draw: function () {
      var Z = 146, k = 1.5, s = '';
      function panel(ox, title, fixLab, fixUp, fixDn, fixC, fixF, others, oc, of) {
        var p = t(ox + 110, 26, title, { a: 'm', b: 1, ans: 1 });
        p += line(ox + 6, Z, ox + 216, Z, { w: 1.6 }) + t(ox + 216, Z + 12, '기준선', { a: 'e', size: 13, c: C.sub });
        p += zone(ox + 16, 44, Z, fixUp * k, fixDn * k, fixF, fixC, fixLab, { below: fixUp <= 0 });
        others.forEach(function (o, i) {
          var x = ox + 80 + i * 46;
          p += zone(x, 32, Z, o[1] * k, o[2] * k, of, oc, o[0], { below: o[2] < 0 && o[1] <= 0 });
          p += t(x + 16, 250, o[3], { a: 'm', size: 13, b: 1, c: C.sub });
        });
        return p;
      }
      /* 구멍 기준 — 이 도구의 φ45 예제 값(µm): H7 0~+25, g6 −25~−9, k6 +2~+18, p6 +26~+42 */
      s += panel(4, '구멍 기준식 — H 고정', 'H7', 25, 0, C.blue, C.blueL,
        [['g6', -9, -25, '헐거운'], ['k6', 18, 2, '중간'], ['p6', 42, 26, '억지']], C.orange, C.orangeL);
      s += line(240, 14, 240, 262, { c: C.edge, w: 1.2 });
      /* 축 기준 — h 는 위 허용차 0. G·K·P 는 위치만 */
      s += panel(252, '축 기준식 — h 고정', 'h6', 0, -16, C.orange, C.orangeL,
        [['G7', 34, 9, '헐거운'], ['K7', 7, -18, '중간'], ['P7', -17, -42, '억지']], C.blue, C.blueL);
      return F.svg(480, 266, s);
    } },

  'fit-3': { cards: ['끼워맞춤 3가지 상태'],
    cap: '구멍(파랑)과 축(주황)의 크기 관계 하나로 갈린다 — 항상 틈새 · 틈새 또는 죔새 · 항상 죔새',
    draw: function () {
      var s = '', Z = 186;
      var cs = [['헐거운 끼워맞춤', 20, '항상 틈새', [30, 6], [-6, -26]],
                ['중간 끼워맞춤', 26, '틈새 또는 죔새', [30, 6], [22, -2]],
                ['억지 끼워맞춤', 32, '항상 죔새', [26, 4], [52, 32]]];
      cs.forEach(function (c, i) {
        var cx = 80 + i * 160;
        if (i) s += line(cx - 80, 14, cx - 80, 258, { c: C.edge, w: 1.2 });
        s += t(cx, 24, c[0], { a: 'm', b: 1, size: 15 });
        /* 단면 — 구멍(원 테두리)에 축(채운 원) */
        s += F.circle(cx, 78, c[1], { fill: C.orangeL, c: C.orange, w: 2 });
        s += F.circle(cx, 78, 26, { fill: 'none', c: C.blue, w: 2.4 });
        /* 공차역 */
        s += line(cx - 64, Z, cx + 64, Z, { w: 1.4 });
        s += zone(cx - 50, 40, Z, c[3][0], c[3][1], C.blueL, C.blue, '구멍', { size: 13 });
        s += zone(cx + 10, 40, Z, c[4][0], c[4][1], C.orangeL, C.orange, '축', { size: 13, below: c[4][0] < 30 && i === 0 });
        s += t(cx, 246, c[2], { a: 'm', b: 1, size: 15, ans: 1 });
      });
      return F.svg(480, 262, s);
    } },

  'fit-calc': { cards: ['계산 예제 — φ45 H7/g6'],
    cap: 'φ45 H7/g6 — 구멍 45.000~45.025, 축 44.975~44.991. 틈새만 생기므로 헐거운 끼워맞춤 (공차역은 크게 그림)',
    draw: function () {
      var Z = 132, k = 3.2, s = '';
      var hT = Z - 25 * k, sT = Z + 9 * k, sB = Z + 25 * k;
      s += line(20, Z, 300, Z, { w: 1.8 }) + t(300, Z - 12, '기준선 φ45', { a: 'e', size: 13, c: C.sub });
      s += box(70, hT, 80, Z - hT, { fill: C.blueL, c: C.blue, r: 2 }) + t(110, hT - 14, '구멍 H7', { a: 'm', b: 1, c: C.blue });
      s += box(190, sT, 80, sB - sT, { fill: C.orangeL, c: C.orange, r: 2 }) + t(230, sB + 16, '축 g6', { a: 'm', b: 1, c: C.orange });
      s += t(66, hT, '45.025', { a: 'e', size: 13 }) + t(66, Z + 12, '45.000', { a: 'e', size: 13, ans: 1 });
      s += t(276, sT, '44.991', { size: 13 }) + t(276, sB, '44.975', { size: 13 });
      /* 최소 틈새 — 구멍 최소(기준선) ~ 축 최대 */
      s += line(150, Z, 186, Z, { c: C.grayM, w: 1 }) + line(186, sT, 170, sT, { c: C.green, w: 1 });
      s += arrow(172, Z, 172, sT, { both: 1, w: 1.4, head: 8, c: C.green });
      /* 최대 틈새 — 구멍 최대 ~ 축 최소 */
      s += line(150, hT, 346, hT, { c: C.grayM, w: 1, dash: '4 3' }) + line(270, sB, 346, sB, { c: C.grayM, w: 1, dash: '4 3' });
      s += arrow(340, hT, 340, sB, { both: 1, w: 1.8, head: 10, c: C.green });
      s += callout(172, Z + 20, 138, 236, '최소 틈새 0.009', { c: C.green, tc: C.green, b: 1, size: 15, a: 'e' });
      s += t(352, Z - 16, '최대 틈새', { b: 1, c: C.green }) + t(352, Z + 6, '45.025 − 44.975', { size: 13 }) +
        t(352, Z + 26, '= 0.050', { b: 1, c: C.green, ans: 1 });
      return F.svg(480, 262, s);
    } },

  /* ─────────── 기하 공차 ─────────── */
  'geo-why': { cards: ['기하 공차란?'],
    cap: '두께(치수)는 어디서 재도 합격인데 판이 휘어 있다 — 이런 모양·자세의 어긋남을 잡는 것이 기하 공차',
    draw: function () {
      var X0 = 50, X1 = 430, TH = 30, BOW = 30, s = '';
      function yTop(x) { var u = (x - X0) / (X1 - X0); return 120 - BOW * Math.sin(Math.PI * u); }
      var top = [], bot = [];
      for (var x = X0; x <= X1; x += 5) { top.push([x, yTop(x)]); bot.push([x, yTop(x) + TH]); }
      s += F.poly(top.concat(bot.reverse()), { close: 1, fill: C.grayL, w: 2.2 });
      s += line(X0 - 10, 120, X1 + 10, 120, { c: C.red, w: 1.4, dash: '6 4' });
      s += arrow(240, 120, 240, 94, { w: 1.6, head: 9, c: C.red }) + t(250, 76, '휘었다', { b: 1, c: C.red });
      [110, 370].forEach(function (x) {
        var y = yTop(x);
        s += arrow(x, y + 2, x, y + TH - 2, { both: 1, w: 1.3, head: 8, c: C.green });
        s += t(x + 8, y + TH + 16, '두께 ✓', { size: 14, b: 1, c: C.green, a: 'm' });
      });
      s += t(240, 196, '치수 공차 — 합격', { a: 'm', size: 15, c: C.green, b: 1 });
      s += t(240, 220, '모양이 틀린 것은 기하 공차로 잡는다', { a: 'm', size: 15 });
      return F.svg(480, 238, s);
    } },

  'geo-datum': { cards: ['기하 공차란?'],
    cap: '평면도는 그 면 하나만 보면 된다(단독 형체) · 평행도는 기준면 A 가 있어야 뜻이 선다(관련 형체) (숫자는 예시)',
    draw: function () {
      var s = '';
      /* 왼쪽 — 단독 형체 */
      s += t(120, 24, '단독 형체', { a: 'm', b: 1 }) + t(120, 46, '데이텀이 필요 없다', { a: 'm', size: 13, c: C.sub, ans: 1 });
      s += box(40, 140, 160, 56, { fill: C.grayL, r: 0, w: 2.2 });
      var f1 = frame(62, 76, [['sym', 'flat'], ['txt', '0.02']]);
      s += f1.s + F.route([[92, 106], [92, 139]], { w: 1.2, head: 9 });
      s += t(120, 262, '평면도 — 평평한가', { a: 'm', size: 14, b: 1 });
      s += line(240, 14, 240, 276, { c: C.edge, w: 1.2 });
      /* 오른쪽 — 관련 형체 */
      s += t(360, 24, '관련 형체', { a: 'm', b: 1, c: C.blue }) + t(360, 46, '데이텀이 필요하다', { a: 'm', size: 13, c: C.sub, ans: 1 });
      s += box(280, 140, 160, 56, { fill: C.grayL, r: 0, w: 2.2 });
      var f2 = frame(290, 76, [['sym', 'para'], ['txt', '0.02'], ['txt', 'A', 30, C.blue]]);
      s += f2.s + F.route([[320, 106], [320, 139]], { w: 1.2, head: 9 });
      s += datum(320, 196, 'A');
      s += callout(328, 204, 368, 226, '아랫면 = 기준 A', { c: C.blue, tc: C.blue, size: 13, a: 's' });
      s += t(360, 262, '평행도 — A 와 나란한가', { a: 'm', size: 14, b: 1, c: C.blue });
      return F.svg(480, 282, s);
    } },

  'geo-frame': { cards: ['공차 기입 틀 읽는 법'],
    cap: '「A 면에 대해 직각이어야 하고, 허용 폭은 0.011」 — 틀은 기호 → 공차값 → 데이텀 순으로 읽는다 (숫자는 예시)',
    draw: function () {
      var s = '';
      var fr = frame(222, 70, [['sym', 'perp', 52], ['txt', '0.011', 90], ['txt', 'A', 56, C.blue]], 34);
      s += fr.s;
      s += F.num(248, 20, '1') + F.num(319, 20, '2') + F.num(392, 20, '3', { c: C.blue });
      s += t(248, 50, '기호', { a: 'm', size: 14, b: 1, ans: 1 }) + t(319, 50, '공차값', { a: 'm', size: 14, b: 1, ans: 1 }) + t(392, 50, '데이텀', { a: 'm', size: 14, b: 1, c: C.blue, ans: 1 });
      /* 부품 — 오른쪽 세로면을 A(바닥)에 대해 직각으로 */
      s += F.poly([[40, 212], [200, 212], [200, 118], [150, 118], [150, 160], [40, 160]], { close: 1, fill: C.grayL, w: 2.2 });
      s += F.route([[222, 87], [214, 87], [214, 140], [202, 140]], { w: 1.2, head: 9 });
      s += datum(110, 212, 'A');
      s += callout(200, 170, 262, 176, '이 면이 직각인지', { c: C.sub, size: 14 });
      s += callout(123, 247, 160, 252, '기준 — 바닥면 A', { c: C.blue, tc: C.blue, size: 14 });
      return F.svg(480, 270, s);
    } }
  };
})();
