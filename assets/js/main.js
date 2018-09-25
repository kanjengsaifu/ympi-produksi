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

    // Un-hide chart #2 container & reset Tabs
    $('#chart-2').removeClass('d-none');

    // Set marwuee text
    // $('#marquee-text').html('... Gatsu ... made no, seisan no kekka wo houkoku shimasu . Diinformasikan hasil produksi sampai tanggal ...');

    // Chart #1
    $('#chart-container-1').insertFusionCharts({
        type: 'scrollstackedcolumn2d',
        width: 1024,
        height: 300,
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "labelDisplay": "none",
                "yAxisName": "Perolehan",
                "theme": "fusion",
                "stack100percent": "1",
                "decimals": "1",
                "plotFillAlpha": "80",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "showValues": "1",
                "valueFontSize": "15",
                "bgColor": "#DDDDDD",
                "bgAlpha": "50",
                "id": 'main-chart'
            },
            "categories": [{
                "category": data.categories
            }],
            "dataset": [{
                    "seriesname": "Actual",
                    "data": data.plan
                },
                {
                    "seriesname": "Minus",
                    "color": "FFE4B5",
                    "data": data.actual
                }
            ]
        },
        "events": {
            "dataPlotClick": function(eventObj, dataObj) {
                var finalData = {}
                $.ajax({
                    type: 'POST',
                    url: 'api/postData.php',
                    dataType: "json",
                    data: {
                        tanggal: moment(dataObj.categoryLabel).format('YYYY-MM-DD')
                    },
                    success: function(res) {
                        var rawObj = res.result;

                        // Find each product's diff
                        var flDiffPlus = 0,
                            flDiffMin = 0,
                            clDiffPlus = 0,
                            clDiffMin = 0,
                            asDiffPlus = 0,
                            asDiffMin = 0,
                            tsDiffPlus = 0,
                            tsDiffMin = 0;

                        rawObj.forEach(function(dt) {
                            if (dt.tipe_produk == 'fl') {
                                var flCalc = dt.actual - dt.plan;
                                if (flCalc > 0) flDiffPlus += flCalc;
                                else flDiffMin += flCalc;
                            }

                            if (dt.tipe_produk == 'cl') {
                                var clCalc = dt.actual - dt.plan;
                                if (clCalc > 0) clDiffPlus += clCalc;
                                else clDiffMin += clCalc;
                            }

                            if (dt.tipe_produk == 'as') {
                                var asCalc = dt.actual - dt.plan;
                                if (asCalc > 0) asDiffPlus += asCalc;
                                else asDiffMin += asCalc;
                            }

                            if (dt.tipe_produk == 'ts') {
                                var tsCalc = dt.actual - dt.plan;
                                if (tsCalc > 0) tsDiffPlus += tsCalc;
                                else tsDiffMin += tsCalc;
                            }
                        })

                        // Populate datas
                        finalData.tanggal = dataObj.categoryLabel;
                        finalData.categories = [{
                            "label": "FL"
                        }, {
                            "label": "CL"
                        }, {
                            "label": "AS"
                        }, {
                            "label": "TS"
                        }];

                        finalData.surplus = [{
                            "value": flDiffPlus
                        }, {
                            "value": clDiffPlus
                        }, {
                            "value": asDiffPlus
                        }, {
                            "value": tsDiffPlus
                        }];

                        finalData.minus = [{
                            "value": flDiffMin
                        }, {
                            "value": clDiffMin
                        }, {
                            "value": asDiffMin
                        }, {
                            "value": tsDiffMin
                        }];

                        // Render the Extended Chart
                        renderExtChart(finalData);
                    }
                })
            }
        }
    });

    // Chart #2
    $('#chart-container-2').insertFusionCharts({
        type: 'scrollstackedcolumn2d',
        width: 1024,
        height: 300,
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "yAxisName": "Perolehan",
                "theme": "fusion",
                "stack100percent": "1",
                "decimals": "1",
                "plotFillAlpha": "80",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "showValues": "1",
                "valueFontSize": "15"

            },
            "categories": [{
                "category": data.categories
            }],
            "dataset": [{
                    "seriesname": "Actual",
                    "data": data.plan_2
                },
                {
                    "seriesname": "Minus",
                    "color": "C0C0C0",
                    "data": data.actual_2
                }
            ]
        },
        "events": {
            "dataPlotClick": function(eventObj, dataObj) {
                var finalData = {}
                $.ajax({
                    type: 'POST',
                    url: 'api/postData2.php',
                    dataType: "json",
                    data: {
                        tanggal: moment(dataObj.categoryLabel).format('YYYY-MM-DD')
                    },
                    success: function(res) {
                        var rawObj = res.result;

                        // Find each product's diff
                        var pnDiffPlus = 0,
                            pnDiffMin = 0,
                            rcDiffPlus = 0,
                            rcDiffMin = 0,
                            vnDiffPlus = 0,
                            vnDiffMin = 0;

                        rawObj.forEach(function(dt) {
                            if (dt.tipe_produk == 'pn') {
                                var pnCalc = dt.actual - dt.plan;
                                if (pnCalc > 0) pnDiffPlus += pnCalc;
                                else pnDiffMin += pnCalc;
                            }

                            if (dt.tipe_produk == 'rc') {
                                var rcCalc = dt.actual - dt.plan;
                                if (rcCalc > 0) rcDiffPlus += rcCalc;
                                else rcDiffMin += rcCalc;
                            }

                            if (dt.tipe_produk == 'vn') {
                                var vnCalc = dt.actual - dt.plan;
                                if (vnCalc > 0) vnDiffPlus += vnCalc;
                                else vnDiffMin += vnCalc;
                            }
                        })

                        // Populate datas
                        finalData.tanggal = dataObj.categoryLabel;
                        finalData.categories = [{
                            "label": "PN"
                        }, {
                            "label": "RC"
                        }, {
                            "label": "VN"
                        }];

                        finalData.surplus = [{
                            "value": pnDiffPlus
                        }, {
                            "value": rcDiffPlus
                        }, {
                            "value": vnDiffPlus
                        }];

                        finalData.minus = [{
                            "value": pnDiffMin
                        }, {
                            "value": rcDiffMin
                        }, {
                            "value": vnDiffMin
                        }];

                        // Render the Extended Chart
                        renderExtChart(finalData);
                    }
                })
            }
        }
    });
}

