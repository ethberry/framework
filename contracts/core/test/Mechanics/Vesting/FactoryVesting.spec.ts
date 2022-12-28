import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { factoryDeployVesting } from "./shared/factoryDeployVesting";
import { deployContractManager } from "./shared/fixture";

use(solidity);

describe("Factory Vesting", function () {
  describe("Deploy Vesting via CM", function () {
    it("should deploy", async function () {
      const factory = await deployContractManager();
      // VESTING FACTORY DEPLOY
      await factoryDeployVesting(factory);
    });
  });
});
