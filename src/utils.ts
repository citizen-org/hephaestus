// Inject secrets.
import { config } from "dotenv";
config();

// Import dependencies.
import { ethers } from "ethers";
import TwitterClient from "twitter-lite";

// Helpers.
export const provider = new ethers.providers.InfuraWebSocketProvider(
  "mainnet",
  process.env.KEY
);

export const BurnMintCitizen = () => {
  return new ethers.Contract(
    "0x8499c62EC0B4F1f2F0eD93e67e19587F6b94afaF",
    ["event BurnMintToken(address from)"],
    provider
  );
};

export const CitizenERC721 = () => {
  return new ethers.Contract(
    "0x355929193308e157760824ba860390924d77fab9",
    [
      "event DeviceSet(uint256 tokenId, string publicKeyHash, string merkleRoot)",
      "function balanceOf(address owner) external view returns (uint256 balance)",
      "function ownerOf(uint256 tokenId) public view virtual override returns (address)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId)",
      "function tokenURI(uint256 tokenId) public view virtual override returns (string memory)",
    ],
    provider
  );
};

export const Twitter = () => {
  return new TwitterClient({
    consumer_key: process.env.CONSUMER_KEY?.toString()!,
    consumer_secret: process.env.CONSUMER_SECRET?.toString()!,
    access_token_key: process.env.ACCESS_KEY?.toString()!,
    access_token_secret: process.env.ACCESS_SECRET?.toString()!,
  });
};
