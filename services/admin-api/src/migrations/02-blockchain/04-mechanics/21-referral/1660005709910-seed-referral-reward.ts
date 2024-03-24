import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedReferralRewardAt1660005709910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        10221000101
      ), (
        10221000102
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        10301,
        1030101, -- Ruby
        1,
        10221000101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        10221000102
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.referral_reward (
        account,
        referrer,
        merchant_id,
        contract_id,
        item_id,
        price_id,
        history_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        '${wallets[1]}',
        1,
        10301,
        10221000101,
        10221000102,
        10301010,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.referral_reward RESTART IDENTITY CASCADE;`);
  }
}
