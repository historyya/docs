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
                    autogenerate: {directory: "nodejs",collapse: true},
                },
                {
                    label: "JavaScript",
                    autogenerate: {directory: "javascript",collapse: true},
                },
                {
                    label: "React",
                    autogenerate: {directory: "react",collapse: true},
                },
                {
                    label: "Go",
                    autogenerate: {directory: "go",collapse: true},
                },
                {
                    label: "Rust",
                    autogenerate: {directory: "rust",collapse: true},
                },
                {
                    label: "Linux",
                    autogenerate: {directory: "linux",collapse: true},
                },
                {
                    label: "Nginx",
                    autogenerate: {directory: "nginx",collapse: true},
                },
                {
                    label: "Docker",
                    autogenerate: {directory: "docker",collapse: true},
                },
                {
                    label: "Podman",
                    autogenerate: {directory: "podman",collapse: true},
                },
                {
                    label: "MySQL",
                    autogenerate: {directory: "mysql",collapse: true},
                },
                {
                    label: "Redis",
                    autogenerate: {directory: "redis",collapse: true},
                },
                {
                    label: "Kotlin",
                    autogenerate: {directory: "kotlin",collapse: true},
                },
                {
                    label: "Java",
                    autogenerate: {directory: "java",collapse: true},
                },
                {
                    label: "Frontend",
                    autogenerate: {directory: "frontend",collapse: true},
                },
                {
                    label: "Backend",
                    autogenerate: {directory: "backend",collapse: true},
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
