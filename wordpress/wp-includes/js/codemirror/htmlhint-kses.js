/* global HTMLHint */
/* eslint no-magic-numbers: ["error", { "ignore": [0, 1] }] */
HTMLHint.addRule({
	id: 'kses',
	description: 'Element or attribute cannot be used.',
	init: function( parser, reporter, options ) {
		'use strict';

		var self = this;
		parser.addListener( 'tagstart', function( Event ) {
			var attr, col, attrName, allowedAttributes, i, len, tagName;

			tagName = Event.tagName.toLowerCase();
			if ( ! options[ tagName ] ) {
				reporter.error( 'Tag <' + Event.tagName + '> is not allowed.', Event.line, Event.col, self, Event.raw );
				return;
			}

			allowedAttributes = options[ tagName ];
			col = Event.col + Event.tagName.length + 1;
			for ( i = 0, len = Event.attrs.length; i < len; i++ ) {
				attr = Event.attrs[ i ];
				attrName = attr.name.toLowerCase();
				if ( ! allowedAttributes[ attrName ] ) {
					reporter.error( 'Tag attribute [' + attr.raw + ' ] is not allowed.', Event.line, col + attr.index, self, attr.raw );
				}
			}
		});
	}
});
