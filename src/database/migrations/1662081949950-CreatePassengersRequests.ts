import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePassengersRequests1662081949950
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'passengers_requests',
        columns: [
          {
            name: 'id_request',
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
            name: 'status',
            type: 'enum',
            enum: ['pending', 'accepted', 'rejected'],
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'passengers_requests',
      new TableForeignKey({
        name: 'passengers_requests_itinerary_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['itinerary_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_itinerary'], // coluna PK da tabela referenciada
        referencedTableName: 'itineraries', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'passengers_requests',
      new TableForeignKey({
        name: 'passengers_requests_user_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['user_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_user'], // coluna PK da tabela referenciada
        referencedTableName: 'users', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'passengers_requests',
      new TableIndex({
        name: 'passengers_requests_idx',
        columnNames: ['itinerary_id', 'user_id', 'status', 'created_at'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('passengers_requests');
    await queryRunner.dropForeignKey(
      'passengers_requests',
      'passengers_requests_itinerary_id_fk',
    );
    await queryRunner.dropForeignKey(
      'passengers_requests',
      'passengers_requests_user_id_fk',
    );
    await queryRunner.dropIndex(
      'passengers_requests',
      'passengers_requests_idx',
    );
  }
}
