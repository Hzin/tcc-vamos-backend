import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNeighborhoodsServed1660009211327
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'neighborhoods_served',
        columns: [
          {
            name: 'id_neighborhood',
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
    await queryRunner.dropTable('neighborhoods_served');
  }
}
