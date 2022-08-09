import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateDestinations1660009323138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'destinations',
              columns: [
                {
                  name: 'id_destination',
                  type: 'integer',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                  name: 'route_id',
                  type: 'integer',
                },
                {
                  name: 'name',
                  type: 'varchar',
                },
                {
                  name: 'latitude',
                  type: 'numeric',
                },
                {
                  name: 'longitude',
                  type: 'numeric',
                }
              ],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('destinations');
    }

}
