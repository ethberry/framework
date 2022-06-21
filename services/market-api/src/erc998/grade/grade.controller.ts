import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { Erc998GradeService } from "./grade.service";
import { LevelUpDto } from "./dto";

@Public()
@Controller("/erc998-grade")
export class Erc998GradeController {
  constructor(private readonly erc998GradeService: Erc998GradeService) {}

  @Post("/level-up")
  public levelUp(@Body() dto: LevelUpDto): Promise<IServerSignature> {
    return this.erc998GradeService.levelUp(dto);
  }
}
