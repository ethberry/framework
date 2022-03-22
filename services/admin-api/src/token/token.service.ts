import { FindOptionsWhere, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TokenType } from "@gemunion/framework-types";

import { TokenEntity } from "./token.entity";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public findOne(where: FindOptionsWhere<TokenEntity>): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, relations: { user: true } });
  }

  public async getToken(
    tokenType: TokenType,
    userEntity: UserEntity,
    data?: Record<string, string>,
  ): Promise<TokenEntity> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    const tokenEntity = await this.tokenEntityRepository.findOne({
      where: {
        tokenType,
        userId: userEntity.id,
      },
    });

    if (tokenEntity) {
      // update timestamps
      return tokenEntity.save();
    } else {
      return this.tokenEntityRepository
        .create({
          tokenType,
          user: userEntity,
          data,
        })
        .save();
    }
  }
}
