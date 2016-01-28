Template.listArticle.helpers({
articleList:function(){
var list = Article.find({},{
	transform:function(doc){
		doc.content = _.unescape(doc.content);
		return doc;
	}
}).fetch();
return list;
}
});
