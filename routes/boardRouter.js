const router = require('express').Router();
const { findOne, findByIdAndDelete } = require('../models/boardModel.js');
const Board = require('../models/boardModel.js');


router.get("/getBoards",async (req,res) => {
    try{
        const user_id = req.header("user-id");
        //console.log("La "+user_id);
        await Board.find({user_id:user_id},(error,boards) => {
            if (boards.data !== Array(0))
        {
            //console.log("yes");
            res.json(boards);
        }
        else
        {
            res.status(400).json({
                msg:"No boards were created",
            });
        }
        });
        
    }
    catch (err)
    {
        res.status(500).json({
            error: err.message,
        })
    }
});

router.post('/changeBoardName',async (req,res) => {
    try{
        const {boardId,boardName} = req.body;
        const update = {boardName:boardName};
        await Board.findByIdAndUpdate(boardId,update,(err,result) => {
            res.json(result);
        })
    }
    catch (err)
    {
        console.log(err.message);
    }
})
router.delete('/deleteBoard', async (req,res) => {
    try {
        const boardId = req.header('board-id');
        await Board.findByIdAndDelete(boardId);
    } 
    catch (err) 
    {
        console.log(err.message);
    }
})

router.post('/createBoard',async (req,res) => {
    try{
        let {user_id,boardName} = req.body;
        const existingBoard = await Board.findOne({
            user_id:user_id,
            boardName:boardName,
        });
        if (existingBoard)
        {
            return res.status(400).json({
                msg: "A board with this name already exists",
            })
        }
        const wentWell = [];
        const toImprove = [];
        const actionItems = [];
        const newBoard = new Board({
            user_id,
            boardName,
            wentWell,
            toImprove,
            actionItems
        });
        const saveBoard = await newBoard.save();
        res.json(saveBoard);
    }
    catch(error)
    {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get('/getBoard', async (req,res) => {
    try {
        const boardId = req.header("board-id");
        await Board.findById(boardId,(error,result) => {
            //console.log("Working!!!!");
            res.json(result);
        });
        
    }
    catch (err)
    {
        console.log(err.message);
    }
});

router.post('/saveBoard',async (req,res) => {
    try {
        let {boardId,wentWell,toImprove,actionItems} = req.body;
        const update = {
            wentWell:wentWell,
            toImprove:toImprove,
            actionItems:actionItems
        }
        await Board.findByIdAndUpdate(boardId,update,(error,existingBoard) => {
            res.json(existingBoard);
        });
    }
    catch(err)
    {
        
        res.status(500).json({
            error: err.message,
        })
    }
})

module.exports = router;