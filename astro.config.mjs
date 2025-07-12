// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Docs",
      logo: {
        light: "./src/assets/light-logo.svg",
        dark: "./src/assets/dark-logo.svg",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/historyya",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Rust",
          autogenerate: { directory: "rust" },
        },
        {
          label: "React",
          autogenerate: { directory: "react" },
        },
        {
          label: "Kotlin",
          autogenerate: { directory: "kotlin" },
        },
        {
          label: "Java",
          autogenerate: { directory: "java" },
        },
        {
          label: "Nginx",
          autogenerate: { directory: "nginx" },
        },
      ],
      customCss: ["./src/styles/global.css"],
      components: {
        Pagination: "./src/components/overrides/Pagination.astro",
      },
      favicon: "/favicon.svg",
      lastUpdated: true,
      expressiveCode: {
        styleOverrides: { borderRadius: "0.5rem" },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
