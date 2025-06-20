"use client";

import Configs from "@/lib/config";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string | React.JSX.Element;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  menuItems = [
    {
      title: "Future",
      links: [
        { text: "Home", url: "#" },
        { text: "About", url: "#" },
        { text: "Contact Us", url: "#" },
        { text: "Privacy", url: "#" },
        { text: "Blog", url: "#" },
      ],
    },
    {
      title: "Category",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Marketplace", url: "#" },
        { text: "Features", url: "#" },
        { text: "Integrations", url: "#" },
        { text: "Pricing", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "FAQ", url: "#" },
        { text: "Term & Condition", url: "#" },
        { text: "Advertise", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "LinkedIn", url: "#" },
      ],
    },
  ],
  copyright = <>© 2025 <a href="/" className="underline">{Configs.app_name}</a> All rights reserved.</>,
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: FooterProps) => {
  const appName = Configs.app_name;

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <a href="/" className="flex items-center gap-2 self-center font-medium">
                  <div className="px-1 py-0.5 rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                    <i className='bx bx-shopping-bag text-2xl'></i>
                  </div>
                  <div className="text-lg text-blue-600">
                    {appName}
                  </div>
                </a>
              </div>
              <p className="mt-3 text-sm">
                Shop anytime, anywhere, and have your groceries delivered with care, just the way you like it.
              </p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-sm">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col justify-between gap-4 border-t pt-4 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };