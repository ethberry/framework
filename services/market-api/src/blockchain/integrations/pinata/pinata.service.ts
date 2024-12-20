import { Injectable, NotFoundException } from "@nestjs/common";
import { getText } from "@gemunion/draft-js-utils";

import { PinataFirebaseService } from "@gemunion/nest-js-module-pinata-firebase";

import { TokenService } from "../../hierarchy/token/token.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";

const pinataBaseUrl = "https://gateway.pinata.cloud/ipfs";

@Injectable()
export class PinataService {
  constructor(
    private readonly pinataFirebaseService: PinataFirebaseService,
    private readonly tokenService: TokenService,
  ) {}

  public async pinTokenById(id: number): Promise<string> {
    const tokenEntity = await this.tokenService.findOne({ id }, { relations: { template: true } });
    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (tokenEntity.cid) {
      return `${pinataBaseUrl}/${tokenEntity.cid}`;
    }

    if (!tokenEntity.template.cid) {
      await this.pinTemplate(tokenEntity.template);
    }

    await this.pinToken(tokenEntity);

    return `${pinataBaseUrl}/${tokenEntity.cid!}`;
  }

  public async pinTemplate(templateEntity: TemplateEntity) {
    const objectName = new URL(templateEntity.imageUrl).pathname.split("/").pop()!;
    const pin = await this.pinataFirebaseService.pinFileToIPFS(objectName);

    Object.assign(templateEntity, { cid: pin });
    await templateEntity.save();

    return pin;
  }

  public async pinToken(tokenEntity: TokenEntity) {
    const objectName = new URL(tokenEntity.template.imageUrl).pathname.split("/").pop()!;
    const pin = await this.pinataFirebaseService.pinJSONToIPFS(
      {
        title: tokenEntity.template.title,
        description: getText(tokenEntity.template.description),
        image: `${pinataBaseUrl}/${tokenEntity.template.cid!}`,
        attributes: tokenEntity.metadata,
      },
      objectName,
    );

    Object.assign(tokenEntity, { cid: pin });
    await tokenEntity.save();

    return pin;
  }
}
