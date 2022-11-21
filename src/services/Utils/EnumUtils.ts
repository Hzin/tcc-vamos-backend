import AppError from "../../errors/AppError";

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

  public static convertStringToEnum(string: string, enumObj: any, variableName: string, enumName: string): any {
    // const typedString = string as keyof typeof enumObj;
    // return typedString

    const typedString = enumObj[string as keyof typeof enumObj]

    if (!typedString) throw new AppError(`O parâmetro "${string}" não existe no Enum "${enumName}".`)
    return typedString
  }
}

export default EnumUtils;
