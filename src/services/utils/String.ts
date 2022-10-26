class StringUtils {
  public static getFilenameFromPath(path: string): string {
    const stringSplit = path.split('/')

    console.log(stringSplit)

    const filename = stringSplit.at(-1)
    if (!filename) { return path }
    return filename
  }
}

export default StringUtils;
