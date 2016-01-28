Template.common.helpers({
	nav:function(){
	return Category.find({}).fetch();
	}
});
