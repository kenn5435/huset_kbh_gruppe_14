/**
 * WordPress View plugin.
 */
( function( tinymce, wp ) {
	tinymce.PluginManager.add( 'wpview', function( editor ) {
		function noop () {}

		if ( ! wp || ! wp.mce || ! wp.mce.views ) {
			return {
				getView: noop
			};
		}

		// Check if a node is a view or not.
		function isView( node ) {
			return editor.dom.hasClass( node, 'wpview' );
		}

		// Replace view tags with their text.
		function resetViews( content ) {
			function callback( match, $1 ) {
				return '<p>' + window.decodeURIComponent( $1 ) + '</p>';
			}

			if ( ! content ) {
				return content;
			}

			return content
				.replace( /<div[^>]+data-wpview-text="([^"]+)"[^>]*>(?:\.|[\s\S]+?wpview-end[^>]+>\s*<\/span>\s*)?<\/div>/g, callback )
				.replace( /<p[^>]+data-wpview-marker="([^"]+)"[^>]*>[\s\S]*?<\/p>/g, callback );
		}

		editor.on( 'init', function() {
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

			if ( MutationObserver ) {
				new MutationObserver( function() {
					editor.fire( 'wp-body-class-change' );
				} )
				.observe( editor.getBody(), {
					attributes: true,
					attributeFilter: ['class']
				} );
			}

			// Pass on body class name changes from the editor to the wpView iframes.
			editor.on( 'wp-body-class-change', function() {
				var className = editor.getBody().className;

				editor.$( 'iframe[class="wpview-sandbox"]' ).each( function( i, iframe ) {
					// Make sure it is a local iframe
					// jshint scripturl: true
					if ( ! iframe.src || iframe.src === 'javascript:""' ) {
						try {
							iframe.contentWindow.document.body.className = className;
						} catch( er ) {}
					}
				});
			} );
		});

		// Scan new content for matching view patterns and replace them with markers.
		editor.on( 'beforesetcontent', function( Event ) {
			var node;

			if ( ! Event.selection ) {
				wp.mce.views.unbind();
			}

			if ( ! Event.content ) {
				return;
			}

			if ( ! Event.load ) {
				node = editor.selection.getNode();

				if ( node && node !== editor.getBody() && /^\s*https?:\/\/\S+\s*$/i.test( Event.content ) ) {
					// When a url is pasted or inserted, only try to embed it when it is in an empty paragrapgh.
					node = editor.dom.getParent( node, 'p' );

					if ( node && /^[\s\uFEFF\u00A0]*$/.test( editor.$( node ).text() || '' ) ) {
						// Make sure there are no empty inline elements in the <p>
						node.innerHTML = '';
					} else {
						return;
					}
				}
			}

			Event.content = wp.mce.views.setMarkers( Event.content, editor );
		} );

		// Replace any new markers nodes with views.
		editor.on( 'setcontent', function() {
			wp.mce.views.render();
		} );

		// Empty view nodes for easier processing.
		editor.on( 'preprocess hide', function( Event ) {
			editor.$( 'div[data-wpview-text], p[data-wpview-marker]', Event.node ).each( function( i, node ) {
				node.innerHTML = '.';
			} );
		}, true );

		// Replace views with their text.
		editor.on( 'postprocess', function( Event ) {
			Event.content = resetViews( Event.content );
		} );

		// Replace views with their text inside undo levels.
		// This also prEvents that new levels are added when there are changes inside the views.
		editor.on( 'beforeaddundo', function( Event ) {
			Event.level.content = resetViews( Event.level.content );
		} );

		// Make sure views are copied as their text.
		editor.on( 'drop objectselected', function( Event ) {
			if ( isView( Event.targetClone ) ) {
				Event.targetClone = editor.getDoc().createTextNode(
					window.decodeURIComponent( editor.dom.getAttrib( Event.targetClone, 'data-wpview-text' ) )
				);
			}
		} );

		// Clean up URLs for easier processing.
		editor.on( 'pastepreprocess', function( Event ) {
			var content = Event.content;

			if ( content ) {
				content = tinymce.trim( content.replace( /<[^>]+>/g, '' ) );

				if ( /^https?:\/\/\S+$/i.test( content ) ) {
					Event.content = content;
				}
			}
		} );

		// Show the view type in the element path.
		editor.on( 'resolvename', function( Event ) {
			if ( isView( Event.target ) ) {
				Event.name = editor.dom.getAttrib( Event.target, 'data-wpview-type' ) || 'object';
			}
		} );

		// See `media` plugin.
		editor.on( 'click keyup', function() {
			var node = editor.selection.getNode();

			if ( isView( node ) ) {
				if ( editor.dom.getAttrib( node, 'data-mce-selected' ) ) {
					node.setAttribute( 'data-mce-selected', '2' );
				}
			}
		} );

		editor.addButton( 'wp_view_edit', {
			tooltip: 'Edit|button', // '|button' is not displayed, only used for context
			icon: 'dashicon dashicons-edit',
			onclick: function() {
				var node = editor.selection.getNode();

				if ( isView( node ) ) {
					wp.mce.views.edit( editor, node );
				}
			}
		} );

		editor.addButton( 'wp_view_remove', {
			tooltip: 'Remove',
			icon: 'dashicon dashicons-no',
			onclick: function() {
				editor.fire( 'cut' );
			}
		} );

		editor.once( 'preinit', function() {
			var toolbar;

			if ( editor.wp && editor.wp._createToolbar ) {
				toolbar = editor.wp._createToolbar( [
					'wp_view_edit',
					'wp_view_remove'
				] );

				editor.on( 'wptoolbar', function( Event ) {
					if ( ! Event.collapsed && isView( Event.element ) ) {
						Event.toolbar = toolbar;
					}
				} );
			}
		} );

		editor.wp = editor.wp || {};
		editor.wp.getView = noop;
		editor.wp.setViewCursor = noop;

		return {
			getView: noop
		};
	} );
} )( window.tinymce, window.wp );
