<?php
/*
Plugin Name: Custom Plugin Digicopy Online
Plugin URI: https://www.digicopy.com.es
Description: Gestión de pedidos de impresión de documentos .pdf
Version: 1.0.0.
Author: Raana Heyrati - Alejandro M. Romero
Author URI:
License:
License URI:
Text Domain: wpplugin-digicopy
Domain path: /Custom-Plugin-Digicopy-Online/
*/

//settings
/*---------------------------------------------------------------------*/
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'SETTINGS_PAGE_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-settings-page-activator.php
 */
function activate_settings_page() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-settings-page-activator.php';
	Settings_Page_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-settings-page-deactivator.php
 */
function deactivate_settings_page() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-settings-page-deactivator.php';
	Settings_Page_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_settings_page' );
register_deactivation_hook( __FILE__, 'deactivate_settings_page' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-settings-page.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_settings_page() {

	$plugin = new Settings_Page();
	$plugin->run();

}
run_settings_page();
/*-----------------------------------------------------------------------*/
//settings

//app
/*---------------------------------------------------------------------*/
/*add_action('wp_head', 'set_root_folder');
function set_root_folder() {
   
}*/

require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
//include( plugin_dir_path( __FILE__ ) . 'scripts');

function load_ng_scripts() {


    $args = array (
        'type'      => 'input',
        'subtype'   => 'text',
        'id'    => 'settings_CPDO_setting',
        'name'      => 'settings_CPDO_setting',
        'required' => 'true',
        'get_options_list' => '',
        'value_type'=>'normal',
        'wp_data' => 'option'
    );
    $wp_data_value =  get_option($args['name']);
    $value = ($args['value_type'] == 'serialized') ? serialize($wp_data_value) : $wp_data_value;
    //$wp_data_value = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);
    //return  $arr ;


    ?>
    <script type="text/javascript">
        localStorage.setItem('root', '<?php echo get_site_url(); ?>');
    </script> 
    <script id="securityScript" type="text/javascript">
        localStorage.setItem('token', '<?php echo json_decode($value)->{'token'}; ?>');
    </script> 
<?php
    wp_enqueue_style( 'ng_styles', plugin_dir_url( __FILE__ ) . 'app/styles.f2629b9d0c71f5fb.css' );
    wp_register_script( 'ng_main', plugin_dir_url( __FILE__ ) . 'app/main.24ab09bfc439f2fd.js', true );
    wp_register_script( 'ng_polyfills', plugin_dir_url( __FILE__ ) . 'app/polyfills.d0b56639ecd1a0a4.js', true );
    wp_register_script( 'ng_runtime', plugin_dir_url( __FILE__ ) . 'app/runtime.fb228f4f58a4a656.js', true );
}
function my_function_admin_bar(){
    return false;
}
add_filter( 'show_admin_bar' , 'my_function_admin_bar');

add_action( 'wp_enqueue_scripts', 'load_ng_scripts' );

function attach_ng() {
    wp_enqueue_script( 'ng_main' );
    wp_enqueue_script( 'ng_polyfills' );
    wp_enqueue_script( 'ng_runtime' );

    return "<app-root></app-root>";
}

add_shortcode( 'custom_plugin_digicopy_online', 'attach_ng' );

wp_enqueue_style( 'style', plugin_dir_url( __FILE__ ) . 'styles/style.css');

// Add the shortcode [ng_wp] to any page or post.
// The shorcode can be whatever. [ng_wp] is just an example.
class BusinessCustomersPlugin {
    function init(){
        $_apiController = new BusinessCustomersApiController();
        $_apiController->init();
    }
}

$businessCustomers = new BusinessCustomersPlugin();
$businessCustomers->init();
class BusinessCustomersApiController {

    public function __construct() {
        $this->namespace = '/cpdo/v1/';
    }

    public function init() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    public function register_routes() {

        register_rest_route(
            $this->namespace, 
            'config/',
            [
                'methods'  => 'GET',
                'callback' => [ $this, 'get_config' ],
            ]
        );
       
		
        register_rest_route(
            $this->namespace, 
            'upload/',
            [
                'methods'  => 'POST',
                'callback' => [ $this, 'post_upload_pdf' ],
            ]
        );

        register_rest_route(
            $this->namespace, 
            'budget/',
            [
                'methods'  => 'POST',
                'callback' => [ $this, 'post_budget' ],
            ]
        );

        register_rest_route(
            $this->namespace, 
            'budget/',
            [
                'methods'  => 'GET',
                'callback' => [ $this, 'get_budget' ],
            ]
        );
    }

    

    function get_config( WP_REST_Request $req ) {
		$args = array (
							'type'      => 'input',
							'subtype'   => 'text',
							'id'    => 'settings_CPDO_setting',
							'name'      => 'settings_CPDO_setting',
							'required' => 'true',
							'get_options_list' => '',
							'value_type'=>'normal',
							'wp_data' => 'option'
					);
		$wp_data_value =  get_option($args['name']);
		$value = ($args['value_type'] == 'serialized') ? serialize($wp_data_value) : $wp_data_value;
        //$wp_data_value = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);
        //return  $arr ;
        $config =json_decode($value, true);
        unset($config['token']);
        return $config;
    }

    function get_budget( WP_REST_Request $req ) {

        if ( defined( 'WC_ABSPATH' ) ) {
            // WC 3.6+ - Cart and notice functions are not included during a REST request.
            include_once WC_ABSPATH . 'includes/wc-cart-functions.php';
            include_once WC_ABSPATH . 'includes/wc-notice-functions.php';
        }
    
        if ( null === WC()->session ) {
            $session_class = apply_filters( 'woocommerce_session_handler', 'WC_Session_Handler' );
    
            //Prefix session class with global namespace if not already namespaced
            if ( false === strpos( $session_class, '' ) ) {
                $session_class = '' . $session_class;
            }
    
            WC()->session = new $session_class();
            WC()->session->init();
        }
    
        if ( null === WC()->customer ) {
            WC()->customer = new WC_Customer( get_current_user_id(), true );
        }
    
        if ( null === WC()->cart ) {
            WC()->cart = new WC_Cart();
    
            // We need to force a refresh of the cart contents from session here (cart contents are normally refreshed on wp_loaded, which has already happened by this point).
            WC()->cart->get_cart();
        }
    
        $items = [];
    
        $item = ['product_id' => 15887, 'quantity' => 1];
    
    
        array_push($items, $item);
        $test = WC()->cart->add_to_cart( 15887, 1 );
    
        return  $test;
    }
    function post_budget( WP_REST_Request $req ) {
        if ( defined( 'WC_ABSPATH' ) ) {
            // WC 3.6+ - Cart and notice functions are not included during a REST request.
            include_once WC_ABSPATH . 'includes/wc-cart-functions.php';
            include_once WC_ABSPATH . 'includes/wc-notice-functions.php';
        }
    
        if ( null === WC()->session ) {
            $session_class = apply_filters( 'woocommerce_session_handler', 'WC_Session_Handler' );
    
            //Prefix session class with global namespace if not already namespaced
            if ( false === strpos( $session_class, '' ) ) {
                $session_class = '' . $session_class;
            }
    
            WC()->session = new $session_class();
            WC()->session->init();
        }
    
        if ( null === WC()->customer ) {
            WC()->customer = new WC_Customer( get_current_user_id(), true );
        }
    
        if ( null === WC()->cart ) {
            WC()->cart = new WC_Cart();
    
            // We need to force a refresh of the cart contents from session here (cart contents are normally refreshed on wp_loaded, which has already happened by this point).
            WC()->cart->get_cart();
        }
    
       //$posted_data =  isset( $_POST ) ? $_POST : array();//if form data 
        $pedidos = json_decode($req->get_body(), true);
         $data = [];
		 $total = 0;
		//$description =  json_encode($pedidos);
         if(count($pedidos['data']) > 0) {
			
            foreach ($pedidos['data'] as $index => $pedido) {
                /*$description .= '<strong>GRUPO ' . strtoupper ($index).'</strong><br />';
				$description .= '-------------------------------------------Precio:'.$pedido['ammount'].'€<br /><br />';*/
                $total +=$pedido['ammount'];
                /*foreach ($pedido['properties'] as $key => $config) {
                    $description .=  ucfirst($config['title']) . ': <span style="color:#0095ff">' . $config['value'] . '</span><br />';
                }
				$description .= '-------------------------------------------Archivos:<br /><br />';
                foreach ($pedido['files'] as $index => $archivo) {
                    $description .= 'doc'.($index + 1).': <a href="' . $archivo['url'] . '" target="_blank">' . $archivo['name'] . '</a><br />';
                }
                $description .= '<br /><br />';*/
            }

            $description .= $pedidos['description'];
			

        }
			 $data = [
				 'name' => time() . '_'.$pedidos['id'] ,
				 'description' => $description,
				 'regular_price' => $total,
				 'sale_price' => $total,
				 'price' => $total,
				 'catalog_visibility' => 'hidden',
				 'status' => 'publish',
				 'visible' => false,
			 ];
		//create a simple product
		//// that's CRUD object
		$product = new WC_Product_Simple();
		$product->set_name( 'Pedido online - '.$pedidos['id']); // product title
		$product->set_slug( 'pedido-online-'.$pedidos['id'] );
		$product->set_sold_individually(true);
		//$product->set_catalog_visibility(false);
		$product->set_regular_price( $total ); // in current shop currency
		//$product->set_short_description( $description );
        $product->set_short_description( 'impresión de documentos pdf' );
		// you can also add a full product description
		$product->set_description( $description );
		//$product->set_image_id( 90 );
		// let's suppose that our 'Accessories' category has ID = 19 
		//$product->set_category_ids( array( 19 ) );
		// you can also use $product->set_tag_ids() for tags, brands etc
		$id = $product->save();
		
		
		//alta de producto
		/*$request = new WP_REST_Request( 'POST' );
		$request->set_body_params( $data );
		$products_controller = new WC_REST_Products_Controller;
		$response = $products_controller->create_item( $request );*/
		//WC()->cart->add_to_cart( $id, 1 );
		
    }
   
   function post_upload_pdf( WP_REST_Request $req ) {
//    $body = $req->get_body_params();
//  return ['req' => $body];
    $usingUploader = 3;
    $fileErrors = array(
        0 => "There is no error, the file uploaded with success",
        1 => "The uploaded file exceeds the upload_max_files in server settings",
        2 => "The uploaded file exceeds the MAX_FILE_SIZE from html form",
        3 => "The uploaded file uploaded only partially",
        4 => "No file was uploaded",
        6 => "Missing a temporary folder",
        7 => "Failed to write file to disk",
        8 => "A PHP extension stoped file to upload" );
    $posted_data =  isset( $_POST ) ? $_POST : array();
    $file_data = isset( $_FILES ) ? $_FILES : array();
    $data = array_merge( $posted_data, $file_data );
    $response = array();
    if( $usingUploader == 1 ) {
        $uploaded_file = wp_handle_upload( $data['digicopy_file_upload'], array( 'test_form' => false ) );
        if( $uploaded_file && ! isset( $uploaded_file['error'] ) ) {
            $response['response'] = "SUCCESS";
            $response['filename'] = basename( $uploaded_file['url'] );
            $response['url'] = $uploaded_file['url'];
            $response['type'] = $uploaded_file['type'];
        } else {
            $response['response'] = "ERROR";
            $response['error'] = $uploaded_file['error'];
        }
    } elseif ( $usingUploader == 2) {
        $attachment_id = media_handle_upload( 'digicopy_file_upload', 0 );

        if ( is_wp_error( $attachment_id ) ) {
            $response['response'] = "ERROR";
            $response['error'] = $fileErrors[ $data['digicopy_file_upload']['error'] ];
        } else {
            $fullsize_path = get_attached_file( $attachment_id );
            $pathinfo = pathinfo( $fullsize_path );
            $url = wp_get_attachment_url( $attachment_id );
            $response['response'] = "SUCCESS";
            $response['filename'] = $pathinfo['filename'];
            $response['url'] = $url;
            $type = $pathinfo['extension'];
            if( $type == "jpeg"
                || $type == "jpg"
                || $type == "png"
                || $type == "gif" ) {
                $type = "image/" . $type;
            }
            $response['type'] = $type;
        }
    } else {
        $upload_dir = wp_upload_dir();
        $upload_path = $upload_dir["basedir"] . "/uploaded_repo/";
        $upload_url = $upload_dir["baseurl"] . "/uploaded_repo/";
        if (!file_exists($upload_path)) {
            mkdir($upload_path);
        }
        $countfiles = count($data["digicopy_file_upload"]["name"])-1;
        for ($i = $countfiles; $i >= 0; $i--) {
            $fileName = $data["digicopy_file_upload"]["name"][$i];
            $fileNameChanged = time() . '_' . $i . '_' . str_replace(" ", "_",
                    strtolower($fileName));
            $temp_name = $data["digicopy_file_upload"]["tmp_name"][$i];
            $file_size = $data["digicopy_file_upload"]["size"][$i];
            $fileError = $data["digicopy_file_upload"]["error"][$i];
            $mb = 30 * 1024 * 1024;
            $targetPath = $upload_path;
            $responseTemp = [];//file response
            $responseTemp["filename"] = $fileName;
            $responseTemp["file_size"] = $file_size;
            if ($fileError > 0) {
                $responseTemp["response"] = "ERROR";
                $responseTemp["error"] = $fileErrors[$fileError];
            } else {
                if (file_exists($targetPath . "/" . $fileNameChanged)) {

                    $responseTemp["response"] = "ERROR";
                    $responseTemp["error"] = "File already exists.";
                } else {
                    if ($file_size <= $mb) {
                        if (move_uploaded_file($temp_name,
                            $targetPath . "/" . $fileNameChanged)) {
                            $responseTemp["response"] = "SUCCESS";
                            $responseTemp["url"] = $upload_url . "/" . $fileNameChanged;
                            $responseTemp["file"] = $fileNameChanged;
                            $file = pathinfo($targetPath . "/" . $fileNameChanged);

                            if ($file && isset($file["extension"])) {
                                $type = $file["extension"];
                                if ($type == "pdf") {
                                    $type = "application/" . $type;
                                }
                                $responseTemp["type"] = $type;
//                            $response["pages"] = $file['dirname'].'/'.$file['basename'];
                                //contamos las páginas
                                $f = $file['dirname'] . '/' . $file['basename'];
                                $stream = fopen($f, "r");
                                $content = fread($stream, filesize($f));

                                if (!$stream || !$content) {
                                    $responseTemp["pages"] = 0;
                                }

                                $count = 0;
                                // Regular Expressions found by Googling (all linked to SO answers):
                                $regex = "/\/Count\s+(\d+)/";
                                $regex2 = "/\/Page\W*(\d+)/";
                                $regex3 = "/\/N\s+(\d+)/";

                                if (preg_match_all($regex, $content,
                                    $matches)) {
                                    $countArray = max($matches);
                                    $temp = $countArray[count($countArray)-1];
                                    $count = [];
                                    $count[0] = $temp;
                                }

                                if ($count == 0 && preg_match_all($regex2,
                                        $content,
                                        $matches)) {
                                    $count = max($matches);
                                }

                                if ($count == 0 && preg_match_all($regex3,
                                        $content,
                                        $matches)) {
                                    $count = max($matches);
                                }

                                $responseTemp["pages"] = (int)max($count);
                            }

                        } else {
                            $responseTemp["response"] = "ERROR";
                            $responseTemp["error"] = "Upload Failed.";
                        }

                    } else {
                        $responseTemp["response"] = "ERROR";
                        $responseTemp["error"] = "File is too large. Max file size is 30 MB.";
                    }
                }
            }
            //asignar al array de response
            $response[] = $responseTemp;
        }
    }
    return json_encode( $response );
}
}

/*---------------------------------------------------------------------*/
//app

?>
