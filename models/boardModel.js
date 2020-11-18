const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const boardSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    boardName: {
        type: String,
        required: true,
    },
    wentWell:[{
        type: String,

    }],
    toImprove:[{
        type:String,

    }],
    actionItems:[{
        type:String,
    }]

},{});
module.exports = Board = mongoose.model("board",boardSchema);
