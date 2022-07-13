import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { TemplateService } from "./template.service";
import { TemplateEntity } from "./template.entity";
import { TemplateNewDto } from "./dto/new";

@Public()
@Controller("/templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(@Query() dto: TemplateNewDto): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.getNewTemplates(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.templateService.findOne(
      { id },
      {
        join: {
          alias: "template",
          leftJoinAndSelect: {
            price: "template.price",
            components: "price.components",
            contract: "components.contract",
          },
        },
      },
    );
  }
}
