module.exports = {
        "id": "Tag",
        "properties": {
                "name": {
                        "type": "string",
                        "description": "Name of the tag"
                },
                "images": {
                        "type":"array",
                        "description":"List of images that are linked to this tag",
                        "items": {
                                "$ref": "Image"
                        }
                }
        }
}