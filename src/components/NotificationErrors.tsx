import Snackbar  from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

interface NotificationErrorsProps {
  errors: string[]
  onClose?(): void
}

const NotificationErrors = (props: NotificationErrorsProps) => {
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return
    if (props.onClose) props.onClose()
  }

	return (
    <Snackbar open={Boolean(props.errors.length)} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        <ul>
          {props.errors.map(error => (<li key={error}>{error}</li>))}
        </ul>
      </Alert>
    </Snackbar>
	)
}

export default NotificationErrors