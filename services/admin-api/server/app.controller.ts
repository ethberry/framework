import {Controller, Get, Redirect} from "@nestjs/common";

import {Public} from "@trejgun/nest-js-providers";

@Public()
@Controller("/")
export class AppController {
  @Get("/")
  @Redirect("/swagger", 301)
  public redirect(): void {}
}
