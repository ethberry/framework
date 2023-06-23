import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IContractSearchDto, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class RaffleTicketService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(
      Object.assign(dto, {
        contractModule: [ModuleType.RAFFLE],
        contractType: [TokenType.ERC721],
      }),
      userEntity,
    );
  }
}
