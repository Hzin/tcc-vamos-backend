import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1617210132141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id_user',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '14',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'birth_date',
            type: 'date',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'avatar_image',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'bio',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'star_rating',
            type: 'numeric',
            precision: 3,
            scale: 2,
            isNullable: true
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
