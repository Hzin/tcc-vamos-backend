import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDocumentAndDocumentTypeFieldsToUsersTable1655711315251
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'document',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'document_type',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', ['document_type', 'document']);
  }
}
