/*
	Strata by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
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

				// breakpoints.on('>medium', function() {

				// 	$header.css('background-position', 'left 0px');

				// 	$window.on('scroll.strata_parallax', function() {
				// 		$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
				// 	});

				// });

				breakpoints.on('>medium', function() {

				// If header has two backgrounds (overlay + image), keep overlay fixed and move only image layer.
				// If it only has one background, fallback to old-style "left ypx".
				var supportsMultiBg = false;
				try {
					var bgImg = $header.css('background-image') || '';
					supportsMultiBg = (bgImg.indexOf(',') !== -1);
				} catch (e) {}

				// Init position
				if (supportsMultiBg)
					$header.css('background-position', 'top left, center 0px'); // overlay , image
				else
					$header.css('background-position', 'left 0px');

				// Adaptive parallax: normalize by total scrollable length
				$window.off('scroll.strata_parallax').on('scroll.strata_parallax', function() {

					var scrollY = $window.scrollTop() || 0;

					// Total scrollable distance; longer content => larger maxScroll => slower visual movement
					var maxScroll = Math.max(1, $(document).height() - $window.height());

					// 0..1 progress
					var t = Math.min(1, Math.max(0, scrollY / maxScroll));

					// Maximum background shift (px): controls "how much" the image can move overall
					// You can tune this; 180~320 is a good range.
					var maxShift = 220;

					var y = Math.round(-t * maxShift);

					if (supportsMultiBg)
						$header.css('background-position', 'top left, center ' + y + 'px');
					else
						$header.css('background-position', 'left ' + y + 'px');

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

})(jQuery);