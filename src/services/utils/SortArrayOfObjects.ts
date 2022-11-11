export const SortArrayOfObjects = <T>(data: T[], keyToSort: keyof T, direction: 'ascending' | 'descending' | 'none', ) => {
  if (direction === 'none') {
    return data
  }

  const compare = (objectA: T, objectB: T) => {
    const valueA = objectA[keyToSort]
    const valueB = objectB[keyToSort]

    if (valueA === valueB) {
      return 0
    }

    if (valueA > valueB) {
      return direction === 'ascending' ? 1 : -1
    } else {
      return direction === 'ascending' ? -1 : 1
    }
  }

  return data.slice().sort(compare)
}
