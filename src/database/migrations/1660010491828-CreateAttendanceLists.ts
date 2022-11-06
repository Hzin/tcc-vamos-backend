import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

// TODO, está sem model
export class CreateAttendanceLists1660010491828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attendance_lists',
        columns: [
          {
            name: 'id_list',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'trip_id',
            type: 'integer',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'is_return',
            type: 'boolean',
          },
          {
            name: 'date',
            type: 'date',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'attendance_lists',
      new TableForeignKey({
        name: 'attendance_lists_trip_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['trip_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_trip'], // coluna PK da tabela referenciada
        referencedTableName: 'trips', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'attendance_lists',
      new TableForeignKey({
        name: 'attendance_lists_user_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['user_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_user'], // coluna PK da tabela referenciada
        referencedTableName: 'users', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'attendance_lists',
      new TableIndex({
        name: 'attendance_lists_idx',
        columnNames: ['trip_id', 'user_id', 'is_return', 'date'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('attendance_lists');
    await queryRunner.dropForeignKey('attendance_lists', 'attendance_lists_trip_id_fk');
    await queryRunner.dropForeignKey('attendance_lists', 'attendance_lists_user_id_fk');
    await queryRunner.dropIndex('attendance_lists', 'attendance_lists_idx');
  }
}
