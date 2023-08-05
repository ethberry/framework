import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITokenSearchDto, ModuleType, TokenType } from "@framework/types";

import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class Erc998TokenService extends TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {
    super(tokenEntityRepository);
  }

  public async search(dto: Partial<ITokenSearchDto>, userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return super.search(dto, userEntity, TokenType.ERC998, ModuleType.HIERARCHY);
  }
}