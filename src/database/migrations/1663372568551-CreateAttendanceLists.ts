import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { attendanceListStatus } from '../../constants/attendanceListStatus';
import Utils from '../../services/utils/Utils';

export class CreateAttendanceLists1663372568551 implements MigrationInterface {
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
            name: 'passenger_id',
            type: 'integer',
          },
          {
            name: 'is_return',
            type: 'boolean',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'status',
            type: 'enum',
            enum: Utils.convertEnumValuesToStringArray(attendanceListStatus),
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
        name: 'attendance_lists_passenger_id_fk', // nome da FK, serve para referenciar numa exclusão pelo QueryRunner se necessário
        columnNames: ['passenger_id'], // coluna que vai virar FK
        referencedColumnNames: ['id_passenger'], // coluna PK da tabela referenciada
        referencedTableName: 'passengers', // nome da tabela que possui a PK
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'attendance_lists',
      new TableIndex({
        name: 'attendance_lists_idx',
        columnNames: ['trip_id', 'passenger_id', 'is_return', 'date'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('attendance_lists');
    await queryRunner.dropForeignKey('attendance_lists', 'attendance_lists_trip_id_fk');
    await queryRunner.dropForeignKey('attendance_lists', 'attendance_lists_passenger_id_fk');
    await queryRunner.dropIndex('attendance_lists', 'attendance_lists_idx');
  }
}
