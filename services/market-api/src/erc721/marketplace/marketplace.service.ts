import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, utils, Wallet } from "ethers";

import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { ContractTemplate } from "@framework/types";

import { Erc721TemplateService } from "../template/template.service";
import { DropboxService } from "../../mechanics/dropbox/dropbox.service";
import { ISignTemplateDto } from "./interfaces";

@Injectable()
export class Erc721MarketplaceService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly erc721TemplateService: Erc721TemplateService,
    private readonly dropboxService: DropboxService,
  ) {}

  public async signTemplate(dto: ISignTemplateDto): Promise<IServerSignature> {
    const templateEntity = await this.erc721TemplateService.findOne(
      { id: dto.templateId },
      { relations: { contract: true, price: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new NotFoundException("limitExceeded");
    }

    const totalTokenPrice =
      templateEntity.price.components[0].contract.contractTemplate === ContractTemplate.NATIVE
        ? utils.parseUnits(templateEntity.price.toString(), "wei")
        : 0;

    const signData = {
      nonce: utils.randomBytes(32),
      collection: templateEntity.contract.address,
      templateId: dto.templateId, // Dropbox content
      price: totalTokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: utils.hexlify(signData.nonce), signature };
  }

  public async signDropbox(dto: ISignTemplateDto): Promise<IServerSignature> {
    const dropboxEntity = await this.dropboxService.findOne(
      { id: dto.templateId },
      { relations: { contract: true, item: true } },
    );

    if (!dropboxEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    const templateEntity = await this.erc721TemplateService.findOne(
      { id: dropboxEntity.item.components[0].tokenId },
      { relations: { contract: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new NotFoundException("limitExceeded");
    }

    const totalTokenPrice =
      dropboxEntity.price.components[0].contract.contractTemplate === ContractTemplate.NATIVE
        ? utils.parseUnits(dropboxEntity.price.toString(), "wei")
        : 0;

    const signData = {
      nonce: utils.randomBytes(32),
      collection: dropboxEntity.contract.address,
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
