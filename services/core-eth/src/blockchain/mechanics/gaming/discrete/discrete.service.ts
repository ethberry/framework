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
}
