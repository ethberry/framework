import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedAchievementClaimErc721At1681273013071 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        104000301
      ), (
        104000302
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
        10306,
        1030601, -- sword
        '1',
        104000301
      ), (
        'ERC721',
        10306,
        1030602, -- mace
        '1',
        104000302
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        id,
        account,
        item_id,
        claim_status,
        signature,
        nonce,
        end_timestamp,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1040301,
        '${wallet}',
        104000301,
        'NEW',
        '0xf6f1487c6839332a0457bf675ad230b47d8994425c0f725beaacbadb3c9585464d07d3dc2c2e8e0d819d8d921a98e4eb35a457f7fcb55b28f99dd58f6551c7fd1c',
        '0x72d4822a58446913799acb91ae0d6074ed439345911234654a37684b85e9a8e4',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040302,
        '${wallet}',
        104000302, -- mace
        'REDEEMED',
        '0x541d0296a1413ce50bdfd38a0f02ff97b4b4ad05fc1439882ee822c182f3854103f52bf0cfae21be35d471b369dfa9063f90121c0cd7146ec08b7a65de8222021c',
        '0x92451af3fee3fbb36bae601469a2f07462ab0d9021f8cb5fa9062e278c81ed76',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
