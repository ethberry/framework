import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { ITemplate, TokenType } from "@framework/types";

import { ISignTemplateDto } from "./interfaces";
import { DropboxService } from "../dropbox/dropbox.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";

@Injectable()
export class MarketplaceService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
    private readonly dropboxService: DropboxService,
  ) {}

  public async signTemplate(dto: ISignTemplateDto): Promise<IServerSignature> {
    const { item } = dto;
    const templateEntity = await this.templateService.findOne(
      { id: item.components[0].tokenId },
      { relations: { contract: true, price: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new NotFoundException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);

    const signature = await this.getSign(nonce, templateEntity);
    return { nonce: utils.hexlify(nonce), signature };
  }

  public async signDropbox(dto: ISignTemplateDto): Promise<IServerSignature> {
    const { item } = dto;

    const dropboxEntity = await this.dropboxService.findOne(
      { id: item.components[0].tokenId },
      { relations: { contract: true, item: true } },
    );

    if (!dropboxEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    const templateEntity = await this.templateService.findOne(
      { id: dropboxEntity.item.components[0].tokenId },
      { relations: { contract: true, price: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new NotFoundException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);

    const signature = await this.getSign(nonce, templateEntity);
    return { nonce: utils.hexlify(nonce), signature };
  }

  public async getSign(nonce: Uint8Array, templateEntity: ITemplate): Promise<string> {
    return this.signer._signTypedData(
      // Domain
      {
        name: "Marketplace",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("MARKETPLACE_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "item", type: "Asset" },
          { name: "price", type: "Asset" },
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
        item: {
          tokenType: Object.keys(TokenType).indexOf(templateEntity.contract!.contractType),
          token: templateEntity.contract!.address,
          tokenId: templateEntity.id,
          amount: templateEntity.amount,
        },
        price: {
          tokenType: Object.keys(TokenType).indexOf(templateEntity.price!.components[0].tokenType),
          token: templateEntity.price!.components[0].contract?.address,
          tokenId: templateEntity.price!.components[0].tokenId,
          amount: templateEntity.price!.components[0].amount,
        },
      },
    );
  }
}