// Render extended chart Fn
var renderExtChart = function(data) {
    // un-hide buttons
    $('#btn-close, #btn-ws').removeClass('d-none');

    // hide chart #2 container, chart #1 title, marquee & tabs
    $('#chart-2, #title-chart-1, .nav').addClass('d-none');

    // save respected value on a hidden fields
    $('#hidden-date').val(moment(data.tanggal).format('YYYY-MM-DD'));
    $('#hidden-type').val(data.categories[0].label);

    if (data.categories.length == 3) {
        // Marque for PN,RC,VN products
        // $('#marquee-text').html('Aitemu goto no seisan no kekka wa. Hasil kesesuaian per item sebagai berikut: KBI kara case pianica no okure ga arimasu kara, pianica wa mainasu Hap Hyaku roku juu setto desu. Karena ada keterlambatan case Pianica dari KBI, Pianica minus 860 set. Rikooda to Venova no aitemu go to no okure wa arimasen. Tidak ada keterlambatan per item untuk produk Recorder dan Venova');
    // } else {
        // Marque for FL,CL,AS,TS products
        // $('#marquee-text').html('Aitemu goto no seisan no kekka wa. Hasil kesesuaian per item sebagai berikut: Furuto wa mainasu Ni Juu Go setto, purasu Ni Juu Go setto desu. FL minus 25 set, plus 25 set. Kurarinetto wa mainasu Juu setto, purasu Juu setto desu. Aruto sakkusu wa mainasu Ni Juu setto, purasu Ni Juu setto desu. Sax Alto minus 20 set, plus 20 set. Tena Sakkusu wa mainasu Go setto. Purasu Go setto desu. Sax Tenor minus 5 set, plus 5 set');
    }

    // main action
    $('#chart-container-1').insertFusionCharts({
        type: 'mscolumn2d',
        width: 1024,
        height: 600,
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "Kesesuaian Produksi",
                "subCaption": "Tanggal " + moment(data.tanggal).format('DD MMMM YYYY'),
                // "xAxisName": "Produk",
                "yAxisName": "Perolehan",
                "theme": "fusion",
                "plotFillAlpha": "80",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "showValues": "1",
                "valueFontSize": "15",
                "id": 'main-chart'
            },
            "categories": [{
                "category": data.categories
            }],
            "dataset": [{
                    "seriesname": "Surplus",
                    "data": data.surplus
                },
                {
                    "seriesname": "Minus",
                    "data": data.minus
                }
            ]
        },
        "events": {
            "dataPlotClick": function(eventObj, dataObj) {
                // Show popup ONLY for FL,CL,AS,TS products:
                // if (dataObj.categoryLabel == 'FL' || dataObj.categoryLabel == 'CL' || dataObj.categoryLabel == 'AS' || dataObj.categoryLabel == 'TS') {
                // Call table data API
                $.ajax({
                    type: 'POST',
                    url: 'api/postDetail.php',
                    dataType: "json",
                    data: {
                        data_type: dataObj.categoryLabel,
                        data_date: $('#hidden-date').val()
                    },
                    success: function(res) {
                        $('#modal-title').html('Data Kesesuaian: ' + dataObj.categoryLabel);
                        $("#table-tgl").html(moment($('#hidden-date').val()).format('DD MMMM YYYY'));

                        // clear the table
                        $("#table-data").html('');

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

                                $("#table-data").append("<tr><td>" + value.gmc + "</td><td>" + value.description + "</td><td class='text-right'>" + numberWithCommas(value.plan) + "</td><td class='text-right'>" + numberWithCommas(value.actual) + "</td><td class='text-right'>" + numberWithCommas(diffPlus) + "</td><td class='text-right'>" + numberWithCommas(diffMin) + "</td></tr>");

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
                    }
                })
                // }
            }
        }
    });
}

