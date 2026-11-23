/* PlayboxTV TV prototype – mock content.
   All imagery comes from the Figma file (assets/). Titles, descriptions, dates and
   lock states are placeholder content for the demo. */
'use strict';

/* Seeded random so lock states are "random" but identical on every load. */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd = mulberry32(20261122);

const OTTS = [
  {k:'sony',       name:'Sony LIV'},
  {k:'sunnxt',     name:'Sun NXT'},
  {k:'zee5',       name:'ZEE5'},
  {k:'jiohotstar', name:'JioHotstar'},
  {k:'shortstv',   name:'ShortsTV'},
  {k:'chaupal',    name:'Chaupal'},
];
/* Explore-by-OTT row repeats the 6 platforms (as in the design). */
const OTT_ROW = [0,1,2,3,4,5,0,1,2,3,4,5].map(i => OTTS[i]);

/* Catalog: key (= poster file in assets/p) -> metadata */
const C = {};
function add(k,t,yr,d,r,g,ott,desc,x){ C[k]=Object.assign({k,t,yr,d,r,g,ott,desc,lang:'3 Languages'},x||{}); }
add('narivetta','Narivetta',2025,'2h 08m','U/A 16+',['Action','Crime','Thriller'],'zee5','A rookie constable is pulled into a land-rights fight when a peaceful protest turns violent overnight.');
add('athiradi','Athiradi',2025,'2h 11m','U/A 13+',['Comedy','Drama'],'sunnxt','Two rival friends in a coastal town bet their families’ pride on one wild wedding weekend.');
add('bholaa','Bholaa',2023,'2h 25m','U/A 16+',['Action','Drama'],'jiohotstar','A released convict has one night to reach his daughter, with an entire police force in his way.');
add('hanuman','Hanuman Ansh',2025,'2h 02m','U',['Mythology','Adventure'],'jiohotstar','A village guardian discovers the ancient strength that has been waiting in his bloodline.');
add('vikram','Vikram',2022,'2h 55m','A',['Action','Thriller'],'jiohotstar','A black-ops agent returns from the shadows to hunt a masked gang that is killing his old team.');
add('mangalavaaram','Mangalavaaram',2023,'2h 15m','U/A 16+',['Thriller','Mystery'],'jiohotstar','Every Tuesday a villager dies in a mysterious way, and a lone investigator refuses to believe in curses.');
add('officer','Officer on Duty',2025,'2h 04m','U/A 16+',['Crime','Thriller'],'zee5','A tired inspector is handed one last case that links a quiet town to an old crime ring.');
add('lokah','Lokah: Chapter 1',2025,'2h 30m','U/A 13+',['Fantasy','Action'],'jiohotstar','A young woman new to the city finds that her neighbours guard a secret older than the streets.');
add('alpha','Alpha',2026,'2h 18m','U/A 16+',['Action','Spy'],'sony','An elite agent goes off the grid to stop a leak that could unmask every operative in the field.');
add('matchday','Matchday',2026,'1h 52m','U',['Sports','Drama'],'sony','One night, two rival fan clubs and a final that decides more than the trophy.');
add('stree2','Stree 2',2024,'2h 27m','U/A 13+',['Horror','Comedy'],'zee5','The town of Chanderi is haunted again, and the old gang has to out-scare the ghost.');
add('shikaari','Shikaari',2025,'2h 06m','U/A 13+',['Comedy','Adventure'],'chaupal','Four old friends set off for a weekend hunt that goes hilariously off the map.');
add('blast','Blast',2025,'2h 09m','U/A 16+',['Thriller','Drama'],'chaupal','A card game in a locked room turns into a night of confessions nobody planned.');
add('comedycircus','Comedy Circus',2024,'1h 48m','U',['Comedy','Family'],'sony','The best stand-up acts in the country fight for the biggest laugh on the biggest stage.');
add('thaaikizhavi','Thaai Kizhavi',2025,'2h 14m','U',['Comedy','Family'],'sunnxt','A fearless grandmother sets out across the state to settle one very old family score.');
add('ganapath','Ganapath',2023,'2h 30m','U/A 16+',['Action','Sci-Fi'],'zee5','In a broken future, one reluctant fighter becomes the last hope of the slums.');
add('sixunderground','6 Underground',2019,'2h 08m','A',['Action','Adventure'],'jiohotstar','Six people fake their deaths to take down the world’s worst villains, no rules, no names.');
add('junglecruise','Jungle Cruise',2021,'2h 07m','U/A 13+',['Adventure','Fantasy'],'jiohotstar','A riverboat skipper and a headstrong scientist chase a tree that can heal anything.');
add('explorer','Explorer',2024,'1h 58m','U',['Adventure','Family'],'zee5','An adventure of a lifetime begins with one torn map and a very stubborn compass.');
add('fastfurious','Fast & Furious',2021,'2h 22m','U/A 13+',['Action','Crime'],'jiohotstar','The crew comes back for one more job, and this time the cars are the easy part.');
add('archer','Archer',2025,'2h 01m','U/A 13+',['Action','Adventure'],'zee5','Survival is a hard game. One archer has to win it under the light of a blood-red moon.');
add('wanderlust','Wanderlust',2018,'6 Episodes','U/A 16+',['Drama','Romance'],'sony','A therapist and her husband open up their marriage and find out what really holds them together.',{series:true});
add('cheers','Cheers',1982,'11 Seasons','U',['Sitcom','Comedy'],'sony','The regulars at a Boston bar trade punchlines and heartbreak, one pour at a time.',{series:true});
add('lanterns','Lanterns',2026,'8 Episodes','U/A 16+',['Sci-Fi','Mystery'],'jiohotstar','Two strangers wake up under a sky of floating lights that nobody else seems to see.',{series:true});
add('youngsheldon','Young Sheldon',2017,'7 Seasons','U',['Sitcom','Family'],'jiohotstar','A genius kid in small-town Texas figures out the world, and his family figures out him.',{series:true});
add('raymond','Everybody Loves Raymond',1996,'9 Seasons','U',['Sitcom','Family'],'sony','A sports writer’s life is run, loudly and lovingly, by his parents next door.',{series:true});
add('moneyheist','Money Heist',2017,'5 Seasons','A',['Crime','Thriller'],'sony','A mastermind and eight thieves lock themselves inside the Royal Mint with a plan and a hostage list.',{series:true});
add('shadowrose','Shadow Rose',2025,'2h 12m','U/A 16+',['Fantasy','Drama'],'zee5','A cursed queen and a runaway knight race a falling kingdom to the last flower.');
add('onepiece','One Piece',2023,'8 Episodes','U/A 13+',['Adventure','Fantasy'],'jiohotstar','A rubber-limbed dreamer sails across the Grand Line to find the world’s greatest treasure.',{series:true});
add('insidious','Insidious',2010,'1h 43m','A',['Horror','Thriller'],'jiohotstar','A family discovers that it is not the house that is haunted, it is their son.');
add('dhurandhar','Dhurandhar',2025,'3h 28m','A',['Action','Spy'],'jiohotstar','An undercover operative climbs a cross-border crime empire one betrayal at a time.');
add('tamil1','Drishyam 3: The Conclusion',2026,'2h 15m','U/A 7+',['Thriller','Drama'],'zee5','A middle-aged man fools people and the police for the third time. What will happen with Vijay this time?',{lang:'Hindi, Telugu and +3 more'});
add('interstellar','Interstellar',2014,'2h 49m','U/A 13+',['Sci-Fi','Adventure'],'jiohotstar','When Earth runs out of time, a team of explorers travels through a wormhole to find a new home.',{bd:'interstellar',logo:'interstellar'});
add('f1poster','F1: The Movie',2025,'2h 36m','U/A 13+',['Sports','Drama'],'jiohotstar','A retired driver returns to the grid to mentor a rookie and chase one last championship.',{bd:'f1',logo:'f1'});
add('godzillaPoster','Godzilla',2014,'2h 03m','U/A 13+',['Action','Sci-Fi'],'jiohotstar','An ancient predator rises from the sea and two creatures decide the fate of the coast.');
add('godzillaKong','Godzilla vs. Kong',2021,'1h 53m','U/A 13+',['Action','Sci-Fi'],'jiohotstar','Two titans meet in a battle that will decide who rules the earth.');
add('godzillaZero','Godzilla Minus Zero',2024,'2h 04m','U/A 13+',['Action','Drama'],'jiohotstar','A broken pilot has to face the monster that took everything from a nation at its lowest.');
/* Landscape stills / sports (poster file is landscape) */
add('friends','Friends',1994,'10 Seasons','U/A 13+',['Sitcom','Comedy'],'sony','Six friends in New York figure out love, jobs and each other.',{series:true});
add('herapheri','Hera Pheri',2000,'2h 36m','U',['Comedy'],'sony','Three broke men and one wrong-number call. A comedy classic.');
add('dhamaal','Dhamaal',2007,'2h 15m','U/A 13+',['Comedy','Adventure'],'sony','Four slackers chase a dying man’s fortune across the country.');
add('aawara','Aawara Pagal Deewana',2002,'2h 22m','U/A 13+',['Comedy','Action'],'sony','A gambler, a gangster and a hit-and-run: the funniest 48 hours in Mumbai.');
add('viratkohli','Virat Kohli Victory Shots',2025,'25m','U',['Cricket'],'jiohotstar','The innings that changed a final, replayed shot by shot.',{sports:true,sub:'Cricket'});
add('indpak','Dhoni Worldcup Rewind',2025,'1h 10m','U',['Cricket'],'jiohotstar','India vs Pakistan: a nail-biting chase, relived ball by ball.',{sports:true,sub:'Cricket'});
add('ronaldo','Ronaldo’s Winning Move',2026,'18m','U',['Football'],'sony','The late run, the header and the roar from the stands.',{sports:true,sub:'Football'});
add('messi','Messi Magic Moments',2026,'22m','U',['Football'],'sony','Every dribble that lit up the final, from every angle.',{sports:true,sub:'Football'});
add('f1sunset','Singapore Grand Prix Highlights',2026,'32m','U',['Motorsport'],'sony','Qualifying, the first-lap chaos and the podium under the lights.',{sports:true,sub:'Formula 1'});

