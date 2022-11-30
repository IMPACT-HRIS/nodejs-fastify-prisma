function swap<T = unknown>(array: T[], fromIndex: number, toIndex: number) {
  const temp = array[fromIndex] as T
  array[fromIndex] = array[toIndex] as T
  array[toIndex] = temp
}

function shuffle<T = unknown>(array: T[]) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    swap(array, currentIndex, randomIndex)
  }

  return array
}

export default shuffle
