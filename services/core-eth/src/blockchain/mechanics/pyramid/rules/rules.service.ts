import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { PyramidRulesEntity } from "./rules.entity";
import { AssetService } from "../../../exchange/asset/asset.service";

@Injectable()
export class PyramidRulesService {
  constructor(
    @InjectRepository(PyramidRulesEntity)
    private readonly pyramidRuleEntityRepository: Repository<PyramidRulesEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public findOne(
    where: FindOptionsWhere<PyramidRulesEntity>,
    options?: FindOneOptions<PyramidRulesEntity>,
  ): Promise<PyramidRulesEntity | null> {
    return this.pyramidRuleEntityRepository.findOne({ where, ...options });
  }
}
