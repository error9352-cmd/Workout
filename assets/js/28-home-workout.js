/* Home Workout integration — additive patch; preserves existing Gym catalogue and records. */
(function(){
  'use strict';
  if (!window.apLIB || !window.apExerciseCatalog || !window.AP_EXERCISE_DEFAULTS) return;

  const groups = {
    Dada: [
      ['Wide Push Up','chest','triceps','Tanpa alat','wide-push-up-home.webp','Mulai dari posisi plank dengan tangan lebih lebar dari bahu.','Turunkan dada dengan siku membentuk sudut nyaman, lalu dorong kembali.'],
      ['Diamond Push Up','triceps','chest','Tanpa alat','diamond-push-up-home.webp','Tempatkan kedua tangan berdekatan di bawah dada hingga membentuk segitiga.','Turunkan tubuh dengan siku dekat badan, lalu dorong kembali tanpa mengunci siku berlebihan.'],
      ['Incline Push Up','chest','triceps','Tanpa alat','incline-push-up-home.webp','Letakkan tangan pada permukaan kokoh yang tidak mudah bergeser.','Jaga tubuh lurus, turunkan dada ke arah permukaan, lalu dorong kembali.'],
      ['Decline Push Up','chest','triceps','Tanpa alat','push-up.webp','Letakkan kaki pada permukaan rendah yang stabil dan tangan di lantai.','Jaga pinggul tidak turun, turunkan dada secara terkendali, lalu dorong kembali.']
    ],
    Punggung: [
      ['Resistance Band Row','back','biceps','Resistance Band','resistance-band-row-home.webp','Pasang band pada titik jangkar yang kokoh setinggi sekitar dada.','Tarik siku ke belakang sambil merapatkan tulang belikat, lalu kembali perlahan.'],
      ['Dumbbell Bent Over Row','back','biceps','Dumbbell','barbell-row.webp','Pegang dumbbell, tekuk pinggul dengan punggung netral dan lutut sedikit menekuk.','Tarik siku ke belakang menuju pinggang, lalu turunkan dumbbell dengan terkendali.'],
      ['Superman','back','glutes','Tanpa alat','back-extension.webp','Berbaring tengkurap dengan lengan memanjang ke depan.','Angkat lengan dan kaki sedikit dari lantai tanpa memaksakan lengkung pinggang, lalu turunkan.'],
      ['Reverse Snow Angel','back','shoulders','Tanpa alat','reverse-snow-angel-home.webp','Berbaring tengkurap dengan lengan di samping tubuh dan telapak menghadap lantai.','Angkat tangan sedikit, sapukan lengan membentuk busur menuju atas kepala, lalu kembali.']
    ],
    Bahu: [
      ['Pike Push Up','shoulders','triceps','Tanpa alat','overhead-press.webp','Mulai dari posisi V terbalik dengan pinggul terangkat dan tangan selebar bahu.','Tekuk siku untuk membawa kepala ke arah lantai di antara tangan, lalu dorong kembali.'],
      ['Shoulder Tap','shoulders','core','Tanpa alat','plank.webp','Mulai dari posisi high plank dengan kaki sedikit terbuka.','Sentuh bahu berlawanan secara bergantian sambil menjaga pinggul tetap stabil.'],
      ['Band Lateral Raise','shoulders','traps','Resistance Band','band-lateral-raise-home.webp','Injak bagian tengah resistance band dan pegang ujungnya di sisi tubuh.','Angkat lengan ke samping sampai sekitar setinggi bahu, lalu turunkan perlahan.'],
      ['Single-Arm Cable Lateral Raise','shoulders','traps','Kabel / cable machine','single-arm-cable-lateral-raise-home.webp','Berdiri menyamping di samping pulley rendah dan pegang handle dengan tangan terluar.','Angkat lengan ke samping hingga setinggi bahu dengan siku sedikit menekuk, lalu turunkan perlahan.']
    ],
    Lengan: [
      ['Close Grip Push Up','triceps','chest','Tanpa alat','close-grip-push-up-home.webp','Tempatkan tangan sedikit lebih sempit dari lebar bahu.','Turunkan tubuh dengan siku dekat badan, lalu dorong kembali.'],
      ['Resistance Band Biceps Curl','biceps','forearms','Resistance Band','resistance-band-biceps-curl-home.webp','Injak bagian tengah band dan pegang kedua ujung dengan telapak menghadap depan.','Tekuk siku untuk mengangkat tangan, jaga siku dekat badan, lalu turunkan perlahan.'],
      ['Band Overhead Triceps Extension','triceps','shoulders','Resistance Band','band-overhead-triceps-extension-home.webp','Pegang band di belakang kepala dengan siku mengarah ke depan.','Luruskan siku ke atas tanpa menggerakkan lengan atas berlebihan, lalu kembali perlahan.'],
      ['Cable Hammer Curl','biceps','forearms','Kabel / cable machine','cable-hammer-curl-home.webp','Berdiri menghadap pulley rendah dan pegang rope attachment dengan posisi telapak saling berhadapan.','Tekuk siku sambil menjaga posisi netral pergelangan tangan, lalu turunkan rope secara perlahan.'],
      ['Cross-Body Hammer Curl','biceps','forearms','Dumbbell','cross-body-hammer-curl-home.webp','Berdiri tegak sambil memegang dumbbell di sisi tubuh dengan ibu jari menghadap ke depan.','Angkat dumbbell menyilang ke arah bahu berlawanan tanpa memutar badan, lalu turunkan perlahan.']
    ],
    Kaki: [
      ['Bodyweight Squat','quads','glutes','Tanpa alat','goblet-squat.webp','Berdiri dengan kaki sekitar selebar bahu dan dada terbuka.','Dorong pinggul ke belakang, tekuk lutut sesuai kenyamanan, lalu berdiri kembali.'],
      ['Jump Squat','quads','glutes','Tanpa alat','barbell-squat.webp','Mulai dari posisi squat dengan kaki selebar bahu.','Dorong lantai untuk melompat, mendarat lembut dengan lutut sedikit menekuk, lalu ulangi.'],
      ['Glute Bridge','glutes','hamstrings','Tanpa alat','hip-thrust.webp','Berbaring telentang dengan lutut ditekuk dan telapak kaki menapak.','Kencangkan glutes dan angkat pinggul hingga badan membentuk garis dari bahu ke lutut, lalu turunkan.'],
      ['Single Leg Glute Bridge','glutes','hamstrings','Tanpa alat','hip-thrust.webp','Berbaring telentang, satu kaki menapak dan kaki lain terangkat.','Angkat pinggul dengan bertumpu pada satu kaki tanpa memutar panggul, lalu turunkan.'],
      ['Wall Sit','quads','glutes','Tanpa alat','barbell-squat.webp','Sandarkan punggung pada dinding dan posisikan kaki sedikit di depan lutut.','Turunkan badan hingga lutut menekuk sesuai kemampuan, tahan posisi, lalu berdiri perlahan.'],
      ['Standing Calf Raise','calves','soleus','Tanpa alat','standing-calf-raise-home.webp','Berdiri tegak dengan kaki selebar pinggul dan bertumpu merata pada telapak kaki.','Angkat tumit setinggi mungkin, tahan singkat, lalu turunkan perlahan hingga tumit mendekati lantai.']
    ],
    Kardio: [
      ['Jumping Jack','quads','calves','Tanpa alat','jump-rope.webp','Berdiri tegak dengan kaki rapat dan tangan di sisi tubuh.','Lompat dengan membuka kaki dan mengangkat tangan, lalu kembali ke posisi awal secara ritmis.'],
      ['High Knees','quads','core','Tanpa alat','brisk-walking.webp','Berdiri tegak dengan badan rileks dan pandangan ke depan.','Lari di tempat sambil mengangkat lutut bergantian sesuai kemampuan dan menjaga pendaratan ringan.'],
      ['Burpee','core','quads','Tanpa alat','mountain-climber.webp','Mulai berdiri, turunkan tangan ke lantai dan langkahkan atau lompatkan kaki ke posisi plank.','Kembalikan kaki ke depan lalu berdiri; tambahkan lompatan hanya jika nyaman.'],
      ['Skater Hop','quads','glutes','Tanpa alat','skater-hop-home.webp','Berdiri dengan lutut sedikit menekuk dan berat badan seimbang.','Melompat menyamping dari satu kaki ke kaki lain dengan pendaratan lembut dan terkontrol.'],
      ['March in Place','quads','calves','Tanpa alat','march-in-place-home.webp','Berdiri tegak dengan lengan rileks di samping tubuh.','Langkahkan kaki bergantian di tempat sambil mengayunkan lengan secara alami.']
    ],
    Core: [
      ['Reverse Crunch','core','abs','Tanpa alat','reverse-crunch-home.webp','Berbaring telentang dengan lutut ditekuk dan pinggul sekitar 90 derajat.','Gulung panggul perlahan untuk membawa lutut ke arah dada, lalu turunkan tanpa mengayun.'],
      ['Hollow Body Hold','core','abs','Tanpa alat','hollow-body-hold-home.webp','Berbaring telentang, rapatkan punggung bawah ke lantai.','Angkat bahu dan kaki sedikit, tahan posisi tanpa membiarkan punggung bawah terangkat.'],
      ['Bird Dog','core','back','Tanpa alat','bird-dog-home.webp','Mulai dengan posisi merangkak, tangan di bawah bahu dan lutut di bawah pinggul.','Rentangkan lengan dan kaki berlawanan, jaga badan stabil, lalu ganti sisi.'],
      ['Flutter Kicks','core','hip flexors','Tanpa alat','hanging-leg-raise.webp','Berbaring telentang dengan tangan di samping atau di bawah pinggul.','Angkat kedua kaki sedikit dari lantai dan gerakkan naik-turun bergantian dengan punggung bawah tetap stabil.']
    ]
  };

  // Extra home cardio movement shown in panel 14 of the approved atlas.
  groups.Kardio.push(['Lunge Jump','quads','glutes','Tanpa alat','lunge-jump.webp','Berdiri tegak dengan kaki selebar pinggul dan aktifkan otot inti.','Lakukan lunge lalu dorong lantai untuk berganti posisi kaki di udara; mendarat lembut dan stabil.']);

  const defaults = window.AP_EXERCISE_DEFAULTS;
  const imageRoot = 'assets/images/exercises/';
  Object.entries(groups).forEach(([category, items]) => {
    const target = window.apLIB[category] || (window.apLIB[category] = []);
    items.forEach(([name, primary, secondary, equipment, image, step1, step2]) => {
      if (!target.includes(name)) target.push(name);
      defaults[name.toLowerCase()] = {
        name, category: category === 'Dada' ? 'Dada' : category,
        primary, secondary, equipment, mode: equipment === 'Tanpa alat' ? (category === 'Kardio' ? 'time' : 'bodyweight') : 'weight',
        location: 'home', image: imageRoot + image, imageStatus: 'representative',
        instructions: [step1, step2, 'Lakukan repetisi dengan tempo terkendali dan hentikan bila muncul nyeri.']
      };
    });
  });

  // Keep the workout picker in sync with the expanded library.
  const allRef = window.apALL || [];
  Object.values(window.apLIB).flat().forEach(name => { if (!allRef.includes(name)) allRef.push(name); });
  window.apALL = allRef;

  // Shared movements/equipment that are practical in both environments.
  const both = {
    'push up': ['Tanpa alat','chest','triceps','push-up.webp'],
    'plank': ['Tanpa alat','core','abs','plank.webp'],
    'side plank': ['Tanpa alat','core','obliques','side-plank.webp'],
    'bicycle crunch': ['Tanpa alat','core','obliques','bicycle-crunch.webp'],
    'mountain climber': ['Tanpa alat','core','quads','mountain-climber.webp'],
    'dead bug': ['Tanpa alat','core','abs','dead-bug.webp'],
    'bulgarian split squat': ['Dumbbell opsional','quads','glutes','bulgarian-split-squat.webp'],
    'hammer curl': ['Dumbbell','biceps','forearms','hammer-curl-home.webp'],
    'dumbbell lateral raise': ['Dumbbell','shoulders','traps','dumbbell-lateral-raise.webp'],
    'goblet squat': ['Dumbbell','quads','glutes','goblet-squat.webp'],
    'dumbbell romanian deadlift': ['Dumbbell','hamstrings','glutes','dumbbell-romanian-deadlift.webp'],
    'dumbbell biceps curl': ['Dumbbell','biceps','forearms','dumbbell-biceps-curl.webp'],
    'dumbbell shoulder press': ['Dumbbell','shoulders','triceps','dumbbell-shoulder-press.webp'],
    'dumbbell front raise': ['Dumbbell','shoulders','traps','dumbbell-front-raise.webp'],
    'dumbbell shrug': ['Dumbbell','traps','forearms','dumbbell-shrug.webp'],
    'crunch': ['Tanpa alat','core','abs','crunch.webp'],
    'reverse lunge': ['Tanpa alat','quads','glutes','reverse-lunge.webp'],
    'forward lunge': ['Tanpa alat','quads','glutes','forward-lunge.webp'],
    'lateral lunge': ['Tanpa alat','quads','glutes','lateral-lunge.webp'],
    'walking lunge': ['Tanpa alat','quads','glutes','walking-lunge.webp'],
    'step up': ['Tanpa alat','quads','glutes','step-up.webp'],
    'standing calf raise': ['Tanpa alat','calves','soleus','standing-calf-raise-home.webp']
  };
  Object.entries(both).forEach(([key, data]) => {
    const m = defaults[key];
    if (m) Object.assign(m, {location:'both', equipment:data[0], mode:data[0]==='Tanpa alat' ? (/plank/.test(key) ? 'time' : 'bodyweight') : 'weight', primary:m.primary||data[1], secondary:m.secondary||data[2], image:imageRoot+data[3]});
  });

  // Corrected exercise-specific illustrations: each asset depicts the named movement and matching equipment.
  const correctedIllustrations = {
    'wide push up':['wide-push-up-home.webp','home','Tanpa alat'],
    'diamond push up':['diamond-push-up-home.webp','home','Tanpa alat'],
    'incline push up':['incline-push-up-home.webp','home','Tanpa alat'],
    'resistance band row':['resistance-band-row-home.webp','home','Resistance Band'],
    'reverse snow angel':['reverse-snow-angel-home.webp','home','Tanpa alat'],
    'single-arm cable lateral raise':['single-arm-cable-lateral-raise-home.webp','gym','Kabel / cable machine'],
    'band lateral raise':['band-lateral-raise-home.webp','home','Resistance Band'],
    'hammer curl':['hammer-curl-home.webp','both','Dumbbell'],
    'cable hammer curl':['cable-hammer-curl-home.webp','gym','Kabel / cable machine'],
    'cross-body hammer curl':['cross-body-hammer-curl-home.webp','both','Dumbbell'],
    'close grip push up':['close-grip-push-up-home.webp','home','Tanpa alat'],
    'resistance band biceps curl':['resistance-band-biceps-curl-home.webp','home','Resistance Band'],
    'band overhead triceps extension':['band-overhead-triceps-extension-home.webp','home','Resistance Band'],
    'standing calf raise':['standing-calf-raise-home.webp','both','Tanpa alat'],
    'reverse crunch':['reverse-crunch-home.webp','home','Tanpa alat'],
    'hollow body hold':['hollow-body-hold-home.webp','home','Tanpa alat'],
    'bird dog':['bird-dog-home.webp','home','Tanpa alat'],
    'skater hop':['skater-hop-home.webp','home','Tanpa alat'],
    'march in place':['march-in-place-home.webp','home','Tanpa alat']
  };
  Object.entries(correctedIllustrations).forEach(([key, data]) => {
    const meta = defaults[key];
    if (!meta) return;
    const patch = { image:imageRoot + data[0], imageStatus:'ready', location:data[1], equipment:data[2] };
    Object.assign(meta, patch);
    // Update any previously saved local metadata so an older representative image cannot override this verified asset.
    if (window.apExerciseCatalog && typeof window.apExerciseCatalog.save === 'function') {
      const title = meta.name || key.replace(/\b\w/g, c => c.toUpperCase());
      window.apExerciseCatalog.save(title, patch);
    }
  });

  // Dedicated local illustrations cropped from the approved 15-panel atlas.
  const atlas = {
    'push up':['push-up-home.webp','both'],
    'pike push up':['pike-push-up.webp','home'],
    'bodyweight squat':['bodyweight-squat.webp','home'],
    'bulgarian split squat':['bulgarian-split-squat-home.webp','both'],
    'reverse lunge':['reverse-lunge-home.webp','both'],
    'glute bridge':['glute-bridge-home.webp','home'],
    'single leg glute bridge':['single-leg-glute-bridge.webp','home'],
    'plank':['plank-home.webp','both'],
    'mountain climber':['mountain-climber-home.webp','both'],
    'dumbbell bent over row':['dumbbell-bent-over-row-home.webp','home'],
    'high knees':['high-knees.webp','home'],
    'jumping jack':['jumping-jack.webp','home'],
    'jump squat':['jump-squat.webp','home'],
    'lunge jump':['lunge-jump.webp','home'],
    'burpee':['burpee.webp','home']
  };
  Object.entries(atlas).forEach(([key, entry]) => {
    const m = defaults[key];
    if (m) Object.assign(m, {image:imageRoot+entry[0], imageStatus:'ready', location:entry[1]});
  });

  // Preserve the existing embedded illustrations; prefer bundled local files when metadata provides one.
  const previousExImg = window.exImg || (typeof exImg === 'function' ? exImg : null);
  if (previousExImg) {
    window.exImg = function(name){
      const meta = window.apExerciseCatalog.get(name);
      if (meta && meta.image) return [null, meta.image, [], 300, 521];
      return previousExImg(name);
    };
    try { exImg = window.exImg; } catch (_) {}
  }

  let libraryPlace = 'Semua';
  let libraryEquipment = 'Semua';
  window.apHomeWorkout = { groups, get place(){return libraryPlace;} };

  // Integrated location filter inside the existing Exercise Library.
  libraryView = function(){
    const source = window.apLIB || {};
    const q = (libraryQuery || '').trim().toLowerCase();
    const catalog = window.apExerciseCatalog;
    const inPlace = name => {
      const meta = catalog.get(name);
      const loc = meta.location || 'gym';
      const placeOK = libraryPlace === 'Semua' || (libraryPlace === 'Home' ? (loc === 'home' || loc === 'both') : (loc === 'gym' || loc === 'both'));
      const equipment = String(meta.equipment || '').toLowerCase();
      const equipmentOK = libraryEquipment === 'Semua' || (libraryEquipment === 'Tanpa alat' ? equipment === 'tanpa alat' : libraryEquipment === 'Resistance Band' ? equipment.includes('resistance band') : libraryEquipment === 'Kabel' ? (equipment.includes('kabel') || equipment.includes('cable')) : equipment.includes('dumbbell'));
      return placeOK && equipmentOK;
    };
    const lib = Object.fromEntries(Object.entries(source).map(([k,v]) => [k,(v||[]).filter(n => inPlace(n) && typeof exImg === 'function' && !!exImg(n))]));
    const cats = ['Semua', ...Object.keys(lib)];
    const all = [...new Set(Object.values(lib).flat())];
    const names = (libraryCat === 'Semua' ? all : (lib[libraryCat] || [])).filter(n => !q || n.toLowerCase().includes(q));
    const unique = [...new Set(names)];
    const placeButton = (value,label) => `<button class="chip" data-libplace="${value}" aria-pressed="${libraryPlace===value?'true':'false'}">${label}</button>`;
    return `<div class="library-view">
      <div class="library-heading"><div><p class="library-kicker">EXERCISE DATABASE</p><h1>Exercise Library</h1><p class="sub">Temukan gerakan, pelajari detailnya, dan gunakan di program latihan.</p></div><div class="library-count"><b>${all.length}</b><span>gerakan tersedia</span></div></div>
      <section class="card library-tools"><div class="library-place-filter" aria-label="Lokasi latihan">${placeButton('Semua','Semua lokasi')}${placeButton('Gym','Gym')}${placeButton('Home','Home Workout')}</div>
      <div class="library-place-filter library-equipment-filter" aria-label="Peralatan latihan">${['Semua','Tanpa alat','Resistance Band','Dumbbell','Kabel'].map(v=>`<button class="chip" data-libequipment="${v}" aria-pressed="${libraryEquipment===v?'true':'false'}">${v==='Semua'?'Semua alat':v}</button>`).join('')}</div>
      <label class="library-search"><span aria-hidden="true">⌕</span><input id="librarySearch" type="search" placeholder="Cari nama gerakan…" value="${esc(libraryQuery)}" aria-label="Cari gerakan"></label>
      <div class="library-cats" aria-label="Filter kelompok otot">${cats.map(c=>`<button class="chip" data-libcat="${esc(c)}" ${c===libraryCat?'aria-pressed="true"':''}>${esc(c)}</button>`).join('')}</div></section>
      <div class="library-results-head"><div><h2>${libraryCat==='Semua'?'Semua gerakan':esc(libraryCat)}</h2><p class="sub">${unique.length} gerakan${q?' ditemukan':''} · ${libraryPlace==='Home'?'Home Workout':libraryPlace==='Gym'?'Gym':'Semua lokasi'}</p></div></div>
      <div class="library-grid">${unique.map(n=>{const meta=catalog.get(n)||{},info=exInfo(n),mus=info&&info.p&&info.p.length?info.p.map(g=>MG[g]||g).join(' · '):(meta.primary||'Detail otot belum diatur'),eq=meta.equipment||'Peralatan belum diatur',im=exImg(n);return `<article class="library-item"><div class="library-item-image">${im?`<img loading="lazy" decoding="async" src="${esc(im[1])}" alt="Ilustrasi ${esc(n)}">`:''}</div>${meta.imageStatus==='representative'?'<p class="library-image-note">Ilustrasi referensi</p>':''}<div class="library-item-top"><span class="library-item-mark" aria-hidden="true">${(n.match(/[A-Z]/g)||['E']).slice(0,2).join('')}</span><span class="library-category">${esc(Object.keys(lib).find(k=>(lib[k]||[]).includes(n))||'Lainnya')}</span></div><h3>${esc(n)}</h3><p>${esc(mus)}</p><div class="library-item-meta"><span>${esc(eq)}</span><span>${meta.mode==='time'?'Waktu':meta.mode==='bodyweight'?'Berat badan':'Beban + rep'}</span><span>${meta.location==='home'?'Home':meta.location==='both'?'Gym + Home':'Gym'}</span></div><button class="btn ghost sm" data-pvx="${esc(n)}">Lihat detail <span aria-hidden="true">↗</span></button></article>`}).join('')||'<section class="card library-empty"><h3>Gerakan tidak ditemukan</h3><p class="sub">Coba kata kunci lain atau pilih kelompok otot berbeda.</p></section>'}</div></div>`;
  };

  document.addEventListener('click', function(event){
    const placeButton = event.target.closest && event.target.closest('[data-libplace]');
    if (placeButton) { libraryPlace = placeButton.dataset.libplace || 'Semua'; render(); return; }
    const equipmentButton = event.target.closest && event.target.closest('[data-libequipment]');
    if (equipmentButton) { libraryEquipment = equipmentButton.dataset.libequipment || 'Semua'; render(); }
  });
})();
