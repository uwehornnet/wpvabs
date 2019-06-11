<?php

include_once realpath(dirname(__FILE__)).'/../config.php';
include_once realpath(dirname(__FILE__)).'/../version.php';

$allowed = [
	'version',
	'update',
	'get_referrer_id',
	'get_client_data',
	'get_client_interest',
	'get_single_course',
	'get_all_courses',
	'get_courses',
	'get_all_course_groups',
	'get_courses_of_group',
	'get_trainings',
	'create_new_contact',
	'create_new_lead',
	'get_course_details',
	'add_sales_order',
	'add_sales_line',
	'assign_course_to_training'
];

if(!isset($_GET['method'])) {

	echo 'Upps, method not allowed ... ';
	return;
}

if(!in_array($_GET['method'], $allowed)){
	echo 'Upps, method ' . $_GET['method'] . ' not allowed ... ';
	return;
}

$_POST = json_decode(file_get_contents('php://input'), true);

define('TOKEN', $config['api_token']);
define('CLIENT_ID', $config['client_id']);
define('URL', $config['url']);
define('REFERRER', $config['referrer']);
define('VERSION', json_encode($info));

call_user_func($_GET['method']);

function version() {
	echo VERSION;
	return;
}

function update() {

	$base = 'https://github.com/uwehornnet/wpvabs/archive/';
	$version = $_POST['version'];
	$extension = '.zip';

	$url = $base . $version . $extension;

	$path = realpath(dirname(__FILE__)).'/../';
	$destination_path = $path . $version . $extension;
	file_put_contents($destination_path, file_get_contents($url));

	$folder = $path . $version;
	$zip = new ZipArchive();
	if($zip->open($destination_path)){
		$zip->extractTo($folder);
		$zip->close();
	}

	$files = [
		'/vabs-api-form.php',
		'/ajax/ajax_handler.php',
		'/assets/js/vabs_admin.js',
		'/assets/js/vabs_form.js',
		'/assets/css/vabs_admin.css',
		'/assets/css/vabs_form.css',
		'/version.php'
	];

	$version_root_path = $folder . '/wpvabs-' . $version;
	foreach($files as $file) {
		$content = file_get_contents($version_root_path . $file);
		file_put_contents(realpath(dirname(__FILE__)).'/../' . $file, $content);
	}

	unlink($destination_path);
	rrmdir($folder);

	echo  json_encode(['status' => 'you are running the vabs plugin on version' . $version]);
	return;
}

function rrmdir($dir) {
	if (is_dir($dir)) {
		$objects = scandir($dir);
		foreach ($objects as $object) {
			if ($object != "." && $object != "..") {
				if (filetype($dir."/".$object) == "dir")
					rrmdir($dir."/".$object);
				else unlink   ($dir."/".$object);
			}
		}
		reset($objects);
		rmdir($dir);
	}
}

function get_referrer_id()
{
	if(!isset($_POST['apiToken']) || !isset($_POST['url'])){
		$_POST = json_decode(file_get_contents('php://input'), true);
	}

	$token = TOKEN != '' ? 'Token: ' . TOKEN : 'Token: ' . $_POST['apiToken'];
	$url = URL != '' ? URL : $_POST['url'];

	$requestUrl = '/V2/account/referrer/';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);

	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;

	}
}

function get_client_data()
{
	if(!isset($_POST['apiToken']) || !isset($_POST['url'])){
		$_POST = json_decode(file_get_contents('php://input'), true);
	}

	$token = TOKEN != '' ? 'Token: ' . TOKEN : 'Token: ' . $_POST['apiToken'];
	$url = $_POST['url'] ? $_POST['url'] : URL;


	$requestUrl = '/V2/account/data/';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);

	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;

	}
}

function get_client_interest()
{
	$token = 'Token: ' . TOKEN;
	$hashID = 'TargetClientHash: ' . CLIENT_ID;
	$url = URL;

	$requestUrl = '/V2/account/interests/';

	$header = array($token, $hashID);
	$curl = curl_init($url.$requestUrl);

	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;

	}
}

