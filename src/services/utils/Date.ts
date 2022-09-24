
const timezoneOffset = 3

class DateUtils {
  public static convertTimestampToDate(timestamp: number): string {
    const date = new Date(timestamp)

    const dateString = date.toLocaleString("en-US", { year: '2-digit', month: '2-digit', day: '2-digit' })

    return dateString
  }

  public static convertDateStringToTimestamp(date: string): number {
    const convertedDate = new Date(date)
    convertedDate.setHours(convertedDate.getHours() - timezoneOffset);

    return convertedDate.getTime()
  }

  public static getCurrentTimestamp(): number {
    const currentDate = new Date()
    currentDate.setHours(currentDate.getHours() - timezoneOffset);

    return currentDate.getTime()
  }

  public static getCurrentDate(): string {
    return this.convertTimestampToDate(this.getCurrentTimestamp())
  }

  public static convertIonicDateToJSDate(ionicDate: string): string {
    // ionic date example: 2022-10-16 (YYYY-MM-DD)
    // correct date example: 10/16/2001 (MM/DD/YYYY)

    const ionicDateSplit = ionicDate.split('-')
    const ionicDateCorrected = `${ionicDateSplit[1]}/${ionicDateSplit[2]}/${ionicDateSplit[0]}`

    return ionicDateCorrected
  }

  public static convertIonicDateToTimestamp(ionicDate: string): number {
    const ionicDateCorrected = this.convertIonicDateToJSDate(ionicDate)

    return this.convertDateStringToTimestamp(ionicDateCorrected)
  }

  public static getTodaysDayOfWeekAsNumber(): number {
    return new Date().getDay() + 1
  }

  public static getTodaysDayOfWeekAsNumberForSplitComparison(): number {
    return new Date().getDay()
  }

  public static convertDayOfWeekNumberToString(dayOfWeek: number): string {
    enum DayOfWeekString {
      'Domingo',       // 0
      'Segunda-feira', // 1
      'Terça-feira',   // 2
      'Quarta-feira',  // 3
      'Quinta-feira',  // 4
      'Sexta-feira',   // 5
      'Sábado'         // 6
    }

    return DayOfWeekString[dayOfWeek]
  }
}

export default DateUtils;
