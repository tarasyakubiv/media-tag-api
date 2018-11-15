const BaseController = require("./basecontroller"),
	swagger = require("swagger-node-restify")

class Tags extends BaseController {
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
		this.lib.db.model('Tag')
			.find(criteria)
			.exec((err, tags) => {
				if(err) return next(err)
				this.writeHAL(res, tags)
			})
	}

	details(req, res, next) {
		let id = req.params.id
		if(id) {
			this.lib.db.model("Tag")
				.findOne({_id: id})
				.exec((err, Tag) => {
					if(err) return next(this.RESTerror('InternalServerError', err))
					if(!Tag) {
						return next(this.RESTerror('ResourceNotFoundError', 'Tag not found'))
					}
					this.writeHAL(res, Tag)
				})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Missing Tag id'))
		}
	}

	create(req, res, next) {
		let body = req.body
		if(body) {
			body = JSON.parse(body)
			let newTag = this.lib.db.model("Tag")(body)
			newTag.save((err, Tag) => {
				if(err) return next(this.RESTerror('InternalServerError', err))
				this.writeHAL(res, Tag)
			})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Missing Tag id'))		
		}
	}

	update(req, res, next) {
		let data = JSON.parse(req.body)
		let id = req.params.id
		if(id) {
			this.lib.db.model("Tag").findOne({_id: id}).exec((err, Tag) => {
				if(err) return next(this.RESTerror('InternalServerError', err))
				if(!Tag) {
						return next(this.RESTerror('ResourceNotFoundError', 'Tag not found'))			
				}
				Tag = Object.assign(Tag, data)
				Tag.save((err, data) => {
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
	let controller = new Tags(lib);

	controller.addAction({
		'path': '/tags',
		'method': 'GET',
		'summary': 'Returns the list of Tags',
		"params": [ swagger.queryParam('q', 'Search term', 'string'),
		swagger.queryParam('genre', 'Filter by genre', 'string')],
		'responseClass': 'Tag',
		'nickname': 'getTags'
	}, controller.list);

	controller.addAction({
		'path': '/tags/{id}',
		'method': 'GET',
		'summary': 'Returns the full data of a Tag',
		"params": [ swagger.pathParam('id', 'the id of the Tag', 'int')],
		'responseClass': 'Tag',
		'nickname': 'getTags'
	}, controller.details)

	controller.addAction({
		'path': '/tags',
		'method': 'POST',
		'summary': 'Adds a new Tag to collection',
		"params": [ swagger.bodyParam('Tag', 'Json representation of the new Tag', 'string')],
		'responseClass': 'Tag',
		'nickname': 'newTag'
	}, controller.create)

	controller.addAction({
		'path': '/tags/{id}',
		'method': 'PUT',
		'summary': 'Updates the information of one specific Tag',
		"params": [ swagger.pathParam('id', 'the id of the Tag', 'int'),
		swagger.bodyParam('Tag', 'The data to change on the Tag', 'string')],
		'responseClass': 'Tag',
		'nickname': 'updateTag'
	}, controller.update)
	return controller
}

