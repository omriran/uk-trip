import { useState, useEffect } from "react";

function useWikiPhoto(title, width = 900) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!title) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        const data = await res.json();
        const src = data?.thumbnail?.source;
        if (!src || cancelled) return;
        const imgRes = await fetch(src.replace(/\/\d+px-/, `/${width}px-`));
        if (!imgRes.ok || cancelled) return;
        const blob = await imgRes.blob();
        const reader = new FileReader();
        reader.onload = () => { if (!cancelled) setUrl(reader.result); };
        reader.readAsDataURL(blob);
      } catch {}
    }
    load();
    return () => { cancelled = true; };
  }, [title, width]);
  return url;
}

function WikiCover({ title, color, height = 180, children }) {
  const url = useWikiPhoto(title, 800);
  return (
    <div style={{ width: "100%", height, position: "relative", overflow: "hidden", background: color, flexShrink: 0 }}>
      {url && <img src={url} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "12px 14px" }}>
        {children}
      </div>
    </div>
  );
}

function WikiThumb({ title, color, flag }) {
  const url = useWikiPhoto(title, 200);
  return (
    <div style={{ width: 68, minHeight: 68, flexShrink: 0, position: "relative", overflow: "hidden", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {url
        ? <img src={url} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: 22, position: "relative" }}>{flag}</span>}
    </div>
  );
}

// ─── SHARED DAY CONTENT ───────────────────────────────────────────────────────

