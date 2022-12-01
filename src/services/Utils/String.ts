class StringUtils {
  public static getFilenameFromPath(path: string): string {
    const stringSplit = path.split('/')

    const filename = stringSplit.at(-1)
    if (!filename) { return path }
    return filename
  }

  private static escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  
  public static replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }
}

export default StringUtils;
