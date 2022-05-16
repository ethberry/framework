import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ethers, BigNumber } from "ethers";
import { prepareEip712 } from "@gemunion/butils";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IMarketplaceSignature } from "@framework/types";

import { Erc721TemplateService } from "../template/template.service";
import { Erc721DropboxService } from "../dropbox/dropbox.service";
import { ISignTemplateDto } from "./interfaces";

@Injectable()
export class Erc721MarketplaceService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: ethers.Wallet,
    private readonly configService: ConfigService,
    private readonly erc721TemplateService: Erc721TemplateService,
    private readonly erc721DropboxService: Erc721DropboxService,
  ) {}

  public async signTemplate(dto: ISignTemplateDto): Promise<IMarketplaceSignature> {
    const templateEntity = await this.erc721TemplateService.findOne(
      { id: dto.templateId },
      { relations: { erc721Collection: true } },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    if (templateEntity.amount > 0 && templateEntity.amount <= templateEntity.instanceCount) {
      throw new NotFoundException("limitExceeded");
    }

    const totalTokenPrice = ethers.utils.parseUnits(templateEntity.price.toString(), "wei");
    const signData = {
      nonce: ethers.utils.randomBytes(32),
      collection: templateEntity.erc721Collection.address,
      templateId: dto.templateId, // Dropbox content
      price: totalTokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: ethers.utils.hexlify(signData.nonce), signature };
  }

  public async signDropbox(dto: ISignTemplateDto): Promise<IMarketplaceSignature> {
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

    const tokenPrice = BigNumber.from(dropboxEntity.price);
    const signData = {
      nonce: ethers.utils.randomBytes(32),
      collection: dropboxEntity.erc721Collection.address,
      templateId: templateEntity.id, // Dropbox content
      price: tokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: ethers.utils.hexlify(signData.nonce), signature };
  }

  public async getSign(data: Record<string, any>): Promise<string> {
    return this.signer._signTypedData(
      {
        name: "ERC721Marketplace",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", 97),
        verifyingContract: this.configService.get<string>("ERC721_MARKETPLACE_ADDR", ""),
      },
      prepareEip712(data),
      data,
    );
  }
}
