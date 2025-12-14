(err, req, res, next) => {
	console.error(err && err.stack ? err.stack : err);
	const status = err && err.statusCode ? err.statusCode : 500;
	res.status(status).json({
		success: false,
		message: err && err.message ? err.message : "Internal Server Error",
		errors: err && err.errors ? err.errors : [],
	});
};

export default (err, req, res, next) => {
	console.error(err && err.stack ? err.stack : err);
	const status = err && err.statusCode ? err.statusCode : 500;
	res.status(status).json({
		success: false,
		message: err && err.message ? err.message : "Internal Server Error",
		errors: err && err.errors ? err.errors : [],
	});
};
