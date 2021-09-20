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
  console.log("CitizenRedeemed connected!");

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
const CitizenRedeemed = async () => {
  const main = async () => {
    const filter = contract.filters.BurnMintToken();
    const res = await contract.queryFilter(filter);

    try {
      await bot.user?.setUsername(`Redeemed ${res.length}`);
    } catch {}

    setTimeout(main, 1 * 60 * 1000);
  };

  await bot.login(process.env.TOKEN_REDEEMED);
  main();
};

// Export.
export default CitizenRedeemed;
