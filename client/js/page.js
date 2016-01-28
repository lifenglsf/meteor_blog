Router.configure({
    layoutTemplate: 'common'
});
Router.route('/admin/category/add',function(){
	if(Meteor.userId()){
	this.render('addCategory');
}
});
Router.route('/',{
	"waitOn":function(){
		return Meteor.subscribe('Articles',{},0,10)
	},
	"action":function(){
		this.render('listArticle');
	}
});
Router.route('/about',function(){
	this.render('aboutme');
});
Router.route('category/:_id',{
	"waitOn":function(){
		return	Meteor.subscribe('Articles',{cid:this.params._id},0,10);
	},
	"action":function(){
	var id = this. params._id;
	Session.set('cid',id);
	Session.set('dcid',id);
	this.render('listArticle');
	}
});
Router.route('/admin/article/add',function(){
	if(Meteor.userId()){

	
	this.render('addArticle');
}
});
Router.route('/article/:_id',{
	"waitOn":function(){
		return Meteor.subscribe('Articles',{_id:this.params._id},0,1);
	},
	"action":function(){
	var art = Article.findOne({_id:this.params._id});
          art.content = _.unescape(art.content);
          Session.set('dcid',art.cid);
          this.render('detail',{data:art});
	}
});
Router.route('/admin/article/list',{
	"waitOn":function(){
		if(Meteor.userId()){
		return Meteor.subscribe('Articles',{},0,10);
		}else{
			return Meteor.subscribe('Articles',{_id:1},0,0);
		}
	},
	"action":function(){
	this.render('adminListArticle');
	}
});
Router.route('/admin/article/edit/:_id',{
	"waitOn":function(){
		if(Meteor.userId()){
		return Meteor.subscribe('Articles',{_id:this.params._id},0,1);
		}else{
		return Meteor.subscribe('Articles',{_id:1},0,1);
		}
	},
	"action":function(){
	var article = Article.findOne({_id:this.params._id});
	if(article){
	article.content = _.unescape(article.content);
	}
	Session.set('article_id',this.params._id);
	this.render('editArticle',{data:article});
	}
});
