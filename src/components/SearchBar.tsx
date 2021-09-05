import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'
import ImageSearchIcon from '@material-ui/icons/ImageSearch'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

interface SearchBarProps {
  className?: string
  query?: string
  onChange?(query: string): void
  loading?: boolean
}

const useStyle = makeStyles((theme: Theme) => {
  return createStyles({
    loadingWrapper: {
      position: 'relative'
    },
    progress: {
      position: 'absolute',
      top: -4,
      left: -5
    }
  })
})

const SearchBar = (props: SearchBarProps) => {
  const classes = useStyle()
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (props.onChange) props.onChange(event.target.value)
  }

	return (
    <form
      className={props.className}
      noValidate
      autoComplete="off"
      onSubmit={event => event.preventDefault()}
    >
      <TextField
      id="search-bar-text-field"
      label="Search for images"
      variant="outlined"
      fullWidth value={props.query}
      onChange={handleQueryChange}
      InputProps={{
        startAdornment: (
        <InputAdornment position="start">
          <div className={classes.loadingWrapper}>
            <ImageSearchIcon />
            { props.loading && <CircularProgress className={classes.progress} size={32} thickness={2} />}
          </div>
        </InputAdornment>
      )}}
    />
    </form>
	)
}

export default SearchBar