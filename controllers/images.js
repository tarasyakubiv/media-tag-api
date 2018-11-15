const BaseController = require("./basecontroller"),
	swagger = require("swagger-node-restify")

class Images extends BaseController {
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
		this.lib.db.model('Image')
			.find(criteria)
			.exec((err, images) => {
				if(err) return next(err)
				this.writeHAL(res, images)
			})
	}

	details(req, res, next) {
		let id = req.params.id
		if(id) {
			this.lib.db.model("Image")
				.findOne({_id: id})
				.exec((err, image) => {
					if(err) return next(this.RESTerror('InternalServerError', err))
					if(!image) {
						return next(this.RESTerror('ResourceNotFoundError', 'Image not found'))
					}
					this.writeHAL(res, image)
				})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Missing Image id'))
		}
	}

	create(req, res, next) {
		let body = req.body
		if(body) {
			body = JSON.parse(body)
			let newImage = this.lib.db.model("Image")(body)
			newImage.save((err, image) => {
				if(err) return next(this.RESTerror('InternalServerError', err))
				this.writeHAL(res, image)
			})
		} else {
			next(this.RESTerror('InvalidArgumentError', 'Missing image id'))		
		}
	}

	update(req, res, next) {
		let data = JSON.parse(req.body)
		let id = req.params.id
		if(id) {
			this.lib.db.model("Image").findOne({_id: id}).exec((err, image) => {
				if(err) return next(this.RESTerror('InternalServerError', err))
				if(!image) {
						return next(this.RESTerror('ResourceNotFoundError', 'Image not found'))			
				}
				image = Object.assign(image, data)
				image.save((err, data) => {
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
	let controller = new Images(lib);

	controller.addAction({
		'path': '/images',
		'method': 'GET',
		'summary': 'Returns the list of Images',
		"params": [ swagger.queryParam('q', 'Search term', 'string'),
		swagger.queryParam('genre', 'Filter by genre', 'string')],
		'responseClass': 'Image',
		'nickname': 'getImages'
	}, controller.list);

	controller.addAction({
		'path': '/images/{id}',
		'method': 'GET',
		'summary': 'Returns the full data of a Image',
		"params": [ swagger.pathParam('id', 'the id of the Image', 'int')],
		'responseClass': 'Image',
		'nickname': 'getImages'
	}, controller.details)

	controller.addAction({
		'path': '/images',
		'method': 'POST',
		'summary': 'Adds a new Image to collection',
		"params": [ swagger.bodyParam('Image', 'Json representation of the new Image', 'string')],
		'responseClass': 'Image',
		'nickname': 'newImage'
	}, controller.create)

	controller.addAction({
		'path': '/images/{id}',
		'method': 'PUT',
		'summary': 'Updates the information of one specific Image',
		"params": [ swagger.pathParam('id', 'the id of the Image', 'int'),
		swagger.bodyParam('Image', 'The data to change on the Image', 'string')],
		'responseClass': 'Image',
		'nickname': 'updateImage'
	}, controller.update)
	return controller
}

