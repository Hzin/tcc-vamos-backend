import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRoutes1659404395471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'routes',
        columns: [
          {
            name: 'id_route',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'van_plate',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'float',
          },
          {
            name: 'days_of_week',
            type: 'bit',
            isNullable: true,
          },
          {
            name: 'specific_day',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'estimated_departure_time',
            type: 'time',
          },
          {
            name: 'estimated_arrival_time',
            type: 'time',
          },
          {
            name: 'available_seats',
            type: 'integer',
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
      'routes',
      new TableForeignKey({
        name: 'routes_van_plate_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['van_plate'], // coluna que vai virar FK
        referencedColumnNames: ['plate'], // coluna PK da primeira tabela
        referencedTableName: 'vans', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'routes',
      new TableIndex({
        name: 'routes_idx',
        columnNames: ['van_plate', 'days_of_week', 'specific_day', 'estimated_departure_time'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('routes');
    await queryRunner.dropForeignKey('routes', 'routes_van_plate_fk');
    await queryRunner.dropIndex('routes', 'routes_idx');
  }
}
