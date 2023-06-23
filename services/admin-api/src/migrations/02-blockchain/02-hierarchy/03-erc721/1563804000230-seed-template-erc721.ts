import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc721At1563804000230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        101030101
      ), (
        101030102
      ), (
        101030103
      ), (
        101030401
      ), (
        101030402
      ), (
        101030403
      ), (
        101030404
      ), (
        101030405
      ), (
        101030501
      ), (
        101030502
      ), (
        101030503
      ), (
        101030504
      ), (
        101030505
      ), (
        101030506
      ), (
        101030507
      ), (
        101030508
      ), (
        101030509
      ), (
        101030510
      ), (
        101030511
      ), (
        101030512
      ), (
        101030513
      ), (
        101030601
      ), (
        101030602
      ), (
        101030603
      ), (
        101030604
      ), (
        101030605
      ), (
        101030606
      ), (
        101030607
      ), (
        101030608
      ), (
        101030609
      ), (
        101030610
      ), (
        101030701
      ), (
        101030801
      ), (
        101030802
      ), (
        101030803
      ), (
        101030901
      ), (
        101030902
      ), (
        101030903
      ), (
        101030904
      ), (
        101030905
      ), (
        101038001
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fruby.png?alt=media&token=ea2bd694-cedd-410a-bf77-ff14c533b168',
        101030101,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Femerald.png?alt=media&token=6cf54b86-c5fa-4483-8a59-d5086a47a7cd',
        101030102,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsapphire.png?alt=media&token=296ae05f-8b67-4d4b-ae66-9fe82a5644e9',
        101030103,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fnecklace.png?alt=media&token=c9a9f9e6-8485-4210-bca8-3f456563f386',
        101030401,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fring_gold.png?alt=media&token=1bbfef44-721f-4137-a471-9d1154846590',
        101030402,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fring_silver.png?alt=media&token=b0d12d95-23cd-4f45-a890-532fb3e6ce55',
        101030403,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fpendant.png?alt=media&token=a130587b-550a-42bc-854d-ea845b10f1b0',
        101030404,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fring_copper.png?alt=media&token=693d2379-b0a5-4bed-aea1-b6e8e019c09e',
        101030405,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcuirass.png?alt=media&token=0edc2d42-b484-4ab5-91f3-b33e507c8213',
        101030501,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fhelmet.png?alt=media&token=a18af018-2558-4c2a-acf5-d4b3ca62da34',
        101030502,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcuisses.png?alt=media&token=21705e71-3fcf-4615-968c-dfcbbaf32ccb',
        101030503,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgauntlets.png?alt=media&token=137824ce-50fb-44d4-9a9c-73cabb3e5429',
        101030504,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsabatons.png?alt=media&token=b3d5a034-1c55-4d44-b1b5-d9c42d16f516',
        101030505,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fshield_round.png?alt=media&token=ea628359-be3f-47d2-91e4-0a070dafca23',
        101030506,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fshield_heater.png?alt=media&token=d3aa5afb-1eb2-42af-8202-3f5336c61727',
        101030507,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fshield_royal.png?alt=media&token=862841e6-a834-44e8-8c62-69162d0d10da',
        101030508,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcloak.png?alt=media&token=226d4184-ec9e-4649-8f5c-ab8ab1b3c89f',
        101030509,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frobe.png?alt=media&token=128e6731-f2b5-4118-a235-58ada51f0b67',
        101030510,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmages_hat.png?alt=media&token=ccef2e90-83e9-4a96-8eef-74fa9903dad9',
        101030511,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwitchs_hat.png?alt=media&token=f2f51fd2-1ad0-406a-9d11-5342078b8a40',
        101030512,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fvikings_helmet.png?alt=media&token=89a71d83-a3b6-499b-b876-8cebc10262cd',
        101030513,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsword.png?alt=media&token=9b372208-ab9d-4a76-af41-b645f1f2c389',
        101030601,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmace.png?alt=media&token=44e6352c-b612-412f-994b-d88c2d4a5faf',
        101030602,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Faxe.png?alt=media&token=494c1f44-075d-42b1-ae0f-834e907359d2',
        101030603,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fbow.png?alt=media&token=747926e5-e592-4a79-9e96-c908a23fe3a0',
        101030604,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fstaff.png?alt=media&token=1ff30bc5-00cc-4f88-a75a-b1f011dd2e77',
        101030605,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmagic_wand.png?alt=media&token=020bad44-8016-46bb-ba54-f276af2e369e',
        101030606,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Faxe_two_hand.png?alt=media&token=2ad664f0-9104-44fc-9f31-cd287a68158c',
        101030607,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcrossbow.png?alt=media&token=e7de18c6-ae06-4bc0-9056-f300a1c04f2b',
        101030608,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fspear.png?alt=media&token=7de855b5-36d8-4fdf-bbc5-6352f39265c8',
        101030609,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmjolnir.png?alt=media&token=f66bf9fc-7b59-40ad-bbec-67645f5e9326',
        101030610,
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
        101030701,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmedal.png?alt=media&token=b5df04c0-45bb-441f-bfa2-d9c6816797f9',
        101030801,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcup.png?alt=media&token=8fa13e26-d0ce-46cd-abff-3f89ac968505',
        101030802,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fdiploma.png?alt=media&token=fac363d8-88e8-43ba-a649-a461b8055cae',
        101030803,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fhorse.png?alt=media&token=6baddae0-6927-45be-b74e-c8d9c5a146a3',
        101030901,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fboat.png?alt=media&token=8d6a0ea3-63d2-4508-8f2c-77fb0c73ea4c',
        101030902,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fgyrocopter.png?alt=media&token=da3ad406-456a-4208-b5a7-003c40bc859a',
        101030903,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwitchs_broom.png?alt=media&token=843fa2ec-f87a-42e5-b850-2e07f0d4ff33',
        101030904,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmagic_carpet.png?alt=media&token=54386a4e-4fce-4e9a-a80c-204119965f63',
        101030905,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcuisses.png?alt=media&token=21705e71-3fcf-4615-968c-dfcbbaf32ccb',
        101038001,
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
