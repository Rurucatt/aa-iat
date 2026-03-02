

define(['pipAPI','./iat10lib.js'], function(APIConstructor, iatExtension){
    
    let API = new APIConstructor();
    let global = API.getGlobal();
      
    return iatExtension({
        blockAttributes_nTrials: 14, // trial number of block 1
		blockAttributes_nMiniBlocks: 2, // 14/2=7 trials per mini-block (must be divisible)
		
        blockCategories_nTrials: 14, // block 2
		blockCategories_nMiniBlocks: 2, // 14/2=7 trials per mini-block (must be divisible)
		
        blockFirstCombined_nTrials: 28, // block 3,6
		blockFirstCombined_nMiniBlocks: 4, // combined blocks are generated in groups of 4 trials
		
        blockSecondCombined_nTrials: 42, // block 4,7
		blockSecondCombined_nMiniBlocks: 7,
		
        blockSwitch_nTrials: 28,  // block 5, switch
		blockSwitch_nMiniBlocks: 4,

		attributeFirstInBlocks: [4, 6], // make the first stimulus a word in blocks 4 and 6
		
        category1 : {
            name : global.asianLabels, //Will appear in the data.
            title : {
                media : {word : global.asianLabels}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {image: 'am00001.png'},
                {image: 'am00002.png'},
                {image: 'am00003.png'},
                {image: 'am00004.png'},
                {image: 'af00001.png'},
                {image: 'af00002.png'},                 
                {image: 'af00003.png'},
                {image: 'af00004.png'}
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
                {image: 'wm00001.png'},
                {image: 'wm00002.png'},
                {image: 'wm00003.png'},
                {image: 'wm00004.png'},
                {image: 'wf00001.png'},
                {image: 'wf00002.png'},
                {image: 'wf00003.png'},
                {image: 'wf00004.png'},
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
                {word: global.negWords[6]},
                {word: global.negWords[7]},
                {word: global.negWords[8]}
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
                {word: global.posWords[6]},
                {word: global.posWords[7]},
                {word: global.posWords[8]}
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
