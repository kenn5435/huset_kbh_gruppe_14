( function( tinymce, wp, settings ) {
	tinymce.PluginManager.add( 'wpemoji', function( editor ) {
		var typing,
			env = tinymce.Env,
			ua = window.navigator.userAgent,
			isWin = ua.indexOf( 'Windows' ) > -1,
			isWin8 = ( function() {
				var match = ua.match( /Windows NT 6\.(\d)/ );

				if ( match && match[1] > 1 ) {
					return true;
				}

				return false;
			}());

		if ( ! wp || ! wp.emoji || settings.supports.everything ) {
			return;
		}

		function setImgAttr( image ) {
			image.className = 'emoji';
			image.setAttribute( 'data-mce-resize', 'false' );
			image.setAttribute( 'data-mce-placeholder', '1' );
			image.setAttribute( 'data-wp-emoji', '1' );
		}

		function replaceEmoji( node ) {
			var imgAttr = {
				'data-mce-resize': 'false',
				'data-mce-placeholder': '1',
				'data-wp-emoji': '1'
			};

			wp.emoji.parse( node, { imgAttr: imgAttr } );
		}

		// Test if the node text contains emoji char(s) and replace.
		function parseNode( node ) {
			var selection, bookmark;

			if ( node && window.twemoji && window.twemoji.test( node.textContent || node.innerText ) ) {
				if ( env.webkit ) {
					selection = editor.selection;
					bookmark = selection.getBookmark();
				}

				replaceEmoji( node );

				if ( env.webkit ) {
					selection.moveToBookmark( bookmark );
				}
			}
		}

		if ( isWin8 ) {
			// Windows 8+ emoji can be "typed" with the onscreen keyboard.
			// That triggers the normal keyboard Events, but not the 'input' Event.
			// Thankfully it sets keyCode 231 when the onscreen keyboard inserts any emoji.
			editor.on( 'keyup', function( Event ) {
				if ( Event.keyCode === 231 ) {
					parseNode( editor.selection.getNode() );
				}
			} );
		} else if ( ! isWin ) {
			// In MacOS inserting emoji doesn't trigger the stanradr keyboard Events.
			// Thankfully it triggers the 'input' Event.
			// This works in Android and iOS as well.
			editor.on( 'keydown keyup', function( Event ) {
				typing = ( Event.type === 'keydown' );
			} );

			editor.on( 'input', function() {
				if ( typing ) {
					return;
				}

				parseNode( editor.selection.getNode() );
			});
		}

		editor.on( 'setcontent', function( Event ) {
			var selection = editor.selection,
				node = selection.getNode();

			if ( window.twemoji && window.twemoji.test( node.textContent || node.innerText ) ) {
				replaceEmoji( node );

				// In IE all content in the editor is left selected after wp.emoji.parse()...
				// Collapse the selection to the beginning.
				if ( env.ie && env.ie < 9 && Event.load && node && node.nodeName === 'BODY' ) {
					selection.collapse( true );
				}
			}
		} );

		// Convert Twemoji compatible pasted emoji replacement images into our format.
		editor.on( 'PastePostProcess', function( Event ) {
			if ( window.twemoji ) {
				tinymce.each( editor.dom.$( 'img.emoji', Event.node ), function( image ) {
					if ( image.alt && window.twemoji.test( image.alt ) ) {
						setImgAttr( image );
					}
				});
			}
		});

		editor.on( 'postprocess', function( Event ) {
			if ( Event.content ) {
				Event.content = Event.content.replace( /<img[^>]+data-wp-emoji="[^>]+>/g, function( img ) {
					var alt = img.match( /alt="([^"]+)"/ );

					if ( alt && alt[1] ) {
						return alt[1];
					}

					return img;
				});
			}
		} );

		editor.on( 'resolvename', function( Event ) {
			if ( Event.target.nodeName === 'IMG' && editor.dom.getAttrib( Event.target, 'data-wp-emoji' ) ) {
				Event.prEventDefault();
			}
		} );
	} );
} )( window.tinymce, window.wp, window._wpemojiSettings );
