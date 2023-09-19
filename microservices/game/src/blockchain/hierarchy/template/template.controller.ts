import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";
import { ModuleType, TokenType } from "@framework/types";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { TemplateService } from "./template.service";
import { TemplateEntity } from "./template.entity";
import { TemplateAutocompleteDto, TemplateSearchDto } from "./dto";

@Public()
@Controller("/templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.search(
      dto,
      merchantEntity,
      [ModuleType.HIERARCHY],
      [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
    );
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: TemplateAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<TemplateEntity>> {
    return this.templateService.autocomplete(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<TemplateEntity | null> {
    return this.templateService.findOneAndCheckMerchant({ id }, merchantEntity);
  }
}
