import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { TokenType } from "@framework/types";

import { UserEntity } from "../../user/user.entity";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Injectable()
export class LootService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
  ) {}

  public async signPostBattleLoot(userEntity: UserEntity): Promise<IServerSignature> {
    const templateEntities = await this.templateService.findAll({});

    const nonce = utils.randomBytes(32);
    const signature = await this.getSign(nonce, templateEntities, userEntity);
    return { nonce: utils.hexlify(nonce), signature };
  }

  public async getSign(
    nonce: Uint8Array,
    templateEntities: Array<TemplateEntity>,
    userEntity: UserEntity,
  ): Promise<string> {
    return this.signer._signTypedData(
      // Domain
      {
        name: "Exchange",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("POST_BATTLE_LOOT_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "account", type: "address" },
          { name: "items", type: "Asset[]" },
          { name: "ingredients", type: "Asset[]" },
        ],
        Asset: [
          { name: "tokenType", type: "uint256" },
          { name: "token", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        account: userEntity.wallet,
        items: templateEntities.map(templateEntity => ({
          tokenType: Object.keys(TokenType).indexOf(templateEntity.contract.contractType),
          token: templateEntity.contract.address,
          tokenId: templateEntity.id,
          amount: templateEntity.amount,
        })),
        ingredients: [],
      },
    );
  }
}
