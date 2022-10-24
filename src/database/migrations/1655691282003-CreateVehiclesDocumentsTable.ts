import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateVehiclesDocumentsTable1655691282003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vehicles_documents',
        columns: [
          {
            name: 'id_vehicles_documents',
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
            name: 'document_type',
            type: 'varchar',
          },
          {
            name: 'path',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'status',
            type: 'varchar',
            default: false
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
      'vehicles_documents',
      new TableForeignKey({
        name: 'vehicles_documents_vehicle_plate_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['vehicle_plate'], // coluna que vai virar FK
        referencedColumnNames: ['plate'], // coluna PK da tabela referenciada
        referencedTableName: 'vehicles', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'vehicles_documents',
      'vehicles_documents_vehicle_plate_fk',
    );

    await queryRunner.dropTable('vehicles_documents');
  }
}
