import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, imagePath, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateErc721At1563804000230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        10100030101
      ), (
        10100030102
      ), (
        10100030103
      ), (
        10100030401
      ), (
        10100030402
      ), (
        10100030403
      ), (
        10100030404
      ), (
        10100030405
      ), (
        10100030501
      ), (
        10100030502
      ), (
        10100030503
      ), (
        10100030504
      ), (
        10100030505
      ), (
        10100030506
      ), (
        10100030507
      ), (
        10100030508
      ), (
        10100030509
      ), (
        10100030510
      ), (
        10100030511
      ), (
        10100030512
      ), (
        10100030513
      ), (
        10100030601
      ), (
        10100030602
      ), (
        10100030603
      ), (
        10100030604
      ), (
        10100030605
      ), (
        10100030606
      ), (
        10100030607
      ), (
        10100030608
      ), (
        10100030609
      ), (
        10100030610
      ), (
        10100030701
      ), (
        10100030801
      ), (
        10100030802
      ), (
        10100030803
      ), (
        10100030901
      ), (
        10100030902
      ), (
        10100030903
      ), (
        10100030904
      ), (
        10100030905
      ), (
        10100038001
      ), (
        10100038002
      ), (
        10100038003
      ), (
        201030101
      );
    `);

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
        1030101,
        'Ruby',
        '${simpleFormatting}',
        '${imagePath}/ruby.png',
        10100030101,
        0,
        1,
        'ACTIVE',
        10301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030102,
        'Emerald',
        '${simpleFormatting}',
        '${imagePath}/emerald.png',
        10100030102,
        0,
        1,
        'ACTIVE',
        10301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030103,
        'Sapphire',
        '${simpleFormatting}',
        '${imagePath}/sapphire.png',
        10100030103,
        0,
        1,
        'ACTIVE',
        10301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030401,
        'Necklace',
        '${simpleFormatting}',
        '${imagePath}/necklace.png',
        10100030401,
        0,
        1,
        'ACTIVE',
        10304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030402,
        'Gold ring',
        '${simpleFormatting}',
        '${imagePath}/ring_gold.png',
        10100030402,
        0,
        1,
        'ACTIVE',
        10304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030403,
        'Silver ring',
        '${simpleFormatting}',
        '${imagePath}/ring_silver.png',
        10100030403,
        0,
        1,
        'ACTIVE',
        10304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030404,
        'Pendant',
        '${simpleFormatting}',
        '${imagePath}/pendant.png',
        10100030404,
        0,
        1,
        'ACTIVE',
        10304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030405,
        'Copper ring',
        '${simpleFormatting}',
        '${imagePath}/ring_copper.png',
        10100030405,
        0,
        1,
        'ACTIVE',
        10304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030501,
        'Cuirass',
        '${simpleFormatting}',
        '${imagePath}/cuirass.png',
        10100030501,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030502,
        'Helmet',
        '${simpleFormatting}',
        '${imagePath}/helmet.png',
        10100030502,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030503,
        'Cuisses',
        '${simpleFormatting}',
        '${imagePath}/cuisses.png',
        10100030503,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030504,
        'Gauntlets',
        '${simpleFormatting}',
        '${imagePath}/gauntlets.png',
        10100030504,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030505,
        'Sabatons',
        '${simpleFormatting}',
        '${imagePath}/sabatons.png',
        10100030505,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030506,
        'Round Shield',
        '${simpleFormatting}',
        '${imagePath}/shield_round.png',
        10100030506,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030507,
        'Heater Shield',
        '${simpleFormatting}',
        '${imagePath}/shield_heater.png',
        10100030507,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030508,
        'Royal Shield',
        '${simpleFormatting}',
        '${imagePath}/shield_royal.png',
        10100030508,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030509,
        'Cloak',
        '${simpleFormatting}',
        '${imagePath}/cloak.png',
        10100030509,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030510,
        'Robe',
        '${simpleFormatting}',
        '${imagePath}/robe.png',
        10100030510,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030511,
        'Mage''s Hat',
        '${simpleFormatting}',
        '${imagePath}/mages_hat.png',
        10100030511,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030512,
        'Witch''s Hat',
        '${simpleFormatting}',
        '${imagePath}/witchs_hat.png',
        10100030512,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030513,
        'Viking''s Helmet',
        '${simpleFormatting}',
        '${imagePath}/vikings_helmet.png',
        10100030513,
        0,
        1,
        'ACTIVE',
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030601,
        'Sword',
        '${simpleFormatting}',
        '${imagePath}/sword.png',
        10100030601,
        0,
        4,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030602,
        'Mace',
        '${simpleFormatting}',
        '${imagePath}/mace.png',
        10100030602,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030603,
        'Axe',
        '${simpleFormatting}',
        '${imagePath}/axe.png',
        10100030603,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030604,
        'Bow',
        '${simpleFormatting}',
        '${imagePath}/bow.png',
        10100030604,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030605,
        'Staff',
        '${simpleFormatting}',
        '${imagePath}/staff.png',
        10100030605,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030606,
        'Magic Wand',
        '${simpleFormatting}',
        '${imagePath}/magic_wand.png',
        10100030606,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030607,
        'Two Hand Axe',
        '${simpleFormatting}',
        '${imagePath}/axe_two_hand.png',
        10100030607,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030608,
        'Crossbow',
        '${simpleFormatting}',
        '${imagePath}/crossbow.png',
        10100030608,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030609,
        'Spear',
        '${simpleFormatting}',
        '${imagePath}/spear.png',
        10100030609,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030610,
        'Mjölnir',
        '${simpleFormatting}',
        '${imagePath}/mjolnir.png',
        10100030610,
        0,
        1,
        'ACTIVE',
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030701,
        'DNA',
        '${simpleFormatting}',
        '${imageUrl}',
        10100030701,
        0,
        1,
        'ACTIVE',
        10307,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030702,
        'DNA (traits)(hidden)',
        '${simpleFormatting}',
        '${imageUrl}',
        null, -- hidden template has price on drop
        '${(1024 * 1024 * 1024 * 4).toString()}',
        1,
        'HIDDEN',
        10307,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030801,
        'Medal',
        '${simpleFormatting}',
        '${imagePath}/medal.png',
        10100030801,
        0,
        1,
        'ACTIVE',
        10308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030802,
        'Cup',
        '${simpleFormatting}',
        '${imagePath}/cup.png',
        10100030802,
        0,
        1,
        'ACTIVE',
        10308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030803,
        'Diploma',
        '${simpleFormatting}',
        '${imagePath}/diploma.png',
        10100030803,
        0,
        1,
        'ACTIVE',
        10308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030901,
        'Horse',
        '${simpleFormatting}',
        '${imagePath}/horse.png',
        10100030901,
        0,
        1,
        'ACTIVE',
        10309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030902,
        'Boat',
        '${simpleFormatting}',
        '${imagePath}/boat.png',
        10100030902,
        0,
        1,
        'ACTIVE',
        10309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030903,
        'Gyrocopter',
        '${simpleFormatting}',
        '${imagePath}/gyrocopter.png',
        10100030903,
        0,
        1,
        'ACTIVE',
        10309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030904,
        'Witch''s broom',
        '${simpleFormatting}',
        '${imagePath}/witchs_broom.png',
        10100030904,
        0,
        1,
        'ACTIVE',
        10309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030905,
        'Magic carpet',
        '${simpleFormatting}',
        '${imagePath}/magic_carpet.png',
        10100030905,
        0,
        1,
        'ACTIVE',
        10309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1038001,
        'Trousers',
        '${simpleFormatting}',
        '${imagePath}/cuisses.png',
        10100038001,
        0,
        1,
        'ACTIVE',
        10380,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1038002,
        'Pantaloons',
        '${simpleFormatting}',
        '${imagePath}/cuisses.png',
        10100038002,
        0,
        1,
        'ACTIVE',
        10380,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1038003,
        'Bra',
        '${simpleFormatting}',
        '${imagePath}/cuisses.png',
        10100038003,
        0,
        1,
        'ACTIVE',
        10380,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2030101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        201030101,
        0,
        1,
        'ACTIVE',
        20301,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
