import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { IContractSearchDto } from "@framework/types";
import { ModuleType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class RaffleContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    protected readonly configService: ConfigService,
  ) {
    super(contractEntityRepository, configService);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.RAFFLE], null);
  }
}