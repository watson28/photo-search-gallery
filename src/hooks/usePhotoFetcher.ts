import { useRef, useState, useEffect, useCallback } from 'react'
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
  const [loading, setLoading] = useState(false)
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

    setLoading(true)
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
    }).finally(() => setLoading(false))

    return () => abortController.abort()
  }, [debouncedQuery, currentPage])

  const updatePagination = useCallback((page: number) => {
    setCurrentPage(Math.min(totalPages, page))
  }, [totalPages])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  return { 
    photos,
    errors,
    totalPages,
    currentPage,
    loading,
    updatePagination,
    clearErrors
  }
}

export default usePhotoFetcher