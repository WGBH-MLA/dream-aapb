import { useInstantSearch } from 'react-instantsearch-core'

export function Error() {
  const { error } = useInstantSearch({ catchError: true })

  if (error) {
    throw error
  }
  return <></>
}
