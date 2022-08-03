import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";
import { subMonths } from "date-fns";

import { ns } from "@framework/constants";

export class SeedDropErc721At1658980521030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        63101
      ), (
        63111
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 63111, true);`);

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
        63101
      ), (
        'ERC20',
        2,
        12002, -- space credit
        '${constants.WeiPerEther.toString()}',
        63111
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
        63101,
        63111,
        '${subMonths(now, 3).toISOString()}',
        '${subMonths(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.drop RESTART IDENTITY CASCADE;`);
  }
}
