const puppeteer = require("puppeteer");
const { makeRespObj } = require("../../AppUtils/index");

// Define the selectors for the elements we need to extract.
const selectors = {
  allReviews: "#cm-cr-dp-review-list div.review",
  authorName: 'div[data-hook="genome-widget"] span.a-profile-name',
  reviewTitle: "[data-hook=review-title]>span:not([class])",
  reviewDate: "span[data-hook=review-date]",
  emailid: "input[name=email]",
  password: "input[name=password]",
  continue: "input[id=continue]",
  singin: "input[id=signInSubmit]",
};

// Asynchronously fetch the Amazon reviews.
const scrapeAmazonReviews = async () => {
  console.log("scraper:::");
  let browser;
  try {
    // Launch a Puppeteer browser.
    browser = await puppeteer.launch({
      headless: false, // Set headless to false so we can see the browser in action.
    });

    // Create a new page in the browser.
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      "Upgrade-Insecure-Requests": "1",
      Referer: "https://www.google.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    });

    // Navigate to the Amazon sign-in page.
    await page.goto(
      "https://www.amazon.in/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3Fref_%3Dnav_custrec_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0"
    );

    // Perform sign-in actions.
    try {
      await page.waitForSelector(selectors.emailid);
      await page.type(selectors.emailid, "israilgulzar@gmail.com", {
        delay: 300,
      });
      await page.click(selectors.continue);

      await page.waitForSelector(selectors.password);
      await page.type(selectors.password, "ijugulz@924", { delay: 300 });
      await page.click(selectors.singin);

      await page.waitForNavigation();
    } catch (signInError) {
      console.error("Error during sign-in process:", signInError);
      throw new Error("Sign-in failed");
    }

    let responseArr = [];
    let count = 1;
    const maxLimit = 10;

    while (count <= maxLimit) {
      try {
        await page.goto(
          // `https://www.amazon.in/DRUNKEN-Slipper-Flops-Slides-Blue-8-9/product-reviews/B08LKWHGQV/ref=cm_cr_arp_d_paging_btm_next_2?ie=UTF8&reviewerType=all_reviews&pageNumber=${count}`
          `https://www.amazon.in/product-reviews/B082WYMTWF/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews=${count}`
        );

        const reviews = await page.evaluate(() => {
          const element = document.querySelectorAll(" li[data-hook='review']");
          return Array.from(element).map((elm) => ({
            title:
              elm.querySelector(".a-profile-name")?.textContent?.trim() || "",
            profile:
              elm.querySelector(".a-profile-avatar img")?.getAttribute("src") ||
              "",
            reviewImages:
              elm.querySelectorAll(".review-image-container img").length > 0
                ? Array.from(
                    elm.querySelectorAll(".review-image-container img")
                  ).map((img) => img.getAttribute("src") || "")
                : [],
            date: elm.querySelector(".review-date")?.textContent?.trim() || "",
            review:
              elm
                .querySelector(".review-text-content span")
                ?.textContent?.trim() || "",
            rating:
              elm
                .querySelector('i[data-hook="review-star-rating"]')
                ?.getAttribute("class")
                ?.match(/a-star-(\d)/)?.[1] || "Not found",
          }));
        });

        responseArr = [...(responseArr || []), ...reviews];
      } catch (pageError) {
        console.error(`Error scraping page ${count}:`, pageError);
      }

      count++;
    }

    return makeRespObj({
      status_code: 200,
      message: "Data found successfully",
      data: { totalReviews: responseArr.length || 0, reviews: responseArr },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
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

module.exports = { scrapeAmazonReviews };
