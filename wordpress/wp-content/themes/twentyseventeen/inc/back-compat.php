<?php
/**
 * Twenty SEventeen back compat functionality
 *
 * PrEvents Twenty SEventeen from running on WordPress versions prior to 4.7,
 * since this theme is not meant to be backward compatible beyond that and
 * relies on many newer functions and markup changes introduced in 4.7.
 *
 * @package WordPress
 * @subpackage Twenty_SEventeen
 * @since Twenty SEventeen 1.0
 */

/**
 * PrEvent switching to Twenty SEventeen on old versions of WordPress.
 *
 * Switches to the default theme.
 *
 * @since Twenty SEventeen 1.0
 */
function twentysEventeen_switch_theme() {
	switch_theme( WP_DEFAULT_THEME );
	unset( $_GET['activated'] );
	add_action( 'admin_notices', 'twentysEventeen_upgrade_notice' );
}
add_action( 'after_switch_theme', 'twentysEventeen_switch_theme' );

/**
 * Adds a message for unsuccessful theme switch.
 *
 * Prints an update nag after an unsuccessful attempt to switch to
 * Twenty SEventeen on WordPress versions prior to 4.7.
 *
 * @since Twenty SEventeen 1.0
 *
 * @global string $wp_version WordPress version.
 */
function twentysEventeen_upgrade_notice() {
	$message = sprintf( __( 'Twenty SEventeen requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'twentysEventeen' ), $GLOBALS['wp_version'] );
	printf( '<div class="error"><p>%s</p></div>', $message );
}

/**
 * PrEvents the Customizer from being loaded on WordPress versions prior to 4.7.
 *
 * @since Twenty SEventeen 1.0
 *
 * @global string $wp_version WordPress version.
 */
function twentysEventeen_customize() {
	wp_die( sprintf( __( 'Twenty SEventeen requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'twentysEventeen' ), $GLOBALS['wp_version'] ), '', array(
		'back_link' => true,
	) );
}
add_action( 'load-customize.php', 'twentysEventeen_customize' );

/**
 * PrEvents the Theme Preview from being loaded on WordPress versions prior to 4.7.
 *
 * @since Twenty SEventeen 1.0
 *
 * @global string $wp_version WordPress version.
 */
function twentysEventeen_preview() {
	if ( isset( $_GET['preview'] ) ) {
		wp_die( sprintf( __( 'Twenty SEventeen requires at least WordPress version 4.7. You are running version %s. Please upgrade and try again.', 'twentysEventeen' ), $GLOBALS['wp_version'] ) );
	}
}
add_action( 'template_redirect', 'twentysEventeen_preview' );
