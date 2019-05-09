/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});
	
	// Search Bar
		updateSearchResults = function(event) {
			$search = $(event.currentTarget)
			let searchTags = $search.val().toLowerCase()

			// prevent a search queue (and more importantly, an animation queue) from building up with each keystroke
			if($search.hasClass('processing')) return
			$search.addClass('processing');
			
			// find which projects match search results
			let $projects = $('.work-item')
			let $visibleProjects = $projects.filter(':visible')
			let $projectsToShow = $projects.filter(function() {
				projectTags = $(this).children('.project-tags').html()
				let show = true
				searchTags.split(' ').forEach(function(tag) {
					if(projectTags.indexOf(tag)<0) show = false
				})
				return show
			})
			console.log()
			// change the view smoothly
			let oldNumProjects = $visibleProjects.length
			let newNumProjects = $projectsToShow.length
			if(oldNumProjects!==newNumProjects) {
				$portfolio = $('.portfolio')
				//$portfolio.clearQueue()
				//set height of #two
				let oldHeight = parseInt($portfolio.css('height'), 10)
				$portfolio.css('min-height', oldHeight)
				//fade out
				.queue(function() {
					console.log('fading out display')
					$visibleProjects.fadeOut(800)
					$(this).dequeue()
				})
				//expand height of #two if necessary
				.queue(function() {
					console.log('do we need to expand the div?')
					let newHeight
					let searchHeight = parseInt($('form').css('height'), 10)
					let projectHeight = parseInt($projects.css('height'), 10) + 32
					if(oldHeight>projectHeight*oldNumProjects) {
						newHeight = searchHeight+projectHeight*newNumProjects + 128
					} else {
						newHeight = searchHeight+projectHeight*Math.floor((newNumProjects+1)/2)+128
					}
					if(oldHeight<newHeight) {
						console.log('expanding div height')
						$portfolio.animate({minHeight: newHeight},800)
						$(this).dequeue()
					} else {
						$(this).dequeue()
					}
				})
				//check for updates
				.queue(function() {
					if($search.val().toLowerCase()!==searchTags) {
						$(this).clearQueue()
						$search.removeClass('processing')
						updateSearchResults(event)
						return
					}
					$(this).dequeue()
				})
				//fade in search results
				.queue(function() {
					console.log('fading in search results')
					$projectsToShow.fadeIn()
					setTimeout(function() {
						$portfolio.dequeue()
					}, 800)
					
				})
				//collapse height of #two
				.queue(function() {
					console.log('collapsing outer div')
					$portfolio.animate({minHeight: 0},800)
					$search.removeClass('processing')
					$(this).dequeue()
				})
				.queue(function() {
					if($search.val().toLowerCase()!==searchTags) {
						$(this).clearQueue()
						$search.removeClass('processing')
						updateSearchResults(event)
						return
					}
					$(this).dequeue()
				})
			} else {
				$search.removeClass('processing')
			}
			
		}

		$('#search').on('input',updateSearchResults)
		
})(jQuery);