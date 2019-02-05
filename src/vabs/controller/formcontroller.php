<?php

$route = $_SERVER['HTTP_REFERER'];

$data = array(
		'api_token' => $_POST['api_token'] ? $_POST['api_token'] : null,
		'client_id' => $_POST['client_id'] ? $_POST['client_id'] : null,
		'url' => $_POST['url'] ? $_POST['url'] : null,
		'referrer' => $_POST['referrer_id'] ? $_POST['referrer_id'] : null,
		'dsgvo' => $_POST['dsgvo'] ? $_POST['dsgvo'] : null,
		'agb' => $_POST['agb'] ? $_POST['agb'] : null
);


$file = realpath(dirname(__FILE__)) . '/../../../config.php';

file_put_contents($file, '<?php $config = ' . var_export($data, true) . ';');

header("Location:" . $route, true, 302);

