const restify = require("restify"),
	restifyPlugins = restify.plugins,
	colors = require("colors"),
	lib = require("./lib"),
	swagger = require("swagger-node-restify"),
	config = require("config");
const server = restify.createServer(config.get('server'))

server.use(restifyPlugins.queryParser({
	mapParams: true
}))
server.use(restifyPlugins.bodyParser())
restify.defaultResponseHeaders = data => {
	this.header('Access-Control-Allow-Origin', '*')
}

swagger.addModels(lib.schemas)
swagger.setAppHandler(server)
lib.helpers.setupRoutes(server, swagger, lib)

server.listen(config.get('server.port'), () => {
	lib.logger.info("Server started succesfully...".green)
	lib.db.connect( err => {
		if(err) lib.logger.error("Error trying to connect to database: ".red, err.red)
		else lib.logger.info("Database service successfully started".green)
	})
})