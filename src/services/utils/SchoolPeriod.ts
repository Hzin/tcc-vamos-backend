import { schoolPeriods } from "../../constants/schoolPeriods";
import AppError from "../../errors/AppError";

class Time {
  hour: number
  minutes: number

  constructor(timeString: string) {
    var t = timeString.split(":");
    this.hour = parseInt(t[0]);
    this.minutes = parseInt(t[1]);
  }

  private isBiggerThan(other: Time) {
    return (this.hour > other.hour) || (this.hour === other.hour) && (this.minutes > other.minutes);
  };

  private timeIsBetween(start: Time, end: Time, check: Time) {
    return (start.hour <= end.hour) ? check.isBiggerThan(start) && !check.isBiggerThan(end)
      : (check.isBiggerThan(start) && check.isBiggerThan(end)) || (!check.isBiggerThan(start) && !check.isBiggerThan(end));
  }

  public getSchoolPeriod(timeFrom: string, timeTo: string): schoolPeriods | undefined {
    // se o horário de início estiver entre 05:00 e 08:00
    // e se o horário de fim estiver entre 16:00 e 18:30
    if (this.timeIsBetween(new Time('05:00'), new Time('08:00'), new Time(timeFrom))
      && this.timeIsBetween(new Time('17:00'), new Time('18:00'), new Time(timeTo))) {
      return schoolPeriods.integral
    }

    // se o horário de término for antes das 14:00
    if (!new Time(timeTo).isBiggerThan(new Time('14:00'))) {
      return schoolPeriods.diurnal
    }

    // se o horário de término for antes das 18:00
    if (!new Time(timeTo).isBiggerThan(new Time('18:00'))) {
      return schoolPeriods.evening
    }

    // se o horário de término for antes das 23:00
    if (!new Time(timeTo).isBiggerThan(new Time('23:00'))) {
      return schoolPeriods.night
    }
  }

}

// export function CalculateSchoolPeriod(timeFrom: string, timeTo: string): schoolPeriods {
//   // se o horário de início começar antes das 07:00
//   if (!new Time(timeFrom).isBiggerThan(new Time('06:59'))) {
//     throw new AppError("O horário de início informado é inválido!")
//   }

//   // se o horário de término for depois das 20
//   if (new Time(timeTo).isBiggerThan(new Time('20:00'))) {
//     throw new AppError("O horário de início informado é inválido!")
//   }

//   // se o horário de início estiver entre 06:00 e 09:00
//   // e se o horário de fim estiver entre 16:00 e 18:30
//   if (timeIsBetween(new Time('07:00'), new Time('08:00'), new Time(timeFrom))
//   && timeIsBetween(new Time('11:30'), new Time('12:00'), new Time(timeTo))) {
//     return schoolPeriods.diurnal
//   }

//   // se o horário de início estiver entre 13:00 e 14:00
//   // e se o horário de fim estiver entre 18:00 e 19:30
//   if (timeIsBetween(new Time('13:00'), new Time('14:00'), new Time(timeFrom))
//   && timeIsBetween(new Time('18:00'), new Time('19:00'), new Time(timeTo))) {
//     return schoolPeriods.evening
//   }

//   // se o horário de início estiver entre 13:00 e 14:00
//   // e se o horário de fim estiver entre 18:00 e 19:30
//   if (timeIsBetween(new Time('18:00'), new Time('19:00'), new Time(timeFrom))
//   && timeIsBetween(new Time('18:00'), new Time('19:30'), new Time(timeTo))) {
//     return schoolPeriods.night
//   }

//   return schoolPeriods.integral
// }

