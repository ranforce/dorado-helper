## dorado-helper

#### atom package for convert some of Dorado view.xml ext file content
For example: convert
```xml
<ClientEvent name="beforeExecute">
self.set(&quot;parameter&quot;,view.id(&quot;datagrid&quot;)
.get(&quot;currentEntity&quot;).toJSON());
</ClientEvent>
```
to
```xml
<ClientEvent name="beforeExecute"><![CDATA[
self.set("parameter",view.id("datagrid")
.get("currentEntity").toJSON());
]]></ClientEvent>
```


#### dependencies
You need to install this atom packages first:
```
language-dorado
```

#### usage
Run command:
```
dorado-helper:convert-ClientEvent
```

Or with keymap.
In atom-text-editor[data-grammar='text dorado view xml']:not([mini]) file, keymap:
```
ctrl-alt-d
```
