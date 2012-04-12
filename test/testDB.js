var inf = (require("../database/interface").Interface);
//create 2 user
inf.addUser("nstal");
function get(){
    inf.getUserData("nstal",function(obj){
	console.log(obj);
    })
}
inf.setUserData("nstal",{credits:2000},get);
inf.addUser("giyya");
function get(){
    inf.getUserData("giyya",function(obj){
	console.log(obj);
    })
}
inf.setUserData("giyya",{credits:2000},get);
