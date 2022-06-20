import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveCpfAndCnpjFieldsFromUsersTable1655711281662
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', ['cnpj', 'cpf']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
}
