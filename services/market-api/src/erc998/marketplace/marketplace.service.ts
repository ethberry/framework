import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, utils, Wallet } from "ethers";

import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";

import { Erc998TemplateService } from "../template/template.service";
import { Erc998DropboxService } from "../dropbox/dropbox.service";
import { ISignTemplateDto } from "./interfaces";

@Injectable()
export class Erc998MarketplaceService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly erc998TemplateService: Erc998TemplateService,
    private readonly erc998DropboxService: Erc998DropboxService,
  ) {}

  public async signTemplate(dto: ISignTemplateDto): Promise<IServerSignature> {
    const templateEntity = await this.erc998TemplateService.findOne(
      { id: dto.templateId },
      { relations: { erc998Collection: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    if (templateEntity.amount > 0 && templateEntity.amount <= templateEntity.instanceCount) {
      throw new NotFoundException("limitExceeded");
    }

    const totalTokenPrice = utils.parseUnits(templateEntity.price.toString(), "wei");
    const signData = {
      nonce: utils.randomBytes(32),
      collection: templateEntity.erc998Collection.address,
      templateId: dto.templateId, // Dropbox content
      price: totalTokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: utils.hexlify(signData.nonce), signature };
  }

  public async signDropbox(dto: ISignTemplateDto): Promise<IServerSignature> {
    const dropboxEntity = await this.erc998DropboxService.findOne(
      { id: dto.templateId },
      { relations: { erc998Collection: true, erc998Template: true } },
    );

    if (!dropboxEntity) {
      throw new NotFoundException("dropboxNotFound");
    }

    const templateEntity = await this.erc998TemplateService.findOne(
      { id: dropboxEntity.erc998TemplateId },
      { relations: { erc998Collection: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    if (templateEntity.amount > 0 && templateEntity.amount <= templateEntity.instanceCount) {
      throw new NotFoundException("limitExceeded");
    }

    const tokenPrice = BigNumber.from(dropboxEntity.price);
    const signData = {
      nonce: utils.randomBytes(32),
      collection: dropboxEntity.erc998Collection.address,
      templateId: templateEntity.id, // Dropbox content
      price: tokenPrice,
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
