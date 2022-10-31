import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

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
            name: 'itinerary_id',
            type: 'integer',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'latitude_address',
            type: 'numeric',
          },
          {
            name: 'longitude_address',
            type: 'numeric',
          },
          {
            name: 'payment_status',
            type: 'boolean',
          },
          {
            name: 'start_date',
            type: 'date',
            default: 'now()',
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true
          },
          {
            name: 'is_single',
            type: 'boolean',
          }
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'passengers',
      new TableForeignKey({
        name: 'passengers_itinerary_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['itinerary_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_itinerary'], // coluna PK da tabela referenciada
        referencedTableName: 'itineraries', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'passengers',
      new TableForeignKey({
        name: 'passengers_user_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['user_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_user'], // coluna PK da tabela referenciada
        referencedTableName: 'users', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'passengers',
      new TableIndex({
        name: 'passengers_itinerary_user_idx',
        columnNames: ['itinerary_id', 'user_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('passengers');
    await queryRunner.dropForeignKey(
      'passengers',
      'passengers_itinerary_id_fk',
    );
    await queryRunner.dropForeignKey('passengers', 'passengers_user_id_fk');
    await queryRunner.dropIndex('passengers', 'passengers_itinerary_user_idx');
  }
}
