(function() {   
    /** Stable Build - For prod */
    const version = '02'

    /**
     * @typedef {Object} ConfigChange
     * Represents changes or settings that can be applied to TomSelect configuration.
     * Each property name here should match a possible configuration key in TomSelect, and the type should match the expected configuration value type.
     * @property {boolean} [persist] - Whether to keep selected items across page reloads.
     * @property {boolean} [createOnBlur] - Whether to create a new item when input loses focus.
     * @property {boolean} [create] - Whether to allow creation of new items not found in the options list.
     * @property {boolean} [allowEmptyOption] - Whether to allow a select dropdown with no options.
     * @property {SortField} [sortField] - Specifies how to sort items in the dropdown list.
     */

    /**
     * @typedef {Object} SortField
     * Defines sorting options for TomSelect.
     * @property {string} field - The field to sort by (e.g., 'text', 'value').
     * @property {string} [direction] - The direction of the sort ('asc' or 'desc'). Omitting direction will sort in ascending order by default.
     */

    /**
     * @typedef {Object} SupportedAttribute
     * Defines an attribute supported by a configuration modification system.
     * @property {string} key - The key of the configuration attribute to modify.
     * @property {ConfigChange} [configChange] - The modifications to apply to the TomSelect configuration.
     */

    /**
     * @type {SupportedAttribute[]}
     */

    /**
     * @typedef {'ts-max-items' | 'ts-max-options' | 'ts-create' | 'ts-sort' | 'ts-sort-direction' | 'ts-allow-empty-options', 'ts-clear-after-add', 'ts-raw-config'} TomSelectConfigKey
     * Defines the valid keys for configuration options in TomSelect.
     * Each key is a string literal corresponding to a specific property that can be configured in TomSelect.
     */

    /**
     * @type {Array<TomSelectConfigKey>}
     */
    const attributes = [
        'ts-debug'
        , 'ts-create'
        , 'ts-max-items'
        , 'ts-max-options'
        , 'ts-sort'
        , 'ts-sort-direction'
        , 'ts-allow-empty-options'
        , 'ts-config'
        , 'ts-clear-after-add'
        , 'ts-raw-config'
        , 'ts-remove-button-title'
        , 'ts-delete-confirm'
    ]

    /**
     * Deeply assigns properties to an object, merging any existing nested properties.
     * 
     * @param {Object} target The target object to which properties will be assigned.
     * @param {Object} updates The updates to apply. This object can contain deeply nested properties.
     * @returns {Object} The updated target object.
     */
    function deepAssign(target, updates) {
        Object.keys(updates).forEach(key => {
            if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
                if (!target[key]) target[key] = {};
                deepAssign(target[key], updates[key]);
            } else {
                target[key] = updates[key];
            }
        });
        return target;
    }

    htmx.defineExtension('tomselect', {
        onEvent: function (name, evt) {
            if (name === "htmx:afterProcessNode") {
                try {
                    var elt = evt.detail.elt;
                    const selects = document.querySelectorAll('select[hx-ext="tomselect"]:not([tom-select-success]):not([tom-select-error])')
                    selects.forEach((s) => {

                        

                        const allAttributes = s.attributes;
                        const invalidAttrs = Array.from(allAttributes).filter(attr => !attributes.includes(attr.name) && attr.name.startsWith('ts-'));

                        // Log a warning and mark element if invalid attributes are found
                        invalidAttrs.forEach(attr => {
                            console.warn(`Invalid config key found: ${attr.name}`);
                            s.setAttribute('tom-select-warning', `Invalid config key found: ${attr.name}`);
                        });

                        const debug = s.getAttribute('ts-debug')
                        /**
                         * @type {ConfigChange}
                         */
                        let config = {
                            maxOptions: +s.getAttribute('ts-max-items') || 100,
                            maxItems: +s.getAttribute('ts-max-items') || 100,
                            plugins: {}
                        };

                        if (s.hasAttribute('ts-create')) {
                            deepAssign(config, {
                                create: s.getAttribute('ts-create'),
                                ...config
                            })
                        }

                        if(s.hasAttribute('ts-sort')){
                            deepAssign(config, {
                                sortField: {
                                    field: s.getAttribute('ts-sort'),
                                    direction: s.getAttribute('ts-sort-direction')
                                },
                            })
                        }

                        if (s.hasAttribute('ts-allow-empty-options')) {
                            deepAssign(config, {
                                allowEmptyOption: s.getAttribute('ts-allow-empty-options'),
                                ...config
                            })
                        }


                        if (s.hasAttribute('ts-persist')) {
                            deepAssign(config, {
                                persist: s.getAttribute('ts-persist') == "true",
                                ...config
                            })
                        }

                    

                    if (s.hasAttribute('ts-clear-after-add')) {
                        const clearAfterItemAddConfig = {
                            onItemAdd: function() {
                                this.setTextboxValue('');
                                this.refreshOptions();
                            }
                        }
                        deepAssign(config, clearAfterItemAddConfig);
                    }

                    if (s.hasAttribute('ts-raw-config')) {
                        let rawConfig = JSON.parse(s.getAttribute('ts-raw-config'));
                        deepAssign(config, rawConfig);
                    }



                    // Additional configuration based on attributes
                    if (s.hasAttribute('ts-remove-button-title')) {
                        deepAssign(config,{
                            plugins: {
                                remove_button: {
                                    title: s.getAttribute('ts-remove-button-title')
                                },
                            },
                        })
                    }

                    if(s.hasAttribute('ts-delete-confirm')){
                        deepAssign(config, {
                            onDelete: function(values) {
                                if(s.hasAttribute('ts-delete-confirm') == "true"){
                                    return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
                                }
                                
                            }
                        })
                    }


                    if(debug || true) { console.log('hx-tomselect - tom-select-success - config', config) }
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

})();