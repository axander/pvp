<?php
    /*$order = wc_create_order();*/
    /*add_action( 'template_redirect', 'misha_add_to_cart_on_custom_page_and_redirect');
    function misha_add_to_cart_on_custom_page_and_redirect(){
        //if( is_page( 'my-page' ) ) { // you can also pass a page ID instead of a slug
            
            WC()->cart->add_to_cart( 12012 ); // add to cart product with ID 72
            wp_safe_redirect( wc_get_checkout_url() );
            exit();
            
        //}
    }*/

        $token=Get_Token();
        echo $token;
        function Get_Token()
        {
        //Do some stuff
        return 'abcdefg';
        }

?>