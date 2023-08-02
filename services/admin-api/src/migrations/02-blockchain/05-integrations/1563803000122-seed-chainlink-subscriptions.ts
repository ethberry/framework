import { MigrationInterface, QueryRunner } from "typeorm";
import { ns, testChainId } from "@framework/constants";

export class SeedChainLinkSubscriptions1563803000122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = BigInt(process.env.CHAIN_ID || testChainId);
    const subId = BigInt(process.env.CHAINLINK_SUBSCRIPTION_ID || 1n);

    // if (process.env.NODE_ENV === "production") {
    //   return;
    // }

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
        '${subId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        '13377',
        '${subId}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.merchant RESTART IDENTITY CASCADE;`);
  }
}
