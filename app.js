const API = "https://restcountries.com/v3.1/all?fields=name,cca2,continents,currencies,capital,timezones,latlng,population,languages,subregion";
const CONTS = [
  {id:"Asia",e:"🌏"},{id:"Africa",e:"🌍"},{id:"North America",e:"🌎"},
  {id:"South America",e:"🌎"},{id:"Antarctica",e:"🐧"},{id:"Europe",e:"🏰"},{id:"Oceania",e:"🏝️"}
];
// Curated cities [name, lat, lon] for the weather page (other countries show their capital)
const CITIES = {
  PK:[["Karachi",24.86,67.01],["Lahore",31.55,74.34],["Islamabad",33.69,73.05],["Peshawar",34.01,71.58],["Quetta",30.18,66.99]],
  IN:[["Delhi",28.61,77.21],["Mumbai",19.08,72.88],["Chennai",13.08,80.27],["Kolkata",22.57,88.36],["Bengaluru",12.97,77.59]],
  US:[["New York",40.71,-74.0],["Los Angeles",34.05,-118.24],["Chicago",41.88,-87.63],["Houston",29.76,-95.37],["Miami",25.76,-80.19]],
  GB:[["London",51.51,-0.13],["Manchester",53.48,-2.24],["Edinburgh",55.95,-3.19],["Cardiff",51.48,-3.18]],
  CN:[["Beijing",39.9,116.4],["Shanghai",31.23,121.47],["Guangzhou",23.13,113.26],["Chengdu",30.57,104.07]],
  JP:[["Tokyo",35.68,139.69],["Osaka",34.69,135.5],["Sapporo",43.06,141.35],["Fukuoka",33.59,130.4]],
  SA:[["Riyadh",24.71,46.68],["Jeddah",21.49,39.19],["Mecca",21.39,39.86],["Medina",24.47,39.61]],
  AE:[["Dubai",25.2,55.27],["Abu Dhabi",24.45,54.38],["Sharjah",25.35,55.42]],
  TR:[["Istanbul",41.01,28.98],["Ankara",39.93,32.86],["Izmir",38.42,27.14]],
  BD:[["Dhaka",23.81,90.41],["Chittagong",22.36,91.78],["Sylhet",24.9,91.87]],
  CA:[["Toronto",43.65,-79.38],["Vancouver",49.28,-123.12],["Montreal",45.5,-73.57],["Calgary",51.05,-114.07]],
  AU:[["Sydney",-33.87,151.21],["Melbourne",-37.81,144.96],["Perth",-31.95,115.86],["Brisbane",-27.47,153.03]],
  DE:[["Berlin",52.52,13.4],["Munich",48.14,11.58],["Hamburg",53.55,9.99],["Frankfurt",50.11,8.68]],
  FR:[["Paris",48.86,2.35],["Marseille",43.3,5.37],["Lyon",45.76,4.84],["Nice",43.7,7.27]],
  RU:[["Moscow",55.76,37.62],["Saint Petersburg",59.93,30.34],["Novosibirsk",55.03,82.92],["Vladivostok",43.12,131.89]],
  BR:[["São Paulo",-23.55,-46.63],["Rio de Janeiro",-22.91,-43.17],["Brasília",-15.79,-47.88],["Manaus",-3.12,-60.02]],
  EG:[["Cairo",30.04,31.24],["Alexandria",31.2,29.92],["Luxor",25.69,32.64]],
  NG:[["Lagos",6.52,3.38],["Abuja",9.08,7.4],["Kano",12.0,8.52]],
  ZA:[["Johannesburg",-26.2,28.05],["Cape Town",-33.92,18.42],["Durban",-29.86,31.02]],
  MX:[["Mexico City",19.43,-99.13],["Guadalajara",20.66,-103.35],["Monterrey",25.69,-100.32]],
  ID:[["Jakarta",-6.2,106.85],["Surabaya",-7.25,112.75],["Bali (Denpasar)",-8.65,115.22]],
  AF:[["Kabul",34.53,69.17],["Kandahar",31.63,65.74],["Herat",34.35,62.2]],
  IR:[["Tehran",35.69,51.39],["Mashhad",36.3,59.6],["Isfahan",32.65,51.67]]
};
const WX = c => c===0?"☀️ Clear":c<=2?"⛅ Partly cloudy":c==3?"☁️ Cloudy":c<=48?"🌫️ Fog":c<=57?"🌦️ Drizzle":c<=67?"🌧️ Rain":c<=77?"❄️ Snow":c<=82?"🌧️ Showers":"⛈️ Storm";
const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString(undefined,{maximumFractionDigits:2});
const cur = c => Object.keys(c.currencies||{})[0];
const flag = c => `https://flagcdn.com/w80/${c.cca2.toLowerCase()}.png`;

