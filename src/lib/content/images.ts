/**
 * Aurelle Spaces — Curated Architectural & Interior Photography Library
 * 
 * High-resolution, royalty-free architectural and interior design photography
 * sourced from approved Unsplash creators under the Unsplash commercial-use license.
 * Configured with exact aspect ratios, responsive widths, and descriptive alt text.
 */

export interface StudioImage {
  url: string;
  alt: string;
  caption?: string;
  aspectRatio: "landscape" | "portrait" | "widescreen" | "editorial" | "square";
  width: number;
  height: number;
}

export const studioImages = {
  // Hero: Warm minimalist luxury living room with linen furnishings and natural light
  heroLivingRoom: {
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85",
    alt: "Contemporary living room with natural daylight, linen seating, and warm wood accents",
    caption: "Thoughtfully composed living space with soft natural daylight and honest materiality",
    aspectRatio: "editorial" as const,
    width: 1800,
    height: 1125,
  },

  // About: Tactile natural materials, timber joinery, and warm stone
  aboutMaterials: {
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
    alt: "Tactile interior composition featuring natural stone, warm plaster, and curated ceramics",
    caption: "Material honesty: natural textures and subtle tones that weather gracefully",
    aspectRatio: "portrait" as const,
    width: 1600,
    height: 2000,
  },

  // About Studio Workspace / Approach
  aboutStudioSpace: {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85",
    alt: "Architectural design studio workspace with natural light and material samples",
    caption: "Our practice is grounded in listening, rigorous planning, and hands-on site coordination",
    aspectRatio: "landscape" as const,
    width: 1600,
    height: 1067,
  },

  // Philosophy / Craft Detail
  craftDetail: {
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
    alt: "Architectural interior detail showing wood joinery, light play, and clean geometry",
    caption: "Every detail has a purpose: quiet spatial transitions and considered proportions",
    aspectRatio: "editorial" as const,
    width: 1600,
    height: 1000,
  },

  // Contact Page Supporting Image
  contactVignette: {
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85",
    alt: "Tranquil interior setting with comfortable armchair, floor lamp, and calm atmosphere",
    caption: "Initial consultations are structured to understand your lifestyle and spatial aspirations",
    aspectRatio: "portrait" as const,
    width: 1600,
    height: 2000,
  },

  // Four Core Design Services
  services: {
    residential: {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      alt: "Bespoke residential villa interior with floor-to-ceiling windows and warm living area",
      caption: "Residential Interiors — Homes designed for comfort, daily rituals, and long-term living",
      aspectRatio: "landscape" as const,
      width: 1600,
      height: 1067,
    },
    commercial: {
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85",
      alt: "Boutique contemporary commercial workspace with acoustic privacy and natural light",
      caption: "Commercial Interiors — Productive, inspiring workspaces that embody studio identity",
      aspectRatio: "landscape" as const,
      width: 1600,
      height: 1067,
    },
    architecture: {
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
      alt: "Modern residential architecture with deep overhangs, stone walls, and courtyard integration",
      caption: "Architecture & Space Planning — Climate-sensitive building design and flowing layouts",
      aspectRatio: "landscape" as const,
      width: 1600,
      height: 1067,
    },
    renovation: {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85",
      alt: "Carefully restored living interior respecting original architectural character",
      caption: "Renovation & Refurbishment — Transforming existing structures with modern convenience",
      aspectRatio: "landscape" as const,
      width: 1600,
      height: 1067,
    },
  },

  // Six Concept Portfolio Projects (Matched to canonical portfolio-data slugs)
  projects: {
    // 01. The Courtyard Residence — Hyderabad (Residential Interiors)
    "courtyard-residence-hyderabad": {
      cover: {
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
        alt: "The Courtyard Residence — Contemporary Indian villa featuring central open courtyard",
        caption: "Courtyard Residence, Hyderabad — Natural passive ventilation and sheltered living verandas",
        aspectRatio: "editorial" as const,
        width: 1600,
        height: 1000,
      },
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
          alt: "Double-height living pavilion overlooking shaded courtyard gardens",
          caption: "Double-height living area opening directly into the central courtyard",
          aspectRatio: "landscape" as const,
          width: 1600,
          height: 1067,
        },
        {
          url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=85",
          alt: "Master bedroom suite with Burma teak joinery and courtyard views",
          caption: "Quiet upper-level master suite buffered from daytime living zones",
          aspectRatio: "portrait" as const,
          width: 1400,
          height: 1867,
        },
        {
          url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=85",
          alt: "Dining pavilion with integrated kitchen and honed granite breakfast island",
          caption: "Dining area connected to outdoor herbal garden and prep kitchen",
          aspectRatio: "widescreen" as const,
          width: 1600,
          height: 900,
        },
      ],
    },

    // 02. The Quiet House — Bengaluru (Residential Interiors)
    "quiet-house-bengaluru": {
      cover: {
        url: "https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&w=1600&q=85",
        alt: "The Quiet House — Minimalist residential retreat with lush garden views",
        caption: "The Quiet House, Bengaluru — Seamless integration of garden greenery and warm interiors",
        aspectRatio: "portrait" as const,
        width: 1600,
        height: 2000,
      },
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85",
          alt: "Sunlit family lounge with oak joinery and garden patio doors",
          caption: "Living lounge framing natural garden light throughout the day",
          aspectRatio: "landscape" as const,
          width: 1600,
          height: 1067,
        },
        {
          url: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85",
          alt: "Minimalist guest bedroom with limewash walls and linen curtains",
          caption: "Serene bedroom with lime plaster finish and soft textile layering",
          aspectRatio: "portrait" as const,
          width: 1400,
          height: 1867,
        },
        {
          url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=85",
          alt: "Solid wood dining table beneath sculptural pendant lighting",
          caption: "Central dining room serving as the daily gathering place",
          aspectRatio: "widescreen" as const,
          width: 1600,
          height: 900,
        },
      ],
    },

    // 03. The Atelier Workspace — Pune (Commercial Interiors)
    "atelier-workspace-pune": {
      cover: {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
        alt: "The Atelier Workspace — Creative boutique office with daylight wells",
        caption: "The Atelier Workspace, Pune — Daylight-optimized creative studio environment",
        aspectRatio: "landscape" as const,
        width: 1600,
        height: 1067,
      },
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85",
          alt: "Open collaborative design studio benches with ergonomic lighting",
          caption: "Flexible open studio tables fostering collaborative ideation",
          aspectRatio: "landscape" as const,
          width: 1600,
          height: 1067,
        },
        {
          url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
          alt: "Private acoustic conference lounge with fluted glass doors",
          caption: "Acoustically isolated presentation suite with tactile timber finishes",
          aspectRatio: "portrait" as const,
          width: 1400,
          height: 1867,
        },
        {
          url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
          alt: "Material library and physical sample review counter",
          caption: "Integrated material library with dedicated daylight inspection desk",
          aspectRatio: "widescreen" as const,
          width: 1600,
          height: 900,
        },
      ],
    },

    // 04. The Veranda Home — Chennai (Architecture & Space Planning)
    "veranda-home-chennai": {
      cover: {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
        alt: "The Veranda Home Chennai — Coastal architecture with deep shaded verandas and tropical landscape",
        caption: "The Veranda Home, Chennai — Elevated granite plinth and continuous open verandas catching sea breezes",
        aspectRatio: "editorial" as const,
        width: 1600,
        height: 1000,
      },
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85",
          alt: "Open-air living deck overlooking lush tropical garden",
          caption: "Deep sheltered verandas blurring indoor and outdoor coastal living",
          aspectRatio: "landscape" as const,
          width: 1600,
          height: 1067,
        },
        {
          url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=85",
          alt: "Outdoor stone shower and bathroom with open-sky lightwell",
          caption: "Natural basalt stone wet room celebrating outdoor light",
          aspectRatio: "portrait" as const,
          width: 1400,
          height: 1867,
        },
        {
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
          alt: "Sunset living pavilion with natural rattan and linen furniture",
          caption: "Casual entertaining pavilion taking advantage of evening sea breezes",
          aspectRatio: "widescreen" as const,
          width: 1600,
          height: 900,
        },
      ],
    },

    // 05. The Gallery Office — Mumbai (Commercial Interiors)
    "gallery-office-mumbai": {
      cover: {
        url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85",
        alt: "The Gallery Office Mumbai — Refined executive boardroom with acoustic smoked oak panelling and soft daylight",
        caption: "The Gallery Office, Mumbai — Honed limestone circulation spine and smoked oak private deal suites",
        aspectRatio: "landscape" as const,
        width: 1600,
        height: 1067,
      },
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85",
          alt: "Expansive boardroom with Italian travertine flooring and bespoke cabinetry",
          caption: "Acoustically softened conference space with concealed presentation technology",
          aspectRatio: "landscape" as const,
          width: 1600,
          height: 1067,
        },
        {
          url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=85",
          alt: "Senior partner study with custom desk and harbor views",
          caption: "Confidential executive office framed by smoked oak and acoustic linen",
          aspectRatio: "portrait" as const,
          width: 1400,
          height: 1867,
        },
        {
          url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=85",
          alt: "Private client hospitality salon with marble bar",
          caption: "Precision-crafted hospitality salon for client entertaining",
          aspectRatio: "widescreen" as const,
          width: 1600,
          height: 900,
        },
      ],
    },

    // 06. The Renewal Apartment — Hyderabad (Renovation & Refurbishment)
    "renewal-apartment-hyderabad": {
      cover: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85",
        alt: "The Renewal Apartment Hyderabad — Restored high-rise residence with open-plan daylight",
        caption: "The Renewal Apartment, Hyderabad — Reconfigured non-structural partitions creating a luminous family suite",
        aspectRatio: "portrait" as const,
        width: 1600,
        height: 2000,
      },
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
          alt: "Refined marble flooring paired with custom ash wood shelving and bronze accents",
          caption: "Continuous marble floor contrasted against fluted ash wood millwork",
          aspectRatio: "landscape" as const,
          width: 1600,
          height: 1067,
        },
        {
          url: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85",
          alt: "Master suite with bespoke headboard and concealed acoustic buffer",
          caption: "Serene bedroom with lime plaster finish and soft textile layering",
          aspectRatio: "portrait" as const,
          width: 1400,
          height: 1867,
        },
        {
          url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=85",
          alt: "Open dining space with quartz island and contemporary pendant lighting",
          caption: "Open-plan kitchen and dining area replacing the former compartmentalized walls",
          aspectRatio: "widescreen" as const,
          width: 1600,
          height: 900,
        },
      ],
    },

    // Legacy Aliases for backwards compatibility
    "coastal-retreat-alibaug": {
      cover: {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
        alt: "Coastal Retreat Alibaug — Modern coastal architecture",
        caption: "Coastal Retreat, Alibaug",
        aspectRatio: "landscape" as const,
        width: 1600,
        height: 1067,
      },
      gallery: [],
    },
    "skyline-penthouse-mumbai": {
      cover: {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
        alt: "Skyline Penthouse Mumbai",
        caption: "Skyline Penthouse, Mumbai",
        aspectRatio: "editorial" as const,
        width: 1600,
        height: 1000,
      },
      gallery: [],
    },
    "heritage-apartment-delhi": {
      cover: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85",
        alt: "Heritage Apartment Delhi",
        caption: "Heritage Apartment, Delhi",
        aspectRatio: "portrait" as const,
        width: 1600,
        height: 2000,
      },
      gallery: [],
    },
  },

  // Journal Articles
  journal: {
    "planning-a-home-that-works-for-everyday-life": {
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
      alt: "Spacious sunlit living room showing natural circulation and family living layout",
      caption: "Practical domestic planning: how circulation and daily rituals shape quiet homes",
      aspectRatio: "widescreen" as const,
      width: 1600,
      height: 900,
    },
    "choosing-materials-with-care": {
      url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
      alt: "Arrangement of stone, timber, lime plaster, and brass samples on an architectural desk",
      caption: "Material integrity: choosing surfaces that grow richer with age and honest use",
      aspectRatio: "landscape" as const,
      width: 1600,
      height: 1067,
    },
    "making-better-use-of-compact-spaces": {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85",
      alt: "Smart storage joinery and multi-functional architectural wall in an urban home",
      caption: "Space planning: creating breathing room and calm order in compact urban footprints",
      aspectRatio: "landscape" as const,
      width: 1600,
      height: 1067,
    },
  },

  // Process Stages
  process: [
    {
      stage: "01",
      name: "Discover",
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85",
      alt: "Architectural consultation: sketching, site notes, and initial spatial layout exploration",
    },
    {
      stage: "02",
      name: "Plan",
      url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85",
      alt: "Spatial planning layouts, structural circulation studies, and natural daylight orientation",
    },
    {
      stage: "03",
      name: "Design",
      url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
      alt: "Curated 3D materiality palette: honed natural stone, solid timber, and lime plaster swatches",
    },
    {
      stage: "04",
      name: "Refine",
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
      alt: "Joinery specification, detailed millwork sections, and Good-for-Construction technical drawings",
    },
    {
      stage: "05",
      name: "Coordinate",
      url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=85",
      alt: "Artisan collaboration and joinery craftsmanship during on-site quality fabrication",
    },
    {
      stage: "06",
      name: "Complete",
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      alt: "Completed living space with soft linen furnishings, warm natural light, and final handover styling",
    },
  ],
};
