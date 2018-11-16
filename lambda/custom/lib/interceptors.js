const RequestPersistenceInterceptor = {
	process(handlerInput) {
		
		if (handlerInput.requestEnvelope.session['new']) {
			
			return new Promise((resolve, reject) => {
				
				handlerInput.attributesManager.getPersistentAttributes()
				
				.then((sessionAttributes) => {
					sessionAttributes = sessionAttributes || {};
					
					handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
					resolve();
					
				}).catch((err) => {
					reject(err);
				});
				
			});
			
		}
	}
};


const ResponsePersistenceInterceptor = {
	process(handlerInput, responseOutput) {
		
		const ses = (typeof responseOutput.shouldEndSession == "undefined" ? true : responseOutput.shouldEndSession);
		
		if (ses || handlerInput.requestEnvelope.request.type == 'SessionEndedRequest') { // skill was stopped or timed out 
			
			let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
			
			handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
			
			return new Promise((resolve, reject) => {
				handlerInput.attributesManager.savePersistentAttributes()
				.then(() => {
					resolve();
				})
				.catch((err) => {
					reject(err);
				});
				
			});
			
		}
		
	}
};

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const { languageStrings } = require('./languageStrings');

LocalizationInterceptor = {
	process(handlerInput) {
		const localizationClient = i18n.use(sprintf).init({
			lng: handlerInput.requestEnvelope.request.locale,
			resources: languageStrings,
		});
		localizationClient.localize = function localize() {
			const args = arguments;
			const values = [];
			for (let i = 1; i < args.length; i += 1) {
				values.push(args[i]);
			}
			const value = i18n.t(args[0], {
				returnObjects: true,
				postProcess: 'sprintf',
				sprintf: values,
			});
			if (Array.isArray(value)) {
				return value[Math.floor(Math.random() * value.length)];
			}
			return value;
		};
		const attributes = handlerInput.attributesManager.getRequestAttributes();
		attributes.t = function translate(...args) {
			return localizationClient.localize(...args);
		};
	},
};


module.exports = {
	RequestPersistenceInterceptor,
	ResponsePersistenceInterceptor,
	LocalizationInterceptor
}