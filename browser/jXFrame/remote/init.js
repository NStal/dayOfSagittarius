$(document).ready(function(){
    main = null;
    if(typeof Main == "function"){
	main = new Main();
    }
    if(main && main.init){
	main.init();
    }
});