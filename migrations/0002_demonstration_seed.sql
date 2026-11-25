-- ============================================================================
-- Migration: 0002_demonstration_seed.sql
-- Project: Aurelle Spaces (DRK Information Software Solutions)
-- Target: Cloudflare D1 (SQLite)
-- Description: Seeds the 4 core disciplines, 6 demonstration architectural
--              case studies, and 3 editorial monographs from centralized data.
--              Does NOT create administrator credentials or fake enquiries.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED SERVICES (4 Design Disciplines)
-- ----------------------------------------------------------------------------
INSERT OR IGNORE INTO services (id, slug, title, summary, description, status, sort_order, seo_metadata, created_at, updated_at)
VALUES
(
  'srv_01',
  'residential-interiors',
  'Residential Interiors',
  'Bespoke joinery, tailored spatial flow, materiality curation, and atmospheric lighting schemes crafted for private residences, duplexes, and villas.',
  'We design home interiors that celebrate the quiet rituals of domestic life. From custom teak millwork to monsoon-appropriate natural stones, every element is planned for everyday comfort and lasting dignity.',
  'published',
  1,
  '{"metaTitle":"Residential Interiors | Aurelle Spaces","metaDescription":"Bespoke interior architecture and custom joinery for private Indian residences, duplexes, and villas."}',
  datetime('now'),
  datetime('now')
),
(
  'srv_02',
  'commercial-interiors',
  'Commercial Interiors',
  'Acoustically tuned, human-centred workspaces, boutique studios, and executive offices that foster quiet collaboration and enduring brand presence.',
  'Commercial spaces should nurture focused work and meaningful dialogue without corporate visual noise. We design agile studios, private legal chambers, and creative offices balanced by tactile materials and acoustic discipline.',
  'published',
  2,
  '{"metaTitle":"Commercial & Studio Interiors | Aurelle Spaces","metaDescription":"Human-centred, acoustically tuned workspace and studio interiors for ambitious Indian enterprises."}',
  datetime('now'),
  datetime('now')
),
(
  'srv_03',
  'architecture-space-planning',
  'Architecture & Space Planning',
  'Holistic spatial choreography, structural volume planning, natural cross-ventilation, and climate-responsive residential and commercial envelopes.',
  'Architecture begins with how a structure greets the morning light and responds to the seasons. Our space planning creates intuitive transitions between indoor sanctuaries and sheltered external courtyards.',
  'published',
  3,
  '{"metaTitle":"Architecture & Space Planning | Aurelle Spaces","metaDescription":"Climate-responsive architectural envelopes, volumetric space planning, and cross-ventilated Indian homes."}',
  datetime('now'),
  datetime('now')
),
(
  'srv_04',
  'renovation-refurbishment',
  'Renovation & Refurbishment',
  'Sensitive adaptive reuse, heritage home restorations, and structural modernisations that honor original architectural memory while introducing contemporary mechanical ease.',
  'Old structures hold character that cannot be manufactured from scratch. We carefully restore distressed lime plasters, reinforce timber rafters, and integrate concealed modern infrastructure into historic Indian dwellings.',
  'published',
  4,
  '{"metaTitle":"Renovation & Adaptive Refurbishment | Aurelle Spaces","metaDescription":"Sensitive heritage restoration, structural refurbishment, and adaptive modernisations for historic properties."}',
  datetime('now'),
  datetime('now')
);

