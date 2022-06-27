import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";

import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { Erc20TokenTemplate } from "@framework/types";

import { Erc721TemplateService } from "../template/template.service";
import { Erc721DropboxService } from "../dropbox/dropbox.service";
import { ISignTemplateDto } from "./interfaces";

@Injectable()
export class Erc721MarketplaceService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly erc721TemplateService: Erc721TemplateService,
    private readonly erc721DropboxService: Erc721DropboxService,
  ) {}

  public async signTemplate(dto: ISignTemplateDto): Promise<IServerSignature> {
    const templateEntity = await this.erc721TemplateService.findOne(
      { id: dto.templateId },
      { relations: { erc721Collection: true, erc20Token: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    if (templateEntity.amount > 0 && templateEntity.amount <= templateEntity.instanceCount) {
      throw new NotFoundException("limitExceeded");
    }

    const totalTokenPrice =
      templateEntity.erc20Token.contractTemplate === Erc20TokenTemplate.NATIVE
        ? utils.parseUnits(templateEntity.price.toString(), "wei")
        : 0;

    const signData = {
      nonce: utils.randomBytes(32),
      collection: templateEntity.erc721Collection.address,
      templateId: dto.templateId, // Dropbox content
      price: totalTokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: utils.hexlify(signData.nonce), signature };
  }

  public async signDropbox(dto: ISignTemplateDto): Promise<IServerSignature> {
    const dropboxEntity = await this.erc721DropboxService.findOne(
      { id: dto.templateId },
      { relations: { erc721Collection: true, erc721Template: true } },
    );

    if (!dropboxEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    const templateEntity = await this.erc721TemplateService.findOne(
      { id: dropboxEntity.erc721TemplateId },
      { relations: { erc721Collection: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    if (templateEntity.amount > 0 && templateEntity.amount <= templateEntity.instanceCount) {
      throw new NotFoundException("limitExceeded");
    }

    const totalTokenPrice =
      dropboxEntity.erc20Token.contractTemplate === Erc20TokenTemplate.NATIVE
        ? utils.parseUnits(dropboxEntity.price.toString(), "wei")
        : 0;

    const signData = {
      nonce: utils.randomBytes(32),
      collection: dropboxEntity.erc721Collection.address,
      templateId: templateEntity.id, // Dropbox content
      price: totalTokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: utils.hexlify(signData.nonce), signature };
  }

  public async getSign(data: Record<string, any>): Promise<string> {
    return this.signer._signTypedData(
      {
        name: "ERC721Marketplace",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("ERC721_MARKETPLACE_ADDR", ""),
      },
      prepareEip712(data),
      data,
    );
  }
}
