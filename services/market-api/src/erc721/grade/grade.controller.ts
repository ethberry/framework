import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { Erc721GradeService } from "./grade.service";
import { LevelUpDto } from "./dto";

@Public()
@Controller("/erc721-grade")
export class Erc721GradeController {
  constructor(private readonly erc721GradeService: Erc721GradeService) {}

  @Post("/level-up")
  public levelUp(@Body() dto: LevelUpDto): Promise<IServerSignature> {
    return this.erc721GradeService.levelUp(dto);
  }
}
