import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedErc721Templates1563804021270 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.erc721_template (
        title,
        description,
        image_url,
        attributes,
        price,
        template_status,
        erc721_collection_id,
        created_at,
        updated_at
      ) VALUES (
        'Warrior',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Rouge',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Mage',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Sword',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Mace',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Axe',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Chain mail',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Helmet',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Gloves',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Boots',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Gold Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Silver Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Yellow pants',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc721_template RESTART IDENTITY CASCADE;`);
  }
}
