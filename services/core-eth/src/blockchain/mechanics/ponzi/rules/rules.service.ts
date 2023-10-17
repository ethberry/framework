import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetService } from "../../../exchange/asset/asset.service";
import { PonziRulesEntity } from "./rules.entity";

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
}
