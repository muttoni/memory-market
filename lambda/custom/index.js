const Alexa = require("ask-sdk");

// handlers
const {
    FallbackIntentHandler,
    CancelIntentHandler,
    HelpIntentHandler,
    StopIntentHandler,
    NavigateHomeIntentHandler,
    AnswerIntentHandler,
    LaunchRequestHandler,
    SessionEndedHandler,
    ErrorHandler
} = require('./lib/handlers')

// interceptors 
const {
    RequestPersistenceInterceptor,
    ResponsePersistenceInterceptor,
    LocalizationInterceptor
} = require('./lib/interceptors')

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    // reginster the handlers
    .addRequestHandlers(
        AnswerIntentHandler,
        LaunchRequestHandler, 
        CancelIntentHandler, 
        HelpIntentHandler, 
        StopIntentHandler, 
        NavigateHomeIntentHandler, 
        FallbackIntentHandler, 
        SessionEndedHandler
    )
    .addErrorHandlers(ErrorHandler)

    .addRequestInterceptors(RequestPersistenceInterceptor, LocalizationInterceptor)
    .addResponseInterceptors(ResponsePersistenceInterceptor)

    .withTableName("memory-market")
    .withAutoCreateTable(true)

    .lambda();

