import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import HomeIcon from '@material-ui/core/SvgIcon'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
//import IconButton from '@material-ui/core/IconButton';
//import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import UserContext from '../../context/UserContext';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function NavBar() {
    const { userData, setUserData } = useContext(UserContext);
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [displayName, setDisplayName] = useState(localStorage.getItem('user-name'));
    const logOut = () => {
        setUserData({
            token: undefined,
            user: undefined,
        });
        localStorage.setItem("auth-token", "");
        localStorage.setItem("user-name", "");
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = async () => {
        
        let token = localStorage.getItem("auth-token");
        const tokenRes = await Axios.post
            ( "/api/users/tokenIsValid", null, {
                headers: { "x-auth-token": token },
            });
        if (tokenRes.data) {
            const userRes = await Axios.get( "/api/users/", { headers: { "x-auth-token": token } });
            const userId = userRes.data.id;
            const data = {userId,displayName};
            await Axios.post('/api/users/changeDisplayName',data)
            .then(async () => {
                const result = await Axios.post('/api/users/changeDisplayName',data);
                localStorage.setItem('user-name',result.data.displayName);
            });
            setUserData({
                token,
                user: userRes.data,
            })
            }
        setOpen(false);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <HomeIcon fontSize="large" />
                    <Typography variant="h6" className={classes.title}>
                        Welcome, {localStorage.getItem("user-name") !== "" ? localStorage.getItem("user-name") : 'Guest'}
                    </Typography>
                    {localStorage.getItem("user-name") !== "" && <Grid> <Button color="inherit" onClick={handleClickOpen}>
                        Change info
                    </Button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogContent>
                                <DialogContentText>
                                    Type the new display name
                    </DialogContentText>
                                <TextField
                                    autoFocus
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    margin="dense"
                                    id="name"
                                    label="New Display Name"
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
                    </Grid>}
                    {localStorage.getItem("user-name") !== "" && <Button color="inherit" onClick={logOut} href='/'>
                        Logout
                    </Button>}
                </Toolbar>
            </AppBar>
        </div>
    );
}