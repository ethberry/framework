import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, utils, Wallet } from "ethers";

import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";

import { Erc998TemplateService } from "../template/template.service";
import { DropboxService } from "../../mechanics/dropbox/dropbox.service";
import { ISignTemplateDto } from "./interfaces";
import { UniContractTemplate } from "@framework/types";

@Injectable()
export class Erc998MarketplaceService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly erc998TemplateService: Erc998TemplateService,
    private readonly erc998DropboxService: DropboxService,
  ) {}

  public async signTemplate(dto: ISignTemplateDto): Promise<IServerSignature> {
    const templateEntity = await this.erc998TemplateService.findOne(
      { id: dto.templateId },
      { relations: { uniContract: true, price: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new NotFoundException("limitExceeded");
    }

    const totalTokenPrice =
      templateEntity.price.components[0].uniContract.contractTemplate === UniContractTemplate.NATIVE
        ? utils.parseUnits(templateEntity.price.toString(), "wei")
        : 0;

    const signData = {
      nonce: utils.randomBytes(32),
      collection: templateEntity.uniContract.address,
      templateId: dto.templateId, // Dropbox content
      price: totalTokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: utils.hexlify(signData.nonce), signature };
  }

  public async signDropbox(dto: ISignTemplateDto): Promise<IServerSignature> {
    const dropboxEntity = await this.erc998DropboxService.findOne(
      { id: dto.templateId },
      { relations: { uniContract: true, item: true } },
    );

    if (!dropboxEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    const templateEntity = await this.erc998TemplateService.findOne(
      { id: dropboxEntity.item.components[0].uniTokenId },
      { relations: { uniContract: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new NotFoundException("limitExceeded");
    }

    const totalTokenPrice =
      dropboxEntity.price.components[0].uniContract.contractTemplate === UniContractTemplate.NATIVE
        ? utils.parseUnits(dropboxEntity.price.toString(), "wei")
        : 0;

    const signData = {
      nonce: utils.randomBytes(32),
      collection: dropboxEntity.uniContract.address,
      templateId: templateEntity.id, // Dropbox content
      price: totalTokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: utils.hexlify(signData.nonce), signature };
  }

  public async getSign(data: Record<string, any>): Promise<string> {
    return this.signer._signTypedData(
      {
        name: "ERC998Marketplace",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("ERC721_MARKETPLACE_ADDR", ""),
      },
      prepareEip712(data),
      data,
    );
  }
}
