// Expands the hand-recorded per-look visual observations (pose/framing + setting/light,
// plus men footwear/accessories seen in the labelled contact sheets) into
// src/data/look-details-visual.json, consumed by build-look-details.mjs.
// Observations come from viewing every men-01..10 + women-01..12 montage tile.
// NOTHING invented: only what is visible in each approved reference image is recorded;
// where a field is not visible the entry is omitted so build-look-details applies an honest fallback.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const POSE = {
  F: 'Standing · full-body',
  T: 'Standing · three-quarter',
  M: 'Standing · mid-length',
  S: 'Seated · mid-length',
  W: 'Walking · full-body',
};
const SET = {
  i: 'Indoor · warm lighting',
  u: 'Studio · soft diffused lighting',
  w: 'Studio · warm lighting',
  o: 'Outdoor · natural daylight',
  n: 'Outdoor festive · warm night lighting',
  p: 'Heritage/palace setting · warm lighting',
};

function poseText(code) {
  const mirror = code.endsWith('s');
  const base = mirror ? code.slice(0, -1) : code;
  let t = POSE[base];
  if (!t) throw new Error('bad pose code ' + code);
  if (mirror) t += ' (mirror selfie)';
  return t;
}

// ---- MEN: "NNN pose setting [SG] [WA] [foot:TEXT]" ----
const MEN = `
001 Ts i
002 Ts i
003 F i
004 T n
005 T n
006 T n
007 F i
008 T n
009 F o SG
010 Ts i SG
011 M i
012 Fs i SG
013 F i
014 T n SG
015 Ts i
016 F i
017 F o
018 T n
019 F i
020 M u
021 Fs i
022 Fs i
023 F i
024 F o foot:White sneakers
025 M u
026 S i
027 F n
028 T o WA
029 T n SG
030 F i
031 S o
032 F o
033 F w
034 F o
035 T n
036 S o foot:White shoes
037 F i
038 F o
039 T n
040 F i
041 M u
042 S o
043 F i
044 F o
045 F i
046 S i
047 Fs i
048 F o
049 M i
050 W i
051 Fs i
052 F o
053 F i
054 F i
055 S i
056 F o
057 Fs i foot:Black shoes
058 F o SG
059 F p
060 Fs i
061 F o
062 F o foot:Loafers
063 T o
064 F n
065 M i foot:Black shoes
066 F n
067 F o
068 Fs i
069 F i SG
070 F n
071 F o foot:Black shoes
072 F u
073 F p SG
074 F n
075 T u
076 F i SG
077 Fs i
078 F i
079 F o
080 F o
081 F o
082 M i
083 F i
084 F i
085 F i
086 Fs i
087 F o SG
088 F n
089 F o foot:Black shoes
090 F o
091 F p
092 F n
093 Fs i foot:Brown shoes
094 Fs i
095 F o
096 F o SG foot:Loafers
097 F i
098 F i
099 F o
100 F n
101 F i foot:Black shoes
102 F o
103 F i
104 F u
105 F n
106 F n
107 W n
108 F p
109 F o SG
110 F n
111 F o foot:Brown shoes
112 F p
113 F n
114 F i
115 Fs i foot:Brown loafers
116 T u
117 F i
118 M i
119 M o
120 F i
121 F n
122 F o foot:Sandals
123 T u
124 F n
125 F p
126 F w
127 F i
128 S i
129 F n foot:Brown shoes
130 F o
131 F o SG foot:Sandals
132 F i
133 F u
134 F u
135 F o SG
136 F o SG
137 F i SG
138 F o
139 S i
140 M u
141 F o SG foot:Brown shoes
142 F i
143 F i
144 T u
145 F u SG
146 F u foot:Beige shoes
147 F o
148 F i
149 F i foot:Brown shoes
150 F p
151 F n foot:Brown shoes
152 F i
153 F o SG
154 Fs i
155 F o SG foot:Loafers
156 F o
157 F o
158 F i foot:Sandals
159 F u
160 F o SG
161 F i
162 F o SG
163 F i
164 F o
165 F i
166 F o
167 F o foot:Sandals
168 F i
169 F w
170 Fs i
171 Fs i
172 F w
173 F u
174 S i
175 F p
176 F u
177 Fs i
178 F u
179 F i
180 F w
181 F u
182 F p
183 F i
184 F p foot:Brown shoes
185 F o
186 Ts i
187 F p
188 F o
189 Fs i
190 F u
191 Fs i
192 F o SG
193 F p
194 F u
195 Fs i
196 F p
197 F i WA
198 W o
199 M u
200 F u SG
201 F w
202 F u SG
203 F o
204 F u
205 F u
206 F p SG
207 F p
208 F w
209 F o SG
210 F o
`;

