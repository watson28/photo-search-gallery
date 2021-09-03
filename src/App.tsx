import React from 'react';
import Container from '@material-ui/core/Container'
import usePhotoFetcher from './hooks/usePhotoFetcher';
import SearchBar from './components/SearchBar';
import PhotoGallery from './components/PhotoGallery';
import NotificationErrors from './components/NotificationErrors';

function App() {
  const [query, setQuery] = React.useState<string>('')
  const {
    photos,
    errors,
    currentPage,
    totalPages,
    loading,
    updatePagination,
    clearErrors
  } = usePhotoFetcher(query)

  return (
    <Container>
      <NotificationErrors errors={errors} onClose={clearErrors} />
      <SearchBar query={query} onChange={setQuery} loading={loading} />
      <PhotoGallery 
        photos={photos}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={updatePagination} 
      />
    </Container>
  );
}

export default App;
