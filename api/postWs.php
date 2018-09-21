<?php
include "conn.php";
include "inc/chromePhp.php";

if (!empty($_POST['data_type'])) {
    $dt = $_POST['data_type'];
    $rows = array();

    if ($dt == "FL" || $dt == "CL" || $dt == "AS" || $dt == "TS") {
        $query_string = "SELECT * FROM shipment WHERE week = {$_POST['data_week']} AND tanggal = '{$_POST['data_date']}' AND (produk = 'fl' OR produk = 'cl' OR produk = 'as' OR produk = 'ts')";
        $query = $db->query($query_string);
    } else {
        $query_string = "SELECT * FROM shipment WHERE week = {$_POST['data_week']}  AND tanggal = {$_POST['data_date']} AND (produk = 'pn' OR produk = 'rc' OR produk = 'vn')";
        $query = $db->query($query_string);
    }

    // ChromePhp::log($query);

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
