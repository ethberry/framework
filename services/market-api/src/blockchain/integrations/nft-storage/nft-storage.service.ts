import { Injectable, NotFoundException } from "@nestjs/common";
import { getText } from "@gemunion/draft-js-utils";

import { NftStorageFirebaseService } from "@gemunion/nest-js-module-nft-storage-firebase";

import { TokenService } from "../../hierarchy/token/token.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";

const nftStorageBaseUrl = "https://nftstorage.link/ipfs";

@Injectable()
export class NftstorageService {
  constructor(
    private readonly nftStorageFirebaseService: NftStorageFirebaseService,
    private readonly tokenService: TokenService,
  ) {}

  public async pinTokenById(id: number): Promise<string> {
    const tokenEntity = await this.tokenService.findOne({ id }, { relations: { template: true } });
    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (tokenEntity.cid) {
      return `${nftStorageBaseUrl}/${tokenEntity.cid}`;
    }

    if (!tokenEntity.template.cid) {
      await this.pinTemplate(tokenEntity.template);
    }

    await this.pinToken(tokenEntity);

    return `${nftStorageBaseUrl}/${tokenEntity.cid!}`;
  }

  public async pinTemplate(templateEntity: TemplateEntity) {
    const objectName = new URL(templateEntity.imageUrl).pathname.split("/").pop()!;
    const cid = await this.nftStorageFirebaseService.pinFileToIPFS(objectName);

    Object.assign(templateEntity, { cid });
    await templateEntity.save();
    return cid;
  }

  public async pinToken(tokenEntity: TokenEntity) {
    const cid = await this.nftStorageFirebaseService.pinJSONToIPFS({
      title: tokenEntity.template.title,
      description: getText(tokenEntity.template.description),
      image: `${nftStorageBaseUrl}/${tokenEntity.template.cid!}`,
      attributes: tokenEntity.metadata,
    });

    Object.assign(tokenEntity, { cid });
    await tokenEntity.save();

    return cid;
  }
}
