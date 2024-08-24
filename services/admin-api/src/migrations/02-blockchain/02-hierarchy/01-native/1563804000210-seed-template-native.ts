import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imagePath, ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedTemplateNativeAt1563804000210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

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
        ${process.env.NODE_ENV === NodeEnv.production ? 1 : 1010101},
        'Native token (BESU)',
        '${simpleFormatting}',
        '${imagePath}/besu.png',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 1 : 10101},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 2 : 1010201},
        'Inactive token (BESU)',
        '${simpleFormatting}',
        '${imagePath}/besu.png',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 2 : 10102},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 3 : 2010101},
        'Native token (BNB)',
        '${simpleFormatting}',
        '${imagePath}/bnb.png',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 3 : 20101},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 4 : 3010101},
        'Native token (ETH)',
        '${simpleFormatting}',
        '${imagePath}/ethereum.png',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 4 : 30101},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 5 : 4010101},
        'Native token (MATIC)',
        '${simpleFormatting}',
        '${imagePath}/polygon.png',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 5 : 40101},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

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
        1010801,
        'FAKE',
        '${simpleFormatting}',
        '${imagePath}/besu.png',
        null,
        0,
        '${(1000n * WeiPerEther).toString()}',
        'ACTIVE',
        10108,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
