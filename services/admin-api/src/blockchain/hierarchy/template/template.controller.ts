import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { TemplateAutocompleteDto } from "./dto";
import { TemplateEntity } from "./template.entity";
import { TemplateService } from "./template.service";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: TemplateAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<TemplateEntity>> {
    return this.templateService.autocomplete(dto, userEntity);
  }
}
