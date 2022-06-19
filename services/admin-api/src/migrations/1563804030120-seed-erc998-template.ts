import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedErc998Templates1563804030120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.erc998_template (
        title,
        description,
        image_url,
        attributes,
        price,
        template_status,
        erc998_collection_id,
        created_at,
        updated_at
      ) VALUES (
        'Warrior',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Rouge',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Mage',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc998_template RESTART IDENTITY CASCADE;`);
  }
}
