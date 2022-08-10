import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimErc998At1653616447840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        24101
      ), (
        24102
      ), (
        24103
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 24103, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC998',
        46,
        14101, -- warrior
        '1',
        24101
      ), (
        'ERC998',
        46,
        14102, -- rouge
        '1',
        24102
      ), (
        'ERC998',
        46,
        14103, -- mage
        '1',
        24103
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
        24101,
        'NEW',
        '0xbf59214e6a84225b211b3f10e6a5283c5abaa44d91c71bd6deb9879e5cd711fd632fd4db7968eec2bedbe452eed8fceceec73f5fd7c54d33a46013c38d8106d51b',
        '0xfbb1806fa38e3cb364e5a1a6bf8ff492afb674af0e285a0f96033bf82f563522',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        24102,
        'NEW',
        '0xc62473bd1f8202554bfaf59c031bfb4a5e27646e94ea82cbe67e5130b65f73e23ad96825c67f684b95cb9e2e74d27ddc0a5748f3be2870a04cf81043afb431651b',
        '0xb4c8a2a0531a0b523cdf9cf35cb7bce603ca0ba29a47b580d23206182d3cb608',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        24103,
        'NEW',
        '0xc79b95162d410de32ccd9d4f92c5d208d408615b8ab99e2ee2f118dbba07d78b17492f8726926590a811e55c189315b18957d716596ee31adb202d38fe169db11b',
        '0x7c1e5ce58c51faceb12d3881385dc59c3aa0ccf0ff8430ce83acb64c3387a172',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
