/**
 * Aurelle Spaces — Comprehensive Portfolio Centralized Data
 * 
 * Defines all six demonstration concept projects with rich editorial narratives,
 * materiality swatches, gallery plates, and technical considerations.
 * Prepared for future migration to Cloudflare D1.
 */

export type ProjectCategory =
  | "Residential Interiors"
  | "Commercial Interiors"
  | "Architecture & Space Planning"
  | "Renovation & Refurbishment";

export interface MaterialSwatch {
  name: string;
  finish: string;
  role: string;
  toneHex: string;
}

export interface GalleryPlate {
  id: string;
  title: string;
  plateRef: string;
  aspectRatio: "landscape" | "portrait" | "widescreen" | "editorial";
  caption: string;
}

export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  location: string;
  city: string;
  category: ProjectCategory;
  shortDescription: string;
  conceptNarrative: string[];
  designApproach: {
    title: string;
    narrative: string;
  }[];
  keyConsiderations: {
    title: string;
    description: string;
  }[];
  materialPalette: MaterialSwatch[];
  spacePlanningNotes: string[];
  galleryItems: GalleryPlate[];
  coverAspect: "landscape" | "portrait" | "widescreen" | "editorial";
  areaSqFt: string;
  year: number;
  featured: boolean;
  relatedSlugs: string[];
  metaTitle: string;
  metaDescription: string;
  demonstrationDisclosure: string;
}

export const portfolioCategories: ("All Projects" | ProjectCategory)[] = [
  "All Projects",
  "Residential Interiors",
  "Commercial Interiors",
  "Architecture & Space Planning",
  "Renovation & Refurbishment",
];

