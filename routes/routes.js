function setup(app, handlers){
    app.get('/auth/linkedin', handlers.auth.linkedInSignIn);
    app.get('/auth/linkedin/callback', handlers.auth.linkedInSignInCallback);
}

exports.setup = setup;