import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedContractManager1660436477050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        where chain_id = 1337
          and contract_type != 'NATIVE'
          and contract_status = 'ACTIVE'
          and contract_module = 'CORE'
        union all
        select distinct address,
                        'MYSTERY'::${ns}.contract_manager_type_enum as contract_type,
                        1                                              as from_block,
                        created_at,
                        updated_at
        from ${ns}.contract
        where chain_id = 1337
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
        where chain_id = 1337
          and contract_type != 'NATIVE'
          and contract_status = 'ACTIVE'
          and contract_module = 'LOTTERY';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract_manager RESTART IDENTITY CASCADE;`);
  }
}
