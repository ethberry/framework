import {MigrationInterface, QueryRunner} from "typeorm";

import {ns} from "@trejgun/solo-constants-misc";

const simpleFormatting = JSON.stringify({
  blocks: [
    {
      key: "e9n5e",
      text: "bold",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [{offset: 0, length: 4, style: "BOLD"}],
      entityRanges: [],
      data: {},
    },
    {
      key: "dfijs",
      text: "italic",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [{offset: 0, length: 6, style: "ITALIC"}],
      entityRanges: [],
      data: {},
    },
    {
      key: "fdeqa",
      text: "underscore",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [{offset: 0, length: 10, style: "UNDERLINE"}],
      entityRanges: [],
      data: {},
    },
    {
      key: "4uhh1",
      text: "strikethrough",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [{offset: 0, length: 13, style: "STRIKETHROUGH"}],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
});

export class SetupProducts1593408358910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.product (
        title,
        description,
        category_id,
        price,
        amount,
        product_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        'Bottle of water',
        '${simpleFormatting}',
        1,
        100,
        10,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Jar of water',
        '${simpleFormatting}',
        1,
        1000,
        10,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Barrel of water',
        '${simpleFormatting}',
        1,
        10000,
        10,
        'INACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Milk',
        '${simpleFormatting}',
        1,
        10000,
        10,
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Beer',
        '${simpleFormatting}',
        1,
        10000,
        10,
        'INACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Juice',
        '${simpleFormatting}',
        1,
        10000,
        10,
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.product RESTART IDENTITY CASCADE;`);
  }
}
