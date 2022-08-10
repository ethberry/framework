import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";
import { addMonths, subMonths } from "date-fns";

import { ns } from "@framework/constants";

export class SeedDropErcMysteryboxAt1658980521050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        66101
      ), (
        66111
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 60502, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        61,
        16101,
        '1',
        66101
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        66111
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.drop (
        item_id,
        price_id,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        66101,
        66111,
        '${subMonths(now, 1).toISOString()}',
        '${addMonths(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.drop RESTART IDENTITY CASCADE;`);
  }
}
