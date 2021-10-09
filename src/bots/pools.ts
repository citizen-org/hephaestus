// Inject secrets.
import { config } from "dotenv";
config();

// Import dependencies.
import { Client, GuildMember } from "discord.js";
import { gql, request } from "graphql-request";

// Define GraphQL variables.
const ethPool = "0xf5d90ce04151979d0a7c8eaced8ed1419e190477";
const kongPool = "0x62a00b8a78627b34d724f13d5dbf26c207121a61";

const query = gql`
  {
    pools(
      where: {
        id_in: [
          "${ethPool}"
          "${kongPool}"
        ]
      }
    ) {
      id
      totalValueLockedToken0
      totalValueLockedToken1
    }
  }
`;

// Setup Discord.js instances.
const ethClient = new Client({ intents: [] });
const kongClient = new Client({ intents: [] });

ethClient.on("ready", () => {
  console.log("CitizenEthPool connected!");

  ethClient.user?.setPresence({
    activities: [
      {
        name: "$CITIZEN pools",
        type: "WATCHING",
      },
    ],
  });
});

kongClient.on("ready", () => {
  console.log("KongCitizenPool connected!");

  kongClient.user?.setPresence({
    activities: [
      {
        name: "$CITIZEN pools",
        type: "WATCHING",
      },
    ],
  });
});

// Main program.
const CitizenPools = async () => {
  let ethBot: GuildMember;
  let kongBot: GuildMember;

  const main = async () => {
    const res = (
      await request(
        "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
        query
      )
    ).pools;

    const ethRes = res.find((item: any) => item.id === ethPool);
    const kongRes = res.find((item: any) => item.id === kongPool);

    try {
      await ethBot.setNickname(
        `${Math.floor(ethRes.totalValueLockedToken0)} CITIZEN/ETH`
      );
    } catch {}
    try {
      await kongBot.setNickname(
        `${Math.floor(kongRes.totalValueLockedToken1)} KONG/CITIZEN`
      );
    } catch {}

    setTimeout(main, 1 * 60 * 1000);
  };

  await ethClient.login(process.env.ETH_POOL);
  await kongClient.login(process.env.KONG_POOL);

  const ethGuild = ethClient.guilds.cache.get("837757696295698462")!;
  const kongGuild = kongClient.guilds.cache.get("837757696295698462")!;
  ethBot = await ethGuild.members.fetch({
    user: "896169457561501716",
  });
  kongBot = await kongGuild.members.fetch({
    user: "896169976896036905",
  });

  main();
};

// Export.
export default CitizenPools;
