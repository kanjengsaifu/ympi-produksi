<?php
include "conn.php";
if (!empty($_POST['id'])) {
    switch ($_POST['data_type']) {
        case 'FL':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'fl'";
            break;
        case 'CL':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'cl'";
            break;
        case 'AS':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'as'";
            break;
        case 'TS':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'ts'";
            break;
        case 'PN':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'pn'";
            break;
        case 'RC':
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'rc'";
            break;
        default:
            $q = "SELECT * FROM kesesuaian_item WHERE produk = 'vn'";
            break;
    }

    $query = $db->query($q);

    if ($query->num_rows > 0) {
        $res = $query->fetch_assoc();
        $data['status'] = 'ok';
        $data['result'] = $res;
    } else {
        $data['status'] = 'err';
        $data['result'] = 'Couldn\'t find data';
    }

    //returns data as JSON format
    echo json_encode($data);
}
