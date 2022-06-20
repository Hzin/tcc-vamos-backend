import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddFKVanLocatorIdToVanDocumentsTable1655692624024
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'vanDocuments',
      new TableForeignKey({
        name: 'VanLocatorVanDocuments', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['vanLocator_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_vanLocator'], // coluna PK da primeira tabela
        referencedTableName: 'vanLocator', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'vanDocuments',
      'VanLocatorVanDocuments',
    );
  }
}
