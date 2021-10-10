// Import dependencies.
import axios from "axios";
import { CitizenERC721, Twitter } from "./utils";

// Initialise the contract instance.
const contract = CitizenERC721();

// Initialise the Twitter instance.
const twitter = Twitter();

// Listen to new events.
contract.on("DeviceSet", async (tokenId) => {
  const owner = (await contract.ownerOf(tokenId)) as string;
  const tokenURI = (await contract.tokenURI(tokenId)) as string;

  if (tokenURI) {
    // Fetch the video from the NFT metadata.
    let res: any;
    res = await axios.get(tokenURI);
    res = await axios.get(res.data.animation_url, {
      responseType: "arraybuffer",
    });
    const data = res.data as Buffer;

    // TODO: Upload the video to Twitter.
    const media_id = "";

    // Post a new tweet.
    await twitter.post("statuses/update", {
      status: ``, // TODO ...
      media_ids: media_id,
    });
  }
});
