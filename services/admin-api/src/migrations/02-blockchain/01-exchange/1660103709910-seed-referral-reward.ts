import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";
import { subDays } from "date-fns";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedReferralRewardAt1660103709910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.referral_reward (
        account,
        referrer,
        level,
        amount,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        '${wallets[1]}',
        0,
        '${WeiPerEther.toString()}',
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[1]}',
        0,
        '${WeiPerEther.toString()}',
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[2]}',
        0,
        '${WeiPerEther.toString()}',
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[2]}',
        0,
        '${WeiPerEther.toString()}',
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[2]}',
        1,
        '${(WeiPerEther / 10n).toString()}',
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${wallets[2]}',
        0,
        '${WeiPerEther.toString()}',
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[2]}',
        1,
        '${(WeiPerEther / 10n).toString()}',
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${wallets[2]}',
        0,
        '${WeiPerEther.toString()}',
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.referral_reward RESTART IDENTITY CASCADE;`);
  }
}
