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

    await bot.user?.setUsername(`${res.length} $CITIZEN Forged`);

    setTimeout(main, 1 * 60 * 1000);
  };

  await bot.login(process.env.TOKEN);
  main();
};

// Export.
export default CitizenRedeemed;
