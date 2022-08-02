import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { constants } from "ethers";

import { GradeEntity } from "./grade.entity";
import { AssetService } from "../asset/asset.service";
import { GradeStrategy, TokenType } from "@framework/types";

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
      components: [],
    });

    await this.assetService.update(assetEntity, {
      components: [
        {
          tokenType: TokenType.NATIVE,
          contractId: 1,
          templateId: 12001,
          amount: constants.WeiPerEther.toString(),
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
}
