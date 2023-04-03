import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryExchangeErc721At1563804040230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_RANDOM_ADDR || wallet;
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
        301001,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301002,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301003,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301004,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301005,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301006,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305001,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305002,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305003,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305004,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305005,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305006,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305007,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305008,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306001,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306002,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306003,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306004,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        309001,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130901",
          item: [2, erc721ContractSimpleAddress, "130901", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        309002,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130901",
          item: [2, erc721ContractSimpleAddress, "130901", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
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
