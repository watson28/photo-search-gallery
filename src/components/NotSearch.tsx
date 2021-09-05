import React from 'react';
import Typography from '@material-ui/core/Typography';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

const NotSearch = () => {
	return (
    <Typography variant="h5" align="center" color="textSecondary" paragraph>
      <EmojiPeopleIcon /> Wellcome. This is a Photo Gallery powered by Unsplash API.
      <br /> To Begin, try searching for something using the field above.
    </Typography>
	)
}

export default NotSearch