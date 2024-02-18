import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ZeroAddress } from "ethers";

import { testChainId } from "@framework/constants";
import { ReferralRewardEntity } from "./referral.reward.entity";
import { ReferralProgramService } from "../program/referral.program.service";
import { ReferralTreeService } from "../program/tree/referral.tree.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { IRefChainQuery, ReferralRewardShareService } from "./share/referral.reward.share.service";

export interface IRefEventCalc {
  merchantId: number;
  refChain: Array<IRefChainQuery>;
}

@Injectable()
export class ReferralRewardService {
  constructor(
    @InjectRepository(ReferralRewardEntity)
    private readonly referralRewardEntityRepository: Repository<ReferralRewardEntity>,
    private readonly referralRewardShareService: ReferralRewardShareService,
    private readonly referralProgramService: ReferralProgramService,
    private readonly referralTreeService: ReferralTreeService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<ReferralRewardEntity>,
    options?: FindOneOptions<ReferralRewardEntity>,
  ): Promise<ReferralRewardEntity | null> {
    return this.referralRewardEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ReferralRewardEntity>,
    options?: FindManyOptions<ReferralRewardEntity>,
  ): Promise<Array<ReferralRewardEntity>> {
    return this.referralRewardEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<ReferralRewardEntity>): Promise<ReferralRewardEntity> {
    return this.referralRewardEntityRepository.create(dto).save();
  }

  public async referral(wallet: string, contract: string): Promise<void> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractEntity = await this.contractService.findOne({ address: contract.toLowerCase(), chainId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }
    const { merchantId } = contractEntity;

    const refProgram = await this.referralProgramService.findOne(
      { merchantId, level: 0 },
      { relations: { merchant: true } },
    );

    // IF EXISTS REF PROGRAM (do not register self-referrers)
    if (refProgram && refProgram.merchant.wallet.toLowerCase() !== wallet.toLowerCase()) {
      // LOOK FOR LEVEL 1 referrer (it means referrer had purchases from merchant)
      const refTreeOne = await this.referralTreeService.findOne({
        merchantId,
        wallet: wallet.toLowerCase(),
        // TODO only one check is enough? (ref=Zero or level=1)
        referral: ZeroAddress,
        level: 1,
      });
      // GET ANY CONFIRMED REF RECORDS FOR buyer's WALLET
      const accRefs = await this.referralTreeService.findOne({ merchantId, wallet: wallet.toLowerCase(), temp: false });
      if (!refTreeOne && !accRefs) {
        // REGISTER WALLET AS MERCHANT's REFERRAL LEVEL 1 (temporary)
        await this.referralTreeService.create({ wallet, merchantId, referral: ZeroAddress, level: 1, temp: true });
      }
    }
  }

  // TODO test it for edge cases
  public async referralEventLevel(merchantId: number, account: string, referrer: string): Promise<IRefEventCalc> {
    // FIND MERCHANT'S REF PROGRAM
    const refProgramLevelOne = await this.referralProgramService.findOne({ merchantId, level: 1 });
    // IF THERE IS MERCHANT REF PROGRAM
    if (refProgramLevelOne) {
      // GET CURRENT REFERRER WALLET-to-MERCHANT CHAIN
      const refChain = await this.referralRewardShareService.getRefChain(referrer.toLowerCase(), merchantId);
      // IF REFERRER WAS REGISTERED
      if (refChain && refChain.length > 0) {
        await this.cleanUp(merchantId, account, referrer, refChain);
        const currentRefLevel = refChain[0].level;
        // GET ANY CONFIRMED REF RECORDS FOR buyer's ACCOUNT
        const accRefs = await this.referralTreeService.findOne({
          merchantId,
          wallet: account.toLowerCase(),
          temp: false,
        });
        // IF ACCOUNT WAS NOT REGISTERED IN REF TREE - CREATE
        if (!accRefs) {
          // CREATE PAIR account+referrer with next ref level
          await this.referralTreeService.createIfNotExist({
            merchantId,
            wallet: account.toLowerCase(),
            referral: referrer.toLowerCase(),
            level: currentRefLevel + 1,
            temp: false,
          });
        }
        return { merchantId, refChain };
      } else {
        // IF REFERRER WAS NOT REGISTERED - confirm account's temporary level 1 ref if exist
        const restrictForBuyersOnly = false; // TODO get from program
        if (!restrictForBuyersOnly) {
          // REGISTER REFERRER
          // CREATE TREE LEVEL 1
          const treeEntity = await this.referralTreeService.create({
            merchantId,
            wallet: referrer.toLowerCase(),
            referral: ZeroAddress,
            level: 1,
            temp: false,
          });
          // CREATE USER TREE LEVEL if not exist
          // const treeEntity = await this.referralTreeService.create({
          //   merchantId,
          //   wallet: account.toLowerCase(),
          //   referral: referrer.toLowerCase(),
          //   level: 1,
          //   temp: false,
          // });

          const newRefChain = {
            id: treeEntity.id,
            level: 1,
            wallet: referrer.toLowerCase(),
            share: refProgramLevelOne.share,
            reflen: 1,
            temp: false,
          };
          return { merchantId, refChain: [newRefChain] };
        }

        await this.referralTreeService.updateIfExist(
          {
            wallet: account.toLowerCase(),
            merchantId,
            referral: ZeroAddress,
            level: 1,
            temp: true,
          },
          { temp: false },
        );
        // RETURN ZERO
        return { merchantId, refChain: [] };
      }
    } else {
      // RETURN ZERO
      return { merchantId, refChain: [] };
    }
  }

  public async cleanUp(
    merchantId: number,
    account: string,
    referrer: string,
    refChain: Array<IRefChainQuery>,
  ): Promise<IRefEventCalc | void> {
    const currentRefLevel = refChain[0].level;
    // CONFIRM TEMP LEVEL 1 REF
    if (currentRefLevel === 1 && refChain[0].temp) {
      await this.referralTreeService.updateIfExist(
        { merchantId, wallet: referrer.toLowerCase(), level: 1, temp: true },
        { temp: false },
      );
    }
    // REMOVE TEMP REF LEVEL 1 IF EXIST
    await this.referralTreeService.deleteIfExist({
      merchantId,
      wallet: account.toLowerCase(),
      referral: ZeroAddress,
      level: 1,
      temp: true,
    });
    // REMOVE TEMP REF LEVEL 1 IF EXIST
    await this.referralTreeService.deleteIfExist({
      merchantId,
      wallet: account.toLowerCase(),
      referral: ZeroAddress,
      level: 1,
      temp: true,
    });
  }
}
