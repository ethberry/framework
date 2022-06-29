import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { BigNumber } from "ethers";
import { getPainText } from "@gemunion/draft-js-utils";

import { IOpenSeaMetadata } from "../../common/interfaces";
import { UniTemplateEntity } from "../../uni-token/uni-template.entity";

@Injectable()
export class MetadataTokenService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly uniTokenEntityRepository: Repository<UniTemplateEntity>,
    private readonly configService: ConfigService,
  ) {}

  public getToken(address: string, tokenId: string): Promise<UniTemplateEntity | null> {
    const queryBuilder = this.uniTokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "contract");

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });
    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }

  public async getTokenMetadata(address: string, tokenId: BigNumber): Promise<IOpenSeaMetadata> {
    const uniTemplateEntity = await this.getToken(address, tokenId.toString());

    if (!uniTemplateEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    const { attributes } = uniTemplateEntity;

    return {
      description: getPainText(uniTemplateEntity.description),
      external_url: `${baseUrl}/metadata/${uniTemplateEntity.uniContract.address}/${uniTemplateEntity.id}`,
      image: uniTemplateEntity.imageUrl,
      name: uniTemplateEntity.title,
      attributes,
    };
  }
}
