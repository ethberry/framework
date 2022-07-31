import { MigrationInterface, QueryRunner } from "typeorm";
import { addMonths, subMonths } from "date-fns";

import { ns } from "@framework/constants";

export class SeedDrop1658980520000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    // ERC721
    await queryRunner.query(`
      INSERT INTO ${ns}.drop (
        template_id,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        13101, -- sword
        '${subMonths(now, 3).toISOString()}',
        '${subMonths(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    // MODULE:ERC998
    await queryRunner.query(`
      INSERT INTO ${ns}.drop (
        template_id,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        14101, -- sword
        '${subMonths(now, 1).toISOString()}',
        '${addMonths(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    // MODULE:LOOTBOX
    await queryRunner.query(`
      INSERT INTO ${ns}.drop (
        template_id,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        16101, -- sword dropbox
        '${addMonths(now, 1).toISOString()}',
        '${addMonths(now, 3).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.drop RESTART IDENTITY CASCADE;`);
  }
}
