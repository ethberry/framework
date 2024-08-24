import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet, NodeEnv } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedClaimTemplateErc1155At1653616447850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102020501
      ), (
        102020502
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
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        102020501
      ), (
        'ERC1155',
        10504,
        1050401, -- Healing potion
        1000,
        102020502
      ), (
        'ERC1155',
        10504,
        1050402, -- Mana potion
        1000,
        102020502
      ), (
        'ERC1155',
        10504,
        1050403, -- Antidote potion
        1000,
        102020502
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        id,
        account,
        item_id,
        claim_status,
        claim_type,
        signature,
        nonce,
        end_timestamp,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1010501,
        '${wallet}',
        102020501,
        'NEW',
        'TEMPLATE',
        '0xb841fe2c754de1cf18c963271470d4d8f613ec99aed88a3280b428815d04db0c3dc5d37ba055c926c894d29b2ce15956aeb1e52d7dbefbf43924e5109e04f0dd1c',
        '0xd16e43eff7128fb019e3cbf3aeee8a926ee8a09f2317957fe9fbdafc1ec88f28',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1010502,
        '${wallet}',
        102020502,
        'REDEEMED',
        'TEMPLATE',
        '0xc1e8ab3604dd9d086054e1cf1a2a7c5a70a5ee3b8ea5234ad245a7be2e371a274830e84e23ae11271e2cfdf0b5b386f0be29a2ed08ade88a650587826fb706511b',
        '0x90b773d416db1a96768036eaa9fd5712e4f21eef2bbdc93f6c508a00db513e96',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
