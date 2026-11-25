/**
 * Aurelle Spaces — Centralized Journal & Editorial Articles Data
 * 
 * Contains original, in-depth architectural and spatial essays.
 * Structured for future Cloudflare D1 database persistence.
 */

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  quote?: {
    text: string;
    attribution: string;
  };
}

export interface JournalArticleDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publicationDate: string;
  readingTime: string;
  featured: boolean;
  coverAspect: "landscape" | "portrait" | "widescreen" | "editorial";
  sections: ArticleSection[];
  keyTakeaways: string[];
  relatedSlugs: string[];
  metaTitle: string;
  metaDescription: string;
}

export const journalArticles: Record<string, JournalArticleDetail> = {
  "planning-a-home-that-works-for-everyday-life": {
    id: "art-01",
    slug: "planning-a-home-that-works-for-everyday-life",
    title: "Planning a Home That Works for Everyday Life",
    category: "Residential Design",
    excerpt:
      "Why thoughtful residential architecture begins not with luxury decor, but with the quiet choreography of family rituals, natural light, and storage that eliminates domestic friction.",
    publicationDate: "15 November 2025",
    readingTime: "6 min read",
    featured: true,
    coverAspect: "widescreen",
    sections: [
      {
        heading: "Observing Domestic Habits Before Drafting Walls",
        paragraphs: [
          "Most residential floor plans fail not because they lack square footage, but because they are drawn to impress visitors rather than comfort the people who wake up inside them every morning. A home must be designed around real domestic habits: where you drop your keys and mail, where children take off muddy school shoes, how the morning newspaper is read, and who makes tea at 6:00 AM without waking the rest of the household.",
          "When we begin a residential commission in India, our first conversations are never about marble varieties or imported taps. We ask families about their quietest daily rituals. A home that accommodates these mundane routines with effortless ease produces a profound sense of psychological calm.",
        ],
        quote: {
          text: "True luxury in domestic architecture is the complete absence of daily spatial frustration.",
          attribution: "Aurelle Spaces Editorial Notes",
        },
      },
      {
        heading: "The Choreography of Movement & Visual Buffer Zones",
        paragraphs: [
          "In many contemporary Indian apartments, the front door opens directly into the primary living room. Deliveries, maintenance staff, and unexpected visitors instantly penetrate the private sanctuary of the home. Thoughtful planning always introduces a gentle buffer: an entry vestibule, a screened thinnai, or a short turn in the foyer that preserves privacy.",
          "Similarly, circulation paths must be protected. You should never have to cross through the middle of a formal conversation seating circle simply to walk from the bedroom corridor to the kitchen. Direct, unencumbered circulation corridors keep communal spaces peaceful.",
        ],
      },
      {
        heading: "Storage That Conceals Without Overwhelming",
        paragraphs: [
          "Clutter is rarely a failure of household discipline; it is an architectural symptom of inadequate, poorly located storage. In Indian homes, storage needs are specific: heavy monsoon blankets, festive brassware, bulk pantry provisions, suitcases, and seasonal footwear all demand dedicated homes.",
          "We advocate for full-height flush joinery integrated directly into structural wall recesses. When wardrobes and cabinets share the same material and plane as the surrounding plaster, storage expands dramatically while the visual perception of the room remains spacious and calm.",
        ],
      },
      {
        heading: "Designing for Light & Natural Airflow in Indian Climates",
        paragraphs: [
          "Artificial cooling cannot replace the physical pleasure of a natural morning breeze. In tropical and subtropical Indian regions, rooms should ideally benefit from dual-aspect windows—openings on opposite or adjacent walls that draw cross-ventilation across the living zone.",
          "Deep roof overhangs (chhajjas) and external louvers allow windows to remain open even during heavy monsoon showers, preventing rooms from feeling stuffy and humid.",
        ],
      },
      {
        heading: "Flexibility Across Generations",
        paragraphs: [
          "Indian households frequently transition over decades: elderly parents visit for prolonged stays, young children become teenagers needing quiet study corners, and working professionals require focused home offices. Designing rooms with adaptable proportions rather than hyper-specialized single-purpose layouts ensures that a home continues to serve its family twenty years after handover.",
        ],
      },
    ],
    keyTakeaways: [
      "Prioritize everyday family rituals and morning routines over superficial showroom aesthetics.",
      "Incorporate entry buffer vestibules to maintain domestic privacy from external deliveries.",
      "Integrate flush wall-to-wall joinery to swallow bulky storage without eating into visual space.",
      "Ensure dual-aspect openings for cross-ventilation that functions during monsoon downpours.",
      "Design flexible room proportions that adapt smoothly as multi-generational needs evolve.",
    ],
    relatedSlugs: ["choosing-materials-with-care", "making-better-use-of-compact-spaces"],
    metaTitle: "Planning a Home That Works for Everyday Life | Aurelle Spaces Journal",
    metaDescription: "An architectural guide to planning residential interiors around family rituals, circulation flow, built-in storage, and climatic cross-ventilation in India.",
  },

  "choosing-materials-with-care": {
    id: "art-02",
    slug: "choosing-materials-with-care",
    title: "Choosing Materials with Care",
    category: "Materials & Finishes",
    excerpt:
      "A considered guide to selecting regional stone, solid seasoned timber, and lime plaster that withstand monsoon humidity, develop a rich patina, and endure for decades.",
    publicationDate: "28 October 2025",
    readingTime: "7 min read",
    featured: false,
    coverAspect: "landscape",
    sections: [
      {
        heading: "The Myth of Maintenance-Free Surfaces",
        paragraphs: [
          "Marketing brochures often promise 'maintenance-free' high-gloss synthetic materials. In reality, artificial films, plastic laminates, and composite quartz countertops do not age—they merely deteriorate. When a synthetic laminate chips or scratches, it looks ruined. In contrast, natural materials—like honed limestone, solid teak, and cast bronze—gain dignity and warmth through everyday wear.",
          "Choosing materials with care means embracing finishes that develop a gentle patina over time. A home should not look like a sterile museum that instills anxiety; it should welcome children, family meals, and the natural passage of seasons.",
        ],
        quote: {
          text: "Materials chosen for their honesty do not deteriorate with use; they record the quiet history of a family's life.",
          attribution: "Materiality Notes // Aurelle Spaces",
        },
      },
      {
        heading: "Regional Stones: Basalt, Kota, and Jaisalmer",
        paragraphs: [
          "India possesses some of the world's finest architectural stone quarries. Green Kota stone from Rajasthan stays naturally cool during blistering dry months and possesses a soft, non-reflective matte sheen when honed. Dense Deccan basalt from Maharashtra provides superb compressive strength and water resilience for ground-floor courtyards and damp verandas.",
          "Using regional stones also avoids the environmental cost and supply vulnerabilities of shipping soft, fragile foreign marbles that struggle against acidic Indian culinary ingredients like tamarind, turmeric, and lemon juice.",
        ],
      },
      {
        heading: "Seasoned Timbers & Natural Oils vs. Artificial Finishes",
        paragraphs: [
          "Solid timber expands and contracts in response to India's dramatic humidity swings between dry pre-summer heat and torrential monsoon moisture. Specifying well-seasoned, sustainably harvested teak or rosewood with moisture content below 12% is essential.",
          "Rather than suffocating fine timber beneath thick, plastic-like high-gloss polyurethane coatings, we finish architectural joinery with breathable linseed oils, beeswax, and low-VOC natural seals that preserve the warm grain and natural aroma of the wood.",
        ],
      },
      {
        heading: "Breathable Plasters in Humid Microclimates",
        paragraphs: [
          "Modern synthetic emulsion paints create an impermeable plastic skin over masonry walls. When moisture migrates through brickwork during monsoon months, this trapped moisture causes bubbling, peeling, and mold. Traditional lime plasters (chuna) and mineral silicate paints are naturally vapor-permeable, allowing walls to breathe and naturally deterring fungal growth.",
        ],
      },
      {
        heading: "Budget Allocation: Where Quality Truly Counts",
        paragraphs: [
          "When planning a renovation or new build, allocate resources where hands and feet touch surfaces constantly: door handles, kitchen countertops, bathroom mixers, and flooring. Decorative wall paneling can always be simplified, but poorly made window hinges or cheap bathroom faucets will cause daily irritation within months.",
        ],
      },
    ],
    keyTakeaways: [
      "Select natural materials that patina with age rather than synthetic plastics that degrade.",
      "Leverage regional Indian stones like Kota, Basalt, and Kadappa for climatic and culinary resilience.",
      "Use seasoned timber with moisture content below 12% and breathable natural oil finishes.",
      "Specify breathable lime-based or mineral plasters to prevent monsoon paint peeling.",
      "Invest primary budget into high-touch elements: ironmongery, joinery hardware, and stone flooring.",
    ],
    relatedSlugs: ["planning-a-home-that-works-for-everyday-life", "making-better-use-of-compact-spaces"],
    metaTitle: "Choosing Materials with Care | Aurelle Spaces Journal",
    metaDescription: "An architect's guide to regional Indian stones, seasoned timber joinery, lime plaster, and durable material selection for lasting homes.",
  },

  "making-better-use-of-compact-spaces": {
    id: "art-03",
    slug: "making-better-use-of-compact-spaces",
    title: "Making Better Use of Compact Spaces",
    category: "Space Planning",
    excerpt:
      "How disciplined circulation, dual-purpose joinery, and vertical ceiling volume can make 1,200 to 2,000 sq. ft. urban apartments feel luminous, expansive, and deeply peaceful.",
    publicationDate: "10 October 2025",
    readingTime: "5 min read",
    featured: false,
    coverAspect: "editorial",
    sections: [
      {
        heading: "Why Clutter is a Planning Failure, Not a Storage Deficiency",
        paragraphs: [
          "In high-density Indian metros like Mumbai, Bengaluru, and Hyderabad, apartments between 1,200 and 2,000 sq. ft. often feel congested not because of family possessions, but because space planning is fragmented. When bulky standalone wardrobes, deep sofa sets, and oversized dining tables are wedged into compact rooms, circulation paths become obstacle courses.",
          "Space planning in compact homes is an exercise in visual editing: identifying the essential daily functions and eliminating intermediate dead zones.",
        ],
        quote: {
          text: "A compact home planned with discipline feels more generous than a sprawling villa cluttered with dead space.",
          attribution: "Spatial Planning Manifesto // Aurelle Spaces",
        },
      },
      {
        heading: "Continuous Floor Planes & Unbroken Sightlines",
        paragraphs: [
          "The human eye perceives spatial volume through continuous horizontal surfaces. When flooring changes at every doorway—from tile to marble to wood—the floor plan appears fractured into tiny boxes. Running a single, light-toned stone or matte tile seamlessly through the foyer, living area, and corridors visually doubles the perceived expanse.",
          "Similarly, keeping low furniture profiles allows sightlines to travel uninterrupted from the entrance straight through to balcony greenery, creating an immediate sense of openness.",
        ],
      },
      {
        heading: "Bespoke Joinery vs. Bulky Freestanding Furniture",
        paragraphs: [
          "Standalone furniture leaves awkward 6-inch gaps along walls that collect dust and waste valuable footprint. In compact apartments, custom built-in millwork is transformative. A dining banquette built against a wall saves 25% of floor space compared to freestanding chairs, while offering concealed storage under the seat.",
          "Full-height sliding pocket doors that disappear into partition cavities reclaim 10 to 12 square feet of usable door-swing clearance in every bedroom and bathroom.",
        ],
      },
      {
        heading: "Layered Ambient Lighting Instead of Center Downlights",
        paragraphs: [
          "A single bright ceiling light in the center of a compact room accentuates dark corners and makes the room feel confined. By tucking warm LED strip lighting above curtain pelmets, washing light down textured walls, and placing focused table lamps at eye level, corners visually dissolve, making the boundaries of the room feel wider.",
        ],
      },
      {
        heading: "Common Planning Mistakes in Indian Urban Flats",
        paragraphs: [
          "The most frequent planning mistake is sacrificing daily living comfort for a massive, rarely used formal dining table. A compact four-seater table with a hidden pull-out leaf accommodates everyday family dinners comfortably while expanding for festive gatherings only when needed.",
        ],
      },
    ],
    keyTakeaways: [
      "Maintain continuous flooring finishes across all rooms to unify the visual horizon.",
      "Use built-in banquettes and pocket doors to reclaim crucial floor area and door swings.",
      "Keep major furniture profiles below windowsill height to preserve uninterrupted sightlines.",
      "Layer soft cove lighting and perimeter wall washes to visually expand room boundaries.",
      "Invest in extendable dining joinery rather than permanently blocking compact living zones.",
    ],
    relatedSlugs: ["planning-a-home-that-works-for-everyday-life", "choosing-materials-with-care"],
    metaTitle: "Making Better Use of Compact Spaces | Aurelle Spaces Journal",
    metaDescription: "Practical space-planning strategies for urban Indian apartments: continuous floor planes, pocket doors, built-in joinery, and layered lighting.",
  },
};

