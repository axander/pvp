<?php


      $product_id = $_POST['id']; //This is product ID
      $quantity =  $_POST['$quantity']; //This is User custom value sent via AJAX

    add_action('wp_ajax_woocommerce_ajax_add_to_cart', 'woocommerce_ajax_add_to_cart');
    add_action('wp_ajax_nopriv_woocommerce_ajax_add_to_cart', 'woocommerce_ajax_add_to_cart');
    function woocommerce_ajax_add_to_cart() {
	        echo "hola mundo";
    }

?>