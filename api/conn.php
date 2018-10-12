<?php
//database details
$dbHost = 'localhost';
$dbUsername = 'ympi';
$dbPassword = 'Hello123#';
$dbName = 'ympi-produksi';

//create connection and select DB
$db = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);
if ($db->connect_error) {
    die("Unable to connect database: " . $db->connect_error);
}
