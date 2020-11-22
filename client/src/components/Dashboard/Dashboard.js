import React, { useContext, useState, useEffect } from 'react';
import NavBar from './NavBar.js';
import UserContext from '../../context/UserContext';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import BoardNameDialog from './BoardNameDialog.js';
import ButtonChangeBoard from './ButtonChangeBoard';
import { red } from '@material-ui/core/colors';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));


export default function Dashboard() {
    const classes = useStyles();
    const { userData, setUserData } = useContext(UserContext);
    const [boards, setBoards] = useState([]);
    const history = useHistory();
    useEffect(() => {

        const fetchData = async () => {
            try {

                const id = userData.user.id;
                const BoardRes = await Axios.get( '/api/boards/getBoards',
                    { headers: { "user-id": id } });
                let boardsArray = [];
                for (let i = 0; i < BoardRes.data.length; i++) {
                    let boardName = BoardRes.data[i].boardName;
                    let boardId = BoardRes.data[i]._id;
                    boardsArray.push({
                        boardId: boardId,
                        boardName: boardName
                    });

                }
                setBoards(boardsArray);
                setUserData({
                    token: userData.token,
                    user: userData.user,
                })
            }
            catch (err) {
                console.log(err.message);
            }

        }
        setTimeout(fetchData, 1500);
    }, [userData])
    return (
        <div className={classes.root}>
            <NavBar />
            <React.Fragment>
                <CssBaseline />
                <BoardNameDialog ></BoardNameDialog>
                <main>
                    {/* Hero unit */}
                    <div className={classes.heroContent}>
                        <Container maxWidth="sm">
                            <Typography component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
                                My boards
                            </Typography>
                        </Container>
                    </div>
                    <Container className={classes.cardGrid} maxWidth="md">
                        <Grid container spacing={2}>
                            {boards.map((current, index) => (
                                <Grid key={index} item xs={12} sm={6} md={4}>
                                    <Card className={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image="https://www.pngkit.com/png/full/215-2156909_black-board-blackboard.png"
                                            title="Image title"
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {current.boardName}
                                            </Typography>

                                        </CardContent>
                                        <CardActions>
                                            <Button href={'/board/' + current.boardId} variant='outlined' size="small" color="primary" justify="flex-end"
                                                onClick={() => {
                                                    localStorage.setItem('board-id', current.boardId);
                                                    return true;
                                                }}>
                                                View
                                    </Button>
                                            <ButtonChangeBoard boardId={current.boardId}></ButtonChangeBoard>
                                            <Button variant='outlined' size="small" color="primary" justify="flex-end"
                                                onClick={async () => {
                                                    await Axios.delete( '/api/boards/deleteBoard',
                                                        { headers: { "board-id": current.boardId } });
                                                }}>
                                                Delete
                                    </Button>
                                            <Button variant='outlined' size="small" color="primary" justify="flex-end"
                                                onClick={() => {

                                                    const link =  '/api/board/' + current.boardId;
                                                    var dummy = document.createElement("textarea");
                                                    document.body.appendChild(dummy);
                                                    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
                                                    dummy.value = link;
                                                    dummy.select();
                                                    document.execCommand("copy");
                                                    document.body.removeChild(dummy);
                                                }}>
                                                Link
                                    </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </main>

            </React.Fragment>
        </div>
    )
}