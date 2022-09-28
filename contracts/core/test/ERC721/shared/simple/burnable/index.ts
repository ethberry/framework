import { shouldBurn } from "./burn";

export function shouldERC721Burnable(name: string) {
  shouldBurn(name);
}
