/* Static application data extracted from the original app. */

const HARI=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

const BLN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const TIPS=[
[/Upright Row/,['Tarik bar dekat badan sampai setinggi dada, siku memimpin','Jangan angkat melewati garis bahu kalau bahu terasa tidak nyaman','Bahu turun, jangan mengangkat bahu ke telinga']],
[/Rowing Machine/,['Dorong dengan kaki dulu, lalu badan, terakhir tarik tangan','Kembali dengan urutan terbalik: tangan, badan, lutut','Punggung tetap netral, jangan membungkuk di akhir tarikan']],
[/Triceps Dips/,['Badan tegak, siku mengarah ke belakang dan dekat badan','Turun sampai siku sekitar 90°, bahu tidak jatuh ke depan','Dorong naik sampai lengan lurus tanpa mengunci keras']],
[/Close Grip Bench Press/,['Genggaman selebar bahu, siku dekat badan','Turunkan bar ke bagian bawah dada secara terkendali','Dorong naik dengan fokus pada triceps']],
[/Stiff Leg Deadlift/,['Lutut hampir lurus tapi tidak dikunci','Dorong pinggul ke belakang, bar meluncur dekat kaki','Berhenti saat hamstring terasa kencang, punggung tetap lurus']],
[/Close Grip Pulldown/,['Genggam handle sempit dengan telapak menghadap satu sama lain atau ke arah wajah','Tarik siku ke bawah dan dekat pinggang','Dada terbuka, jangan mengayun badan']],
[/Straight Arm Pulldown/,['Lengan hampir lurus, siku sedikit menekuk','Tarik tali ke arah paha dengan kontraksi lat','Pinggul tetap diam, jangan membungkuk berlebihan']],
[/Chest Press/,['Punggung menempel di sandaran, bahu turun dan ke belakang','Dorong dengan dada, siku jangan dikunci di akhir','Turun terkendali sekitar 2–3 detik']],
[/Lat Pulldown/,['Tarik bar ke dada atas, bukan ke belakang leher','Bayangkan menarik siku ke bawah menuju pinggang','Dada sedikit naik, jangan mengayun badan']],
[/Chest-Supported/,['Dada menempel di bantalan','Tarik siku ke arah pinggul','Bahu jangan terangkat ke telinga']],
[/Row/,['Duduk tegak, dada terbuka','Tarik siku ke belakang, satukan tulang belikat','Lepas perlahan sampai lengan lurus tanpa membungkuk']],
[/Shoulder Press/,['Perut dan bokong kencang, punggung tidak melengkung','Dorong lurus ke atas, siku sedikit di depan badan','Turun sampai dumbbell sejajar telinga']],
[/Hammer Curl/,['Genggaman netral, ibu jari menghadap ke atas','Siku menempel di samping badan','Turun perlahan sampai lengan lurus']],
[/Biceps Curl/,['Siku menempel di samping badan','Naik terkendali, tanpa mengayun badan','Turun perlahan sampai lengan lurus']],
[/Triceps Pushdown/,['Siku dikunci di samping badan','Dorong sampai lengan lurus, tahan sebentar','Naik perlahan, bahu jangan ikut naik']],
[/Leg Press/,['Kaki selebar bahu di tengah platform','Turun sampai lutut sekitar 90 derajat','Punggung bawah tetap menempel, lutut jangan dikunci di atas']],
[/Goblet/,['Dumbbell dekat dada, badan tegak','Lutut searah ujung kaki','Turun sampai paha sejajar lantai, tumit tetap menapak']],
[/Romanian/,['Dorong pinggul ke belakang, lutut sedikit menekuk','Punggung lurus, dumbbell dekat paha','Berhenti saat hamstring terasa tertarik, lalu dorong pinggul ke depan']],
[/Leg Curl/,['Pinggul tetap menempel di bantalan','Tekuk lutut dengan hamstring, bukan dengan menghentak','Turun perlahan 2–3 detik']],
[/Leg Extension/,['Punggung rapat di sandaran','Luruskan lutut sampai paha depan terasa menegang','Turun terkendali tanpa memantul']],
[/Calf Raise/,['Naik setinggi mungkin di ujung jari','Tahan sebentar di atas','Turun penuh sampai betis terasa meregang']],
[/Plank/,['Tubuh lurus dari kepala sampai tumit','Perut dan bokong kencang','Napas teratur, pinggul jangan turun atau naik']],
[/Hack Squat/,['Punggung dan pinggul menempel di sandaran','Turun terkendali sampai lutut sekitar 90 derajat','Dorong dengan seluruh telapak kaki, lutut jangan masuk ke dalam']],
[/Lateral Raise/,['Angkat siku sampai setinggi bahu','Siku sedikit menekuk, badan jangan mengayun','Turun perlahan, beban ringan sudah cukup']],
[/Face Pull/,['Tarik tali ke arah wajah dengan siku tinggi','Pisahkan kedua tangan di akhir gerakan','Bahu tetap turun, jangan mengangkat bahu']],
[/Cable Crunch/,['Tekuk badan dengan perut, bukan menarik dengan lengan','Bulatkan punggung, hidung mengarah ke lutut','Hembuskan napas saat menekuk']],
[/Reverse Crunch/,['Angkat pinggul dengan kontraksi perut','Jangan mengayun kaki','Turun perlahan']],
[/Pallof/,['Berdiri tegap, pinggul menghadap depan','Dorong tangan lurus tanpa tubuh berputar','Tahan sebentar, lalu kembali perlahan']],
[/Sepeda|Bike/,['Atur sadel setinggi pinggul','Kayuh dengan irama stabil','Intensitas sedang: masih bisa berbicara pendek']],
[/Bulgarian/,['Kaki belakang bertumpu di bangku, langkah depan cukup jauh','Turun lurus ke bawah, lutut depan searah ujung kaki','Berat badan di tumit kaki depan']],
[/Front Squat/,['Siku tinggi, bar bertumpu di bahu depan','Badan tegak, dada terangkat','Turun sampai paha sejajar lantai atau lebih dalam']],
[/Squat/,['Kaki selebar bahu, ujung kaki sedikit keluar','Kencangkan perut, turun dengan pinggul ke belakang dan bawah','Lutut searah ujung kaki, dorong lewat tumit']],
[/Lunge/,['Langkah cukup panjang, badan tegak','Turun sampai lutut belakang hampir menyentuh lantai','Lutut depan searah ujung kaki, dorong dengan tumit']],
[/Step Up/,['Seluruh telapak kaki menapak di bangku','Naik dengan kaki depan, bukan melompat dari kaki belakang','Turun pelan, lutut tetap searah ujung kaki']],
[/Hip Thrust/,['Punggung atas bersandar di bangku, dagu sedikit ditarik','Dorong pinggul dengan bokong sampai badan sejajar','Tahan sebentar di atas, jangan melengkungkan punggung bawah']],
[/Hip Abduction/,['Punggung menempel di sandaran','Buka paha dengan gerakan lambat dan terkendali','Kembali pelan, jangan membiarkan beban menghentak']],
[/Deadlift/,['Bar dekat tulang kering, punggung lurus, dada terangkat','Dorong lantai dengan kaki, pinggul dan bahu naik bersamaan','Kunci di atas dengan bokong, jangan condong ke belakang']],
[/Bench Press/,['Bahu turun dan ke belakang, telapak kaki menapak kuat','Turunkan bar ke tengah dada, siku sekitar 45–60°','Dorong naik dengan stabil, bokong tetap di bangku']],
[/Incline Dumbbell Press/,['Bangku miring sekitar 30°, bahu menempel di sandaran','Turunkan dumbbell sejajar dada atas, siku tidak terlalu melebar','Dorong naik tanpa membenturkan dumbbell']],
[/Chest Fly/,['Siku sedikit menekuk dan tetap sama selama gerakan','Buka sampai dada meregang, bahu tidak tertarik ke depan','Rapatkan dengan kontraksi dada']],
[/Cable Crossover/,['Condong sedikit ke depan, siku sedikit menekuk','Tarik tangan bertemu di depan dada bawah','Tahan sebentar saat dada berkontraksi']],
[/Push Up/,['Tangan sedikit lebih lebar dari bahu, tubuh lurus','Turunkan dada sampai hampir menyentuh lantai','Siku sekitar 45° dari badan, perut dan bokong kencang']],
[/Dips/,['Condong sedikit ke depan untuk menekankan dada','Turun sampai bahu sejajar siku, jangan terlalu dalam','Dorong naik tanpa mengangkat bahu']],
[/Pull Up/,['Mulai dari gantung penuh, bahu turun','Tarik siku ke bawah sampai dagu melewati bar','Turun terkendali, hindari mengayun']],
[/Back Extension/,['Pinggul bertumpu di bantalan, badan lurus','Naik sampai badan sejajar kaki, jangan melengkung berlebihan','Gerakan lambat, kontraksi bokong dan punggung bawah']],
[/Overhead Press/,['Perut dan bokong kencang, bar mulai di bahu depan','Dorong lurus ke atas, kepala maju sedikit setelah bar lewat','Jangan melengkungkan punggung bawah']],
[/Arnold Press/,['Mulai dengan telapak menghadap wajah di depan dada','Putar telapak keluar sambil mendorong ke atas','Turun dengan memutar kembali secara terkendali']],
[/Rear Delt Fly/,['Condong ke depan, punggung lurus','Angkat siku ke samping dengan lengan sedikit menekuk','Fokus pada bahu belakang, jangan mengayun badan']],
[/Front Raise/,['Angkat ke depan sampai setinggi bahu','Siku sedikit menekuk, badan tidak condong ke belakang','Turun pelan dalam 2–3 detik']],
[/Shrug/,['Angkat bahu lurus ke atas ke arah telinga','Tahan sebentar di atas, jangan memutar bahu','Lengan lurus, kepala tetap tegak']],
[/Barbell Curl/,['Siku menempel di samping badan','Naik tanpa mengayun badan, tahan sebentar di atas','Turun terkendali sampai lengan hampir lurus']],
[/Preacher Curl/,['Lengan atas menempel penuh di bantalan','Naik terkendali, siku tidak terangkat','Turun pelan, jangan mengunci lengan keras di bawah']],
[/Cable Curl/,['Siku menempel di samping badan','Tarik sampai biseps berkontraksi penuh','Turun terkendali, tegangan kabel tetap terjaga']],
[/Concentration Curl/,['Siku bertumpu di dalam paha, badan condong ke depan','Naik pelan sampai biseps berkontraksi','Turun terkendali, jangan mengayun']],
[/Skull Crusher/,['Lengan atas tegak lurus, siku tidak melebar','Turunkan bar ke arah dahi atau belakang kepala dengan terkendali','Luruskan siku dengan triceps, bahu tetap diam']],
[/Overhead Triceps/,['Siku menunjuk ke atas dan dekat telinga','Turun di belakang kepala sampai triceps meregang','Luruskan lengan tanpa membuka siku']],
[/Crunch/,['Punggung bawah tetap menempel di lantai','Angkat bahu dengan kontraksi perut, leher rileks','Turun pelan, jangan menarik kepala dengan tangan']],
[/Hanging Leg Raise/,['Gantung stabil, bahu turun','Angkat kaki dengan kontraksi perut, panggul sedikit melengkung','Turun terkendali, jangan mengayun']],
[/Russian Twist/,['Badan condong sedikit ke belakang, punggung lurus','Putar badan dari dada, bukan hanya tangan','Gerakan terkendali, kaki boleh diangkat kalau mampu']],
[/Ab Wheel/,['Mulai dari berlutut, perut dan bokong kencang','Gulirkan ke depan sejauh punggung tetap lurus','Tarik kembali dengan perut, jangan melengkungkan punggung bawah']],
[/Mountain Climber/,['Tangan di bawah bahu, tubuh lurus seperti plank','Tarik lutut bergantian ke arah dada dengan ritme stabil','Pinggul tetap rendah, perut kencang']],
[/Dead Bug/,['Punggung bawah menempel di lantai','Turunkan lengan dan kaki berlawanan secara perlahan','Napas teratur, punggung bawah tidak terangkat']],
[/Treadmill/,['Pemanasan 3–5 menit pada kecepatan ringan','Badan tegak, langkah alami, jangan berpegangan terus','Naikkan kecepatan atau kemiringan bertahap']],
[/Elliptical/,['Badan tegak, bahu rileks','Dorong lewat tumit, gerakan mulus tanpa menghentak','Pegang handle ringan, jangan bertumpu penuh']],
[/Stair Climber/,['Badan tegak, langkah penuh dan mantap','Jangan bertumpu penuh pada pegangan','Mulai kecepatan rendah lalu naikkan perlahan']],
[/Lompat Tali/,['Lompat rendah di ujung kaki, lutut sedikit menekuk','Putar tali dengan pergelangan, bukan seluruh lengan','Mulai interval pendek lalu tambah durasi']],
[/Jalan Cepat/,['Badan tegak, ayunan lengan alami','Langkah cukup cepat sampai napas terengah tapi masih bisa bicara pendek','Gunakan sepatu nyaman, tambah durasi bertahap']],
[/Bicycle Crunch/,['Punggung bawah menempel di lantai','Putar badan dengan perut, siku ke lutut yang berlawanan','Gerakan lambat dan terkendali, bukan cepat']]
];

