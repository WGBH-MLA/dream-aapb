const ORIGINAL = 0
const MULTIMATCH = 1
const DISMAX = 2
const POSH = 3
const BOOSTY = 4

const SearchModes = {
  // top bool should containing normal all fields array
  ORIGINAL: ORIGINAL,
  // just use multimatch at top level thats it
  MULTIMATCH: MULTIMATCH,
  // top level dismax with normal all fields array
  DISMAX: DISMAX,
  // top bool should containing dismax with noisy fields, and bool should with high value fields
  POSH: POSH,
  // top bool with ultra boost title query, bool with regular boost good fields query, and bool with unboosted bad fields query
  BOOSTY: BOOSTY
}

export { SearchModes }
