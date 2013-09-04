
DbConnection=function(){
	
};


DbConnection.prototype.getCollection = function(cname, callback){
	
var mongodb=require('mongodb');
var db=new mongodb.Db('nodejitsu_jeet_nodejitsudb6028548253',
new mongodb.Server('ds039267.mongolab.com',39267,{})
);
db.open(function(err,db_p){
if(err){throw err;}
db.authenticate('nodejitsu_jeet','oco3a9fp47a35eu53g9q843sup',function(err,replies){

//you are now connected and authenticate.
db.collection(cname,function(err,user_collection){
			if(err)
				callback(err);
			else
				callback(null,user_collection);
		});


//************************************************

});
});
};

exports.DbConnection = DbConnection;