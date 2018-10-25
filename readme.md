jQuery Annex
============


Written by:  Sebastian Schlapkohl  
eMail:       jqueryannex@ifschleife.de  
Sites: [github](https://github.com/OktarinTentakel/jqueryannex), [ifschleife](http://www.ifschleife.de)



What is this?
-------------
Annex is a jQuery expansion featuring "nice to have" methods to streamline development.

Think of this as the poor man's jQuery-based lodash/underscore, with a focus on DOM stuff.

I'm fully aware that this is not a full fledged high-quality framework, but rather a collection of everyday methods I use to make working
with JS in conjunction with jQuery more bearable.

But hey, at least I made the effort and invested time in unit testing, documentation and examples.

This expansion includes stuff like better logging, variable normalization, helpers to build DOM elements on the fly more easily, class inheritance for ES5,
more info getters for variable states like type and value checks, string format functionality, string generation and conversion tools like slugification and
safe id generation, array tools, math helpers, better timers, polling, url and navigation helpers, solutions for spam free mailto and tel links, browser
capability checks, cookie handling, image and webfont callback helpers, form helpers for data and customizable elements, event tools and so on and so forth.

Have a look at the documentation under /doc to get a complete picture of what's there.

"But hey, that does not sound like all that stuff really _needs_ jQuery, wouldn't it be cleaner to separate DOM from non-DOM stuff?"

Tell that to the jQuery guys! No, but in all honesty:

You are absolutely right! But this is grown convenience project, so don't judge me too harshly. There will come a time when this lib will be split into
"Annex" and "jQuery Annex" ... I'll get around to it ... Someday.

Annex supports several jQuery versions explicity and through its tests. Currently these are jQuery 3, 2 and 1 in their lastest versions (you can find the lastest tested versions in jquery.annex.js right at the top or as files in /examples/lib).
You may used older versions at your own risk, but Annex will warn you about this.



Is this tested in any way?
--------------------------
Yes, it actually is!

The algorithmic core is tested via [Ava](https://github.com/avajs/ava) and all tests are to be found in `/test`.

Many features are not really well suited for unit testing but require a real browser as a context. For all those cases I built example pages
(to be found under `/examples`, just opening `index.hml` from the file system should work). In these example pages you can browse
all topics not covered by unit tests and play around with the functionality. At the top you'll find buttons to quickly switch between
all supported jQuery versions.



How do I install this?
----------------------
There are several possibilities, the easiest of course being to just download the zip or the dist files and put it into you project.

If you are using a package manager (which you definitely should) you're also covered.

For old-school fellows still hanging on to *Bower*, just use
```
bower install jqueryannex --save
```

Since Bower is deprecated you can also use *npm* of course, but since I'm not a big fan of npm's publishing process and never really would keep the publishing up to date you have to include the the github repo directly:

```
npm install oktarintentakel/jqueryannex
```

I'd also recommend to specify a version tag to use:

```
npm install oktarintentakel/jqueryannex#v0.XX.0
```

If you already updated to *Yarn* the process is analogous to npm:

```
yarn add oktarintentakel/jqueryannex
```

or

```
yarn add oktarintentakel/jqueryannex#v0.XX.0
```

If you are using *npm or yarn* I recommend installing client dependencies into a subfolder. This can be achieved by adding the module manually to the package.json as documented [here](https://bower.io/blog/2017/how-to-migrate-away-from-bower/) by the Bower team. This would result in a dependency like

```
"dependencies": {
    "@client/jqueryannex" : "oktarintentakel/jqueryannex#v0.XX.0",
    ...
}
```

You can also add the dependency on the command line like this, albeit the command gets a little lengthy now:

```
yarn add @client/jqueryannex@oktarintentakel/jqueryannex#v0.XX.0
```



How do I include and use this?
------------------------------
Easy as pie. Just include it after jQuery and you're good to go.

```html
<script src="jquery-x.xx.x.js"></script>
<script src="jquery.annex.js"></script>
<script src="jquery.annex.xyz-plugin.js"></script>
```

If you use a build tool like grunt/gulp, you could just concatenate all files in the right order and maybe uglify them.

If you need some pointers about the possibilities, in the "/doc"-folder there's an expansive documentation (open index.html),
where each method also includes examples.



And if I want to load this as an AMD?
-------------------------------------
Just use it the same as you would with jQuery. Define it as a package in your paths/maps and require it. jQuery,
of course, is an automatic dependency. Plugins are working accordingly and require jquery and annex in the right order
by directly requiring "jqueryannex", which in turn requires "jquery".



I wanna be fancy and use ES6 through Babel, what now?
-----------------------------------------------------
Pure ES6 is still a problem for libs like jQuery and lodash at the moment, but if you are using Babel we're all in luck and that goes for
Annex as well. Babel internally uses Common JS modules when transpiling ES6 to ES5 which is helpful since jQuery and Annex offer Common JS support.

So, executing Babel-transpiled ES6 inside a normal browser window, this should work (considering that your module paths are configured, so your importer
may find the packages, otherwise use the appropriate path to import from):

```javascript
import jQueryOriginal from 'jquery';
import jQueryAnnex from 'jqueryannex';
import jQueryWithPlugin from 'jqueryannex/dist/jquery.annex.xyz-plugin';
// without plugin this would be = jQueryAnnex
const $ = jQuery = jQueryWithPlugin;
```

If for some reason Annex cannot find window.jQuery or window.$ it returns a factory function you can use to initialize Annex yourself:

```javascript
import jQueryOriginal from 'jquery';
import jQueryAnnexFactory from 'jqueryannex';
import jQueryWithPluginFactory from 'jqueryannex/dist/jquery.annex.xyz-plugin';
// leave out the plugin if none is needed
const jQuery = jQueryWithPluginFactory(jQueryAnnexFactory(jQueryOriginal));
const $ = jQuery;
```

If you want to use jQuery and annex in an environment without a proper browser window jQuery also falls back to a factory, in those cases
you can still use both like this (as I do in my Ava tests):

```javascript
import jQueryOriginalFactory from 'jquery';
import jQueryAnnexFactory from 'jqueryannex';
import jQueryWithPluginFactory from 'jqueryannex/dist/jquery.annex.xyz-plugin';
// provide global object to hold jQuery as window here, leave out the plugin if none is needed
const jQuery = jQueryWithPluginFactory(jQueryAnnexFactory(jQueryOriginalFactory(window)));
const $ = jQuery;
```



Strange versioning you got there...
-----------------------------------
Yes. Currently this is not a package with the classic major/minor scheme, but is a permanently evolving package, trying to keep up with the development
of jQuery. So, in essence, currently I use a system of incrementing independent revisions.

So using a fixed revision in your package management is always a good idea. Updating during development is always manually possible,
breaking changes should always be covered in the release notes, but do not configure your package definition to always auto-update to the latest
revision, especially not on production systems.



Is this any good, why should I use this?
----------------------------------------
That's a tough one.

The answers are: "that depends" and "maybe".

This is not a framework to be the backbone of a large project, but a personal selection of helpers. If you consider the functions on offer and the source
"good" is a matter of your needs, personal code style (if you think and work a little like I do) and the willingness to browse and try the solutions on
offer in your project.

This does not offer you a project structure, but tries to free you from seemingly simple, but viewed in detail, incredibly tedious tasks like specifically 
finding out when an image or a webfont is not only loaded, but actually rendered to a page, while providing some syntactic sugar to your JS/jQuery code
making standard stuff more readble and less tedious to write and look at.

If you search for something like that, using this sounds reasonable to me! But even if you'd rather not include the whole shebang you are absolutely free
to use this project for reference and steal shamelessly from it.

So in summary: Annex is a good addition for small to medium projects with a heavy focus on jQuery.



What's this validation plugin stuff?
------------------------------------
A while ago I wrote [HtmlForm](https://github.com/OktarinTentakel/htmlform), which is a form definition framework for PHP5. One result of this project was complex javascript form validation. When I moved away from server-side code to the client I suddenly needed form validation without the PHP context and decided to move the javascript validation part into an Annex-plugin.

This little piece of code is the result.

You can do quite advanced stuff with this plugin and I already used this for quite complex, bigger projects with knockout for example, but the API is still a little strange and convoluted for my taste, which is a result of the original validation structure of HtmlForm.

Nonetheless, this is quite mighty and the example implementation in `plugin-validation-example` will give you a good idea about the general workings.

By the way: this is a **form** validator, not an **object** or **schema** validator. If you don't have an actual form to validate, do yourself a favour and use [SchemaInspector](https://github.com/Atinux/schema-inspector) or, to be JSON schema compatible, use [JSEN](https://github.com/bugventure/jsen).



What is the solution plugin about?
----------------------------------
Annex is a very long running project indeed and over the years some implementations have found their way into the core that did not prove as common as I
initially thought. Since the methods are there, working and fully documented, I decided to move those exotic solutions to an own plugin to keep the
implementations as references. Be aware that these methods are not as thoroughly tested as the core, but the might still be helpful or at least a good
starting point for anyone trying to build an own implementation. Since the methods are just simple jQuery extensions you could even copy methods
selectively pretty easy.



The SaneDate plugin sounds interesting, what's that about?
----------------------------------------------------------
Date objects in JS are a nightmare. Working with date objects in JS cross-browser is a nightmare. Date objects in JS are insane.

This plugin tries to offer "sane" date objects to be able to actually work with dates and times without constantly stumbling over
some inconsistent implementation or browser issue. Additionally SaneDates offer extended possibilities of comparing dates, setting
attributes, validating them and converting them from local to UTC and back.

This was plugin was heavily influenced by Python's way of handling dates and datetimes.

Think of this as the little brother of [moment.js](https://momentjs.com/) or [Luxon](https://moment.github.io/luxon/index.html)
for your everyday needs of time handling in JS.
