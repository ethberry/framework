import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedErc1155Tokens1563804020120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.erc1155_token (
        title,
        description,
        image_url,
        attributes,
        price,
        token_id,
        erc1155_collection_id,
        erc20_token_id,
        created_at,
        updated_at
      ) VALUES (
        'Gold',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        '1',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Iron',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        '2',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Wood',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        '3',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Iron ingot',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        '4',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Wood log',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        '5',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Healing potion',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        '5',
        2,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Mana potion',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        '5',
        2,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Antidote',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        '${constants.WeiPerEther.toString()}',
        '5',
        2,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc1155_token RESTART IDENTITY CASCADE;`);
  }
}
