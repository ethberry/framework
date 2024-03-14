import { Validator } from "class-validator";
import { plainToInstance } from "class-transformer";

import { AllTypesDto, CoinDto, NativeDto, NftDto, NotNativeDto, SemiCoinDto, SemiNftDto } from "./custom";
import { TokenType } from "@framework/types";

describe("CustomDto", () => {
  describe("NativeDto", () => {
    it("NATIVE", () => {
      const model = plainToInstance(NativeDto, {
        components: [
          {
            tokenType: TokenType.NATIVE,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC20", () => {
      const model = plainToInstance(NativeDto, {
        components: [
          {
            tokenType: TokenType.ERC20,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC721", () => {
      const model = plainToInstance(NativeDto, {
        components: [
          {
            tokenType: TokenType.ERC721,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC998", () => {
      const model = plainToInstance(NativeDto, {
        components: [
          {
            tokenType: TokenType.ERC998,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC1155", () => {
      const model = plainToInstance(NativeDto, {
        components: [
          {
            tokenType: TokenType.ERC1155,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });
  });

  describe("CoinDto", () => {
    it("NATIVE", () => {
      const model = plainToInstance(CoinDto, {
        components: [
          {
            tokenType: TokenType.NATIVE,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC20", () => {
      const model = plainToInstance(CoinDto, {
        components: [
          {
            tokenType: TokenType.ERC20,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC721", () => {
      const model = plainToInstance(CoinDto, {
        components: [
          {
            tokenType: TokenType.ERC721,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC998", () => {
      const model = plainToInstance(CoinDto, {
        components: [
          {
            tokenType: TokenType.ERC998,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC1155", () => {
      const model = plainToInstance(CoinDto, {
        components: [
          {
            tokenType: TokenType.ERC1155,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });
  });

  describe("SemiCoinDto", () => {
    it("NATIVE", () => {
      const model = plainToInstance(SemiCoinDto, {
        components: [
          {
            tokenType: TokenType.NATIVE,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC20", () => {
      const model = plainToInstance(SemiCoinDto, {
        components: [
          {
            tokenType: TokenType.ERC20,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC721", () => {
      const model = plainToInstance(SemiCoinDto, {
        components: [
          {
            tokenType: TokenType.ERC721,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC998", () => {
      const model = plainToInstance(SemiCoinDto, {
        components: [
          {
            tokenType: TokenType.ERC998,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC1155", () => {
      const model = plainToInstance(SemiCoinDto, {
        components: [
          {
            tokenType: TokenType.ERC1155,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });
  });

  describe("NftDto", () => {
    it("NATIVE", () => {
      const model = plainToInstance(NftDto, {
        components: [
          {
            tokenType: TokenType.NATIVE,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC20", () => {
      const model = plainToInstance(NftDto, {
        components: [
          {
            tokenType: TokenType.ERC20,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC721", () => {
      const model = plainToInstance(NftDto, {
        components: [
          {
            tokenType: TokenType.ERC721,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC998", () => {
      const model = plainToInstance(NftDto, {
        components: [
          {
            tokenType: TokenType.ERC998,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC1155", () => {
      const model = plainToInstance(NftDto, {
        components: [
          {
            tokenType: TokenType.ERC1155,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });
  });

  describe("SemiNftDto", () => {
    it("NATIVE", () => {
      const model = plainToInstance(SemiNftDto, {
        components: [
          {
            tokenType: TokenType.NATIVE,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC20", () => {
      const model = plainToInstance(SemiNftDto, {
        components: [
          {
            tokenType: TokenType.ERC20,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC721", () => {
      const model = plainToInstance(SemiNftDto, {
        components: [
          {
            tokenType: TokenType.ERC721,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC998", () => {
      const model = plainToInstance(SemiNftDto, {
        components: [
          {
            tokenType: TokenType.ERC998,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC1155", () => {
      const model = plainToInstance(SemiNftDto, {
        components: [
          {
            tokenType: TokenType.ERC1155,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });
  });

  describe("NotNativeDto", () => {
    it("NATIVE", () => {
      const model = plainToInstance(NotNativeDto, {
        components: [
          {
            tokenType: TokenType.NATIVE,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(1);
      });
    });

    it("ERC20", () => {
      const model = plainToInstance(NotNativeDto, {
        components: [
          {
            tokenType: TokenType.ERC20,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC721", () => {
      const model = plainToInstance(NotNativeDto, {
        components: [
          {
            tokenType: TokenType.ERC721,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC998", () => {
      const model = plainToInstance(NotNativeDto, {
        components: [
          {
            tokenType: TokenType.ERC998,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC1155", () => {
      const model = plainToInstance(NotNativeDto, {
        components: [
          {
            tokenType: TokenType.ERC1155,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });
  });

  describe("AllTypesDto", () => {
    it("NATIVE", () => {
      const model = plainToInstance(AllTypesDto, {
        components: [
          {
            tokenType: TokenType.NATIVE,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC20", () => {
      const model = plainToInstance(AllTypesDto, {
        components: [
          {
            tokenType: TokenType.ERC20,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC721", () => {
      const model = plainToInstance(AllTypesDto, {
        components: [
          {
            tokenType: TokenType.ERC721,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC998", () => {
      const model = plainToInstance(AllTypesDto, {
        components: [
          {
            tokenType: TokenType.ERC998,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });

    it("ERC1155", () => {
      const model = plainToInstance(AllTypesDto, {
        components: [
          {
            tokenType: TokenType.ERC1155,
            contractId: 1,
            templateId: 1,
            tokenId: 1,
            amount: "1000",
          },
        ],
      });

      const validator = new Validator();
      return validator.validate(model).then(errors => {
        expect(errors.length).toEqual(0);
      });
    });
  });
});
