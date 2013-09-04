// JavaScript Document
var DbConnection=require('./dbcon').DbConnection,
	cn;
//var BSON = require('mongojs').BSON;
//var ObjectID = require('mongojs').ObjectID;

UserProvider = function(){
	cn=new DbConnection();
};


UserProvider.prototype.insertCSVData = function(insertData,callback){
	cn.getCollection('datatable', function(err,user_collection){
		if(err)
			callback(err);
		else{
			if(typeof(insertData)=='undefined')
				insertData=[insertData];
			user_collection.insert(insertData,function(){
				callback(null,insertData);
			});
		}
	});
};


UserProvider.prototype.insertTm = function(insertNewTime,callback){
	console.log('insertnewtime:'+insertNewTime);
	cn.getCollection('lasttime', function(err,user_collection){
		if(err)
			callback(err);
		else{
			if(typeof(insertNewTime)=='undefined')
				insertNewTime=[insertNewTime];
			user_collection.update({_id:1},insertNewTime,function(error,insertNewTime){
				callback(null,insertNewTime);
			});
		}
	});
};


UserProvider.prototype.checktime = function(callback){
	cn.getCollection('lasttime', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find().toArray(function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};

UserProvider.prototype.removeProduct = function(callback){
	cn.getCollection('datatable',function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.remove({}, function(error, removeData){
				if(error) callback(error);
				else callback(null, removeData);
			});
		}
	});
};

/*UserProvider.prototype.getUser = function(userId, callback){
	cn.getCollection('admin', function(err,user_collection){
		if(err)
			callback(err);
		else{
			if(typeof(userId)=='undefined')
				callback(err);
			user_collection.findOne({_id: userId}, function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};

UserProvider.prototype.insertProduct = function(insertData,callback){
	cn.getCollection('product', function(err,user_collection){
		if(err)
			callback(err);
		else{
			if(typeof(insertData)=='undefined')
				insertData=[insertData];
			user_collection.insert(insertData,function(){
				callback(null,insertData);
			});
		}
	});
};*/




/*UserProvider.prototype.getSearchProduct = function(searchname, callback){
	cn.getCollection('product', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find({$or: [ { _id: searchname }, { pname:searchname },{pdescription:searchname},{price:searchname} ]}).toArray(function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};

UserProvider.prototype.getPCode = function(pid, callback){
	cn.getCollection('product', function(err,user_collection){
		if(err)
			callback(err);
		else{
			if(typeof(pid)=='undefined')
				callback(err);
			user_collection.findOne({_id: pid}, function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};


UserProvider.prototype.updateproduct = function(updateData, pid, callback){
	cn.getCollection('product', function(err, user_collection){
		if(err) callback(err);
		else{
			//if(typeof(updateData)== 'undefined')
				//updateData=[updateData];
			user_collection.update({_id: pid}, updateData, function(error, updateData){
				if(error) callback(error);
				else callback(null, updateData);
			});
		}
	});
};


UserProvider.prototype.removeProduct = function(pid, callback){
	cn.getCollection('product',function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.remove({_id: pid}, function(error, removeData){
				if(error) callback(error);
				else callback(null, removeData);
			});
		}
	});
};



UserProvider.prototype.getAllProductKeyList = function(callback){
	cn.getCollection('productkeys', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find().toArray(function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};


UserProvider.prototype.getSearchProductkey = function(searchname, callback){
	cn.getCollection('productkeys', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find({$or: [ { productkey: searchname }, { serialno:searchname },{serialkey:searchname},{usbmanid:searchname},{rdatetime:searchname},{rtype:searchname} ]}).toArray(function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};

UserProvider.prototype.getUnallocatedProductkey = function(searchname, callback){
	cn.getCollection('productkeys', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find({rtype:searchname}).toArray(function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};


UserProvider.prototype.getStatusProductkey = function(searchname, callback){
	cn.getCollection('purchaseorder', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find({tstatus:searchname}).toArray(function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};

UserProvider.prototype.getAllPurchaseOrder = function(callback){
	cn.getCollection('purchaseorder', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find().toArray(function(error, result){
				if(error) callback(error);
				else callback(null, result);
			});
		}
	});
};

UserProvider.prototype.getSearchPurchaseOrder = function(searchname, callback){
	cn.getCollection('purchaseorder', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find({$or: [ { _id: searchname }, { fname:searchname },{lname:searchname},{cemail:searchname},{quantity:searchname},{product:searchname},{odatetime:searchname},{cstatus:searchname},{tstatus:searchname} ]}).toArray(function(error, result){
				if(error) 
				{
				callback(error);
				console.log('clback error :'+error);
				}
				else 
				{
					console.log('clback result :'+result);
					callback(null, result);
				}
			});
		}
	});
};

UserProvider.prototype.Searchpurchasekey = function(searchname, callback){
	cn.getCollection('purchaseorder', function(err, user_collection){
		if(err) callback(err);
		else{
			console.log('jjjj  :'+searchname);
			user_collection.findOne({_id:searchname},{productkeys:1,_id:0},function(error, result){
				if(error) callback(error);
				else 
				{
					callback(null, result);
				}
			});
		}
	});
};

UserProvider.prototype.removepurchaseorders = function(oid, callback){
	cn.getCollection('purchaseorder',function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.remove({_id: oid}, function(error, removeData){
				if(error) callback(error);
				else callback(null, removeData);
			});
		}
	});
};


UserProvider.prototype.getSearchPayment = function(searchname, callback){
	cn.getCollection('purchaseorder', function(err, user_collection){
		if(err) callback(err);
		else{
			user_collection.find({$or: [ { _id: searchname }, {transactionid:searchname},{pstatus:searchname},{pamount:searchname},{pdatetime:searchname} ]}).toArray(function(error, result){
				if(error) 
				{
				callback(error);
				console.log('clback error :'+error);
				}
				else 
				{
					console.log('clback result :'+result);
					callback(null, result);
				}
			});
		}
	});
};

UserProvider.prototype.SearchOidDetails = function(searchname, callback){
	cn.getCollection('purchaseorder', function(err, user_collection){
		if(err) callback(err);
		else{
			console.log('jjjj  :'+searchname);
			user_collection.find({_id:searchname}).toArray(function(error, result){
				if(error) callback(error);
				else 
				{
					console.log('resulr  '+result);
					callback(null, result);
				}
			});
		}
	});
};


UserProvider.prototype.changepin = function(updateData, adminid, callback){
	cn.getCollection('admin', function(err, user_collection){
		if(err) callback(err);
		else{
			console.log('Admin name :'+adminid);
			user_collection.update({_id: adminid}, {$set :updateData}, function(error, updateData){
				if(error) callback(error);
				else callback(null, updateData);
			});
		}
	});
};


UserProvider.prototype.insertProductkeys = function(insertData,callback){
cn.getCollection('productkeys', function(err,user_collection){
	if(err)
		callback(err);
	 else{
			if(typeof(insertData)=='undefined')
				insertData=[insertData];
			user_collection.insert(insertData,function(){
				callback(null,insertData);
			});
		}
	});
};*/

exports.UserProvider = UserProvider;