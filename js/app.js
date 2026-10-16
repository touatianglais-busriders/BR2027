/* Busriders · maquette de réservation. Aucune donnée n'est envoyée nulle part : tout reste dans la page. */
(function () {
  'use strict';
  var THEMES = [['nuit', 'Bleu nuit'], ['quai', 'Quai 4H'], ['cadre', 'Plein cadre']];
  var SORTIES = [
    { id: 'a', badge: 'JOURNÉE', b2: false, d1: '28', d2: 'NOV.', place: 'Les 2 Alpes', sub: 'Bus + forfait', price: 'dès 73 €', open: true,
      line: { mpl: 'Départ 4h00', nim: 'Départ 4h30' } },
    { id: 'b', badge: 'WEEK-END', b2: true, d1: '15-17', d2: 'JANV.', place: 'Les Sybelles', sub: '2 nuits · forfait inclus', price: '265 €', open: false,
      line: { mpl: 'Départ ven. 18h30', nim: 'Départ ven. 19h00' } },
    { id: 'c', badge: 'WEEK-END', b2: true, d1: '12-14', d2: 'MARS', place: 'Les Sybelles', sub: '2 nuits · forfait inclus', price: '265 €', open: false,
      line: { mpl: 'Départ ven. 18h30', nim: 'Départ ven. 19h00' } }
  ];
  var FORMULAS = [
    { id: 'f', name: 'Avec forfait', sub: 'Bus + forfait de la journée', price: 73 },
    { id: 's', name: 'Sans forfait', sub: 'Bus seul', price: 45 }
  ];
  var RDV = {
    mpl: { city: 'Montpellier', txt: 'RDV 3h30 · av. du Pirée (Antigone) · départ 4h00', short: 'RDV 3h30 · bus 4h00', where: 'Avenue du Pirée (Antigone)' },
    nim: { city: 'Nîmes', txt: 'RDV 4h00 · parking sortie Nîmes Ouest · départ 4h30', short: 'RDV 4h00 · bus 4h30', where: 'Parking sortie Nîmes Ouest' }
  };
  var INSURANCE = 4;
  var S = { city: 'mpl', formula: 'f', ins: false, qty: 1, ticket: 0, cgv: false, err: '', form: {} };

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  var ICON = {
    pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>',
    shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    minus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
    plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/><path d="M12 6v12"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
    lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    n1: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16"/><path d="M8 7h8"/><circle cx="8" cy="20" r="1.5"/><circle cx="16" cy="20" r="1.5"/></svg>',
    n2: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M14 6v12"/></svg>',
    n3: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
    n4: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>'
  };
  var QR = '<svg viewBox="0 0 21 21" shape-rendering="crispEdges" role="img" aria-label="QR code du billet (exemple, non scannable)"><rect width="21" height="21" fill="#fff"/><g fill="#111"><rect width="7" height="7"/><rect x="14" width="7" height="7"/><rect y="14" width="7" height="7"/><path d="M8 0h2v1h-2zM11 0h1v1h-1zM9 1h3v1h-3zM8 2h1v1h-1zM10 2h2v1h-2zM9 3h1v1h-1zM11 3h2v1h-2zM8 4h2v1h-2zM12 4h1v1h-1zM10 5h2v1h-2zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM9 7h3v1h-3zM0 8h2v1h-2zM3 8h1v1h-1zM5 8h3v1h-3zM9 8h1v1h-1zM11 8h2v1h-2zM14 8h3v1h-3zM18 8h3v1h-3zM1 9h1v1h-1zM4 9h2v1h-2zM8 9h2v1h-2zM12 9h1v1h-1zM15 9h2v1h-2zM19 9h2v1h-2zM0 10h3v1h-3zM5 10h1v1h-1zM7 10h2v1h-2zM11 10h2v1h-2zM14 10h1v1h-1zM17 10h2v1h-2zM20 10h1v1h-1zM2 11h2v1h-2zM6 11h3v1h-3zM10 11h1v1h-1zM13 11h3v1h-3zM18 11h1v1h-1zM20 11h1v1h-1zM0 12h1v1h-1zM3 12h3v1h-3zM8 12h2v1h-2zM12 12h2v1h-2zM16 12h2v1h-2zM19 12h2v1h-2zM8 13h2v1h-2zM11 13h1v1h-1zM14 13h3v1h-3zM18 13h2v1h-2zM9 14h3v1h-3zM13 14h1v1h-1zM16 14h2v1h-2zM20 14h1v1h-1zM8 15h1v1h-1zM10 15h2v1h-2zM14 15h2v1h-2zM17 15h1v1h-1zM19 15h2v1h-2zM9 16h1v1h-1zM12 16h3v1h-3zM16 16h1v1h-1zM18 16h3v1h-3zM8 17h3v1h-3zM12 17h1v1h-1zM15 17h2v1h-2zM19 17h1v1h-1zM10 18h2v1h-2zM13 18h3v1h-3zM17 18h1v1h-1zM20 18h1v1h-1zM8 19h1v1h-1zM11 19h3v1h-3zM15 19h2v1h-2zM18 19h2v1h-2zM9 20h2v1h-2zM12 20h1v1h-1zM14 20h1v1h-1zM16 20h3v1h-3zM20 20h1v1h-1z"/></g><g fill="#fff"><rect x="1" y="1" width="5" height="5"/><rect x="15" y="1" width="5" height="5"/><rect x="1" y="15" width="5" height="5"/></g><g fill="#111"><rect x="2" y="2" width="3" height="3"/><rect x="16" y="2" width="3" height="3"/><rect x="2" y="16" width="3" height="3"/></g></svg>';

  var NAV = [['/', 'Sorties', 'n1'], ['/billet', 'Mon billet', 'n2'], ['/infos', 'Infos', 'n3'], ['/contact', 'Contact', 'n4']];
  function unit() { var f = FORMULAS.filter(function (x) { return x.id === S.formula; })[0]; return f.price + (S.ins ? INSURANCE : 0); }
  function total() { return unit() * S.qty; }
  function fname() { return FORMULAS.filter(function (x) { return x.id === S.formula; })[0].name; }
  function route() { var h = location.hash.replace(/^#/, '') || '/'; return h.split('?')[0]; }
  function seg() {
    return '<div class="seg" role="group" aria-label="Mon départ">' +
      ['mpl', 'nim'].map(function (c) { return '<button type="button" data-act="city" data-v="' + c + '" aria-pressed="' + (S.city === c) + '">' + RDV[c].city + '</button>'; }).join('') + '</div>';
  }
  function back(href, label, n) { return '<div class="back"><a href="' + href + '" aria-label="' + label + '">' + ICON.back + '</a><span class="h" style="font-size:18px;font-weight:800">' + (n ? label : '') + '</span><span class="step-n">' + (n || '') + '</span></div>'; }

  /* ---------- Écrans ---------- */
  function vSorties() {
    var cards = SORTIES.map(function (s) {
      var act = s.open ? '<a class="btn sm" href="#/choix">Réserver</a>' : '<button type="button" class="btn ghost sm" data-act="notify">M\'avertir</button>';
      var l3 = s.open ? s.line[S.city] : 'Ouvre 10 jours avant';
      return '<article class="card"><div class="date"><span class="d1">' + s.d1 + '</span><span class="d2">' + s.d2 + '</span></div>' +
        '<div class="info"><span class="badge' + (s.b2 ? ' b2' : '') + '">' + s.badge + '</span><div class="place">' + s.place + '</div><div class="sub">' + s.sub + '</div><div class="l3">' + (s.open ? s.line[S.city] : l3) + '</div></div>' +
        '<div class="buy"><div class="price">' + s.price + '</div>' + act + '</div></article>';
    }).join('');
    return '<div class="stack"><div class="head-row"><div><h1>Prochaines sorties</h1><p class="lead desk-only">Ski et snowboard depuis Montpellier et Nîmes.</p></div>' + seg() + '</div>' +
      '<div class="cards">' + cards + '</div>' +
      '<div class="trust">' + ICON.shield + '<span>Départ confirmé dès [X] inscrits. Sortie annulée = remboursé.</span></div>' +
      '<div class="chips"><a class="chip" href="#/infos">' + ICON.pin + 'Points de RDV</a><a class="chip" href="#/infos">' + ICON.clock + 'Déroulé</a></div>' +
      '<p class="note" id="notice" role="status"></p></div>';
  }
  function optBtns() {
    return FORMULAS.map(function (f) { return '<button type="button" class="opt" data-act="formula" data-v="' + f.id + '" aria-pressed="' + (S.formula === f.id) + '"><span><span class="t">' + f.name + '</span><span class="s">' + f.sub + '</span></span><span class="p">' + f.price + ' €</span></button>'; }).join('');
  }
  function asideHtml(cta, href) {
    return '<aside class="aside" aria-label="Récapitulatif"><h2 class="label">Mon récapitulatif</h2>' +
      '<div class="line"><span>Sortie</span><b>Les 2 Alpes · 28 nov.</b></div><div class="line"><span>Départ</span><b>' + RDV[S.city].city + '</b></div>' +
      '<div class="line"><span>Formule</span><b>' + fname() + '</b></div><div class="line"><span>Assurance</span><b>' + (S.ins ? 'Oui (+' + INSURANCE + ' €)' : 'Non') + '</b></div>' +
      '<div class="line"><span>Participants</span><b>' + S.qty + '</b></div>' +
      '<div class="tot"><span class="label">Total</span><b>' + total() + ' €</b></div>' + cta +
      '<p class="note">Paiement sécurisé par carte · billet envoyé par e-mail</p></aside>';
  }
  function vChoix() {
    return '<div class="stack">' + back('#/', 'Mes choix', '1 / 3') +
      '<div class="grid2"><div class="stack">' +
      '<div class="hero-d"><div class="date"><span class="d1">28</span><span class="d2">NOV.</span></div><div><div class="place" style="font-size:20px">Les 2 Alpes</div><div class="lead" style="margin:2px 0 0;font-size:13px">Samedi 28 novembre 2026 · journée</div></div></div>' +
      '<section class="stack" style="gap:8px"><h2 class="label">Départ</h2>' + seg() + '<div class="rdv">' + ICON.pin + '<span>' + RDV[S.city].txt + '</span></div></section>' +
      '<section class="stack" style="gap:8px"><h2 class="label">Formule</h2><div class="opts stack" style="gap:8px">' + optBtns() + '</div></section>' +
      '<section class="opts stack" style="gap:10px">' +
      '<div class="row"><div><span class="t">Assurance ski · +' + INSURANCE + ' €</span><span class="s">Possible jusqu\'au jeudi 22 h</span></div><button type="button" class="sw" role="switch" aria-checked="' + S.ins + '" aria-label="Assurance ski" data-act="ins"><i><b></b></i></button></div>' +
      '<div class="row" style="padding-right:12px"><div><span class="t">Participants</span><span class="s">Un billet nominatif par personne</span></div><div class="step"><button type="button" aria-label="Moins un participant" data-act="dec">' + ICON.minus + '</button><output>' + S.qty + '</output><button type="button" aria-label="Plus un participant" data-act="inc">' + ICON.plus + '</button></div></div>' +
      '</section></div>' + asideHtml('<a class="btn lg" href="#/paiement">Continuer vers le paiement</a>') + '</div></div>';
  }
  function partFields() {
    var out = '';
    for (var i = 0; i < S.qty; i++) {
      out += '<section class="stack" style="gap:10px"><h2 class="label">Participant ' + (i + 1) + '</h2><div class="two">' +
        '<div class="field"><label for="p' + i + 'f">Prénom</label><input id="p' + i + 'f" data-k="pf' + i + '" autocomplete="off" placeholder="Prénom" value="' + esc(S.form['pf' + i]) + '"></div>' +
        '<div class="field"><label for="p' + i + 'n">Nom</label><input id="p' + i + 'n" data-k="pn' + i + '" autocomplete="off" placeholder="Nom" value="' + esc(S.form['pn' + i]) + '"></div></div></section>';
    }
    return out;
  }
  function vPaiement() {
    return '<div class="stack form-wrap">' + back('#/choix', 'Paiement', '2 / 3') +
      '<div class="recap"><div><span class="t">Les 2 Alpes · sam. 28 nov.</span><span class="s">' + RDV[S.city].city + ' · ' + fname().toLowerCase() + (S.ins ? ' · assurance' : '') + ' · ' + S.qty + ' pers.</span></div><span class="p">' + total() + ' €</span></div>' +
      partFields() +
      '<div class="field"><label for="mail">E-mail (reçoit les billets)</label><input id="mail" type="email" inputmode="email" autocomplete="off" data-k="mail" placeholder="adresse e-mail" value="' + esc(S.form.mail) + '"></div>' +
      '<div class="field"><label for="tel">Mobile</label><input id="tel" type="tel" inputmode="tel" autocomplete="off" data-k="tel" placeholder="numéro de mobile" value="' + esc(S.form.tel) + '"></div>' +
      '<div class="cgv"><input id="cgv" type="checkbox" data-act="cgv"' + (S.cgv ? ' checked' : '') + '><label for="cgv">J\'accepte les <a href="#/infos">conditions de vente</a> : pas de remboursement si j\'annule.</label></div>' +
      '<div class="err" id="err" role="alert">' + esc(S.err) + '</div>' +
      '<div class="desk-only"><button type="button" class="btn lg" data-act="pay" style="width:100%">' + ICON.lock + 'Payer ' + total() + ' €</button></div>' +
      '<p class="note">Maquette : aucun paiement réel, rien n\'est envoyé ni enregistré.</p></div>';
  }
  function who(i) { var f = S.form['pf' + i], n = S.form['pn' + i]; return (f || n) ? ((f || '') + ' ' + (n || '')).trim() : (i === 0 ? 'Camille Martin' : 'Participant ' + (i + 1)); }
  function code(i) { return 'BR-2811-A7K' + (i + 2); }
  function vBillet() {
    if (S.ticket >= S.qty) S.ticket = 0;
    var i = S.ticket, r = RDV[S.city];
    var pager = S.qty > 1 ? '<div class="pager"><button type="button" aria-label="Billet précédent" data-act="tprev">' + ICON.back + '</button><span>Billet ' + (i + 1) + ' sur ' + S.qty + '</span><button type="button" aria-label="Billet suivant" data-act="tnext" style="transform:scaleX(-1)">' + ICON.back + '</button></div>' : '';
    return '<div class="stack form-wrap" style="max-width:none">' + back('#/', 'Mon billet', '3 / 3') +
      '<article class="ticket"><div class="t-qr desk-only"><div class="qr">' + QR + '</div></div><div class="t-main">' +
      '<div class="t-head"><div><div class="h">Les 2 Alpes</div><span class="d">Samedi 28 novembre 2026</span></div><span class="valid">' + ICON.check + 'VALIDE</span></div>' +
      '<div class="t-body mobile-only"><div class="qr">' + QR + '</div><div class="who"><b>' + esc(who(i)) + '</b><span>' + code(i) + '</span></div></div>' +
      '<div class="t-meta desk-only"><div><small>PASSAGER</small><b>' + esc(who(i)) + '</b></div><div><small>CODE</small><b>' + code(i) + '</b></div><div><small>FORMULE</small><b>' + fname() + '</b></div></div>' +
      '<div class="t-foot"><div><small>DÉPART ' + r.city.toUpperCase() + '</small><b>' + r.short + '</b><div class="desk-only" style="font-size:15px;color:var(--pmuted)">' + r.where + '</div></div><span class="tag mobile-only">' + fname() + '</span></div>' +
      '</div><span class="wm" aria-hidden="true"></span></article>' + pager +
      '<a class="btn ghost" href="#/infos" style="width:100%">' + ICON.pin + 'Voir le point de RDV</a>' +
      '<p class="note">Présentez ce code au chauffeur à la montée. Un scan = un billet utilisé. Billet et QR d\'exemple (non scannable).</p></div>';
  }
  function vInfos() {
    return '<div class="stack form-wrap"><h1>Infos pratiques</h1><div>' +
      '<details class="acc" open><summary>Points de RDV</summary><div><b>Montpellier</b> : RDV 3h30, avenue du Pirée (Antigone), départ 4h00.<br><b>Nîmes</b> : RDV 4h00, parking sortie Nîmes Ouest, départ 4h30.</div></details>' +
      '<details class="acc"><summary>Déroulé de la journée</summary><div>[À compléter : horaires aller, arrivée station, retour.]</div></details>' +
      '<details class="acc"><summary>Assurance ski</summary><div>Optionnelle, +' + INSURANCE + ' €, souscrite jusqu\'au jeudi 22 h précédant la sortie.</div></details>' +
      '<details class="acc"><summary>Annulation et remboursement</summary><div>Sortie annulée par l\'association = remboursée. Départ confirmé dès [X] inscrits. Résumé des conditions de vente à insérer ici.</div></details>' +
      '</div></div>';
  }
  function vContact() {
    return '<div class="stack form-wrap"><h1>Contact</h1><p class="lead">Une question avant de réserver ?</p>' +
      '<a class="btn" href="#/contact" aria-disabled="true">[Écrire à l\'association]</a><a class="btn ghost" href="#/contact" aria-disabled="true">[Réseau social]</a>' +
      '<p class="note">Liens à renseigner avant mise en ligne.</p></div>';
  }
  var VIEWS = { '/': vSorties, '/choix': vChoix, '/paiement': vPaiement, '/billet': vBillet, '/infos': vInfos, '/contact': vContact };

  /* ---------- Rendu ---------- */
  function render() {
    var r = route(); if (!VIEWS[r]) r = '/';
    $('#view').innerHTML = VIEWS[r]();
    var step = (r === '/choix' || r === '/paiement');
    document.body.classList.toggle('hide-nav', step);
    var cur = r === '/choix' || r === '/paiement' ? '/' : r;
    var nav = NAV.map(function (n) { return '<a href="#' + n[0] + '"' + (cur === n[0] ? ' aria-current="page"' : '') + '>' + ICON[n[2]] + '<span>' + n[1] + '</span></a>'; }).join('');
    $('#bottomnav').innerHTML = nav;
    $('#topnav').innerHTML = NAV.map(function (n) { return '<a href="#' + n[0] + '"' + (cur === n[0] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('');
    var st = $('#sticky');
    if (r === '/choix') { st.hidden = false; st.innerHTML = '<div class="in"><div class="tot"><small>TOTAL</small><b>' + total() + ' €</b></div><a class="btn" href="#/paiement">Continuer</a></div>'; }
    else if (r === '/paiement') { st.hidden = false; st.innerHTML = '<div class="in"><button type="button" class="btn full" data-act="pay" style="max-width:none">' + ICON.lock + 'Payer ' + total() + ' €</button></div>'; }
    else { st.hidden = true; st.innerHTML = ''; }
    document.title = 'Busriders · maquette de réservation';
  }
  function renderThemes() {
    var t = document.documentElement.dataset.theme;
    $('#themes').innerHTML = THEMES.map(function (x) { return '<button type="button" data-theme-btn="' + x[0] + '" aria-pressed="' + (t === x[0]) + '">' + x[1] + '</button>'; }).join('');
  }
  function setTheme(t) { document.documentElement.dataset.theme = t; store('br-theme', t); renderThemes(); }

  document.addEventListener('click', function (e) {
    var tb = e.target.closest('[data-theme-btn]'); if (tb) { setTheme(tb.dataset.themeBtn); return; }
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = b.dataset.act, v = b.dataset.v, keep = true;
    if (a === 'city') S.city = v;
    else if (a === 'formula') S.formula = v;
    else if (a === 'ins') S.ins = !S.ins;
    else if (a === 'inc') S.qty = Math.min(6, S.qty + 1);
    else if (a === 'dec') S.qty = Math.max(1, S.qty - 1);
    else if (a === 'tprev') S.ticket = (S.ticket + S.qty - 1) % S.qty;
    else if (a === 'tnext') S.ticket = (S.ticket + 1) % S.qty;
    else if (a === 'notify') { var n = $('#notice'); if (n) n.textContent = 'Démo : vous seriez averti(e) par e-mail à l\'ouverture des ventes.'; return; }
    else if (a === 'pay') { if (!S.cgv) { S.err = 'Cochez l\'acceptation des conditions de vente pour continuer.'; var er = $('#err'); if (er) er.textContent = S.err; return; } S.err = ''; location.hash = '#/billet'; return; }
    else if (a === 'cgv') { S.cgv = b.checked; if (S.cgv) { S.err = ''; var er2 = $('#err'); if (er2) er2.textContent = ''; } return; }
    render();
  });
  document.addEventListener('input', function (e) { var k = e.target.dataset && e.target.dataset.k; if (k) S.form[k] = e.target.value; });
  window.addEventListener('hashchange', function () { render(); window.scrollTo(0, 0); });

  var q = /[?&]charte=(nuit|quai|cadre)/.exec(location.search + location.hash);
  var saved = store('br-theme');
  setTheme(q ? q[1] : (/^(nuit|quai|cadre)$/.test(saved) ? saved : 'nuit'));
  render();
})();
