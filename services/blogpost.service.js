const { text } = require('express');
const PostModel = require('../models/post.model');

const CreatePost = async ({
    title,
    description,
    tags,
    author,
    state,
    readCount,
    readingTime,
    body,
    }) => {
    const post = new PostModel({
        title,
        description,
        tags,
        author,
        state: state || 'draft',
        readCount: readCount.
        readingTime,
        body,
    });
    
    return await post.save();
};

module.exports = {
    CreatePost
}