import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsersSearching1652672860580 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'users_searching',
              columns: [
                {
                    name: 'id_search',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'user_id',
                    type: 'uuid'
                },
                {
                  name: 'latitude_from',
                  type: 'numeric',
                },
                {
                  name: 'longitude_from',
                  type: 'numeric',
                },
                {
                  name: 'latitude_to',
                  type: 'numeric',
                },
                {
                  name: 'longitude_to',
                  type: 'numeric',
                },
                {
                  name: 'address_to',
                  type: 'varchar',
                },
                {
                  name: 'created_at',
                  type: 'timestamp',
                  default: 'now()',
                }
              ],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_searching');
    }

}
