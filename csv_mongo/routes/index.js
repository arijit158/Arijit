// JavaScript Document

var http = require('http');
var url = require('url');
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var flag='false';
var file_name='';
var UserProvider = require('./userprovider').UserProvider;
var DOWNLOAD_DIR ='./routes/tmp/';
var count=0;
var item=[];
var mtm;
var lgtm;

exports.index = function(req, res){
  res.render('index.html',{msg:''});
};


exports.time = function(req, res){
var file_url = req.body.cpath;	//Full path
req.session.fp=file_url;
var request = require('request');
request(file_url, function (err, resp) {
   if (resp.statusCode === 200) {
			var options = {
   				host: url.parse(file_url).host,
    			port: 80,
    			path: url.parse(file_url).pathname
				};	

				var req = http.request(options, function(resq) {
				var modcsv=resq.headers["last-modified"];
				mtm=new Date(modcsv);
				
				
				var userProvider = new UserProvider();
 				userProvider.checktime(function(err, result){
 				if(err)
 				console.log(err);
				else {
				//vat t store last updated time in database*****
					var logtime=result[0].tm;
					lgtm=new Date(logtime);
					console.log('mtm : '+mtm +'lgtm :'+lgtm);
					if(mtm>lgtm)
					{
						download_file_httpget(file_url);
						res.render('index.html',{msg:'Require'});
					}
						else
						res.render('index.html',{msg:'Not Require'});
					
			      }
			
	        });
							
				});req.end();
}
else
 {
	res.render('index.html',{msg:'File not Exists'});						
 }
});

};


var download_file_httpget = function(file_url) {
//console.log(file_url);	
var options = {
    host: url.parse(file_url).host,
    port: 80,
    path: url.parse(file_url).pathname
};

file_name = url.parse(file_url).pathname.split('/').pop();
var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

http.get(options, function(res) {
	
    res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
			//flag='true';
			//console.log('Flag :'+flag);
            console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);	
			/*if(flag=='true')
	  			//ConvertFile(); 
				console.log('Converstion can be occured');
			else
			console.log('Some Problem Occured');*/
        });
		
    });
	
};

exports.up = function(req, res){
  res.render('Update.html',{msg:''});
};

exports.udb=function(req,res){
	var cnt;
	var temp=0;
	//var aa=false;
if(req.session.fp== null)
res.render('index.html',{msg:'Check TimeStamp First'});
//console.log('Session :'+req.session.fp);
var sessionpath=req.session.fp;
var fn=sessionpath.substring(sessionpath.lastIndexOf("/")+1,sessionpath.length);
//console.log('file name from session :'+fn);

var filepath=DOWNLOAD_DIR + fn;
	fs.exists(filepath, function(exists) {
  		if (exists) 
		{
			var lineReader = require('line-reader');
			lineReader.eachLine(filepath, function(line, last) {
			count++;
 			 if(last){
				 
					 cnt=count-1;
					 if(cnt>=1)
					 {
						 var userProvider = new UserProvider();
							userProvider.removeProduct(function(err, docs){
						if(err) console.log("DB Error: "+err);
							else{ 
							console.log('data deleted');
							}
						});
			var lazy = require("lazy");
			var flg=false;
			var acc = [];
			var a=fs.createReadStream(filepath);
			new lazy(a)
   			.lines
   			.forEach(function(lineList){
				//console.log('linelist'+lineList.length);
	   				if(flg==true){
						lineList.toString().split(',').forEach(function (entry, i) {
        				acc[i] = entry;
						if(typeof(acc[i])!='undefined')
						{
							if(acc[i].lastIndexOf('\r')!=-1)
							acc[i]=acc[i].substring(0,acc[i].length-1);
							if(acc[i].substring(0,1)=='"' && acc[i].lastIndexOf('"')!=-1)
							acc[i]=acc[i].substring(1,acc[i].length-1);
						}
        				});
						
					var Company=acc[0];
					var Location=acc[1];
					var Country=acc[2];
					var Categories=acc[3];
					
					var userProvider = new UserProvider();
					var insertData=[{"Company": Company, "Location": Location, "Country": Country, "Categories": Categories}];
					userProvider.insertCSVData(insertData, function(err, docs){
 					if(err)
 						console.log(err);
					else {
								temp+=1;
								if(cnt>temp)
						     		console.log('data inserted');
									else
									res.render('Update.html',{msg:'Upload Completed Successfully'});
									//console.log('This is your last step');
						 }
					});
					
	   	  			}  // flag if end----
	   				else
					{
						var userProvider = new UserProvider();
						var tt=new Date();
						console.log(tt);
					     var insertNewTime={"_id":1,"tm":tt};
						console.log('inserttime'+insertNewTime);
						userProvider.insertTm(insertNewTime, function(err, docs){
 						if(err)
 						console.log(err);
						else {
						     console.log('inserted');
						 	}
						});
						flg=true;
					}
				
	 		});
					 }
					 else
					 {
						 res.render('Update.html',{msg:'File is Empty'});
					 }
  				}
				});	
    	} 
  		else 
		{
   			res.render('Update.html',{msg:'File not exits'});
  		}
		
});

};

/*function countRows(filepath){
var userProvider = new UserProvider();
			userProvider.removeProduct(function(err, docs){
			if(err) console.log("DB Error: "+err);
			else{ 
					console.log('data deleted');
				}
			});
			var lazy = require("lazy");
			var flg=false;
			var acc = [];
			var a=fs.createReadStream(filepath);
			new lazy(a)
   			.lines
   			.forEach(function(lineList){
				//console.log('linelist'+lineList.length);
	   				if(flg==true){
						lineList.toString().split(',').forEach(function (entry, i) {
        				acc[i] = entry;
						if(typeof(acc[i])!='undefined')
						{
							if(acc[i].lastIndexOf('\r')!=-1)
							acc[i]=acc[i].substring(0,acc[i].length-1);
							if(acc[i].substring(0,1)=='"' && acc[i].lastIndexOf('"')!=-1)
							acc[i]=acc[i].substring(1,acc[i].length-1);
						}
        				});
						
					var Company=acc[0];
					var Location=acc[1];
					var Country=acc[2];
					var Categories=acc[3];
					
					var userProvider = new UserProvider();
					var insertData=[{"Company": Company, "Location": Location, "Country": Country, "Categories": Categories}];
					userProvider.insertCSVData(insertData, function(err, docs){
 					if(err)
 						console.log(err);
					else {
								temp+=1;
								if(cnt-1>temp)
						     		console.log('data inserted');
									else
									console.log('This is your last step');
						 }
					});
					
	   	  			}  // flag if end----
	   				else
					{
						var userProvider = new UserProvider();
						var tt=new Date();
						console.log(tt);
					     var insertNewTime={"_id":1,"tm":tt};
						console.log('inserttime'+insertNewTime);
						userProvider.insertTm(insertNewTime, function(err, docs){
 						if(err)
 						console.log(err);
						else {
						     console.log('inserted');
						 	}
						});
						flg=true;
					}
				
	 		});
}


function abc(){
	
	var lazy = require("lazy");
			var a=fs.createReadStream('http://www.etenderastha.com/csv/Book1.csv');
			new lazy(a)
 			.lines
 			.forEach(function(lineList){
				count+=1;  
				console.log(count);
 			});
}*/