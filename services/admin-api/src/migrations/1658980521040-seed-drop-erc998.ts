import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";
import { addMonths, subMonths } from "date-fns";

import { ns } from "@framework/constants";

export class SeedDropErc998At1658980521040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        64101
      ), (
        64111
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
        'ERC998',
        406,
        406001, -- warrior
        '1',
        64101
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        64111
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
        64101,
        64111,
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
