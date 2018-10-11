<?php
//database details
$dbHost = 'localhost';
$dbUsername = 'root';
$dbPassword = '';
$dbName = 'ympi-produksi-shipment2';

//create connection and select DB
$db = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);
if ($db->connect_error) {
    die("Unable to connect database: " . $db->connect_error);
}
