import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";
import { TokenType } from "@framework/types";

import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";

@Injectable()
export class Erc721ContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: ISearchDto): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, TokenType.ERC721);
  }
}
