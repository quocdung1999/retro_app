const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    displayName:{
        type:String,
    },

});
module.exports = User = mongoose.model("user",userSchema);