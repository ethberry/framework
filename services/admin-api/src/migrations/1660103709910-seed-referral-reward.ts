import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedReferralRewardAt1660103709910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

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
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[1]}',
        0,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[2]}',
        0,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[2]}',
        0,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[2]}',
        1,
        '${constants.WeiPerEther.div(10).toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${wallets[2]}',
        0,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${wallets[2]}',
        1,
        '${constants.WeiPerEther.div(10).toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${wallets[2]}',
        0,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.referral_reward RESTART IDENTITY CASCADE;`);
  }
}
