import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet, NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class SeedClaimTemplateErc998At1653616447840 implements MigrationInterface {
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
        102020401
      ), (
        102020402
      ), (
        102020403
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
        'ERC998',
        10406,
        1040601, -- Warrior
        '1',
        102020401
      ), (
        'ERC998',
        10406,
        1040602, -- Rouge
        '1',
        102020402
      ), (
        'ERC998',
        10406,
        1040603, -- Mage
        '1',
        102020403
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
        1010401,
        '${wallet}',
        102020401,
        'NEW',
        'TEMPLATE',
        '0xbf59214e6a84225b211b3f10e6a5283c5abaa44d91c71bd6deb9879e5cd711fd632fd4db7968eec2bedbe452eed8fceceec73f5fd7c54d33a46013c38d8106d51b',
        '0xfbb1806fa38e3cb364e5a1a6bf8ff492afb674af0e285a0f96033bf82f563522',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1010402,
        '${wallet}',
        102020402,
        'NEW',
        'TEMPLATE',
        '0xc62473bd1f8202554bfaf59c031bfb4a5e27646e94ea82cbe67e5130b65f73e23ad96825c67f684b95cb9e2e74d27ddc0a5748f3be2870a04cf81043afb431651b',
        '0xb4c8a2a0531a0b523cdf9cf35cb7bce603ca0ba29a47b580d23206182d3cb608',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1010403,
        '${wallet}',
        102020403,
        'NEW',
        'TEMPLATE',
        '0xc79b95162d410de32ccd9d4f92c5d208d408615b8ab99e2ee2f118dbba07d78b17492f8726926590a811e55c189315b18957d716596ee31adb202d38fe169db11b',
        '0x7c1e5ce58c51faceb12d3881385dc59c3aa0ccf0ff8430ce83acb64c3387a172',
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
