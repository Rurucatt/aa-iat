

define(['pipAPI','./iat10lib.js'], function(APIConstructor, iatExtension){
    
    let API = new APIConstructor();
    let global = API.getGlobal();
      
    return iatExtension({
        blockAttributes_nTrials: 12, // trial number of block 1
		blockAttributes_nMiniBlocks: 6, // 14/7=2 trials per mini-block (must be divisible)
		
        blockCategories_nTrials: 12, // block 2
		blockCategories_nMiniBlocks: 6, // 14/7=2 trials per mini-block (must be divisible)
		
        blockFirstCombined_nTrials: 24, // block 3,6
		blockFirstCombined_nMiniBlocks: 6, // combined blocks are generated in groups of 4 trials
		
        blockSecondCombined_nTrials: 48, // block 4,7
		blockSecondCombined_nMiniBlocks: 6,
		
        blockSwitch_nTrials: 24,  // block 5, switch
		blockSwitch_nMiniBlocks: 6,

		randomAttSide: true, // Randomize whether Bad/Good Student starts on the left or right.

		//attributeFirstInBlocks: [4, 6], // make the first stimulus a word in blocks 4 and 6
		
        category1 : {
            name : global.asianLabels, //Will appear in the data.
            title : {
                media : {word : global.asianLabels}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {image: 'FAS04.jpg'},
                {image: 'FAS05.jpg'},
                {image: 'FAS07.jpg'},
                {image: 'MAS01.jpg'},                
                {image: 'MAS03.jpg'},
                {image: 'MAS06.jpg'}
            ],
            //Stimulus css (style)
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },    
        category2 : {
            name : global.whiteLabels, //Will appear in the data.
            title : {
                media : {word : global.whiteLabels}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {image: 'FEA15.jpg'},
                {image: 'FEA23.jpg'},
                {image: 'FEA36.jpg'},
                {image: 'MEA06b.jpg'},
                {image: 'MEA11.jpg'},
                {image: 'MEA14.jpg'},
            ],
            //Stimulus css (style)
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },
        attribute1 : {
            name : 'Bad Student',
            title : {
                media : {word : 'Bad Student'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: global.negWords[0]},
                {word: global.negWords[1]},
                {word: global.negWords[2]},
                {word: global.negWords[3]},
                {word: global.negWords[4]},
                {word: global.negWords[5]},
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        attribute2 : {
            name : 'Good Student',
            title : {
                media : {word : 'Good Student'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: global.posWords[0]},
                {word: global.posWords[1]},
                {word: global.posWords[2]},
                {word: global.posWords[3]},
                {word: global.posWords[4]},
                {word: global.posWords[5]},
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        base_url : {//Where are your images at?
            image : global.baseURL
        },
        isTouch : global.$isTouch
    });
});
