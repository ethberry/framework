import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class CreateAsset1563804000100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // 1 [1-9] - network (1-besu, 2-binance, 3-mainnet, 4-polygon)
    // 2 [01-09] - section (01-hierarchy, 02-mechanics, 03-ecommerce, 04-achievements)
    // 3 [000001-999999] - type (010X000--template or 020X0000-mechanics)

    const table = new Table({
      name: `${ns}.asset`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
      ],
    });

    await queryRunner.createTable(table, true);

    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 50000000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset`);
  }
}
