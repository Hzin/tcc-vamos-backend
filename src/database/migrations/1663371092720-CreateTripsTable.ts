import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTripsTable1663371092720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trips',
        columns: [
          {
            name: 'id_trip',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'itinerary_id',
            type: 'uuid',
          },
          {
            name: 'nickname',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'date',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: true,
            default: 'PENDING'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'trips',
      new TableForeignKey({
        name: 'trips_itinerary_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['itinerary_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_itinerary'], // coluna PK da tabela referenciada
        referencedTableName: 'itineraries', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('trips', 'trips_itinerary_id_fk');
    await queryRunner.dropTable('trips');
  }
}
