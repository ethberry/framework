import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateNativeAt1563804000210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
        1010101,
        'Native token (BESU)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1010201,
        'Inactive token (BESU)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1010801,
        'Fake token (BESU)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10108,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2010101,
        'Native token (BNB)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        20101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3010101,
        'Native token (ETH)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        30101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4010101,
        'Native token (MATIC)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        40101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
