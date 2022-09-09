import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVehiclesTable1655691282002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'plate',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'brand',
            type: 'varchar',
          },
          {
            name: 'model',
            type: 'varchar',
          },
          {
            name: 'seats_number',
            type: 'numeric',
          },
          {
            name: 'document_status',
            type: 'boolean',
            isNullable: true
          },
          {
            name: 'locator_name',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'locator_address',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'locator_complement',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'locator_city',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'locator_state',
            type: 'varchar',
            isNullable: true
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vehicles');
  }
}
