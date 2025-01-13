const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const Users = new Schema({
    username : String,
    password : String,
    email : {type : String , unique : true}
})

const Todo = new Schema({
    title : String,
    done : Boolean,
    userId : ObjectId
})

const UserModel = mongoose.model("users" , Users)
const TodoModel = mongoose.model("todos" , Todo)

module.exports = {
    UserModel:  UserModel,
    TodoModel: TodoModel

}