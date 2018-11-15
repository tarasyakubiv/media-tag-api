const mongoose = require("mongoose"),
jsonSelect = require('mongoose-json-select'),
helpers = require("../lib/helpers")
module.exports = function(db) {
        let schema = require("../schemas/image.js")
        let modelDef = db.getModelFromSchema(schema)
        modelDef.schema.plugin(jsonSelect, '-tags')
        modelDef.schema.methods.toHAL = function() {
                let halObj = helpers.makeHAL(this.toJSON(),
                        [{name: 'Contestants',
                        href: '/images/' + this.
                        id + '/contestants', title:
                        'Reviews'}])
                if(this.tags.length > 0) {
                        if(this.tags[0].toString().length != 24) {
                                halObj.addEmbed('tags', this.tags)
                        }
                }
                return halObj
        }
        return mongoose.model(modelDef.name, modelDef.schema)
}