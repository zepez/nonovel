/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nonovel.io",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["/dynamic-sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://nonovel.io/dynamic-sitemap.xml"],
  },
};
