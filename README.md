# hx-tomselect

Provides a hx-ext="tomselect" htmx extention tag

[V0.2 - this is under active development, is provided as it, and future releases *may* introduce large breaking changes]

[create a github pr/issue if you see any bugs/feature opportunities]


<a href="https://kiwikid.github.io/hx-tomselect/index.html">Examples/Full docs</a>

### Install
```html
<script src="https://kiwikid.github.io/hx-tomselect/hx-tom-select.js"></script>
```


(Include htmx and tom-select before the extention)
```html
<script src="https://unpkg.com/htmx.org"></script>
<link href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js"></script>
<script src="https://kiwikid.github.io/hx-tomselect/hx-tom-select.js"></script>
```



### Example Usage:
```go
<select hx-ext="tomselect" ts-max-options="20" ts-remove-button-title="Remove this player" multiple>
 <option value="">N/A</option>
 <option value="1">Option 1</option>
 <option value="2">Option 2</option>
</select>
```

Config Options are prefixed with a `ts-` and generally match TomSelect config options. If a non-valid key is found on an element a warning will be issued

After processing, one of three attributes will be added to each select box:

- tom-select-success - Tom Select was launch succesfully
- tom-select-warning - non-breaking error (e.g. tag name is no recognised)
- tom-select-error - Breaking error - (i.e. invalid TomConfig json in ts-raw-config)

hx-oob swaps works too (and was the main motivation for writing this extention)

### Supported Attributes:
```html
ts-debug
ts-create
ts-max-items
ts-max-options
ts-sort
ts-sort-direction
ts-allow-empty-options
ts-clear-after-add
ts-raw-config
ts-remove-button-title
ts-delete-confirm
ts-add-post-url
ts-create-filter
```

Check the code for details how how each attribute works

```html
<div id="select-oob"> </div>
```

```html
<div hx-swap-oob="true" id="select-oob"> 
 <select hx-ext="tomselect" name="inputName">
   <option value="">N/A</option>
   <option value = "1">Option 1</option>
   <option value = "2">Option 2</option>
</select>
</div>
```



<a href="examples.html">See examples for a full list</a>