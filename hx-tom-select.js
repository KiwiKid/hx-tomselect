(function() {   
    /** stable build*/
    const version = '05'

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
            configChange: 'create'
        },{
            key: 'ts-create-on-blur',
            configChange: 'createOnBlur'
        },{
            key: 'ts-create',
            configChange: 'create'
        },{
            key: 'ts-create-filter',
            configChange:  (elm, config) => ({
                createFilter: function(input) {
                    try {
                        const filter = elm.getAttribute('ts-create-filter')
                        const matchEx = filter == "true" ? /^[^,]*$/ : elm.getAttribute('ts-create-filter')
                        var match = input.match(matchEx); // Example filter: disallow commas in input
                        if(match) return !this.options.hasOwnProperty(input);
                        elm.setAttribute('tom-select-warning', JSON.stringify(err));
                        return false;
                    } catch (err) {
                        return false
                    }
                }
            })
        },{
            key: 'ts-delimiter',
            configChange: 'delimiter'
        },{
            key: 'ts-highlight',
            configChange: 'highlight'
        },{
            key: 'ts-multiple',
            configChange: 'multiple'
        },{
            key: 'ts-persist',
            configChange: 'persist'
        },{
            key: 'ts-open-on-focus',
            configChange: 'openOnFocus'
        },{
            key: 'ts-max-items',
            configChange: 'maxItems'
        },{
            key: 'ts-hide-selected',
            configChange: 'hideSelected'
        },{
            key: 'tx-close-after-select',
            configChange: 'closeAfterSelect'
        },
        {
            key: 'ts-max-options',
            configChange: 'maxOptions'
        },{
            key: 'ts-sort',
            configChange: (elm, config) => ({
                sortField: {
                    field: elm.getAttribute('ts-sort'),
                },
            })
        },{
            key: 'ts-sort-direction',
            configChange: (elm, config) => ({
                sortField: {
                    direction: elm.getAttribute('ts-sort-direction') ?? 'asc'
                },
            })
        },{
            key: 'ts-allow-empty-option',
            type: 'simple',
            configChange: 'allowEmptyOption'
        },{
            key: 'ts-clear-after-add',
            configChange: {
                create: true,
                onItemAdd: function() {
                    this.setTextboxValue('');
                    this.refreshOptions();
                }
            }
        },{
            key: 'ts-remove-button-title',
            configChange: (elm, config) => deepAssign(config,{
                plugins: {
                    remove_button: {
                        title: elm.getAttribute('ts-remove-button-title') == 'true' ? 'Remove this item' : elm.getAttribute('ts-remove-button-title')
                    }
                },
            })
        },{
            key: 'ts-delete-confirm',
            configChange: (elm, config) => ({
                onDelete: function(values) {
                    if(elm.getAttribute('ts-delete-confirm') == "true"){
                        return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
                    }else {
                        return confirm(elm.getAttribute('ts-delete-confirm'));
                    }
                    
                }
            })
        },{
            key: 'ts-add-post-url',
            configChange: (elm, config) => ({
                    onOptionAdd: function(value, item) {
                        this.lock();
                        const valueKeyName = elm.getAttribute('ts-add-post-url-body-value') ?? 'value'
                        const body = {}
                        body[valueKeyName] = value
                        fetch(elm.getAttribute('ts-add-post-url'), {
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
                                elm.setAttribute('tom-select-warning', `ts-add-post-url - request error - ${JSON.stringify(error, )}`, )
                            }
                        })
                        .then(data => {
                            console.info(data.message);
                        })
                        .catch(error => {
                            console.error('Error adding item', error)
                            elm.setAttribute('tom-select-warning', `ts-add-post-url - Error processing item: ${JSON.stringify(error)}`);
                            this.removeItem(value);
                        })
                        .finally(() => {
                            this.unlock();
                        });
                }
            })
        },{
            key: 'ts-add-post-url-body-value',
            configChange: ''
        },
        {
            key: 'ts-no-active',
            configChange: {
                plugins: ['no_active_items'],
                persist: false,
                create: true
            }
        },{
            key: 'ts-remove-selector-on-select',
            type: 'simple',
            configChange: null
        },{
            key: 'ts-no-delete',
            configChange: {
                onDelete: () => { return false},
            }
        },{
            key: 'ts-option-class',
            configChange: 'optionClass'
        },{
            key: 'ts-option-class-ext',
            configChange: (elm, config) => ({
                'optionClass': `${elm.getAttribute('ts-option-class-ext')} option`
            })
        },{
            key: 'ts-item-class',
            configChange: 'itemClass'
        },{
            key: 'ts-item-class-ext',
            configChange:(elm, config) => ({
                key: 'ts-option-class-ext',
                configChange: {
                    'itemClass': `${elm.getAttribute('ts-option-class-ext')} item`
                }
            })
        },
        {
            key: 'ts-raw-config',
            configChange: (elm, config) => elm.getAttribute('ts-raw-config')
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
                    var elt = evt.detail.elt;
                    const selects = document.querySelectorAll('select[hx-ext="tomselect"]:not([tom-select-success]):not([tom-select-error])')
                    selects.forEach((s) => {
                        if(s.attributes?.length == 0){
                            throw new Error("no attributes on select?")
                        }
                        try {
                        let config = {
                            maxItems: 999,
                            plugins: {}
                        };
                        console.log(s.attributes)
                        Array.from(s.attributes).forEach((a) => {
                            const attributeConfig = attributeConfigs.find((ac) => ac.key == a.name)
                            if (attributeConfig != null){
                                let configChange = {}
                                if(typeof attributeConfig.configChange == 'string'){
                                    configChange[attributeConfig.configChange] = a.value
                                }else if(typeof attributeConfig.configChange == 'function'){
                                    configChange = attributeConfig.configChange(s, config)
                                }else if(typeof attributeConfig.configChange == 'object'){
                                    configChange = attributeConfig.configChange
                                }else if(a.name.startsWith('ts-')) {
                                    s.setAttribute('tom-select-warning', `Invalid config key found: ${attr.name}`);
                                    console.warn(`Could not find config match:${JSON.stringify(attributeConfig)}`)
                                }
                               
                                deepAssign(config, configChange)
                            }else if(a.name.startsWith('ts-')){
                                console.warn(`Invalid config key found: ${a.name}`);
                                s.setAttribute(`tom-select-warning_${a.name}`, `Invalid config key found`);
                            }
                        })

                    console.info('hx-tomselect - tom-select-success - config', config)
                    new TomSelect(s, config);
                    s.setAttribute('tom-select-success', `success_v${version}`);

                } catch (err) {
                    s.setAttribute('tom-select-error', JSON.stringify(err));
                    console.error(`htmx-tomselect - Failed to load hx-tomsselect ${err}`);
                }
            })
        }
    }
});

})();