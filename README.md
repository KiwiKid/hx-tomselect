# hx-tomselect

Provides a hx-tomselect htmx extention tag

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