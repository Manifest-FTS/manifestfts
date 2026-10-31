// "Ahead with FTS" articles: drives per-page meta, Article JSON-LD and
// breadcrumbs in pages/_app.js. Dates match the listing on /ahead-with-fts.
export const articles = [
  {
    slug: 'is-saas-right-for-your-business',
    title: 'Is SaaS Right for Your Business?',
    description:
      'What Software as a Service is, how subscription cloud software compares to installed software, and how to decide whether SaaS fits your business.',
    datePublished: '2024-10-21',
    image: '/assets/imgs/blog/thumb-saas-business.jpg',
    byFounder: false,
  },
  {
    slug: 'upgrading-to-google-analytics-4-the-time-is-now',
    title: 'Upgrading to Google Analytics 4: Why the Time is Now',
    description:
      'Universal Analytics stopped processing data on July 1, 2023. Why to move to Google Analytics 4 and what changes when you do.',
    datePublished: '2023-07-07',
    image: '/assets/imgs/blog/thumb-google-dash.webp',
    byFounder: true,
  },
  {
    slug: 'leveraging-ai-unleashing-the-future-today',
    title: 'Leveraging AI: Unleashing the Future Today',
    description:
      'Practical ways businesses can put artificial intelligence to work today, from automation to better customer experiences.',
    datePublished: '2023-05-11',
    image: '/assets/imgs/blog/thumb-ai-touch.webp',
    byFounder: true,
  },
  {
    slug: 'the-future-of-work-preparing-for-a-hybrid-workplace',
    title: 'The Future of Work: Preparing for a Hybrid Workplace',
    description:
      'How organizations can prepare people, processes, and technology for a hybrid workplace.',
    datePublished: '2023-05-04',
    image: '/assets/imgs/blog/thumb-future-office.webp',
    byFounder: true,
  },
]

export const articlePath = (article) => `/ahead-with-fts/${article.slug}`
