import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterUsersTableAddLastnameColumn1653437653433 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'lastname',
            type: 'varchar',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'lastname')
    }
}
