define(['questAPI'], function(Quest){
    var API = new Quest();
    var restartCountKey = 'iat_restart_count';
    var restartAttempt = 1;
    var restartTimestamp = '';

    try {
        restartAttempt = (parseInt(localStorage.getItem(restartCountKey), 10) || 0) + 1;
    } catch (error) {}

    function enhanceRestartUi(){
        if (typeof document === 'undefined') return;

        if (!document.getElementById('iat-restart-style')){
            var style = document.createElement('style');
            style.id = 'iat-restart-style';
            style.textContent = [
                '[piq-page] li { list-style-type: none; }',
                '[piq-page] li::marker { content: ""; font-size: 0; }',
                '[piq-page] [ng-click="decline($event)"], [piq-page] [data-ng-click="decline($event)"] { display: none !important; }',
                '[piq-page] .iat-restart-stem { display: block; margin-bottom: 8px; font-weight: 700 !important; }',
                '[piq-page] .iat-restart-stem::before { content: "*"; display: inline-block; margin-right: 6px; color: #c9302c; font-weight: 700; }',
                '[piq-page] .glyphicon-warning-sign, [piq-page] .glyphicon-exclamation-sign, [piq-page] .text-danger::before, [piq-page] .alert-danger::before, [piq-page] .help-block::before { content: none !important; display: none !important; }'
            ].join('\n');
            document.head.appendChild(style);
        }

        var stems = ['Please enter your name.', 'Please enter your email address.'];

        function cleanText(element){
            return (element && element.textContent || '').replace(/\s+/g, ' ').trim();
        }

        function findContainer(stem){
            var candidates = document.querySelectorAll('[piq-page] label, [piq-page] p, [piq-page] span, [piq-page] div');
            for (var i = 0; i < candidates.length; i++){
                if (cleanText(candidates[i]) !== stem) continue;
                candidates[i].classList.add('iat-restart-stem');
                return candidates[i].closest('li, [pi-question], [piq-question], .form-group') || candidates[i].parentElement;
            }
            return null;
        }

        var nameContainer = findContainer(stems[0]);
        if (nameContainer){
            var nameInput = nameContainer.querySelector('input:not([type="hidden"]), textarea');
            if (nameInput){
                nameInput.setAttribute('maxlength', '100');
                nameInput.setAttribute('pattern', "[A-Za-z .'-]+");
                nameInput.setAttribute('title', "Use letters, spaces, hyphens, apostrophes, and periods only.");
                if (!nameInput.getAttribute('data-iat-restart-name')){
                    nameInput.setAttribute('data-iat-restart-name', 'true');
                    nameInput.addEventListener('input', function(){
                        var value = nameInput.value || '';
                        var cursor = typeof nameInput.selectionStart === 'number' ? nameInput.selectionStart : value.length;
                        var sanitized = value.replace(/[^A-Za-z .'-]/g, '').slice(0, 100);
                        if (value === sanitized) return;
                        var beforeCursor = value.slice(0, cursor).replace(/[^A-Za-z .'-]/g, '').slice(0, 100);
                        nameInput.value = sanitized;
                        if (nameInput.setSelectionRange) nameInput.setSelectionRange(beforeCursor.length, beforeCursor.length);
                        nameInput.dispatchEvent(new Event('change', {bubbles: true}));
                    });
                }
            }
        }

        var emailContainer = findContainer(stems[1]);
        if (emailContainer){
            var emailInput = emailContainer.querySelector('input:not([type="hidden"])');
            if (emailInput){
                emailInput.setAttribute('type', 'email');
                emailInput.setAttribute('maxlength', '254');
                emailInput.setAttribute('title', 'Please enter a valid email address.');
            }
        }

        var submitButton = document.querySelector('[piq-page] [ng-click="submit()"], [piq-page] [data-ng-click="submit()"]');
        if (submitButton && submitButton.textContent !== 'Continue') submitButton.textContent = 'Continue';
    }

    var observer = new MutationObserver(enhanceRestartUi);
    observer.observe(document.body, {childList: true, subtree: true});
    enhanceRestartUi();

    API.addPagesSet('restartPage',{
        noSubmit: false,
        header: 'Welcome Back',
        decline: false,
        autoFocus: false
    });

    API.addQuestionsSet('restartText',{
        type: 'text',
        decline: false,
        required: true,
        autoSubmit: false,
        onSubmit: function(log){
            if (!restartTimestamp) restartTimestamp = new Date().toISOString();
            try { localStorage.setItem(restartCountKey, String(restartAttempt)); } catch (error) {}
            log.participant_id = window.getIatParticipantId ? window.getIatParticipantId() : (window.iatParticipantId || 'unknown');
            log.restart_timestamp = restartTimestamp;
            log.restart_attempt = restartAttempt;
        },
        errorMsg: {
            required: 'This question is required.'
        }
    });

    API.addQuestionsSet('restartName',{
        inherit: 'restartText',
        name: 'name',
        stem: 'Please enter your name.',
        maxLength: 100,
        pattern: "^[A-Za-z .'-]+$",
        errorMsg: {
            required: 'This question is required.',
            pattern: "Use letters, spaces, hyphens, apostrophes, and periods only."
        }
    });

    API.addQuestionsSet('restartEmail',{
        inherit: 'restartText',
        name: 'email',
        stem: 'Please enter your email address.',
        inputType: 'email',
        maxLength: 254,
        errorMsg: {
            required: 'This question is required.',
            pattern: 'Please enter a valid email address.'
        }
    });

    API.addSequence([{
        inherit: 'restartPage',
        questions: [
            {inherit: 'restartName'},
            {inherit: 'restartEmail'}
        ]
    }]);

    return API.script;
});