import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { imageUrl, ns } from "@framework/constants";
import { NodeEnv, TokenMetadata } from "@framework/types";

export class SeedTokenCollectionAt1679894500330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        metadata,
        image_url,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        16110101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "161101",
          [TokenMetadata.TRAITS]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '1',
        'MINTED',
        161101,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        16110102,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "161101",
          [TokenMetadata.TRAITS]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '1',
        'MINTED',
        161101,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        16110103,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "161101",
          [TokenMetadata.TRAITS]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '1',
        'MINTED',
        161101,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        16110104,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "161101",
          [TokenMetadata.TRAITS]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '1',
        'MINTED',
        161101,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        16110105,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "161101",
          [TokenMetadata.TRAITS]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '1',
        'MINTED',
        161101,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
