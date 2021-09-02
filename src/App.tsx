import React from 'react';
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem';
import Pagination from '@material-ui/lab/Pagination';
import Alert from '@material-ui/lab/Alert'
import usePhotoFetcher from './hooks/usePhotoFetcher';

function App() {
  const [query, setQuery] = React.useState<string>('')
  const { photos, errors, currentPage, totalPages, updatePagination } = usePhotoFetcher(query)

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)
  }
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    updatePagination(value)
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
      { photos.length > 0 ?
        <>
          <ImageList rowHeight={200} cols={5}>
            {photos.map(p => (
              <ImageListItem key={p.id} cols={1}>
                <img src={p.urls.thumb} alt={p.alt_description || ''} />
              </ImageListItem>
            ))}
          </ImageList>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </>
        : null
      }
    </Container>
  );
}

export default App;
