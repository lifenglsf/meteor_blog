Meteor.publish('Articles',function(cond,offset,limit){
	return Article.find(cond,{skip:offset,limit:limit,sort:{create_date:-1}});
});
Meteor.publish('Categorys',function(){
	return Category.find({status:1});
})

