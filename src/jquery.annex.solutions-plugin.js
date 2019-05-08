/**
 * jQueryAnnex - Solution Plugin
 * Provides complex interface solutions too specific, big and/or complicated to be included in the base lib, since
 * they are too special and complex to be relevant for most projects.
 *
 * Think about complete generic solutions for common problems like building a dynamic hash navigation or initializing
 * responsive background images for an element. There's also a good chance these solutions might be too generic for your
 * purpose and do not offer enough flexibility. So you may either include them if needed or at least use them as a reference
 * or starting point for your own solution.
 *
 * Have a look at the plugin-solutions-example.html in the repository for example usage and test it locally in
 * your browser.
 *
 * @author Sebastian Schlapkohl <jqueryannex@ifschleife.de>
 * @version Revision 44 developed and tested with jQuery 3.3.1, 2.2.4 and 1.12.4
 **/



// automatically determine if annex should be loaded traditionally, as an AMD-module or via commonjs, if included before anything that
// exposes "define" (require.js e.g.), it will load normally, extending jQuery directly and globally
// if loaded as AMD-module it expects Annex to be available as "jqueryannex"
(function(global, factory){
	var jQuery = global.jQuery || global.$;

	if( (typeof define === 'function') && define.amd ){
		define(['jqueryannex'], factory);
	} else if( (typeof module === 'object') && module.exports ){
		if( !global.__AVA_ENV__ ){
			try {
				if( !jQuery ){
					jQuery = require('jquery');
				}

				if( !jQuery.jqueryAnnexData ){
					jQuery = require('jqueryannex');
				}
			} catch(ex){}
		}

		module.exports = jQuery
			? factory(jQuery)
			: function(jQuery){
				return factory(jQuery);
			}
		;
	} else {
		factory(jQuery);
	}
}((typeof window !== 'undefined') ? window : this, function($){

	//--|CHECK-AND-PREPARE-JQUERY----------

	(function(){
		if( !$ || !$.fn || !$().jquery ){
			throw 'jQueryAnnex Solutions Plugin | cannot extend jQuery, since it does not seem to be available as "jQuery" or is missing basic functionality';
		}

		if( !$.jqueryAnnexData ){
			throw 'jQueryAnnex Solutions Plugin | cannot extend jQuery Annex, since it does not seem to be available yet';
		}
	}());



	//--|JQUERYANNEXDATA----------

	$.extend($.jqueryAnnexData, {
		highDpiBackgroundImages : {
			targetClosures : [],
			checkTimer : {id : window.setTimeout($.noop, 1), type : 'timeout'}
		}
	});



	//--|JQUERY-$-GENERAL-FUNCTIONS----------

	$.extend({

		/**
		 * @namespace Navigation:$.setupHashNavHighlighting
		 **/

		/**
		 * Defines the default logic for an innerpage hashnav, where the currently visible section should automatically
		 * be highlighted while scrolling. This solution is based on elements containing a headline stating the nav title,
		 * being in a container constituting a nav section. The section has to bear the id, referenced in the nav items
		 * href. The href may be with or without leading path, but may only include _one_ #.
		 *
		 * @param {Object} $navElements - the jQuery-collection of nav elements to highlight, each bearing the href and getting the activeClass
		 * @param {Object} [$sectionElements] - the jQuery-collection of section elements, containing some kind of headline and bearing the id
		 * @param {?String} [headlineSelector='h2:first'] - the jQuery selector to find the headline element by in a section
		 * @param {?('first-visible-headline'|'headline-at-top')} [algorithm='first-visible-headline'] - defines the algorithm by which $navElements are set active
		 * @param {?Number.Integer} [throttleMs=250] - the minimum interval in which the scroll handler is fired, 0 disables throttling
		 * @param {?String} [activeClass='active'] - the class to set upon the active nav element
		 *
		 * @memberof Navigation:$.setupHashNavHighlighting
		 * @example
		 * $.setupHashNavHighlighting($('#subnav a[href^="#"]'), $('main section'), 'h2', 'headline-at-top', 400, 'highlight')
		 **/
		setupHashNavHighlighting : function($navElements, $sectionElements, headlineSelector, algorithm, throttleMs, activeClass){
			headlineSelector = this.orDefault(headlineSelector, 'h2:first', 'string');
			algorithm = this.orDefault(algorithm, 'first-visible-headline');
			throttleMs = this.orDefault(throttleMs, 250, 'int');
			activeClass = this.orDefault(activeClass, 'active', 'string');

			var fHandler = function(){
				var found = false;

				switch( algorithm ){
					case 'first-visible-headline':
						$navElements.removeClass(activeClass);
						$sectionElements.each(function(){
							var $headline = $(this).find(headlineSelector).first();

							if( ($headline.length > 0) &&  $headline.isInViewport(true) ){
								$navElements.filter('[href*="#'+$(this).attr('id')+'"]').first().addClass(activeClass);
								found = true;
								return false;
							}
						});

						if( !found ){
							$sectionElements.each(function(){
								if( $(this).isInViewport() ){
									$navElements.filter('[href*="#'+$(this).attr('id')+'"]').first().addClass(activeClass);
									found = true;
									return false;
								}
							});
						}
					break;

					case 'headline-at-top':
						var viewportHeight = window.innerHeight || $(window).height(),
				            userHasScrolledToPageBottom = ($(window).scrollTop() + viewportHeight) > ($('body').height() - Math.round(viewportHeight / 10));

						$navElements.removeClass(activeClass);
						if( !userHasScrolledToPageBottom ){
				            $sectionElements.each(function(){
				                var $headline = $(this).find(headlineSelector),
									headlineTop = $.isFunction($headline.oo().getBoundingClientRect) ? $headline.oo().getBoundingClientRect().top : $headline.offset().top;

				                if( headlineTop < Math.round(viewportHeight / 10) ){
									$navElements.removeClass(activeClass);
									$navElements.filter('[href*="#'+$(this).attr('id')+'"]').first().addClass(activeClass);
				                }
				            });
				        } else {
							$navElements.filter('[href*="#'+$sectionElements.last().attr('id')+'"]').first().addClass(activeClass);
				        }
					break;
				}
			};

			$(window).off('scroll.dynamichashnav resize.dynamichashnav');
			if( throttleMs > 0 ){
				$(window).on('scroll.dynamichashnav resize.dynamichashnav', this.throttleExecution(throttleMs, fHandler, true, true));
			} else {
				$(window).on('scroll.dynamichashnav resize.dynamichashnav', fHandler);
			}
			$(window).triggerHandler('scroll.dynamichashnav');
		}

	});



	//--|JQUERY-OBJECT-GENERAL-FUNCTIONS----------

	$.fn.extend({

		/**
		 * @namespace Images:$fn.highDpiBackgroundImage
		 **/

		/**
		 * Configures and sets the element's background image to a normal or highdpi-version depending on the display context.
		 *
		 * images is an array of the form [{}, {}, ...], where each object should look like this (widths and heights being optional):
		 * {standard : {url : '...', width : 150, height : 150}, highdpi : {url : '...', width : 150, height : 150}}
		 * To supply a single background you can also just provide one object.
		 *
		 * This function tries to implement a smart way of selecting the right image version.
		 * If image/container dimensions are set the highdpi-version is chosen based on contextHasHighDpi(), but if
		 * dimensions were not defined, it's tried to determine the maxpage width, either per pageMaxWidth or by looking
		 * at css max-width of body and the high dpi is only applied if the viewport is larger than half the max size, so
		 * we'll never load giant images unnecessarily on small devices, although they may have high dpi. You can force this
		 * behaviour with ignoreDims.
		 *
		 * All images hooked via this function are polled and adapted with a delay after each resize.
		 *
		 * If no dimensions are set on the image the element's css is resposible to set a background-size value.
		 *
		 * @param  {(Object|Array)} images - the image(s) to apply, see definition in description above
		 * @param  {?(Number.Integer|String)} [pageMaxWidth=*max-width of body or 0*] - either the page max size directly or a selector to get the max-size from via css
		 * @param  {?Boolean} [ignoreDims=false] - if set, always tries to keep viewport vs. page max size in mind before setting image version, even if dims are set
		 * @param  {?Number.Integer} [reactionDelayMs=500] - the delay after each window resize before the images are checked and adapted
		 * @returns {Object} this
		 *
		 * @memberof Images:$fn.highDpiBackgroundImage
		 * @example
		 * $('.poster').highDpiBackgroundImage({standard : {url : '..', width : 150, height : 150}, highdpi : {url : '..', width : 300, height : 300}}, 1200, true, 1000);
		 **/
		highDpiBackgroundImage : function(images, pageMaxWidth, ignoreDims, reactionDelayMs){
			images = $.isPlainObject(images) ? [images] : images;
			pageMaxWidth = $.isInt(pageMaxWidth) ? pageMaxWidth : ($.isSet(pageMaxWidth) ? $.cssToNumber($(''+pageMaxWidth).css('max-width')) : null);
			ignoreDims = $.orDefault(ignoreDims, false, 'bool');
			reactionDelayMs = $.orDefault(reactionDelayMs, 500, 'int');

			if( !$.isSet(pageMaxWidth) ){
				pageMaxWidth = $.cssToNumber($('body').css('max-width'));

				if( $.isNaN(pageMaxWidth) ){
					pageMaxWidth = 0;
				}
			}

			var _this_ = this;

			var fSelectImageVersion = function(){
				if( $(_this_).isInDom() ){
					var imagesToPreload = [],
						cssImgUrls = '',
						cssImgSizes = '',
						highDpi = $.contextHasHighDpi(),
						vpWidth = window.innerWidth || $(window).width();

					for( var imageIndex = 0; imageIndex < images.length; imageIndex++ ){
						var image = images[imageIndex];

						if( $.exists('standard.url', image) ){
							if( !$.exists('highdpi', image)  ){
								image.highdpi = $.extend({}, image.standard);
							}

							var smartAdapt = !$.isSet(image.standard.width, image.standard.height, image.highdpi.width, image.highdpi.height) || ignoreDims,
								imageToUse = {
									url : image.standard.url,
									width: image.standard.width,
									height : image.standard.height
								}
							;

							if(
								(smartAdapt && (vpWidth > (pageMaxWidth / 2)) && highDpi)
								|| (!smartAdapt && highDpi)
							){
								imageToUse.url = image.highdpi.url;
								imageToUse.width = parseInt(image.highdpi.width, 10);
								imageToUse.height = parseInt(image.highdpi.height, 10);
							}

							imagesToPreload.push(imageToUse.url);
							cssImgUrls += ((cssImgUrls !== '') ? ', ' : '') + 'url('+imageToUse.url+')';
							if( $.isSet(imageToUse.width, imageToUse.height) && (imageToUse.width > 0) && (imageToUse.height > 0) ){
								cssImgSizes += ((cssImgSizes !== '') ? ', ' : '') + imageToUse.width+'px '+imageToUse.height+'px';
							}
						} else {
							$.log('highDpiBackgroundImage | image is missing a standard dict:', image);
						}
					}

					var preloadImage = null,
						preloadedCount = 0;

					for( var imageToPreloadIndex = 0; imageToPreloadIndex < imagesToPreload.length; imageToPreloadIndex++ ){
						preloadImage = new Image();
						preloadImage.src = imagesToPreload[imageToPreloadIndex];
						$(preloadImage).imgLoad(function(){
							preloadedCount++;
							if( preloadedCount >= imagesToPreload.length ){
								$(_this_)
									.css('background-image', cssImgUrls)
									.cssCrossBrowser({'background-size' : cssImgSizes})
								;
							}
						});
					}
				}
			};

			fSelectImageVersion();
			$.jqueryAnnexData.highDpiBackgroundImages.targetClosures.push(fSelectImageVersion);

			$(window)
				.off('resize.highdpibackgroundimages')
				.on('resize.highdpibackgroundimages', function(){
					$.jqueryAnnexData.highDpiBackgroundImages.checkTimer = $.reschedule(
						$.jqueryAnnexData.highDpiBackgroundImages.checkTimer,
						reactionDelayMs,
						function(){
							for( var i = 0; i < $.jqueryAnnexData.highDpiBackgroundImages.targetClosures.length; i++ ){
								$.jqueryAnnexData.highDpiBackgroundImages.targetClosures[i]();
							}
						}
					);
				})
			;

			return this;
		}

	});

	return $;

}));
