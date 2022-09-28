import { shouldERC1155Base } from "./base";
import { shouldERC1155Burnable } from "./burnable";
import { shouldERC1155Royalty } from "./royalty";
import { shouldERC1155Supply } from "./supply";

export function shouldERC1155Simple(name: string) {
  shouldERC1155Base(name);
  shouldERC1155Burnable(name);
  shouldERC1155Royalty(name);
  shouldERC1155Supply(name);
}
