const { makeRespObj } = require("../../AppUtils");
const puppeteer = require("puppeteer");

const scrapeAmazonReviews = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let dataArr = [];
  let currentPage = 1;
  let maxPage = 2;

  while (currentPage <= maxPage) {
    await page.goto(
      `https://www.amazon.in/BLACKSTEP-Womens-Casual-Pullover-Sweatshirt/dp/B0DFTSR2QF/ref=cm_cr_arp_d_product_top?ie=UTF8&th=1&psc=1`
    );

    const books = await page.evaluate(() => {
      const bookElements = document.querySelectorAll(
        "[data-hook='review-collapsed']"
      );
      console.log("bookElements", bookElements);

      return Array.from(bookElements).map((book) => {
        console.log("come here -->");
        return {
          title: book.textContent.trim(),
          // date: book.querySelector(".mytime span").innerText,
          // url:
          //   "https://vegamovies.am/" +
          //   book.querySelector("img").getAttribute("src"),
        };
      });
    });

    dataArr = [...(dataArr || []), ...books];
    currentPage++;
  }
  await browser.close();

  // Navigate the page to a URL

  return makeRespObj({
    status_code: 200,
    message: "Data found successfully",
    data: dataArr,
  });
};
module.exports = { scrapeAmazonReviews };
