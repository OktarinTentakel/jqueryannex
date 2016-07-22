jQuery Annex
============


Written by:  Sebastian Schlapkohl  
eMail:       jqueryannex@ifschleife.de  
Sites: [github](https://github.com/OktarinTentakel/jqueryannex), [ifschleife](http://www.ifschleife.de)



What is this?
-------------
Annex is a jQuery-core-expanding collection of "nice to have" methods you'll need more often than not. The basic idea was (and is) to streamline most vanilla-js leftovers every javascript dev still has to deal with (like timeouts) and provide methods for those things as well as the stuff everyone searches for in jQuery at least once, but which aren't there (yet).

An example? Load a stylesheet the same way you'd load a script with getScript().

Another example? Flexible, centrally disablable console logging with check if the console is available.

Some more? Polling. A real isNaN. Pythonic string formatting. Precise long running timers. Method throttling. History manipulation. Image preloading. Webfont display callback. Sane date objects. And so on and so forth ...

Generally speaking: everytime i need some general missing functionality, semantically fitting with the jQuery core, I implement a generic solution. If something gets absorbed by the core it will be removed.

Annex should always fit the current jQuery version. Changes may be breaking but are documented in the commits. The fitting jQuery version is always included in the uncompressed file's header doc.



How do I include and use this?
------------------------------
Easy as pie. Just include it after jQuery and you're good to go.

```html
<script src="jquery-x.xx.x.min.js"></script>
<script src="jquery.annex.min.js"></script>
```

If you need some pointers about the possibilities, in the "/doc"-folder an expansive documentation (open index.html),
where each method also includes examples.



And if I want to load this as a module?
---------------------------------------
Just use it the same as you would with jQuery. Define it as a package in your paths/maps and require it. jQuery,
of course, is an automatic dependency.



Is this any good, why should I use this?
----------------------------------------
Everytime I have to do a one pager or smaller project without this helper lib I'm frustrated about the fact, that I, again, have to deal with all those already solved problems and bloat by code with those typical, ugly javascript weirdnesses.

This just lets you streamline everyday jQuery code and make things generally more friendly, for the price of 25kb.

In bigger projects, I'd recommend a solid framework like angular or backbone and maybe add underscore, here jQuery, if used at all, is mostly included for it's selector engine. So a jQuery addition seems a little pointless.

So in summary: Annex is a good addition for small to medium projects with a heavy focus on jQuery.



What's this validation plugin stuff?
------------------------------------
A while ago I wrote [HtmlForm](https://github.com/OktarinTentakel/htmlform), which is a form definition framework for PHP5. One result of this project was complex javascript form validation. When I moved away from server-side code to the client I suddenly needed form validation without the PHP context and decided to move the javascript validation part into an Annex-plugin.

This little piece of code is the result.

You can do quite advanced stuff with this plugin and I already used this for quite complex, bigger projects with knockout for example, but the API is still a little strange and convoluted for my taste, which is a result of the original validation structure of HtmlForm.

Nonetheless, this is quite mighty and the example implementation in `plugin-validation-example` will give you a good idea about the general workings.

By the way: this is a **form** validator, not an **object** or **schema** validator. If you don't have an actual form to validate, do yourself a favour and use [SchemaInspector](https://github.com/Atinux/schema-inspector).