export const portfolioProjects: Record<string, ProjectDetail> = {
  "courtyard-residence-hyderabad": {
    id: "proj-01",
    slug: "courtyard-residence-hyderabad",
    title: "The Courtyard Residence",
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    category: "Residential Interiors",
    shortDescription:
      "A contemporary family residence organised around natural light, warm materials and comfortable shared spaces.",
    conceptNarrative: [
      "The Courtyard Residence explores the timeless Indian domestic typology of the central aangan (courtyard), reimagined for modern family living in Hyderabad's arid climate. The spatial layout is organized around a double-height monsoon courtyard that acts as the thermal and emotional heart of the home.",
      "Living areas, dining verandas, and family lounges open directly onto this sheltered sanctuary, allowing natural light to penetrate deep into internal zones while keeping direct solar glare outside. As hot air rises through the courtyard clerestory, cooler breezes are pulled across shaded ground-floor rooms.",
    ],
    designApproach: [
      {
        title: "Microclimate & Stack Ventilation",
        narrative: "The central light well acts as a natural convective chimney, maintaining a gentle airflow even during peak summer afternoons.",
      },
      {
        title: "Layered Privacy Gradients",
        narrative: "Formal entertaining areas remain accessible near the entry foyer, while private family bedrooms and prayer spaces occupy the quiet upper courtyard perimeter.",
      },
      {
        title: "Integrated Timber Joinery",
        narrative: "Bespoke Burma teak millwork lines the living corridors, integrating concealable doors, prayer alcoves, and book storage into continuous architectural surfaces.",
      },
    ],
    keyConsiderations: [
      {
        title: "Basalt Thermal Massing",
        description: "Honed Deccan basalt stone lines the ground-level courtyard plinth, absorbing ambient daytime heat and releasing coolness through the night.",
      },
      {
        title: "Monsoon Ingress Detailing",
        description: "Concealed perimeter drainage troughs and overflow scuppers handle heavy seasonal downpours within the open-to-sky courtyard effortlessly.",
      },
      {
        title: "Acoustic Softening",
        description: "Natural hand-tufted wool carpets, linen drapery, and acoustic plaster ceilings buffer family conversations from courtyard stone reverberation.",
      },
    ],
    materialPalette: [
      { name: "Deccan Basalt", finish: "Honed & Water-repellent", role: "Courtyard Flooring & Plinths", toneHex: "#3A3B37" },
      { name: "Seasoned Teak", finish: "Matte Oiled & Waxed", role: "Architectural Joinery & Louvers", toneHex: "#8B6743" },
      { name: "Lime Plaster", finish: "Troweled Natural Pigment", role: "Breathable Interior Walls", toneHex: "#F2EAE0" },
      { name: "Cast Bronze", finish: "Brushed Unlacquered", role: "Custom Hardware & Apertures", toneHex: "#A17C55" },
    ],
    spacePlanningNotes: [
      "7,800 sq. ft. across two primary living levels with a recessed service basement.",
      "Central 400 sq. ft. open-to-sky courtyard with retractable automated rain louvers.",
      "Dual kitchens (wet heavy-cooking pantry and dry social presentation counter).",
      "Seamless indoor-outdoor threshold connecting the family lounge to a shaded rear lawn.",
    ],
    galleryItems: [
      { id: "cr-01", title: "Central Courtyard Section", plateRef: "Plate 01 // Sectional Axis", aspectRatio: "widescreen", caption: "Volumetric cross-section illustrating thermal stack effect across the double-height courtyard." },
      { id: "cr-02", title: "Formal Living Veranda", plateRef: "Plate 02 // Spatial Perspective", aspectRatio: "portrait", caption: "Full-height sliding timber screens filtering morning eastern light into the formal salon." },
      { id: "cr-03", title: "Master Suite Detail", plateRef: "Plate 03 // Joinery Elevation", aspectRatio: "landscape", caption: "Integrated solid teak bedhead and floating nightstands with concealed reading lights." },
    ],
    coverAspect: "widescreen",
    areaSqFt: "7,800",
    year: 2025,
    featured: true,
    relatedSlugs: ["quiet-house-bengaluru", "veranda-home-chennai"],
    metaTitle: "The Courtyard Residence, Hyderabad | Aurelle Spaces",
    metaDescription: "A contemporary residential architecture and interior concept in Hyderabad organized around a double-height monsoon courtyard and regional basalt.",
    demonstrationDisclosure: "Demonstration architectural study developed for DRK Information Software Solutions. Concept work; not an actual client commission.",
  },

  "quiet-house-bengaluru": {
    id: "proj-02",
    slug: "quiet-house-bengaluru",
    title: "The Quiet House",
    location: "Bengaluru, Karnataka",
    city: "Bengaluru",
    category: "Residential Interiors",
    shortDescription:
      "A restrained residential interior exploring calm colours, practical storage and uncluttered living spaces.",
    conceptNarrative: [
      "Nestled in a leafy residential neighborhood of Bengaluru, The Quiet House is a study in domestic calm and sensory restraint. The design deliberately eliminates visual noise, relying on generous proportions, natural materials, and recessed storage to create an uncluttered home.",
      "Faced with dense urban neighbors, the residence looks inward. Clay terracotta jaali screens wrap the street-facing balcony, filtering intense sunlight into soft geometric patterns while blocking street sightlines and road noise.",
    ],
    designApproach: [
      {
        title: "Inward-Focused Privacy",
        narrative: "Perimeter terracotta screens and deep garden setbacks insulate internal living rooms from surrounding street traffic.",
      },
      {
        title: "Uncluttered Storage Walls",
        narrative: "Wardrobes, bookshelves, and electronic consoles are built flush into walls, maintaining clean architectural planes throughout.",
      },
      {
        title: "Continuous Kota Floor Plane",
        narrative: "Polished green Kota stone flows seamlessly from the foyer through living and dining areas, visually expanding the spatial horizon.",
      },
    ],
    keyConsiderations: [
      {
        title: "Acoustic Decoupling",
        description: "Double-glazed acoustic windows and dense masonry cavity walls reduce exterior urban noise by over 32 decibels.",
      },
      {
        title: "Tactile Floor Temperature",
        description: "Honed Kota stone remains naturally cool during Bengaluru's warm dry spells and pleasant under bare feet year-round.",
      },
      {
        title: "Filtered Sunlight",
        description: "Custom terracotta jaali blocks soften western glare, casting delicate moving shadow patterns throughout the afternoon.",
      },
    ],
    materialPalette: [
      { name: "Green Kota Stone", finish: "Mirror Polished & Waxed", role: "Continuous Ground Flooring", toneHex: "#5E6358" },
      { name: "Terracotta Jaali", finish: "Kiln-Fired Natural Red", role: "Screening Apertures & Shading", toneHex: "#9B5D43" },
      { name: "Reclaimed Teak", finish: "Natural Low-Sheen Poly", role: "Bespoke Dining & Credenzas", toneHex: "#70482B" },
      { name: "Textured Plaster", finish: "Ivory Sand Finish", role: "Perimeter Internal Walls", toneHex: "#EFECE6" },
    ],
    spacePlanningNotes: [
      "5,400 sq. ft. planned across three intimate levels with an internal elevator core.",
      "Ground floor dedicated to family living, prayer room, and an open breakfast kitchen.",
      "First floor features three self-contained bedroom suites with individual garden balconies.",
      "Rooftop terrace garden equipped with a shaded yoga pavilion and herb planter beds.",
    ],
    galleryItems: [
      { id: "qh-01", title: "Terracotta Screen Gallery", plateRef: "Plate 01 // Facade Study", aspectRatio: "portrait", caption: "Detail of terracotta jaali screen casting geometric daylight onto the internal stone stair." },
      { id: "qh-02", title: "Minimal Dining Lounge", plateRef: "Plate 02 // Living Perspective", aspectRatio: "landscape", caption: "Seamless Kota stone floor with custom reclaimed teak dining table seating ten." },
      { id: "qh-03", title: "Quiet Library Nook", plateRef: "Plate 03 // Joinery Elevation", aspectRatio: "editorial", caption: "Flush wall-to-wall timber joinery with concealed reader's banquette and garden view." },
    ],
    coverAspect: "portrait",
    areaSqFt: "5,400",
    year: 2024,
    featured: true,
    relatedSlugs: ["courtyard-residence-hyderabad", "renewal-apartment-hyderabad"],
    metaTitle: "The Quiet House, Bengaluru | Aurelle Spaces",
    metaDescription: "A minimalist residential interior concept in Bengaluru featuring terracotta jaali screens, Kota stone, and clutter-free bespoke joinery.",
    demonstrationDisclosure: "Demonstration architectural study developed for DRK Information Software Solutions. Concept work; not an actual client commission.",
  },

  "atelier-workspace-pune": {
    id: "proj-03",
    slug: "atelier-workspace-pune",
    title: "The Atelier Workspace",
    location: "Pune, Maharashtra",
    city: "Pune",
    category: "Commercial Interiors",
    shortDescription:
      "A collaborative workspace balancing focused work areas, meeting spaces and informal interaction.",
    conceptNarrative: [
      "The Atelier Workspace is an adaptive commercial interior designed for a multi-disciplinary creative studio in Pune. Rejecting the sterile anonymity of conventional corporate offices, the design celebrates honest structural materials: architectural concrete arches, fluted glass partitions, and warm brushed brass accents.",
      "The floor plate is organized around an internal central atrium filled with mature indoor fiddle-leaf figs and ficus trees. Acoustically insulated private meeting pods and executive suites surround this central green commons, allowing professionals to transition effortlessly between intense solitary focus and informal team dialogue.",
    ],
    designApproach: [
      {
        title: "Acoustic Zoning Balance",
        narrative: "Noisy communal breakout zones and quiet focus libraries are placed on opposite building axes with acoustic airlocks in between.",
      },
      {
        title: "Exposed Structural Dignity",
        narrative: "Existing cast-concrete columns and ribbed slab ceilings are left exposed, sandblasted, and sealed to provide raw architectural character.",
      },
      {
        title: "Circadian Workplace Lighting",
        narrative: "Indirect high-CRI linear luminaires adjust color temperature from energizing 4000K in the morning to calm 3000K as evening approaches.",
      },
    ],
    keyConsiderations: [
      {
        title: "High-Traffic Surface Durability",
        description: "Flooring utilizes micro-cement and sealed basalt tiles engineered to resist heavy caster-wheel friction and foot traffic.",
      },
      {
        title: "Acoustic Partition Ratings",
        description: "Double-glazed 12mm laminated glass partitions with acoustic drop-seals achieve an STC rating of 44 for sensitive client meetings.",
      },
      {
        title: "Integrated Wire Raceways",
        description: "Zero visible cables across workstations; all power, CAT6A data, and fiber lines run through internal structural floor troughs.",
      },
    ],
    materialPalette: [
      { name: "Raw Architectural Concrete", finish: "Sandblasted & Matte Sealed", role: "Structural Arches & Ceilings", toneHex: "#8E8F8A" },
      { name: "Brushed Brass", finish: "Satin Warm Patina", role: "Custom Hardware & Screen Frames", toneHex: "#A17C55" },
      { name: "Fluted Glazing", finish: "Ribbed Low-Iron Glass", role: "Acoustic Partition Screens", toneHex: "#DCD5CB" },
      { name: "Dark Walnut", finish: "Natural Polyurethane", role: "Boardroom Tables & Wall Paneling", toneHex: "#3A2A20" },
    ],
    spacePlanningNotes: [
      "12,000 sq. ft. single-level corporate floor plate accommodating 85 workstations.",
      "Central 1,200 sq. ft. landscaped coffee lounge and all-hands townhall arena.",
      "Three formal boardrooms (16-person, 10-person, 6-person) with concealed AV screens.",
      "Eight individual acoustic telephone booths for private confidential calls.",
    ],
    galleryItems: [
      { id: "aw-01", title: "Central Atrium Commons", plateRef: "Plate 01 // Communal Axis", aspectRatio: "landscape", caption: "View from the reception desk across the central green atrium toward collaborative work benches." },
      { id: "aw-02", title: "Executive Boardroom", plateRef: "Plate 02 // Interior Elevation", aspectRatio: "widescreen", caption: "Custom 18-foot solid dark walnut boardroom table with fluted glass perimeter partitions." },
      { id: "aw-03", title: "Focus Workstation Pods", plateRef: "Plate 03 // Spatial Detail", aspectRatio: "portrait", caption: "Linear desks framed by acoustic timber slats and brushed brass task lighting bars." },
    ],
    coverAspect: "landscape",
    areaSqFt: "12,000",
    year: 2025,
    featured: true,
    relatedSlugs: ["gallery-office-mumbai", "courtyard-residence-hyderabad"],
    metaTitle: "The Atelier Workspace, Pune | Aurelle Spaces",
    metaDescription: "An ergonomic commercial interior study in Pune blending architectural concrete, fluted glass, brushed brass, and acoustic landscaping.",
    demonstrationDisclosure: "Demonstration architectural study developed for DRK Information Software Solutions. Concept work; not an actual client commission.",
  },

  "veranda-home-chennai": {
    id: "proj-04",
    slug: "veranda-home-chennai",
    title: "The Veranda Home",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    category: "Architecture & Space Planning",
    shortDescription:
      "A residential planning study exploring shaded transitions, ventilation and indoor-outdoor relationships.",
    conceptNarrative: [
      "The Veranda Home is an architectural planning commission exploring how coastal residences along the Bay of Bengal can thrive without continuous air-conditioning dependency. The home is conceived as a series of sheltered open-air pavilions connected by deep, shaded verandas (thinnai).",
      "By elevating the ground floor 1.2 meters above site grade, the structure captures prevailing coastal sea breezes while remaining protected from monsoon flash flooding. Generous 2.4-meter roof cantilevers protect lime-plastered walls from torrential rains and intense tropical solar exposure.",
    ],
    designApproach: [
      {
        title: "Perimeter Veranda Buffer",
        narrative: "Deep wrap-around verandas act as thermal buffers, preventing direct sunlight from striking glass doors and window apertures.",
      },
      {
        title: "Wind Scoop Orientation",
        narrative: "Living volumes are oriented at 15 degrees south-southeast to directly align with Chennai's afternoon coastal sea breeze.",
      },
      {
        title: "Passive Stack Towers",
        narrative: "Two vertical ventilation turrets draw warm air out through operable top louvers, inducing continuous low-velocity interior breezes.",
      },
    ],
    keyConsiderations: [
      {
        title: "Salt Air Corrosion Defense",
        description: "All exposed metal fixings are specified in marine-grade 316 stainless steel with protective bronze anodized coatings.",
      },
      {
        title: "Monsoon Chhajja Protection",
        description: "Overhanging roof eaves with crisp drip edges cast shade over walls and prevent moisture from driving into lime surfaces.",
      },
      {
        title: "Permeable Ground Paving",
        description: "Driveways and courtyards utilize gravel and permeable interlocking stone to encourage 100% on-site rainwater recharge.",
      },
    ],
    materialPalette: [
      { name: "Rough-Chiseled Granite", finish: "Split-Face Natural Quarry", role: "Elevated Plinth Foundation", toneHex: "#54534F" },
      { name: "Lime-Washed Masonry", finish: "Three-Coat Traditional Slake", role: "External Solar Reflective Walls", toneHex: "#F7F4EF" },
      { name: "Weathered Teak Beams", finish: "Raw Linseed Oil Preserved", role: "Veranda Columns & Roof Rafters", toneHex: "#68482D" },
      { name: "Terracotta Roof Tiles", finish: "Hand-Molded Mangalore Kiln", role: "Overhanging Ventilated Roofs", toneHex: "#A24F35" },
    ],
    spacePlanningNotes: [
      "6,600 sq. ft. built-up area situated on a 15,000 sq. ft. coastal garden plot.",
      "1,800 sq. ft. of continuous sheltered veranda living area.",
      "Four private bedroom pavilions clustered around an internal reflective lily pond.",
      "Separate outhouse pavilion for domestic staff quarters, laundry, and gardening equipment.",
    ],
    galleryItems: [
      { id: "vh-01", title: "Veranda Colonnade Study", plateRef: "Plate 01 // Architectural Elevation", aspectRatio: "editorial", caption: "Deep shaded colonnade showing weathered teak columns supporting hand-molded roof eaves." },
      { id: "vh-02", title: "Reflective Lily Courtyard", plateRef: "Plate 02 // Site Plan Perspective", aspectRatio: "landscape", caption: "Internal central water court facilitating evaporative cooling across adjacent dining areas." },
      { id: "vh-03", title: "Ventilation Turret Diagram", plateRef: "Plate 03 // Axonometric Study", aspectRatio: "portrait", caption: "Axonometric diagram showing solar-induced upward air draft through roof louvers." },
    ],
    coverAspect: "editorial",
    areaSqFt: "6,600",
    year: 2025,
    featured: false,
    relatedSlugs: ["courtyard-residence-hyderabad", "quiet-house-bengaluru"],
    metaTitle: "The Veranda Home, Chennai | Aurelle Spaces",
    metaDescription: "A coastal architectural planning study in Chennai exploring deep shaded verandas, passive sea breeze circulation, and lime-washed masonry.",
    demonstrationDisclosure: "Demonstration architectural study developed for DRK Information Software Solutions. Concept work; not an actual client commission.",
  },

  "gallery-office-mumbai": {
    id: "proj-05",
    slug: "gallery-office-mumbai",
    title: "The Gallery Office",
    location: "Mumbai, Maharashtra",
    city: "Mumbai",
    category: "Commercial Interiors",
    shortDescription:
      "A contemporary office concept with considered circulation, meeting areas and material continuity.",
    conceptNarrative: [
      "The Gallery Office is an executive workplace designed for a boutique private equity and advisory firm in Nariman Point, Mumbai. Overlooking views of the Arabian Sea, the brief called for a space that felt like an art gallery: disciplined, uncluttered, and composed with understated prestige.",
      "The layout abandons cubicles and plastic finishes. Instead, a central limestone-paved circulation spine (the Gallery) curates curated architectural sculptures and prints, branching gracefully into private partner chambers, client dining salons, and state-of-the-art deal rooms.",
    ],
    designApproach: [
      {
        title: "Curatorial Spine Organization",
        narrative: "A central gallery axis creates an unhurried, ceremonial sense of arrival before guests transition to meeting chambers.",
      },
      {
        title: "Material Continuity",
        narrative: "Limestone flooring and smoked European oak paneling carry through both public and private suites, establishing visual cohesion.",
      },
      {
        title: "Acoustic Seclusion",
        narrative: "Deal rooms feature acoustic ceiling baffles and fabric-clad wall panels to guarantee absolute confidentiality.",
      },
    ],
    keyConsiderations: [
      {
        title: "Severe Maritime Humidity",
        description: "All perimeter glazing seals and metal frames use corrosion-resistant finishes designed for Mumbai's harsh coastal salinity.",
      },
      {
        title: "High-Density Data Backbones",
        description: "Redundant fiber-optic pathways and low-latency server closets are seamlessly concealed behind flush wood veneer wall panels.",
      },
      {
        title: "Glare Reduction on Harbor Views",
        description: "Motorized low-emissivity mesh roller shades reduce sea glare without eliminating daytime panoramic harbor vistas.",
      },
    ],
    materialPalette: [
      { name: "Jaisalmer Limestone", finish: "Honed Velvet Texture", role: "Gallery Spine & Foyer Floors", toneHex: "#D8C7A5" },
      { name: "Smoked Oak", finish: "Wire-Brushed Natural Wax", role: "Perimeter Wall Paneling & Doors", toneHex: "#4A3A2C" },
      { name: "Acoustic Linen Fabric", finish: "Textured Natural Weave", role: "Boardroom Wall Treatments", toneHex: "#DCD5CB" },
      { name: "Graphite Anodized Metal", finish: "Ultra-Matte Powder Coat", role: "Apertures & Lighting Channels", toneHex: "#242522" },
    ],
    spacePlanningNotes: [
      "8,500 sq. ft. high-floor commercial floor plate with 180-degree ocean views.",
      "Four senior partner suites with private discussion lounges and en-suite washrooms.",
      "Main 20-person formal board suite equipped with discreet dual-display video walls.",
      "Private client dining room with dedicated warming pantry and wine presentation niche.",
    ],
    galleryItems: [
      { id: "go-01", title: "The Gallery Arrival Spine", plateRef: "Plate 01 // Arrival Perspective", aspectRatio: "widescreen", caption: "Honed limestone floor leading toward the harbor horizon, flanked by smoked oak panels." },
      { id: "go-02", title: "Senior Partner Suite", plateRef: "Plate 02 // Executive Study", aspectRatio: "portrait", caption: "Bespoke oak desk with built-in leather desk blotter and views toward the Marine Drive bay." },
      { id: "go-03", title: "Client Private Salon", plateRef: "Plate 03 // Detail Perspective", aspectRatio: "landscape", caption: "Acoustic fabric wall panels with concealed AV screen behind sliding walnut art frames." },
    ],
    coverAspect: "widescreen",
    areaSqFt: "8,500",
    year: 2024,
    featured: false,
    relatedSlugs: ["atelier-workspace-pune", "courtyard-residence-hyderabad"],
    metaTitle: "The Gallery Office, Mumbai | Aurelle Spaces",
    metaDescription: "An executive commercial interior study in Mumbai featuring limestone gallery circulation, smoked oak joinery, and private deal suites.",
    demonstrationDisclosure: "Demonstration architectural study developed for DRK Information Software Solutions. Concept work; not an actual client commission.",
  },

  "renewal-apartment-hyderabad": {
    id: "proj-06",
    slug: "renewal-apartment-hyderabad",
    title: "The Renewal Apartment",
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    category: "Renovation & Refurbishment",
    shortDescription:
      "An apartment renovation study focused on improved space utilisation, storage and natural light.",
    conceptNarrative: [
      "The Renewal Apartment is an interior refurbishment of an aging 3,800 sq. ft. flat in Banjara Hills, Hyderabad. Built in the late 1990s, the original layout suffered from compartmentalized dark corridors, an oversized disjointed utility area, and inadequate wardrobe storage.",
      "Our intervention began with a structural audit to determine which internal brick walls were non-load-bearing. By removing walls between the kitchen, living room, and balcony, we unlocked a luminous, flowing open-plan family living suite with panoramic views across the city skyline.",
    ],
    designApproach: [
      {
        title: "Forensic Wall Removal",
        narrative: "Five non-structural masonry walls were dismantled, doubling the perceived living volume and drawing cross-breezes across the apartment.",
      },
      {
        title: "Hidden Storage Infrastructure",
        narrative: "A 14-meter continuous flush joinery wall conceals shoes, suitcases, electrical distribution panels, and a hidden home bar.",
      },
      {
        title: "Complete Services Overhaul",
        narrative: "Every plumbing pipe, sewage stack, and electrical run was replaced with modern food-grade piping and concealed multi-split air-conditioning.",
      },
    ],
    keyConsiderations: [
      {
        title: "Structural Slab Weight Limits",
        description: "New partition walls utilize lightweight autoclaved aerated concrete (AAC) blocks and steel studs to prevent excess structural dead load.",
      },
      {
        title: "Sunken Slab Waterproofing",
        description: "All three bathrooms were stripped to bare RCC slabs, treated with crystalline waterproofing, and pond-tested for 72 hours before finishes.",
      },
      {
        title: "Acoustic Ceiling Treatment",
        description: "Suspended moisture-resistant gypsum ceilings with rockwool insulation eliminate footstep transmission from apartments above.",
      },
    ],
    materialPalette: [
      { name: "Crema Marfil Marble", finish: "Refined Matte Diamond Polish", role: "Living & Corridor Flooring", toneHex: "#E5DEC9" },
      { name: "Fluted Ash Wood", finish: "Bleached Natural Matte", role: "Continuous Joinery Wall", toneHex: "#D0C8B8" },
      { name: "Champagne Bronze", finish: "Satin Anodized Aluminum", role: "Sliding Partition Frames", toneHex: "#BFA17A" },
      { name: "Textured Microcement", finish: "Waterproof Seamless Finish", role: "Master Ensuite Bath Walls", toneHex: "#C5C2BA" },
    ],
    spacePlanningNotes: [
      "3,800 sq. ft. high-rise apartment in a mature residential tower.",
      "Converted from a disjointed 4-BHK to an expansive, flowing 3-BHK with a dedicated study.",
      "Added a 160 sq. ft. walk-in master wardrobe with tailored internal jewelry and accessories drawers.",
      "Upgraded laundry room with stacked Miele washer/dryer and concealed drying rack.",
    ],
    galleryItems: [
      { id: "ra-01", title: "Open-Plan Living Suite", plateRef: "Plate 01 // Reconfigured Layout", aspectRatio: "widescreen", caption: "Daylit living and dining volume created by opening non-structural partition walls." },
      { id: "ra-02", title: "Master Suite & Joinery", plateRef: "Plate 02 // Bedroom Study", aspectRatio: "portrait", caption: "Fluted ash wood headboard wall with concealed acoustic buffer toward neighboring corridor." },
      { id: "ra-03", title: "Minimal Kitchen & Breakfast Bar", plateRef: "Plate 03 // Culinary Layout", aspectRatio: "landscape", caption: "Quartz waterfall breakfast island replacing the original dark enclosed kitchen wall." },
    ],
    coverAspect: "widescreen",
    areaSqFt: "3,800",
    year: 2025,
    featured: false,
    relatedSlugs: ["quiet-house-bengaluru", "courtyard-residence-hyderabad"],
    metaTitle: "The Renewal Apartment, Hyderabad | Aurelle Spaces",
    metaDescription: "An apartment renovation and spatial refurbishment study in Hyderabad transforming a dated layout into a light-filled contemporary home.",
    demonstrationDisclosure: "Demonstration architectural study developed for DRK Information Software Solutions. Concept work; not an actual client commission.",
  },
};

