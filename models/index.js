module.exports = function(db) {
	return {
		"Image": require("./image")(db),
		"Tag": require("./tag")(db),
		"Contestant": require("./contestant")(db),
		"Show": require("./show")(db)
	}
}