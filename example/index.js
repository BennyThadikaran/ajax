const http = require("http");
const { join } = require("path");
const { readFile } = require("fs/promises");
const busboy = require("busboy");

const hostname = "127.0.0.1";
const port = 3000;

// return static file content like javascript
const getStaticFile = async (url) => {
  const filePath =
    url === "/ajax/src/ajax.js"
      ? join(__dirname, "../ajax/src/ajax.js")
      : join(__dirname, "main.js");

  return await readFile(filePath);
};

const routes = {
  // home route
  "/": async (_, res) => {
    res.statusCode = 200;
    const html = await readFile(join(__dirname, "home.html"));
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  },

  // /upload route
  "/upload": (req, res) => {
    if (req.method !== "POST") {
      res.statusCode = 400;
      res.end("Bad Request");
      return;
    }

    const bb = busboy({ headers: req.headers });

    bb.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(`File: ${name}: ${filename}, ${encoding}, ${mimeType}`);

      file
        .on("data", (data) => {
          console.log(`File: ${name}: got ${data.length} bytes`);
        })
        .on("close", () => {
          console.log(`File: ${name}: done`);
        });
    });

    bb.on("field", (name, val, _) => {
      console.log(`${name}: ${val}`);
    });

    bb.on("close", () => {
      console.log("Done parsing form!");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: true }));
    });

    req.pipe(bb);
  },
  404: (_, res) => {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("404: Not found");
  },
  js: async (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/javascript");
    res.end(await getStaticFile(req.url));
  },
};

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url in routes) return routes[url](req, res);

  if (url.endsWith("js")) return routes.js(req, res);

  return routes[404](req, res);
});

server.listen(port, hostname, () => {
  console.log(`Listening at http://${hostname}:${port}/`);
});
