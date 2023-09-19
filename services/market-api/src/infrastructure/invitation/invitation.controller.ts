import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { InvitationService } from "./invitation.service";

@Public()
@Controller("/invitations")
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get("/accept/:uuid")
  @HttpCode(HttpStatus.NO_CONTENT)
  public accept(@Param("uuid", ParseUUIDPipe) uuid: string): Promise<void> {
    return this.invitationService.accept(uuid);
  }
}
