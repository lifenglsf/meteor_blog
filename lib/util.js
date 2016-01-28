showMessage = function (message,type){
if(typeof(type) == 'undefined'){
type="error";
}
 $('#alert_placeholder').append('<div id="alertdiv" class="alert alert-' +  type + '" style="z-index:1000;margin:0 auto;width:960px;"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');

    setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it in 5 secs


      $("#alertdiv").remove();

    }, 5000);
}
