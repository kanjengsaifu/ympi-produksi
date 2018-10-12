// Function for number formatting

var numberWithCommas = function(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}

// Function for rendering main chart
var renderMainChart = function(data) {
    // hide buttons
    $('#btn-close, #btn-ws').addClass('d-none');
    $('#open-ws-1, #open-ws-2').removeClass('d-none');

    // Un-hide chart #2 container & reset Tabs
    $('#chart-2').removeClass('d-none');

    // Get date
    var date = $('#hidden-date').val();

    // Chart #1
    $('#chart-container-1').insertFusionCharts({
        // type: 'mscolumn2d',
        type: 'scrollstackedcolumn2d',
        renderAt: "chart-container",
        width: 1120,
        height: 380,
        dataFormat: 'json',
        dataSource: {
            "chart": {
                renderAt: 'chart-container',
                // "caption": "Actual Production 生産実績",
                // "captionFontSize": "30",
                // "CaptionFontBold": "1",
                // "CaptionFontColor": "000000",
                "subCaption": moment(date).format('D MMMM YYYY'),
                "subcaptionFontSize": "15",
                "subCaptionFontColor": "008000",
                "subCaptionFontBold": "1",
                "baseFont": "Arial Black",
                "baseFontColor": "000000",
                "baseFontSize": "20", // ini untuk mengatur size font axis Y                
                // "numvisibleplot": "7",
                //"labelDisplay": "",
                //"yAxisName": "Pencapaian 達成",
                //"xAxisName": "Produk",
                "xAxisFontSize": "40",
                //"outCnvBaseFont": "50",
                "theme": "fusion",
                "stack100percent": "1",
                "decimals": "0",
                "plotSpacePercent": "30",
                "plotFillAlpha": "30",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "showValues": "1",
                "valueFontSize": "30",
                "valueFont": "Arial Black",
                "valueFontColor": "0000FF",
                "valueFontBold": "1",
                "bgColor": "E0FFFF",
                "bgAlpha": "50",
                "numberSuffix": "%",
                // "numberPrefix": "%",
                //"showPercentInTooltip": "0",
                "showValues": "1",
                "showPercentValues": "1",
                "id": 'main-chart'
            },
            "categories": [{
                "category": data.categories
            }],
            "dataset": [{
                    "seriesname": "Actual",
                    "color": "008000",
                    "data": data.actual
                },
                {
                    "seriesname": "Plan",
                    "color": "FF0000",
                    "data": data.plan
                }
            ]
        },
        "events": {
            "dataPlotClick": function(eventObj, dataObj) {
                var tipe_produk = dataObj.categoryLabel;
                var finalData = {}
                $.ajax({
                    type: 'POST',
                    url: 'api/postData.php',
                    dataType: "json",
                    data: {
                        tanggal: $('#hidden-date').val(),
                        tipe_produk: tipe_produk
                    },
                    success: function(res) {
                        $('#modal-title').html('Kesesuaian Per Item 部品ごとの適合性: ' + dataObj.categoryLabel);
                        $("#table-tgl").html(moment($('#hidden-date').val()).format('DD MMMM YYYY'));

                        // clear the table
                        $("#table-data").html('');

                        var rawObj = res.result;
                        console.log(rawObj);

                        if (res.status == 'ok') {
                            var totPlan = 0,
                                totAct = 0,
                                totDiffPlus = 0,
                                totDiffMin = 0;
                            $.each(res.result, function(key, value) {
                                var diff = value.actual - value.plan;
                                if (diff < 0) var diffMin = diff,
                                    diffPlus = 0;
                                else var diffPlus = diff,
                                    diffMin = 0;

                                var elem = '';
                                if (diffPlus != 0 || diffMin != 0) {
                                    elem += "<tr><td>" + value.gmc + "</td><td>" + value.description + "</td><td class='text-right'>" + numberWithCommas(value.plan) + "</td><td class='text-right'>" + numberWithCommas(value.actual) + "</td><td class='text-right'>" + numberWithCommas(diffPlus) + "</td><td class='text-right'>" + numberWithCommas(diffMin) + "</td></tr>";
                                }

                                $("#table-data").append(elem);

                                totPlan += parseInt(value.plan);
                                totAct += parseInt(value.actual);
                                totDiffPlus += parseInt(diffPlus);
                                totDiffMin += parseInt(diffMin);
                            })

                            // Format the numbers
                            totPlan = numberWithCommas(totPlan);
                            totAct = numberWithCommas(totAct);
                            totDiffPlus = numberWithCommas(totDiffPlus);
                            totDiffMin = numberWithCommas(totDiffMin);

                            // append the Qty total
                            $('#table-total-plan').html(totPlan);
                            $('#table-total-actual').html(totAct);
                            $('#table-total-diff-plus').html(totDiffPlus);
                            $('#table-total-diff-minus').html(totDiffMin);

                            // Show the MODAL
                            $('#modal').modal('show');
                        } else {
                            $('#modal-error').modal('show');
                        }

                        // Render the Extended Chart
                        // renderExtChart(finalData);
                        // Show the MODAL
                        $('#modal').modal('show');
                    }
                })
            }
        }
    });
}

