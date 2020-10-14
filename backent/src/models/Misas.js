const { Schema, model } = require('mongoose');

const misaSchema = new Schema({
 
    dia: {
        type:Date,
        required: true
    },
    tel: {
        type:String,
        required: true
    },
    para: {
        type:String,        
    },
    ofrece: {
        type:String,        
    },
    hora: {
        type: String,
        require: true
    },
    intencion: {
        type: String
    }
    

})

module.exports = model('Misa', misaSchema);