/**
 * C-Cell Domain Data
 *
 * type: 'main'  — top-level domain / standalone
 * type: 'sub'   — sub-domain belonging to a parent main domain
 * parent        — id of parent domain (for sub-domains)
 * children      — array of child ids (for main domains with sub-domains)
 *
 * No per-domain colors; all cards use the unified mint accent.
 */
export const C3_DOMAINS = [
  // ── Main: Tech Team (has sub-domains) ──────────────────────
  {
    id: 'tech-team',
    slug: 'tech-team',
    name: 'Tech Team',
    type: 'main',
    desc: 'Engineering, algorithms, and data — the builders behind C-Cell\'s technical initiatives and products.',
    skills: ['Web Dev', 'DSA', 'Data Science'],
    progress: 88,
    lead: 'Shubhanshu Choudhary',
    children: ['web-development', 'dsa', 'data-science'],
  },

  // ── Sub-domains of Tech Team ────────────────────────────────
  {
    id: 'web-development',
    slug: 'web-development',
    name: 'Web Development',
    type: 'sub',
    parent: 'tech-team',
    desc: 'Frontend and backend engineering, APIs, and the systems that power C-Cell\'s own products.',
    skills: ['React', 'Node.js', 'JavaScript'],
    progress: 90,
    lead: 'Shubhanshu Choudhary',
  },
  {
    id: 'dsa',
    slug: 'dsa',
    name: 'DSA',
    type: 'sub',
    parent: 'tech-team',
    desc: 'Competitive programming, algorithmic problem solving, and contest preparation.',
    skills: ['C++', 'Algorithms', 'Problem Solving'],
    progress: 85,
    lead: 'Aarav Mehta',
  },
  {
    id: 'data-science',
    slug: 'data-science',
    name: 'Data Science',
    type: 'sub',
    parent: 'tech-team',
    desc: 'Machine learning, data analysis, and applied AI projects across the community.',
    skills: ['Python', 'Machine Learning', 'Pandas'],
    progress: 88,
    lead: null,
  },

  // ── Standalone main domains ──────────────────────────────────
  {
    id: 'operation',
    slug: 'operation',
    name: 'Operation and Management',
    type: 'main',
    desc: 'Event planning, logistics, budgeting, and club operations. Keep everything running like clockwork.',
    skills: ['Planning', 'Leadership', 'Strategy'],
    progress: 80,
    lead: 'Rajkumar Ahirwar',
  },
  {
    id: 'pr',
    slug: 'pr',
    name: 'PR and Outreach',
    type: 'main',
    desc: 'External communications, industry partnerships, sponsorships, and community growth.',
    skills: ['Communication', 'Networking', 'Outreach'],
    progress: 75,
    lead: 'Rishabh Tomar',
  },
  {
    id: 'media',
    slug: 'media',
    name: 'Media and Content Writing',
    type: 'main',
    desc: 'Blogs, newsletters, social media copy, and written storytelling for the C-Cell community.',
    skills: ['Writing', 'SEO', 'Copywriting'],
    progress: 72,
    lead: 'Manav Patel',
  },
  {
    id: 'design',
    slug: 'design',
    name: 'Graphic Designing',
    type: 'main',
    desc: 'Brand identity, UI mockups, posters, and visual communication that defines C-Cell.',
    skills: ['Figma', 'Illustrator', 'After Effects'],
    progress: 88,
    lead: 'Suryansh Sankhere',
  },
];