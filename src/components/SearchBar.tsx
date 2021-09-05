import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

interface SearchBarProps {
  className?: string
  query?: string
  onChange?(query: string): void
  loading?: boolean
}

const SearchBar = (props: SearchBarProps) => {
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
          <CircularProgress
            size={20}
            variant={props.loading ? undefined : 'determinate'}
            value={props.loading ? undefined : 100}
          />
        </InputAdornment>
      )}}
    />
    </form>
	)
}

export default SearchBar