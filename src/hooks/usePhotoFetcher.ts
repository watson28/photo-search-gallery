import { useRef, useState, useEffect } from 'react'
import { Basic as Photo } from 'unsplash-js/dist/methods/photos/types'
import useDebounceState from './useDebounceState'
import { createApi } from 'unsplash-js';

let unsplashApi : ReturnType<typeof createApi>
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

const usePhotoFetcher = (query: string) => {
  const abortControllerRef = useRef(new AbortController())
  const [photos, setPhotos] = useState<Photo[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedQuery = useDebounceState(query, 500)
  const PAGE_SIZE = 10

  useEffect(() => {
    abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()
    getUnsplashApiInstance().search.getPhotos(
      { query: debouncedQuery, page: currentPage, perPage: PAGE_SIZE },
      { signal: abortControllerRef.current.signal }
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
    )
  }, [debouncedQuery, currentPage])

  return { photos, errors, totalPages }
}

export default usePhotoFetcher