function get_course_details()
{
	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/courses/price/' . $_POST['id'] . '/0/' . $_POST['qty'];
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;

	}
}

function get_courses() {

	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/courses/' . $_POST['ids'];
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;

	}

}

function get_single_course()
{

	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/courses/' . $_POST['id'];
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;

	}
}

function get_all_courses()
{
	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/courses/';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;

	}
}

function get_courses_of_group() {
	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/courses/0/' . $_POST['id'];
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;

	}
}

function get_all_course_groups()
{
	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/courses/groups/';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;
	}
}

function get_trainings() {

	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/trainings/find/' . $_POST['from'] . '/' . $_POST['to'] . '/' . $_POST['id'];
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;
	}
}

function create_new_contact()
{

	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/contact/';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
	
	//As this is a POST Request we need to set the data and method
	$data = array	(
		'target_client_hash' =>  CLIENT_ID,
		'firstname' => $_POST['firstname'],
		'lastname' => $_POST['lastname'],
		'email' => $_POST['email'],
		'mobile' => $_POST['mobile'],
		'street' => isset($_POST['street']) ? $_POST['street'] : null,
		'number' => isset($_POST['number']) ? $_POST['number'] : null,
		'zip_code' => isset($_POST['zip_code']) ? $_POST['zip_code'] : null,
		'city' => isset($_POST['city']) ? $_POST['city'] : null,
		'dateFrom' => isset($_POST['anreise']) ? $_POST['anreise'] : null,
		'dateTo' => isset($_POST['abreise']) ? $_POST['abreise'] : null,
		'send_email_request' => 'yes',
		'create_lead' => isset($_POST['lead']) ? true : false,
		'shorttext' => isset($_POST['shorttext']) ? $_POST['shorttext'] : null,
		'longtext' => isset($_POST['note']) ? $_POST['note'] : null,
		'referrer_id' => REFERRER
	);

	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;
	}

}

function create_new_lead()
{
	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/lead/';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
//As this is a POST Request we need to set the data and method
	$data = array	(
			'target_client_hash' => CLIENT_ID,
			'contact_id' => $_POST['contact_id'],
			'shorttext' => $_POST['shorttext'],
			'longtext' => $_POST['longtext'],
			'referrer' => REFERRER
	);
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;
	}
}

function add_sales_order()
{
	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/sales/order/';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);

	curl_setopt($curl, CURLOPT_POST, true);
	$data = array	(
			'target_client_hash' => CLIENT_ID,
			'sellto_contact_id' => $_POST['contact_id'],
			'comment' => $_POST['shorttext']
	);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;
	}
}

function add_sales_line()
{
	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/sales/line/';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
//As this is a POST Request we need to set the data and method
	curl_setopt($curl, CURLOPT_POST, true);
	$data = array	(
			'target_client_hash' => CLIENT_ID,
			'sales_header_id' => $_POST['sales_header_id'],
			'line_number' => isset($_POST['line_number']) ? $_POST['line_number'] : null,
			'object_id' => $_POST['object_id'],
			'object_code' => 3,
			'quantity' => 1,
			'quantity_to_book' => $_POST['quantity'],
			'date_from' => $_POST['date_from'],
			'date_to' => $_POST['date_to'],
			'ship_to_contact' => isset($_POST['ship_to_contact_id']) ? $_POST['ship_to_contact_id'] : null
	);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;
	}
}

function assign_course_to_training() {
	$token = 'Token: ' . TOKEN;

	$url = URL;
	$requestUrl = '/V2/trainings/assignCourseBooking';
	$header = array($token);
	$curl = curl_init($url.$requestUrl);
//As this is a POST Request we need to set the data and method
	curl_setopt($curl, CURLOPT_POST, true);
	$data = array	(
			'course_booking_id' => $_POST['course_booking_id'],
			'training_id' => $_POST['training_id']
	);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;
	}
}