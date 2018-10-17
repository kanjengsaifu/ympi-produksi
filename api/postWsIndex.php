<?php
include "conn.php";
include "inc/chromePhp.php";

if (!empty($_POST['data_type'])) {
    $dt = $_POST['data_type'];
    $rows = array();

    // if ($dt == "FL" || $dt == "CL" || $dt == "AS" || $dt == "TS") {
    //     $query_string = "SELECT * FROM shipment_2 WHERE week = '{$_POST['data_week']}' AND (tipe_produk = 'fl' OR tipe_produk = 'cl' OR tipe_produk = 'as' OR tipe_produk = 'ts')";
    //     $query = $db->query($query_string);
    // } else {
    //     $query_string = "SELECT * FROM shipment_2 WHERE week = '{$_POST['data_week']}' AND (tipe_produk = 'pn' OR tipe_produk = 'rc' OR tipe_produk = 'vn')";
    //     $query = $db->query($query_string);
    // }

    //NEW
    if ($dt == "FL" || $dt == "CL" || $dt == "AS" || $dt == "TS") {
        $query_string = "SELECT * FROM shipment_2 WHERE week = '{$_POST['data_week']}' AND (tipe_produk = 'fl' OR tipe_produk = 'cl' OR tipe_produk = 'as' OR tipe_produk = 'ts' OR tipe_produk = 'pn' OR tipe_produk = 'rc' OR tipe_produk = 'vn')"; }
        $query = $db->query($query_string);
    

    // ChromePhp::log($query_string);

    if ($query->num_rows > 0) {
        while ($r = mysqli_fetch_assoc($query)) {
            $rows[] = $r;
        }
        
        $data['status'] = 'ok';
        $data['result'] = $rows;
    } else {
        $data['status'] = 'err';
        $data['result'] = '';
    }

    echo json_encode($data);
}
