import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRouteHistoric1660010491828 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'route_historic',
              columns: [
                {
                  name: 'id_historic',
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
                  name: 'user_id',
                  type: 'uuid',
                },
                {
                  name: 'date',
                  type: 'date',
                },
              ],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('route_historic');
    }

}
