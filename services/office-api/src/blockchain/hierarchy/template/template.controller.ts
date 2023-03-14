import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { TemplateAutocompleteDto } from "./dto";
import { TemplateEntity } from "./template.entity";
import { TemplateService } from "./template.service";

@ApiBearerAuth()
@Controller("/templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TemplateAutocompleteDto): Promise<Array<TemplateEntity>> {
    return this.templateService.autocomplete(dto);
  }
}
