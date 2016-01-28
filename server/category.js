Meteor.methods({
'category.insert': function(param){
   console.log(param);
           r = Category.insert(param);
           return r;
           },
'category.recordisexist':function(param){
	console.log(param);
	num = Category.find(param).count();
	if(num >=1){
		return true
	}else{
	return false;
	}
}
   
})
