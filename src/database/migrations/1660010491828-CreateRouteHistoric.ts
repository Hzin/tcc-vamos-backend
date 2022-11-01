import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

// TODO, está sem model
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
            name: 'itinerary_id',
            type: 'integer',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'is_return',
            type: 'boolean',
          },
          {
            name: 'date',
            type: 'date',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'route_historic',
      new TableForeignKey({
        name: 'route_historic_itinerary_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['itinerary_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_itinerary'], // coluna PK da tabela referenciada
        referencedTableName: 'itineraries', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'route_historic',
      new TableForeignKey({
        name: 'route_historic_user_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['user_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_user'], // coluna PK da tabela referenciada
        referencedTableName: 'users', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'route_historic',
      new TableIndex({
        name: 'itinerary_historic_idx',
        columnNames: ['itinerary_id', 'user_id', 'is_return', 'date'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('route_historic');
    await queryRunner.dropForeignKey('route_historic', 'route_historic_itinerary_id_fk');
    await queryRunner.dropForeignKey('route_historic', 'route_historic_user_id_fk');
    await queryRunner.dropIndex('route_historic', 'itinerary_historic_idx');
  }
}
