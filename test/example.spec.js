const { test, expect } = require("@playwright/test");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

test("Carga Pagina", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  const title = page.locator("#title");
  await expect(title).toHaveText("Not Spotify");
});

test.describe("App", async () => {
  let TokenUrl = null;
  test.beforeEach(async ({ page }) => {
    if (TokenUrl) {
      await page.goto(TokenUrl);
    } else {
      await page.goto("http://localhost:3000/");
      await page.click("#Login");
      await page.locator("#login-button").waitFor();
      await page.fill("#login-username", "31nqry3weqtmxbgc3xfrrbh2454a");
      await page.fill("#login-password", "test123*");
      await wait(1000);
      await page.click("#login-button");
      await page.locator("[data-testid='auth-accept']").waitFor();
      await page.click("[data-testid='auth-accept']");
      await page.waitForURL(/^https?:\/\/localhost:3000\/#/);
      TokenUrl = page.url();
    }
  });
  test("Logueo", async ({ page }) => {
    const title = page.locator("#title");
    await expect(title).toHaveText("Not Spotify");
  });
  test("Search", async ({ page }) => {
    await page.fill("#inputSpotify", "BadBunny");
    await page.locator("#Tabla-Data").waitFor();
    await wait(2000);
  });
  test("BadSearch", async ({ page }) => {
    await page.fill("#inputSpotify", "alsdifhdflsbvkadsghbfvjklñadsf");
    await page.locator("#Error").waitFor();
    await wait(2000);
  });
  test("BtnNext", async ({ page }) => {
    await page.fill("#inputSpotify", "BadBunny");
    await page.click("#Next");
    await wait(2000);
    await page.click("#Previus");
    await wait(2000);
    await page.locator("#Tabla-Data").waitFor();
    await wait(2000);
  });
  test("Detalles", async ({ page }) => {
    await page.fill("#inputSpotify", "Nf");
    await page.click("#btnSearch");
    await page.locator("#Tabla-Data").waitFor();
    await page.click("#Itemsong0");
    await wait(2000);
    await page.click("#closeModal");
  });
  test("Logout", async ({ page }) => {
    await page.click("#logout");
    await wait(2000);
  });
});
