import { shouldSetBaseURI } from "./setBaseURI";
import { shouldTokenURI } from "./tokenURI";

export function shouldERC721BaseUrl(name: string) {
  shouldSetBaseURI(name);
  shouldTokenURI(name);
}
