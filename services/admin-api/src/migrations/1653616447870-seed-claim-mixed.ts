import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimMixedAt1653616447870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        27101
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
        16,
        13501, -- sword
        '1',
        27101
      ), (
        'ERC998',
        26,
        14101, -- warrior
        '1',
        27101
      ), (
        'ERC1155',
        31,
        15101, -- gold
        '1000',
        27101
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
        27101,
        'NEW',
        '0x4204557726050cba3b2b57ff13de21b9dd37df2a223f01bc236d09864ea78660463d6264686d856b214dfeeaed249533630168d77702e3ae8d462e97cc40db7a1b',
        '0x8e42ff64a8d5cc3ca1b29eb027b5b8d9c1a883be264bd2db14f796dadbc39642',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
