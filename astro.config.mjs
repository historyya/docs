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
      disable404Route: true,
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
          label: "JavaScript",
          collapsed: true,
          items: [{ autogenerate: { directory: "javascript" } }],
        },
        {
          label: "TypeScript",
          collapsed: true,
          items: [{ autogenerate: { directory: "typescript" } }],
        },
        {
          label: "Nodejs",
          collapsed: true,
          items: [{ autogenerate: { directory: "nodejs" } }],
        },
        {
          label: "React",
          collapsed: true,
          items: [{ autogenerate: { directory: "react" } }],
        },
        {
          label: "React Router",
          collapsed: true,
          items: [{ autogenerate: { directory: "reactrouter" } }],
        },
        {
          label: "Zustand",
          collapsed: true,
          items: [{ autogenerate: { directory: "zustand" } }],
        },
        {
          label: "Next.js",
          collapsed: true,
          items: [{ autogenerate: { directory: "nextjs" } }],
        },
        {
          label: "NestJS",
          collapsed: true,
          items: [{ autogenerate: { directory: "nestjs" } }],
        },
        {
          label: "Go",
          collapsed: true,
          items: [{ autogenerate: { directory: "go" } }],
        },
        {
          label: "Rust",
          collapsed: true,
          items: [{ autogenerate: { directory: "rust" } }],
        },
        {
          label: "Kotlin",
          collapsed: true,
          items: [{ autogenerate: { directory: "kotlin" } }],
        },
        {
          label: "Java",
          collapsed: true,
          items: [{ autogenerate: { directory: "java" } }],
        },
        {
          label: "Linux",
          collapsed: true,
          items: [{ autogenerate: { directory: "linux" } }],
        },
        {
          label: "Nginx",
          collapsed: true,
          items: [{ autogenerate: { directory: "nginx" } }],
        },
        {
          label: "Docker",
          collapsed: true,
          items: [{ autogenerate: { directory: "docker" } }],
        },
        {
          label: "Podman",
          collapsed: true,
          items: [{ autogenerate: { directory: "podman" } }],
        },
        {
          label: "PostgreSQL",
          collapsed: true,
          items: [{ autogenerate: { directory: "postgresql" } }],
        },
        {
          label: "MySQL",
          collapsed: true,
          items: [{ autogenerate: { directory: "mysql" } }],
        },
        {
          label: "Redis",
          collapsed: true,
          items: [{ autogenerate: { directory: "redis" } }],
        },
        {
          label: "MongoDB",
          collapsed: true,
          items: [{ autogenerate: { directory: "mongodb" } }],
        },
        {
          label: "RabbitMQ",
          collapsed: true,
          items: [{ autogenerate: { directory: "rabbitmq" } }],
        },
        {
          label: "Nginx",
          collapsed: true,
          items: [{ autogenerate: { directory: "nginx" } }],
        },
        {
          label: "Git",
          collapsed: true,
          items: [{ autogenerate: { directory: "git" } }],
        },
        {
          label: "Frontend",
          collapsed: true,
          items: [{ autogenerate: { directory: "frontend" } }],
        },
        {
          label: "Backend",
          collapsed: true,
          items: [{ autogenerate: { directory: "backend" } }],
        },
        {
          label: "Computer Network",
          collapsed: true,
          items: [{ autogenerate: { directory: "network" } }],
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
