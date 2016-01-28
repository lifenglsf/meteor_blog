count = Meteor.users.find({username:"webmaster"}).count();
if(count == 0){
Accounts.createUser({username:"webmaster",email:"lifenglsf@163.com",password:"fengli007"});
}
