import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
            name: 'picture',
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

    await queryRunner.createForeignKey(
      'vehicles',
      new TableForeignKey({
        name: 'vehicles_user_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['user_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_user'], // coluna PK da primeira tabela
        referencedTableName: 'users', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('vehicles', 'vehicles_user_id_fk');

    await queryRunner.dropTable('vehicles');
  }
}
