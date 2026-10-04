import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// Vite's SPA fallback otherwise serves the homepage for /portfolio without a slash.
function portfolioDirectory(server) {
  server.middlewares.use((request, response, next) => {
    const [path, ...query] = (request.url || "").split("?");
    if (path !== "/portfolio") return next();
    response.writeHead(308, {
      Location: `/portfolio/${query.length ? `?${query.join("?")}` : ""}`,
    });
    response.end();
  });
}

export default defineConfig({
  plugins: [
    {
      name: "portfolio-directory",
      configureServer: portfolioDirectory,
      configurePreviewServer: portfolioDirectory,
    },
  ],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("./index.html", import.meta.url)),
        portfolio: fileURLToPath(
          new URL("./portfolio/index.html", import.meta.url),
        ),
      },
    },
  },
});