const DAYS = {
  peak_arrival: {
    date: "Tue 26 May", label: "Arrival", sub: "Leave LGW ~1pm · arrive ~3:30pm", transit: true,
    wikiThumb: "Dovedale",
    items: [
      { icon: "🥾", name: "Dovedale stepping stones & gorge", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Famous stepping stones across the River Dove into a narrow limestone gorge. Perfect arrival afternoon walk." },
    ],
    tip: "Dovedale is 20 min from Bakewell. The stepping stones get slippery — the 5-year-old will need a hand.",
  },
  peak_chatsworth: {
    date: "Wed 27 May", label: "Chatsworth & Monsal Trail", sub: "Estate grounds + old railway viaducts",
    wikiThumb: "Chatsworth House",
    items: [
      { icon: "👁", name: "Chatsworth House & garden grounds", tags: [{ l: "⏱ 2–3 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "One of England's great stately homes. Gardens and cascade fountain free without house entry. Farmyard and adventure playground excellent for all three kids." },
      { icon: "🥾", name: "Monsal Trail section", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Flat old railway line through limestone dales with dramatic viaducts. Hire bikes at Hassop Station." },
    ],
    tip: "Hassop Station bike hire includes tag-alongs. Even 30 min on the trail for the 5-year-old is great.",
  },
  peak_stanage: {
    date: "Thu 28 May", label: "Stanage Edge & Castleton", sub: "Gritstone ridge + show caves",
    wikiThumb: "Stanage Edge",
    items: [
      { icon: "🥾", name: "Stanage Edge ridge walk", tags: [{ l: "Moderate", c: "#b06820", b: "#fdefd8" }, { l: "⏱ 2 hrs", c: "#5a4e3e", b: "#f0ebe0" }], desc: "Most dramatic gritstone edge in England — 5-mile ridge with sweeping views. Older two will love scrambling the top." },
      { icon: "⚡", name: "Peak Cavern, Castleton", tags: [{ l: "⏱ 1 hr", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "UK's largest cave entrance. Guided tours through dramatic chambers — kids love it." },
    ],
    tip: "Pack up tonight — heading north tomorrow morning.",
  },
  lakes_arrival: (date) => ({
    date, label: "Arrival + Rydal Cave", sub: "Arrive lunchtime · afternoon walk", transit: true,
    wikiThumb: "Rydal Water",
    items: [
      { icon: "🥾", name: "Rydal Water & hidden cave", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Flat riverside path to a large quarry cave with a completely still underground lake inside. Eerie and brilliant — bring a torch." },
    ],
    tip: "Rydal Cave is often missed by tourists. Head upstream from Rydal Water on the south bank — not well signposted.",
  }),
  lakes_tarn: (date) => ({
    date, label: "Tarn Hows + Aira Force", sub: "Two best easy walks in the Lakes",
    wikiThumb: "Tarn Hows",
    items: [
      { icon: "🥾", name: "Tarn Hows circular", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Flat gravel path around a picture-perfect mountain tarn with Langdale Pikes views. The definitive easy Lakes walk." },
      { icon: "🥾", name: "Aira Force waterfall gorge", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Victorian stone bridges over a 20m waterfall in a steep wooded gorge. Short, dramatic and great for photos." },
    ],
    tip: "Pack up tonight — heading on to the next stop tomorrow morning.",
  }),
  lakes_langdale: (date) => ({
    date, label: "Great Langdale Valley", sub: "Flat valley under the Langdale Pikes",
    wikiThumb: "Langdale",
    items: [
      { icon: "🥾", name: "Langdale valley floor walk", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 2 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Flat valley path under the iconic Langdale Pikes — dramatic scenery with minimal effort. The Old Dungeon Ghyll pub at the head of the valley for lunch." },
    ],
    tip: "The Old Dungeon Ghyll is a classic walking pub. Arrive before noon to get a table.",
  }),
  edin_arrival: (date) => ({
    date, label: "Arrival + Holyrood Park", sub: "Arrive afternoon · evening walk", transit: true,
    wikiThumb: "Holyrood Park",
    items: [
      { icon: "🥾", name: "Holyrood Park lower loop", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1 hr", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Volcanic crags and lochs right in the city. Easy circuit around the base of Arthur's Seat." },
      { icon: "👁", name: "Royal Mile & Grassmarket", tags: [{ l: "⏱ 1 hr", c: "#5a4e3e", b: "#f0ebe0" }], desc: "Just walk it — no tickets needed. The medieval closes are perfect for curious kids. Grassmarket for dinner." },
    ],
    tip: "Park at the hotel and don't touch the car until you leave. Everything in the Old Town is walkable.",
  }),
  edin_arthur: (date) => ({
    date, label: "Arthur's Seat + Water of Leith", sub: "Full day · split-group morning",
    wikiThumb: "Arthur's Seat",
    items: [
      { icon: "🥾", name: "Arthur's Seat — summit (9 & 11 yr)", tags: [{ l: "Moderate", c: "#b06820", b: "#fdefd8" }, { l: "⏱ 2 hrs", c: "#5a4e3e", b: "#f0ebe0" }], desc: "251m volcanic summit. Steep final section but outstanding 360° views. One adult takes the older two." },
      { icon: "🥾", name: "Arthur's Seat — lower loop (5 yr)", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Wild crags and loch paths at the base. Regroup at St Margaret's Loch." },
      { icon: "🥾", name: "Water of Leith + Dean Village", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 2 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Flat riverside path through a gorge. Ends at Dean Village — hidden medieval mill village 5 min from Princes Street." },
    ],
    tip: "Split for Arthur's Seat in the morning, Water of Leith together in the afternoon. Pack up tonight.",
  }),
  fw_arrival: (date) => ({
    date, label: "Arrival", sub: "Via scenic drive · arrive afternoon", transit: true,
    wikiThumb: "Loch Lomond",
    items: [
      { icon: "👁", name: "Loch Lomond shore stop — Luss village", tags: [{ l: "⏱ 30 min", c: "#5a4e3e", b: "#f0ebe0" }, { l: "En route A82", c: "#7a6a5a", b: "#f4ede0" }], desc: "Pull over at Luss — 24 miles of loch with islands and mountains. Don't skip it." },
      { icon: "🥾", name: "Nevis Beach & Loch Linnhe foreshore", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 45 min", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Flat coastal arrival walk. Ben Nevis towers above the sea loch." },
    ],
    tip: "The A82 along Loch Lomond is slow but glorious — allow an extra 30 min. Stop at Luss village.",
  }),
  fw_glencoe: (date) => ({
    date, label: "Glencoe", sub: "Most dramatic valley in Britain · 15 min",
    wikiThumb: "Glencoe, Highland",
    items: [
      { icon: "🥾", name: "Signal Rock & ancient oak woodland", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Native oak forest on the valley floor. Waterfalls on three sides. Perfect for the 5-year-old." },
      { icon: "🥾", name: "Lost Valley / Coire Gabhail (9 & 11 yr)", tags: [{ l: "Challenging", c: "#c03030", b: "#fde8e8" }, { l: "⏱ 3 hrs", c: "#5a4e3e", b: "#f0ebe0" }], desc: "Hidden valley above a massive boulder gorge. The boulder scramble entrance is the standout hike of the trip for the older two." },
    ],
    tip: "The Lost Valley boulder field is genuinely exciting scrambling. Proper footwear essential.",
  }),
  fw_skye: (date) => ({
    date, label: "Isle of Skye — day trip", sub: "Leave 7:30am · back by 6–7pm",
    wikiThumb: "Fairy Pools",
    items: [
      { icon: "🥾", name: "Fairy Pools, Glen Brittle", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Crystal-clear glacial pools under the Cuillin mountains. The most magical place on the trip. Pack a towel — the kids will get in." },
      { icon: "🥾", name: "Talisker Bay beach", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1 hr", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Black volcanic sand, sea stacks, and a waterfall falling directly onto the beach. Otherworldly." },
      { icon: "👁", name: "Portree harbour — lunch", tags: [{ l: "⏱ 45 min", c: "#5a4e3e", b: "#f0ebe0" }], desc: "Coloured houses on the harbour. Fish and chips on the pier." },
    ],
    tip: "Leave 7:30am — Fairy Pools by 9:15am before tour buses arrive at 10am.",
  }),
  fw_steall: (date) => ({
    date, label: "Steall Falls & Nevis Gorge", sub: "10 minutes from the front door",
    wikiThumb: "An Steall",
    items: [
      { icon: "🥾", name: "Nevis Gorge + Steall Falls", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 2 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Flat path through ancient pine gorge → Scotland's second-highest waterfall (100m). Entirely flat and accessible." },
      { icon: "⚡", name: "Steall wire bridge", tags: [{ l: "⏱ 30 min", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo (with help)", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Three-wire bridge over the mountain river. Genuinely wobbly — every child loves it." },
    ],
    tip: "Park at the top of Glen Nevis road — 10 min from town. Flat gorge → 100m waterfall → wire bridge.",
  }),
  fw_locness: (date) => ({
    date, label: "Loch Ness day trip", sub: "Monster hunting · 1.5 hrs from base",
    wikiThumb: "Loch Ness",
    items: [
      { icon: "👁", name: "Urquhart Castle ruins", tags: [{ l: "⏱ 1 hr", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Dramatic medieval castle ruins on the Loch Ness shore — prime monster-spotting location." },
      { icon: "🥾", name: "Falls of Foyers", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1 hr", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "90m waterfall on the south shore — one of the highest in Britain." },
      { icon: "👁", name: "Invermoriston village", tags: [{ l: "⏱ 20 min", c: "#5a4e3e", b: "#f0ebe0" }], desc: "Tiny lochside village with a beautiful arched bridge. 5-min detour on A82." },
    ],
    tip: "Drive north shore (A82) out, south shore (B852) back — a full loch loop. Pack up tonight.",
  }),
  snow_arrival: (date) => ({
    date, label: "Arrival + Aberglaslyn Gorge", sub: "Arrive midday · afternoon walk", transit: true,
    wikiThumb: "Pass of Aberglaslyn",
    items: [
      { icon: "🥾", name: "Aberglaslyn Gorge — railway tunnels", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Old railway tunnels through the cliffside above a river gorge — you walk through the mountain. 15 min from base." },
      { icon: "👁", name: "Beddgelert village & Gelert's Grave", tags: [{ l: "⏱ 45 min", c: "#5a4e3e", b: "#f0ebe0" }], desc: "One of the prettiest villages in Wales. The legend of Gelert is a perfect story for the kids over dinner." },
    ],
    tip: "Aberglaslyn and Beddgelert are 1 mile apart, 15 min from base — easy arrival afternoon loop.",
  }),
  snow_snowdon: (date) => ({
    date, label: "Snowdon", sub: "Split group — summit + mountain railway",
    wikiThumb: "Snowdon",
    items: [
      { icon: "🥾", name: "Snowdon — Pyg Track (9 & 11 yr)", tags: [{ l: "Challenging", c: "#c03030", b: "#fde8e8" }, { l: "⏱ 4–5 hrs", c: "#5a4e3e", b: "#f0ebe0" }], desc: "Most direct summit route — rocky, steep near the top. One adult takes the older two from Pen-y-Pass." },
      { icon: "⚡", name: "Snowdon Mountain Railway (5 yr + adult)", tags: [{ l: "⏱ 2.5 hrs return", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }, { l: "Book ahead!", c: "#c03030", b: "#fde8e8" }], desc: "Victorian rack-and-pinion railway to 1085m. Other adult + 5-year-old take the train up and meet the hikers at the summit café." },
    ],
    tip: "Book the Mountain Railway weeks ahead — sells out fast in June. Use the Sherpa bus from Betws-y-Coed to Pen-y-Pass.",
  }),
  snow_idwal: (date) => ({
    date, label: "Cwm Idwal + North Coast", sub: "Glacial lake · then castle on the coast",
    wikiThumb: "Cwm Idwal",
    items: [
      { icon: "🥾", name: "Cwm Idwal hanging lake", tags: [{ l: "Easy", c: "#2d7a3e", b: "#e6f4ea" }, { l: "⏱ 2 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "✓ 5yo", c: "#2d7a3e", b: "#e6f4ea" }], desc: "Britain's first National Nature Reserve — a glacial lake in a dramatic rocky cwm. Well-surfaced path, genuinely spectacular." },
      { icon: "👁", name: "Conwy Castle & town walls", tags: [{ l: "⏱ 1 hr", c: "#5a4e3e", b: "#f0ebe0" }, { l: "30 min drive", c: "#7a6a5a", b: "#f4ede0" }], desc: "Intact 13th-century walls you can walk along. Kids run the battlements." },
    ],
    tip: "Cwm Idwal is 20 min from base off the A5 at Ogwen. Pack up tonight — Cotswolds and London tomorrow.",
  }),
  cotswolds_lunch: {
    date: "Thu 11 Jun", label: "Lunch stop — then London", sub: "~2.5 hrs from Snowdonia · ~1.5 hrs on to London", transit: true,
    wikiThumb: "Bourton-on-the-Water",
    items: [
      { icon: "👁", name: "Burford high street", tags: [{ l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }], desc: "Honey-stone buildings on a wide high street to the River Windrush. Relaxed, beautiful, directly on the A40." },
      { icon: "👁", name: "Bourton-on-the-Water (alternative)", tags: [{ l: "⏱ 1.5 hrs", c: "#5a4e3e", b: "#f0ebe0" }, { l: "15 min off A40", c: "#7a6a5a", b: "#f4ede0" }], desc: "The Windrush flows through the village at ankle depth — kids paddle in the main street. Magical final family moment." },
    ],
    tip: "Burford for a relaxed lunch. Bourton if the kids need one last magical stop. Both ~1.5 hrs from London after lunch.",
  },
};

// ─── PLAN DEFINITIONS ─────────────────────────────────────────────────────────

const PLAN_A = {
  id: "a",
  label: "Plan A",
  sublabel: "Lakes → Edinburgh → Highlands",
  color: "#2b4f80",
  stops: [
    {
      id: "peak", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", base: "Bakewell", region: "Peak District",
      dates: "Tue 26 – Fri 29 May", nights: 3, color: "#4a5a28", bg: "#f2f7e8",
      wikiCover: "Peak District",
      driveIn: "~2.5 hrs from LGW · M25 → M1 → A6",
      nightRating: "good", nightNote: "Tue/Wed/Thu — mid-week rates ✓",
      days: [DAYS.peak_arrival, DAYS.peak_chatsworth, DAYS.peak_stanage],
    },
    {
      id: "lakes_a", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", base: "Ambleside", region: "Lake District",
      dates: "Fri 29 – Sun 31 May", nights: 2, color: "#2b4f80", bg: "#eaf1fb",
      wikiCover: "Lake District",
      driveIn: "~2.5 hrs from Bakewell · A6 → M6 → A591",
      nightRating: "ok", nightNote: "Fri/Sat — weekend rates ⚠",
      days: [DAYS.lakes_arrival("Fri 29 May"), DAYS.lakes_tarn("Sat 30 May")],
    },
    {
      id: "edin_a", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", base: "Edinburgh", region: "Edinburgh",
      dates: "Sun 31 May – Tue 2 Jun", nights: 2, color: "#5c2d82", bg: "#f4ecfb",
      wikiCover: "Edinburgh Castle",
      driveIn: "~3 hrs from Ambleside · M6 → A74(M) → M74",
      nightRating: "ok", nightNote: "Sun/Mon — ok rates",
      days: [DAYS.edin_arrival("Sun 31 May"), DAYS.edin_arthur("Mon 1 Jun")],
    },
    {
      id: "fw_a", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", base: "Fort William", region: "Scottish Highlands",
      dates: "Tue 2 – Sun 7 Jun", nights: 5, color: "#2e2870", bg: "#eceaf8",
      wikiCover: "Glencoe, Highland",
      driveIn: "Check Google Maps · A82 via Loch Lomond recommended",
      nightRating: "good", nightNote: "Tue/Wed/Thu/Fri/Sat — 5 nights ✓",
      priority: true,
      days: [
        DAYS.fw_arrival("Tue 2 Jun"),
        DAYS.fw_glencoe("Wed 3 Jun"),
        DAYS.fw_skye("Thu 4 Jun"),
        DAYS.fw_steall("Fri 5 Jun"),
        DAYS.fw_locness("Sat 6 Jun"),
      ],
    },
    {
      id: "transit_a", flag: "🛣️", base: "Lake District", region: "Transit sleep",
      dates: "Sun 7 Jun", nights: 1, color: "#5a4a3a", bg: "#faf4ec",
      wikiCover: "Lake District",
      driveIn: "~3.5 hrs from Fort William · A82 → M74 → M6",
      nightRating: "neutral", nightNote: "Sun — transit only",
      transit: true,
      days: [{
        date: "Sun 7 Jun", label: "Drive south — transit sleep", sub: "Fort William → Lake District · ~3.5 hrs", transit: true,
        wikiThumb: "Tarn Hows",
        items: [],
        tip: "Leave Fort William by 9am, arrive Ambleside by 12:30pm. Tarn Hows is 20 min if the kids want one last walk. Drive to Snowdonia next morning (~3 hrs).",
      }],
    },
    {
      id: "snow_a", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", base: "Betws-y-Coed", region: "Snowdonia",
      dates: "Mon 8 – Thu 11 Jun", nights: 3, color: "#2a5c35", bg: "#eef7f0",
      wikiCover: "Snowdonia",
      driveIn: "~3 hrs from Lake District · M6 → A5",
      nightRating: "good", nightNote: "Mon/Tue/Wed — mid-week ✓",
      priority: true,
      days: [DAYS.snow_arrival("Mon 8 Jun"), DAYS.snow_snowdon("Tue 9 Jun"), DAYS.snow_idwal("Wed 10 Jun")],
    },
    {
      id: "cot_a", flag: "🌿", base: "Cotswolds", region: "Lunch stop",
      dates: "Thu 11 Jun", nights: 0, color: "#6a5a28", bg: "#faf6e8",
      wikiCover: "Cotswolds",
      driveIn: "~2.5 hrs from Betws-y-Coed · A5 → A44 → A40",
      nightRating: "neutral", nightNote: "Lunch stop only",
      lunch: true,
      days: [DAYS.cotswolds_lunch],
    },
  ],
};

const PLAN_B = {
  id: "b",
  label: "Plan B",
  sublabel: "Highlands → Edinburgh mid-week → Lakes",
  color: "#2e2870",
  stops: [
    {
      id: "peak_b", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", base: "Bakewell", region: "Peak District",
      dates: "Tue 26 – Fri 29 May", nights: 3, color: "#4a5a28", bg: "#f2f7e8",
      wikiCover: "Peak District",
      driveIn: "~2.5 hrs from LGW · M25 → M1 → A6",
      nightRating: "good", nightNote: "Tue/Wed/Thu — mid-week rates ✓",
      days: [DAYS.peak_arrival, DAYS.peak_chatsworth, DAYS.peak_stanage],
    },
    {
      id: "glasgow", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", base: "Glasgow / Loch Lomond", region: "Overnight split",
      dates: "Fri 29 May", nights: 1, color: "#3a5a6a", bg: "#eaf4f8",
      wikiCover: "Loch Lomond",
      driveIn: "~4 hrs from Bakewell · M6 → M74 → Glasgow",
      nightRating: "neutral", nightNote: "Fri — drive split only",
      transit: true,
      days: [{
        date: "Fri 29 May", label: "Drive north — overnight Glasgow", sub: "Bakewell → Glasgow · ~4 hrs", transit: true,
        wikiThumb: "Loch Lomond",
        items: [
          { icon: "👁", name: "Loch Lomond south shore (optional)", tags: [{ l: "⏱ 30 min", c: "#5a4e3e", b: "#f0ebe0" }, { l: "En route", c: "#7a6a5a", b: "#f4ede0" }], desc: "Balloch or Luss on the south shore is just off the M8/A82. Good teaser for tomorrow's full drive along the loch." },
        ],
        tip: "Leave Bakewell by 8am, in Glasgow by noon. The A82 north from Glasgow tomorrow is spectacular — allows for a relaxed morning start.",
      }],
    },
    {
      id: "fw_b", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", base: "Fort William", region: "Scottish Highlands",
      dates: "Sat 30 May – Wed 3 Jun", nights: 4, color: "#2e2870", bg: "#eceaf8",
      wikiCover: "Glencoe, Highland",
      driveIn: "~1.5 hrs from Glasgow · A82 north along Loch Lomond",
      nightRating: "ok", nightNote: "Sat/Sun/Mon/Tue — 4 nights (1 fewer than Plan A)",
      priority: true,
      days: [
        DAYS.fw_arrival("Sat 30 May"),
        DAYS.fw_glencoe("Sun 31 May"),
        DAYS.fw_skye("Mon 1 Jun"),
        DAYS.fw_steall("Tue 2 Jun"),
      ],
    },
    {
      id: "edin_b", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", base: "Edinburgh", region: "Edinburgh",
      dates: "Wed 3 – Fri 5 Jun", nights: 2, color: "#5c2d82", bg: "#f4ecfb",
      wikiCover: "Edinburgh Castle",
      driveIn: "Check Google Maps from Fort William · A82 or A9 via Pitlochry",
      nightRating: "best", nightNote: "Wed/Thu — cheapest mid-week rates ✓✓",
      midweek: true,
      days: [DAYS.edin_arrival("Wed 3 Jun"), DAYS.edin_arthur("Thu 4 Jun")],
    },
    {
      id: "lakes_b", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", base: "Ambleside", region: "Lake District",
      dates: "Fri 5 – Mon 8 Jun", nights: 3, color: "#2b4f80", bg: "#eaf1fb",
      wikiCover: "Lake District",
      driveIn: "~3 hrs from Edinburgh · A74(M) → M6 → A591",
      nightRating: "ok", nightNote: "Fri/Sat/Sun — weekend rates ⚠ (but 3 nights vs 2)",
      days: [
        DAYS.lakes_arrival("Fri 5 Jun"),
        DAYS.lakes_tarn("Sat 6 Jun"),
        DAYS.lakes_langdale("Sun 7 Jun"),
      ],
    },
    {
      id: "snow_b", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", base: "Betws-y-Coed", region: "Snowdonia",
      dates: "Mon 8 – Thu 11 Jun", nights: 3, color: "#2a5c35", bg: "#eef7f0",
      wikiCover: "Snowdonia",
      driveIn: "~3 hrs from Ambleside · M6 → A5",
      nightRating: "good", nightNote: "Mon/Tue/Wed — mid-week ✓",
      priority: true,
      days: [DAYS.snow_arrival("Mon 8 Jun"), DAYS.snow_snowdon("Tue 9 Jun"), DAYS.snow_idwal("Wed 10 Jun")],
    },
    {
      id: "cot_b", flag: "🌿", base: "Cotswolds", region: "Lunch stop",
      dates: "Thu 11 Jun", nights: 0, color: "#6a5a28", bg: "#faf6e8",
      wikiCover: "Cotswolds",
      driveIn: "~2.5 hrs from Betws-y-Coed · A5 → A44 → A40",
      nightRating: "neutral", nightNote: "Lunch stop only",
      lunch: true,
      days: [DAYS.cotswolds_lunch],
    },
  ],
};

const RATING_STYLE = {
  best:    { bg: "#e6f7ec", color: "#1a7a3a", icon: "✓✓" },
  good:    { bg: "#eef7f0", color: "#2a6a3a", icon: "✓" },
  ok:      { bg: "#fdf5e0", color: "#9a6010", icon: "~" },
  neutral: { bg: "#f4f0ea", color: "#7a6a5a", icon: "—" },
};

// ─── STOP CARD ────────────────────────────────────────────────────────────────

function StopCard({ stop, planColor }) {
  const [open, setOpen] = useState(null);
  const rs = RATING_STYLE[stop.nightRating] || RATING_STYLE.neutral;

  return (
    <div style={{ border: `1px solid ${stop.color}30`, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
      <WikiCover title={stop.wikiCover} color={stop.color} height={130}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          {stop.flag} {stop.base}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
          {stop.region}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          {stop.nights > 0 && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 3, background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>{stop.nights}N · {stop.dates}</span>}
          {stop.nights === 0 && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 3, background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>🍽 {stop.dates}</span>}
          {stop.priority && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 3, background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,220,80,0.4)", color: "#ffe080" }}>⭐ priority</span>}
          {stop.midweek && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 3, background: "rgba(80,0,160,0.5)", border: "1px solid rgba(200,150,255,0.5)", color: "#e0c0ff" }}>★ mid-week</span>}
          {stop.transit && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 3, background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}>🛣 transit</span>}
        </div>
      </WikiCover>

      {/* Rate bar */}
      <div style={{ background: rs.bg, borderBottom: `1px solid ${stop.color}20`, padding: "7px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: stop.color, fontWeight: 600 }}>🚗 {stop.driveIn}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: rs.color, background: rs.bg, padding: "2px 7px", borderRadius: 3, border: `1px solid ${rs.color}30` }}>{rs.icon} {stop.nightNote}</div>
      </div>

      {/* Day rows */}
      <div>
        {stop.days.map((day, di) => {
          const key = `${stop.id}-${di}`;
          const isOn = open === key;
          const count = day.items?.length || 0;
          return (
            <div key={key} style={{ borderBottom: di < stop.days.length - 1 ? "1px solid #ece4d8" : "none" }}>
              <div
                style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", alignItems: "stretch", cursor: "pointer", background: isOn ? stop.bg : "#fff", transition: "background 0.15s" }}
                onClick={() => setOpen(isOn ? null : key)}
              >
                <WikiThumb title={day.wikiThumb} color={stop.color + "88"} flag={stop.flag} />
                <div style={{ padding: "9px 11px" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#a09080", marginBottom: 1 }}>{day.date}</div>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 600, color: isOn ? stop.color : "#1a2a1e", lineHeight: 1.2 }}>{day.label}</div>
                  {day.sub && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#7b6e5e", marginTop: 1 }}>{day.sub}</div>}
                </div>
                <div style={{ padding: "9px 9px 9px 4px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 3 }}>
                  {day.transit && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 3, background: "#f4ede0", color: "#7a5a30", border: "1px solid #d8c09c" }}>🚗</span>}
                  {count > 0 && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: stop.bg, color: stop.color, border: `1px solid ${stop.color}35` }}>{count}</span>}
                  <span style={{ fontSize: 8, color: "#b0a090" }}>{isOn ? "▲" : "▼"}</span>
                </div>
              </div>

              {isOn && (
                <div style={{ borderTop: "1px solid #ece4d8", background: "#fdfaf4", padding: "11px 13px 13px" }}>
                  {count > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 10 }}>
                      {day.items.map((item, ii) => (
                        <div key={ii} style={{ background: "#fff", border: "1px solid #e4dcd0", borderLeft: `3px solid ${item.tags?.[0]?.c || stop.color}`, borderRadius: "0 4px 4px 0", padding: "10px 12px" }}>
                          <div style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                            <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
                            <span style={{ fontFamily: "'Lora', serif", fontSize: 14, fontWeight: 600, color: "#1a2a1e", lineHeight: 1.25 }}>{item.name}</span>
                          </div>
                          {item.tags?.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 5 }}>
                              {item.tags.map((t, ti) => <span key={ti} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 2, background: t.b, color: t.c }}>{t.l}</span>)}
                            </div>
                          )}
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#4a3e30", lineHeight: 1.65 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ background: "#fffcf4", border: "1px solid #e8d9a0", borderLeft: "3px solid #c8a030", borderRadius: "0 4px 4px 0", padding: "9px 12px" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#c8a030", marginBottom: 3 }}>Tip</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#4a3e30", lineHeight: 1.65 }}>{day.tip}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("compare"); // "compare" | "a" | "b"

  const CompareRow = ({ label, a, b, highlight }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, borderBottom: "1px solid #ece4d8" }}>
      <div style={{ padding: "8px 12px", background: highlight === "a" ? "#eef7f0" : "#fdfaf8", borderRight: "1px solid #ece4d8" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Plan A</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3a3028", lineHeight: 1.4 }}>{a}</div>
      </div>
      <div style={{ padding: "8px 12px", background: highlight === "b" ? "#eef7f0" : "#fdfaf8" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Plan B</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3a3028", lineHeight: 1.4 }}>{b}</div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f5f0e6", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* HERO */}
      <div style={{ background: "#141e16", padding: "32px 20px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(90,171,111,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: "#5aab6f", marginBottom: 8 }}>UK Family Road Trip · Two Plans Compared</div>
        <div style={{ fontFamily: "'Lora', serif", fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 700, lineHeight: 0.95, color: "#f0ebe0", marginBottom: 8 }}>Wild<br /><i style={{ fontStyle: "italic", color: "#8dd4a0" }}>Britain</i></div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(240,235,224,0.45)", marginBottom: 16 }}>Tue 26 May – Thu 11 Jun 2026 · Kids 5, 9 & 11 · 16 nights</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            { l: "Plan A: Lakes → Edinburgh → Highlands", c: false },
            { l: "Plan B: Highlands → Edinburgh mid-week → Lakes", c: true },
          ].map((t, i) => (
            <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, padding: "4px 11px", borderRadius: 3, background: t.c ? "rgba(90,171,111,0.1)" : "rgba(255,255,255,0.06)", border: `1px solid ${t.c ? "rgba(90,171,111,0.28)" : "rgba(255,255,255,0.1)"}`, color: t.c ? "#8dd4a0" : "rgba(240,235,224,0.6)" }}>{t.l}</span>
          ))}
        </div>
      </div>

      {/* VIEW TABS */}
      <div style={{ background: "#fff", borderBottom: "2px solid #e2d8cc", display: "flex", padding: "0 16px" }}>
        {[{ k: "compare", l: "⚖ Compare" }, { k: "a", l: "Plan A detail" }, { k: "b", l: "Plan B detail" }].map(t => (
          <button key={t.k} onClick={() => setView(t.k)} style={{ background: "none", border: "none", cursor: "pointer", padding: "13px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: view === t.k ? "#2a5c35" : "#9b8e7e", borderBottom: `2px solid ${view === t.k ? "#2a5c35" : "transparent"}`, marginBottom: -2, whiteSpace: "nowrap" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* COMPARE VIEW */}
      {view === "compare" && (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 14px 60px" }}>

          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[PLAN_A, PLAN_B].map(p => (
              <div key={p.id} style={{ background: "#fff", border: `2px solid ${p.color}40`, borderRadius: 8, padding: "14px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700, color: p.color }}>{p.label}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#7a6a5a", marginTop: 3, lineHeight: 1.4 }}>{p.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div style={{ background: "#fff", border: "1px solid #e2d8cc", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
            {/* Label header */}
            <div style={{ background: "#f5f0e6", padding: "8px 12px", borderBottom: "1px solid #e2d8cc" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#7a6a5a" }}>Key differences</div>
            </div>

            {[
              { label: "Edinburgh", a: "Sun 31 May – Tue 2 Jun\nSun/Mon nights — OK rates", b: "Wed 3 – Fri 5 Jun\nWed/Thu nights — cheapest mid-week ✓✓", highlight: "b" },
              { label: "Fort William", a: "Tue 2 – Sun 7 Jun\n5 nights — 1 more Highlands day", b: "Sat 30 May – Wed 3 Jun\n4 nights — 1 fewer day", highlight: "a" },
              { label: "Lake District", a: "Fri 29 May (2N going north)\n+ Sun 7 Jun (1N transit south)\n= 3 total but split, 2nd is transit", b: "Fri 5 – Mon 8 Jun\n3 proper nights together ✓\n(weekend rates ⚠)", highlight: "b" },
              { label: "Drive split north", a: "No overnight split needed\nDrive Peak → Lakes (2.5 hrs)\nthen Lakes → Edinburgh (3 hrs)", b: "Glasgow overnight Fri 29 May\nPeak → Glasgow (4 hrs)\nthen Glasgow → Fort William (1.5 hrs)", highlight: "a" },
              { label: "Snowdonia", a: "Mon 8 – Thu 11 Jun\n3 nights Mon/Tue/Wed ✓", b: "Mon 8 – Thu 11 Jun\n3 nights Mon/Tue/Wed ✓", highlight: null },
              { label: "Weekend nights paid", a: "Fri/Sat (Lakes) + 1 Sat (FW)\n= ~3 weekend nights", b: "Fri/Sat/Sun (Lakes) + Sat/Sun (FW)\n= ~5 weekend nights", highlight: "a" },
              { label: "Route logic", a: "Clean loop north then back.\nLakes used twice but different purpose.", b: "Logical geography — Highlands\nthen wind down south via Edinburgh.", highlight: null },
            ].map((row, i) => (
              <div key={i}>
                <div style={{ background: "#f9f5ef", padding: "6px 12px", borderBottom: "1px solid #ece4d8" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#6a5a4a" }}>{row.label}</div>
                </div>
                <CompareRow a={row.a} b={row.b} highlight={row.highlight} />
              </div>
            ))}
          </div>

          {/* Route sequences */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[PLAN_A, PLAN_B].map(plan => (
              <div key={plan.id} style={{ background: "#fff", border: `1px solid ${plan.color}30`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ background: plan.color, padding: "10px 12px" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#fff" }}>{plan.label} · Route order</div>
                </div>
                {plan.stops.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderBottom: i < plan.stops.length - 1 ? "1px solid #ece4d8" : "none" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{s.flag}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: s.color }}>{s.base}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#9a8a7a" }}>{s.nights > 0 ? `${s.nights}N · ${s.dates}` : s.dates}</div>
                    </div>
                    {s.priority && <span style={{ fontSize: 12 }}>⭐</span>}
                    {s.midweek && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 3, background: "#f0e8ff", color: "#7040b0" }}>MW</span>}
                    {(() => { const rs = RATING_STYLE[s.nightRating || "neutral"]; return <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: rs.bg, color: rs.color }}>{rs.icon}</span>; })()}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", padding: "20px 0 0", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9b8e7e" }}>
            Switch to <strong>Plan A detail</strong> or <strong>Plan B detail</strong> above to see the full day-by-day itinerary with photos
          </div>
        </div>
      )}

      {/* PLAN DETAIL VIEWS */}
      {(view === "a" || view === "b") && (() => {
        const plan = view === "a" ? PLAN_A : PLAN_B;
        return (
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 14px 60px" }}>
            <div style={{ background: plan.color, borderRadius: 8, padding: "14px 16px", marginBottom: 14, textAlign: "center" }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>{plan.label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{plan.sublabel}</div>
            </div>
            {plan.stops.map(stop => <StopCard key={stop.id} stop={stop} planColor={plan.color} />)}
          </div>
        );
      })()}

      <div style={{ textAlign: "center", padding: "0 16px 28px", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#b0a490" }}>
        Tap any day card to expand · All dates from Tue 26 May 2026
      </div>
    </div>
  );
}
