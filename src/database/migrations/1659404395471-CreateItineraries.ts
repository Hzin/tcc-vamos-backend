import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateItineraries1659404395471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'itineraries',
        columns: [
          {
            name: 'id_itinerary',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'vehicle_plate',
            type: 'varchar',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'days_of_week',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'specific_day',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'estimated_departure_time_going',
            type: 'time',
          },
          {
            name: 'estimated_arrival_time_going',
            type: 'time',
          },
          {
            name: 'estimated_departure_time_return',
            type: 'time',
          },
          {
            name: 'estimated_arrival_time_return',
            type: 'time',
          },
          {
            name: 'available_seats',
            type: 'integer',
          },
          {
            name: 'monthly_price',
            type: 'float',
          },
          {
            name: 'daily_price',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'accept_daily',
            type: 'boolean',
          },
          {
            name: 'itinerary_nickname',
            type: 'varchar',
          },
          {
            name: 'estimated_departure_address',
            type: 'varchar',
          },
          {
            name: 'departure_latitude',
            type: 'numeric',
          },
          {
            name: 'departure_longitude',
            type: 'numeric',
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
      'itineraries',
      new TableForeignKey({
        name: 'itineraries_vehicle_plate_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['vehicle_plate'], // coluna que vai virar FK
        referencedColumnNames: ['plate'], // coluna PK da primeira tabela
        referencedTableName: 'vehicles', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'itineraries',
      new TableIndex({
        name: 'itineraries_idx',
        columnNames: [
          'vehicle_plate',
          'days_of_week',
          'specific_day',
          'estimated_departure_time',
          'is_active',
        ],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('itineraries');
    await queryRunner.dropForeignKey('itineraries', 'itineraries_vehicle_plate_fk');
    await queryRunner.dropIndex('itineraries', 'itineraries_idx');
  }
}
