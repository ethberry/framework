import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimMysteryboxAt1653616447860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102021101
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
        11101,
        1110101, -- sword mysterybox
        '1',
        102021101
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
        1021101,
        '${wallet}',
        102021101,
        'NEW',
        '0x8ec31888371c5ecad6c93ac7c6e4f2519f2bea53231ed5b48be3a5bcd346d6b75a9abaf173dc703b4e3b628d5a8b6e9cd75eebace06b25cf7402bde23af7526e1b',
        '0xb7a84a4d540ad682fe1f3da89b7255586ddbc299be8e04f7576b1ad985dde16b',
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
