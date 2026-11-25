/**
 * Aurelle Spaces — Comprehensive Services Data & Detail Records
 * 
 * Centralized, typed content repository for all studio design disciplines.
 * Prepared for future migration to Cloudflare D1.
 */

export interface ServiceDetail {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  heroSynopsis: string;
  overview: string[];
  scopeItems: {
    category: string;
    description: string;
    points: string[];
  }[];
  approach: {
    title: string;
    narrative: string;
  }[];
  keyConsiderations: {
    title: string;
    description: string;
  }[];
  relevantProjects: {
    title: string;
    city: string;
    typology: string;
    slug: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  metaTitle: string;
  metaDescription: string;
}

export const servicesData: Record<string, ServiceDetail> = {
  "residential-interiors": {
    slug: "residential-interiors",
    number: "01",
    title: "Residential Interiors",
    shortDescription:
      "Bespoke joinery, tailored spatial flow, materiality curation, and atmospheric lighting schemes crafted for private residences, duplexes, and villas.",
    heroSynopsis:
      "We design home interiors that celebrate the quiet rituals of domestic life. From custom teak millwork to monsoon-appropriate natural stones, every element is planned for everyday comfort and lasting dignity.",
    overview: [
      "Our residential interior service begins by observing how your family lives: your morning rhythms, cooking habits, entertaining preferences, and storage requirements. Rather than following transient decor fads, we develop bespoke spatial responses that emphasize tactile craftsmanship, natural daylight, and effortless circulation.",
      "We treat every room—from formal living verandas to quiet master bedrooms—as an intimate volume shaped by generous proportions, integrated joinery, and honest materials. We work in close dialogue with skilled regional carpenters, stone masons, and lighting specialists across India.",
    ],
    scopeItems: [
      {
        category: "Living & Entertaining Spaces",
        description: "Public and family lounges planned around conversation, cross-ventilation, and visual connection with courtyard or outdoor greenery.",
        points: ["Spatial zoning and circulation planning", "Custom architectural display joinery", "Hand-finished plaster and stone accent walls", "Acoustically balanced soft furnishings"],
      },
      {
        category: "Private Bedrooms & Suites",
        description: "Quiet sanctuaries designed for restorative rest, acoustically buffered from active household zones.",
        points: ["Custom headboard and floating nightstand joinery", "Concealed ambient and task lighting", "Walk-in wardrobe planning with moisture-resistant detailing", "Ensuite bath spatial and sanitary layouts"],
      },
      {
        category: "Kitchens & Culinary Spaces",
        description: "Highly functional wet and dry kitchen planning adapted to Indian cooking demands and modern culinary habits.",
        points: ["Ergonomic counter heights and heavy-duty quartz/granite surfaces", "Concealed spice storage, pantry larder, and ventilation routing", "Integrated appliance housing and utility room zoning", "Durable, easy-maintenance finish specifications"],
      },
      {
        category: "Bespoke Storage & Joinery Planning",
        description: "Seamless, built-in storage solutions that reduce visual clutter while maximizing storage capacity.",
        points: ["Full-height wardrobe systems with tailored internal fittings", "Integrated shoe galleries and luggage storage", "Concealed electrical access panels and discreet air-conditioning grilles", "Solid timber and veneer selection with low-VOC finishes"],
      },
    ],
    approach: [
      {
        title: "Spatial Proportions & Airflow",
        narrative: "We prioritize natural breeze paths and ceiling heights before decorative finishes. Indian homes thrive when air moves freely across living verandas and private courtyards.",
      },
      {
        title: "Layered Lighting Schemes",
        narrative: "We avoid harsh downlighting grids. Instead, we layer warm concealed cove lighting, architectural picture lights, and low-level task lamps to create warm, inviting evening atmospheres.",
      },
      {
        title: "Tactile Regional Materiality",
        narrative: "Basalt, Kota stone, honed marble, brass joinery, and oiled Burma teak are selected not just for beauty, but for how they cool the ambient space and develop a rich patina over decades.",
      },
    ],
    keyConsiderations: [
      {
        title: "Climatic Humidity & Monsoon Resilience",
        description: "All internal cabinetry and substrate boards are specified with moisture-resistant boiling-water-proof (BWR) grades and ventilated plenums to prevent dampness during prolonged monsoon months.",
      },
      {
        title: "Acoustic Separation in Shared Homes",
        description: "We use solid-core doors, concealed acoustic seals, and strategic buffer zones between high-activity social spaces and quiet family bedrooms.",
      },
      {
        title: "Future Adaptability",
        description: "Joinery and room configurations are designed to adapt smoothly as children grow or multi-generational family requirements evolve over time.",
      },
    ],
    relevantProjects: [
      {
        title: "The Courtyard Residence",
        city: "Hyderabad",
        typology: "Residential Architecture",
        slug: "courtyard-residence-hyderabad",
      },
      {
        title: "The Quiet House",
        city: "Bengaluru",
        typology: "Bespoke Residence",
        slug: "quiet-house-bengaluru",
      },
    ],
    faqs: [
      {
        question: "What scale of residential projects do you typically undertake?",
        answer: "We focus on comprehensive residential interior commissions—including complete duplex apartments, independent bungalows, and full-home renovations typically starting from 2,500 sq. ft. onwards.",
      },
      {
        question: "Do you supply loose furniture and decorative artifacts?",
        answer: "Yes. Alongside bespoke built-in millwork, we curate loose furniture collections, artisanal lighting, area rugs, and custom pieces commissioned directly from reputable Indian craftsmen.",
      },
      {
        question: "How do you coordinate with on-site contractors?",
        answer: "We prepare exhaustive Good-for-Construction (GFC) drawing packages with exact millwork elevations and conduct regular site coordination reviews to verify execution quality.",
      },
    ],
    metaTitle: "Residential Interiors | Aurelle Spaces",
    metaDescription: "Bespoke residential interior architecture across India. Custom joinery, living spaces, kitchens, and lighting designed for timeless comfort and practical elegance.",
  },

  "commercial-interiors": {
    slug: "commercial-interiors",
    number: "02",
    title: "Commercial Interiors",
    shortDescription:
      "Executive offices, boutique studios, and collaborative workplaces planned to balance distinct brand presence with day-to-day ergonomic utility.",
    heroSynopsis:
      "We design professional workplaces that support focused individual work, executive presence, and informal collaboration through disciplined spatial zoning and refined acoustic materiality.",
    overview: [
      "Modern workplaces require more than rows of uniform desks. We view commercial interiors as civic environments that must support diverse working styles: concentrated heads-down analysis, confidential leadership meetings, and energetic team discussions.",
      "Our commercial work avoids loud corporate gimmicks in favor of architectural quiet: acoustic timber paneling, naturally daylit workstations, discrete storage, and thoughtful circulation routes that elevate the everyday work experience for founders, executives, and visiting clients.",
    ],
    scopeItems: [
      {
        category: "Executive Suites & Boardrooms",
        description: "Distinguished meeting and leadership spaces equipped for high-stakes presentations and seamless video conferencing.",
        points: ["Custom boardroom tables with integrated power/data management", "Fabric-wrapped acoustic wall systems", "Automated blackout and solar glare blinds", "Integrated credenzas and beverage hospitality bars"],
      },
      {
        category: "Open Workstation Neighborhoods",
        description: "Ergonomically planned desking clusters that foster collaboration without compromising acoustic privacy.",
        points: ["Bespoke linear desking with wire management channels", "Low-height planter and acoustic divider screens", "Glare-free indirect task and ambient lighting", "Proximity to perimeter windows and natural light"],
      },
      {
        category: "Reception & Client Welcome Galleries",
        description: "Understated arrival zones that communicate corporate stature, architectural restraint, and warm hospitality.",
        points: ["Monolithic stone reception desks with concealed administrative equipment", "Comfortable client waiting lounges with curated monographs", "Discreet coat, luggage, and umbrella storage for visitors", "Subtle architectural signage and branded materiality"],
      },
      {
        category: "Breakout Cafés & Informal Touchdowns",
        description: "Casual communal spaces that encourage spontaneous cross-team interaction away from primary desk areas.",
        points: ["Pantry counter planning with commercial-grade brewing stations", "Acoustically isolated telephone phonebooths", "High-counter collaborative touchdown perches", "Resilient, stain-resistant flooring finishes"],
      },
    ],
    approach: [
      {
        title: "Acoustic Comfort by Design",
        narrative: "We integrate sound-absorbing ceiling baffles, micro-perforated timber panels, and high-performance glass partitions to keep speech intelligible without noisy echo.",
      },
      {
        title: "Circulation & Visual Sightlines",
        narrative: "Wide, logical corridors and subtle spatial transitions prevent bottlenecks and maintain calm order even during busy peak office hours.",
      },
      {
        title: "Biophilic Integration",
        narrative: "Indoor planting troughs, courtyard light wells, and natural timber surfaces reconnect desk-bound professionals with natural outdoor rhythms.",
      },
    ],
    keyConsiderations: [
      {
        title: "Cable & Infrastructure Concealment",
        description: "All power, high-speed data, and AV lines are planned inside concealed raised access floors or flush joinery raceways for clean visual maintenance.",
      },
      {
        title: "Commercial Fire & Safety Codes",
        description: "All finishes, fabrics, and doors are specified to meet non-combustible ratings and National Building Code of India (NBC) exit compliance.",
      },
      {
        title: "Energy-Efficient Lighting Control",
        description: "Occupancy sensors, daylight harvesting, and 3000K-4000K circadian LED systems optimize operational utility costs and staff well-being.",
      },
    ],
    relevantProjects: [
      {
        title: "The Atelier Workspace",
        city: "Pune",
        typology: "Commercial Architecture",
        slug: "atelier-workspace-pune",
      },
    ],
    faqs: [
      {
        question: "What is your typical project timeline for an executive commercial interior?",
        answer: "A standard commercial interior ranging from 5,000 to 15,000 sq. ft. generally requires 8–10 weeks of detailed design and coordination followed by a phased 12–16 week execution period.",
      },
      {
        question: "Can you design according to specific corporate brand guidelines?",
        answer: "Yes. We translate corporate brand standards into sophisticated spatial environments, avoiding loud logos in favor of subtle materiality, custom architectural signage, and palette restraint.",
      },
    ],
    metaTitle: "Commercial Interiors | Aurelle Spaces",
    metaDescription: "Sophisticated commercial interiors, executive offices, and ergonomic workspaces across India. Designed for focus, collaboration, and timeless corporate presence.",
  },

  "architecture-space-planning": {
    slug: "architecture-space-planning",
    number: "03",
    title: "Architecture & Space Planning",
    shortDescription:
      "Ground-up architectural design, site orientation, passive climatic ventilation, and cohesive structural layout coordination.",
    heroSynopsis:
      "We design buildings from the inside out: understanding how rooms receive sunlight, how breezes flow across living levels, and how built forms respond honestly to their site topography.",
    overview: [
      "Architecture at Aurelle Spaces begins with the geography of the site: sun paths, prevailing winds, local soil, neighboring structures, and existing mature trees. We craft residences and pavilions where interior volumes and exterior envelopes form a seamless whole.",
      "We emphasize spatial efficiency, generous vertical proportions, and regional climatic strategies. By balancing private family zones with welcoming verandas and courtyards, our architectural planning delivers spaces that feel generous, grounded, and dignified without superfluous square footage.",
    ],
    scopeItems: [
      {
        category: "Site & Microclimate Analysis",
        description: "Thorough orientation studies to maximize winter sunlight, capture monsoon breezes, and shield living areas from harsh afternoon solar heat.",
        points: ["Contour and solar shading simulation", "Wind rose diagramming and cross-flow analysis", "Tree preservation and landscape integration", "Site entry and vehicle circulation planning"],
      },
      {
        category: "Volumetric Layout & Massing",
        description: "Three-dimensional development of floor plates, ceiling volumes, courtyards, and vertical circulation spines.",
        points: ["Functional zoning (public, semi-private, private)", "Double-height voids and light-well positioning", "Staircase and corridor architectural sculpting", "Outdoor terrace and veranda transitions"],
      },
      {
        category: "Climatic Facade Engineering",
        description: "Exterior envelope detailing featuring deep overhangs, masonry shading fins, jaalis, and recessed glazing.",
        points: ["Deep chhajjas (overhangs) for monsoon rain protection", "Terracotta and stone jaali screens for filtered daylight", "Thermal mass wall detailing for passive cooling", "High-performance double-glazed aperture specifications"],
      },
      {
        category: "Structural & MEP Coordination",
        description: "Collaborative coordination with structural engineers, public health consultants, and electrical planners.",
        points: ["Column grid alignment with interior partition layouts", "Concealed rainwater harvesting and drainage routing", "Air-conditioning duct shafts and outdoor unit concealment", "Municipal drawing sets and regulatory coordination"],
      },
    ],
    approach: [
      {
        title: "Inside-Out Spatial Planning",
        narrative: "We never design an exterior facade first. The external form is an honest, sculptural expression of internal living spaces, structural spans, and natural openings.",
      },
      {
        title: "Passive Thermal Strategy",
        narrative: "By orienting courtyards to induce thermal stack ventilation, our homes stay significantly cooler during hot Indian summers with reduced mechanical cooling reliance.",
      },
      {
        title: "Respect for Context",
        narrative: "Whether building on an undulating red-soil site in Bengaluru or a dense urban plot in Hyderabad, our buildings speak respectfully to their regional setting.",
      },
    ],
    keyConsiderations: [
      {
        title: "Regional Rain & Monsoon Detailing",
        description: "Generous roof slopes, drip moulds, concealed gutters, and water-shedding copings are detailed to protect external masonry over decades of severe monsoon seasons.",
      },
      {
        title: "Structural Span Economy",
        description: "We optimize structural column grids to achieve expansive column-free living areas without demanding inefficient, excessively heavy structural transfer slabs.",
      },
      {
        title: "Universal Accessibility",
        description: "Gentle site ramps, elevator shaft provisions, and step-free transitions between living rooms and outdoor verandas ensure comfortable living for all generations.",
      },
    ],
    relevantProjects: [
      {
        title: "The Courtyard Residence",
        city: "Hyderabad",
        typology: "Residential Architecture",
        slug: "courtyard-residence-hyderabad",
      },
      {
        title: "The Quiet House",
        city: "Bengaluru",
        typology: "Bespoke Residence",
        slug: "quiet-house-bengaluru",
      },
    ],
    faqs: [
      {
        question: "Do you handle municipality and local authority approvals?",
        answer: "We prepare comprehensive architectural sets aligned with local development control regulations and work alongside certified municipal liaisons to coordinate statutory plan submissions.",
      },
      {
        question: "Can you work with our appointed structural engineer and civil contractor?",
        answer: "Yes. We maintain collaborative working partnerships with independent structural engineers, MEP consultants, and civil contractors appointed by the client.",
      },
    ],
    metaTitle: "Architecture & Space Planning | Aurelle Spaces",
    metaDescription: "Ground-up architectural design, solar analysis, and spatial planning across India. Climate-responsive residences planned with proportion, dignity, and material clarity.",
  },

  "renovation-refurbishment": {
    slug: "renovation-refurbishment",
    number: "04",
    title: "Renovation & Refurbishment",
    shortDescription:
      "Sensitive rejuvenation of heritage residences and mid-century apartments, preserving authentic architectural character while upgrading modern systems.",
    heroSynopsis:
      "Transforming existing spaces requires diagnostic precision and historical respect. We reconfigure outdated floor plans, upgrade electrical and plumbing backbones, and breathe new life into older structures.",
    overview: [
      "Renovating an existing property is often more complex than building from scratch. It demands careful forensic analysis of existing load-bearing masonry, hidden electrical routings, water seepage vulnerabilities, and original architectural details worthy of preservation.",
      "We help property owners reimagine older apartments, bungalows, and commercial spaces for contemporary living. By knocking down restrictive non-structural walls, introducing natural daylight into dark cores, and modernizing mechanical systems, we reveal the hidden potential of your property.",
    ],
    scopeItems: [
      {
        category: "Structural & Condition Audit",
        description: "Forensic assessment of existing foundations, load-bearing masonry, slab integrity, and dampness ingress.",
        points: ["Identification of non-load-bearing versus structural walls", "Moisture mapping and damp-proofing strategy", "Assessment of plumbing pipelines and electrical capacity", "Architectural measure-drawing verification"],
      },
      {
        category: "Spatial Reconfiguration",
        description: "Removing awkward partitions to create flowing living suites, open-plan kitchens, and enlarged bathrooms.",
        points: ["Kitchen and pantry relocation with new drainage lines", "Merging compact rooms into generous master suites", "Creation of dedicated utility and laundry zones", "Addition of walk-in wardrobes and contemporary ensuites"],
      },
      {
        category: "Building Services Modernization",
        description: "Complete overhaul of obsolete plumbing, wiring, and air-conditioning systems to modern standards.",
        points: ["Replacement of corroded GI pipes with food-grade CPVC/PEX", "New three-phase electrical distribution boards and earth leak safety", "Discreet multi-split or VRV air-conditioning integration", "High-speed Ethernet and home automation infrastructure"],
      },
      {
        category: "Restoration & Surface Upgrades",
        description: "Polishing vintage timber, restoring heritage terrazzo or mosaic floors, and applying breathable lime plasters.",
        points: ["Restoration of seasoned teak doors, windows, and hardware", "Honing and diamond-polishing of heritage stone floors", "Application of breathable lime-based paints and micro-cement", "Custom architectural joinery tailored to unique wall dimensions"],
      },
    ],
    approach: [
      {
        title: "Preserving Authentic Character",
        narrative: "We preserve what has soul: high ceilings, hand-cast brass handles, solid timber doors, and vintage floor inlays, blending them seamlessly with contemporary comforts.",
      },
      {
        title: "Phased Disruption Management",
        narrative: "We plan demolition, structural retrofitting, and wet-work in logical phases to prevent unnecessary delays and maintain clean, organized site conditions.",
      },
      {
        title: "Forensic Troubleshooting",
        narrative: "Renovations reveal unexpected site surprises. Our architects actively inspect the site during demolition to adapt drawings promptly without compromising structural integrity.",
      },
    ],
    keyConsiderations: [
      {
        title: "Society & Municipal Renovation Regulations",
        description: "In apartment communities, we coordinate with housing society committees regarding debris removal timing, work hours, and plumbing shaft access.",
      },
      {
        title: "Waterproofing Integrity",
        description: "All wet areas, sunken slabs, and terrace extensions receive multi-layer elastomeric waterproofing and rigorous 72-hour pond testing before tiling.",
      },
      {
        title: "Structural Span Limitations",
        description: "We never tamper with structural beams or load-bearing columns. All open layouts are verified with structural calculations before demolition.",
      },
    ],
    relevantProjects: [
      {
        title: "The Quiet House",
        city: "Bengaluru",
        typology: "Bespoke Residence",
        slug: "quiet-house-bengaluru",
      },
    ],
    faqs: [
      {
        question: "Can we live in the home while the renovation takes place?",
        answer: "For comprehensive gut renovations involving plumbing and electrical overhauls, we strongly advise temporary relocation during active civil demolition and wet trades to ensure safety and speed.",
      },
      {
        question: "How do you handle unexpected structural issues discovered during demolition?",
        answer: "Our project architects perform on-site structural inspections during the strip-out phase. If hidden structural issues emerge, we formulate engineered solutions before advancing finishes.",
      },
    ],
    metaTitle: "Renovation & Refurbishment | Aurelle Spaces",
    metaDescription: "Expert architectural renovation and refurbishment across India. Upgrading heritage residences and apartments with modern spatial flow, new services, and restored character.",
  },
};

