import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { UserEntity } from "../user/user.entity";
import { OtpEntity } from "../otp/otp.entity";
import { InvitationService } from "./invitation.service";
import { InvitationCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/invitations")
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@User() userEntity: UserEntity): Promise<[Array<OtpEntity>, number]> {
    return this.invitationService.findAll(userEntity);
  }

  @Post("/")
  @HttpCode(HttpStatus.NO_CONTENT)
  public create(@Body() dto: InvitationCreateDto, @User() userEntity: UserEntity): Promise<void> {
    return this.invitationService.create(dto, userEntity);
  }

  @Delete("/:uuid")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("uuid", ParseUUIDPipe) uuid: string, @User() userEntity: UserEntity): Promise<void> {
    await this.invitationService.delete({ uuid }, userEntity);
  }
}
