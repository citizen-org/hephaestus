// Inject secrets so that we can access them.
import { config } from "dotenv";
config();

// Import dependencies.
import { ethers } from "ethers";
import Twitter from "twitter-lite";
import Discord from "webhook-discord";

// Define constants.
const ADDRESS = "0x8499c62EC0B4F1f2F0eD93e67e19587F6b94afaF";
const ABI = ["event BurnMintToken(address from)"];

// Setup contract instance.
const provider = new ethers.providers.InfuraWebSocketProvider(
  "mainnet",
  process.env.KEY
);

const contract = new ethers.Contract(ADDRESS, ABI, provider);

// Setup Discord instance.
const discord = new Discord.Webhook(process.env.DISCORD?.toString()!);

// Setup Twitter instance.
const twitter = new Twitter({
  consumer_key: process.env.CONSUMER_KEY?.toString()!,
  consumer_secret: process.env.CONSUMER_SECRET?.toString()!,
  access_token_key: process.env.ACCESS_KEY?.toString()!,
  access_token_secret: process.env.ACCESS_SECRET?.toString()!,
});

// Helper to fetch token ID.
const fetchTokenId = async (address: string): Promise<string> => {
  const nft = new ethers.Contract(
    "0x355929193308e157760824bA860390924d77FaB9",
    [
      "function balanceOf(address owner) external view returns (uint256 balance)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId)",
    ],
    provider
  );

  const balance = (await nft.balanceOf(address)) as number;

  if (balance > 0) {
    const tokenId = (await nft.tokenOfOwnerByIndex(
      address,
      balance - 1
    )) as number;

    return tokenId.toString().padStart(3, "0");
  }

  return "XXX";
};

// Listen to new events.
contract.on("BurnMintToken", async (from, event) => {
  const name = (await provider.lookupAddress(from)) || from;
  const tokenId = await fetchTokenId(from);

  console.log(
    `\naddress = ${name}\ntx      = ${event.transactionHash}\ntokenId = ${tokenId}`
  );

  // Send Discord message.
  const message = new Discord.MessageBuilder()
    .setColor("#bdff00")
    .setFooter(
      "$CITIZEN // kong.land",
      "https://ipfs.io/ipfs/QmQmZNp7JNdvYAA8ichVr5bVZUUTfU83zJ8hTZoQfb9YBh"
    )
    .setTitle(":fire::hammer::fire: New Citizen Forged :fire::hammer::fire:")
    .setDescription(`Token ID #${tokenId}\n\n${name}`)
    .setURL(`https://etherscan.io/tx/${event.transactionHash}`)
    .setName("Hephaestus");

  await discord.send(message);

  // Post Tweet.
  await twitter.post("statuses/update", {
    status: `🔥🔨🔥 New Citizen Forged 🔥🔨🔥\n\nToken ID #${tokenId}\n\nhttps://etherscan.io/tx/${event.transactionHash}`,
  });
});
