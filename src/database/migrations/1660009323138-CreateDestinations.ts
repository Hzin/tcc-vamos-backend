import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
            name: 'itinerary_id',
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
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'destinations',
      new TableForeignKey({
        name: 'destinations_itinerary_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['itinerary_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_itinerary'], // coluna PK da tabela referenciada
        referencedTableName: 'itineraries', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('destinations');
    await queryRunner.dropForeignKey('destinations', 'destinations_itinerary_id_fk');
  }
}
