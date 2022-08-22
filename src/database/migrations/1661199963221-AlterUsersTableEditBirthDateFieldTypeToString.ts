import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterUsersTableEditBirthDateFieldTypeToString1661199963221 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('users', 'birth_date')

      await queryRunner.addColumn('users', new TableColumn(
        {
          name: 'birth_date',
          type: 'varchar',
          isNullable: true
        },
      ))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('users', 'birth_date')

      await queryRunner.addColumn('users', new TableColumn(
        {
          name: 'birth_date',
          type: 'date',
          isNullable: true
        },
      ))
    }
}
