import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ContractFeatures, ITokenSearchDto, ModuleType, TokenType } from "@framework/types";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenService } from "../../../hierarchy/token/token.service";

@Injectable()
export class RentTokenService extends TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {
    super(tokenEntityRepository);
  }

  public async search(dto: Partial<ITokenSearchDto>, userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return super.search(
      dto,
      userEntity,
      [ModuleType.HIERARCHY],
      [TokenType.ERC721, TokenType.ERC998],
      [ContractFeatures.RENTABLE],
    );
  }
}
