// Symbol, name, atomic mass — listed in order of atomic number (1–118)
const DATA = `H Hydrogen 1.008,He Helium 4.0026,Li Lithium 6.94,Be Beryllium 9.0122,B Boron 10.81,C Carbon 12.011,N Nitrogen 14.007,O Oxygen 15.999,F Fluorine 18.998,Ne Neon 20.180,Na Sodium 22.990,Mg Magnesium 24.305,Al Aluminium 26.982,Si Silicon 28.085,P Phosphorus 30.974,S Sulfur 32.06,Cl Chlorine 35.45,Ar Argon 39.948,K Potassium 39.098,Ca Calcium 40.078,Sc Scandium 44.956,Ti Titanium 47.867,V Vanadium 50.942,Cr Chromium 51.996,Mn Manganese 54.938,Fe Iron 55.845,Co Cobalt 58.933,Ni Nickel 58.693,Cu Copper 63.546,Zn Zinc 65.38,Ga Gallium 69.723,Ge Germanium 72.630,As Arsenic 74.922,Se Selenium 78.971,Br Bromine 79.904,Kr Krypton 83.798,Rb Rubidium 85.468,Sr Strontium 87.62,Y Yttrium 88.906,Zr Zirconium 91.224,Nb Niobium 92.906,Mo Molybdenum 95.95,Tc Technetium 98,Ru Ruthenium 101.07,Rh Rhodium 102.91,Pd Palladium 106.42,Ag Silver 107.87,Cd Cadmium 112.41,In Indium 114.82,Sn Tin 118.71,Sb Antimony 121.76,Te Tellurium 127.60,I Iodine 126.90,Xe Xenon 131.29,Cs Caesium 132.91,Ba Barium 137.33,La Lanthanum 138.91,Ce Cerium 140.12,Pr Praseodymium 140.91,Nd Neodymium 144.24,Pm Promethium 145,Sm Samarium 150.36,Eu Europium 151.96,Gd Gadolinium 157.25,Tb Terbium 158.93,Dy Dysprosium 162.50,Ho Holmium 164.93,Er Erbium 167.26,Tm Thulium 168.93,Yb Ytterbium 173.05,Lu Lutetium 174.97,Hf Hafnium 178.49,Ta Tantalum 180.95,W Tungsten 183.84,Re Rhenium 186.21,Os Osmium 190.23,Ir Iridium 192.22,Pt Platinum 195.08,Au Gold 196.97,Hg Mercury 200.59,Tl Thallium 204.38,Pb Lead 207.2,Bi Bismuth 208.98,Po Polonium 209,At Astatine 210,Rn Radon 222,Fr Francium 223,Ra Radium 226,Ac Actinium 227,Th Thorium 232.04,Pa Protactinium 231.04,U Uranium 238.03,Np Neptunium 237,Pu Plutonium 244,Am Americium 243,Cm Curium 247,Bk Berkelium 247,Cf Californium 251,Es Einsteinium 252,Fm Fermium 257,Md Mendelevium 258,No Nobelium 259,Lr Lawrencium 266,Rf Rutherfordium 267,Db Dubnium 268,Sg Seaborgium 269,Bh Bohrium 270,Hs Hassium 277,Mt Meitnerium 278,Ds Darmstadtium 281,Rg Roentgenium 282,Cn Copernicium 285,Nh Nihonium 286,Fl Flerovium 289,Mc Moscovium 290,Lv Livermorium 293,Ts Tennessine 294,Og Oganesson 294`;

const CATEGORIES = {
  alkali: ["Alkali metal", [3, 11, 19, 37, 55, 87]],
  alkaline: ["Alkaline earth metal", [4, 12, 20, 38, 56, 88]],
  transition: ["Transition metal", [...range(21, 30), ...range(39, 48), ...range(72, 80), ...range(104, 112)]],
  post: ["Post-transition metal", [13, 31, 49, 50, 81, 82, 83, 84, ...range(113, 116)]],
  metalloid: ["Metalloid", [5, 14, 32, 33, 51, 52]],
  nonmetal: ["Reactive nonmetal", [1, 6, 7, 8, 15, 16, 34]],
  halogen: ["Halogen", [9, 17, 35, 53, 85, 117]],
  noble: ["Noble gas", [2, 10, 18, 36, 54, 86, 118]],
  lanthanide: ["Lanthanide", range(57, 71)],
  actinide: ["Actinide", range(89, 103)],
};
const GASES = [1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86];
const LIQUIDS = [35, 80];

function range(a, b) { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; }

// Work out grid position (row, column), group and period from the atomic number
function position(z) {
  if (z === 1) return { row: 1, col: 1, period: 1 };
  if (z === 2) return { row: 1, col: 18, period: 1 };
  const periods = [[3, 10, 2, 0], [11, 18, 3, 0], [19, 36, 4, 0], [37, 54, 5, 0], [55, 86, 6, 0], [87, 118, 7, 0]];
  const [start, , period] = periods.find(([a, b]) => z >= a && z <= b);
  const i = z - start;
  if (period <= 3) return { row: period, col: i < 2 ? i + 1 : i + 11, period };
  if (period <= 5) return { row: period, col: i + 1, period };
  const f = period === 6 ? [57, 71] : [89, 103];
  if (z >= f[0] && z <= f[1]) return { row: period + 3, col: z - f[0] + 3, period, f: true };
  const after = z > f[1] ? z - f[1] + 3 : i + 1;
  return { row: period, col: after, period };
}

const ELEMENTS = DATA.split(",").map((s, i) => {
  const [symbol, name, mass] = s.split(" ");
  const z = i + 1;
  const cat = Object.keys(CATEGORIES).find(k => CATEGORIES[k][1].includes(z));
  const pos = position(z);
  const block = pos.f ? "f" : pos.col <= 2 ? "s" : pos.col >= 13 ? "p" : "d";
  const state = GASES.includes(z) ? "Gas" : LIQUIDS.includes(z) ? "Liquid" : z >= 104 ? "Unknown" : "Solid";
  return { z, symbol, name, mass, cat, block, state, ...pos, group: pos.f ? "—" : pos.col };
});

const table = document.getElementById("table");
const info = document.getElementById("info");

ELEMENTS.forEach(e => {
  const b = document.createElement("button");
  b.className = `el ${e.cat}`;
  b.style.gridRow = e.row;
  b.style.gridColumn = e.col;
  b.innerHTML = `<span class="n">${e.z}</span><span class="s">${e.symbol}</span><span class="m">${e.name}</span>`;
  b.title = e.name;
  b.addEventListener("click", () => showInfo(e));
  table.appendChild(b);
});

function showInfo(e) {
  info.innerHTML = `
    <h2>${e.name} (${e.symbol})</h2>
    <dl>
      <dt>Atomic number</dt><dd>${e.z}</dd>
      <dt>Atomic mass</dt><dd>${e.mass}</dd>
      <dt>Category</dt><dd>${CATEGORIES[e.cat][0]}</dd>
      <dt>State (room temp.)</dt><dd>${e.state}</dd>
      <dt>Group</dt><dd>${e.group}</dd>
      <dt>Period</dt><dd>${e.period}</dd>
      <dt>Block</dt><dd>${e.block}</dd>
      <dt>Symbol</dt><dd>${e.symbol}</dd>
    </dl>`;
}

// Legend
const legend = document.getElementById("legend");
Object.entries(CATEGORIES).forEach(([k, [label]]) => {
  const s = document.createElement("span");
  s.textContent = label;
  s.style.setProperty("--c", getComputedStyle(document.documentElement).getPropertyValue(`--${k}`));
  legend.appendChild(s);
});