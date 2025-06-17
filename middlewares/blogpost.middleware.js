const Joi = require('joi');

// Schema for creating a new blog post.
const createPostSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': `"title" should be a type of 'text'`,
            'string.empty': `"title" cannot be an empty field`,
            'string.min': `"title" should have a minimum length of {#limit}`,
            'string.max': `"title" should have a maximum length of {#limit}`,
            'any.required': `"title" is a required field`
        }),
    description: Joi.string()
        .min(10)
        .max(255)
        .required(),
    tags: Joi.array()
        .items(Joi.string())
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one tag is required.'
        }),
    body: Joi.string()
        .min(20)
        .required(),
    state: Joi.string()
        .valid('draft', 'published')
        .optional() // It has a default value in the model, so it's optional here.
});

// Schema for updating an existing blog post. All fields are optional.
const updatePostSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .optional(),
    description: Joi.string()
        .min(10)
        .max(255)
        .optional(),
    tags: Joi.array()
        .items(Joi.string())
        .min(1)
        .optional(),
    body: Joi.string()
        .min(20)
        .optional(),
    state: Joi.string()
        .valid('draft', 'published')
        .optional()
}).min(1).messages({ // At least one field must be provided to update.
    'object.min': 'To update a post, you must provide at least one field to change.'
});


// Middleware function to validate post creation
const validateCreatePost = (req, res, next) => {
    const { error } = createPostSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            error: errorMessages
        });
    }

    next();
};

// Middleware function to validate post update
const validateUpdatePost = (req, res, next) => {
    const { error } = updatePostSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            error: errorMessages
        });
    }

    next();
};


module.exports = {
    validateCreatePost,
    validateUpdatePost
};
