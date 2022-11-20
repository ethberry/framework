import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldBeAccessible } from "@gemunion/contracts-mocha";

import { DEFAULT_ADMIN_ROLE } from "../constants";
import { deployContractManager } from "./fixture";

use(solidity);

describe("ContractManager", function () {
  const factory = () => deployContractManager(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE);
});
