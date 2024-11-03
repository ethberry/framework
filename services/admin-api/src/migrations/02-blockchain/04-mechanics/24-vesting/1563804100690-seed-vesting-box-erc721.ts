import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedVestingBoxErc721At1563804100690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102283101
      ), (
        102283102
      ), (
        102283103
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
        102283101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102283102
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102283103
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.vesting_box (
        title,
        description,
        image_url,
        content_id,
        template_id,
        function_type,
        shape,
        cliff,
        start_timestamp,
        duration,
        period,
        after_cliff_basis_points,
        growth_rate,
        created_at,
        updated_at
      ) VALUES (
        'Linear vesting',
        '${simpleFormatting}',
        '${imageUrl}',
        102283101,
        1280101,
        'LINEAR',
        'LINEAR_CLIFF',
        2592000,
        '${currentDateTime}',
        31557600,
        2629746,
        5,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Hyperbolic vesting',
        '${simpleFormatting}',
        '${imageUrl}',
        102283102,
        1280102,
        'HYPERBOLIC',
        'HYPERBOLIC_CLIFF',
        2592000,
        '${currentDateTime}',
        31557600,
        2629746,
        5,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Exponential vesting',
        '${simpleFormatting}',
        '${imageUrl}',
        102283103,
        1280103,
        'EXPONENTIAL',
        'EXPONENTIAL_CLIFF',
        2592000,
        '${currentDateTime}',
        31557600,
        2629746,
        5,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.loot_box RESTART IDENTITY CASCADE;`);
  }
}