const BASE='<ellipse cx="100" cy="22" rx="14" ry="17"/><rect x="93" y="36" width="14" height="14" rx="4"/><path d="M64 54 Q100 44 136 54 L128 120 L132 150 L68 150 L72 120 Z"/><rect x="44" y="56" width="18" height="62" rx="9"/><rect x="138" y="56" width="18" height="62" rx="9"/><rect x="42" y="114" width="16" height="58" rx="8"/><rect x="142" y="114" width="16" height="58" rx="8"/><rect x="72" y="150" width="26" height="82" rx="12"/><rect x="102" y="150" width="26" height="82" rx="12"/><rect x="76" y="228" width="20" height="60" rx="10"/><rect x="104" y="228" width="20" height="60" rx="10"/>';

const ARM='<ellipse cx="53" cy="92" rx="8" ry="19" {f}/><ellipse cx="147" cy="92" rx="8" ry="19" {f}/>';

const DELT='<ellipse cx="62" cy="66" rx="10" ry="13" {f}/><ellipse cx="138" cy="66" rx="10" ry="13" {f}/>';

const GS2={
chest:{f:'<ellipse cx="85" cy="76" rx="15" ry="12" {f}/><ellipse cx="115" cy="76" rx="15" ry="12" {f}/>'},
shoulders:{f:DELT,b:DELT},biceps:{f:ARM},triceps:{b:ARM},
back:{b:'<ellipse cx="100" cy="60" rx="24" ry="10" {f}/><ellipse cx="85" cy="96" rx="13" ry="26" {f}/><ellipse cx="115" cy="96" rx="13" ry="26" {f}/>'},
core:{f:'<rect x="85" y="94" width="14" height="50" rx="7" {f}/><rect x="101" y="94" width="14" height="50" rx="7" {f}/>'},
quads:{f:'<ellipse cx="85" cy="192" rx="13" ry="38" {f}/><ellipse cx="115" cy="192" rx="13" ry="38" {f}/>'},
glutes:{b:'<ellipse cx="86" cy="160" rx="15" ry="13" {f}/><ellipse cx="114" cy="160" rx="15" ry="13" {f}/>'},
hamstrings:{b:'<ellipse cx="85" cy="204" rx="13" ry="30" {f}/><ellipse cx="115" cy="204" rx="13" ry="30" {f}/>'},
calves:{b:'<ellipse cx="86" cy="257" rx="10" ry="24" {f}/><ellipse cx="114" cy="257" rx="10" ry="24" {f}/>'}};

