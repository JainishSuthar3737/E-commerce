const mongoose = require('mongoose');
require("dotenv").config();

const DbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("Database connected successfully"); 
        console.log("-----------------------------------------------------------------------------------");
    }).catch((error)=>{
         console.log("Database is not connected");  
    });
}


module.exports = DbConnect;