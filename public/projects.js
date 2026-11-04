/*
  studio ez — project data
  ------------------------------------------------------------
  This ONE file feeds the landing page (orbiting tiles) AND the
  work page (cards + project windows).

  To add a project:
    1. Put its images in the  images  folder (JPG, about 1200px wide).
    2. Copy one block below, paste it at the end (before the closing ]),
       and change the text and file names.
    3. Commit the change on GitHub. The site updates in about a minute.

  Fields:
    id        short, lowercase, no spaces (used in the link work.html#id)
    title     project name
    type      Gamification | Branding | Podcast | Content | Illustration
              (a new word here automatically becomes a new filter button)
    client    who it was for
    year      leave "" if you are not sure
    summary   one line, shown when you hover a card
    brief     the problem (leave "" to hide)
    outcome   the result (leave "" to hide)
    did       list of what studio ez did
    cover     the image used on the work page card
    focus     optional: where the work page card crops a tall photo, as "left top",
              e.g. "50% 20%" keeps the upper part. Leave the line out to centre it.
    tiles     small images that orbit on the landing page. Make them with
              python3 tools/make_tiles.py (it makes the small t- copies)
    images    all images shown inside the project window
    alt       plain description for each image (for screen readers)
*/
window.PROJECTS = [
  {
    id: "gta",
    title: "Grand Tax Auto",
    type: "Gamification",
    client: "Income Tax Division, National Board of Revenue",
    year: "2026",
    summary: "A browser game that teaches how tax procedures work.",
    brief: "Procedures like eTIN registration, eReturn filing, eTDS verification and eAudit are hard for the public to follow, and the event needed something visitors could play.",
    outcome: "A playable browser game with 16 scenes, 6 cinematic videos and 12 character animation sequences, delivered in 3 days. Showcased at the Revenue Conference 2026 on 18 August 2026.",
    did: ["Game design", "UI design", "Character animation", "Cinematic video", "HTML build"],
    cover: "images/gta-1.jpg",
    tiles: ["images/t-gta-1.jpg", "images/t-gta-2.jpg", "images/t-gta-8.jpg"],
    images: [
      ["images/gta-1.jpg", "Title screen of Grand Tax Auto with a glowing blue city and a start button"],
      ["images/gta-8.jpg", "Illustrated arcade cabinet outside a neon arcade, its screen reading Press Start"],
      ["images/gta-2.jpg", "Character select screen with a taxpayer and a tax official on glowing platforms"],
      ["images/gta-5.jpg", "eTIN screen in green terminal style: Print your eTIN certificate"],
      ["images/gta-3.jpg", "eReturn screen with four filing pages and a tax summary"],
      ["images/gta-4.jpg", "eTDS screen asking whether to verify a taxpayer's source tax claim"],
      ["images/gta-7.jpg", "eAudit screen showing five files with risk levels"],
      ["images/gta-6.jpg", "Pixel-art chart of tax-to-GDP growth from 2026 to 2034 with milestone cards"],
      ["images/gta-9.jpg", "Pixel-art airliner labelled Revenue trailing banknotes through the sky"]
    ]
  },
  {
    id: "chilirig",
    title: "ChiliRig",
    type: "Branding",
    client: "ChiliRig, a chili oil business",
    year: "",
    summary: "Brand and content for an F-commerce chili oil business.",
    brief: "",
    outcome: "Page engagement grew over 60% while we ran its branding and campaigns (figure taken from the page's Meta Business Suite dashboard).",
    did: ["Brand identity", "Campaign visuals", "Social content"],
    cover: "images/chilirig-1.jpg",
    tiles: ["images/t-chilirig-1.jpg", "images/t-chilirig-2.jpg", "images/t-chilirig-5.jpg"],
    images: [
      ["images/chilirig-1.jpg", "ChiliRig chili oil jars surrounded by flying chilies and curved headline text"],
      ["images/chilirig-5.jpg", "Ramadan Kareem offer for ChiliRig, 15% off, with a jar, baskets of chilies and mosque silhouettes"],
      ["images/chilirig-2.jpg", "A ChiliRig jar in front of an orange and red wave pattern"],
      ["images/chilirig-3.jpg", "Social ad on a dark background: Turn meals into spicy social rituals"],
      ["images/chilirig-4.jpg", "ChiliRig ad: Flavor without limits, a jar beside falling chilies and chili powder"]
    ]
  },
  {
    id: "daakini",
    title: "The Daakini Podcast",
    type: "Podcast",
    client: "The Daakini Podcast, hosted by Urmi and Nadia",
    year: "",
    summary: "Identity, illustration and weekly production for a podcast.",
    brief: "A new podcast needed an identity and a team to make and publish every episode.",
    outcome: "End-to-end delivery of identity, illustrations, character design, recording, editing, publishing and social media. Season 1 ran for 12 episodes. Season 2 is under way, with 3 episodes aired.",
    did: ["Visual identity", "Illustration", "Character design", "Recording and editing", "Publishing", "Social media"],
    cover: "images/daakini-1.jpg",
    tiles: ["images/t-daakini-1.jpg", "images/t-daakini-2.jpg"],
    images: [
      ["images/daakini-1.jpg", "The Daakini Podcast cover with a vintage microphone and an illustrated goddess"],
      ["images/daakini-2.jpg", "Illustration of four dancers in a temple hall on a terracotta background"],
      ["images/daakini-3.jpg", "The Daakini Podcast title card with a microphone and a lips sticker on dark green with a REC badge"]
    ]
  },
  {
    id: "content",
    title: "Product and brand visuals",
    type: "Content",
    client: "F-commerce brands",
    year: "",
    summary: "Product photography and brand application visuals.",
    brief: "",
    outcome: "",
    did: ["Product photography", "Brand applications", "Social content"],
    cover: "images/content-1.jpg",
    tiles: ["images/t-content-1.jpg", "images/t-content-3.jpg"],
    images: [
      ["images/content-1.jpg", "Perfume bottle labelled Brandy Designs, Saffron Noir, with a ring and a chain on a dark surface"],
      ["images/content-2.jpg", "Hands holding a blue notebook against a shadowed wall"],
      ["images/content-3.jpg", "Skincare tube and soap dispenser in soft daylight"],
      ["images/content-4.jpg", "Brand applications on a bottle and two tote bags"]
    ]
  },
  {
    id: "characters",
    title: "Character illustration",
    type: "Illustration",
    client: "Games and podcasts",
    year: "",
    summary: "Original characters for games and podcasts.",
    brief: "",
    outcome: "",
    did: ["Character design", "Illustration"],
    cover: "images/characters-1.jpg",
    tiles: ["images/t-characters-1.jpg"],
    images: [
      ["images/characters-1.jpg", "Four illustrated characters on a red background"],
      ["images/illus-4.jpg", "Three illustrated characters with horns"]
    ]
  },
  {
    id: "illustrations",
    title: "Scene illustration",
    type: "Illustration",
    client: "",
    year: "",
    summary: "Scenes and concept illustrations.",
    brief: "",
    outcome: "",
    did: ["Illustration", "Concept art"],
    cover: "images/illus-5.jpg",
    tiles: ["images/t-illus-5.jpg", "images/t-illus-7.jpg"],
    images: [
      ["images/illus-5.jpg", "Illustrated school tug-of-war on a sports field, a red team against a blue team"],
      ["images/illus-6.jpg", "Illustrated schoolchildren in uniform in a schoolyard with a Bangladesh flag and a mango tree"],
      ["images/illus-7.jpg", "Glowing illustration of a child's head with a brain of connected neurons"],
      ["images/illus-2.jpg", "Illustrated students at desks with glowing brains"],
      ["images/illus-3.jpg", "Illustrated plate of food with icons for water, energy and nutrients"],
      ["images/illus-1.jpg", "Glowing blue holographic platforms in a sci-fi hall"]
    ]
  },
  {
    id: "sketches",
    title: "Concept sketches",
    type: "Illustration",
    client: "",
    year: "",
    summary: "Landscape and architectural sketches.",
    brief: "",
    outcome: "",
    did: ["Concept sketches", "Rendering"],
    cover: "images/sketch-3.jpg",
    tiles: ["images/t-sketch-3.jpg", "images/t-sketch-2.jpg"],
    images: [
      ["images/sketch-3.jpg", "Rendered view of a timber pavilion among trees"],
      ["images/sketch-1.jpg", "Section drawing of a forest landscape with soil layers"],
      ["images/sketch-2.jpg", "Line sketch of a timber structure with a colored wash"]
    ]
  },
  {
    id: "serenity",
    title: "Serenity Suites",
    type: "Conceptual projects",
    client: "Concept project for a luxury boutique hotel",
    year: "",
    summary: "A full brand identity for an urban sanctuary hotel (concept).",
    brief: "Create a brand identity for a luxury boutique hotel that feels like a calm haven in the middle of a busy city.",
    outcome: "A complete brand guideline covering research and positioning, logo system, palette, typography, imagery style, applications and guest touchpoints.",
    did: ["Research and positioning", "Logo system", "Palette and typography", "Imagery style", "Brand applications"],
    cover: "images/serenity-1.jpg",
    tiles: ["images/t-serenity-1.jpg", "images/t-serenity-2.jpg", "images/t-serenity-3.jpg"],
    images: [
      ["images/serenity-1.jpg", "Serenity Suites logo on a red interlocking pattern"],
      ["images/serenity-8.jpg", "Serenity Suites napkin band in red with the logo and pattern on black cloth"],
      ["images/serenity-2.jpg", "Pages from the Serenity Suites brand identity guidelines"],
      ["images/serenity-3.jpg", "Hotel lobby with a chandelier and a view of the city"],
      ["images/serenity-4.jpg", "Brand mission, vision and values page"],
      ["images/serenity-5.jpg", "Target market analysis page"],
      ["images/serenity-6.jpg", "Competitive landscape page"],
      ["images/serenity-7.jpg", "Brand positioning and archetype page"]
    ]
  },
  {
    id: "theway",
    title: "The Way Dhaka",
    type: "Conceptual projects",
    client: "Concept outdoor advertisement for a hospitality brand",
    year: "",
    summary: "A billboard concept: The way to experience Dhaka.",
    brief: "",
    outcome: "",
    did: ["Advertising design", "Layout and typography"],
    cover: "images/theway-1.jpg",
    tiles: ["images/t-theway-1.jpg"],
    images: [
      ["images/theway-1.jpg", "Outdoor billboard concept in green and gold: The way to experience Dhaka"]
    ]
  }
];
