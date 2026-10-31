export const siteConfig = {
  name: "SimonPeter",
  title: "SimonPeter — Software Engineer",
  shortName: "Simon.dev",
  description:
    "SimonPeter is a software engineer from Kisii, Kenya building full-stack products, AI & ML solutions and well-designed databases. Dream in code. Build in life.",
  slogan: "Dream in code. Build in life.",
  location: "Kisii, Kenya",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  avatar: "/images/simon-gdg.jpg",
  resume: "/simonpeter-cv.docx",
  promoVideo: "/media/promo.mp4",
  links: {
    github: "https://github.com/SimonpeterW",
    linkedin: "https://www.linkedin.com/in/simonpeterfullstacksoftwareengineer/",
    leetcode: "https://leetcode.com/u/simon_peter/",
    codewars: "https://www.codewars.com/users/simonpeter%20waithaka%20",
    x: "https://x.com/simonpeterfa",
    instagram: "https://www.instagram.com/simonpeterfa/",
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
