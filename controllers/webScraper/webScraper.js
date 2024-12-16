const puppeteer = require("puppeteer");
const { makeRespObj } = require("../../AppUtils/index");

const scrapeWeb = async () => {
  console.log("Starting scraper...");
  let browser;
  try {
    // Launch a Puppeteer browser.
    browser = await puppeteer.launch({
      headless: false, // Set to false for debugging and visualization.
      args: ["--start-maximized"], // Start browser maximized.
      defaultViewport: null, // Ensure viewport matches the browser window.
    });

    const page = await browser.newPage();

    // Navigate to the target website.
    const url = `https://www.vishalmegamart.com/en-in/personal-care/soaps-and-skin-care/?cgid=1008001&pmin=0.01&srule=new-arrivals&start=0&sz=1000`;
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract product information.
    const products = await page.evaluate(() => {
      const mainDiv = document.querySelector(".row.product-grid");
      if (!mainDiv) return [];

      return Array.from(mainDiv.querySelectorAll(".plp_productItems")).map(
        (elm) => {
          const variants = Array.from(
            elm.querySelectorAll(".fmcg-product-variants .dropdown-menu li")
          ).map((variant) => variant.textContent.trim());

          return {
            image:
              elm.querySelector(".image-container img")?.getAttribute("src") ||
              "",
            brand:
              elm.querySelector(".product-brand")?.textContent?.trim() || "",
            name: elm.querySelector(".pdp-link a")?.textContent?.trim() || "",
            originalPrice:
              elm
                .querySelector(".price .strike-through .value")
                ?.getAttribute("content") || "",

            salePrice:
              elm.querySelector(".price .sales .value")?.textContent?.trim() ||
              "",
            discount:
              elm
                .querySelector(".price .product-discount")
                ?.textContent?.trim() || "",
            variants: variants.length ? variants : [],
          };
        }
      );
    });

    console.log("Extracted products:", products);

    return makeRespObj({
      status_code: 200,
      message: "Data found successfully",
      data: { totalProducts: products.length || 0, products: products },
    });
  } catch (error) {
    return makeRespObj({
      status_code: 500,
      message: "An error occurred during scraping",
      error: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { scrapeWeb };
