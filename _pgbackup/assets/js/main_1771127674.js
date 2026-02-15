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

			// (已不再使用强度因子，但保留结构)
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

	// Initial animation
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Touch mode
	if (browser.mobile) {
		$body.addClass('is-touch');
		window.setTimeout(function() {
			$window.scrollTop($window.scrollTop() + 1);
		}, 0);
	}

	// Footer
	breakpoints.on('<=medium', function() {
		$footer.insertAfter($main);
	});

	breakpoints.on('>medium', function() {
		$footer.appendTo($header);
	});

	// Header Parallax
	if (browser.name == 'ie' || browser.mobile)
		settings.parallax = false;

	if (settings.parallax) {

		// ---- Cover-aware background computation ----

		var bg = {
			url: null,
			imgW: 0,
			imgH: 0,
			maxShift: 0
		};

		function getLastBgUrl(el) {
			var bgImg = window.getComputedStyle(el).backgroundImage || '';
			var matches = bgImg.match(/url\((['"]?)(.*?)\1\)/g);
			if (!matches || matches.length === 0) return null;
			var last = matches[matches.length - 1];
			var m = last.match(/url\((['"]?)(.*?)\1\)/);
			return m && m[2] ? m[2] : null;
		}

		function recomputeMaxShift() {

			if (!bg.imgW || !bg.imgH) {
				bg.maxShift = 0;
				return;
			}

			var headerW = $header.outerWidth();
			var headerH = $header.outerHeight();

			var scale = Math.max(headerW / bg.imgW, headerH / bg.imgH);
			var renderedBgH = bg.imgH * scale;

			bg.maxShift = Math.max(0, renderedBgH - headerH);
		}

		function ensureBgLoaded() {

			var url = getLastBgUrl($header[0]);
			if (!url) return;

			if (bg.url === url && bg.imgW && bg.imgH) {
				recomputeMaxShift();
				return;
			}

			bg.url = url;
			bg.imgW = 0;
			bg.imgH = 0;
			bg.maxShift = 0;

			var img = new Image();
			img.onload = function() {
				bg.imgW = img.naturalWidth || img.width || 0;
				bg.imgH = img.naturalHeight || img.height || 0;
				recomputeMaxShift();
				$window.triggerHandler('scroll.strata_parallax');
			};
			img.src = url;
		}

		breakpoints.on('<=medium', function() {
			$window.off('scroll.strata_parallax');
			$header.css('background-position', '');
		});

		breakpoints.on('>medium', function() {

			ensureBgLoaded();
			recomputeMaxShift();

			$window.on('resize.strata_parallax', function() {
				recomputeMaxShift();
			});

			$window.off('scroll.strata_parallax').on('scroll.strata_parallax', function() {

				ensureBgLoaded();

				var scrollY = $window.scrollTop();
				var totalScrollable = Math.max(1, $(document).height() - $window.height());

				var progress = scrollY / totalScrollable;
				var shift = -1 * (progress * bg.maxShift);

				$header.css('background-position', 'left ' + shift + 'px');

			});

		});

		$window.on('load', function() {
			$window.triggerHandler('scroll');
		});

	}

	// Lightbox
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
