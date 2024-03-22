import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TemplateStatus } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { TemplateEntity } from "./template.entity";
import { TokenService } from "../token/token.service";
import { MysteryBoxService } from "../../mechanics/marketing/mystery/box/box.service";
import { ClaimTemplateService } from "../../mechanics/marketing/claim/template/template.service";
import { CraftService } from "../../mechanics/gaming/recipes/craft/craft.service";
import { MergeService } from "../../mechanics/gaming/recipes/merge/merge.service";
import { DismantleService } from "../../mechanics/gaming/recipes/dismantle/dismantle.service";
import { GradeService } from "../../mechanics/gaming/grade/grade.service";
import { RentService } from "../../mechanics/gaming/rent/rent.service";
import { WaitListListService } from "../../mechanics/marketing/wait-list/list/list.service";
import { StakingRulesService } from "../../mechanics/marketing/staking/rules/rules.service";

@Injectable()
export class TemplateDeleteService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
    protected readonly tokenService: TokenService,
    protected readonly mysteryBoxService: MysteryBoxService,
    protected readonly claimTemplateService: ClaimTemplateService,
    protected readonly craftService: CraftService,
    protected readonly mergeService: MergeService,
    protected readonly dismantleService: DismantleService,
    protected readonly gradeService: GradeService,
    protected readonly rentService: RentService,
    protected readonly waitListListService: WaitListListService,
    protected readonly stakingRulesService: StakingRulesService,
  ) {}

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.templateEntityRepository.findOne({ where, ...options });
  }

  public async delete(where: FindOptionsWhere<TemplateEntity>, userEntity: UserEntity): Promise<TemplateEntity> {
    const templateEntity = await this.findOne(where, {
      relations: {
        contract: true,
      },
    });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    if (templateEntity.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    await this.deactivateMechanics(templateEntity);

    return this.deactivateTemplate(templateEntity);
  }

  public async deactivateTemplate(templateEntity: TemplateEntity): Promise<TemplateEntity> {
    Object.assign(templateEntity, { templateStatus: TemplateStatus.INACTIVE });
    return templateEntity.save();
  }

  public async deactivateMechanics(templateEntity: TemplateEntity): Promise<Array<PromiseSettledResult<DeleteResult>>> {
    const assets = await this.assetService.findAll({
      components: {
        templateId: templateEntity.id,
      },
    });

    // Delete use in mechanics
    await this.craftService.deactivateCrafts(assets);
    await this.mergeService.deactivateMerge(assets);
    await this.dismantleService.deactivateDismantle(assets);

    await this.gradeService.deactivateGrades(assets);
    await this.rentService.deactivateRent(assets);
    await this.waitListListService.deactivateWaitlist(assets);
    await this.stakingRulesService.deactivateStakingRules(assets);

    return Promise.allSettled([
      this.mysteryBoxService.deactivateBoxes(assets),
      this.claimTemplateService.deactivateClaims(assets),
    ]);
  }
}
