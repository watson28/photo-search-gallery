import React from 'react';
import Container from '@material-ui/core/Container'
import usePhotoFetcher from './hooks/usePhotoFetcher';
import useDebounceState from './hooks/useDebounceState';
import SearchBar from './components/SearchBar';
import PhotoGallery from './components/PhotoGallery';
import NotificationErrors from './components/NotificationErrors';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      margin: theme.spacing(5),
    },
    searchBar: {
      marginBottom: theme.spacing(5)
    }
  })
})
const PAGE_SIZE = 20
const QUERY_DEBOUNCE_DELAY_MS = 500

function App() {
  const classes = useStyles();
  const [query, setQuery] = React.useState<string>('')
  const debouncedQuery = useDebounceState(query, QUERY_DEBOUNCE_DELAY_MS)
  const {
    photos,
    errors,
    currentPage,
    totalPages,
    loading,
    updatePagination,
    clearErrors
  } = usePhotoFetcher(debouncedQuery, PAGE_SIZE)

  return (
    <div className={classes.root}>
      <div>
        <Container>
          <NotificationErrors errors={errors} onClose={clearErrors} />
          <SearchBar className={classes.searchBar} query={query} onChange={setQuery} loading={loading} />
          <PhotoGallery 
            photos={photos}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={updatePagination} 
          />
        </Container>
      </div>
    </div>
  );
}

export default App;
