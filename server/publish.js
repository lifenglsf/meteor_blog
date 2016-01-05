Meteor.publish('logslist', function() {
    return logs.find({});
});
Meteor.publish('robslist',function(){
    return robs.find({});
})
