let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let saltRound = 10;     //(password encryption)

let UserSchema = new Schema({
	firstname: {type:String},
	lastname: {type:String},
	email: {type:String},
	password: {type:String},
	dateCreated: {type:Date, 'default':Date.now}
});

UserSchema.methods.encryptPassword = function(password){        //(password encryption)
	let salt = bcrypt.genSaltSync(saltRound);
	let hash = bcrypt.hashSync(password, salt);

	return hash;
}

UserSchema.methods.checkPassword = function(guessPassword){
	return bcrypt.compareSync(guessPassword, this.password);
}

module.exports = mongoose.model('user', UserSchema);