// Render extended chart Fn
// var renderExtChart = function(data) {
//     // un-hide buttons
//     $('#btn-close').removeClass('d-none');
//     $('#open-ws-1').removeClass('d-none');

//     // hide chart #2 container, chart #1 title, marquee & tabs
//     $('#chart-2, #kop, #title-chart-1, .nav').addClass('d-none');

//     // Set chart title
//     $('#chart-title-1').addClass('d-none');

//     // save respected value on a hidden fields
//     // $('#hidden-date').val(moment(data.tanggal).format('YYYY-MM-DD'));
//     $('#hidden-type').val(data.categories[0].label);

//     // main action
//     $('#chart-container-1').insertFusionCharts({
//         type: 'mscolumn2d',
//         width: 1120,
//         height: 520,
//         dataFormat: 'json',
//         dataSource: {
//             "chart": {
//                 "caption": "Kesesuaian Per Item 部品ごとの適合性",
//                 "captionFontSize": "30",
//                 "captionFont": "Arial Black",
//                 "CaptionFontBold": "1",
//                 "CaptionFontColor": "0000FF",
//                 "subCaption": moment($('#hidden-date').val()).format('DD MMMM YYYY'),
//                 "subcaptionFontSize": "20",
//                 "subCaptionFontColor": "008000",
//                 "subCaptionFontBold": "1",
//                 "plotSpacePercent": "25",
//                 "baseFont": "Arial Black",
//                 "baseFontSize": "20",
//                 "baseFontColor": "000000",
//                 "yAxisName": "Perolehan",
//                 "theme": "fusion",
//                 "plotFillAlpha": "50",
//                 "divLineIsDashed": "1",
//                 "divLineDashLen": "1",
//                 "divLineGapLen": "1",
//                 "showValues": "1",
//                 "valueFontSize": "30",
//                 "valueFont": "Arial Black",
//                 "valueFontColor": "0000FF",
//                 "valueFontBold": "1",
//                 "bgColor": "E0FFFF",
//                 "bgAlpha": "50",
//                 "id": 'main-chart'
//             },
//             "categories": [{
//                 "category": data.categories
//             }],
//             "dataset": [{
//                     "seriesname": "Plus",
//                     "color": "008000",
//                     "data": data.surplus
//                 },
//                 {
//                     "seriesname": "Minus",
//                     "color": "FF0000",
//                     "data": data.minus
//                 }
//             ]
//         },
//         "events": {
//             "dataPlotClick": function(eventObj, dataObj) {
//                 // Show popup ONLY for FL,CL,AS,TS products:
//                 // if (dataObj.categoryLabel == 'FL' || dataObj.categoryLabel == 'CL' || dataObj.categoryLabel == 'AS' || dataObj.categoryLabel == 'TS') {
//                 // Call table data API
//                 $.ajax({
//                     type: 'POST',
//                     url: 'api/postDetail.php',
//                     dataType: "json",
//                     data: {
//                         data_type: dataObj.categoryLabel,
//                         data_date: $('#hidden-date').val()
//                     },
//                     success: function(res) {
//                         $('#modal-title').html('Kesesuaian Per Item 部品ごとの適合性: ' + dataObj.categoryLabel);
//                         $("#table-tgl").html(moment($('#hidden-date').val()).format('DD MMMM YYYY'));

//                         // clear the table
//                         $("#table-data").html('');

//                         if (res.status == 'ok') {
//                             var totPlan = 0,
//                                 totAct = 0,
//                                 totDiffPlus = 0,
//                                 totDiffMin = 0;
//                             $.each(res.result, function(key, value) {
//                                 var diff = value.actual - value.plan;
//                                 if (diff < 0) var diffMin = diff,
//                                     diffPlus = 0;
//                                 else var diffPlus = diff,
//                                     diffMin = 0;

