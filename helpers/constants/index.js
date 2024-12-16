const folderNames = {
  product: "productImages",
  survey: "surveyImages",
  giftCart: "giftCartImages",
};

const appMode = {
  PRODUCTION: {
    baseUrl: "http://gulzar.tech:4500/",
    shipRocketUrl: "https://apiv2.shiprocket.in/v1/external/",
  },
  DEVELOPMENT: {
    baseUrl: "http://localhost:4500/",
    shipRocketUrl: "https://apiv2.shiprocket.in/v1/external/",
  },
};

const constantHelpers = {
  pickupPostalcode: 360575,
  spToken:
    "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUzMTYxNjEsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzMwMjgyOTEyLCJqdGkiOiJhQkVlaTlSeEIwSVd4YTFrIiwiaWF0IjoxNzI5NDE4OTEyLCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTcyOTQxODkxMiwiY2lkIjo0Mzk4MzM5LCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.-z_DfGmd3q6N4b5GOQP5Je0sSEg-xqgWEcChsbsdXnw",
};

module.exports = {
  folderNames,
  appMode,
  constantHelpers,
};
