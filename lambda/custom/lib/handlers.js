// Including some helper functions
const {
	randomElement,
	getSlotValues,
	supportsDisplay,
	ssml
} = require('./helpers')

const  {
	calculateScore,
	getSlotValueArray,
	SOUNDS
} = require('./game')

const {
	items
} = require('./languageStrings')
/*

{
	state: ‘STARTED’, ‘IN_PROGRESS’, ‘FAILED’,
	level: ‘EASY’, ‘MEDIUM’, ‘HARD’, ‘IMPOSSIBLE’,
	aisle: vegetables, fruits, meats, frozen, sweets, household supplies, seasonal
	trolley: [carrots, aubergine, … ]
	current_question_index: 0,1,2
	current_question_text: ‘blablablabla’
	current_answer: ‘carrots’ (etc)
	number_of_failed_attempts: 0 (will increment)
	number_of_passed_attempts: 0 (will increment)
	highest_score: (which will be updated at the end of any game)
}

*/

// Handlers
const LaunchRequestHandler = {
	canHandle(handlerInput) {

		const request = handlerInput.requestEnvelope.request;
		return request.type === 'LaunchRequest';
	},
	async handle(handlerInput) {
		
		const responseBuilder = handlerInput.responseBuilder;
		const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		console.log('LaunchRequest', sessionAttributes);

		// Check if user is a first time user
		let sayPrefix = ssml('audio', SOUNDS.INTRO);
		let say = sayPrefix;

		if(!sessionAttributes.return_user) {
			say += requestAttributes.t('FIRST_WELCOME');
			sessionAttributes.return_user = true;
		} else {
			say += requestAttributes.t('RETURN_WELCOME')
		}

		// add the bridge
		say += requestAttributes.t('GAME_INTRO');
		say += requestAttributes.t('LEVEL_1');

		// in HERE THERE WILL BE A QUESTION
		// <-- CHOOSE A RANDOM ITEM (and update trolley.)
		let aisle = requestAttributes.t('AISLES'); // e.g. VEGETABLES
		sessionAttributes.aisle = aisle;

		let item = randomElement(items[aisle]);
		say += requestAttributes.t('ADD_TO_TROLLEY', item); 
		sessionAttributes.trolley = [item];
		
		say += requestAttributes.t('QUESTION_FINISHER');

		// formulate the first question
		sessionAttributes.current_question_index = 1;
		sessionAttributes.level = 1;


		//say += `We are on the ${ssml('say-as', 'ordinal', sessionAttributes.current_question_index)} level. `

		// set attributes
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		return responseBuilder
		.speak(say)
		.reprompt('try again, ' + say)
		.getResponse();
	},
};


const AnswerIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AnswerIntent';
	},
	async handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		let requestAttributes = handlerInput.attributesManager.getRequestAttributes();

		/*
		
		slotValues = {
			itemA: {
				heardAs: 'carrots'
			},
			itemB: {
				heardAs: 'aubergine'
			},
			itemC: {
				heardAs: 'celery'
			},
		}

		const { textToSpeech } = require('./polly')
		let pollyfiedSay = await textToSpeech({ voiceId: 'Brian', text: say });
		*/
		let slotValues = getSlotValues(request.intent.slots);

		let slotArray = getSlotValueArray(slotValues);
		console.log('slotArray::', slotArray);
		let score = calculateScore(slotArray, sessionAttributes.trolley, sessionAttributes.level || 1);
		sessionAttributes.score = sessionAttributes.score + score;


		
		// generate another question
		let aisle = sessionAttributes.aisle;

		let item = randomElement(items[aisle]);

		// formulate the first question
		sessionAttributes.current_question_index = sessionAttributes.current_question_index + 1;


		let say = `I heard the following values: ${slotArray.join(", ")}. `;
		say += requestAttributes.t('SCORE_UPDATE', score);

		const { AlexaPolly } = require('alexa-polly');
		const CONFIG = require('./config');

		const polly = AlexaPolly({
			awsRegion: CONFIG.AWS_REGION,
			bucketName: CONFIG.POLLY_S3_BUCKET,
			defaultVoice: 'Brian'
		});

		let announcement = ssml('audio', SOUNDS.ANNOUNCEMENT) + ssml('audio', await polly.say(requestAttributes.t('RANDOM_ANNOUNCEMENTS'), 'Carla'));

		say += requestAttributes.t('ADD_TO_TROLLEY', item);
		sessionAttributes.trolley.push(item);

		say += announcement;
		say += requestAttributes.t('QUESTION_FINISHER');
		
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

		return responseBuilder
		.speak(say)
		.reprompt('I did not hear that.' + say)
		.getResponse();
	},
};

const HelpIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		let say = 'You asked for help. ';
		
		return responseBuilder
		.speak(say)
		.reprompt('try again, ' + say)
		.getResponse();
	},
};

const StopIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		let say = 'Okay, talk to you later! ';
		
		return responseBuilder
		.speak(say)
		.withShouldEndSession(true)
		.getResponse();
	},
};

const FallbackIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		return responseBuilder
		.speak('Sorry I didnt catch that. Try again')
		.reprompt('Sorry I didnt catch that. Try again')
		.getResponse();
	},
};

const CancelIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		let say = 'Okay, talk to you later! ';
		
		return responseBuilder
		.speak(say)
		.withShouldEndSession(true)
		.getResponse();
	},
};

const NavigateHomeIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		let say = 'Hello from AMAZON.NavigateHomeIntent. ';
		
		return responseBuilder
		.speak(say)
		.reprompt('try again, ' + say)
		.getResponse();
	},
};


const SessionEndedHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
		return handlerInput.responseBuilder.getResponse();
	}
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		const request = handlerInput.requestEnvelope.request;
		
		console.log(`Error handled: ${error.message}`);
		// console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
		
		return handlerInput.responseBuilder
		.speak(`Sorry, your skill got this error.  ${error.message} `)
		.reprompt(`Sorry, your skill got this error.  ${error.message} `)
		.getResponse();
	}
};


module.exports = {
	FallbackIntentHandler,
	CancelIntentHandler,
	HelpIntentHandler,
	StopIntentHandler,
	NavigateHomeIntentHandler,
	AnswerIntentHandler,
	LaunchRequestHandler,
	SessionEndedHandler,
	ErrorHandler
}