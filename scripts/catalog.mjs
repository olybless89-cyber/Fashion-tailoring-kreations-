// Starter catalogue. Prices are placeholders in Naira — edit them in /admin after launch.
const img = (slug, n = 1) => Array.from({ length: n }, (_, i) => `/products/${slug}-${i + 1}.jpg`);
const STD = ["S", "M", "L", "XL", "XXL", "3XL"];
const TROUSER = ["30", "32", "34", "36", "38", "40", "42"];

export const categories = [
  { slug: "senator", name: "Senator", tagline: "Clean lines, quiet authority", description: "Long tunic and tapered trousers in cashmere-feel wool blends and cottons. Cut for boardrooms, weddings and Sunday service.", image: "/products/teal-senator-1.jpg" },
  { slug: "native", name: "Native two-piece", tagline: "Everyday native, done properly", description: "Two-piece native sets in prints, lace and colour-block. Tailored to sit right at the shoulder and fall clean at the ankle.", image: "/products/brushstroke-native-2-piece-1.jpg" },
  { slug: "agbada", name: "Agbada", tagline: "For the days that matter", description: "Three-piece agbada with hand-finished embroidery. Made to measure for owambe, weddings and chieftaincy.", image: "/products/coral-embroidered-agbada-1.jpg" },
  { slug: "english", name: "English wear", tagline: "Suits and sharp separates", description: "Suits, sheen two-pieces and statement shirts with wide or tapered trousers.", image: "/products/royal-blue-suit-2.jpg" },
  { slug: "office", name: "Office wear", tagline: "Long sleeves, plain trousers", description: "Everyday long-sleeve shirts and plain trousers that keep their shape from 8am to the last meeting.", image: "/products/cobalt-shirt-black-trousers-1.jpg" },
  { slug: "adire", name: "Adire", tagline: "Hand-dyed Yoruba indigo", description: "Adire shirts, trousers and shorts in hand-dyed cotton. Each piece carries its own pattern.", image: "/products/adire-trousers-white-top-1.jpg" },
  { slug: "jeans", name: "Jeans", tagline: "Denim, tailored to you", description: "Straight and relaxed denim, hemmed to your length.", image: "/products/jeans-placeholder.svg" },
];

const p = (o) => ({ bespoke: true, leadTimeDays: 7, featured: false, colors: [], sizes: STD, ...o });

