import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { WeiPerEther } from "ethers";

import { ContractFeatures, GradeAttribute, GradeStrategy, TokenType } from "@framework/types";

import { GradeEntity } from "./grade.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeEntityRepository: Repository<GradeEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public findOne(
    where: FindOptionsWhere<GradeEntity>,
    options?: FindOneOptions<GradeEntity>,
  ): Promise<GradeEntity | null> {
    return this.gradeEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<GradeEntity>): Promise<GradeEntity> {
    const assetEntity = await this.assetService.create({
      components: [
        {
          tokenType: TokenType.NATIVE,
          contractId: 1,
          templateId: 101001, // TODO why?
          amount: WeiPerEther.toString(),
        },
      ],
    });

    Object.assign(dto, {
      gradeStrategy: GradeStrategy.FLAT,
      growthRate: 0,
      price: assetEntity,
    });

    return this.gradeEntityRepository.create(dto).save();
  }

  public async findOneByToken(tokenEntity: TokenEntity, attribute: GradeAttribute): Promise<GradeEntity | null> {
    const { contractFeatures } = tokenEntity.template.contract;
    if (!contractFeatures.includes(ContractFeatures.UPGRADEABLE)) {
      throw new BadRequestException("featureIsNotSupported");
    }

    const gradeEntity = await this.findOneWithRelations({
      contractId: tokenEntity.template.contractId,
      attribute,
    });

    if (!gradeEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    return gradeEntity;
  }

  public async findOneWithRelations(where: FindOptionsWhere<GradeEntity>): Promise<GradeEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "grade",
        leftJoinAndSelect: {
          price: "grade.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
          price_tokens: "price_template.tokens",
        },
      },
    });
  }
}
