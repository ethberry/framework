import { shouldBehaveLikeERC721 } from "./base";
import { shouldBehaveLikeERC721Burnable } from "./burnable";
import { shouldBaseUrl } from "./baseUrl";

export function shouldBehaveLikeERC721Simple(factory: () => Promise<any>) {
  shouldBehaveLikeERC721(factory);
  shouldBehaveLikeERC721Burnable(factory);
  shouldBaseUrl(factory);
}
