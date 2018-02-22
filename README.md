ng-tools
========

collection of useful services/factories/directives/filters I liked using in any Angular project few years ago. NOT MAINTAINED anymore

## Directives:
- include-in-scope
- fallback-url for getting a custom image for wrong image src urls
- markdown
- mark-current-url directive(and asociated mark-current-if-any-child-is directive)
- loader directive with loaderSvc for easy hiding spinners and other loader elements
- promise-class

## Factories
- urlize factory for easy synchronization between scope object and url search params
- debounce factory
- set and stored set factories

## Filters
- trustHtml filter
- trustUrl filter
- localizeNumber filter which uses number.toLocaleString to render a number in local i18n format

## Customization and building [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
Build process is done with grunt, so if you want to modify sources, just run:
```
npm install
```

then when you want to get concatenated, minified sources, use command:
```
grunt
```
for tests, run
```
grunt karma
```