//                                 $("#table-data").append("<tr><td>" + value.gmc + "</td><td>" + value.description + "</td><td class='text-right'>" + numberWithCommas(value.plan) + "</td><td class='text-right'>" + numberWithCommas(value.actual) + "</td><td class='text-right'>" + numberWithCommas(diffPlus) + "</td><td class='text-right'>" + numberWithCommas(diffMin) + "</td></tr>");

//                                 totPlan += parseInt(value.plan);
//                                 totAct += parseInt(value.actual);
//                                 totDiffPlus += parseInt(diffPlus);
//                                 totDiffMin += parseInt(diffMin);
//                             })

//                             // Format the numbers
//                             totPlan = numberWithCommas(totPlan);
//                             totAct = numberWithCommas(totAct);
//                             totDiffPlus = numberWithCommas(totDiffPlus);
//                             totDiffMin = numberWithCommas(totDiffMin);

//                             // append the Qty total
//                             $('#table-total-plan').html(totPlan);
//                             $('#table-total-actual').html(totAct);
//                             $('#table-total-diff-plus').html(totDiffPlus);
//                             $('#table-total-diff-minus').html(totDiffMin);

//                             // Show the MODAL
//                             $('#modal').modal('show');
//                         } else {
//                             $('#modal-error').modal('show');
//                         }
//                     }
//                 })
//                 // }
//             }
//         }
//     });
// }

// Call API for Main Chart Fn
var initiateData = function() {
    // reset all Charts states
    $('#chart-container-1, #chart-container-2, #tab-chart-1').html('');

    // Get WEEKS first
    // 
    $.ajax({
        type: 'GET',
        url: 'api/getWeek.php',
        dataType: "json",
        success: function(response) {
            var res = response.result;
            $('#tab-chart-1').html();

            // Find the latest week
            var maxWeek = 0;
            res.map(function(obj) {
                if (obj.week > maxWeek) maxWeek = obj.week;

                // render tab's header based on week
                $('.nav').append('<li class="nav-item"><a class="btn nav-link" onclick="showChart(' + obj.week + ')" id="btn-nav-' + obj.week + '" href="#">Week ' + obj.week + '</a></li>');
            });

            var cData = showChart(maxWeek);
        }
    })
}

// Function to call Chart's data
var showChart = function(w) {
    // Set ACTIVE to respected nav button
    $('.nav-link').removeClass('active');
    $('#btn-nav-' + w).addClass('active');

    // Save $week value in hidden input
    $('#hidden-week').val(w);



    // unhide chart titles
    $('#chart-title-1').removeClass('d-none');
    $('#chart-title-2').removeClass('d-none');

    $.ajax({
        type: 'POST',
        url: 'api/getData.php',
        dataType: "json",
        data: {
            week: w
        },
        success: function(response) {
            $('#hidden-week').val(w);
            $('#hidden-date').val(response.result[0].tanggal);

            var finalData = {},
                dataCategories = [],
                dataPlan = [],
                dataActual = [];

            // summarize data
            if (response.status == 'ok') {
                // Grouping data by "Tanggal"
                var rawData = response.result;

                // call teh SortData Fn
                // var rawData = sortData(rawObj);

                // Populating for chart
                var flData, clData, asData, tsData, pnData, rcData, vnData;
                rawData.forEach(function(data) {
                    switch (data.tipe_produk) {
                        case 'cl':
                            clData = data;
                            break;
                        case 'as':
                            asData = data;
                            break;
                        case 'ts':
                            tsData = data;
                            break;
                        case 'pn':
                            pnData = data;
                            break;
                        case 'rc':
                            rcData = data;
                            break;
                        case 'vn':
                            vnData = data;
                            break;
                        default:
                            flData = data;
                            break;
                    }
                });

                dataCategories = [{ label: "FLUTE" }, { label: "CLARINET" }, { label: "ALTO SAX" }, { label: "TENOR SAX" }, { label: "PIANICA" }, { label: "VENOVA" }, { label: "RECORDER" }];
                //dataPlan = [{ value: flData.plan2 }, { value: clData.plan2 }, { value: asData.plan2 }, { value: tsData.plan2 }, { value: pnData.plan2 }, { value: vnData.plan2 }, { value: rcData.plan2 }];
                dataPlan = [{ value: 100 - flData.actual2 }, { value: 100 - clData.actual2 }, { value: 100 - asData.actual2 }, { value: 100 - tsData.actual2 }, { value: 100 - pnData.actual2 }, { value: 100 - vnData.actual2 }, { value: 100 - rcData.actual2 }];
                dataActual = [{ value: flData.actual2 }, { value: clData.actual2 }, { value: asData.actual2 }, { value: tsData.actual2 }, { value: pnData.actual2 }, { value: vnData.actual2 }, { value: rcData.actual2 }];

            }

            // populating data
            finalData = {
                "categories": dataCategories,
                "plan": dataPlan,
                "actual": dataActual,
            };

            renderMainChart(finalData);
        }
    });
}

