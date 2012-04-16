exports.handler = function(req,rsp){
    rsp.statusCode = 404;
    rsp.end("404 not found");
}