const WPM = 183 // Average reading speed in words per minute

function estimateReadingTime(body) {
    if (!body || typeof body !== 'string') {
        return "0 min";
    }

    // Split the body into words and filter out empty strings
    const words = body.trim().split(/\s+/).filter(word => word.length > 0);

    // Calculate the number of words
    const wordCount = words.length;

    // Calculate reading time in minutes
    const minutes = Math.ceil(wordCount / WPM);

    return `${minutes} min`;
};

module.exports = { estimateReadingTime };