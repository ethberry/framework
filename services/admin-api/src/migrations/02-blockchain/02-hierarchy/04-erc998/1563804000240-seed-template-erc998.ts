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
        101040101
      ), (
        101040102
      ), (
        101040103
      ), (
        101040401
      ), (
        101040402
      ), (
        101040403
      ), (
        101040404
      ), (
        101040405
      ), (
        101040501
      ), (
        101040502
      ), (
        101040601
      ), (
        101040602
      ), (
        101040603
      ), (
        101040701
      ), (
        101040901
      ), (
        101040902
      ), (
        101040903
      ), (
        101041101
      ), (
        101041201
      ), (
        101041301
      ), (
        101048001
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_physical_resistance.png?alt=media&token=4b34a8c2-1ead-4548-be33-cf45e8ffc513',
        101040101,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_magic_resistance.png?alt=media&token=d142a6f6-f620-47b6-bbad-bb2d3370f874',
        101040102,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_poison_resistance.png?alt=media&token=f9db48bd-bfc9-4821-9dae-b038a13bd212',
        101040103,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_fireball.png?alt=media&token=2fd8e1db-9b1b-4201-9fc5-76b4619e7c03',
        101040401,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_frost_bite.png?alt=media&token=a56ead1b-ebf9-498c-98f8-8e3e485d6564',
        101040402,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_lightning_bolt.png?alt=media&token=8d0bbb64-f42c-4ed4-85c3-ae289910f5fb',
        101040403,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_slow.png?alt=media&token=f5d97ae9-5e88-452d-8d4b-442948d1ef7f',
        101040404,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_fly.png?alt=media&token=52286e06-01ba-4323-b2b1-aa25ee4940e7',
        101040405,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgrimoire.png?alt=media&token=4eba93cd-c1ca-4aa1-b002-b501bd2fb5c6',
        101040501,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgrimoire.png?alt=media&token=4eba93cd-c1ca-4aa1-b002-b501bd2fb5c6',
        101040501,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwarrior.png?alt=media&token=ec819144-9ad3-4ea4-9aa8-4a068fd8a56e',
        101040601,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frouge.png?alt=media&token=20c7180d-775b-4ae3-82d4-9e1e9b4981b4',
        101040602,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmage.png?alt=media&token=44bb311d-4513-4b9f-a6ca-5a05c053e6f9',
        101040603,
        0,
        1,
        'ACTIVE',
        10406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040701,
        'Infinity',
        '${simpleFormatting}',
        '${imageUrl}',
        101040701,
        0,
        1,
        'ACTIVE',
        10407,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1040901,
        'Archery',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings_archery.png?alt=media&token=c1a2c73a-7309-4086-92b8-760847d776b7',
        101040901,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings_barracks.png?alt=media&token=f5ce7e36-9069-4893-be60-de9e40691968',
        101040902,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings_mage_tower.png?alt=media&token=c142a391-f6de-4d4a-b976-a9937c0d4d7d',
        101040903,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwallet.png?alt=media&token=a32df807-f912-4c4e-823f-91e3c5c71850',
        101041101,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbag.png?alt=media&token=e443c50c-7981-4a2b-8a48-63e9d00819a1',
        101041201,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsack.png?alt=media&token=9caeb5a2-5934-4642-96c8-f9eea88470f5',
        101041301,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmage.png?alt=media&token=44bb311d-4513-4b9f-a6ca-5a05c053e6f9',
        101048001,
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