-- ----------------------------------------------------------------------------
-- 2. SEED PROJECTS (6 Demonstration Concept Studies)
-- ----------------------------------------------------------------------------
INSERT OR IGNORE INTO projects (id, slug, title, location, category, summary, detailed_content, featured, publication_status, seo_metadata, created_at, updated_at)
VALUES
(
  'prj_01',
  'gulmohar-sanctuary',
  'The Gulmohar Sanctuary',
  'Sadashivnagar, Bengaluru',
  'Residential Interiors',
  'A private residential villa framed by monolithic stone columns, internal landscaped courtyards, and warm timber ceilings designed for multi-generational living.',
  '{"conceptNarrative":["Framed by ancient Gulmohar canopies in North Bengaluru, this residence balances monolithic basalt and fluted teak to orchestrate a sheltered family sanctuary."],"materialPalette":[{"name":"Basalt Stone","finish":"Flamed & Brushed","role":"Monolithic boundary plinth","toneHex":"#3D3E3A"},{"name":"Burmese Teak","finish":"Hand-rubbed natural oil","role":"Ceiling louvres & joinery","toneHex":"#7B5532"}],"spacePlanningNotes":["Central courtyard acts as a thermal chimney, ensuring continuous stack-effect cooling during tropical pre-monsoon heat."],"featured":true}',
  1,
  'published',
  '{"metaTitle":"The Gulmohar Sanctuary | Aurelle Spaces","metaDescription":"A private Bengaluru villa celebrating courtyard living, fluted teak joinery, and natural ventilation."}',
  datetime('now'),
  datetime('now')
),
(
  'prj_02',
  'atelier-vellum',
  'Atelier Vellum',
  'Kala Ghoda, Mumbai',
  'Commercial Interiors',
  'A boutique creative studio and private design library in South Mumbai featuring lime-washed surfaces, raw brass accents, and custom acoustical felt partitioning.',
  '{"conceptNarrative":["Housed within a restored heritage precinct in South Mumbai, Atelier Vellum serves as a contemplative workspace for a creative advisory firm."],"materialPalette":[{"name":"Lime Wash Plaster","finish":"Trowelled matte","role":"Perimeter walls","toneHex":"#ECE7DF"},{"name":"Unlacquered Brass","finish":"Satin brushed","role":"Hardware & task light bodies","toneHex":"#A17C55"}],"spacePlanningNotes":["Acoustically isolated private consultation pods framed by fluted acoustic fabric flank an open central library table."],"featured":true}',
  1,
  'published',
  '{"metaTitle":"Atelier Vellum | Aurelle Spaces","metaDescription":"Boutique creative studio in South Mumbai featuring lime-wash plaster and bespoke brass joinery."}',
  datetime('now'),
  datetime('now')
),
(
  'prj_03',
  'terrace-of-echoes',
  'Terrace of Echoes',
  'Jubilee Hills, Hyderabad',
  'Architecture & Space Planning',
  'A contemporary hilltop residence featuring tiered granite verandas, deep brise-soleil shading, and uninterrupted panoramic views of the Deccan plateau.',
  '{"conceptNarrative":["Perched on a contoured rocky outcrop in Jubilee Hills, this residence negotiates severe afternoon solar exposure through deep overhangs and stone verandas."],"materialPalette":[{"name":"Grey Granite","finish":"Chiselled rough","role":"Terrace retaining walls","toneHex":"#595A55"},{"name":"Cast Bronze Mesh","finish":"Oxidized antique","role":"Solar shading screens","toneHex":"#826344"}],"spacePlanningNotes":["Staggered floor plates step back along the hillside contour, creating sheltered terrace gardens on each level."],"featured":true}',
  1,
  'published',
  '{"metaTitle":"Terrace of Echoes | Aurelle Spaces","metaDescription":"Hilltop Jubilee Hills residence featuring tiered granite verandas and passive solar screening."}',
  datetime('now'),
  datetime('now')
),
(
  'prj_04',
  'house-of-slanted-light',
  'House of Slanted Light',
  'Alipore, Kolkata',
  'Renovation & Refurbishment',
  'Adaptive transformation of an art deco family residence, preserving terrazzo mosaic flooring and restoring cast-iron fenestrations with high-efficiency glazing.',
  '{"conceptNarrative":["A sensitive refurbishment of a 1940s Alipore residence, reviving heritage red oxide floors and cast-iron fanlights while integrating discreet central climate controls."],"materialPalette":[{"name":"Red Oxide Plaster","finish":"Wax polished","role":"Ground floor reception corridors","toneHex":"#7C3B2E"},{"name":"Cast Iron","finish":"Matte black enamel","role":"Restored arched fenestrations","toneHex":"#242522"}],"spacePlanningNotes":["Restoration of high 14-foot ceilings with low-velocity ceiling circulation fans, eliminating excessive air conditioning load."],"featured":false}',
  0,
  'published',
  '{"metaTitle":"House of Slanted Light | Aurelle Spaces","metaDescription":"Art deco residential restoration in Alipore reviving red oxide plaster and heritage cast-iron fenestrations."}',
  datetime('now'),
  datetime('now')
),
(
  'prj_05',
  'the-monolith-pavilion',
  'The Monolith Pavilion',
  'Boat Club Road, Chennai',
  'Architecture & Space Planning',
  'A coastal weekend pavilion constructed with pigmented rammed earth, cantilevered concrete eaves, and open breeze pavilions oriented toward the Coromandel coast.',
  '{"conceptNarrative":["Designed for coastal climatic endurance, the pavilion utilizes stabilized local earth and marine-grade teak joinery to create a resilient weekend retreat."],"materialPalette":[{"name":"Stabilized Earth","finish":"Compacted natural","role":"Monolithic load-bearing walls","toneHex":"#A48261"},{"name":"Weathered Teak","finish":"Marine seal","role":"Pivot shutters & louvres","toneHex":"#634730"}],"spacePlanningNotes":["Open pavilion axis aligned with maritime afternoon breezes, ensuring natural passive comfort without sealed enclosures."],"featured":false}',
  0,
  'published',
  '{"metaTitle":"The Monolith Pavilion | Aurelle Spaces","metaDescription":"Coastal Chennai pavilion crafted from pigmented rammed earth and marine-grade teak joinery."}',
  datetime('now'),
  datetime('now')
),
(
  'prj_06',
  'serenade-court',
  'Serenade Court',
  'Golf Links, New Delhi',
  'Residential Interiors',
  'Refined interior architecture for a diplomatic residence duplex, combining fluted Kota stone, walnut panelling, and discreet concealed service corridors.',
  '{"conceptNarrative":["A sophisticated duplex interior in Central Delhi balancing formal diplomatic hosting salons with intimate private family sanctuaries."],"materialPalette":[{"name":"Honed Kota Stone","finish":"Fine matte hone","role":"Main living & gallery floors","toneHex":"#6B7A68"},{"name":"American Walnut","finish":"Satin oil lacquer","role":"Wall panelling & library bookcases","toneHex":"#4A3728"}],"spacePlanningNotes":["A dedicated peripheral service spine enables seamless staff circulation without crossing private living zones."],"featured":false}',
  0,
  'published',
  '{"metaTitle":"Serenade Court | Aurelle Spaces","metaDescription":"Refined diplomatic residence duplex in Golf Links combining honed Kota stone and walnut panelling."}',
  datetime('now'),
  datetime('now')
);

