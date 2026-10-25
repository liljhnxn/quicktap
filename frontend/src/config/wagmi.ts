import { http, createConfig } from "wagmi";
import { botchainMainnet } from "./chain";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http("https://rpc.botchain.ai"),
  },
  ssr: true,
});
