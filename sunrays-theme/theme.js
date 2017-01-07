/*
 * Sunrays Theme v1.0 (http://lachezarov.com)
 * Licensed under the MIT license
 */

(function(win, doc) {
	var body = doc.body;

	var mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|wins ce|xda|xiino|android|playbook|silk/i.test(navigator.userAgent||navigator.vendor||win.opera);

	if( mobile ) {
		body.classList.add('touch');
	} else {
		body.classList.add('no-touch');
	}

	function QuickSearch(options) {
		this.defaults = {
			container: doc.body,
			searchables: doc.querySelectorAll('.item-name a')
		}

		if( options ) {
			for( var option in options ) {
				if( this.defaults.hasOwnProperty(option) ) {
					this.defaults[option] = options[option];
				}
			}
		}

		this.searchField;
		this.container;

		this.resultsContainer;

	}

	QuickSearch.prototype.init = function() {
		this.searchField = doc.createElement('input');

		this.searchField.type = 'search';
		this.searchField.classList.add('search-field');
		this.searchField.autocapitalize = 'off';
		this.searchField.autocomplete = 'off';
		this.searchField.autocorrect = 'off';
		this.searchField.spellcheck = false;

		this.container = this.defaults.container;

		this.resultsContainer = doc.createElement('div');

		this.resultsContainer.classList.add('results');

		this.treeLocation = themeDir + '/includes/Crawler.php';

		this.tree = [];

		this.append();

		this.getTree();

		this.bind();
	}

	QuickSearch.prototype.disable = function() {
		this.searchField.disabled = true;
		this.searchField.placeholder = '';
	}

	QuickSearch.prototype.enable = function() {
		this.searchField.disabled = false;
		this.searchField.placeholder = 'Search';
	}

	QuickSearch.prototype.append = function() {
		this.container.appendChild(this.searchField);
		this.container.appendChild(this.resultsContainer);
	}

	QuickSearch.shouldOpen = function(event) {
		if( event.altKey || event.ctrlKey || event.metaKey ) {
			return false;
		}
		
		var keycode = event.keyCode;

		return (keycode > 47 && keycode < 58) || 
        keycode == 32   || 
        (keycode > 64 && keycode < 91)   || 
        (keycode > 95 && keycode < 112)  || 
        (keycode > 185 && keycode < 193) || 
        (keycode > 218 && keycode < 223);
	}

	QuickSearch.prototype.getTree = function(reload) {
		this.disable();

		var _q = this;
		var treeLocation = _q.treeLocation;

		var req = new XMLHttpRequest();

		req.onreadystatechange = function() {
			if( this.readyState === 4 && this.status === 200 ) {
				_q.tree = JSON.parse(this.responseText);

				_q.enable();

				_q.container.classList.remove('loading');
			}
		}

		if( typeof reload !== 'undefined' && reload === true ) {
			treeLocation += '?reload=true';
		}

		req.open('GET', treeLocation, true);
		req.send();

		this.container.classList.add('loading');
	}

	QuickSearch.prototype.matchesForQuery = function(query) {
		var matches = [];

		for( var i = 0; i < this.tree.length; i++ ) {
			var item = this.tree[i];

			if( item.toLowerCase().indexOf(query) !== -1 ) {
				matches.push(item);
			}
		}

		return matches;
	}

	QuickSearch.prototype.displayResults = function(query) {
		var matches = this.matchesForQuery(query);

		if( matches.length ) {
			this.clear();

			for( var i = 0; i < matches.length; i++ ) {
				var match = QuickSearch.resultWithHrefForMatch(matches[i], query);

				this.resultsContainer.appendChild(match);
			}

			this.resultsContainer.classList.add('has-results');
		} else {
			this.resultsContainer.classList.add('no-results');
			this.resultsContainer.innerHTML = 'No Results Found :(';
		}
	}

	QuickSearch.prototype.clear = function() {
		this.resultsContainer.innerHTML = '';

		this.resultsContainer.classList.remove('no-results');
		this.resultsContainer.classList.remove('has-results');
	}

	QuickSearch.prototype.focusNextResult = function(event) {
		var target = event.target;

		var results;

		if( target.classList.contains('search-field') ) {
			results = doc.querySelectorAll('.result');
		} else {
			results = doc.querySelectorAll('.item');
		}

		if( results.length ) {
			var currentResult = doc.querySelector('.focused');

			if( currentResult === null ) {
				currentResult = results[0];

				currentResult.classList.add('focused');
			} else {
				var nextResult = currentResult.nextSibling;

				currentResult.classList.remove('focused');

				if( nextResult === null || 'classList' in nextResult === false ) {
					nextResult = results[0];
				}

				nextResult.classList.add('focused');
			}

			this.scrollToFocusedResult();
		}
	}

	QuickSearch.prototype.focusPreviousResult = function(event) {
		var target = event.target;

		var results;

		if( target.classList.contains('search-field') ) {
			results = doc.querySelectorAll('.result');
		} else {
			results = doc.querySelectorAll('.item');
		}

		if( results.length ) {
			var currentResult = doc.querySelector('.focused');

			if( currentResult === null ) {
				currentResult = results[results.length - 1];

				currentResult.classList.add('focused');
			} else {
				var prevResult = doc.querySelector('.focused').previousSibling;

				currentResult.classList.remove('focused');

				if( prevResult === null || 'classList' in prevResult === false ) {
					prevResult = results[results.length - 1];
				}

				prevResult.classList.add('focused');
			}

			this.scrollToFocusedResult();
		}
	}

	QuickSearch.prototype.scrollToFocusedResult = function() {
		var focused = doc.querySelector('.focused');

		var inSearch = focused.classList.contains('result');

		var scroller = inSearch ? this.resultsContainer : getScrollingElement();

		var scrollPos = inSearch ? focused.offsetTop - scroller.clientHeight + focused.offsetHeight : focused.offsetTop - win.innerHeight + focused.offsetHeight + focused.parentNode.offsetTop;

		if( scrollPos < 0 ) {
			scrollPos = 0;
		}

		scroller.scrollTop = scrollPos;
	}

	QuickSearch.prototype.bind = function() {
		var _q = this;
		var searchField = _q.searchField;

		this.resultsContainer.addEventListener('click', function(event) {
			var target = event.target;

			if( target.classList.contains('result') ) {
				location = target.href;
			}
		});

		win.addEventListener('mousemove', function(event) {
			var focused = doc.querySelector('.focused');

			if( focused !== null ) {
				focused.classList.remove('focused');
			}
		});

		this.resultsContainer.addEventListener('touchstart', function(event) {
			var focused = this.querySelector('.focused');

			if( focused !== null ) {
				focused.classList.remove('focused');
			}
		});

		addEventListener('keydown', function(event) {
			var target = event.target;

			if( !target.classList.contains('search-field') ) {
				if( event.keyCode === 8 ) {
					event.preventDefault();

					history.back();
				} else {
					if( QuickSearch.shouldOpen(event) ) {
						searchField.focus();

						searchField.classList.add('filled');
					}
				}
			}
		});

		win.addEventListener('keydown', function(event) {
			if( event.keyCode === 38 || event.keyCode === 40 ) {
				event.preventDefault();

				if( event.keyCode === 38 ) {
					_q.focusPreviousResult(event);
				} else {
					_q.focusNextResult(event);
				}
			}

			if( event.keyCode === 13 ) {
				event.preventDefault();

				var target = event.target;

				var results;

				if( target.classList.contains('result') ) {
					results = doc.querySelectorAll('.result');
				} else {
					results = doc.querySelectorAll('.item');
				}

				if( results.length ) {
					var focused = doc.querySelector('.focused');

					if( focused === null ) {
						_q.focusNextResult(event);

						focused = doc.querySelector('.focused');
					}

					if( focused.classList.contains('result') ) {
						location = focused.href;
					} else if ( autoDrillDown ) {
						focused.click();
					}
				}
			}
		}, false);

		searchField.addEventListener('keyup', function(event) {
			if( event.keyCode === 38 || event.keyCode === 40 ) {
				return false;
			}

			if( this.value.length > 0 ) {
				this.classList.add('filled');

				if( this.value.length > 2 ) {
					if( this.value === ':reload' ) {
						this.value = '';

						this.blur();

						_q.clear();

						_q.getTree(true);
					} else {
						_q.displayResults(this.value.toLowerCase());
					}
				} else {
					_q.clear();
				}
			} else {
				this.classList.remove('filled');

				_q.clear();
			}

			if( event.keyCode === 27 ) {

				if( this.value.length === 0 ) {
					this.classList.remove('filled');
				}

				this.blur();
			}
		});

		searchField.addEventListener('focus', function(event) {
			body.classList.add('searching');

			doc.querySelector('.focused').classList.remove('focused');
		});

		searchField.addEventListener('blur', function(event) {
			setTimeout(function() {
				body.classList.remove('searching');

				doc.querySelector('.focused').classList.remove('focused');
			}, 50);
		});
	}

	QuickSearch.resultWithHrefForMatch = function(href, match) {
		var result = doc.createElement('a');

		var matchRegex = new RegExp(match, 'gi');
		var matchedText = href.replace(matchRegex, '<span class="match">' + match + '</span>');

		result.href = href;
		result.innerHTML = matchedText;
		result.classList.add('result');

		return result;
	}

	if( searchEnabled ) {
		var searchContainer = doc.createElement('div');

		searchContainer.classList.add('search');

		doc.querySelector('.wrapper').appendChild(searchContainer);

		var search = new QuickSearch({
			container: searchContainer
		});

		search.init();
	}

	var sort = doc.querySelector('.nav-sort');
	var sortTrigger = doc.querySelector('.nav-trigger');

	sort.addEventListener('touchstart', function(event) {
		if( !sort.classList.contains('open') ) {
			event.preventDefault();

			sort.classList.add('open');
		}
	});

	addEventListener('touchstart', function(event) {
		var target = event.target;

		if( doc.querySelectorAll('.nav-sort.open').length && !target.classList.contains('nav-trigger') ) {
			sort.classList.remove('open');
		}
	});

	var firstLink = document.querySelector('.item:first-of-type');
	var firstLinkValue = firstLink.querySelector('.item-name').innerHTML;

	if( firstLinkValue === 'Parent Directory' ) {
		addEventListener('keydown', function(event) {
			if( event.altKey && event.keyCode === 38 ) {
				firstLink.click();
			}
		}, false);
	}

	if( autoDrillDown ) {
		var items = doc.querySelectorAll('.item');
		var query = themeDir + '/includes/DrillDown.php?start=';

		for( var i = 0; i < items.length; i++ ) {
			var item = items[i];

			if( item.getAttribute('href').indexOf('/') > 0 ) {
				item.addEventListener('click', function(event) {
					event.preventDefault();

					var href = query + this.href.replace(location.origin, '');
					
					var req = new XMLHttpRequest();

					req.onreadystatechange = function() {
						if( this.readyState === 4 && this.status === 200 ) {
							location = this.responseText;
						}
					}

					req.open('GET', href, true);
					req.send();
				}, false);
			}
		}
	}

	function getScrollingElement() {
		return doc.documentElement.scrollHeight > doc.body.scrollHeight && doc.compatMode.indexOf('CSS1') == 0 ? doc.documentElement : doc.body;
	}

})(window, document);

