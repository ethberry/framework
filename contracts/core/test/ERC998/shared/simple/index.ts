import { Contract } from "ethers";
import { shouldBehaveLikeERC721Simple } from "../../../ERC721/shared/simple";

export function shouldBehaveLikeERC998Simple(factory: () => Promise<Contract>) {
  shouldBehaveLikeERC721Simple(factory);
}
