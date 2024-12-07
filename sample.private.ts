import { GmoCoinApi } from './src/http-client';

/*
 * put .env file, and write as follows.
 * GMO_API_KEY=xxxxxxxx
 * GMO_API_SECRET=yyyyyyyy
 */

(async function main() {
  const client = new GmoCoinApi({
    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
    secretKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  });

  try {
    const { data } = await client.getAccountAsset();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
})();
