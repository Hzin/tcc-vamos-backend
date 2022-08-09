import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePassengers1660010452826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'passengers',
              columns: [
                {
                  name: 'id_passenger',
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
                }
              ],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('passengers');
    }

}