/* ---------- helpers ---------- */
const poster = k => 'assets/p/' + k + '.jpg';
function mk(k, over){
  const c = Object.assign({}, C[k], over||{});
  c.img = poster(c.img || c.k);
  return c;
}
/* lock: 'all' | 'none' | probability (random, seeded) */
function lockFor(mode){ return mode==='all' ? true : mode==='none' ? false : rnd() < (mode ?? 0.35); }
function list(keys, o){
  o = o||{};
  return keys.map((k,i) => {
    const it = mk(k, o.over && o.over[i]);
    it.locked = lockFor(o.lock);
    if(o.tag && (o.tagEvery ? i % o.tagEvery === 0 : true)) it.tag = (typeof o.tag==='function') ? o.tag(i) : o.tag;
    if(o.live) it.live = rnd() < o.live;
    return it;
  });
}

/* ---------- Hero carousel (4 slides) ---------- */
const HERO = [
  {key:'gadar', bg:'assets/b/gadar.jpg', logo:'assets/l/gadar.png', logoW:470, rating:'U/A 16+', yr:2025, d:'2h 16m', lang:'3 Languages', g:['Action','Crime','Thriller','Drama'],
   desc:'When Tara Singh goes missing during a skirmish and is believed to be captured in Pakistan, his son Jeete sets out to bring him home.'},
  {key:'f1', bg:'assets/b/f1.jpg', logo:'assets/l/f1.png', logoW:470, rating:'U/A 13+', yr:2025, d:'2h 36m', lang:'4 Languages', g:['Sports','Drama','Action'],
   desc:'A retired driver returns to the grid to mentor a rookie and chase one last championship at 300 km/h.'},
  {key:'interstellar', bg:'assets/b/interstellar.jpg', logo:'assets/l/interstellar.png', logoW:560, rating:'U/A 13+', yr:2014, d:'2h 49m', lang:'3 Languages', g:['Sci-Fi','Adventure','Drama'],
   desc:'When Earth runs out of time, a team of explorers travels through a wormhole in search of a new home for humanity.'},
  {key:'tehran', bg:'assets/b/tehran.jpg', title:'Tehran', rating:'U/A 16+', yr:2025, d:'8 Episodes', lang:'3 Languages', g:['Thriller','Spy','Drama'],
   desc:'An intelligence officer goes deep undercover in a foreign capital where one wrong word can end the mission.'},
];

