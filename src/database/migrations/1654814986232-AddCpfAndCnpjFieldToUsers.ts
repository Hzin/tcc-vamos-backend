import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCpfAndCnpjFieldToUsers1654814986232
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'cpf',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'cnpj',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', ['cnpj', 'cpf']);
  }
}
