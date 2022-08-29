import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameCarModelsTableToCarBrands1661212542739 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.renameTable('carModels', 'carBrands')

      await queryRunner.renameColumn('carBrands', 'id_model', 'id_brand')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.renameTable('carBrands', 'carModels')

      await queryRunner.renameColumn('carBrands', 'id_brand', 'id_model')
    }
}
