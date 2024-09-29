import { Controller, Get, Redirect } from "@nestjs/common";

import { Public } from "@ethberry/nest-js-utils";

@Public()
@Controller("/")
export class AppController {
  @Get("/")
  @Redirect("/swagger", 301)
  public redirect(): void {
    // empty
  }

  @Get("/version")
  public version(): any {
    return {
      api: "0.0.1",
    };
  }
}
