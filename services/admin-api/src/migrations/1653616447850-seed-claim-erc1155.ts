import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimErc1155At1653616447850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        25101
      ), (
        25102
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 25102, true);`);

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
      ), (
        'ERC1155',
        31,
        15101, -- gold
        '100',
        25102
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
        25101,
        'NEW',
        '0x4848640f61c4bb0b0edab8bab540184a1b16a210e3e65e921c8053a9dde71c7c0022e73e63bb60c3b53907fecf6d11eb83ea58d39e351654ccedf3fd3498ae6e1b',
        '0x17fdcea410c1f8ee61a2bbc06f80a5bdf84611c935f0ed859d6acb475619d5f0',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        25101,
        'REDEEMED',
        '0xb3bdebe040a7832102b556fe3cdf0f9e7bfa1349b2793a8d6afadb00559d2a26017ebc9ca7cc6cc3207d526aec71df13d6c8dc4449c1d21f10b291a2439f36b21c',
        '0x5f3b61b7da793b35cb2b07ae382c5182a1a38d52031d7cb6a00f887df32d7db8',
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
