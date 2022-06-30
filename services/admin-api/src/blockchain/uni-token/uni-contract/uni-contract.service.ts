import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { IUniContractAutocompleteDto } from "@framework/types";

import { UniContractEntity } from "./uni-contract.entity";

@Injectable()
export class UniContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
  ) {}

  public async autocomplete(dto: IUniContractAutocompleteDto): Promise<Array<UniContractEntity>> {
    const { contractRole = [], contractStatus = [], contractTemplate = [], contractType = [] } = dto;

    const where = {};

    if (contractType.length) {
      Object.assign(where, {
        contractType: In(contractType),
      });
    }

    if (contractRole.length) {
      Object.assign(where, {
        contractRole: In(contractRole),
      });
    }

    if (contractStatus.length) {
      Object.assign(where, {
        contractStatus: In(contractStatus),
      });
    }

    if (contractTemplate.length) {
      Object.assign(where, {
        contractTemplate: In(contractTemplate),
      });
    }

    return this.uniContractEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        contractType: true,
      },
    });
  }
}
