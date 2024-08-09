import { Validator } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ZeroAddress } from "ethers";

import { TokenType } from "@gemunion/types-blockchain";

import { BlockChainAssetTemplateDto } from "./bc-asset";

describe("BCAssets", () => {
  describe("BlockChainAssetTemplateDto", () => {
    it("ERC20", () => {
      const model = plainToInstance(BlockChainAssetTemplateDto, {
        tokenType: TokenType.ERC20,
        address: ZeroAddress,
        amount: 1,
        templateId: 1,
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        console.error(JSON.stringify(errors, null, "\t"));
        expect(errors.length).toEqual(1);
      });
    });
  });

  describe("BlockChainAssetTokenDto", () => {
    it("ERC20", () => {
      const model = plainToInstance(BlockChainAssetTemplateDto, {
        tokenType: TokenType.ERC20,
        address: ZeroAddress,
        amount: 1,
        templateId: 1,
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        console.error(JSON.stringify(errors, null, "\t"));
        expect(errors.length).toEqual(0);
      });
    });
  });
});
