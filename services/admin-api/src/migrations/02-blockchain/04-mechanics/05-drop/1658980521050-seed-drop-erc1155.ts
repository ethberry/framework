import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";
import { addMonths } from "date-fns";

import { ns } from "@framework/constants";

export class SeedDropErc1155At1658980521050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        65101
      ), (
        65111
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
        'ERC1155',
        1501,
        150101, -- gold
        '1',
        65101
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        65111
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.drop (
        item_id,
        price_id,
        start_timestamp,
        end_timestamp,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        65101,
        65111,
        '${addMonths(now, 1).toISOString()}',
        '${addMonths(now, 3).toISOString()}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.drop RESTART IDENTITY CASCADE;`);
  }
}
