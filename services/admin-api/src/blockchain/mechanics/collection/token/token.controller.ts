import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { CollectionTokenService } from "./token.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenSearchDto } from "../../../hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/collection/tokens")
export class CollectionTokenController {
  constructor(private readonly collectionTokenService: CollectionTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.collectionTokenService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOneToken(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.collectionTokenService.findOneToken(
      { id },
      {
        relations: {
          template: {
            contract: true,
          },
          balance: true,
        },
      },
    );
  }
}
