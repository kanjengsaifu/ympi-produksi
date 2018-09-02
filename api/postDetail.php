<?php
include "conn.php";
if (!empty($_POST['id'])) {
    switch ($_POST['data_type']) {
        case 'FL':
            $q = "SELECT fl_plus, fl_minus, persentase_fl FROM perolehan WHERE id = {$_POST['id']}";
            break;
        case 'CL':
            $q = "SELECT cl_plus, cl_minus, persentase_cl  FROM perolehan WHERE id = {$_POST['id']}";
            break;
        case 'AS':
            $q = "SELECT as_plus, as_minus, persentase_as  FROM perolehan WHERE id = {$_POST['id']}";
            break;
        case 'TS':
            $q = "SELECT ts_plus, ts_minus, persentase_ts  FROM perolehan WHERE id = {$_POST['id']}";
            break;
        case 'PN':
            $q = "SELECT pn_plus, pn_minus, persentase_pn  FROM perolehan WHERE id = {$_POST['id']}";
            break;
        case 'RC':
            $q = "SELECT rc_plus, rc_minus, persentase_rc  FROM perolehan WHERE id = {$_POST['id']}";
            break;
        default:
            $q = "SELECT vn_plus, vn_minus, persentase_vn  FROM perolehan WHERE id = {$_POST['id']}";
            break;
    }

    $query = $db->query($q);

    if ($query->num_rows > 0) {
        $res = $query->fetch_assoc();
        $data['status'] = 'ok';
        $data['result'] = $res;
    } else {
        $data['status'] = 'err';
        $data['result'] = '';
    }

    //returns data as JSON format
    echo json_encode($data);
}
