import { useRef, useState, useEffect } from 'react'
import { Basic as Photo } from 'unsplash-js/dist/methods/photos/types'
import useDebounceState from './useDebounceState'
import { createApi } from 'unsplash-js';

let unsplashApi: ReturnType<typeof createApi>
const getUnsplashApiInstance = () => {
  if (!unsplashApi) {
    unsplashApi = createApi({
      // TODO: use proxy to secure access key
      // apiUrl: 'https://mywebsite.com/unsplash-proxy',
      accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY || '',
    })
  }

  return unsplashApi
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const PAGE_SIZE = 10

const usePhotoFetcher = (query: string) => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedQuery = useDebounceState(query, 500)
  const prevDebouncedQuery = usePrevious(debouncedQuery)

  useEffect(() => {
    const queryChanged = prevDebouncedQuery !== debouncedQuery
    if (queryChanged) return setCurrentPage(1)
  // Disables linting rule because it's not needed to watch for changes in prevDebouncedQuery.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    if (!debouncedQuery) return

    const abortController = new AbortController()
    getUnsplashApiInstance().search.getPhotos(
      { query: debouncedQuery, page: currentPage, perPage: PAGE_SIZE },
      { signal: abortController.signal }
    ).then(
      apiResponse => {
        if (apiResponse.type === 'error') {
          setErrors(apiResponse.errors)
          setPhotos([])
          setTotalPages(0)
        }
        else if (apiResponse.response) {
          setErrors([])
          setPhotos(apiResponse.response.results)
          setTotalPages(apiResponse.response.total_pages)
        }
      }
    ).catch(error => {
      if (error.name === 'AbortError') return
      setErrors(['An unexpected error has occurred.'])
    })

    return () => abortController.abort()
  }, [debouncedQuery, currentPage])

  const updatePagination = (page: number) => {
    setCurrentPage(Math.min(totalPages, page))
  }

  return { photos, errors, totalPages, currentPage, updatePagination }
}

export default usePhotoFetcher