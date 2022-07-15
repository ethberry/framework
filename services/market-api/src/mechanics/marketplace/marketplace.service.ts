import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { ITemplate, TokenType } from "@framework/types";

import { ISignDropboxDto, ISignTemplateDto } from "./interfaces";
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
    const { templateId, account } = dto;
    const templateEntity = await this.templateService.findOne(
      { id: templateId },
      {
        join: {
          alias: "template",
          leftJoinAndSelect: {
            contract: "template.contract",
            price: "template.price",
            price_components: "price.components",
            price_contract: "price_components.contract",
            price_token: "price_components.token",
          },
        },
      },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);

    const signature = await this.getSignature(nonce, templateEntity, account);
    return { nonce: utils.hexlify(nonce), signature };
  }

  public async signDropbox(dto: ISignDropboxDto): Promise<IServerSignature> {
    const { dropboxId, account } = dto;

    const dropboxEntity = await this.dropboxService.findOne(
      { id: dropboxId },
      {
        join: {
          alias: "dropbox",
          leftJoinAndSelect: {
            item: "dropbox.item",
            item_components: "item.components",
          },
        },
      },
    );

    if (!dropboxEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    const templateEntity = await this.templateService.findOne(
      { id: dropboxEntity.item.components[0].tokenId },
      {
        join: {
          alias: "template",
          leftJoinAndSelect: {
            contract: "template.contract",
            price: "template.price",
            price_components: "price.components",
            price_contract: "price_components.contract",
            price_token: "price_components.token",
          },
        },
      },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new NotFoundException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);

    const signature = await this.getSignature(nonce, templateEntity, account);
    return { nonce: utils.hexlify(nonce), signature };
  }

  public async getSignature(nonce: Uint8Array, templateEntity: ITemplate, account: string): Promise<string> {
    return this.signer._signTypedData(
      // Domain
      {
        name: "Exchange",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("EXCHANGE_ADDR", ""),
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
        account,
        items: [
          {
            tokenType: Object.keys(TokenType).indexOf(templateEntity.contract!.contractType),
            token: templateEntity.contract!.address,
            tokenId: templateEntity.id,
            amount: 1,
          },
        ],
        ingredients: templateEntity.price?.components.map(component => ({
          tokenType: Object.keys(TokenType).indexOf(component.tokenType),
          token: component.contract?.address,
          tokenId: component.token?.tokenId,
          amount: component.amount,
        })),
      },
    );
  }
}
