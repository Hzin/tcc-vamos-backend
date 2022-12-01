import { EnumType } from 'typescript';
import { TripStatus } from '../../enums/TripStatus';
import AppError from '../../errors/AppError';

class EnumUtils {
  public static getEnumLength(enumObj: any): number {
    return Object.keys(enumObj).length;
  }

  public static convertEnumValuesToStringArray(enumObj: any): string[] {
    return Object.keys(enumObj).map(key => enumObj[key]);
  }

  public static stringIsInEnum(string: string, enumObj: any): boolean {
    return Object.values(enumObj).includes(string);
  }

  public static getTripStatusEnumPropertyByValue(tripStatusStr: string): TripStatus {
    const keys = Object.keys(TripStatus);
    const values = Object.values(TripStatus);
    let valuesAsString: string[] = [];
    values.forEach((element) => {
      valuesAsString.push('' + element);
    });

    if (keys.length !== values.length) throw new AppError(`O enum "TripStatus" está inválido.`);

    // procurando string pelas keys do Enum
    const indexKeys = keys.indexOf(tripStatusStr);
    const enumPropertyByKeys = values.at(indexKeys)
    console.log('indexKeys: ' + indexKeys)
    console.log('enumPropertyByKeys: ' + enumPropertyByKeys)

    if (indexKeys !== -1 && enumPropertyByKeys) return enumPropertyByKeys

    // procurando string pelas values do Enum
    const indexValues = valuesAsString.indexOf(tripStatusStr);
    const enumPropertyByValues = values.at(indexValues);
    console.log('indexValues: ' + indexValues)
    console.log('enumPropertyByValues: ' + enumPropertyByValues)

    if (indexValues !== -1 && enumPropertyByValues) return enumPropertyByValues

    // se não encontrou...
    throw new AppError(`O parâmetro "${tripStatusStr}" não existe no Enum TripStatus.`)
  }
}

export default EnumUtils;
