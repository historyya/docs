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
                    autogenerate: {directory: "nodejs"},
                },
                {
                    label: "JavaScript",
                    autogenerate: {directory: "javascript"},
                },
                {
                    label: "React",
                    autogenerate: {directory: "react"},
                },
                {
                    label: "Kotlin",
                    autogenerate: {directory: "kotlin"},
                },
                {
                    label: "Java",
                    autogenerate: {directory: "java"},
                },
                {
                    label: "Rust",
                    autogenerate: {directory: "rust"},
                },
                {
                    label: "Linux",
                    autogenerate: {directory: "linux"},
                },
                {
                    label: "Nginx",
                    autogenerate: {directory: "nginx"},
                },
                {
                    label: "Docker",
                    autogenerate: {directory: "docker"},
                },
                {
                    label: "Podman",
                    autogenerate: {directory: "podman"},
                },
                {
                    label: "MySQL",
                    autogenerate: {directory: "mysql"},
                },
                {
                    label: "Redis",
                    autogenerate: {directory: "redis"},
                },
                {
                    label: "Frontend",
                    autogenerate: {directory: "frontend"},
                },
                {
                    label: "Backend",
                    autogenerate: {directory: "backend"},
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
