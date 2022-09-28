import { shouldBurn } from "./burn";
import { shouldBurnFrom } from "./burnFrom";

export function shouldERC20Burnable(name: string) {
  shouldBurn(name);
  shouldBurnFrom(name);
}
