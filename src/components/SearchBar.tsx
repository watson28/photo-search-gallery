import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

interface SearchBarProps {
  query: string
  onChange(query: string): void
  loading: boolean
}

const SearchBar = (props: SearchBarProps) => {
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    props.onChange(event.target.value)
  }

	return (
    <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>
      <TextField
      label="Search for images"
      fullWidth value={props.query}
      onChange={handleQueryChange}
      InputProps={{
        startAdornment: (
        <InputAdornment position="start">
          <CircularProgress size={20} style={{ visibility: props.loading ? 'visible' : 'hidden'}} />
        </InputAdornment>
      )}}
    />
    </form>
	)
}

export default SearchBar