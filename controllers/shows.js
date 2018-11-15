const BaseController = require("./basecontroller"),
	swagger = require("swagger-node-restify")

class Shows extends BaseController {
	constructor(lib) {
		super();
		this.lib = lib;
	}

	list(req, res, next) {
		let criteria = {}
		if(req.params.q) {
			let expr = new RegExp('.*' + req.params.q + ".*")
			criteria.$or = [
				{title: expr},
				{description: expr}
			]
		}
		this.lib.db.model('Show')
			.find(criteria)
			.exec((err, shows) => {
				if(err) return next(err)
				this.writeHAL(res, shows)
			})
	}

	details(req, res, next) {
		let id = req.params.id
		if(id) {
			this.lib.db.model("Show")
				.findOne({_id: id})
				.exec((err, show) => {
					if(err) return next(this.RESTerror('InternalServerError', err))
					console.log("check".red + show)
					if(!show) {
						return next(this.RESTerror('ResourceNotFoundError', 'Show not found'))
					}
					this.writeHAL(res, show)
				})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Missing Show id'))
		}
	}

	create(req, res, next) {
		let body = req.body
		if(body) {
			body = JSON.parse(body)
			let newShow = this.lib.db.model("Show")(body)
			newShow.save((err, show) => {
				if(err) return next(this.RESTerror('InternalServerError', err))
				this.writeHAL(res, show)
			})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Missing show id'))		
		}
	}

	update(req, res, next) {
		let data = JSON.parse(req.body)
		let id = req.params.id
		if(id) {
			this.lib.db.model("Show").findOne({_id: id}).exec((err, show) => {
				if(err) return next(this.RESTerror('InternalServerError', err))
				if(!show) {
						return next(this.RESTerror('ResourceNotFoundError', 'Show not found'))			
				}
				show = Object.assign(Show, data)
				show.save((err, data) => {
					if(err) return next(this.RESTerror('InternalServerError', err))
					this.writeHAL(res, data)
				})
			})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Invalid id received'))
		}
	}
}

module.exports = function(lib) {
	let controller = new Shows(lib);

	controller.addAction({
		'path': '/shows',
		'method': 'GET',
		'summary': 'Returns the list of Shows',
		"params": [ swagger.queryParam('q', 'Search term', 'string'),
		swagger.queryParam('genre', 'Filter by genre', 'string')],
		'responseClass': 'Show',
		'nickname': 'getShows'
	}, controller.list);

	controller.addAction({
		'path': '/shows/{id}',
		'method': 'GET',
		'summary': 'Returns the full data of a Show',
		"params": [ swagger.pathParam('id', 'the id of the Show', 'int')],
		'responseClass': 'Show',
		'nickname': 'getShows'
	}, controller.details)

	controller.addAction({
		'path': '/shows',
		'method': 'POST',
		'summary': 'Adds a new Show to collection',
		"params": [ swagger.bodyParam('Show', 'Json representation of the new Show', 'string')],
		'responseClass': 'Show',
		'nickname': 'newShow'
	}, controller.create)

	controller.addAction({
		'path': '/shows/{id}',
		'method': 'PUT',
		'summary': 'Updates the information of one specific Show',
		"params": [ swagger.pathParam('id', 'the id of the Show', 'int'),
		swagger.bodyParam('Show', 'The data to change on the Show', 'string')],
		'responseClass': 'Show',
		'nickname': 'updateShow'
	}, controller.update)
	return controller
}

