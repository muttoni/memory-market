
/**
 * Returns a random value from an input Array
 * @param {Array} array 
 * @returns {*} A random value from array
 */
function randomElement(array) {
	return (array[Math.floor(Math.random() * array.length)]);
}

/**
 * Returns an Object containing a key for each slot name, with .heardAs (raw value), 
 * .resolved (if there is a synonym match), and .ERstatus (whether there was a match)
 * @param {Object} filledSlots 
 * @returns {Object} An object containing .heardAs, .resolved, .ERstatus
 */
function getSlotValues(filledSlots) {
	const slotValues = {};

	Object.keys(filledSlots).forEach((item) => {
		const name = filledSlots[item].name;

		if (filledSlots[item] &&
			filledSlots[item].resolutions &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
			switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
				case 'ER_SUCCESS_MATCH':
					slotValues[name] = {
						heardAs: filledSlots[item].value,
						resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
						ERstatus: 'ER_SUCCESS_MATCH'
					};
					break;
				case 'ER_SUCCESS_NO_MATCH':
					slotValues[name] = {
						heardAs: filledSlots[item].value,
						resolved: '',
						ERstatus: 'ER_SUCCESS_NO_MATCH'
					};
					break;
				default:
					break;
			}
		} else {
			slotValues[name] = {
				heardAs: filledSlots[item].value || '', // may be null 
				resolved: '',
				ERstatus: ''
			};
		}
	}, this);

	return slotValues;
}

/**
 * Checks whether a display is supported.
 * @param {Object} handlerInput The handlerInput from the incoming request
 * @returns {bool} Boolean whether or not it supports a display
 */
function supportsDisplay(handlerInput) // returns true if the skill is running on a device with a display (Echo Show, Echo Spot, etc.) 
{                                      //  Enable your skill for display as shown here: https://alexa.design/enabledisplay 
	const hasDisplay =
		handlerInput.requestEnvelope.context &&
		handlerInput.requestEnvelope.context.System &&
		handlerInput.requestEnvelope.context.System.device &&
		handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
		handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;

	return hasDisplay;
}

/**
 * Helps create SSML tags by specifying parameters.
 * @param {string} type The type of SSML tag to use
 * @param {string} argument The value of the main control of the tag (e.g. break time, effect type)
 * @param {string} content The content to be wrapped around by tags
 */
function ssml(type, argument, content) {
	switch (type) {
		case 'say-as':
			return `<say-as interpret-as="${argument}">${content}</say-as>`
			break;
		case 'phoneme':
			return `<phoneme alphabet="ipa" ph="${argument}">${content}</say-as>`
			break;
		case 'audio' :
			return `<audio src="${argument}" />`
			break;
		case 'emphasis' :
			return `<emphasis level="${argument}">${content}</emphasis>`
			break;
		case 'break' :
			return `<break time="${argument}" />`
			break;
		case 'amazon:effect':
			return `<amazon:effect name="${argument}">${content}</amazon:effect>`
			break;
		default:
			return content;
			break;
	}
}

/**
* Shuffles an Array using a Fisher-Yates shuffle
* @param {Array} array
* @returns {Array} The shuffled copy of the array
*/

function shuffleArray(array) {

	let copy = [], n = array.length, i;

	// While there remain elements to shuffle…
	while (n) {

		// Pick a remaining element…
		i = Math.floor(Math.random() * array.length);

		// If not already shuffled, move it to the new array.
		if (i in array) {
			copy.push(array[i]);
			delete array[i];
			n--;
		}
	}

	return copy;
}

module.exports = {
	randomElement,
	getSlotValues,
	supportsDisplay,
	ssml,
	shuffleArray
}
