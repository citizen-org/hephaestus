// Inject secrets.
import { config } from "dotenv";
config();

// Import dependencies.
import { Client } from "discord.js";
import { Contract } from "../utils";

// Setup contract instance.
const contract = Contract();

// Setup Discord.js instance.
const bot = new Client({ intents: [] });

bot.on("ready", () => {
  console.log("CitizenSupply connected!");

  bot.user?.setPresence({
    activities: [
      {
        name: "$CITIZEN burns",
        type: "WATCHING",
      },
    ],
  });
});

// Main program.
const CitizenSupply = async () => {
  const main = async () => {
    const filter = contract.filters.BurnMintToken();
    const res = await contract.queryFilter(filter);

    try {
      await bot.user?.setUsername(`Supply ${500 - res.length}/500`);
    } catch {}

    setTimeout(main, 1 * 60 * 1000);
  };

  await bot.login(process.env.TOKEN_SUPPLY);
  main();
};

// Export.
export default CitizenSupply;
