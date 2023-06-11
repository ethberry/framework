import { shouldSetBaseURI } from "./setBaseURI";
import { shouldTokenURI } from "./tokenURI";

export function shouldBaseUrl(factory: () => Promise<any>) {
  shouldSetBaseURI(factory);
  shouldTokenURI(factory);
}
