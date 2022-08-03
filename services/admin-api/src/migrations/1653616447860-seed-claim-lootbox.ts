import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimLootboxAt1653616447860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        26101
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 26101, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        41,
        16101, -- sword lootbox
        '1',
        26101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        account,
        item_id,
        claim_status,
        signature,
        nonce,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        26101,
        'NEW',
        '0x5f431eece513290b629c03efb5bc3e7b5fc2cafd2be09eb0fa5080abec0d900350effd79066101d34ca3c80338c108abcdef83a9f817af168e128e3c31817c7d1b',
        '0x6a4762354ea8b2dfe16a2acbf7b81210963eaedb24967b40e2cfdaf918918610',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
