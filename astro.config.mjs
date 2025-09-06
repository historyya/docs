// @ts-check
import {defineConfig} from "astro/config";
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
                        {label: "Example Guide", slug: "guides/example"},
                    ],
                },
                {
                    label: "Nodejs",
                    autogenerate: {directory: "nodejs", collapsed: true},
                },
                {
                    label: "JavaScript",
                    autogenerate: {directory: "javascript", collapsed: true},
                },
                {
                    label: "React",
                    autogenerate: {directory: "react", collapsed: true},
                },
                {
                    label: "Go",
                    autogenerate: {directory: "go", collapsed: true},
                },
                {
                    label: "Rust",
                    autogenerate: {directory: "rust", collapsed: true},
                },
                {
                    label: "Linux",
                    autogenerate: {directory: "linux", collapsed: true},
                },
                {
                    label: "Nginx",
                    autogenerate: {directory: "nginx", collapsed: true},
                },
                {
                    label: "Docker",
                    autogenerate: {directory: "docker", collapsed: true},
                },
                {
                    label: "Podman",
                    autogenerate: {directory: "podman", collapsed: true},
                },
                {
                    label: "MySQL",
                    autogenerate: {directory: "mysql", collapsed: true},
                },
                {
                    label: "Redis",
                    autogenerate: {directory: "redis", collapsed: true},
                },
                {
                    label: "Kotlin",
                    autogenerate: {directory: "kotlin", collapsed: true},
                },
                {
                    label: "Java",
                    autogenerate: {directory: "java", collapsed: true},
                },
                {
                    label: "Frontend",
                    autogenerate: {directory: "frontend", collapsed: true},
                },
                {
                    label: "Backend",
                    autogenerate: {directory: "backend", collapsed: true},
                }
            ],
            customCss: ["./src/styles/global.css"],
            components: {
                Pagination: "./src/components/overrides/Pagination.astro",
            },
            favicon: "/favicon.svg",
            lastUpdated: true,
            expressiveCode: {
                styleOverrides: {borderRadius: "0.5rem"},
            },
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});
