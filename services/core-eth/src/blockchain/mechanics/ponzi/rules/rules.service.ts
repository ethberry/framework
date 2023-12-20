import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetService } from "../../../exchange/asset/asset.service";
import { PonziRulesEntity } from "./rules.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { IPonziCreateDto } from "./interfaces";

@Injectable()
export class PonziRulesService {
  constructor(
    @InjectRepository(PonziRulesEntity)
    private readonly ponziRuleEntityRepository: Repository<PonziRulesEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public findOne(
    where: FindOptionsWhere<PonziRulesEntity>,
    options?: FindOneOptions<PonziRulesEntity>,
  ): Promise<PonziRulesEntity | null> {
    return this.ponziRuleEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IPonziCreateDto): Promise<PonziRulesEntity> {
    const { deposit, reward } = dto;

    const depositEntity = await this.assetService.create();
    await this.assetService.update(depositEntity, deposit);

    const rewardEntity = await this.assetService.create();
    await this.assetService.update(rewardEntity, reward);

    Object.assign(dto, { deposit: depositEntity, reward: rewardEntity });

    return this.ponziRuleEntityRepository.create(dto).save();
  }

  public async createEmptyAsset(): Promise<AssetEntity> {
    return this.assetService.create();
  }
}
