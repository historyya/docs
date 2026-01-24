import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.qing1i.workers.dev/",
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
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://cloud.umami.is/script.js",
            "data-website-id": "6fb3c6b4-78da-4883-8356-64dc6b75451c",
            defer: true,
          },
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
          label: "Nodejs",
          autogenerate: { directory: "nodejs" },
          collapsed: true,
        },
        {
          label: "JavaScript",
          autogenerate: { directory: "javascript" },
          collapsed: true,
        },
        {
          label: "React",
          autogenerate: { directory: "react" },
          collapsed: true,
        },
        {
          label: "Go",
          autogenerate: { directory: "go" },
          collapsed: true,
        },
        {
          label: "Rust",
          autogenerate: { directory: "rust" },
          collapsed: true,
        },
        {
          label: "Kotlin",
          autogenerate: { directory: "kotlin" },
          collapsed: true,
        },
        {
          label: "Java",
          autogenerate: { directory: "java" },
          collapsed: true,
        },
        {
          label: "Linux",
          autogenerate: { directory: "linux" },
          collapsed: true,
        },
        {
          label: "Nginx",
          autogenerate: { directory: "nginx" },
          collapsed: true,
        },
        {
          label: "Docker",
          autogenerate: { directory: "docker" },
          collapsed: true,
        },
        {
          label: "Podman",
          autogenerate: { directory: "podman" },
          collapsed: true,
        },
        {
          label: "MySQL",
          autogenerate: { directory: "mysql" },
          collapsed: true,
        },
        {
          label: "Redis",
          autogenerate: { directory: "redis" },
          collapsed: true,
        },
        {
          label: "MongoDB",
          autogenerate: { directory: "mongodb" },
          collapsed: true,
        },
        {
          label: "RabbitMQ",
          autogenerate: { directory: "rabbitmq" },
          collapsed: true,
        },
        {
          label: "Nginx",
          autogenerate: { directory: "nginx" },
          collapsed: true,
        },
        {
          label: "Git",
          autogenerate: { directory: "git" },
          collapsed: true,
        },
        {
          label: "Frontend",
          autogenerate: { directory: "frontend" },
          collapsed: true,
        },
        {
          label: "Backend",
          autogenerate: { directory: "backend" },
          collapsed: true,
        },
        {
          label: "RuanKao",
          autogenerate: { directory: "ruankao" },
          collapsed: true,
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
  image: {
    layout: "constrained",
    service: passthroughImageService(),
  },
});