function shell(){
  const p = document.body.dataset.page;
  const on = k => p===k?'class="on"':'';
  $("#nav").innerHTML = `<nav><b>🫧 WorldEco</b><a href="index.html" ${on('home')}>🏠 Home</a>
    <a href="weather.html" ${on('weather')}>🌤️ Weather</a><a href="time.html" ${on('time')}>🕒 Current Time</a></nav>`;
  $("#footer").innerHTML = `<footer><span>Developer: KING_YOSEF_</span></footer>`;
  const b = document.createElement("div"); b.className = "bubbles";
  for(let i=0;i<22;i++){const s=document.createElement("span"),z=20+Math.random()*80;
    s.style.cssText=`left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${10+Math.random()*18}s;animation-delay:${-Math.random()*20}s`;b.append(s);}
  document.body.prepend(b);
}
async function getCountries(){
  try{const s=sessionStorage.getItem("cc"); if(s) return JSON.parse(s);}catch(e){}
  const d = (await (await fetch(API)).json()).sort((a,b)=>a.name.common.localeCompare(b.name.common));
  try{sessionStorage.setItem("cc",JSON.stringify(d));}catch(e){}
  return d;
}
async function getRates(){
  const r = await (await fetch("https://open.er-api.com/v6/latest/USD")).json();
  return r.rates;
}
function about(c){
  const cap = (c.capital||[])[0]||"no capital", cu = c.currencies?Object.values(c.currencies)[0]:null;
  const lang = Object.values(c.languages||{}).slice(0,3).join(", ")||"various languages";
  return `${c.name.common} is in ${c.subregion||c.continents[0]}. Its capital is ${cap} and about ${fmt(c.population)} people live there. People speak ${lang}, and the money used is the ${cu?cu.name+" ("+cur(c)+")":"local currency"}.`;
}
function fillNames(list){ $("#names").innerHTML = list.map(c=>`<option value="${c.name.common}">`).join(""); }
const find = (list,n) => list.find(c=>c.name.common.toLowerCase()===n.trim().toLowerCase());

/* ---------- HOME ---------- */
async function home(list){
  $("#continents").innerHTML = CONTS.map(k=>{
    const n = list.filter(c=>c.continents.includes(k.id)).length;
    return `<a class="card cont" href="continent.html?c=${encodeURIComponent(k.id)}"><span class="em">${k.e}</span><h3>${k.id}</h3><small>${n} countries</small></a>`;
  }).join("");
  const money = list.filter(c=>cur(c));
  const opt = code => money.map(c=>`<option value="${cur(c)}|${c.name.common}" ${c.cca2===code?"selected":""}>${c.name.common} (${cur(c)})</option>`).join("");
  $("#from").innerHTML = opt("IN"); $("#to").innerHTML = opt("PK");
  let rates; try{rates = await getRates();}catch(e){$("#result").textContent="Could not load rates. Check your internet.";return;}
  const code = s => s.value.split("|")[0], name = s => s.value.split("|")[1];
  const calc = () => {
    const a = +$("#amount").value||0, f = code($("#from")), t = code($("#to"));
    const v = a / rates[f] * rates[t];
    $("#result").innerHTML = `${fmt(a)} ${f} (${name($("#from"))}) = ${fmt(v)} ${t} (${name($("#to"))})<br><small>1 ${f} = ${fmt(rates[t]/rates[f])} ${t}</small>`;
  };
  ["amount","from","to"].forEach(i=>$("#"+i).addEventListener("input",calc));
  $("#swap").onclick = () => {const x=$("#from").value;$("#from").value=$("#to").value;$("#to").value=x;calc();};
  const pairs = [["IN","PK"],["US","PK"],["GB","IN"],["AE","PK"],["US","IN"],["SA","PK"],["CN","US"],["JP","US"]];
  $("#popular").innerHTML = pairs.map(([a,b])=>`<button data-a="${a}" data-b="${b}">${a} → ${b}</button>`).join("");
  $("#popular").onclick = e => { if(!e.target.dataset.a) return;
    const pick = k => { const c=list.find(x=>x.cca2===k); return cur(c)+"|"+c.name.common; };
    $("#from").value = pick(e.target.dataset.a); $("#to").value = pick(e.target.dataset.b); calc(); };
  calc();
}

