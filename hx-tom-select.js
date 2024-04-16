htmx.defineExtension('tomselect', {
    transformResponse : function(text, xhr, elt) { console.log('transformResponse'); return text;},
    isInlineSwap : function(swapStyle) {  console.log('isInlineSwap'); return false;},
    handleSwap : function(swapStyle, target, fragment, settleInfo) {console.log('handleSwap');  return false;},
    encodeParameters : function(xhr, parameters, elt) {console.log('encodeParameters');  return null;},
    onEvent: function(name, evt) {
        console.log(`htmx-tomselect - onEvent - ${name}`)
        if (name === "htmx:afterProcessNode") {
            console.log(`htmx-tomselect - htmx:afterProcessNode ${name}`)
            document.querySelectorAll('[hx-ext=tomselect]').forEach(element => {
                try {

                    logIt('setting up new tomselect for '+element)
                    if (!element.classList.contains('tomselect-initialized')) {
                        let config = {
                            maxOptions: element.getAttribute('max-options') || 100,
                            plugins: {}
                        };

                        if (element.hasAttribute('remove-button-title')) {
                            config.plugins.remove_button = {
                                title: element.getAttribute('remove-button-title'),
                                plugins: {
                                    remove_button:{
                                        title:'Remove this'
                                    }
                                },
                            };
                        }

                        if (element.hasAttribute('clear-after-item-add')) {
                            const clearAfterItemAddConfig = { 
                                onItemAdd:function(){
                                    this.setTextboxValue('');
                                    this.refreshOptions();
                                }
                            }
                            config = {...config, ...clearAfterItemAddConfig};
                        }

                        if (element.hasAttribute('raw-config')) {
                            let rawConfig = JSON.parse(element.getAttribute('raw-config'));
                            config = {...config, ...rawConfig};
                        }
                        console.log('htmx-tomselect - hx-tomselect: config', config)
                        initializeTomSelect(element, config);
                        element.classList.add('tomselect-initialized');
                    }
                } catch (err) {
                    console.error(`htmx-tomselect - Failed to load hx-tomsselect ${err}`)
                }
            });
        }
    }
});
console.log('htmx-tomselect - loaded!')