/* ---------- Home sections ---------- */
/* type decides card geometry & focus layout (see app.js TYPES) */
const SECTIONS = [];
function sec(id, type, title, items, extra){ SECTIONS.push(Object.assign({id, type, title, items}, extra||{})); }

sec('hero','hero','',[{k:'watch'},{k:'info'}]);
sec('otts','otts','Explore by OTTs', OTT_ROW.map(o => ({ott:o.k, name:o.name})));
sec('ottrail','ottrail','',[]);                       // filled per selected OTT (see ottRailItems)

/* Continue Watching – mixed portrait + landscape cards (variation chosen by the designer) */
sec('cw','cw','Continue Watching',[
  mk('friends',{img:'friends',portrait:true,sub:'S1:E3 | 23 mins remaining',progress:.62,w:240,tag:'New Movie'}),
  mk('viratkohli',{sub:'25 mins remaining',progress:.8,w:504,landscape:true}),
  mk('wanderlust',{t:'Zindagi Na Milegi Dobara',sub:'50 mins remaining',progress:.35,w:240}),
  mk('dhurandhar',{sub:'10 mins remaining',progress:.9,w:240}),
  mk('indpak',{sub:'42 mins remaining',progress:.5,w:504,landscape:true}),
  mk('cheers',{t:'The Office',sub:'S2:E7 | 12 mins remaining',progress:.7,w:240}),
  mk('lanterns',{sub:'S1:E4 | 31 mins remaining',progress:.25,w:240}),
  mk('officer',{sub:'1h 02m remaining',progress:.1,w:240}),
].map(i => (i.locked = lockFor(0.25), i)));