/* ---------- CONTINENT ---------- */
async function continent(list){
  const id = new URLSearchParams(location.search).get("c")||"Asia";
  const k = CONTS.find(x=>x.id===id)||CONTS[0];
  document.title = k.id; $("#title").textContent = `${k.e} ${k.id}`;
  const items = list.filter(c=>c.continents.includes(k.id));
  $("#sub").textContent = k.id==="Antarctica"
    ? "No country owns Antarctica. It has only research stations and is governed by the Antarctic Treaty."
    : `${items.length} countries. Tap a country's buttons for its weather and time.`;
  let rates={}; try{rates=await getRates();}catch(e){}
  const draw = q => {
    $("#list").innerHTML = items.filter(c=>c.name.common.toLowerCase().includes(q)).map(c=>{
      const code = cur(c), r = rates[code];
      return `<div class="card"><img class="flag" src="${flag(c)}" alt=""><h3>${c.name.common}</h3>
        <p>${about(c)}</p>${r?`<span class="tag">💵 1 USD = ${fmt(r)} ${code}</span>`:""}
        <p><a class="btn" href="weather.html?country=${encodeURIComponent(c.name.common)}">🌤️ Weather</a>
        <a class="btn" href="time.html?country=${encodeURIComponent(c.name.common)}">🕒 Time</a></p></div>`;
    }).join("") || `<p class="center">Nothing to show here.</p>`;
  };
  $("#filter").oninput = e => draw(e.target.value.toLowerCase()); draw("");
  if(!items.length) $("#filter").style.display="none";
}

/* ---------- WEATHER ---------- */
async function weather(list){
  fillNames(list);
  const show = async c => {
    $("#wtitle").textContent = `${c.name.common}`; $("#out").innerHTML = `<p class="center">Loading… 🫧</p>`;
    let cities = CITIES[c.cca2];
    if(!cities){
      const cap = (c.capital||[])[0];
      cities = [[cap||c.name.common, c.latlng[0], c.latlng[1]]];
      if(cap){ try{ const g = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cap)}&count=1&country_code=${c.cca2}`)).json();
        if(g.results) cities=[[cap,g.results[0].latitude,g.results[0].longitude]]; }catch(e){} }
    }
    try{
      const u = `https://api.open-meteo.com/v1/forecast?latitude=${cities.map(x=>x[1])}&longitude=${cities.map(x=>x[2])}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m`;
      let d = await (await fetch(u)).json(); if(!Array.isArray(d)) d=[d];
      $("#out").innerHTML = d.map((w,i)=>`<div class="card"><h3>📍 ${cities[i][0]}</h3>
        <div class="temp">${Math.round(w.current.temperature_2m)}°C</div><p>${WX(w.current.weather_code)}</p>
        <span class="tag">💧 ${w.current.relative_humidity_2m}%</span><span class="tag">💨 ${w.current.wind_speed_10m} km/h</span></div>`).join("");
    }catch(e){ $("#out").innerHTML=`<p class="center">Weather could not load. Check your internet.</p>`; }
  };
  $("#q").addEventListener("change",e=>{const c=find(list,e.target.value); if(c) show(c);});
  const pre = new URLSearchParams(location.search).get("country");
  if(pre){ $("#q").value=pre; const c=find(list,pre); if(c) show(c); }
}

/* ---------- TIME ---------- */
function offsetMin(tz){ const m = tz.match(/UTC([+-])(\d\d):(\d\d)/); return m ? (m[1]==="-"?-1:1)*(+m[2]*60+ +m[3]) : 0; }
let timer;
async function time(list){
  fillNames(list);
  const show = c => {
    $("#ttitle").textContent = `${c.name.common} (${c.timezones.length} time zone${c.timezones.length>1?"s":""})`;
    $("#out").innerHTML = c.timezones.map((tz,i)=>`<div class="card"><h3>🌐 ${tz}</h3><div class="clock" id="t${i}"></div><p id="d${i}"></p></div>`).join("");
    clearInterval(timer);
    const tick = () => c.timezones.forEach((tz,i)=>{
      const dt = new Date(Date.now()+offsetMin(tz)*60000);
      $("#t"+i).textContent = dt.toLocaleTimeString("en-US",{timeZone:"UTC"});
      $("#d"+i).textContent = dt.toLocaleDateString("en-US",{timeZone:"UTC",weekday:"long",day:"numeric",month:"long",year:"numeric"});
    });
    tick(); timer = setInterval(tick,1000);
  };
  $("#q").addEventListener("change",e=>{const c=find(list,e.target.value); if(c) show(c);});
  const pre = new URLSearchParams(location.search).get("country");
  if(pre){ $("#q").value=pre; const c=find(list,pre); if(c) show(c); }
}

/* ---------- START ---------- */
(async () => {
  shell();
  let list; try{ list = await getCountries(); }catch(e){ document.querySelector("main").insertAdjacentHTML("beforeend","<p class='center'>Could not load country data. Check your internet.</p>"); return; }
  ({home,continent,weather,time})[document.body.dataset.page](list);
})();