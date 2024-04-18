htmx.defineExtension('tomselect', {
    onEvent: function (name, evt) {
        if (name === "htmx:afterProcessNode") {
            try {
                var elt = evt.detail.elt;
                const selects = document.querySelectorAll('select[hx-ext="tomselect"]:not([tom-select-success]):not([tom-select-error])')
                console.log('processing!'+selects.length)
                selects.forEach((s) => {
                    let config = {
                        maxOptions: s.getAttribute('max-options') || 100,
                        plugins: {}
                    };

                // Additional configuration based on attributes
                if (s.hasAttribute('remove-button-title')) {
                    config.plugins.remove_button = {
                        title: s.getAttribute('remove-button-title'),
                        plugins: {
                            remove_button: {
                                title: 'Remove this'
                            }
                        }
                    };
                }

                if (s.hasAttribute('clear-after-item-add')) {
                    const clearAfterItemAddConfig = {
                        onItemAdd: function() {
                            this.setTextboxValue('');
                            this.refreshOptions();
                        }
                    }
                    config = {...config, ...clearAfterItemAddConfig};
                }

                if (s.hasAttribute('raw-config')) {
                    let rawConfig = JSON.parse(element.getAttribute('raw-config'));
                    config = {...config, ...rawConfig};
                }

                console.log('htmx-tomselect - v1 -  New TomSelect() config', config);

                new TomSelect(s, config);
                s.setAttribute('tom-select-success', "true");

                })

            } catch (err) {
                s.setAttribute('tom-select-error', JSON.stringify(err));
                console.error(`htmx-tomselect - Failed to load hx-tomsselect ${err}`);
            }
        }
    }
});