sec('toppicks','poster','Top Picks For You', list(['narivetta','athiradi','bholaa','vikram','mangalavaaram','officer','lokah','alpha','ganapath','stree2'],{tag:'New Movie'}));

sec('streams1','stream','Non-Stop Hindi Movies', list(['herapheri','dhamaal','aawara','stree2','comedycircus','shikaari'],{lock:0.25,over:[
  {t:'Hera Pheri'},{t:'Dhamaal'},{t:'Aawara Pagal Deewana'},{t:'Stree 2'},{t:'Comedy Circus'},{t:'Shikaari'}]}));

sec('watchlist','poster','From your Watchlist', list(['hanuman','bholaa','vikram','mangalavaaram','officer','lokah','alpha','matchday'],{tag:'New Movie'}));

sec('spot','spot','', [
  /* all cards are portrait (9:16) until focused, then they grow into a 16:9 card */
  mk('godzillaPoster',{t:'Godzilla: King of the Monsters',img:'godzillaStorm',w:220,h:300,tag:'New Movie',pos:'center 86%'}),
  mk('godzillaPoster',{w:220,h:300,pos:'center 30%'}), mk('godzillaKong',{w:220,h:300,pos:'center 40%'}), mk('godzillaZero',{w:220,h:300,pos:'center 45%'}),
].map(i => (i.locked = lockFor(0.3), i)), {logo:'assets/l/godzilla.png', bg:'assets/b/godzilla.jpg',
  blurb:'Ancient powers awaken. A battle for our world begins. Experience the epic showdown in stunning detail.'});

sec('genre','genre','Genre',[
  {t:'Romance', img:'assets/p/romanceg.jpg', c:'#b4479f', pos:'center'},
  {t:'Drama',   img:'assets/p/dramag.jpg',   c:'#3f45a3', pos:'center'},
  {t:'Action',  img:'assets/p/actionguy.jpg',c:'#0f4e52', pos:'top'},
  {t:'Sci-Fi',  img:'assets/p/astro.jpg',    c:'#2357b5', pos:'top'},
  {t:'Mythology',img:'assets/p/hanuman.jpg', c:'#b9791b', pos:'top'},
  {t:'Thriller',img:'assets/p/thrillerg.jpg',c:'#5b2e9b', pos:'center'},
  {t:'Crime',   img:'assets/p/moneyheist.jpg',c:'#b6231f', pos:'top'},
]);

/* Upcoming on PlayboxTV – wireframe only: UI built from existing patterns */
sec('upcoming','upcoming','Upcoming on PlayboxTV', [
  ['tamil1','This Friday'],['insidious','This Friday'],['youngsheldon','28th Nov'],['raymond','5th Dec'],
  ['dhurandhar','12th Dec'],['shadowrose','19th Dec'],['onepiece','25th Dec'],['alpha','1st Jan'],
].map(([k,date]) => Object.assign(mk(k,{date}), {reminder:false})));

sec('action','poster','Action Adventure', list(['ganapath','archer','junglecruise','explorer','archer','fastfurious','sixunderground','narivetta'],{tag:'New Movie'}));

sec('banner','banner','',[{k:'banner'}]);

sec('sgp','sports','2026 Singapore Grand Prix Highlights', ['f1sunset','f1sunset','f1sunset','f1sunset'].map((k,i) =>
  Object.assign(mk(k,{t:['Qualifying Highlights','Race Highlights','Practice 3 Highlights','Podium Celebrations'][i],sub:'Formula 1 | 2026'}), {locked:lockFor(.5), live:i<2})));

sec('comedy','poster','Comedy Flicks', list(['athiradi','comedycircus','shikaari','stree2','blast','thaaikizhavi','herapheri'],{tag:'New Movie',over:[{},{},{},{},{},{},{img:'dhamaal',t:'Dhamaal'}]}));

sec('players','sports','Players on the Field', ['viratkohli','indpak','ronaldo','messi','viratkohli','messi'].map((k,i) =>
  Object.assign(mk(k,{sub:['Cricket','Cricket','Football','Football','Cricket','Football'][i]}), {locked:lockFor(.4), live:i!==3})));

