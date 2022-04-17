import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
import TournamentColumns from '../models/TournamentColumns';

interface Columns {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
}

class UpdateTournamentColumnsService {
  public async execute(
    id_tournament: string,
    { column1, column2, column3, column4 }: Columns,
  ): Promise<TournamentColumns> {
    const tournamentsRepository = getRepository(Tournament);
    const tournamentColumnsRepository = getRepository(TournamentColumns);

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    const tournamentColumns = await tournamentColumnsRepository.findOne({
      where: { tournament },
    });

    if (!tournamentColumns) {
      throw new AppError('Tournament does not have columns.');
    }

    tournamentColumns.column1 = column1;
    tournamentColumns.column2 = column2;
    tournamentColumns.column3 = column3;
    tournamentColumns.column4 = column4;

    await tournamentColumnsRepository.save(tournamentColumns);

    return tournamentColumns;
  }
}

export default UpdateTournamentColumnsService;
