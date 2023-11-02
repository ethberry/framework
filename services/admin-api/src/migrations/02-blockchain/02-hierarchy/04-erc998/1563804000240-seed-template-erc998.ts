import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateErc998At1563804000240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_physical_resistance.png?alt=media&token=4b34a8c2-1ead-4548-be33-cf45e8ffc513',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_magic_resistance.png?alt=media&token=d142a6f6-f620-47b6-bbad-bb2d3370f874',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_poison_resistance.png?alt=media&token=f9db48bd-bfc9-4821-9dae-b038a13bd212',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_fireball.png?alt=media&token=2fd8e1db-9b1b-4201-9fc5-76b4619e7c03',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_frost_bite.png?alt=media&token=a56ead1b-ebf9-498c-98f8-8e3e485d6564',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_lightning_bolt.png?alt=media&token=8d0bbb64-f42c-4ed4-85c3-ae289910f5fb',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_slow.png?alt=media&token=f5d97ae9-5e88-452d-8d4b-442948d1ef7f',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fscrolls_fly.png?alt=media&token=52286e06-01ba-4323-b2b1-aa25ee4940e7',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgrimoire.png?alt=media&token=4eba93cd-c1ca-4aa1-b002-b501bd2fb5c6',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgrimoire.png?alt=media&token=4eba93cd-c1ca-4aa1-b002-b501bd2fb5c6',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwarrior.png?alt=media&token=ec819144-9ad3-4ea4-9aa8-4a068fd8a56e',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frouge.png?alt=media&token=20c7180d-775b-4ae3-82d4-9e1e9b4981b4',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmage.png?alt=media&token=44bb311d-4513-4b9f-a6ca-5a05c053e6f9',
        10100040603,
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
        10100040701,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings_barracks.png?alt=media&token=f5ce7e36-9069-4893-be60-de9e40691968',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbuildings_mage_tower.png?alt=media&token=c142a391-f6de-4d4a-b976-a9937c0d4d7d',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwallet.png?alt=media&token=a32df807-f912-4c4e-823f-91e3c5c71850',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbag.png?alt=media&token=e443c50c-7981-4a2b-8a48-63e9d00819a1',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsack.png?alt=media&token=9caeb5a2-5934-4642-96c8-f9eea88470f5',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmage.png?alt=media&token=44bb311d-4513-4b9f-a6ca-5a05c053e6f9',
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
