import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Injectable()
export class Erc1155TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public async create(dto: DeepPartial<TokenEntity>): Promise<TokenEntity> {
    return this.tokenEntityRepository.create(dto).save();
  }
}