sec('hotstar','posterSm','Trending on Hotstar', list(['vikram','mangalavaaram','bholaa','narivetta','lokah','alpha','officer'],{lock:'all',tag:'Recently Added'}), {ottBadge:'jiohotstar'});

sec('live','live','Premium Live Channels',
  [['starmovies','Star Movies'],['colors','Colors Tamil'],['zeetv','Zee TV'],['sonysports','Sony Sports Network'],['starsports','Star Sports'],
   ['hbo','HBO'],['discovery','Discovery'],['natgeo','Nat Geo Wild'],['aajtak','Aaj Tak'],['cnn','CNN']]
  .map(([k,t]) => ({k, t, logo:'assets/l/'+k+'.png', locked:lockFor(.35)})));

sec('streams2','stream','Sit Back and Relax', list(['dhamaal','herapheri','aawara','shikaari','stree2','comedycircus'],{lock:0.3,over:[{t:'Dhamaal'},{t:'Hera Pheri'},{t:'Aawara Pagal Deewana'},{t:'Shikaari'},{t:'Stree 2'},{t:'Comedy Circus'}]}));

sec('sitcom','poster','Everyone’s Favourite SitCom', list(['cheers','youngsheldon','raymond','lanterns','wanderlust'],{tag:'New Movie'}));
sec('slow','poster','Slow Burns', list(['lanterns','wanderlust','moneyheist','shadowrose','insidious','onepiece'],{tag:'New Movie'}));
sec('chaupal','posterSm','Trending on Chaupal', list(['shikaari','blast','thaaikizhavi','comedycircus','athiradi'],{lock:'none',tag:'Recently Added'}), {ottBadge:'chaupal'});
sec('romance','poster','Romance for the Ages', list(['lokah','alpha','wanderlust','athiradi','tamil1','narivetta'],{tag:'New Movie'}));
sec('binge','poster','Binge Worthy Shows', list(['moneyheist','onepiece','shadowrose','lanterns','wanderlust','cheers'],{tag:'New Movie'}));
sec('fifa','sports','Fifa 2026 Highlights', ['messi','ronaldo','messi','ronaldo'].map((k,i) =>
  Object.assign(mk(k,{sub:'Football | World Cup 2026'}), {locked:lockFor(.4), live:i===0})));
sec('zee5','posterSm','Trending on Zee5', list(['ganapath','archer','explorer','narivetta','officer','stree2'],{lock:'none',tag:'Recently Added'}), {ottBadge:'zee5'});
sec('sonyliv','posterSm','Trending on SonyLiv', list(['alpha','matchday','comedycircus','cheers','raymond','moneyheist'],{lock:'all',tag:'Recently Added'}), {ottBadge:'sony'});
sec('malayalam','poster','Malayalam Movie Mania', list(['thaaikizhavi','mangalavaaram','lokah','blast','athiradi','tamil1'],{tag:'New Movie'}));

/* "Explore by OTT" rail: different titles for each platform (seeded, repeatable) */
const OTT_RAIL_CACHE = {};
function ottRailItems(ottKey){
  if(OTT_RAIL_CACHE[ottKey]) return OTT_RAIL_CACHE[ottKey];
  const pool = Object.values(C).filter(c => !c.sports && !c.landscape && !['friends','herapheri','dhamaal','aawara'].includes(c.k));
  const own = pool.filter(c => c.ott === ottKey);
  const rest = pool.filter(c => c.ott !== ottKey);
  const r = mulberry32(ottKey.split('').reduce((a,c)=>a*31+c.charCodeAt(0),7));
  const shuf = a => a.map(v=>[r(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
  const keys = shuf(own).concat(shuf(rest)).slice(0,10).map(c=>c.k);
  const items = keys.map((k,i)=>{ const it = mk(k); it.locked = rnd()<0.35; it.tag = i%2===0 ? 'New Movie' : null; return it; });
  return OTT_RAIL_CACHE[ottKey] = items;
}

/* Subscription plans (drawer) */
const PLANS = [
  {name:'Maharaja MAX', price:499, devices:'4 Devices at a time', worth:'₹9,699', otts:'30 OTTs + Vouchers'},
  {name:'Ultimate Super Value', price:279, devices:'4 Devices at a time', worth:'₹9,699', otts:'30 OTTs + Vouchers'},
];
const PLAN_OTT_CHIPS = [['jiohotstar','₹199'],['zee5','₹149'],['sony','₹179'],['sunnxt','₹179'],['chaupal','₹179']];
