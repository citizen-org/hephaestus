// Inject secrets so that we can access them.
import { config } from "dotenv";
config();

// Import dependencies.
import { ethers } from "ethers";
import Discord from "webhook-discord";

// Define constants.
const ADDRESS = "0x8499c62EC0B4F1f2F0eD93e67e19587F6b94afaF";
const ABI = ["event BurnMintToken(address from)"];

// Setup contract instance.
// const provider = new ethers.providers.InfuraWebSocketProvider(
//   "mainnet",
//   process.env.KEY
// );
const provider = new ethers.providers.InfuraProvider(
  "mainnet",
  process.env.KEY
);

// TODO: Remove once in prod.
provider.resetEventsBlock(13230249);

const contract = new ethers.Contract(ADDRESS, ABI, provider);

// Setup Discord instance.
const discord = new Discord.Webhook(process.env.DISCORD?.toString()!);

// Listen to new events.
contract.on("BurnMintToken", async (from, event) => {
  const name = (await provider.lookupAddress(from)) || from;
  
  console.log(`\naddress = ${name}\ntx      = ${event.transactionHash}\n`);

  const message = new Discord.MessageBuilder()
    .setColor("#bdff00")
    .setFooter(
      "$CITIZEN // kong.land",
      "https://ipfs.io/ipfs/QmQmZNp7JNdvYAA8ichVr5bVZUUTfU83zJ8hTZoQfb9YBh"
    )
    .setTitle(":fire::hammer::fire: New Citizen Forged :fire::hammer::fire:")
    .setDescription(`Token ID #XXX\n\n${name}`)
    .setURL(`https://etherscan.io/tx/${event.transactionHash}`)
    .setName("Hephaestus");

  await discord.send(message);
});
