// Inject secrets so that we can access them.
import { config } from "dotenv";
config();

// Import dependencies.
import { ethers } from "ethers";

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

// Listen to new events.
contract.on("BurnMintToken", (from, event) => {
  console.log(from);
});
