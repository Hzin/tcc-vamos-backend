import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVanDocumentsTable1655692498005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vanDocuments',
        columns: [
          {
            name: 'id_vanDocuments',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vanLocator_id',
            type: 'uuid',
          },
          {
            name: 'document_status',
            type: 'varchar',
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
    await queryRunner.dropTable('vanDocuments');
  }
}
