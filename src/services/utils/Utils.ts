class Utils {
  public static getEnumLength(enumObj: any): number {
    return Object.keys(enumObj).length
  }

  public static convertEnumValuesToStringArray(enumObj: any): string[] {
    return Object.keys(enumObj).map(key => enumObj[key]);
  }
}

export default Utils;
