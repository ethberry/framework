import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { IContractSearchDto } from "@framework/types";
import { ModuleType } from "@framework/types";

import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@Injectable()
export class PonziContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: Partial<IContractSearchDto>, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.PONZI], null);
  }
}
