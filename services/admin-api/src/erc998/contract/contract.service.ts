import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IContractSearchDto, TokenType } from "@framework/types";

import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";

@Injectable()
export class Erc998ContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: IContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, TokenType.ERC998);
  }
}
