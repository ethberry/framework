import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { IErc20ContractAutocompleteDto, UniContractStatus } from "@framework/types";
import { UniContractEntity } from "../../uni-token/uni-contract.entity";

@Injectable()
export class Erc20ContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly erc20TokenEntityRepository: Repository<UniContractEntity>,
  ) {}

  public async autocomplete(dto: IErc20ContractAutocompleteDto): Promise<Array<UniContractEntity>> {
    const { contractTemplate = [] } = dto;

    const where = {
      contractStatus: UniContractStatus.ACTIVE,
    };

    if (contractTemplate.length) {
      Object.assign(where, {
        contractTemplate: In(contractTemplate),
      });
    }

    return this.erc20TokenEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        contractTemplate: true,
      },
    });
  }
}
