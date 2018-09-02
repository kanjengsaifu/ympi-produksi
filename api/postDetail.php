<?php
include "conn.php";
include 'inc/ChromePhp.php';

if (!empty($_POST['data_date'])) {
    switch ($_POST['data_type']) {
        case 'FL':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'fl' AND tanggal = '{$_POST['data_date']}'";
            break;
        case 'CL':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'cl' AND tanggal = '{$_POST['data_date']}'";
            break;
        case 'AS':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'as' AND tanggal = '{$_POST['data_date']}'";
            break;
        case 'TS':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'ts' AND tanggal = '{$_POST['data_date']}'";
            break;
        case 'PN':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'pn' AND tanggal = '{$_POST['data_date']}'";
            break;
        case 'RC':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'rc' AND tanggal = '{$_POST['data_date']}'";
            break;
        default:
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'vn' AND tanggal = '{$_POST['data_date']}'";
            break;
    }

    // ChromePhp::log($q);

    $query = $db->query($q);
    $rows = array();

    if ($query->num_rows > 0) {
        while ($r = mysqli_fetch_assoc($query)) {
            $rows[] = $r;
        }

        $data['status'] = 'ok';
        $data['result'] = $rows;
        $data['tanggal'] = $_POST['data_date'];
    } else {
        $data['status'] = 'err';
        $data['result'] = 'Data is empty!';
    }

    //returns data as JSON format
    echo json_encode($data);
}
