import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imageUrl, imagePath, ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedTemplateErc998At1563804000240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        10100040101
      ), (
        10100040102
      ), (
        10100040103
      ), (
        10100040401
      ), (
        10100040402
      ), (
        10100040403
      ), (
        10100040404
      ), (
        10100040405
      ), (
        10100040501
      ), (
        10100040502
      ), (
        10100040601
      ), (
        10100040602
      ), (
        10100040603
      ), (
        10100040701
      ), (
        10100040901
      ), (
        10100040902
      ), (
        10100040903
      ), (
        10100041101
      ), (
        10100041201
      ), (
        10100041301
      ), (
        10100048001
      ), (
        201040101
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
        1040101,
        'Physical resistance',
        '${simpleFormatting}',
        '${imagePath}/rune_of_physical_resistance.png',
        10100040101,
        0,
        1,
        'ACTIVE',
        10401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040102,
        'Magic resistance',
        '${simpleFormatting}',
        '${imagePath}/rune_of_magic_resistance.png',
        10100040102,
        0,
        1,
        'ACTIVE',
        10401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040103,
        'Poison resistance',
        '${simpleFormatting}',
        '${imagePath}/rune_of_poison_resistance.png',
        10100040103,
        0,
        1,
        'ACTIVE',
        10401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040401,
        'Fireball',
        '${simpleFormatting}',
        '${imagePath}/scrolls_fireball.png',
        10100040401,
        0,
        1,
        'ACTIVE',
        10404,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040402,
        'Frostbite',
        '${simpleFormatting}',
        '${imagePath}/scrolls_frost_bite.png',
        10100040402,
        0,
        1,
        'ACTIVE',
        10404,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040403,
        'Lightning bolt',
        '${simpleFormatting}',
        '${imagePath}/scrolls_lightning_bolt.png',
        10100040403,
        0,
        1,
        'ACTIVE',
        10404,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040404,
        'Slow',
        '${simpleFormatting}',
        '${imagePath}/scrolls_slow.png',
        10100040404,
        0,
        1,
        'ACTIVE',
        10404,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040405,
        'Fly',
        '${simpleFormatting}',
        '${imagePath}/scrolls_fly.png',
        10100040405,
        0,
        1,
        'ACTIVE',
        10404,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040501,
        'Grimoire',
        '${simpleFormatting}',
        '${imagePath}/grimoire.png',
        10100040501,
        0,
        1,
        'ACTIVE',
        10405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040502,
        'Foliant',
        '${simpleFormatting}',
        '${imagePath}/grimoire.png',
        10100040501,
        0,
        1,
        'ACTIVE',
        10405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040601,
        'Warrior',
        '${simpleFormatting}',
        '${imagePath}/warrior.png',
        10100040601,
        0,
        1,
        'ACTIVE',
        10406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040602,
        'Rouge',
        '${simpleFormatting}',
        '${imagePath}/rouge.png',
        10100040602,
        0,
        1,
        'ACTIVE',
        10406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040603,
        'Mage',
        '${simpleFormatting}',
        '${imagePath}/mage.png',
        10100040603,
        0,
        1,
        'ACTIVE',
        10406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040901,
        'Archery',
        '${simpleFormatting}',
        '${imagePath}/buildings_archery.png',
        10100040901,
        0,
        1,
        'ACTIVE',
        10409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040902,
        'Barracks',
        '${simpleFormatting}',
        '${imagePath}/buildings_barracks.png',
        10100040902,
        0,
        1,
        'ACTIVE',
        10409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040903,
        'Mage tower',
        '${simpleFormatting}',
        '${imagePath}/buildings_mage_tower.png',
        10100040903,
        0,
        1,
        'ACTIVE',
        10409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1041101,
        'Wallet (ERC20)',
        '${simpleFormatting}',
        '${imagePath}/wallet.png',
        10100041101,
        0,
        1,
        'ACTIVE',
        10411,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1041201,
        'Bag (ERC1155)',
        '${simpleFormatting}',
        '${imagePath}/bag.png',
        10100041201,
        0,
        1,
        'ACTIVE',
        10412,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1041301,
        'Sack (ERC20 + ERC1155)',
        '${simpleFormatting}',
        '${imagePath}/sack.png',
        10100041301,
        0,
        1,
        'ACTIVE',
        10413,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1048001,
        'Voldemort',
        '${simpleFormatting}',
        '${imagePath}/mage.png',
        10100048001,
        0,
        1,
        'ACTIVE',
        10480,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2040101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        201040101,
        0,
        1,
        'ACTIVE',
        20401,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
