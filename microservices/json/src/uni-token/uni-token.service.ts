import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, FindOneOptions } from "typeorm";

import { UniTokenEntity } from "./uni-token.entity";

@Injectable()
export class UniTokenService {
  constructor(
    @InjectRepository(UniTokenEntity)
    private readonly uniTokenEntityRepository: Repository<UniTokenEntity>,
  ) {}

  public findAll(
    where: FindOptionsWhere<UniTokenEntity>,
    options?: FindOneOptions<UniTokenEntity>,
  ): Promise<Array<UniTokenEntity>> {
    return this.uniTokenEntityRepository.find({ where, ...options });
  }

  public getTokens(address: string): Promise<any> {
    return this.findAll({ owner: address });
  }
}
