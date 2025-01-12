const handleGetLogin = (req, res) => {
    res.render("pages/auth/login");
}

const handleGetLogout = (req, res) => {
    req.logout( (err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Error during logout');
        }
        req.session.destroy();
        res.clearCookie('jwt');
        res.redirect('/');
    });
}

module.exports = {
    handleGetLogin,
    handleGetLogout
};