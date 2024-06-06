import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { IContractSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { MerchantEntity } from "../../../../../../infrastructure/merchant/merchant.entity";
import { ContractService } from "../../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../../hierarchy/contract/contract.entity";

@Injectable()
export class RaffleTicketContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(
    dto: Partial<IContractSearchDto>,
    userEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.RAFFLE], [TokenType.ERC721]);
  }
}
