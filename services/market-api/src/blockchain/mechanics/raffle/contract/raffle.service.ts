import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { ISearchDto } from "@gemunion/types-collection";
import { ModuleType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class RaffleContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: ISearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, void 0, ModuleType.RAFFLE);
  }
}