const MG={chest:'Dada',shoulders:'Bahu',biceps:'Biceps',triceps:'Triceps',back:'Punggung',core:'Perut dan core',quads:'Paha depan',hamstrings:'Hamstring',glutes:'Glutes',calves:'Betis'};

const GS={
chest:'<ellipse cx="43" cy="38" rx="9" ry="7" {f}/><ellipse cx="57" cy="38" rx="9" ry="7" {f}/>',
shoulders:'<circle cx="29" cy="31" r="8" {f}/><circle cx="71" cy="31" r="8" {f}/><circle cx="129" cy="31" r="7" {f}/><circle cx="171" cy="31" r="7" {f}/>',
biceps:'<rect x="21" y="38" width="8" height="18" rx="4" {f}/><rect x="71" y="38" width="8" height="18" rx="4" {f}/>',
triceps:'<rect x="121" y="38" width="8" height="18" rx="4" {f}/><rect x="171" y="38" width="8" height="18" rx="4" {f}/>',
back:'<ellipse cx="150" cy="33" rx="13" ry="7" {f}/><ellipse cx="141" cy="52" rx="8" ry="15" {f}/><ellipse cx="159" cy="52" rx="8" ry="15" {f}/>',
core:'<rect x="42" y="50" width="16" height="24" rx="6" {f}/>',
quads:'<rect x="34" y="78" width="14" height="32" rx="6" {f}/><rect x="52" y="78" width="14" height="32" rx="6" {f}/>',
glutes:'<ellipse cx="142" cy="77" rx="8" ry="7" {f}/><ellipse cx="158" cy="77" rx="8" ry="7" {f}/>',
hamstrings:'<rect x="134" y="85" width="14" height="26" rx="6" {f}/><rect x="152" y="85" width="14" height="26" rx="6" {f}/>',
calves:'<rect x="134" y="114" width="14" height="22" rx="6" {f}/><rect x="152" y="114" width="14" height="22" rx="6" {f}/>'};