// Sort Data Fn (for main chart)
var sortData = function(rawObj) {
    var group_to_values = rawObj.reduce(function(obj, item) {
        obj[item.tanggal] = obj[item.tanggal] || [];
        obj[item.tanggal].push({
            tipe_produk: item.tipe_produk,
            gmc: item.gmc,
            description: item.description,
            plan: item.plan,
            actual: item.actual
        });
        return obj;
    }, {});

    var groups = Object.keys(group_to_values).map(function(key) {
        return {
            tanggal: key,
            data: group_to_values[key]
        };
    });

    // Then do grouping the result by "Tipe_produk"
    var rawData = [];
    groups.forEach(function(val) {
        var tempObj = {};
        // Iterate the "data" object
        var dtObj = val.data,
            dtFlPlan = 0,
            dtFlAct = 0,
            dtClPlan = 0,
            dtClAct = 0,
            dtAsPlan = 0,
            dtAsAct = 0,
            dtTsPlan = 0,
            dtTsAct = 0,
            dtPnPlan = 0,
            dtPnAct = 0,
            dtVnPlan = 0,
            dtVnAct = 0,
            dtRcPlan = 0,
            dtRcAct = 0;
        dtObj.forEach(function(dt) {
            if (dt.tipe_produk == 'fl') {
                dtFlPlan += parseInt(dt.plan);
                dtFlAct += parseInt(dt.actual);
            } else if (dt.tipe_produk == 'cl') {
                dtClPlan += parseInt(dt.plan);
                dtClAct += parseInt(dt.actual);
            } else if (dt.tipe_produk == 'as') {
                dtAsPlan += parseInt(dt.plan);
                dtAsAct += parseInt(dt.actual);
            } else if (dt.tipe_produk == 'ts') {
                dtTsPlan += parseInt(dt.plan);
                dtTsAct += parseInt(dt.actual);
            } else if (dt.tipe_produk == 'pn') {
                dtPnPlan += parseInt(dt.plan);
                dtPnAct += parseInt(dt.actual);
            } else if (dt.tipe_produk == 'rc') {
                dtRcPlan += parseInt(dt.plan);
                dtRcAct += parseInt(dt.actual);
            } else {
                dtVnPlan += parseInt(dt.plan);
                dtVnAct += parseInt(dt.actual);
            }
        });
        tempObj = {
            category: val.tanggal,
            flPlan: dtFlPlan,
            flAct: dtFlAct,
            clPlan: dtClPlan,
            clAct: dtClAct,
            asPlan: dtAsPlan,
            asAct: dtAsAct,
            tsPlan: dtTsPlan,
            tsAct: dtTsAct,
            pnPlan: dtPnPlan,
            pnAct: dtPnAct,
            rcPlan: dtRcPlan,
            rcAct: dtRcAct,
            vnPlan: dtVnPlan,
            vnAct: dtVnAct
        };
        rawData.push(tempObj);
    });

    return rawData;
}

// Sort Data Fn (for WS chart)
var sortWsData = function(rawObj) {
    var group_to_values = rawObj.reduce(function(obj, item) {
        obj[item.produk] = obj[item.produk] || [];
        obj[item.produk].push({
            tanggal: item.tanggal,
            target_persentase: item.target_persentase,
            persentase_shipment: item.persentase_shipment
        });
        return obj;
    }, {});

    var groups = Object.keys(group_to_values).map(function(key) {
        return {
            produk: key,
            data: group_to_values[key]
        };
    });

    return groups;
}

// Sort Data Fn (for WS chart)
var sortWsDataIndex = function(rawObj) {
    var group_to_values = rawObj.reduce(function(obj, item) {
        obj[item.tipe_produk] = obj[item.tipe_produk] || [];
        obj[item.tipe_produk].push({
            tipe_produk: item.tipe_produk,
            gmc: item.gmc,
            description: item.description,
            plan: item.plan,
            actual: item.actual
        });
        return obj;
    }, {});

    var groups = Object.keys(group_to_values).map(function(key) {
        return {
            tipe_produk: key,
            data: group_to_values[key]
        };
    });

    return groups;
}
