import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import UserContext from '../../context/UserContext';
import Grid from '@material-ui/core/Grid';
import Axios from 'axios';
import ErrorNotice from '../Others/ErrorNotice';

export default function BoardNameDialog() {

  const { userData, setUserData } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [boardName, setBoardName] = useState();
  const [error, setError] = useState();
  const handleClickOpen = () => {
    setOpen(true);
    setError(undefined);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    try {
      setOpen(false);
      const user_id = userData.user.id;
      const newBoard = { user_id, boardName };
      const boardRes = await Axios.post( '/api/boards/createBoard', newBoard);
      if (boardRes) {
        setUserData({
          token: userData.token,
          user: userData.user,
          boardName: boardName,
          boardId: boardRes.data._id,
        });
      }
    }
    catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <Grid container justify='flex-end' md={11}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Create board
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText>
              Type the name of the board you want to create
          </DialogContentText>
            <TextField
              autoFocus
              onChange={(e) => setBoardName(e.target.value)}
              margin="dense"
              id="name"
              label="Board Name"
              type="name"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
            <Button onClick={handleCreate} color="primary">
              Create
          </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Grid container justify='center'>
        {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
      </Grid>
    </div>
  );
}

