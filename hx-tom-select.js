(function() {   
    /** stable build*/
    const version = '04'

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
     * @property {ConfigChange} configChange - The modifications to apply to the TomSelect configuration.
     */

    /**
     * @typedef {'simple' | 'callback'} AttributeType
     */
      /**
     * @typedef {function(HTMLElement, Object):void} CallbackFunction
     * Description of what the callback does and its parameters.
     * @param {string} a - The first number parameter.
     
     */
      /**
     * @typedef {Object} AttributeConfig
     * Defines an attribute supported by a configuration modification system.
     * @property {string} key - The key of the configuration attribute to modify.
     * @property {AttributeType} type - The key of the configuration attribute to modify.
     * @property {CallbackFunction|string|null} configChange - The modifications to apply to the TomSelect configuration.
     * 
     */



    /**
     * @type {SupportedAttribute[]}
     */

    /**
     * @typedef {'ts-max-items' | 'ts-max-options' | 'ts-create' | 'ts-sort' | 'ts-sort-direction' | 'ts-allow-empty-option', 'ts-clear-after-add', 'ts-raw-config', 'ts-create-on-blur', 'ts-no-delete'} TomSelectConfigKey
     * Defines the valid keys for configuration options in TomSelect.
     * Each key is a string literal corresponding to a specific property that can be configured in TomSelect.
     */

    /**
     * @type {Array<AttributeConfig>}
     */
    const attributeConfigs = [
        {
            key: 'ts-create',
            type: 'simple',
            configChange: 'create'
        },{
            key: 'ts-persist',
            type: 'simple',
            configChange: 'persist'
        },{
            key: 'ts-create-on-blur',
            type: 'simple',
            configChange: 'createOnBlur'
        },{
            key: 'ts-max-items',
            type: 'simple',
            configChange: 'maxItems'
        },{
            key: 'ts-max-options',
            type: 'simple',
            configChange: 'maxOptions'
        },{
            key: 'ts-sort',
            type: 'simple',
            configChange: (elm, config) => deepAssign(config, {
                sortField: {
                    field: elm.getAttribute('ts-sort'),
                },
            })
        },{
            key: 'ts-sort-direction',
            type: 'simple',
            configChange: {
                sortField: {
                    direction: s.getAttribute('ts-sort-direction')
                },
            }
        },{
            key: 'ts-allow-empty-option',
            type: 'simple',
            configChange: 'allowEmptyOption'
        },{
            key: 'ts-clear-after-add',
            type: 'simple',
            configChange: {
                create: true,
                onItemAdd: function() {
                    this.setTextboxValue('');
                    this.refreshOptions();
                }
            }
        },{
            key: 'ts-remove-button-title',
            type: 'simple',
            configChange: (attribute, config) => deepAssign(config,{
                plugins: {
                    remove_button: {
                        title: attribute.value
                    }
                },
            })
        },{
            key: 'ts-delete-confirm',
            type: 'simple',
            configChange: {
                onDelete: function(values) {
                    if(s.getAttribute('ts-delete-confirm') == "true"){
                        return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
                    }else {
                        return confirm(s.getAttribute('ts-delete-confirm'));
                    }
                    
                }
            }
        },{
            key: 'ts-add-post-url',
            type: 'simple',
            configChange: {
                plugins: {
                    no_active_items: 'true',
                }
            }
        },
        {
            key: 'ts-no-active',
            type: 'simple',
            configChange: {
                onDelete: () => { return false},
                ...config
            }
        },{
            key: 'ts-remove-selector-on-select',
            type: 'simple',
            configChange: null
        },{
            key: 'ts-no-delete',
            type: 'simple',
            configChange: {
                onDelete: () => { return false},
                ...config
            }
        },{
            key: 'ts-create-filter',
            type: 'simple',
            configChange: {
                createFilter: function(input) {
                    try {
                        const filter = s.getAttribute('ts-create-filter')
                        const matchEx = filter == "true" ? /^[^,]*$/ : s.getAttribute('ts-create-filter')
                        var match = input.match(matchEx); // Example filter: disallow commas in input
                        if(match) return !this.options.hasOwnProperty(input);
                        s.setAttribute('tom-select-warning', JSON.stringify(err));
                        return false;
                    } catch (err) {
                        return false
                    }
                }
            }
        },
        {
            key: 'ts-raw-config',
            type: 'simple',
            configChange: (elm, config) => deepAssign(config, {
                sortField: {
                    field: elm.getAttribute('ts-sort'),
                },
            })
        }
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
                        let config = {
                            plugins: {}
                        };
                        s.attributes.forEach((a) => {
                            const attributeConfig = attributeConfigs.find((ac) => ac.key == a.name)
                            if (attributeConfig != null){
                                const configChange = {}
                                if(typeof attributeConfig.configChange == 'string'){
                                    configChange[attributeConfig.configChange] = a.value
                                }else if(typeof attributeConfig.configChange == 'function'){
                                    attributeConfig.configChange(a, config)
                                }else if(typeof attributeConfig.configChange == 'object'){
                                    deepAssign(config, attributeConfig.configChange)
                                }else {
                                    console.warn(`Could not find config match:${JSON.stringify(attributeConfig)}`)
                                }
                               
                                deepAssign(config, configChange)
                            }else if(a.name.startsWith('ts-')){
                                console.warn(`Invalid config key found: ${attr.name}`);
                                s.setAttribute(`tom-select-warning_${attr.name}`, `Invalid config key found`);
                            }
                        })

                        

                        const allAttributes = s.attributes;
                        const invalidAttrs = Array.from(allAttributes).filter(attr => !attributes.includes(attr.name) && attr.name.startsWith('ts-'));

                        // Log a warning and mark element if invalid attributes are found
                        invalidAttrs.forEach(attr => {
                            console.warn(`Invalid config key found: ${attr.name}`);
                            s.setAttribute('tom-select-warning', `Invalid config key found: ${attr.name}`);
                        });

                      //  const debug = s.getAttribute('ts-debug')
                        /**
                         * @type {ConfigChange}
                         */
                        

                   /*     if (s.hasAttribute('ts-create')) {
                            deepAssign(config, {
                                create: s.getAttribute('ts-create'),
                                ...config
                            })
                        }

                        if (s.hasAttribute('ts-create-on-blur')) {
                            deepAssign(config, {
                                createOnBlur: s.getAttribute('ts-create-on-blur'),
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

                        if (s.hasAttribute('ts-allow-empty-option')) {
                            deepAssign(config, {
                                allowEmptyOption: s.getAttribute('ts-allow-empty-option'),
                                ...config
                            })
                        }

                        if(s.hasAttribute('ts-no-delete')){
                            deepAssign(config, {
                                onDelete: () => { return false},
                                ...config
                            })
                        }


                        if (s.hasAttribute('ts-persist')) {
                            deepAssign(config, {
                                persist: s.getAttribute('ts-persist') == "true",
                                ...config
                            })
                        }*/


                    if (s.hasAttribute('ts-raw-config')) {
                        let rawConfig = JSON.parse(s.getAttribute('ts-raw-config'));
                        deepAssign(config, rawConfig);
                    }



                    // Additional configuration based on attributes
                    if (s.hasAttribute('ts-remove-button-title')) {
                        const title = s.getAttribute('ts-remove-button-title') == "true" ? "Are you sure you want to delete this item?" : s.getAttribute('ts-remove-button-title')
                        deepAssign(config,)
                    }

                    if(s.getAttribute('ts-no-active') == "true"){
                        deepAssign(config, )
                    }

                    // Not sure how useful this one is...
                    if(s.hasAttribute('ts-add-post-url')) {
                        deepAssign(config, {
                            onOptionAdd: function(value, item) {
                                console.log('onOptionAdd')
                                this.lock();
                                const valueKeyName = s.getAttribute('ts-add-post-url-body-value') ?? 'value'
                                const body = {}
                                body[valueKeyName] = value
                                fetch(s.getAttribute('ts-add-post-url'), {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(body),
                                })
                                .then(response => {
                                    if (response.ok) {
                                        htmx.process(response.body)
                                        return response.json();
                                        
                                    } else { 
                                        console.error('Error adding item', error)
                                        s.setAttribute('tom-select-warning', `ts-add-post-url - request error - ${JSON.stringify(error, )}`, )
                                    }
                                })
                                .then(data => {
                                    console.log(data.message); // Log the success message
                                    // The item is already added to the select; you might want to do something else here
                                })
                                .catch(error => {
                                    console.error('Error adding item', error)
                                    s.setAttribute('tom-select-warning', `ts-add-post-url - Error processing item: ${JSON.stringify(error)}`);
                                        // Remove the item if the server request failed
                                    this.removeItem(value);
                                })
                                .finally(() => {
                                    this.unlock();
                                });
                        }})
                    }

                    if(debug || true) { console.log('hx-tomselect - tom-select-success - config', config) }
                        new TomSelect(s, config);
                        s.setAttribute('tom-select-success', `success_v${version}`);
                    })

                   

                } catch (err) {
                    s.setAttribute('tom-select-error', JSON.stringify(err));
                    console.error(`htmx-tomselect - Failed to load hx-tomsselect ${err}`);
                }
            }
        }
    });

})();