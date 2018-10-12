<?php
include "conn.php";
include "inc/chromePhp.php";

if (!empty($_POST['data_date'])) {
    switch ($_POST['data_type']) {
        case 'FL':
            $q = "SELECT * FROM perolehan WHERE tipe_produk = 'fl' AND week = '{$_POST['data_week']}'";
            break;
        case 'CL':
            $q = "SELECT * FROM perolehan WHERE tipe_produk = 'cl' AND week = '{$_POST['data_week']}'";
            break;
        case 'AS':
            $q = "SELECT * FROM perolehan WHERE tipe_produk = 'as' AND week = '{$_POST['data_week']}'";
            break;
        case 'TS':
            $q = "SELECT * FROM perolehan WHERE tipe_produk = 'ts' AND week = '{$_POST['data_week']}'";
            break;
        case 'PN':
            $q = "SELECT * FROM perolehan WHERE tipe_produk = 'pn' AND week = '{$_POST['data_week']}'";
            break;
        case 'RC':
            $q = "SELECT * FROM perolehan WHERE tipe_produk = 'rc' AND week = '{$_POST['data_week']}'";
            break;
        default:
            $q = "SELECT * FROM perolehan WHERE tipe_produk = 'vn' AND week = '{$_POST['data_week']}'";
            break;
    }

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
