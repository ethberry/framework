import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedMysteryboxErc721At1653616447930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        33101
      ), (
        33111
      ), (
        33201
      ), (
        33211
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 33211, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        306,
        306001, -- sword
        '1',
        33101
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        33111
      ), (
        'ERC721',
        306,
        306001, -- sword
        '1',
        33201
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        33211
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.mysterybox (
        title,
        description,
        image_url,
        item_id,
        price_id,
        template_id,
        mysterybox_status,
        created_at,
        updated_at
      ) VALUES (
        'Sword Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        33101,
        33111,
        601001,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Inactive Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        33201,
        33211,
        601002,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.mysterybox RESTART IDENTITY CASCADE;`);
  }
}
