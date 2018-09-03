<?php
include "conn.php";

if (!empty($_POST['id'])) {
    $query = $db->query("SELECT * FROM perolehan WHERE id = {$_POST['id']}");

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
