import React, { useState,useContext} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Axios from 'axios';
import UserContext from '../../context/UserContext';

export default function ButtonChangeCard(props) {
    const [open, setOpen] = useState(false);
    const [boardName, setBoardName] = useState('');
    const {userData,setUserData} = useContext(UserContext);
    const boardId = props.boardId;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = async () => {
        try {
            setOpen(false);
            const data = { boardId, boardName};
            const boardRes = await Axios.post( '/api/boards/changeBoardName', data);
        }
        catch (err) {
            console.log(err.message);
        }


    }

    return (
        <>
            <Button size="small" variant="outlined" color="primary" justify='flex-end' onClick={handleClickOpen}>
                Change
      </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <DialogContentText>
                        Type the new name
          </DialogContentText>
                    <TextField
                        autoFocus
                        onChange={(e) => setBoardName(e.target.value)}
                        margin="dense"
                        id="name"
                        label="Board's new name"
                        type="name"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleChange} color="primary">
                        Change
          </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}