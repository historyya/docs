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
          label: "JavaScript",
          items: [{ autogenerate: { directory: "javascript", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "TypeScript",
          items: [{ autogenerate: { directory: "typescript", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Nodejs",
          items: [{ autogenerate: { directory: "nodejs", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "React",
          items: [{ autogenerate: { directory: "react", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "React Router",
          items: [{ autogenerate: { directory: "reactrouter", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Zustand",
          items: [{ autogenerate: { directory: "zustand", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Next.js",
          items: [{ autogenerate: { directory: "nextjs", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "NestJS",
          items: [{ autogenerate: { directory: "nestjs", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Go",
          items: [{ autogenerate: { directory: "go", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Rust",
          items: [{ autogenerate: { directory: "rust", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Kotlin",
          items: [{ autogenerate: { directory: "kotlin", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Java",
          items: [{ autogenerate: { directory: "java", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Linux",
          items: [{ autogenerate: { directory: "linux", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Nginx",
          items: [{ autogenerate: { directory: "nginx", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Docker",
          items: [{ autogenerate: { directory: "docker", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Podman",
          items: [{ autogenerate: { directory: "podman", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "PostgreSQL",
          items: [{ autogenerate: { directory: "postgresql", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "MySQL",
          items: [{ autogenerate: { directory: "mysql", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Redis",
          items: [{ autogenerate: { directory: "redis", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "MongoDB",
          items: [{ autogenerate: { directory: "mongodb", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "RabbitMQ",
          items: [{ autogenerate: { directory: "rabbitmq", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Nginx",
          items: [{ autogenerate: { directory: "nginx", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Git",
          items: [{ autogenerate: { directory: "git", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Frontend",
          items: [{ autogenerate: { directory: "frontend", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Backend",
          items: [{ autogenerate: { directory: "backend", collapsed: true } }],
          collapsed: true,
        },
        {
          label: "Computer Network",
          items: [{ autogenerate: { directory: "network", collapsed: true } }],
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
