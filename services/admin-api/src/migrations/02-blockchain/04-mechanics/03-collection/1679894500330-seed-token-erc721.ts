import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { imageUrl, ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenCollectionAt1679894500330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        attributes,
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
          [TokenAttributes.TEMPLATE_ID]: "161101",
          CLOTHES: "1",
          EYES: "1",
          MOUTH: "1",
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
          [TokenAttributes.TEMPLATE_ID]: "161101",
          CLOTHES: "1",
          EYES: "2",
          MOUTH: "1",
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
          [TokenAttributes.TEMPLATE_ID]: "161101",
          CLOTHES: "1",
          EYES: "1",
          MOUTH: "2",
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
          [TokenAttributes.TEMPLATE_ID]: "161101",
          CLOTHES: "1",
          EYES: "3",
          MOUTH: "3",
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
          [TokenAttributes.TEMPLATE_ID]: "161101",
          CLOTHES: "2",
          EYES: "2",
          MOUTH: "2",
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
