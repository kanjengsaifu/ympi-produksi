<?php
include "conn.php";
include "inc/chromePhp.php";

if (!empty($_POST['data_type'])) {
    $dt = $_POST['data_type'];
    $rows = array();

    if ($dt == "FL" || $dt == "CL" || $dt == "AS" || $dt == "TS") {
        $query_string = "SELECT * FROM shipment_2 WHERE week = {$_POST['data_week']} AND (tipe_produk = 'fl' OR tipe_produk = 'cl' OR tipe_produk = 'as' OR tipe_produk = 'ts')";
        $query = $db->query($query_string);
        // $query_string_2 = "SELECT MAX(updated_at) AS updated_at WHERE week = {$_POST['data_week']} AND (tipe_produk = 'fl' OR tipe_produk = 'cl' OR tipe_produk = 'as' OR tipe_produk = 'ts')";
        // $query_2 = $db->query($query_string_2);
    } else {
        $query_string = "SELECT * FROM shipment_2 WHERE week = {$_POST['data_week']} AND (tipe_produk = 'pn' OR tipe_produk = 'rc' OR tipe_produk = 'vn')";
        $query = $db->query($query_string);
        //  $query_string_2 = "SELECT MAX(updated_at) AS updated_at WHERE week = {$_POST['data_week']} AND (tipe_produk = 'pn' OR tipe_produk = 'rc' OR tipe_produk = 'vn')";
        // $query_2 = $db->query($query_string_2);
    }

    // ChromePhp::log($query);

    if ($query->num_rows > 0) {
        while ($r = mysqli_fetch_assoc($query)) {
            $rows[] = $r;
        }
        
        $data['status'] = 'ok';
        $data['result'] = $rows;
        // $data['updated_at'] = $query_2['updated_at'];
        // $data['result'][0]['data_type'] = $_POST['data_type'];
    } else {
        $data['status'] = 'err';
        $data['result'] = '';
    }

    echo json_encode($data);
}
