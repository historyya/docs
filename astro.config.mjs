import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import starlightImageZoom from "starlight-image-zoom";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    site: "https://docs.qing1i.workers.dev/",
    integrations: [
        starlight({
            title: "Docs",
            defaultLocale: "en",
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
                    label: "JavaScript",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "javascript", collapsed: true } }],
                },
                {
                    label: "TypeScript",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "typescript", collapsed: true } }],
                },
                {
                    label: "Nodejs",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "nodejs", collapsed: true } }],
                },
                {
                    label: "React",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "react", collapsed: true } }],
                },
                {
                    label: "React Router",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "reactrouter", collapsed: true } }],
                },
                {
                    label: "Zustand",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "zustand", collapsed: true } }],
                },
                {
                    label: "Next.js",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "nextjs", collapsed: true } }],
                },
                {
                    label: "NestJS",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "nestjs", collapsed: true } }],
                },
                {
                    label: "Go",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "go", collapsed: true } }],
                },
                {
                    label: "Rust",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "rust", collapsed: true } }],
                },
                {
                    label: "Kotlin",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "kotlin", collapsed: true } }],
                },
                {
                    label: "Java",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "java", collapsed: true } }],
                },
                {
                    label: "Linux",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "linux", collapsed: true } }],
                },
                {
                    label: "Nginx",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "nginx", collapsed: true } }],
                },
                {
                    label: "Docker",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "docker", collapsed: true } }],
                },
                {
                    label: "Podman",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "podman", collapsed: true } }],
                },
                {
                    label: "PostgreSQL",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "postgresql", collapsed: true } }],
                },
                {
                    label: "MySQL",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "mysql", collapsed: true } }],
                },
                {
                    label: "Redis",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "redis", collapsed: true } }],
                },
                {
                    label: "MongoDB",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "mongodb", collapsed: true } }],
                },
                {
                    label: "RabbitMQ",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "rabbitmq", collapsed: true } }],
                },
                {
                    label: "Git",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "git", collapsed: true } }],
                },
                {
                    label: "Frontend",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "frontend", collapsed: true } }],
                },
                {
                    label: "Backend",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "backend", collapsed: true } }],
                },
                {
                    label: "Computer Network",
                    collapsed: true,
                    items: [{ autogenerate: { directory: "network", collapsed: true } }],
                },
            ],
            routeMiddleware: "./src/routeData.ts",
            customCss: ["./src/styles/global.css"],
            favicon: "/favicon.svg",
            lastUpdated: true,
            expressiveCode: {
                styleOverrides: { borderRadius: "0.5rem" },
            },
            plugins: [starlightImageZoom()],
        }),
        mdx({
            optimize: true,
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
