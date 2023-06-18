import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";
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

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        10306,
        1030601, -- sword
        '1',
        63101
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        63111
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
        63101,
        63111,
        '${subMonths(now, 3).toISOString()}',
        '${subMonths(now, 1).toISOString()}',
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
