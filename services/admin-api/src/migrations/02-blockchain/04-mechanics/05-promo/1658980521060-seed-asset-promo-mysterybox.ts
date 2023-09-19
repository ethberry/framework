import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";
import { addMonths, subMonths } from "date-fns";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedAssetPromoMysteryBoxAt1658980521050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

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

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        11101,
        1110101,
        '1',
        66101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        66111
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_promo (
        item_id,
        price_id,
        start_timestamp,
        end_timestamp,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        66101,
        66111,
        '${subMonths(now, 1).toISOString()}',
        '${addMonths(now, 1).toISOString()}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_promo RESTART IDENTITY CASCADE;`);
  }
}
