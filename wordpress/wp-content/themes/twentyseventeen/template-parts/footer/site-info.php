<?php
/**
 * Displays footer site info
 *
 * @package WordPress
 * @subpackage Twenty_SEventeen
 * @since 1.0
 * @version 1.0
 */

?>
<div class="site-info">
	<?php
	if ( function_exists( 'the_privacy_policy_link' ) ) {
		the_privacy_policy_link( '', '<span role="separator" aria-hidden="true"></span>' );
	}
	?>
	<a href="<?php echo esc_url( __( 'https://wordpress.org/', 'twentysEventeen' ) ); ?>" class="imprint">
		<?php printf( __( 'Proudly powered by %s', 'twentysEventeen' ), 'WordPress' ); ?>
	</a>
</div><!-- .site-info -->
