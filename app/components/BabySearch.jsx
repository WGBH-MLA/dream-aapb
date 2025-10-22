import { useEffect, useState } from 'react'

import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  CurrentRefinements,
  ClearRefinements,
  ToggleRefinement,
  Pagination,
  HitsPerPage,
  RangeInput,
  Stats
} from 'react-instantsearch';

const [query, setQuery] = useState("")

export default function BabySearch(props){
  return (
    <div>
      <input type="text" name="baby-search" onChange={ (e) => setQuery(e.target.value) } />
    </div>
  )
}


