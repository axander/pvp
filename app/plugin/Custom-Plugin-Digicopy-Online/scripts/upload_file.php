<? 

$file = file_get_contents( 'test.jpg' );
$url = 'http://example.com/wp-json/wp/v2/media/';
$ch = curl_init();
$username = 'Alex';
$password = 'Digicopy14412!';

curl_setopt( $ch, CURLOPT_URL, $url );
curl_setopt( $ch, CURLOPT_POST, 1 );
curl_setopt( $ch, CURLOPT_POSTFIELDS, $file );
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt( $ch, CURLOPT_HTTPHEADER, [
    'Content-Disposition: form-data; filename="example.jpg"',
    'Authorization: Basic ' . base64_encode( $username . ':' . $password ),
] );
$result = curl_exec( $ch );
curl_close( $ch );
print_r( json_decode( $result ) );

?>