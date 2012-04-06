var inf = new (require("./database/interface").Interface)();
//create 2 user
inf.addUser("nstal");
inf.addUser("giyya");
inf.addUser("AI")
var get = function(){
    inf.getUserData("nstal",function(obj){
	console.log(obj);
    })
}
inf.setUserData("nstal",{credits:2000},get);
var get = function(){
    inf.getUserData("giyya",function(obj){
	console.log(obj);
    })
}
inf.setUserData("giyya",{credits:2000},get);
