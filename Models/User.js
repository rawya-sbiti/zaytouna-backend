const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Student = require("./Student").schema;



const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    uuid: { type: String},
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: false },
    profileImage: { type: String },
    balance: { type: Number, default: 0 },
    role: { type: String, },
    age: { type: String, },
    gender: { type: String, },
    status: { type: Boolean,   default:true },
    password: { type: String  },

    active: { type: Boolean ,  default: false  },

    students: [{type: Student}],
    provider: { type: String  },
    providerID: { type: String  },
    lat: { type: Number },
    lng: { type: Number },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
