import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc20At1563804000220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

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
        1020101,
        'Space Credits',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1020201,
        'Inactive token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'INACTIVE',
        10202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1020301,
        'New token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10203,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1020401,
        'Black list token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10204,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1020501,
        'White list token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10205,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1028001,
        'Warp token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10280,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
