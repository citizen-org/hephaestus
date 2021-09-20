// Inject secrets.
import { config } from "dotenv";
config();

// Import dependencies.
import { ethers } from "ethers";

// Helper for connecting to the contract.
export const Contract = () => {
  const provider = new ethers.providers.InfuraWebSocketProvider(
    "mainnet",
    process.env.KEY
  );

  const contract = new ethers.Contract(
    "0x8499c62EC0B4F1f2F0eD93e67e19587F6b94afaF",
    ["event BurnMintToken(address from)"],
    provider
  );

  return contract;
};
