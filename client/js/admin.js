Template.addCategory.helpers({
});
Template.addCategory.events({
    'submit #addCategory':function(event,template){
        event.preventDefault();
        event.target.disabled = true;
        var name = template.find('#name').value;
        var enname = template.find('#enname').value;
        if(name == ''){
            howMessage('分类名称不能为空','warning');
            return;
        }
 
        if(enname == ''){
            showMessage('分类英文名称不能为空','warning');
            return;
        }
        iss1checked = template.find('#status1').checked;
        iss2checked = template.find('#status2').checked;
        console.log(iss1checked,iss2checked);
        if(iss1checked){
        	istatus = 1;
        }
        if(iss2checked){
        	istatus=2;
        }
        if(typeof(istatus) == 'undefined'){
            showMessage('是否显示必须选择','warning');
            return;
        }
        con = {name:name};
        isexist = "";
        Meteor.apply('category.recordisexist',[con],function(error,result){
          	if(!error){
			  if(result){
			  showMessage(name+'已经存在，请更换名称','danger');
			  return;
  			}else{
  				var param = {};
                param = {  
                        name:name,
                        enname:enname,
                        status:istatus
                }  
                Meteor.call('category.insert',param,function(error,result){
                    if(error){
                            showMessage('添加分类失败','danger');
                    }else{  
                            showMessage('添加分类成功','success');
                            event.target.disabled = false;
                            template.find('#addCategory').reset();
                    }  
     
                })
  
  			}
  		}
  });
}  
});       
Template.addArticle.helpers({
	categoryList:function(){
		return Category.find({}).fetch();
	}
});
Template.addArticle.rendered = function(){
          $('#content').summernote();
};
Template.addArticle.events({
          'submit #addArticle':function(event,template){
                  event.preventDefault();
                  event.target.disabled = true;
                  var title = template.find('#title').value;
                  var desc = template.find('#desc').value;
                  var content = _.escape($('#content').summernote('code'));
                  var cid = template.find('#category').value;
                  var userid = Meteor.uuid();//Meteor.userId();
                  var now = new Date();
                  var create_date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
                  //console.log(content);
  //return;       
                  var param = {
                          title:title,
                          desc:desc,
                          content:content,
                          cid:cid,
                          userid:userid,
                          create_date:create_date
                  };
                  Meteor.call('article.insert',param,function(error,result){
                          if(error){
                                  showMessage('发布文章失败','danger');
                          }else{  
                                  showMessage('发布文章成功','success');
                                  template.find('#addArticle').reset();
                          }
                 })
         }   
 });
Template.adminListArticle.helpers({
	'articleList':function(){
		return Article.find({},{
			transform:function(doc){
				var categoryname = Category.findOne({_id:doc.cid}).name;
				doc.categoryname = categoryname;
				return doc;
			}
		}).fetch();
	}
});
Template.editArticle.helpers({
	'categoryList':function(){
		var articleId = Session.get('article_id');
		article = Article.findOne({_id:articleId});
		if(article){
		return Category.find({},{
			transform:function(doc){
				doc.isselect = false;
				if(doc._id == article.cid){
					doc.isselect = true;
				}
				return doc;
			}
		});
		}
	}
})
Template.editArticle.rendered = function(){
	$(document).ready(function(){

	$('#content').summernote();
	})
};
Template.editArticle.events({
	'submit #editArticle':function(event,template){
		event.preventDefault();
		title = template.find('#title').value;
		desc = template.find('#desc').value;
		category = template.find('#category').value;
		content = $('#content').summernote('code');
		var param = {
			title:title,
			desc:desc,
			content:content,
			cid:category
		};
		articleId = Session.get('article_id');
		Meteor.call('article.update',articleId,param,function(error,result){
			if(error){
				showMessage('文章更新失败','danger');
			}else{
				showMessage('文章更新成功','success');
			}
		})
	}
})
