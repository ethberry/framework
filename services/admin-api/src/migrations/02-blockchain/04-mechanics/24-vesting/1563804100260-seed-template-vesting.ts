import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { NodeEnv } from "@ethberry/constants";
import { ns, imageUrl } from "@framework/constants";

export class SeedTemplateVestingAt1563804100260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102280101
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
        102280101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.template (
        id,
        title,
        description,
        image_url,
        price_id,
        cap,
        amount,
        template_status,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        1280101,
        'Linear vesting',
        '${simpleFormatting}',
        '${imageUrl}',
        102280101,
        0,
        4,
        'ACTIVE',
        12801,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1280102,
        'Hyperbolic vesting',
        '${simpleFormatting}',
        '${imageUrl}',
        102280101,
        0,
        4,
        'ACTIVE',
        12801,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1280103,
        'Exponential vesting',
        '${simpleFormatting}',
        '${imageUrl}',
        102280101,
        0,
        4,
        'ACTIVE',
        12801,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
