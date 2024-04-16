htmx.defineExtension('tomselect', {
    
    onEvent: function(name, evt) {
        console.log("onEvent")
        if (name === "htmx:afterProcessNode") {
            console.log("htmx:afterProcessNode")
            document.querySelectorAll('[hx-tomselect]').forEach(element => {
                try {
                    console.log("   document.querySelectorAll('[hx-tomselect]')")

                    console.log('setting up new tomselect for '+element)
                    if (!element.classList.contains('tom-select-initialized')) {
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

                        initializeTomSelect(element, config);
                        element.classList.add('tomselect-initialized');
                    }
                } catch (err) {
                    console.error(`Failed to load hx-tomsselect ${err}`)
                }
            });
        }
    }
});
console.log('hx tomselect loaded!')