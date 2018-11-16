
const languageStrings = {
	'en' : {
		translation : {
			'FIRST_WELCOME': `Hello. Welcome to the Alexa Assistant Training Program. 
			All prospective assistants to the voice assistant are put through this mandatory memory training programme. 
			Although a perfect score will not guarantee your placement, a less-than-perfect score will result in failure.
			You are however free to attempt this training programme as often as you would like. `,
			
			'RETURN_WELCOME' : [
				'Welcome back. ',
				'You again? '
			],
			
			'GAME_INTRO': [ 
				`I will not wait for you to be ready. Assistants should always be ready. We are getting started. `,
				`We are starting immediately. You better be ready. `,
			],
			
			'AISLES' : [
				'VEGETABLES',
				'FRUITS',
				'MEATS'
			],
			
			'ADD_TO_TROLLEY' : [
				'I add %s to my trolley. Despite being overly confident with my choice initially, I start to doubt it. But I stick with it in the end. ',
				'After much debate, I decide that I am one hundred percent commited to adding %s to my trolley. Please note that down. In your mind. ',
				'I walk along the aisle and I daydream about what I will eat. I decide that %s will hit the spot. I add it to my trolley. ',
			],

			'LEVEL_1' : [ // always add one item in the trolley
				'Let us start off easy. '
			],
			
			'LEVEL_2': [ // always keep the second item in the trolley
				'Now we will make things a little harder. '
			],
			
			'LEVEL_3' : [ // always keep two items in the trolley
				'Ok, now unto the hard stuff.'
			],

			'SCORE_UPDATE' : [
				'You have %s points. '
			],
			
			'QUESTION_FINISHER' : [
				'What is left in the cart? ',
				'Can you remember what is left? ',
				'What is left? ',
				'Can you remember what is left? '
			],
			'RANDOM_ANNOUNCEMENTS' : [
				'Shoppers: don’t miss our in-store special on Kellogg’s cereal.  Check out aisle 5 and stock up today! ',
				'Planning a special event?  Be sure to visit our catering department – from salads and sandwiches, to hot and cold platters. ',
				'Have you tried our online shopping?  If your “grocery” list won’t fit on your “to do” list, then log on today!  Push a button instead of a shopping cart. ',
				'We are committed to helping families live healthier, which is why you’ll find a wide assortment of quality fresh and packaged organic products.  Look for our signs throughout the store! ',
				'Attention, spillage on Aisle 2. Please get someone with a mop there as soon as possible. Something is leaking profusely. ',
				'Attention: this is an announcement. Please continue shopping. ',
			],
			
			'FAILURE' : [
				'You failed. As expected. ',
				'Thanks for trying, although I am not sure what I should be thankful for. ',
			],
			
			'SUCCESS' : [
				'I was not expecting you to complete the challenge. Congratulations. You are eligible to become assistant to the assistant there are %s people in front of you in the queue. '
			]
		}
	},
	
	'de' : {
		translation: {
			
		}
	},
	
	'fr' : {
		translation: {
			
		}
	}, 
	
	'it' : {
		translation: {
			
		}
	},
	
	'es' : {
		translation: {
			
		}
	}
}

const items = {
	'VEGETABLES' : [
		'potatoes',
		'tomatoes',
		'onions',
		'carrots',
		'lettuce',
		'broccoli',
		'bell peppers',
		'celery',
		'cucumbers',
		'corn',
		'garlic',
		'mushrooms',
		'sweet potatoes',
		'spinach',
		'cabbage',
		'green beans',
		'cauliflower',
		'green onions',
		'asparagus',
	],
	
	'FRUITS' : [
		'bananas',
		'apples',
		'grapes',
		'strawberries',
		'oranges',
		'watermelon',
		'lemons',
		'blueberries',
		'peaches',
		'cantaloupe',
		'avocados',
		'pineapple',
		'cherries',
		'pears',
		'limes',
		'raspberries',
		'blackberries',
		'plums',
		'nectarines',
		'grapefruit',
	],
	
	'MEATS' : [
		'beef',
		'chicken',
		'prawns',
		'crab',
		'turkey',
		'lemon sole',
		'ground beef',
		'duck',
		'tuna',
		'salmon',
		'shell fish',
		'lamb',
		'goat meat',
		'shrimp',
		'sheep',
		'lobster',
		'halibut',
		'scallops',
		'cod',
	],
}

module.exports = {
	languageStrings,
	items
}