-- ----------------------------------------------------------------------------
-- 3. SEED JOURNAL ARTICLES (3 In-Depth Monographs)
-- ----------------------------------------------------------------------------
INSERT OR IGNORE INTO journal_articles (id, slug, title, category, excerpt, article_content, cover_media_id, publication_status, published_at, seo_metadata, created_at, updated_at)
VALUES
(
  'art_01',
  'planning-a-home-that-works-for-everyday-life',
  'Planning a Home That Works for Everyday Life',
  'Residential Design',
  'Why thoughtful residential architecture begins not with luxury decor, but with the quiet choreography of family rituals, natural light, and storage that eliminates domestic friction.',
  '{"readingTime":"6 min read","keyTakeaways":["Choreograph floor plans around everyday domestic routines rather than formal guest impressions.","Incorporate continuous natural ventilation paths and double-glazed thermal boundaries suited for Indian climates.","Design concealed utility and footwear storage at thresholds to eliminate daily clutter."],"featured":true}',
  NULL,
  'published',
  '2025-11-15T00:00:00Z',
  '{"metaTitle":"Planning a Home That Works for Everyday Life | Aurelle Spaces Journal","metaDescription":"An architectural essay on designing residential floor plans around everyday domestic rituals and climate realities."}',
  datetime('now'),
  datetime('now')
),
(
  'art_02',
  'material-truth-stone-timber-and-time',
  'Material Truth: Stone, Timber, and Time',
  'Materials & Craft',
  'An exploration of tactile materials that age with dignity under Indian climatic conditions, contrasting honest natural stone and oil-finished wood against synthetic veneers.',
  '{"readingTime":"8 min read","keyTakeaways":["Select natural materials that patina with age rather than deteriorate under sunlight and monsoons.","Use unlacquered brass and oiled hardwoods that gain depth and tactile warmth with human contact.","Embrace subtle material variations in hand-dressed Kota, Jaisalmer, and basalt stone."],"featured":false}',
  NULL,
  'published',
  '2025-10-28T00:00:00Z',
  '{"metaTitle":"Material Truth: Stone, Timber, and Time | Aurelle Spaces Journal","metaDescription":"Reflections on authentic Indian materiality, natural stone patinas, and craft traditions that endure through decades."}',
  datetime('now'),
  datetime('now')
),
(
  'art_03',
  'the-acoustics-of-calm-commercial-interiors',
  'The Acoustics of Calm: Designing Quiet Commercial Spaces',
  'Workspace Architecture',
  'How thoughtful spatial zoning, sound-absorbing natural materials, and subtle perimeter baffles transform noisy commercial open-plans into focused working sanctuaries.',
  '{"readingTime":"5 min read","keyTakeaways":["Treat acoustic discipline as a foundational structural requirement, not an afterthought.","Combine micro-perforated wood panelling, felt baffles, and dense wool textiles for balanced reverberation.","Create acoustic buffer zones between collaborative meeting spaces and focused solo work pods."],"featured":false}',
  NULL,
  'published',
  '2025-10-10T00:00:00Z',
  '{"metaTitle":"The Acoustics of Calm: Designing Quiet Commercial Spaces | Aurelle Spaces Journal","metaDescription":"Architectural guidance on eliminating noise pollution and fostering acoustic calm in high-performance workspaces."}',
  datetime('now'),
  datetime('now')
);

