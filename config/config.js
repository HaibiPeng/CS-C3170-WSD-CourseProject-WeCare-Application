let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
    config.database = {};
} else {
    config.database = {
        hostname: "lallah.db.elephantsql.com",
        database: "mfymahlj",
        user: "mfymahlj",
        password: "XqeePb2wkzPrcbJQoyn95xGLHRdkbCiK",
        port: 5432
    };
}

export { config }; 