import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Erc20TokenEntity } from "./token.entity";
import { Erc20TokenStatus } from "@framework/types";

@Injectable()
export class Erc20TokenService {
  constructor(
    @InjectRepository(Erc20TokenEntity)
    private readonly erc20TokenEntityRepository: Repository<Erc20TokenEntity>,
  ) {}

  public async autocomplete(): Promise<Array<Erc20TokenEntity>> {
    return this.erc20TokenEntityRepository.find({
      where: {
        tokenStatus: Erc20TokenStatus.ACTIVE,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }
}
