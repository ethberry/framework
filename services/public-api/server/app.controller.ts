import { Controller, Get, Redirect } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

@Public()
@Controller("/")
export class AppController {
  @Get("/")
  @Redirect("/swagger", 301)
  public redirect(): void {}
}
