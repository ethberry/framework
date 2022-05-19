import { MigrationInterface, QueryRunner } from "typeorm";
import { View } from "typeorm/schema-builder/view/View";

import { ns } from "@framework/constants";

export class CreateUniTokenView1652962207575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const view = new View({
      name: `${ns}.uni_token`,
      expression: `
        SELECT row_number() OVER (PARTITION BY true)::INTEGER as id, *
        FROM (
          SELECT erc721_template.title          as title,
               erc721_template.description      as description,
               amount,
               erc721_template.image_url        as image_url,
               'ERC721'                         as token_type,
               count(erc721_token.id)::NUMERIC  as owned,
               owner
          FROM ${ns}.erc721_template
                LEFT JOIN ${ns}.erc721_token ON erc721_token.erc721_template_id = erc721_template.id
                LEFT JOIN ${ns}.erc721_collection ON erc721_template.erc721_collection_id = erc721_collection.id
          GROUP BY erc721_template.id, erc721_token.owner
          UNION ALL
          SELECT erc1155_token.title                         as title,
               erc1155_token.description                     as description,
               erc1155_token.amount                          as amount,
               erc1155_token.image_url                       as image_url,
               'ERC1155'                                     as token_type,
               coalesce(erc1155_balance.amount, 0)::NUMERIC  as owned,
               wallet                                        as owner
          FROM ${ns}.erc1155_token
                LEFT JOIN ${ns}.erc1155_balance ON erc1155_balance.erc1155_token_id = erc1155_token.id
                LEFT JOIN ${ns}.erc1155_collection ON erc1155_token.erc1155_collection_id = erc1155_collection.id
        ) as data;
      `,
    });

    await queryRunner.createView(view);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropView(`${ns}.uni_token`);
  }
}
