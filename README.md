ng-tools
========

collection of useful services/factories/directives/filters I like using in any Angular project, so far contains:

- urlize factory for easy synchronization between scope object and url search params
- debounce factory
- include-in-scope directive
- set and stored set factories
- markdown directive
- mark-current-url directive(and asociated mark-current-if-any-child-is directive)
- loader directive with loaderSvc for easy hiding spinners and other loader elements

## Editing
Build process is done with grunt, so if you want to modify sources, just run:
```
npm install
```

then when you want to get concatenated, minified sources, use command:
```
grunt
```
