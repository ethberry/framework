import { Injectable, NotFoundException } from "@nestjs/common";
import { getText } from "@gemunion/draft-js-utils";

import { Web3StorageFirebaseService } from "@gemunion/nest-js-module-web3-storage-firebase";

import { TokenService } from "../../hierarchy/token/token.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";

const web3StorageBaseUrl = "https://w3s.link/ipfs";

@Injectable()
export class Web3StorageService {
  constructor(
    private readonly web3StorageFirebaseService: Web3StorageFirebaseService,
    private readonly tokenService: TokenService,
  ) {}

  public async pinTokenById(id: number): Promise<string> {
    const tokenEntity = await this.tokenService.findOne({ id }, { relations: { template: true } });
    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (tokenEntity.cid) {
      return `${web3StorageBaseUrl}/${tokenEntity.cid}`;
    }

    if (!tokenEntity.template.cid) {
      await this.pinTemplate(tokenEntity.template);
    }

    await this.pinToken(tokenEntity);

    return `${web3StorageBaseUrl}/${tokenEntity.cid!}`;
  }

  public async pinTemplate(templateEntity: TemplateEntity) {
    const objectName = new URL(templateEntity.imageUrl).pathname.split("/").pop()!;
    const cid = await this.web3StorageFirebaseService.pinFileToIPFS(objectName);

    Object.assign(templateEntity, { cid });
    await templateEntity.save();
    return cid;
  }

  public async pinToken(tokenEntity: TokenEntity) {
    const objectName = new URL(tokenEntity.template.imageUrl).pathname.split("/").pop()!;
    const cid = await this.web3StorageFirebaseService.pinJSONToIPFS(
      {
        title: tokenEntity.template.title,
        description: getText(tokenEntity.template.description),
        image: `${web3StorageBaseUrl}/${tokenEntity.template.cid!}`,
        attributes: tokenEntity.metadata,
      },
      objectName,
    );

    Object.assign(tokenEntity, { cid });
    await tokenEntity.save();

    return cid;
  }
}
