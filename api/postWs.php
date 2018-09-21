<?php
include "conn.php";
include "inc/chromePhp.php";

if (!empty($_POST['data_type'])) {
    $dt = $_POST['data_type'];
    $rows = array();

    // ChromePhp::log($_POST['data_type']);

    if ($dt == "FL" || $dt == "CL" || $dt == "AS" || $dt == "TS") {
        $query = $db->query("SELECT * FROM shipment WHERE week = {$_POST['data_week']} AND (produk = 'fl' OR produk = 'cl' OR produk = 'as' OR produk = 'ts')");
    } else {
        $query = $db->query("SELECT * FROM shipment WHERE week = {$_POST['data_week']} AND (produk = 'pn' OR produk = 'rc' OR produk = 'vn')");
    }

    if ($query->num_rows > 0) {
        while ($r = mysqli_fetch_assoc($query)) {
            $rows[] = $r;
        }

        $data['status'] = 'ok';
        $data['result'] = $rows;
        $data['result'][0]['data_type'] = $_POST['data_type'];
    } else {
        $data['status'] = 'err';
        $data['result'] = '';
    }

    echo json_encode($data);
}
