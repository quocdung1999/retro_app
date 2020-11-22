import React, { useContext, useEffect, useState } from 'react'
import { Grid, Button, Paper, CardContent, CardActions, Card } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Axios from 'axios';
import UserContext from '../../../context/UserContext.js';
import NavBar from '../NavBar';
import ButtonCard from './ButtonCard.js';
import ButtonChangeCard from './ButtonChangeCard.js';
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));
export default function Board() {
    const classes = useStyles();
    const { userData, setUserData } = useContext(UserContext);
    const [wentWell, setWentWell] = useState(null);
    const [toImprove, setToImprove] = useState(null);
    const [actionItems, setActionItems] = useState(null);
    

    useEffect(() => {
        const fetchData = async () => {
            localStorage.setItem('board-id', window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
            const boardId = localStorage.getItem('board-id');
            const BoardRes = await Axios.get( '/api/boards/getBoard',
                { headers: { "board-id": boardId } });
                //console.log(BoardRes);
            setWentWell(BoardRes.data.wentWell);
            setToImprove(BoardRes.data.toImprove);
            setActionItems(BoardRes.data.actionItems);
            setUserData({});
        }
        setTimeout(fetchData,1750);
    },[userData]);
    return (
        <div className={classes.root}>
            <NavBar />
            <div style={{ marginTop: "20px" }}>
                <Grid container spacing={3}>
                    <Grid item sm={4}>
                        <Paper className={classes.paper}>
                            <Typography style={{ color: "blue" }} component="h2" variant="h4" align="center" color="textPrimary" gutterBottom>
                                Went Well
                    </Typography>
                        </Paper>

                    </Grid>
                    <Grid item sm={4}>
                        <Paper className={classes.paper}>
                            <Typography style={{ color: "blue" }} component="h2" variant="h4" align="center" color="textPrimary" gutterBottom>
                                To Improve
                    </Typography>
                        </Paper>
                    </Grid>
                    <Grid item sm={4}>
                        <Paper className={classes.paper}>
                            <Typography style={{ color: "blue" }} component="h2" variant="h4" align="center" color="textPrimary" gutterBottom>
                                Action Items
                </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {wentWell !== null && <ButtonCard type='1' boardId={localStorage.getItem('board-id')} wentWell={wentWell}
                        toImprove={toImprove} actionItems={actionItems} ></ButtonCard>}
                    {wentWell !== null && <ButtonCard type='2' boardId={localStorage.getItem('board-id')} wentWell={wentWell}
                        toImprove={toImprove} actionItems={actionItems} ></ButtonCard>}
                    {wentWell !== null && <ButtonCard type='3' boardId={localStorage.getItem('board-id')} wentWell={wentWell}
                        toImprove={toImprove} actionItems={actionItems} ></ButtonCard>}
                </Grid>

                <Grid container spacing={3}>
                    <Grid item sm={4}>
                        {wentWell !== null && wentWell.map((current, index) => (
                            <div style={{ marginTop: "10px" }}>
                                <Card key={index} className={classes.card} >

                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {current}
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        {wentWell !== null && < ButtonChangeCard type='1' index={index}
                                            boardId={localStorage.getItem('board-id')} wentWell={wentWell}
                                            toImprove={toImprove} actionItems={actionItems} />}
                                        <Button size="small" variant='outlined' color="primary" justify="flex-end"
                                            onClick={async () => {
                                                let newWentWell = [...wentWell];
                                                console.log('Do la: ',newWentWell);
                                                newWentWell.splice(index, 1);
                                                const boardId = localStorage.getItem('board-id');
                                                const data = { boardId, wentWell:newWentWell, toImprove, actionItems };
                                                
                                                const res = await Axios.post( '/api/boards/saveBoard', data);
                                            }}>
                                            Delete
                                    </Button>
                                    </CardActions>
                                </Card>
                            </div>
                        ))}
                    </Grid>

                    <Grid item sm={4}>
                        {toImprove !== null && toImprove.map((current, index) => (
                            <div style={{ marginTop: "10px" }}>
                                <Card key={index} className={classes.card}>

                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {current}
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        {toImprove !== null && < ButtonChangeCard type='2' index={index}
                                            boardId={localStorage.getItem('board-id')} wentWell={wentWell}
                                            toImprove={toImprove} actionItems={actionItems} />}
                                        <Button size="small" variant='outlined' color="primary" justify="flex-end"
                                            onClick={async () => {
                                                let newToImprove = [...toImprove];
                                                newToImprove.splice(index, 1);
                                                const boardId = localStorage.getItem('board-id');
                                                const data = { boardId, wentWell, toImprove:newToImprove, actionItems };
                                                const res = await Axios.post( '/api/boards/saveBoard', data);
                                            }}>
                                            Delete
                                    </Button>
                                    </CardActions>
                                </Card>
                            </div>
                        ))}
                    </Grid>

                    <Grid item sm={4}>
                        {actionItems !== null && actionItems.map((current, index) => (
                            <div style={{ marginTop: "10px" }}>
                                <Card key={index} className={classes.card}>

                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {current}
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        {actionItems !== null && < ButtonChangeCard type='3' index={index}
                                            boardId={localStorage.getItem('board-id')} wentWell={wentWell}
                                            toImprove={toImprove} actionItems={actionItems} />}
                                        <Button size="small" variant='outlined' color="primary" justify="flex-end"
                                            onClick={async () => {

                                                let newActionItems = [...actionItems];
                                                newActionItems.splice(index, 1);
                                                const boardId = localStorage.getItem('board-id');
                                                const data = { boardId, wentWell, toImprove, actionItems:newActionItems };
                                                const res = await Axios.post( '/api/boards/saveBoard', data);
                                                
                                            }}>
                                            Delete
                                    </Button>
                                    </CardActions>
                                </Card>
                            </div>
                        ))}
                    </Grid>
                </Grid>
            </div>
        </div >
    )
}
