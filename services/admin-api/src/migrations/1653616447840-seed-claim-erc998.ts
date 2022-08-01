import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimErc998At1653616447840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

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
        26,
        14101, -- warrior
        '1',
        24101
      ), (
        'ERC998',
        26,
        14102, -- rouge
        '1',
        24102
      ), (
        'ERC998',
        26,
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
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        24101,
        'NEW',
        '0x05850f2dc237733540c8ff2ff663d1394d3bc7e91b13177360ddf07fdc28cfce15bcb2f8de7dd2d603169fdcc61e4d208073549d7cb2d281183301ab89e2e04a1b',
        '0x82782c83a825d1ef9828e810da3cee0c0023f9201747333f37ebc4051ccd21cb',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        24102,
        'NEW',
        '0x1afec0b4b077d338708d1e690d58477dac12233d4c9343bedbf980691f798ac6011aea94371796850b5331f287a3221e956e2754d69d269d3472470caace48a71b',
        '0xe41ee3a01e3adfb706dbbfe754b3f29a093da2bb175749af236f76f510b8069b',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        24103,
        'NEW',
        '0x33cb0a47f4854cc4accce2442d3d7845c43dee7e2066647b480a7995db96bb70121140ef2a1cf37a496e09099e293f9aa6d8a42079a1af723f2cb96b888e18fb1b',
        '0x1cd75a797ed5b045e56749d3d3c64b8788bb21bf88f31901eac324f93b9c97ed',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
