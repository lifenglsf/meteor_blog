Meteor.methods({
	'article.insert':function(param){
	return Article.insert(param);
	},
	'article.update':function(id,param){
		return Article.update({_id:id},{$set:param})
	}
})
