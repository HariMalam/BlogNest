function convertToEmbed(link) {
    if (link.includes("watch?v=")) {
        return link.replace("watch?v=", "embed/");
    } else {
        return null;
    }
}

module.exports = convertToEmbed;