import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem';
import Pagination from '@material-ui/lab/Pagination';
import { Basic as UnsplashPhoto } from 'unsplash-js/dist/methods/photos/types'
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import Typography from '@material-ui/core/Typography';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { useCallback } from 'react';

export type Photo = Pick<UnsplashPhoto, 'id' | 'alt_description' | 'description'>
  & { user: Pick<UnsplashPhoto['user'], 'name'> }
  & { urls: Pick<UnsplashPhoto['urls'], 'thumb'> }

export interface PhotoGalleryProps {
  photos: Photo[]
  currentPage: number
  totalPages: number
  onPageChange?(newPage: number): void
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
  const onPageChange = props.onPageChange
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    if (onPageChange) onPageChange(value)
  }, [onPageChange])

  if (props.photos.length === 0) return (
    <Typography variant="h5" align="center" color="textSecondary" paragraph>
      <SentimentVeryDissatisfiedIcon /> Your search did not match any photo in Unsplash.
       <br />Here are some suggestions:  Make sure that all words are spelled correctly;
       try different or more general keywords.
    </Typography>
  )
	return (
    <>
      <ImageList rowHeight={200} cols={5}>
        {props.photos.map(p => (
          <ImageListItem key={p.id} cols={1} data-testid="image-list-photo">
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
        data-testid="photo-gallery--pagination"
      />
    </>
	)
}

export default PhotoGallery