const EXI=[[/Upright Row|Shrug/,['shoulders'],['back']],[/Chest Press/,['chest'],['shoulders','triceps']],[/Lat Pulldown/,['back'],['biceps']],[/Row/,['back'],['biceps','shoulders']],[/Shoulder Press/,['shoulders'],['triceps']],[/Lateral Raise/,['shoulders'],[]],[/Face Pull/,['shoulders','back'],[]],[/(Biceps|Hammer) Curl/,['biceps'],[]],[/Triceps Pushdown/,['triceps'],[]],[/Leg Press/,['quads'],['glutes','hamstrings']],[/Goblet Squat/,['quads','glutes'],['core']],[/Hack Squat/,['quads'],['glutes']],[/Romanian/,['hamstrings','glutes'],['back']],[/Leg Curl/,['hamstrings'],['calves']],[/Leg Extension/,['quads'],[]],[/Calf Raise/,['calves'],[]],[/Plank/,['core'],['shoulders']],[/Crunch|Pallof/,['core'],[]],[/Sepeda/,['quads'],['hamstrings','calves']],[/Close Grip Bench|Skull Crusher|Triceps Dips|Overhead Triceps/,['triceps'],['chest']],[/Bench Press|Push Up|^Dips|Chest Fly|Crossover/,['chest'],['shoulders','triceps']],[/Overhead Press|Arnold|Front Raise/,['shoulders'],['triceps']],[/Rear Delt/,['shoulders'],['back']],[/Pull Up|Close Grip Pulldown|Straight Arm/,['back'],['biceps']],[/Barbell Curl|Preacher|Cable Curl|Concentration/,['biceps'],[]],[/Stiff Leg/,['hamstrings','glutes'],['back']],[/^Deadlift/,['back','hamstrings'],['glutes','quads']],[/Squat|Lunge|Step Up/,['quads','glutes'],['hamstrings']],[/Hip Thrust|Hip Abduction/,['glutes'],['hamstrings']],[/Back Extension/,['back'],['glutes','hamstrings']],[/Hanging Leg|Russian|Ab Wheel|Side Plank|Mountain|Dead Bug/,['core'],[]]];

const BK=['ap_weights','ap_sessions','ap_prog','ap_body','ap_profile','ap_theme','ap_xnotes','ap_lib'];

const RG=[[7,'7 hari'],[30,'30 hari'],[90,'3 bulan'],[180,'6 bulan'],[365,'1 tahun']];

const IC={home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',workout:'<path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12"/>',progress:'<path d="M3 20h18M5 16l4-5 4 3 6-8"/>',history:'<path d="M12 7v5l3 2"/><circle cx="12" cy="12" r="9"/>',profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'};

const NAMA={home:'Beranda',workout:'Workout',progress:'Progres',history:'Riwayat',profile:'Profil'};
