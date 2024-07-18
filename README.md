# hx-tomselect

Provides a hx-ext="tomselect" htmx extention tag

<a href="https://kiwikid.github.io/hx-tomselect/">Full Examples List</a>

### Install
```html
<script src="https://cdn.jsdelivr.net/npm/hx-tomselect@latest/hx-tomselect.js"></script>
```


(Include htmx and tom-select before the extention)
```html
<script src="https://unpkg.com/htmx.org@latest"></script>
<link href="https://cdn.jsdelivr.net/npm/tom-select@latest/dist/css/tom-select.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/tom-select@latest/dist/js/tom-select.complete.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hx-tomselect/hx-tomselect.js"></script>
```



### Example Usage:
```html
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



<a href="https://kiwikid.github.io/hx-tomselect/">Full Examples List</a>