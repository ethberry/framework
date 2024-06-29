import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetService } from "../../../exchange/asset/asset.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { DiscreteEntity } from "./discrete.entity";

@Injectable()
export class DiscreteService {
  constructor(
    @InjectRepository(DiscreteEntity)
    protected readonly discreteEntityRepository: Repository<DiscreteEntity>,
    protected readonly configService: ConfigService,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
  ) {}

  public findOne(
    where: FindOptionsWhere<DiscreteEntity>,
    options?: FindOneOptions<DiscreteEntity>,
  ): Promise<DiscreteEntity | null> {
    return this.discreteEntityRepository.findOne({ where, ...options });
  }

  public async findOneWithRelations(where: FindOptionsWhere<DiscreteEntity>): Promise<DiscreteEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "discrete",
        leftJoinAndSelect: {
          contract: "discrete.contract",
          // price: "discrete.price",
          // price_components: "price.components",
          // price_contract: "price_components.contract",
          // price_template: "price_components.template",
          // price_tokens: "price_template.tokens",
        },
      },
    });
  }
}
