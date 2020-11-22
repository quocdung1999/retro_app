import React, { useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Axios from 'axios';

export default function ButtonChangeCard(props) {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const type = props.type;
    const boardId = props.boardId;
    const index = props.index;
    let wentWell = [];
    let toImprove = [];
    let actionItems = [];
    wentWell = props.wentWell;
    toImprove = props.toImprove;
    actionItems = props.actionItems;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = async () => {
        try {
            setOpen(false);
            if (type === '1') {
                wentWell.splice(index, 1, content);
            }
            else if (type === '2') {
                toImprove.splice(index, 1, content);
            }
            else {
                actionItems.splice(index, 1, content);
            }
            const data = { boardId, wentWell, toImprove, actionItems };
            const boardRes = await Axios.post( '/api/boards/saveBoard', data);
        }
        catch (err) {
            console.log(err.message);
        }


    }

    return (
        <>
            <Button size="small" variant="outlined" color="primary" onClick={handleClickOpen}>
                Change
      </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <DialogContentText>
                        Type the new content
          </DialogContentText>
                    <TextField
                        autoFocus
                        onChange={(e) => setContent(e.target.value)}
                        margin="dense"
                        id="name"
                        label="Card's new content"
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