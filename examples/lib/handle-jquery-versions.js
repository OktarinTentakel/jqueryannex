(function(plugins){
	function getUrlParameter(name){
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	function loadScript(path, callback) {
		var done = false,
			scr = document.createElement('script');

		scr.onload = handleLoad;
		scr.onreadystatechange = handleReadyStateChange;
		scr.onerror = handleError;
		scr.src = path;
		document.getElementsByTagName('head')[0].appendChild(scr);

		function handleLoad(){
			if( !done ){
				done = true;
				callback(path, 'success');
			}
		}

		function handleReadyStateChange(){
			var state;

			if( !done ){
				state = scr.readyState;
				if( state === 'complete' ){
					handleLoad();
				}
			}
		}

		function handleError(){
			if( !done ){
				done = true;
				callback(path, 'error');
			}
		}
	}

	function allLoadedCallback(){
		jqueryAddedCallback();
		$.log().info('Active jQuery Version: '+$().jquery);

		$(function(){

			$('h1').first().before(
				$(''
					+'<nav>'
						+'<div class="nav-wrapper">'
							+'<ul>'
								+ (
									(window.location.pathname === '/' || window.location.pathname.indexOf('index.html') >= 0)
									? ''
									: '<li><a href="index.html">&lt;&nbsp;HOME</a></li>'
								)
								+'<li><a href="?jquery=3">Use jQuery v3</a></li>'
								+'<li><a href="?jquery=2">Use jQuery v2</a></li>'
								+'<li><a href="?jquery=1">Use jQuery v1</a></li>'
							+'</ul>'
						+'</div>'
					+'</nav>'
				)
			);
		});
	}

	var jqueryVersion = getUrlParameter('jquery');
	jqueryVersion = jqueryVersion ? parseInt(jqueryVersion, 10) : 3;

	loadScript('lib/jquery-vX/jquery.min.js'.replace('jquery-vX', 'jquery-v'+jqueryVersion), function(){
		loadScript('lib/jquery.annex.js', function(){
			if( !plugins || plugins.length === 0 ){
				allLoadedCallback();
			} else {
				var loadedPluginCount = 0;

				for(var i = 0; i < plugins.length; i++){
					loadScript(plugins[i], function(){
						loadedPluginCount++;

						if( loadedPluginCount === plugins.length ){
							allLoadedCallback();
						}
					});
				}
			}
		});
	});
})(window.HANDLE_JQUERY_PLUGINS);
