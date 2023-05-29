import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc998At1563804000240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        140101
      ), (
        140102
      ), (
        140103
      ), (
        140401
      ), (
        140402
      ), (
        140403
      ), (
        140404
      ), (
        140405
      ), (
        140501
      ), (
        140601
      ), (
        140602
      ), (
        140603
      ), (
        140701
      ), (
        140901
      ), (
        141101
      ), (
        141201
      ), (
        141301
      ), (
        240101
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
        140101,
        'Physical resistance',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_physical_resistance.png?alt=media&token=d30e8e4c-c07d-4471-9e42-a195658eca80',
        140101,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140102,
        'Magic resistance',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_magic_resistance.png?alt=media&token=b0e82f13-56d2-44b5-8809-6172887f3d4d',
        140102,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140103,
        'Poison resistance',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_poison_resistance.png?alt=media&token=794b45a4-f0e7-4bfe-a50b-32339d26d774',
        140103,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140401,
        'Fireball',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_fireball.png?alt=media&token=2fd8e1db-9b1b-4201-9fc5-76b4619e7c03',
        140401,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140402,
        'Frostbite',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_frost_bite.png?alt=media&token=a56ead1b-ebf9-498c-98f8-8e3e485d6564',
        140402,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140403,
        'Lightning bolt',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_lightning_bolt.png?alt=media&token=8d0bbb64-f42c-4ed4-85c3-ae289910f5fb',
        140403,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140404,
        'Slow',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_slow.png?alt=media&token=f5d97ae9-5e88-452d-8d4b-442948d1ef7f',
        140404,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140405,
        'Fly',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_fly.png?alt=media&token=52286e06-01ba-4323-b2b1-aa25ee4940e7',
        140405,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140501,
        'Grimoire',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgrimoire.png?alt=media&token=4eba93cd-c1ca-4aa1-b002-b501bd2fb5c6',
        140501,
        0,
        1,
        'ACTIVE',
        1405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140601,
        'Warrior',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwarrior.png?alt=media&token=ec819144-9ad3-4ea4-9aa8-4a068fd8a56e',
        140601,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140602,
        'Rouge',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frouge.png?alt=media&token=20c7180d-775b-4ae3-82d4-9e1e9b4981b4',
        140602,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140603,
        'Mage',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmage.png?alt=media&token=44bb311d-4513-4b9f-a6ca-5a05c053e6f9',
        140603,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140701,
        'Infinity',
        '${simpleFormatting}',
        '${imageUrl}',
        140701,
        0,
        1,
        'ACTIVE',
        1407,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140901,
        'Archery',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings_archery.png?alt=media&token=c1a2c73a-7309-4086-92b8-760847d776b7',
        140901,
        0,
        1,
        'ACTIVE',
        1409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140902,
        'Barracks',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings_barracks.png?alt=media&token=f5ce7e36-9069-4893-be60-de9e40691968',
        140902,
        0,
        1,
        'ACTIVE',
        1409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140903,
        'Mage tower',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings_mage_tower.png?alt=media&token=c142a391-f6de-4d4a-b976-a9937c0d4d7d',
        140903,
        0,
        1,
        'ACTIVE',
        1409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141101,
        'Wallet (ERC20)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwallet.png?alt=media&token=a32df807-f912-4c4e-823f-91e3c5c71850',
        141101,
        0,
        1,
        'ACTIVE',
        1411,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141201,
        'Bag (ERC1155)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbag.png?alt=media&token=e443c50c-7981-4a2b-8a48-63e9d00819a1',
        141201,
        0,
        1,
        'ACTIVE',
        1412,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141301,
        'Sack (ERC20 + ERC1155)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsack.png?alt=media&token=9caeb5a2-5934-4642-96c8-f9eea88470f5',
        141201,
        0,
        1,
        'ACTIVE',
        1413,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        240101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        240101,
        0,
        1,
        'ACTIVE',
        2401,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
