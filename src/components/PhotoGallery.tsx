import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem';
import Pagination from '@material-ui/lab/Pagination';
import { Basic as Photo } from 'unsplash-js/dist/methods/photos/types'
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, createStyles, Theme } from '@material-ui/core';

interface PhotoGalleryProps {
  photos: Photo[]
  currentPage: number
  totalPages: number
  onPageChange(newPage: number): void
}

const useStyle = makeStyles((theme: Theme) => {
  return createStyles({
    pagination: {
      marginTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center'
    },
  })
})

const PhotoGallery = (props: PhotoGalleryProps) => {
  const classes = useStyle()
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
            <ImageListItemBar
              title={<span>{p.user.name}</span>}
              subtitle={(
                <Tooltip title={p.description || ''} placement="bottom-start">
                  <span>{p.description || ''}</span>
                </Tooltip>
              )}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Pagination
        className={classes.pagination}
        color="primary"
        count={props.totalPages}
        page={props.currentPage}
        onChange={handlePageChange}
      />
    </>
	)
}

export default PhotoGallery