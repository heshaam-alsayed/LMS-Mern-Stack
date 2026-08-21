const fs = require("fs");
const OUT = "/tmp/nodetest.txt";
fs.writeFileSync(OUT, "START " + new Date().toISOString() + "\n");
const log = (m) => fs.appendFileSync(OUT, m + "\n");

(async () => {
  const controller = new AbortController();
  const t = setTimeout(() => { log("ABORTED after 25s"); process.exit(2); }, 25000);
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "code=dummy&client_id=x&client_secret=y&grant_type=authorization_code",
      signal: controller.signal,
    });
    log("STATUS " + res.status);
    log("BODY " + (await res.text()).slice(0, 150));
  } catch (e) {
    log("FETCH ERR: " + e.message + " cause=" + (e.cause ? e.cause.message : "none"));
  }
  clearTimeout(t);
  log("DONE");
  process.exit(0);
})();
