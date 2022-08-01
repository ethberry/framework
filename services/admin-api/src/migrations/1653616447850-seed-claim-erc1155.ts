import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimErc1155At1653616447850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        25101
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 25104, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC1155',
        31,
        15101, -- gold
        '1000',
        25101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        account,
        item_id,
        claim_status,
        signature,
        nonce,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        25101,
        'REDEEMED',
        '0x4848640f61c4bb0b0edab8bab540184a1b16a210e3e65e921c8053a9dde71c7c0022e73e63bb60c3b53907fecf6d11eb83ea58d39e351654ccedf3fd3498ae6e1b',
        '0x17fdcea410c1f8ee61a2bbc06f80a5bdf84611c935f0ed859d6acb475619d5f0',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
