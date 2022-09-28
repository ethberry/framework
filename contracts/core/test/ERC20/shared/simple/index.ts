import { shouldCapped } from "./capped";
import { shouldReceive } from "./receive";
import { shouldSnapshot } from "./snapshot";
import { shouldERC20Base } from "./base";
import { shouldERC20Burnable } from "./burnable";

export function shouldERC20Simple(name: string) {
  shouldERC20Base(name);

  shouldERC20Burnable(name);

  shouldCapped(name);

  shouldReceive(name);

  shouldSnapshot(name);
}
