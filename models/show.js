const mongoose = require("mongoose"),
jsonSelect = require('mongoose-json-select'),
helpers = require("../lib/helpers")
module.exports = function(db) {
        let schema = require("../schemas/show.js")
        let modelDef = db.getModelFromSchema(schema)
        modelDef.schema.plugin(jsonSelect, '-contestants -images')
        modelDef.schema.methods.toHAL = function() {
                let halObj = helpers.makeHAL(this.toJSON(),
                        [{name: 'Contestants',href: '/shows/' + this.id + '/contestants', title:'Contestants'},
                        {name: 'Images',href: '/shows/' + this.id + '/images', title:'Images'}])
                if(this.images.length > 0) {
                        if(this.images[0].toString().length != 24) {
                                halObj.addEmbed('images', this.images)
                        }
                }
                return halObj
        }
        return mongoose.model(modelDef.name, modelDef.schema)
}