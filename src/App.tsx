import React from 'react';
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem';
import Alert from '@material-ui/lab/Alert'
import { createApi } from 'unsplash-js';
import { useState } from 'react';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import useDebounceState from './hooks/useDebounceState';

const browserApi = createApi({
  // TODO: use proxy to secure access key
  // apiUrl: 'https://mywebsite.com/unsplash-proxy',
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY || '',
});


const usePhotoFetcher = (query: string) => {
  const abortControllerRef = React.useRef(new AbortController())
  const [photos, setPhotos] = useState<Basic[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedQuery = useDebounceState(query, 500)
  const PAGE_SIZE = 10

  React.useEffect(() => {
    abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()
    browserApi.search.getPhotos(
      { query: debouncedQuery, page: currentPage, perPage: PAGE_SIZE },
      { signal: abortControllerRef.current.signal }
    ).then(
      apiResponse => {
        if (apiResponse.type === 'error') setErrors(apiResponse.errors)
        else if (apiResponse.response) {
          setPhotos(apiResponse.response.results)
          setTotalPages(apiResponse.response.total_pages)
        }
      }
    )
  }, [debouncedQuery, currentPage])

  return { photos, errors, totalPages }
}

function App() {
  const [query, setQuery] = React.useState<string>('')
  const { photos, errors } = usePhotoFetcher(query)

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)
  }

  const handleCloseErrors = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    // setErrors([])
  }

  return (
    <Container>
      <Snackbar open={Boolean(errors.length)} autoHideDuration={6000} onClose={handleCloseErrors}>
        <Alert onClose={handleCloseErrors} severity="error">
          <ul>
            {errors.map(error => (<li key={error}>{error}</li>))}
          </ul>
        </Alert>
      </Snackbar>
      <form noValidate autoComplete="off">
        <TextField label="Search for images" fullWidth value={query} onChange={handleQueryChange} />
      </form>
      { photos ?
        <ImageList rowHeight={200} cols={5}>
          {photos.map(p => (
            <ImageListItem key={p.id} cols={1}>
              <img src={p.urls.thumb} alt={p.alt_description || ''} />
            </ImageListItem>
          ))}
        </ImageList>
        : null
      }
    </Container>
  );
}

export default App;
