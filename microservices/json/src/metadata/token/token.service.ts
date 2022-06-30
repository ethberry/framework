import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { BigNumber } from "ethers";
import { getPainText } from "@gemunion/draft-js-utils";

import { IOpenSeaMetadata } from "../../common/interfaces";
import { UniTokenEntity } from "../../blockchain/uni-token/uni-token/uni-token.entity";

@Injectable()
export class MetadataTokenService {
  constructor(
    @InjectRepository(UniTokenEntity)
    private readonly uniTokenEntityRepository: Repository<UniTokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  public getToken(address: string, tokenId: string): Promise<UniTokenEntity | null> {
    const queryBuilder = this.uniTokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.uniTemplate", "template");
    queryBuilder.leftJoinAndSelect("template.uniContract", "contract");

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });
    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }

  public async getTokenMetadata(address: string, tokenId: BigNumber): Promise<IOpenSeaMetadata> {
    const uniTokenEntity = await this.getToken(address, tokenId.toString());

    if (!uniTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3011");

    const { attributes } = uniTokenEntity;

    return {
      description: getPainText(uniTokenEntity.uniTemplate.description),
      external_url: `${baseUrl}/metadata/${uniTokenEntity.uniTemplate.uniContract.address}/${uniTokenEntity.id}`,
      image: uniTokenEntity.uniTemplate.imageUrl,
      name: uniTokenEntity.uniTemplate.title,
      attributes,
    };
  }
}
