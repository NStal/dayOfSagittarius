var Interface = (require("../database/interface").Interface);
//create 2 user
Interface.addUser("nstal");
function get(){
    Interface.getUserData("nstal",function(obj){
	console.log(obj);
    })
}
Interface.setUserData("nstal",{credits:2000},get);
Interface.addUser("giyya");
function get(){
    Interface.getUserData("giyya",function(obj){
	console.log(obj);
    })
}
Interface.setUserData("giyya",{credits:2000},get);
