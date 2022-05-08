import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedErc721Dropbox1563804021276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.erc721_dropbox (
        title,
        description,
        image_url,
        price,
        dropbox_status,
        erc721_collection_id,
        erc721_template_id,
        created_at,
        updated_at
      ) VALUES (
        'Warrior Dropbox',
        '${simpleFormatting}',
        '${imageUrl}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        2,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Sword Dropbox',
        '${simpleFormatting}',
        '${imageUrl}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        2,
        4,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc721_dropbox RESTART IDENTITY CASCADE;`);
  }
}
