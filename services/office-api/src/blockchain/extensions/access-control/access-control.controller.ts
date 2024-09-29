import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress, User } from "@ethberry/nest-js-utils";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AccessControlService } from "./access-control.service";
import { AccessControlEntity } from "./access-control.entity";
import { AccessControlCheckDto, AccessControlSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/access-control")
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get("/")
  public search(
    @Query() dto: AccessControlSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<AccessControlEntity>> {
    return this.accessControlService.search(dto, userEntity);
  }

  @Get("/check")
  public check(@Query() dto: AccessControlCheckDto): Promise<{ hasRole: boolean }> {
    return this.accessControlService.check(dto);
  }

  @ApiAddress("address")
  @Get("/:address")
  public findByAddress(
    @Param("address", AddressPipe) address: string,
    @User() userEntity: UserEntity,
  ): Promise<Array<AccessControlEntity>> {
    return this.accessControlService.findAllWithRelations({ address }, userEntity);
  }
}
