# hx-tomselect

Provides a hx-tomselect htmx extention tag

Let me write the javascript so you dont have too

[V0.1 - this is under active development, is provided as it, and future releases *may* introduce large breaking changes]
[lmk if you see any bugs/feature oppotunitues]

(should be loaded before any hx-ext tags)
```html
<link href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js"></script>
<script src="https://kiwikid.github.io/hx-tomselect/hx-tom-select.js"></script>
```

Example Usage:
```go
<select hx-ext="tomselect" max-options="20" remove-button-title="Remove this player" multiple>
		<option value="">N/A</option>
		for _, p := range players {
			<option value={ S("%v", p.ID) }>
				{ S("%s", p.Name) }
			</option>
		}
</select>
```