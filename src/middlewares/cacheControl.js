const preventCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    // console.log(`[Middleware] Cache-Control headers applied to ${req.originalUrl}`);
    next();
};

module.exports = { preventCache };
