define(['questAPI'], function(Quest){
    var API = new Quest();

    function todayISO(){
        var today = new Date();
        var month = String(today.getMonth() + 1);
        var day = String(today.getDate());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return today.getFullYear() + '-' + month + '-' + day;
    }

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
                '.inline-other-option, .inline-other-option.active, .inline-other-option.active:hover, .inline-other-option.active:focus, .inline-other-option:active, .inline-other-option:active:hover, .inline-other-option:active:focus { color: #333 !important; background: #fff !important; border-color: #ccc !important; box-shadow: none !important; text-shadow: none !important; }',
                '.inline-other-option.active .inline-other-answer input, .inline-other-option:active .inline-other-answer input, .inline-other-option.active .inline-other-answer textarea, .inline-other-option:active .inline-other-answer textarea { color: #333 !important; background: transparent !important; border-bottom-color: #337ab7 !important; }',
                '.demographics-choice-option, .demographics-choice-option:hover, .demographics-choice-option:focus, .demographics-choice-option:active, .demographics-choice-option.active, .demographics-choice-option.btn-primary, .demographics-choice-option.btn-info { display: block; width: 100%; margin: 6px 0; padding: 6px 10px 6px 34px; color: #222 !important; background: #fff !important; border: 0 !important; box-shadow: none !important; text-align: left; white-space: normal; position: relative; }',
                '.demographics-choice-option::before { content: ""; position: absolute; left: 8px; top: 50%; width: 16px; height: 16px; margin-top: -8px; border: 1.5px solid #777; background: #fff; }',
                '.demographics-choice-option.radio-choice-option::before { border-radius: 50%; }',
                '.demographics-choice-option.multi-choice-option::before { border-radius: 3px; }',
                '.demographics-choice-option.active::after, .demographics-choice-option.btn-primary::after, .demographics-choice-option.btn-info::after, .demographics-choice-option[aria-pressed="true"]::after, .demographics-choice-option[aria-checked="true"]::after { content: ""; position: absolute; left: 12px; top: 50%; width: 8px; height: 8px; margin-top: -4px; background: #337ab7; }',
                '.demographics-choice-option.radio-choice-option.active::after, .demographics-choice-option.radio-choice-option.btn-primary::after, .demographics-choice-option.radio-choice-option.btn-info::after, .demographics-choice-option.radio-choice-option[aria-pressed="true"]::after, .demographics-choice-option.radio-choice-option[aria-checked="true"]::after { border-radius: 50%; }',
                '.demographics-choice-option.multi-choice-option.active::after, .demographics-choice-option.multi-choice-option.btn-primary::after, .demographics-choice-option.multi-choice-option.btn-info::after, .demographics-choice-option.multi-choice-option[aria-pressed="true"]::after, .demographics-choice-option.multi-choice-option[aria-checked="true"]::after { border-radius: 2px; }',
                '.demographics-question-stem { font-weight: 700 !important; }',
                '.demographics-question-stem::before, .demographics-question-stem::after { content: none !important; }',
                '.demographics-question-stem.demographics-required-stem::before { content: "*" !important; display: inline-block; margin-right: 6px; color: #c9302c; font-weight: 700; }',
                '.demographics-scroll-target { outline: 2px solid rgba(201, 48, 44, 0.35); outline-offset: 4px; }',
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

        var questionStems = [
            'Are you currently a student studying education?',
            'Are you an undergraduate or graduate student?',
            'Please select your year of study.',
            'Please select the state in which you study.',
            'Please enter the state in which you study.',
            'Please enter your date of birth.',
            'What is your age? (years)',
            'What is your sex assigned at birth?',
            'What is your gender?',
            'Please enter your gender identity.',
            'Please select your race. You may select more than one option.',
            'Please enter your race.',
            'Please select your ethnicity.',
            'Are you able to read and understand English?',
            'Are you able to complete this study on a personal device with a keyboard?',
            'If you are interested in being entered into the raffle to win a $20 Amazon gift card, please enter your email (Please note that you must be eligible for, and complete the study to be entered into the raffle to win the gift card):'
        ];

        var raceOptionTexts = [
            'American Indian or Alaska Native',
            'Asian',
            'Black or African American',
            'Native Hawaiian or Other Pacific Islander',
            'White',
            'Other (specify)'
        ];

        var optionalQuestionStems = [
            'Please enter the state in which you study.',
            'Please enter your gender identity.',
            'Please enter your race.',
            'If you are interested in being entered into the raffle to win a $20 Amazon gift card, please enter your email (Please note that you must be eligible for, and complete the study to be entered into the raffle to win the gift card):'
        ];

        var requiredQuestionStems = questionStems.filter(function(stem){
            return !textIsOneOf(stem, optionalQuestionStems);
        });

        function cleanText(element){
            return (element && element.textContent || '').replace(/\s+/g, ' ').trim();
        }

        function hasText(element, text){
            return cleanText(element).indexOf(text) !== -1;
        }

        function textIsOneOf(text, values){
            for (var i = 0; i < values.length; i++){
                if (text === values[i]) return true;
            }
            return false;
        }

        function textStartsWithOneOf(text, values){
            for (var i = 0; i < values.length; i++){
                if (text.indexOf(values[i]) === 0) return true;
            }
            return false;
        }

        function visible(element){
            return !!(element && (element.offsetWidth || element.offsetHeight || element.getClientRects().length));
        }

        function selected(option){
            return option.classList.contains('active') ||
                option.classList.contains('btn-primary') ||
                option.classList.contains('btn-info') ||
                option.getAttribute('aria-pressed') === 'true' ||
                option.getAttribute('aria-checked') === 'true';
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

        function isMultiSelectOption(option){
            return textStartsWithOneOf(cleanText(option), raceOptionTexts);
        }

        function scrollToElement(element){
            if (!element) return;

            element.scrollIntoView({behavior: 'smooth', block: 'center'});
            if (element.classList) element.classList.add('demographics-scroll-target');
            setTimeout(function(){
                if (element.classList) element.classList.remove('demographics-scroll-target');
            }, 1200);
        }

        function findQuestionContainer(element){
            var selectors = ['li', '[pi-question]', '[piq-question]', '.form-group'];
            for (var i = 0; i < selectors.length; i++){
                var container = element.closest(selectors[i]);
                if (container && container.closest('[piq-page]')) return container;
            }

            var current = element.parentElement;
            while (current && current !== document.body && !current.hasAttribute('piq-page')){
                if (current.querySelector('.demographics-choice-option, input:not([type="hidden"]), textarea, select')){
                    return current;
                }
                current = current.parentElement;
            }

            return element;
        }

        function findStemElement(stem){
            var candidates = document.querySelectorAll('[piq-page] .demographics-question-stem, [piq-page] label, [piq-page] p, [piq-page] span, [piq-page] div');
            for (var i = 0; i < candidates.length; i++){
                if (visible(candidates[i]) && cleanText(candidates[i]) === stem) return candidates[i];
            }
            return null;
        }

        function questionAnswered(container){
            if (!container) return true;

            var choiceOptions = container.querySelectorAll('.demographics-choice-option');
            for (var i = 0; i < choiceOptions.length; i++){
                if (selected(choiceOptions[i])) return true;
            }

            var fields = container.querySelectorAll('input:not([type="hidden"]), textarea, select');
            for (var j = 0; j < fields.length; j++){
                if ((fields[j].value || '').trim() !== '') return true;
            }

            return choiceOptions.length === 0 && fields.length === 0;
        }

        function firstManualIncompleteQuestion(){
            for (var i = 0; i < requiredQuestionStems.length; i++){
                var stemElement = findStemElement(requiredQuestionStems[i]);
                if (!stemElement) continue;

                var container = findQuestionContainer(stemElement);
                if (!questionAnswered(container)) return stemElement;
            }

            return null;
        }

        function firstValidationError(){
            var candidates = document.querySelectorAll('[piq-page] .has-error, [piq-page] .text-danger, [piq-page] .alert-danger, [piq-page] .error, [piq-page] [class*="error"]');
            for (var i = 0; i < candidates.length; i++){
                var text = cleanText(candidates[i]).toLowerCase();
                if (visible(candidates[i]) && (text.indexOf('answer') !== -1 || text.indexOf('select') !== -1 || text.indexOf('enter') !== -1 || text.indexOf('required') !== -1)){
                    return findQuestionContainer(candidates[i]);
                }
            }

            return null;
        }

        function scrollToFirstIncompleteQuestion(){
            var target = firstValidationError() || firstManualIncompleteQuestion();
            scrollToElement(target);
        }

        function optionSelectedByText(text){
            var options = document.querySelectorAll('[piq-page] .demographics-choice-option');
            for (var i = 0; i < options.length; i++){
                if (cleanText(options[i]) === text && selected(options[i])) return true;
            }
            return false;
        }

        function stateOtherSelected(){
            var option = findOption({
                optionText: 'I study in a state that is not listed above (specify)'
            });
            return !!(option && selected(option));
        }

        function showScreenOutPage(){
            if (document.documentElement.getAttribute('data-demographics-screened-out')) return;
            document.documentElement.setAttribute('data-demographics-screened-out', 'true');

            if (window.showDemographicsScreenOutPage){
                window.showDemographicsScreenOutPage();
                return;
            }

            sessionStorage.setItem('demographics_screening_response', 'ineligible');
            var container = document.querySelector('.container');
            if (container) container.style.display = 'none';
            var exitPage = document.getElementById('exit-page');
            var exitPageMessage = document.getElementById('exit-page-message');
            if (exitPageMessage){
                exitPageMessage.textContent = 'Thank you so much for taking part in our study! Unfortunately, you do not meet criteria for the study, but we thank you for your interest and your time.';
            }
            if (exitPage) exitPage.hidden = false;
            document.title = 'Thank You';
        }

        function screeningFailed(){
            return optionSelectedByText('No') || stateOtherSelected();
        }

        function watchSubmitForIncompleteQuestions(){
            if (document.documentElement.getAttribute('data-demographics-submit-scroll')) return;
            document.documentElement.setAttribute('data-demographics-submit-scroll', 'true');

            document.addEventListener('click', function(event){
                var submit = event.target.closest('[ng-click], [data-ng-click], button, .btn');
                if (!submit || !submit.closest('[piq-page]')) return;

                var action = submit.getAttribute('ng-click') || submit.getAttribute('data-ng-click') || '';
                var text = cleanText(submit).toLowerCase();
                if (action.indexOf('submit') === -1 && text !== 'submit') return;

                if (!firstManualIncompleteQuestion() && screeningFailed()){
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    showScreenOutPage();
                    return;
                }

                setTimeout(scrollToFirstIncompleteQuestion, 100);
                setTimeout(scrollToFirstIncompleteQuestion, 300);
            }, true);
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

        function setDateOfBirthBounds(){
            function applyBounds(input){
                input.setAttribute('type', 'date');
                input.setAttribute('min', '1950-01-01');
                input.setAttribute('max', todayISO());
            }

            var inputs = document.querySelectorAll('[piq-page] input');
            Array.prototype.forEach.call(inputs, function(input){
                var attrs = [
                    input.getAttribute('name'),
                    input.getAttribute('id'),
                    input.getAttribute('ng-model'),
                    input.getAttribute('data-ng-model')
                ].join(' ');

                if (input.getAttribute('type') === 'date' || attrs.indexOf('date_of_birth') !== -1){
                    applyBounds(input);
                }
            });

            var stem = findStemElement('Please enter your date of birth.');
            var container = stem ? findQuestionContainer(stem) : null;
            if (!container) return;

            var dateInputs = container.querySelectorAll('input:not([type="hidden"])');
            Array.prototype.forEach.call(dateInputs, applyBounds);
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
            option.classList.add('inline-other-option');
            input.setAttribute('data-inline-other', 'true');

            if (inputQuestion) inputQuestion.classList.add('inline-other-hidden-question');
            hideExactStemLabel(item);

            var optionIsMulti = isMultiSelectOption(option);
            var inlineOptionSelected = selected(option);

            function clearInput(){
                if (!input.value) return;
                input.value = '';
                input.dispatchEvent(new Event('input', {bubbles: true}));
                input.dispatchEvent(new Event('change', {bubbles: true}));
            }

            function clearIfDeselected(){
                setTimeout(function(){
                    inlineOptionSelected = selected(option);
                    if (!inlineOptionSelected) clearInput();
                }, 0);
            }

            function selectInlineOption(){
                if (optionIsMulti){
                    if (!inlineOptionSelected){
                        option.click();
                        inlineOptionSelected = true;
                    }
                } else if (!selected(option)) {
                    option.click();
                    inlineOptionSelected = true;
                }

                setTimeout(function(){ input.focus(); }, 0);
            }

            // Focusing or typing in the field must not repeatedly toggle the owning option.
            input.addEventListener('mousedown', function(event){
                event.stopPropagation();
                selectInlineOption();
            });
            input.addEventListener('touchstart', function(event){
                event.stopPropagation();
                selectInlineOption();
            });
            input.addEventListener('focus', selectInlineOption);
            input.addEventListener('click', function(event){
                event.stopPropagation();
                selectInlineOption();
            });
            input.addEventListener('keydown', function(event){ event.stopPropagation(); });
            option.addEventListener('click', function(event){
                if (event.target.closest('.inline-other-answer input, .inline-other-answer textarea')) return;

                if (optionIsMulti) inlineOptionSelected = !inlineOptionSelected;
                else inlineOptionSelected = true;

                if (!inlineOptionSelected) clearInput();
                if (inlineOptionSelected) setTimeout(function(){ input.focus(); }, 0);
            });
            document.addEventListener('click', clearIfDeselected, false);
        }

        function demographicsPageActive(){
            for (var i = 0; i < questionStems.length; i++){
                if (findStemElement(questionStems[i])) return true;
            }
            return false;
        }

        function enhance(){
            if (!demographicsPageActive()) return;

            items.forEach(moveInput);
            setDateOfBirthBounds();
            markQuestionStems();
            markChoiceOptions();
            watchSubmitForIncompleteQuestions();
        }

        function markQuestionStems(){
            var candidates = document.querySelectorAll('[piq-page] label, [piq-page] p, [piq-page] span, [piq-page] div');
            Array.prototype.forEach.call(candidates, function(candidate){
                if (textIsOneOf(cleanText(candidate), questionStems) && controlCount(candidate) === 0){
                    candidate.classList.add('demographics-question-stem');
                    candidate.classList.remove('demographics-choice-option', 'radio-choice-option', 'multi-choice-option');
                    if (textIsOneOf(cleanText(candidate), optionalQuestionStems)){
                        candidate.classList.remove('demographics-required-stem');
                    } else {
                        candidate.classList.add('demographics-required-stem');
                    }
                }
            });
        }

        function markChoiceOptions(){
            var candidates = document.querySelectorAll('[piq-page] .btn, [piq-page] button, [piq-page] label, [piq-page] [role="button"]');
            Array.prototype.forEach.call(candidates, function(option){
                var action = option.getAttribute('ng-click') || option.getAttribute('data-ng-click') || '';
                if (action.indexOf('submit') !== -1 || !visible(option)) return;
                if (textIsOneOf(cleanText(option), questionStems)){
                    option.classList.remove('demographics-choice-option', 'radio-choice-option', 'multi-choice-option');
                    option.classList.add('demographics-question-stem');
                    if (textIsOneOf(cleanText(option), optionalQuestionStems)){
                        option.classList.remove('demographics-required-stem');
                    } else {
                        option.classList.add('demographics-required-stem');
                    }
                    return;
                }

                option.classList.add('demographics-choice-option');
                if (isMultiSelectOption(option)) option.classList.add('multi-choice-option');
                else option.classList.add('radio-choice-option');
            });
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
        required: true
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
        required: true
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
        required: true
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
        inputType: 'date',
        min: '1950-01-01',
        max: todayISO()
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

    API.addQuestionsSet('raffleEmail',{
        inherit: 'demographicsText',
        name: 'raffle_email',
        required: false,
        stem: 'If you are interested in being entered into the raffle to win a $20 Amazon gift card, please enter your email (Please note that you must be eligible for, and complete the study to be entered into the raffle to win the gift card):',
        inputType: 'email'
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
            {inherit: 'keyboardDevice'},
            {inherit: 'raffleEmail'}
        ]
    }]);

    return API.script;
});
