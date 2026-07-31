define(['questAPI'], function(Quest){
    var API = new Quest();

    // Quest renders the three free-text "Other" answers as separate questions.
    // Move only their existing input elements into the matching option label;
    // Quest still owns the inputs and their values.
    function placeOtherInputsInline(){
        if (typeof document === 'undefined') return;

        if (!document.getElementById('inline-other-style')){
            var style = document.createElement('style');
            style.id = 'inline-other-style';
            style.textContent = [
                '.inline-other-answer { display: inline-flex; align-items: center; gap: 8px; margin-left: 4px; vertical-align: middle; }',
                '.inline-other-answer input, .inline-other-answer textarea { width: 260px; max-width: 100%; padding: 3px 4px; color: #333; background: transparent; border: 0; border-bottom: 1px solid #777; border-radius: 0; box-shadow: none; }',
                '.inline-other-answer input:focus, .inline-other-answer textarea:focus { border-color: #337ab7; outline: 0; box-shadow: 0 1px 0 #337ab7; }',
                '.inline-other-hidden-question { display: none !important; }',
                '@media (max-width: 600px) { .inline-other-answer { display: flex; margin: 8px 0 0; } .inline-other-answer input, .inline-other-answer textarea { width: 100%; } }'
            ].join('\n');
            document.head.appendChild(style);
        }

        var items = [
            {
                inputName: 'study_state_other',
                inputStem: 'Please enter the state in which you study.',
                optionText: 'I study in a state that is not listed above (specify)'
            },
            {
                inputName: 'gender_identity_other',
                inputStem: 'Please enter your gender identity.',
                optionText: 'Gender Identity not listed (specify)'
            },
            {
                inputName: 'race_other',
                inputStem: 'Please enter your race.',
                optionText: 'Other (specify)'
            }
        ];

        function cleanText(element){
            return (element && element.textContent || '').replace(/\s+/g, ' ').trim();
        }

        function hasText(element, text){
            return cleanText(element).indexOf(text) !== -1;
        }

        function visible(element){
            return !!(element && (element.offsetWidth || element.offsetHeight || element.getClientRects().length));
        }

        function containsAnyOptionText(element){
            for (var i = 0; i < items.length; i++){
                if (hasText(element, items[i].optionText)) return true;
            }
            return false;
        }

        function controlCount(element){
            return element.querySelectorAll('input:not([type="hidden"]), textarea, select, button, .btn').length;
        }

        function findOption(item){
            var candidates = document.querySelectorAll('[piq-page] .btn, [piq-page] button, [piq-page] label, [piq-page] [role="button"]');
            var match = null;
            Array.prototype.forEach.call(candidates, function(candidate){
                if (visible(candidate) && hasText(candidate, item.optionText)) match = candidate;
            });
            return match;
        }

        function findSafeQuestionBlock(input, item){
            var current = input.parentElement;
            while (current && current !== document.body && !current.hasAttribute('piq-page')){
                if (hasText(current, item.inputStem) && !containsAnyOptionText(current) && controlCount(current) <= 3){
                    return current;
                }
                current = current.parentElement;
            }
            return null;
        }

        function fieldMatchesName(field, inputName){
            var attrs = [
                field.getAttribute('name'),
                field.getAttribute('id'),
                field.getAttribute('ng-model'),
                field.getAttribute('data-ng-model')
            ].join(' ');
            return attrs.indexOf(inputName) !== -1;
        }

        function findInput(item){
            var fields = document.querySelectorAll('[piq-page] input:not([type="hidden"]), [piq-page] textarea');
            var fallback = null;

            for (var i = 0; i < fields.length; i++){
                if (fieldMatchesName(fields[i], item.inputName)) return fields[i];
                if (!fallback && findSafeQuestionBlock(fields[i], item)) fallback = fields[i];
            }

            return fallback;
        }

        function hideExactStemLabel(item){
            var candidates = document.querySelectorAll('[piq-page] label, [piq-page] p, [piq-page] span, [piq-page] div');
            Array.prototype.forEach.call(candidates, function(candidate){
                if (cleanText(candidate) === item.inputStem && controlCount(candidate) === 0){
                    candidate.classList.add('inline-other-hidden-question');
                }
            });
        }

        function moveInput(item){
            var input = findInput(item);
            if (!input || input.getAttribute('data-inline-other')) return;

            var option = findOption(item);
            if (!option) return;

            var inputQuestion = findSafeQuestionBlock(input, item);

            var inline = document.createElement('span');
            inline.className = 'inline-other-answer';
            inline.appendChild(document.createTextNode(':'));
            inline.appendChild(input);
            option.appendChild(inline);
            input.setAttribute('data-inline-other', 'true');

            if (inputQuestion) inputQuestion.classList.add('inline-other-hidden-question');
            hideExactStemLabel(item);

            // Focusing or typing in the field must not toggle the owning option.
            input.addEventListener('click', function(event){ event.stopPropagation(); });
            input.addEventListener('keydown', function(event){ event.stopPropagation(); });
        }

        function enhance(){
            items.forEach(moveInput);
        }

        var observer = new MutationObserver(enhance);
        observer.observe(document.body, {childList: true, subtree: true});
        enhance();
    }

    placeOtherInputsInline();

    /**
	* Page prototype
	*/
    API.addPagesSet('basicPage',{
        noSubmit:false, //Change to true if you don't want to show the submit button.
		header: 'Questionnaire',
		decline: false,
        //decline: true,
        //declineText: isTouch ? 'Decline' : 'Decline to Answer', 
        //autoFocus:true, 
        //progressBar:  'Page <%= pagesMeta.number %> out of 2'
	});
	
    API.addPagesSet('demographicsPage',{
        inherit: 'basicPage',
        header: 'Demographics and Screening Form'
    });
	
    /**
	* Question prototypes
	*/
    API.addQuestionsSet('basicQ',{
        //decline: 'true',
        decline: false,
		required : true, 		
        errorMsg: {
    //        required: isTouch 
    //            ? 'Please select an answer, or click \'Decline\'' 
    //            : 'Please select an answer, or click \'Decline to Answer\''
        	required: 'Please answer this question before submitting.'
		},
        autoSubmit:'true',
        numericValues:'true',
        help: '<%= pagesMeta.number < 3 %>',
        //helpText: 'Tip: For quick response, click to select your answer, and then click again to submit.'
    });

    API.addQuestionsSet('basicSelect',{
        inherit :'basicQ',
        type: 'selectOne'
    });
	
	    API.addQuestionsSet('demographicsSelect',{
        inherit: 'basicSelect',
        autoSubmit: false,
        required: false
    });

    API.addQuestionsSet('basicDropdown',{
        inherit :'basicQ',
        type : 'dropdown',
        autoSubmit:false
    });

	API.addQuestionsSet('basicText',{
        inherit :'basicQ',
        type : 'text',
        autoSubmit:false
    });

	    API.addQuestionsSet('demographicsText',{
        inherit: 'basicText',
        required: false
    });

    API.addQuestionsSet('basicMultiSelect',{
        inherit: 'basicQ',
        type: 'selectMulti',
        autoSubmit: false,
        errorMsg: {
            required: 'Please select at least one answer before submitting.'
        }
    });

    API.addQuestionsSet('demographicsMultiSelect',{
        inherit: 'basicMultiSelect',
        required: false
    });
	
	
    /**
	*Specific questions
	*/	

	//API.addQuestionsSet('age',{
    //    inherit : 'basicText',
       API.addQuestionsSet('educationStudent',{
        inherit: 'demographicsSelect',
        name: 'education_student',
        stem: 'Are you currently a student studying education?',
        answers: [
            {text: 'Yes', value: 'yes'},
            {text: 'No', value: 'no'}
        ]
    });

    API.addQuestionsSet('studentLevel',{
        inherit: 'demographicsSelect',
        name: 'student_level',
        stem: 'Are you an undergraduate or graduate student?',
        answers: [
            {text: 'Undergraduate', value: 'undergraduate'},
            {text: 'Graduate', value: 'graduate'}
        ]
    });

    API.addQuestionsSet('yearOfStudy',{
        inherit: 'demographicsSelect',
        name: 'year_of_study',
        stem: 'Please select your year of study.',
        answers: [
            {text: 'First Year', value: 'first_year'},
            {text: 'Second Year', value: 'second_year'},
            {text: 'Third Year', value: 'third_year'},
            {text: 'Fourth Year', value: 'fourth_year'},
            {text: 'Fifth Year', value: 'fifth_year'}
        ]
    });

    API.addQuestionsSet('studyState',{
        inherit: 'demographicsSelect',
        name: 'study_state',
        stem: 'Please select the state in which you study.',
        answers: [
            {text: 'Connecticut', value: 'CT'},
            {text: 'Maine', value: 'ME'},
            {text: 'Massachusetts', value: 'MA'},
            {text: 'New Hampshire', value: 'NH'},
            {text: 'New Jersey', value: 'NJ'},
            {text: 'New York', value: 'NY'},
            {text: 'Pennsylvania', value: 'PA'},
            {text: 'Rhode Island', value: 'RI'},
            {text: 'Vermont', value: 'VT'},
            {text: 'I study in a state that is not listed above (specify)', value: 'other'}
        ]
    });

    API.addQuestionsSet('studyStateOther',{
        inherit: 'demographicsText',
        name: 'study_state_other',
        required: false,
        stem: 'Please enter the state in which you study.'
    });

    API.addQuestionsSet('dateOfBirth',{
        inherit: 'demographicsText',
        name: 'date_of_birth',
        stem: 'Please enter your date of birth.',
        inputType: 'date'
    });

    API.addQuestionsSet('age',{
        inherit: 'demographicsText',
		name: 'age',
    //    stem: 'What is your age?'
	     stem: 'What is your age? (years)',
        inputType: 'number',
        min: 1,
        max: 120,
        step: 1,
        pattern: '^[0-9]+$',
        errorMsg: {
            required: 'Please enter your age as a whole number.',
            pattern: 'Please enter your age as a whole number.'
        }
    });

     API.addQuestionsSet('sexAssignedAtBirth',{
        inherit: 'demographicsSelect',
        name: 'sex_assigned_at_birth',
        stem: 'What is your sex assigned at birth?',
        answers: [
            {text: 'Male', value: 'male'},
            {text: 'Female', value: 'female'},
            {text: 'Intersex', value: 'intersex'}
        ]
    });

         API.addQuestionsSet('genderIdentity',{
        inherit: 'demographicsSelect',
        name: 'gender_identity',
        stem: 'What is your gender?',
        answers: [
            {text: 'Male', value: 'male'},
            {text: 'Female', value: 'female'},
            {text: 'Trans-male', value: 'trans_male'},
            {text: 'Trans-female', value: 'trans_female'},
            {text: 'Non-binary', value: 'non_binary'},
            {text: 'Gender Identity not listed (specify)', value: 'other'}
        ]
    });

    API.addQuestionsSet('genderIdentityOther',{
        inherit: 'demographicsText',
        name: 'gender_identity_other',
        required: false,
        stem: 'Please enter your gender identity.'
    });

    API.addQuestionsSet('race',{
        inherit: 'demographicsMultiSelect',
        name: 'race',
        stem: 'Please select your race. You may select more than one option.',
        answers: [
            {text: 'American Indian or Alaska Native', value: 'american_indian_alaska_native'},
            {text: 'Asian', value: 'asian'},
            {text: 'Black or African American', value: 'black_african_american'},
            {text: 'Native Hawaiian or Other Pacific Islander', value: 'native_hawaiian_pacific_islander'},
            {text: 'White', value: 'white'},
            {text: 'Other (specify)', value: 'other'}
        ]
    });

    API.addQuestionsSet('raceOther',{
        inherit: 'demographicsText',
        name: 'race_other',
        required: false,
        stem: 'Please enter your race.'
    });

    API.addQuestionsSet('ethnicity',{
        inherit: 'demographicsSelect',
        name: 'ethnicity',
        stem: 'Please select your ethnicity.',
        answers: [
            {text: 'Hispanic/Latinx', value: 'hispanic_latinx'},
            {text: 'Non-Hispanic/Latinx', value: 'non_hispanic_latinx'}
        ]
    });

    API.addQuestionsSet('englishComprehension',{
        inherit: 'demographicsSelect',
        name: 'english_comprehension',
        stem: 'Are you able to read and understand English?',
        answers: [
            {text: 'Yes', value: 'yes'},
            {text: 'No', value: 'no'}
        ]
    });

    API.addQuestionsSet('keyboardDevice',{
        inherit: 'demographicsSelect',
        name: 'keyboard_device',
        stem: 'Are you able to complete this study on a personal device with a keyboard?',
        answers: [
            {text: 'Yes', value: 'yes'},
            {text: 'No', value: 'no'}
        ]
	}); 

    API.addSequence([{
        inherit: 'demographicsPage',
        questions: [
            {inherit: 'educationStudent'},
            {inherit: 'studentLevel'},
            {inherit: 'yearOfStudy'},
            {inherit: 'studyState'},
            {inherit: 'studyStateOther'},
            {inherit: 'dateOfBirth'},
            {inherit: 'age'},
            {inherit: 'sexAssignedAtBirth'},
            {inherit: 'genderIdentity'},
            {inherit: 'genderIdentityOther'},
            {inherit: 'race'},
            {inherit: 'raceOther'},
            {inherit: 'ethnicity'},
            {inherit: 'englishComprehension'},
            {inherit: 'keyboardDevice'}
        ]
    }]);

    return API.script;
});
