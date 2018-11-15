module.exports = {
        "id": "Show",
        "properties": {
                "name": {
                        "type": "string",
                        "description": "Name of the show and a season"
                },
                "description": {
                        "type": "string",
                        "description": "Short description"
                },
                "contestants": {
                        "type":"array",
                        "description":"List of contestants on this show",
                        "items": {
                                "$ref": "Contestant"
                        }
                },
                "images": {
                        "type":"array",
                        "description":"List of images linked to this show",
                        "items": {
                                "$ref": "Image"
                        }
                }
        }
}