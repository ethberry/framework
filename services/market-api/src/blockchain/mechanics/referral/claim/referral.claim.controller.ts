import { Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { ReferralClaimService } from "./referral.claim.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ReferralClaimEntity } from "./referral.claim.entity";

@ApiBearerAuth()
@Controller("/referral/claim")
export class ReferralClaimController {
  constructor(private readonly referralClaimService: ReferralClaimService) {}

  // @Get("/search")
  // @UseInterceptors(PaginationInterceptor)
  // public search(
  //   @Query() dto: ReferralClaimSearchDto,
  //   @User() userEntity: UserEntity,
  // ): Promise<[Array<ReferralClaimEntity>, number]> {
  //   return this.referralClaimService.search(dto, userEntity);
  // }

  // @Get("/")
  // @UseInterceptors(PaginationInterceptor)
  // public search(@Query() dto: ReferralClaimSearchDto, @User() userEntity: UserEntity): Promise<any> {
  //   return this.referralClaimService.getRefClaims(dto, userEntity);
  // }

  @Post("/create")
  public claim(@User() userEntity: UserEntity): Promise<ReferralClaimEntity | null> {
    return this.referralClaimService.createRefClaim(userEntity);
  }

  // @ApiProduces("application/zip")
  // @Get("/export")
  // public async export(
  //   @Query() query: ReferralClaimSearchDto,
  //   @User() userEntity: UserEntity,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const csv = await this.referralClaimService.export(query, userEntity);
  //
  //   const archive = archiver("zip");
  //
  //   const date = new Date().toISOString().split("T")[0];
  //   archive.append(csv, { name: `referral-program-claim-${date}.csv` });
  //
  //   res.set({
  //     "Content-Disposition": `attachment; filename=referral-program-claim-${date}.zip`,
  //     "Content-Type": "application/zip",
  //     // "Content-Length": ??,
  //   });
  //
  //   archive.pipe(res);
  //
  //   await archive.finalize();
  // }
}
