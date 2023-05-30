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
        130404
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
        130507
      ), (
        130508
      ), (
        130509
      ), (
        130510
      ), (
        130511
      ), (
        130512
      ), (
        130513
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
        'Ruby',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fruby.png?alt=media&token=ea2bd694-cedd-410a-bf77-ff14c533b168',
        130101,
        0,
        1,
        'ACTIVE',
        1301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130102,
        'Emerald',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Femerald.png?alt=media&token=6cf54b86-c5fa-4483-8a59-d5086a47a7cd',
        130102,
        0,
        1,
        'ACTIVE',
        1301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130103,
        'Sapphire',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fsapphire.png?alt=media&token=296ae05f-8b67-4d4b-ae66-9fe82a5644e9',
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
        130404,
        'Pendant',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fpendant.png?alt=media&token=a130587b-550a-42bc-854d-ea845b10f1b0',
        130404,
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
        'Round Shield',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fshield_round.png?alt=media&token=ea628359-be3f-47d2-91e4-0a070dafca23',
        130506,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130507,
        'Heater Shield',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fshield_heater.png?alt=media&token=d3aa5afb-1eb2-42af-8202-3f5336c61727',
        130507,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130508,
        'Royal Shield',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fshield_royal.png?alt=media&token=862841e6-a834-44e8-8c62-69162d0d10da',
        130508,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130509,
        'Cloak',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcloak.png?alt=media&token=226d4184-ec9e-4649-8f5c-ab8ab1b3c89f',
        130509,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130510,
        'Robe',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Frobe.png?alt=media&token=128e6731-f2b5-4118-a235-58ada51f0b67',
        130510,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130511,
        'Mage Hat',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmages_hat.png?alt=media&token=ccef2e90-83e9-4a96-8eef-74fa9903dad9',
        130511,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130512,
        'Witch Hat',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fwitch_hat.png?alt=media&token=1605a712-a5d5-4313-a643-fd8ed1045f2c',
        130512,
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Faxe.png?alt=media&token=494c1f44-075d-42b1-ae0f-834e907359d2',
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
        'Magic Wand',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmagic_wand.png?alt=media&token=020bad44-8016-46bb-ba54-f276af2e369e',
        130606,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130607,
        'Two Hand Axe',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Faxe_two_hand.png?alt=media&token=2ad664f0-9104-44fc-9f31-cd287a68158c',
        130606,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130608,
        'Crossbow',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcrossbow.png?alt=media&token=e7de18c6-ae06-4bc0-9056-f300a1c04f2b',
        130606,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130609,
        'Spear',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fspear.png?alt=media&token=7de855b5-36d8-4fdf-bbc5-6352f39265c8',
        130606,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130700,
        'DNA (traits)(hidden)',
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
        'DNA',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmedal.png?alt=media&token=b5df04c0-45bb-441f-bfa2-d9c6816797f9',
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
