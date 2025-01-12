const handleGetProfile = (req, res) => {
    const data = {
        user: req.user,
        active: 'profile'
    }
    res.render("pages/profile", { ...data });
} 

module.exports = { handleGetProfile };