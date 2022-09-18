import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

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
            name: 'itinerary_id',
            type: 'integer',
          },
          {
            name: 'latitude',
            type: 'numeric',
          },
          {
            name: 'longitude',
            type: 'numeric',
          },
          {
            name: 'address',
            type: 'varchar',
          }
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'neighborhoods_served',
      new TableForeignKey({
        name: 'neighborhoods_served_itinerary_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['itinerary_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_itinerary'], // coluna PK da tabela referenciada
        referencedTableName: 'itineraries', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'neighborhoods_served',
      new TableIndex({
        name: 'neighborhoods_served_idx',
        columnNames: [
          'itinerary_id',
          'latitude',
          'longitude',
        ],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('neighborhoods_served', 'neighborhoods_served_idx');
    await queryRunner.dropForeignKey('neighborhoods_served', 'neighborhoods_served_itinerary_id_fk');
    await queryRunner.dropTable('neighborhoods_served');
  }
}
