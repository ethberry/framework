import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { IContractSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";

@Injectable()
export class MysteryContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(
    dto: Partial<IContractSearchDto>,
    merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, merchantEntity, [ModuleType.MYSTERY], [TokenType.ERC721]);
  }
}
