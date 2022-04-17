import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import TournamentParticipant from '../models/TournamentParticipant';
import TournamentColumns from '../models/TournamentColumns';
import Tournament from '../models/Tournament';

interface Colocations {
  tournament_id: string;
  tournament_name: string;
  tournament_game: string;
  tournament_description: string;
  colocation: 'Participante' | 'Semifinalista' | 'Vencedor';
}

class FindUserColocationsService {
  public async execute(id_user: string): Promise<Colocations[]> {
    const tournamentParticipantRepository = getRepository(
      TournamentParticipant,
    );
    const usersRepository = getRepository(User);
    const tournamentColumnsRepository = getRepository(TournamentColumns);
    const tournamentsRepository = getRepository(Tournament);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const tournamentsUserIsParticipating = await tournamentParticipantRepository.find(
      {
        where: { user, user_accepted_invite: true },
      },
    );

    if (tournamentsUserIsParticipating.length == 0) {
      throw new AppError('User is not in any tournament.', 200);
    }

    const tournamentsUserIsParticipatingFiltered = tournamentsUserIsParticipating.map(
      element => {
        return element.tournament;
      },
    );

    let endedTournamentsUserIsParticipating: TournamentColumns[][] = [];

    const promises1 = tournamentsUserIsParticipatingFiltered.map(
      async tournament => {
        return await tournamentColumnsRepository.find({
          where: { tournament, tournament_ended: true },
        });
      },
    );

    endedTournamentsUserIsParticipating = await Promise.all(promises1);

    if (endedTournamentsUserIsParticipating.length == 0) {
      throw new AppError('User is not in any tournament that has ended.', 200);
    }

    let userColocations: Colocations[] = [];

    endedTournamentsUserIsParticipating.map(tournamentColumns => {
      tournamentColumns.map(tournamentColumns2 => {
        if (tournamentColumns2.column3.includes(user.name)) {
          userColocations.push({
            tournament_id: tournamentColumns2.tournament.id_tournament,
            tournament_name: tournamentColumns2.tournament.name,
            tournament_game: tournamentColumns2.tournament.game,
            tournament_description: tournamentColumns2.tournament.description,
            colocation: 'Vencedor',
          });

          return;
        }

        if (tournamentColumns2.column2.includes(user.name)) {
          userColocations.push({
            tournament_id: tournamentColumns2.tournament.id_tournament,
            tournament_name: tournamentColumns2.tournament.name,
            tournament_game: tournamentColumns2.tournament.game,
            tournament_description: tournamentColumns2.tournament.description,
            colocation: 'Semifinalista',
          });

          return;
        }

        if (tournamentColumns2.column1.includes(user.name)) {
          userColocations.push({
            tournament_id: tournamentColumns2.tournament.id_tournament,
            tournament_name: tournamentColumns2.tournament.name,
            tournament_game: tournamentColumns2.tournament.game,
            tournament_description: tournamentColumns2.tournament.description,
            colocation: 'Participante',
          });

          return;
        }
      });
    });

    return userColocations;
  }
}

export default FindUserColocationsService;
