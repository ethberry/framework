import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { IErc20ContractAutocompleteDto, ContractStatus } from "@framework/types";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Injectable()
export class Erc20ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly erc20TokenEntityRepository: Repository<ContractEntity>,
  ) {}

  public async autocomplete(dto: IErc20ContractAutocompleteDto): Promise<Array<ContractEntity>> {
    const { contractTemplate = [] } = dto;

    const where = {
      contractStatus: ContractStatus.ACTIVE,
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
