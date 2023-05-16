import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedTemplateErc721At1563804000230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        130101
      ), (
        130102
      ), (
        130103
      ), (
        130401
      ), (
        130402
      ), (
        130403
      ), (
        130501
      ), (
        130502
      ), (
        130503
      ), (
        130504
      ), (
        130505
      ), (
        130506
      ), (
        130601
      ), (
        130602
      ), (
        130603
      ), (
        130604
      ), (
        130605
      ), (
        130606
      ), (
        130701
      ), (
        130801
      ), (
        130802
      ), (
        130803
      ), (
        130901
      ), (
        130902
      ), (
        130903
      ), (
        230101
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
        130101,
        'Physical resistance',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_physical_resistance.png?alt=media&token=d30e8e4c-c07d-4471-9e42-a195658eca80',
        130101,
        0,
        1,
        'ACTIVE',
        1301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130102,
        'Magic resistance',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_magic_resistance.png?alt=media&token=b0e82f13-56d2-44b5-8809-6172887f3d4d',
        130102,
        0,
        1,
        'ACTIVE',
        1301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130103,
        'Poison resistance',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frune_of_poison_resistance.png?alt=media&token=794b45a4-f0e7-4bfe-a50b-32339d26d774',
        130103,
        0,
        1,
        'ACTIVE',
        1301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130401,
        'Necklace',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fnecklace.png?alt=media&token=c9a9f9e6-8485-4210-bca8-3f456563f386',
        130401,
        0,
        1,
        'ACTIVE',
        1304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130402,
        'Gold ring',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgold_ring.png?alt=media&token=8f69a9a5-5339-417b-9962-ed0e1d792db7',
        130402,
        0,
        1,
        'ACTIVE',
        1304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130403,
        'Silver ring',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsilver_ring.png?alt=media&token=c0da9303-7581-4ba8-8a94-c411b16e6402',
        130403,
        0,
        1,
        'ACTIVE',
        1304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130501,
        'Cuirass',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcuirass.png?alt=media&token=0edc2d42-b484-4ab5-91f3-b33e507c8213',
        130501,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130502,
        'Helmet',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fhelmet.png?alt=media&token=a18af018-2558-4c2a-acf5-d4b3ca62da34',
        130502,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130503,
        'Cuisses',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcuisses.png?alt=media&token=21705e71-3fcf-4615-968c-dfcbbaf32ccb',
        130503,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130504,
        'Gauntlets',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgauntlets.png?alt=media&token=137824ce-50fb-44d4-9a9c-73cabb3e5429',
        130504,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130505,
        'Sabatons',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsabatons.png?alt=media&token=b3d5a034-1c55-4d44-b1b5-d9c42d16f516',
        130505,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130506,
        'Shield',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fshield.png?alt=media&token=2c20c670-f1e0-4770-bf15-d6583391edc2',
        130506,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130601,
        'Sword',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsword.png?alt=media&token=9b372208-ab9d-4a76-af41-b645f1f2c389',
        130601,
        0,
        4,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130602,
        'Mace',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmace.png?alt=media&token=44e6352c-b612-412f-994b-d88c2d4a5faf',
        130602,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130603,
        'Axe',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Faxe.png?alt=media&token=c194bb91-523e-4b40-895a-6f67e1c5903b',
        130603,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130604,
        'Bow',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbow.png?alt=media&token=747926e5-e592-4a79-9e96-c908a23fe3a0',
        130604,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130605,
        'Staff',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fstaff.png?alt=media&token=1ff30bc5-00cc-4f88-a75a-b1f011dd2e77',
        130605,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130606,
        'Wand',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmagic_wand.png?alt=media&token=41a5bbe4-2dbb-4f76-8e9c-cd569a1b1ba8',
        130606,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130700,
        'AXIE (genes)(hidden)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        '${(1024 * 1024 * 1024 * 4).toString()}',
        1,
        'HIDDEN',
        1307,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130701,
        'Axie',
        '${simpleFormatting}',
        '${imageUrl}',
        130701,
        0,
        1,
        'ACTIVE',
        1307,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130801,
        'Medal',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmedal.png?alt=media&token=7d82f5d2-19eb-4352-b457-84005289a42d',
        130801,
        0,
        1,
        'ACTIVE',
        1308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130802,
        'Cup',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcup.png?alt=media&token=8fa13e26-d0ce-46cd-abff-3f89ac968505',
        130802,
        0,
        1,
        'ACTIVE',
        1308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130803,
        'Diploma',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fdiploma.png?alt=media&token=fac363d8-88e8-43ba-a649-a461b8055cae',
        130803,
        0,
        1,
        'ACTIVE',
        1308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130901,
        'Horse',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fhorse.png?alt=media&token=6baddae0-6927-45be-b74e-c8d9c5a146a3',
        130901,
        0,
        1,
        'ACTIVE',
        1309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130902,
        'Boat',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fboat.png?alt=media&token=8d6a0ea3-63d2-4508-8f2c-77fb0c73ea4c',
        130902,
        0,
        1,
        'ACTIVE',
        1309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130903,
        'Gyrocopter',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgyrocopter.png?alt=media&token=da3ad406-456a-4208-b5a7-003c40bc859a',
        130903,
        0,
        1,
        'ACTIVE',
        1309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        230101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        230101,
        0,
        1,
        'ACTIVE',
        2301,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