// ---- WOMEN: every look is Standing · full-body (except 077 walking). Setting per tile. ----
// Built from per-occasion default + explicit deviations observed in the labelled tiles.
const WOMEN_RANGES = [
  [1, 68, 'p'],     // Garba: heritage/palace courtyards, warm
  [69, 110, 'o'],   // College Fest: mostly outdoor natural daylight
  [111, 152, 'i'],  // Diwali: indoor warm diya-lit
  [153, 194, 'i'],  // Festive Party: indoor warm chandelier/evening
  [195, 236, 'p'],  // Traditional: palace/haveli, warm
];
const WOMEN_EXC = {
  // Garba deviations
  4: 'n', 9: 'n', 11: 'i', 13: 'n', 14: 'n', 17: 'o', 18: 'n', 19: 'i', 20: 'i',
  25: 'n', 26: 'n', 30: 'o', 32: 'i', 34: 'o', 36: 'o', 38: 'n', 39: 'i', 40: 'i',
  41: 'n', 42: 'u', 43: 'i', 47: 'n', 50: 'o', 56: 'n', 63: 'i', 66: 'i',
  // College Fest deviations
  71: 'p', 75: 'i', 76: 'p', 80: 'u', 82: 'p', 84: 'p', 85: 'p', 86: 'p', 87: 'p',
  88: 'i', 90: 'p', 91: 'p', 92: 'p', 94: 'p', 96: 'i', 97: 'p', 98: 'p', 99: 'p',
  100: 'p', 101: 'p', 102: 'p', 103: 'i', 104: 'i', 105: 'p',
  // Diwali deviations
  123: 'o',
  // Festive Party deviations
  153: 'o', 156: 'o', 158: 'u', 171: 'p', 174: 'p', 176: 'p', 179: 'p', 180: 'p',
  183: 'p', 184: 'p', 186: 'p', 187: 'u', 192: 'p', 194: 'p',
  // Traditional deviations
  196: 'i', 199: 'u', 201: 'i', 203: 'i', 205: 'o', 209: 'i', 211: 'i', 214: 'i',
  217: 'i', 226: 'i', 235: 'o',
};
const WSET = [];
for (const [a, b, d] of WOMEN_RANGES) for (let n = a; n <= b; n++) WSET[n] = WOMEN_EXC[n] || d;
// handbags clearly visible in these women tiles
const WOMEN_BAG = new Set([73, 89, 102, 105, 155, 196, 214, 231]);
const WOMEN_WALK = new Set([77]);

const men = {};
for (const line of MEN.trim().split('\n')) {
  const t = line.trim().split(/\s+/);
  const id = 'men-look-' + t[0];
  const rec = { poseFraming: poseText(t[1]), settingLight: SET[t[2]] };
  const acc = [];
  for (let i = 3; i < t.length; i++) {
    if (t[i] === 'SG') acc.push('Sunglasses');
    else if (t[i] === 'WA') acc.push('Watch');
    else if (t[i].startsWith('foot:')) rec.footwear = t.slice(i).join(' ').replace(/^foot:/, '').replace(/\s+SG|\s+WA/g, '').trim();
  }
  if (acc.length) rec.accessories = acc.join(' · ');
  men[id] = rec;
}

const women = {};
for (let n = 1; n <= 236; n++) {
  const code = WSET[n];
  if (!code || !SET[code]) throw new Error('women bad setting for ' + n + ': ' + code);
  const id = 'women-look-' + String(n).padStart(3, '0');
  const rec = {
    poseFraming: WOMEN_WALK.has(n) ? POSE.W : POSE.F,
    settingLight: SET[code],
  };
  if (WOMEN_BAG.has(n)) rec.accessories = 'Handbag';
  women[id] = rec;
}

const out = { men, women };
fs.writeFileSync(path.join(ROOT, 'src/data/look-details-visual.json'), JSON.stringify(out, null, 2));
console.log('men entries:', Object.keys(men).length, 'women entries:', Object.keys(women).length);
const badM = Object.values(men).filter((r) => !r.poseFraming || !r.settingLight).length;
const badW = Object.values(women).filter((r) => !r.poseFraming || !r.settingLight).length;
console.log('men missing pose/set:', badM, 'women missing pose/set:', badW);
