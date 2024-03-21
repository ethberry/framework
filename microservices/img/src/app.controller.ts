import { Controller, Get, Redirect, Res, Query, HttpCode, HttpStatus, Header } from "@nestjs/common";
import { createReadStream } from "fs";
import { join } from "path";
import type { Response } from "express";

import { Public } from "@gemunion/nest-js-utils";
import { TokenMetadata, TokenRarity } from "@framework/types";

@Public()
@Controller("/")
export class AppController {
  @Get("/")
  @Redirect("/swagger", 301)
  public redirect(): void {}

  @HttpCode(HttpStatus.OK)
  @Get("/*")
  @Header("Content-Type", "image/png")
  public img(@Query() dto: any, @Res() res: Response): void {
    let image = "logo.png";
    if (dto[TokenMetadata.RARITY] && dto[TokenMetadata.RARITY] !== TokenRarity.COMMON) {
      image = "logo_white.png";
    }
    const file = createReadStream(join(process.cwd(), "static", image));
    file.pipe(res);
  }
}
