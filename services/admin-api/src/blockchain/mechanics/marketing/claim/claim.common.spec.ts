import { Validator } from "class-validator";
import { plainToClass } from "class-transformer";
import { TokenType } from "@framework/types";

import { ClaimTemplateRowDto } from "./template/dto";
import { ClaimTokenRowDto } from "./token/dto";

describe("CLAIM_ROW", () => {
  const initialData = {
    account: "0x1234567890abcdef1234567890abcdef12345678",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    tokenType: TokenType.NATIVE,
    templateId: 0,
    tokenId: 0,
    amount: "1000",
    endTimestamp: "2023-12-31T23:59:59Z",
  };
  describe("AllInsteadCoinDto", () => {
    it.each([TokenType.NATIVE, TokenType.ERC20])(
      "should fail validation with incorrect tokenType in claim template",
      async tokenType => {
        const instance = plainToClass(ClaimTemplateRowDto, { ...initialData, tokenType });
        const validator = new Validator();
        const errors = await validator.validate(instance);
        expect(errors.some(e => e.property === "tokenType")).toBe(true);
        expect(errors.length).toBe(1);
      },
    );
  });

  it.each([TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155])(
    "template id should be valid in claim template",
    async tokenType => {
      const instance = plainToClass(ClaimTemplateRowDto, { ...initialData, tokenType, templateId: 1, tokenId: 1 });
      const validator = new Validator();
      const errors = await validator.validate(instance);
      expect(errors.length).toBe(0);
    },
  );

  it("should fail validation with incorrect amount in claim template", async () => {
    const instance = plainToClass(ClaimTemplateRowDto, {
      ...initialData,
      tokenType: TokenType.ERC1155,
      tokenId: 1,
      templateId: 1,
      amount: "abc",
    });
    const validator = new Validator();
    const errors = await validator.validate(instance);
    expect(errors.some(e => e.property === "amount")).toBe(true);
    expect(errors.length).toBe(1);
  });

  describe("AllInsteadNativeDto", () => {
    it.each([TokenType.NATIVE])("should fail validation with incorrect tokenType in claim token", async tokenType => {
      const instance = plainToClass(ClaimTokenRowDto, { ...initialData, tokenType });
      const validator = new Validator();
      const errors = await validator.validate(instance);
      expect(errors.some(e => e.property === "tokenType")).toBe(true);
      expect(errors.length).toBe(1);
    });

    it.each([TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155])(
      "token id should be valid in claim token",
      async tokenType => {
        const instance = plainToClass(ClaimTemplateRowDto, { ...initialData, tokenType, templateId: 1, tokenId: 1 });
        const validator = new Validator();
        const errors = await validator.validate(instance);
        expect(errors.length).toBe(0);
      },
    );

    it.each([TokenType.ERC20, TokenType.ERC1155])(
      "should fail validation with incorrect amount in claim token",
      async tokenType => {
        const instance = plainToClass(ClaimTokenRowDto, {
          ...initialData,
          tokenType,
          templateId: 1,
          tokenId: 1,
          amount: "abc",
        });
        const validator = new Validator();
        const errors = await validator.validate(instance);
        expect(errors.some(e => e.property === "amount")).toBe(true);
        expect(errors.length).toBe(1);
      },
    );
  });
});