export const products = [
  // Senator
  p({ cat: "senator", slug: "teal-senator", name: "Teal senator", price: 95000, images: img("teal-senator"), fabric: "Cashmere-feel wool blend", colors: ["Teal"], featured: true, description: "A teal senator with a concealed placket and side slits, paired with tapered trousers. Understated enough for work, rich enough for an evening event." }),
  p({ cat: "senator", slug: "ivory-senator-coral-detail", name: "Ivory senator with coral detail", price: 110000, images: img("ivory-senator-coral-detail", 2), fabric: "Premium cotton", colors: ["Ivory"], featured: true, leadTimeDays: 10, description: "Long ivory tunic finished with a small coral-red chest detail. Wear it with a red cap for traditional occasions or on its own for church." }),
  p({ cat: "senator", slug: "midnight-senator", name: "Midnight senator", price: 90000, images: img("midnight-senator"), fabric: "Wool blend", colors: ["Black"], description: "Black senator with a mandarin collar and slim trousers. The one you reach for when you do not know the dress code." }),
  p({ cat: "senator", slug: "royal-blue-senator-cap-set", name: "Royal blue senator with cap", price: 120000, images: img("royal-blue-senator-cap-set"), fabric: "Cotton blend with woven trim", colors: ["Royal blue"], description: "Royal blue senator with white stripe pocket detail, sold with a matching woven fila." }),
  p({ cat: "senator", slug: "white-senator-red-piping", name: "White senator with red piping", price: 100000, images: img("white-senator-red-piping"), fabric: "Premium cotton", colors: ["White"], description: "Crisp white senator with thin red piping at the placket and pocket." }),
  p({ cat: "senator", slug: "pinstripe-senator", name: "Pinstripe senator", price: 105000, images: img("pinstripe-senator"), fabric: "Striped wool blend", colors: ["Navy stripe"], description: "Navy pinstripe senator and trousers. Borrowed from English suiting, cut as native." }),
  p({ cat: "senator", slug: "ivory-senator-tapered", name: "Ivory senator, tapered", price: 98000, images: img("ivory-senator-tapered"), fabric: "Premium cotton", colors: ["Ivory"], description: "A shorter ivory senator top over tapered charcoal trousers." }),

  // Native two-piece
  p({ cat: "native", slug: "brushstroke-native-2-piece", name: "Brushstroke native two-piece", price: 85000, images: img("brushstroke-native-2-piece", 2), fabric: "Printed cotton", colors: ["Black and white"], featured: true, description: "Black and white brushstroke print top with contrast black sleeves, worn over plain black trousers." }),
  p({ cat: "native", slug: "leaf-print-native-white", name: "Leaf print native, white", price: 80000, images: img("leaf-print-native-white"), fabric: "Printed cotton", colors: ["White"], description: "White native with a black leaf print across the chest and matching trousers." }),
  p({ cat: "native", slug: "blush-native-2-piece", name: "Blush native two-piece", price: 75000, images: img("blush-native-2-piece", 2), fabric: "Soft cotton", colors: ["Blush pink"], featured: true, description: "Short-sleeve blush native with matching trousers and a contrast cap." }),
  p({ cat: "native", slug: "checked-native-top", name: "Checked native top", price: 70000, images: img("checked-native-top"), fabric: "Woven check", colors: ["Cream check"], description: "Checked native top with grey sleeves. Pairs with plain trousers and coral beads." }),
  p({ cat: "native", slug: "colour-block-native-gold", name: "Colour-block native, gold", price: 88000, images: img("colour-block-native-gold"), fabric: "Cotton panels", colors: ["Gold, white and black"], description: "Gold, white and black panels cut on a diagonal. A statement native for a relaxed evening." }),
  p({ cat: "native", slug: "split-panel-native-rust", name: "Split-panel native, rust", price: 78000, images: img("split-panel-native-rust"), fabric: "Cotton", colors: ["Rust and black"], description: "Asymmetric rust and black top with a wrap panel and tie detail." }),
  p({ cat: "native", slug: "geometric-native-white", name: "Geometric native, white", price: 82000, images: img("geometric-native-white"), fabric: "Cotton", colors: ["White with black"], description: "White native with a bold geometric black panel down the front." }),
  p({ cat: "native", slug: "white-lace-native", name: "White lace native", price: 115000, images: img("white-lace-native"), fabric: "Cotton lace", colors: ["White"], leadTimeDays: 10, description: "Fine white lace two-piece for weddings, naming ceremonies and thanksgiving." }),
  p({ cat: "native", slug: "ash-native-2-piece", name: "Ash native two-piece", price: 72000, images: img("ash-native-2-piece"), fabric: "Cotton", colors: ["Ash grey"], description: "Plain ash-grey native. The everyday set you will wear the most." }),

  // Agbada
  p({ cat: "agbada", slug: "crimson-embroidered-agbada", name: "Crimson embroidered agbada", price: 380000, images: img("crimson-embroidered-agbada"), fabric: "Silk satin with hand embroidery", colors: ["Crimson"], featured: true, leadTimeDays: 21, sizes: [], description: "Three-piece crimson agbada with dense front embroidery and a matching embroidered cap. Made to measure only." }),
  p({ cat: "agbada", slug: "coral-embroidered-agbada", name: "Coral embroidered agbada", price: 320000, images: img("coral-embroidered-agbada"), fabric: "Brocade with embroidery", colors: ["Coral red"], featured: true, leadTimeDays: 21, sizes: [], description: "Coral red agbada with tonal chest embroidery. Pair with coral beads." }),
  p({ cat: "agbada", slug: "grey-embroidered-agbada", name: "Grey embroidered agbada", price: 290000, images: img("grey-embroidered-agbada"), fabric: "Brocade", colors: ["Grey and navy"], leadTimeDays: 18, sizes: [], description: "Grey agbada with navy geometric embroidery down the front, with matching cap." }),
  p({ cat: "agbada", slug: "black-embroidered-agbada", name: "Black embroidered agbada", price: 300000, images: img("black-embroidered-agbada"), fabric: "Wool blend with embroidery", colors: ["Black"], leadTimeDays: 18, sizes: [], description: "Black agbada with fine tonal line embroidery. Formal without being loud." }),
  p({ cat: "agbada", slug: "white-agbada-set", name: "White agbada set", price: 260000, images: img("white-agbada-set", 2), fabric: "Premium cotton", colors: ["White"], leadTimeDays: 14, sizes: [], description: "Clean white agbada, inner top and trousers. Style it with coral beads and a red cap." }),
  p({ cat: "agbada", slug: "sky-blue-agbada", name: "Sky blue agbada", price: 240000, images: img("sky-blue-agbada"), fabric: "Cotton blend", colors: ["Sky blue"], leadTimeDays: 14, sizes: [], description: "Light sky-blue agbada for daytime occasions." }),
  p({ cat: "agbada", slug: "blush-agbada", name: "Blush agbada", price: 250000, images: img("blush-agbada", 2), fabric: "Soft brocade", colors: ["Blush"], leadTimeDays: 14, sizes: [], description: "Blush agbada worn open over matching trousers. Soft colour, strong shape." }),

  // English
  p({ cat: "english", slug: "royal-blue-suit", name: "Royal blue sheen suit", price: 250000, images: img("royal-blue-suit", 2), fabric: "Sheen wool blend", colors: ["Royal blue"], featured: true, leadTimeDays: 14, description: "Two-piece royal blue suit with a subtle sheen and flared trouser. Worn open with a black shirt." }),
  p({ cat: "english", slug: "sapphire-sheen-2-piece", name: "Sapphire sheen shirt and trousers", price: 130000, images: img("sapphire-sheen-2-piece", 2), fabric: "Sheen twill", colors: ["Sapphire"], description: "Short-sleeve sapphire shirt with a black panel, and matching straight trousers." }),
  p({ cat: "english", slug: "black-shirt-wide-trousers", name: "Black shirt, sapphire wide trousers", price: 95000, images: img("black-shirt-wide-trousers"), fabric: "Cotton shirt, sheen trousers", colors: ["Black and sapphire"], sizes: [...TROUSER], description: "Fitted black shirt tucked into high-waisted wide-leg sapphire trousers." }),
  p({ cat: "english", slug: "resort-shirt-pleated-trousers", name: "Resort shirt and pleated trousers", price: 90000, images: img("resort-shirt-pleated-trousers"), fabric: "Viscose shirt, wool-feel trousers", colors: ["Print with beige"], description: "Printed short-sleeve shirt with pleated beige wide-leg trousers." }),

  // Office
  p({ cat: "office", slug: "cobalt-shirt-black-trousers", name: "Cobalt shirt, black trousers", price: 65000, images: img("cobalt-shirt-black-trousers"), fabric: "Cotton poplin", colors: ["Cobalt"], featured: true, leadTimeDays: 5, description: "Cobalt shirt with a concealed placket and plain black trousers." }),
  p({ cat: "office", slug: "powder-blue-shirt-black-trousers", name: "Powder blue shirt, black trousers", price: 60000, images: img("powder-blue-shirt-black-trousers"), fabric: "Cotton poplin", colors: ["Powder blue"], leadTimeDays: 5, description: "Short-sleeve powder blue shirt over straight black trousers." }),
  p({ cat: "office", slug: "printed-dress-shirt", name: "Printed long-sleeve shirt", price: 45000, images: img("printed-dress-shirt"), fabric: "Cotton", colors: ["White with black print"], leadTimeDays: 5, description: "White long-sleeve shirt with a black botanical print at the hem." }),

  // Adire
  p({ cat: "adire", slug: "adire-trousers-white-top", name: "Adire trousers with white top", price: 70000, images: img("adire-trousers-white-top"), fabric: "Hand-dyed adire cotton", colors: ["Indigo and white"], featured: true, description: "Relaxed white top over hand-dyed adire trousers." }),
  p({ cat: "adire", slug: "red-adire-shirt", name: "Red adire shirt", price: 45000, images: img("red-adire-shirt"), fabric: "Hand-dyed adire cotton", colors: ["Red"], description: "Short-sleeve red adire shirt. Every pattern is slightly different." }),
  p({ cat: "adire", slug: "adire-shorts-pair", name: "Adire shorts", price: 30000, images: img("adire-shorts-pair"), fabric: "Hand-dyed adire cotton", colors: ["Brown", "Sky blue"], sizes: [...TROUSER], leadTimeDays: 5, description: "Elasticated adire shorts in two colourways." }),

  // Jeans — replace placeholder photos in /admin
  p({ cat: "jeans", slug: "tailored-straight-jeans", name: "Tailored straight jeans", price: 45000, images: ["/products/jeans-placeholder.svg"], fabric: "Rigid denim", colors: ["Indigo", "Black"], sizes: [...TROUSER], leadTimeDays: 5, description: "Straight-leg jeans hemmed to your length." }),
  p({ cat: "jeans", slug: "relaxed-dark-wash-jeans", name: "Relaxed dark-wash jeans", price: 48000, images: ["/products/jeans-placeholder.svg"], fabric: "Stretch denim", colors: ["Dark wash"], sizes: [...TROUSER], leadTimeDays: 5, description: "Relaxed-fit dark-wash jeans with a little stretch." }),
];
