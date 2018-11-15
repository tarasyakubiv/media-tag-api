module.exports = {
        "id": "Image",
        "properties": {
                "image_link": {
                        "type": "string",
                        "description": "Link to full image on cdn/repository"
                },
                "thumb_link": {
                        "type": "string",
                        "description": "Link to thumbnail image (if present) on cdn/repository"
                },
                "source_link": {
                        "type": "string",
                        "description": "Link to a page where image was posted initially"
                },
                "show": {
                        "type": "object",
                        "description": "Show this image is from",
                        "$ref": "Show"
                },
                "contestants": {
                        "type":"array",
                        "description":"List of contestants of the show that are present in the image",
                        "items": {
                                "$ref": "Contestant"
                        }
                },
                "tags": {
                        "type":"array",
                        "description":"List of tags linked to this image",
                        "items": {
                                "$ref": "Tag"
                        }
                }
        }
}