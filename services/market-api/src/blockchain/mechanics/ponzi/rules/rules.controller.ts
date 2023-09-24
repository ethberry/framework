import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { PonziRulesService } from "./rules.service";
import { PonziRulesEntity } from "./rules.entity";
import { PonziRuleSearchDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/ponzi/rules")
export class PonziRulesController {
  constructor(private readonly ponziService: PonziRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  public search(
    @Query() dto: PonziRuleSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<PonziRulesEntity>, number]> {
    return this.ponziService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<PonziRulesEntity | null> {
    return this.ponziService.findOneWithRelations({ id });
  }
}
