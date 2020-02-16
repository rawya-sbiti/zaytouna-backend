const mongoose = require("mongoose");
mongoose
    .connect(
       "mongodb://guetat:zitouna2020@ds211099.mlab.com:11099/zitouna",


         {useUnifiedTopology: true, useNewUrlParser: true}
    ).then(() => {        console.log("Connected to database successfully");
    })

    .catch(() => {
        console.log("Unable to connected to database");
    });
//"mongodb://admin:admin123@ds125945.mlab.com:25945/nappdeal?authSource=nappdeal"
