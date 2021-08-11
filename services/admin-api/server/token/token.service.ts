import { FindConditions, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TokenType } from "@gemunionstudio/framework-types";

import { TokenEntity } from "./token.entity";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public findOne(where: FindConditions<TokenEntity>): Promise<TokenEntity | undefined> {
    return this.tokenEntityRepository.findOne({ where, relations: ["user"] });
  }

  public async getToken(tokenType: TokenType, userEntity: UserEntity): Promise<TokenEntity> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    const token = await this.tokenEntityRepository.findOne({
      tokenType,
      user: userEntity,
    });

    if (token) {
      // update timestamps
      return token.save();
    } else {
      return this.tokenEntityRepository
        .create({
          tokenType,
          user: userEntity,
        })
        .save();
    }
  }
}
