import { shouldERC721BaseUrl } from "./baseUrl";
import { shouldERC721Base } from "./base";
import { shouldERC721Burnable } from "./burnable";

export function shouldERC721Simple(name: string) {
  shouldERC721Base(name);

  shouldERC721Burnable(name);

  shouldERC721BaseUrl(name);
}
