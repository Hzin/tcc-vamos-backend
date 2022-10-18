import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSocialInformationTable1653956028190
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'socialInformation',
        columns: [
          {
            name: 'id_social',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'whatsapp',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'facebook',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'telegram',
            type: 'varchar',
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'socialInformation',
      new TableForeignKey({
        name: 'SocialInformationUser', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['user_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_user'], // coluna PK da primeira tabela
        referencedTableName: 'users', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('socialInformation', 'SocialInformationUser');

    await queryRunner.dropTable('socials');
  }
}
