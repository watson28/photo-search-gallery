import React from 'react';
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem';
import Alert from '@material-ui/lab/Alert'
import usePhotoFetcher from './hooks/usePhotoFetcher';

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
