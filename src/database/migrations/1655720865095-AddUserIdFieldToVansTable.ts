import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserIdFieldToVansTable1655720865095
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'vans',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('vans', 'user_id');
  }
}
