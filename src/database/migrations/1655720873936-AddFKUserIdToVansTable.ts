import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddFKUserIdToVansTable1655720873936 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'vans',
      new TableForeignKey({
        name: 'UserIdVan', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['user_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_user'], // coluna PK da primeira tabela
        referencedTableName: 'users', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'vans',
      'UserIdVan',
    );
  }
}
