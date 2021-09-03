import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem';
import Pagination from '@material-ui/lab/Pagination';
import { Basic as Photo } from 'unsplash-js/dist/methods/photos/types'

interface PhotoGalleryProps {
  photos: Photo[]
  currentPage: number
  totalPages: number
  onPageChange(newPage: number): void
}

const PhotoGallery = (props: PhotoGalleryProps) => {
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    props.onPageChange(value)
  }

  if (props.photos.length === 0) return null
	return (
    <>
      <ImageList rowHeight={200} cols={5}>
        {props.photos.map(p => (
          <ImageListItem key={p.id} cols={1}>
            <img src={p.urls.thumb} alt={p.alt_description || ''} />
          </ImageListItem>
        ))}
      </ImageList>
      <Pagination count={props.totalPages} page={props.currentPage} onChange={handlePageChange} />
    </>
	)
}

export default PhotoGallery