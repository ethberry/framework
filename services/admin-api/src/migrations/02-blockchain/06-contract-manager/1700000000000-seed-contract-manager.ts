import { MigrationInterface, QueryRunner } from "typeorm";

import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractManager1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`
        insert into ${ns}.contract_manager(address, contract_type, from_block, created_at, updated_at)
        select address,
               CASE
                   when (contract_type = 'ERC20') then 'ERC20_TOKEN'::${ns}.contract_manager_type_enum
                   when (contract_type = 'ERC721') then 'ERC721_TOKEN'::${ns}.contract_manager_type_enum
                   when (contract_type = 'ERC998') then 'ERC998_TOKEN'::${ns}.contract_manager_type_enum
                   when (contract_type = 'ERC1155') then 'ERC1155_TOKEN'::${ns}.contract_manager_type_enum
                   end as contract_type,
               1       as from_block,
               created_at,
               updated_at
        from ${ns}.contract
        where chain_id = ${testChainId}
          and contract_type != 'NATIVE'
          and contract_status = 'ACTIVE'
          and contract_module = 'HIERARCHY'
        union all
        select distinct address,
                        'MYSTERY'::${ns}.contract_manager_type_enum as contract_type,
                        1                                              as from_block,
                        created_at,
                        updated_at
        from ${ns}.contract
        where chain_id = ${testChainId}
          and contract_type != 'NATIVE'
          and contract_status = 'ACTIVE'
          and contract_module = 'MYSTERY'
        union all
        select address,
               'LOTTERY'::${ns}.contract_manager_type_enum as contract_type,
               1                                           as from_block,
               created_at,
               updated_at
        from ${ns}.contract
        where chain_id = ${testChainId}
          and contract_type != 'NATIVE'
          and contract_status = 'ACTIVE'
          and contract_module = 'LOTTERY';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract_manager RESTART IDENTITY CASCADE;`);
  }
}
