import { MigrationInterface, QueryRunner } from "typeorm";

import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedChainLinkSubscriptions1563803000122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_GEMUNION || process.env.CHAIN_ID_GEMUNION_BESU || testChainId;
    const subId = process.env.CHAINLINK_SUBSCRIPTION_ID || 1;

    await queryRunner.query(`
      INSERT INTO ${ns}.chain_link_subscriptions (
        merchant_id,
        chain_id,
        vrf_sub_id,
        created_at,
        updated_at
      ) VALUES (
        1,
        '${chainId}',
        '${BigInt(subId)}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        '13377',
        '${BigInt(subId)}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.merchant RESTART IDENTITY CASCADE;`);
  }
}
