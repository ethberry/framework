import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedTemplateNativeAt1563804000210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        110101,
        'Native token (ETH)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        1101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        110201,
        'Inactive token (ETH)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        1102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        210101,
        'Native token (BNB)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        2101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        310101,
        'Native token (MATIC)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        3101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        410101,
        'Native token (BESU)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        4101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
