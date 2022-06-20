import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddFKVanDocumentToVanDocumentsTable1655696991836
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'vanDocuments',
      new TableForeignKey({
        name: 'VanDocumentVanDocuments', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['document_van'], // coluna que vai virar FK
        referencedColumnNames: ['document'], // coluna PK da primeira tabela
        referencedTableName: 'vanDocuments', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('vanDocuments', 'VanDocumentVanDocuments');
  }
}
