import { Injectable } from "@nestjs/common";
import { ZeroAddress } from "ethers";
import { ReferralProgramService } from "./referral.program.service";
import { ReferralTreeService } from "./tree/referral.tree.service";

@Injectable()
export class ReferralService {
  constructor(
    private readonly referralProgramService: ReferralProgramService,
    private readonly referralTreeService: ReferralTreeService,
  ) {}

  public async referralPurchase(account: string, referrer: string, merchantId: number): Promise<void> {
    const refProgram = await this.referralProgramService.findOne({ merchantId });

    if (refProgram) {
      if (referrer.toLowerCase() !== ZeroAddress) {
        if (referrer.toLowerCase() !== account.toLowerCase()) {
          // find referrer in ref tree
          const refTree = await this.referralTreeService.findAll(
            { merchantId, wallet: referrer.toLowerCase() },
            { order: { level: "ASC" } },
          );
          if (refTree && refTree.length > 0) {
            const refLevelMax = refTree[refTree.length - 1].level;
            // register account as referral level refLevelMax + 1  temporary
            await this.referralTreeService.create({
              wallet: account.toLowerCase(),
              referral: referrer.toLowerCase(),
              level: refLevelMax + 1,
              merchantId,
              temp: true,
            });
          }
        } else if (referrer.toLowerCase() === account.toLowerCase()) {
          // register account as level 1 referral temporary
          await this.referralTreeService.create({
            wallet: account.toLowerCase(),
            referral: ZeroAddress,
            level: 1,
            merchantId,
            temp: true,
          });
        }
      } else {
        // register account as level 1 referral temporary
        await this.referralTreeService.create({
          wallet: account.toLowerCase(),
          referral: ZeroAddress,
          level: 1,
          merchantId,
          temp: true,
        });
      }
    }
  }
}
