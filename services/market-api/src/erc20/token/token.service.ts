import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

import { Erc20TokenStatus, IErc20TokenAutocompleteDto } from "@framework/types";

import { Erc20TokenEntity } from "./token.entity";

@Injectable()
export class Erc20TokenService {
  constructor(
    @InjectRepository(Erc20TokenEntity)
    private readonly erc20TokenEntityRepository: Repository<Erc20TokenEntity>,
  ) {}

  public async autocomplete(dto: IErc20TokenAutocompleteDto): Promise<Array<Erc20TokenEntity>> {
    const { contractTemplate = [] } = dto;

    const where = {
      tokenStatus: Erc20TokenStatus.ACTIVE,
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