// Call API for Main Chart Fn
var initiateData = function() {
    // reset components this.state
    $('.marquee, #title-chart-1, .nav').removeClass('d-none');

    // reset all Charts states
    $('#chart-container-1, #chart-container-2, #tab-chart-1').html('');

    // Get WEEKS first
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
                $('#tab-chart-1').append('<li class="nav-item"><a class="btn nav-link" onclick="showChart(' + obj.week + ')" id="btn-nav-' + obj.week + '" href="#">Week ' + obj.week + '</a></li>');
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

    $.ajax({
        type: 'POST',
        url: 'api/getData.php',
        dataType: "json",
        data: {
            week: w
        },
        success: function(response) {
            var finalData = {},
                dataCategories = [],
                dataPlan = [],
                dataActual = [],
                dataPlan2 = [],
                dataActual2 = [];

            // summarize data
            if (response.status == 'ok') {
                // Grouping data by "Tanggal"
                var rawObj = response.result;

                // call teh SortData Fn
                var rawData = sortData(rawObj);

                // Populating for chart
                rawData.forEach(function(data) {
                    var dataTgl = {
                        "label": moment(data.category).format('DD MMM YY')
                    }
                    dataCategories.push(dataTgl);

                    var dtAct = {
                        "value": (data.flPlan-data.flAct) + (data.clPlan-data.clAct) + (data.asPlan-data.asAct) + (data.tsPlan-data.tsAct)
                    }
                    dataActual.push(dtAct);

                    var dtPlan = {
                        "value": data.flAct + data.clAct + data.asAct + data.tsAct
                    }
                    dataPlan.push(dtPlan);

                    var dtAct2 = {
                        "value": (data.pnPlan-data.pnAct) + (data.rcPlan-data.rcAct) + (data.vnPlan-data.vnAct)
                    }
                    dataActual2.push(dtAct2);

                    var dtPlan2 = {
                        "value": data.pnAct + data.rcAct + data.vnAct
                    }
                    dataPlan2.push(dtPlan2);
                })
            }

            // populating data
            finalData = {
                "categories": dataCategories,
                "plan": dataPlan,
                "actual": dataActual,
                "plan_2": dataPlan2,
                "actual_2": dataActual2
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