const BaseController = require("./basecontroller"),
	swagger = require("swagger-node-restify")

class Contestants extends BaseController {
	constructor(lib) {
		super();
		this.lib = lib;
	}

	list(req, res, next) {
		let criteria = {}
		if(req.params.q) {
			let expr = new RegExp('.*' + req.params.q + ".*")
			criteria.$or = [
				{name: expr},
				{description: expr}
			]
		}
		this.lib.db.model('Contestant')
			.find(criteria)
			.exec((err, Contestants) => {
				if(err) return next(err)
				this.writeHAL(res, Contestants)
			})
	}

	details(req, res, next) {
		let id = req.params.id
		if(id) {
			this.lib.db.model("Contestant")
				.findOne({_id: id})
				.exec((err, Contestant) => {
					if(err) return next(this.RESTerror('InternalServerError', err))
					if(!Contestant) {
						return next(this.RESTerror('ResourceNotFoundError', 'Contestant not found'))
					}
					this.writeHAL(res, Contestant)
				})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Missing Contestant id'))
		}
	}

	create(req, res, next) {
		let body = req.body
		if(body) {
			body = JSON.parse(body)
			let newContestant = this.lib.db.model("Contestant")(body)
			newContestant.save((err, Contestant) => {
				if(err) return next(this.RESTerror('InternalServerError', err))
				this.writeHAL(res, Contestant)
			})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Missing Contestant id'))		
		}
	}

	update(req, res, next) {
		let data = JSON.parse(req.body)
		let id = req.params.id
		if(id) {
			this.lib.db.model("Contestant").findOne({_id: id}).exec((err, Contestant) => {
				if(err) return next(this.RESTerror('InternalServerError', err))
				if(!Contestant) {
						return next(this.RESTerror('ResourceNotFoundError', 'Contestant not found'))			
				}
				Contestant = Object.assign(Contestant, data)
				Contestant.save((err, data) => {
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
	let controller = new Contestants(lib);

	controller.addAction({
		'path': '/contestants',
		'method': 'GET',
		'summary': 'Returns the list of Contestants',
		"params": [ swagger.queryParam('q', 'Search term', 'string'),
		swagger.queryParam('genre', 'Filter by genre', 'string')],
		'responseClass': 'Contestant',
		'nickname': 'getContestants'
	}, controller.list);

	controller.addAction({
		'path': '/contestants/{id}',
		'method': 'GET',
		'summary': 'Returns the full data of a Contestant',
		"params": [ swagger.pathParam('id', 'the id of the Contestant', 'int')],
		'responseClass': 'Contestant',
		'nickname': 'getContestants'
	}, controller.details)

	controller.addAction({
		'path': '/contestants',
		'method': 'POST',
		'summary': 'Adds a new Contestant to collection',
		"params": [ swagger.bodyParam('Contestant', 'Json representation of the new Contestant', 'string')],
		'responseClass': 'Contestant',
		'nickname': 'newContestant'
	}, controller.create)

	controller.addAction({
		'path': '/contestants/{id}',
		'method': 'PUT',
		'summary': 'Updates the information of one specific Contestant',
		"params": [ swagger.pathParam('id', 'the id of the Contestant', 'int'),
		swagger.bodyParam('Contestant', 'The data to change on the Contestant', 'string')],
		'responseClass': 'Contestant',
		'nickname': 'updateContestant'
	}, controller.update)
	return controller
}

