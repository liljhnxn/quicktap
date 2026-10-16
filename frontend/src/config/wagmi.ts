import { http, createConfig } from "wagmi";
import { botchainTestnet } from "./chain";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainTestnet.id]: http("https://rpc.bohr.life"),
  },
  ssr: true,
});
