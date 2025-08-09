// backend/utils/buildPrompt.js
const L = (a) => a.map((s) => s.toLowerCase());

// lexicons
const STYLES = L([
  "streetwear","hip hop","urban","minimalist","vintage","casual","formal","smart casual",
  "preppy","boho","sporty","y2k","techwear","grunge","avant garde","high fashion"
]);
const ITEMS = L([
  "baggy jeans","wide-leg jeans","cargo pants","hoodie","crewneck","bomber jacket","leather jacket",
  "trench coat","blazer","jersey","basketball jersey","denim jacket","sweater vest","tracksuit",
  "puffer jacket","cardigan","oversized tee","button up","bomber","ballet flats","crop top"
]);
const SHOES = L([
  "air jordan","jordan 1","jordan 4","jordan","nike dunk","air force 1","samba","gazelle",
  "new balance","converse","doc martens","timberland","yeezy"
]);
const BRANDS = L([
  "maison margiela","margiela","rick owens","acne studios","off white","balenciaga","celine",
  "prada","gucci","saint laurent","dior","loewe","stone island","ami","fear of god"
]);
const COLORS = L([
  "black","white","gray","grey","red","orange","yellow","green","turquoise","blue","violet",
  "purple","pink","brown","beige","tan","cream","navy","burgundy","teal"
]);

// quick fuzzy: matches words/phrases even with plural/small typos
function fuzzyHas(text, phrase) {
  const p = phrase.replace(/\s+/g, "\\s+");
  return new RegExp(`\\b${p}s?\\b`, "i").test(text);
}

export default function buildPrompt({ answers = [], hint = "" }) {
  const raw = [answers?.[0]?.answer, answers?.[1]?.answer, answers?.[2]?.answer, hint]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const tags = new Set();
  let chosenColor = null;

  // styles
  STYLES.forEach((s) => { if (fuzzyHas(raw, s)) tags.add(s); });
  // items
  ITEMS.forEach((s) => { if (fuzzyHas(raw, s)) tags.add(s); });
  // shoes (collapse variants)
  SHOES.forEach((s) => { if (fuzzyHas(raw, s)) tags.add(s); });
  // brands
  BRANDS.forEach((s) => { if (fuzzyHas(raw, s)) tags.add(s); });

  // normalize some aliases → stronger tags
  if (/\bhip[-\s]?hop\b|urban\b/.test(raw)) tags.add("streetwear").add("hip hop");
  if (/jordan|aj1|air jordan/.test(raw)) tags.add("air jordan").add("nike sneakers");
  if (/basketball\s*jersey|vintage\s*jersey/.test(raw)) tags.add("basketball jersey").add("vintage jersey");
  if (/baggy(?!\s*shirt)/.test(raw)) tags.add("baggy jeans");

  // colors (pick first clear hit for Pexels color param)
  for (const c of COLORS) {
    if (fuzzyHas(raw, c)) { chosenColor = (c === "grey" ? "gray" : c); break; }
  }

  // gender cues (optional, just to bias results)
  if (/\bmen|male|guy|mens\b/.test(raw)) tags.add("men fashion").add("menswear");
  if (/\bwomen|female|girl|womens\b/.test(raw)) tags.add("women fashion").add("womenswear");

  // camera/context to reduce random portraits
  tags
    .add("street style")
    .add("outfit")
    .add("full body")
    .add("standing")
    .add("outside")
    .add("natural light");

  // if we caught nothing useful, seed with generic
  if (tags.size === 0) {
    tags.add("streetwear").add("outfit").add("full body").add("street style").add("natural light");
  }

  const query = Array.from(tags).join(", ");
  return { query, color: chosenColor };
}
