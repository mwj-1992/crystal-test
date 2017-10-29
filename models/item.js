mongoose =require('mongoose'); ObjectId = mongoose.Schema.Types.ObjectId;
var itemSchema = new mongoose.Schema({
    name : {type : String},
    price : Number,
    brand : String,
    create:{
        at: {type: Date, default: Date.now}
    }
    // create: {
    //     by: {type: ObjectId, ref: "User", required: true},
    //     ip : String,
    //     at: {type: Date, default: Date.now}
    // },
    // delete : {type : Date }
});

module.exports = mongoose.model('item', itemSchema);