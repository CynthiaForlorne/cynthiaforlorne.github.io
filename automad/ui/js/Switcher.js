/*
 *                    ....
 *                  .:   '':.
 *                  ::::     ':..
 *                  ::.         ''..
 *       .:'.. ..':.:::'    . :.   '':.
 *      :.   ''     ''     '. ::::.. ..:
 *      ::::.        ..':.. .''':::::  .
 *      :::::::..    '..::::  :. ::::  :
 *      ::'':::::::.    ':::.'':.::::  :
 *      :..   ''::::::....':     ''::  :
 *      :::::.    ':::::   :     .. '' .
 *   .''::::::::... ':::.''   ..''  :.''''.
 *   :..:::'':::::  :::::...:''        :..:
 *   ::::::. '::::  ::::::::  ..::        .
 *   ::::::::.::::  ::::::::  :'':.::   .''
 *   ::: '::::::::.' '':::::  :.' '':  :
 *   :::   :::::::::..' ::::  ::...'   .
 *   :::  .::::::::::   ::::  ::::  .:'
 *    '::'  '':::::::   ::::  : ::  :
 *              '::::   ::::  :''  .:
 *               ::::   ::::    ..''
 *               :::: ..:::: .:''
 *                 ''''  '''''
 *
 *
 * AUTOMAD
 *
 * Copyright (c) 2017-2021 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 * https://automad.org/license
 */

/*
 * 	Override the UIkit switcher plugin to get/set the current tab from/to the window.location.hash.
 */

+(function (Automad, $, UIkit) {
	Automad.Switcher = {
		dataAttr: {
			switcher: 'data-uk-switcher',
			tab: 'data-am-tab',
		},

		// Get the tab index from the given hash string.
		// Note that the matching tab name is stored in a data attribute to avoid scrolling to a given anchor on load.
		getActiveTab: function () {
			if (window.location.hash) {
				var hash = window.location.hash.substr(1);

				if ($.isNumeric(hash)) {
					return parseInt(hash);
				} else {
					return $(
						'[' + Automad.Switcher.dataAttr.tab + '="' + hash + '"]'
					).index();
				}
			} else {
				return 0;
			}
		},
	};

	// Override UIkit defaults to show the tab defined in the hash.
	UIkit.on('beforeready.uk.dom', function () {
		$.extend(UIkit.components.switcher.prototype.defaults, {
			active: Automad.Switcher.getActiveTab(),
		});
	});

	// Check if the hash value matches the active tab and update the switcher if needed.
	// That will be the case, when a link outside the actual switcher tries to change the active tab.
	$(window).on('hashchange', function () {
		var $switcher = $('[' + Automad.Switcher.dataAttr.switcher + ']'),
			$active = $switcher.children('.uk-active'),
			tab = Automad.Switcher.getActiveTab();

		// Only update if the hash doesn't match the active tab.
		if ($active.index() != tab) {
			$switcher.children('button').eq(tab).click();
		}
	});

	// Update the hash on show event.
	$(document).on('ready', function () {
		$('[' + Automad.Switcher.dataAttr.switcher + ']').on(
			'show.uk.switcher',
			function (event, $tab) {
				window.location.hash = $tab.data(
					Automad.Util.dataCamelCase(Automad.Switcher.dataAttr.tab)
				);
			}
		);
	});
})((window.Automad = window.Automad || {}), jQuery, UIkit);
