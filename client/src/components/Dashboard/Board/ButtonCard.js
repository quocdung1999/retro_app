import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Axios from 'axios';

export default function ButtonCard(props) {
    const type = props.type;
    const boardId = props.boardId;
    let wentWell = [];
    let toImprove = [];
    let actionItems = [];
    wentWell = props.wentWell;
    toImprove = props.toImprove;
    actionItems = props.actionItems;

    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = async () => {
        try {
            setOpen(false);
            if (type === '1') {
                wentWell.push(content);
            }
            else if (type === '2') {
                toImprove.push(content);
            }
            else {
                actionItems.push(content);
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
            <Grid item sm={4}>
                <Button fullWidth variant="outlined" color="primary" onClick={handleClickOpen}>
                    +
      </Button>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogContent>
                        <DialogContentText>
                            Type the content
          </DialogContentText>
                        <TextField
                            autoFocus
                            onChange={(e) => setContent(e.target.value)}
                            margin="dense"
                            id="name"
                            label="Card's content"
                            type="name"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
          </Button>
                        <Button onClick={handleCreate} color="primary">
                            Add
          </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </>
    );
}