// Inject secrets.
import { config } from "dotenv";
config();

// Import dependencies.
import { Client, GuildMember } from "discord.js";
import { Contract } from "../utils";

// Setup contract instance.
const contract = Contract();

// Setup Discord.js instance.
const client = new Client({ intents: [] });

client.on("ready", () => {
  console.log("CitizenSupply connected!");

  client.user?.setPresence({
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
  let bot: GuildMember;

  const main = async () => {
    const filter = contract.filters.BurnMintToken();
    const res = await contract.queryFilter(filter);

    try {
      await bot.setNickname(`${500 - res.length} Remaining`);
    } catch {}

    setTimeout(main, 1 * 60 * 1000);
  };

  await client.login(process.env.TOKEN_SUPPLY);

  const guild = client.guilds.cache.get("837757696295698462")!;
  bot = await guild.members.fetch({
    user: "889620711721824337",
  });

  main();
};

// Export.
export default CitizenSupply;
