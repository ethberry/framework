import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedLootBoxErc20At1653616447920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102232101
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
       'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102232101
      ), (
       'ERC20',
        10204,
        1020401, -- Black list token
        '${WeiPerEther.toString()}',
        102232101
      ), (
       'ERC20',
        10205,
        1020501, -- White list token
        '${WeiPerEther.toString()}',
        102232101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.loot_box (
        title,
        description,
        image_url,
        content_id,
        template_id,
        loot_box_status,
        min,
        max,
        created_at,
        updated_at
      ) VALUES (
        'Coin Loot Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102232101,
        1120701,
        'ACTIVE',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.loot_box RESTART IDENTITY CASCADE;`);
  }
}
