import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther, ZeroAddress, ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryWaitListAt1663047650350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const waitListAddr = process.env.WAITLIST_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR || wallet;
    const erc998ContractSimpleAddress = process.env.ERC998_SIMPLE_ADDR || wallet;
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR || wallet;

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        created_at,
        updated_at
      ) VALUES (
        1700001,
        '${waitListAddr}',
        '${ZeroHash}',
        'WaitListRewardClaimed',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 1,
          items: [
            {
              tokenType: "NATIVE",
              token: ZeroAddress,
              tokenId: "0",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1700002,
        '${waitListAddr}',
        '${ZeroHash}',
        'WaitListRewardClaimed',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 2,
          items: [
            {
              tokenType: "ERC20",
              token: erc20TokenSimpleAddress,
              tokenId: "0",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1700003,
        '${waitListAddr}',
        '${ZeroHash}',
        'WaitListRewardClaimed',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 3,
          items: [
            {
              tokenType: "ERC721",
              token: erc721ContractSimpleAddress,
              tokenId: "1",
              amount: "1",
            },
          ],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1700004,
        '${waitListAddr}',
        '${ZeroHash}',
        'WaitListRewardClaimed',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 4,
          items: [
            {
              tokenType: "ERC998",
              token: erc998ContractSimpleAddress,
              tokenId: "1",
              amount: "1",
            },
          ],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1700005,
        '${waitListAddr}',
        '${ZeroHash}',
        'WaitListRewardClaimed',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 5,
          items: [
            {
              tokenType: "ERC1155",
              token: erc1155ContractSimpleAddress,
              tokenId: "1",
              amount: "1000",
            },
          ],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1700006,
        '${waitListAddr}',
        '${ZeroHash}',
        'WaitListRewardClaimed',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 6,
          items: [
            {
              tokenType: "NATIVE",
              token: ZeroAddress,
              tokenId: "0",
              amount: WeiPerEther.toString(),
            },
            {
              tokenType: "ERC20",
              token: erc20TokenSimpleAddress,
              tokenId: "0",
              amount: WeiPerEther.toString(),
            },
            {
              tokenType: "ERC721",
              token: erc721ContractSimpleAddress,
              tokenId: "1",
              amount: "1",
            },
            {
              tokenType: "ERC998",
              token: erc998ContractSimpleAddress,
              tokenId: "1",
              amount: "1",
            },
            {
              tokenType: "ERC1155",
              token: erc1155ContractSimpleAddress,
              tokenId: "1",
              amount: "1000",
            },
          ],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1700007,
        '${waitListAddr}',
        '${ZeroHash}',
        'WaitListRewardClaimed',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 2,
          items: [
            {
              tokenType: "ERC20",
              token: erc20TokenSimpleAddress,
              tokenId: "0",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1700008,
        '${waitListAddr}',
        '${ZeroHash}',
        'WaitListRewardClaimed',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 2,
          items: [
            {
              tokenType: "ERC20",
              token: erc20TokenSimpleAddress,
              tokenId: "0",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
