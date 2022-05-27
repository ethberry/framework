import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Erc20TokenEntity } from "./token.entity";

@Injectable()
export class Erc20TokenService {
  constructor(
    @InjectRepository(Erc20TokenEntity)
    private readonly erc20TokenEntityRepository: Repository<Erc20TokenEntity>,
  ) {}

  public async autocomplete(): Promise<Array<Erc20TokenEntity>> {
    // TODO only active
    return this.erc20TokenEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }
}
