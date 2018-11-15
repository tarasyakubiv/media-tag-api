module.exports = {
        "id": "Contestant",
        "properties": {
                "name": {
                        "type": "string",
                        "description": "Full name of the contestant"
                },
                "description": {
                        "type": "string",
                        "description": "Short bio or other description"
                },
                "shows": {
                        "type":"array",
                        "description":"List of shows this contestant has been on",
                        "items": {
                                "$ref": "Show"
                        }
                },
                "images": {
                        "type":"array",
                        "description":"List of images linked to this contestant",
                        "items": {
                                "$ref": "Image"
                        }
                }
        }
}