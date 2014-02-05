var map;

function initialize()
{
    lastLocation = new google.maps.LatLng(35.68, 139.75);
    var mapOptions = {
        zoom: 2,
        center: lastLocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    //create map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //click event
    setClickEvent();
}

function setClickEvent()
{
    google.maps.event.addListener(map, 'click', function(event) {
        var requestUrl =
            'https://maps.googleapis.com/maps/api/timezone/' +
            'json' +
            '?location=' + event.latLng.lat() + ',' + event.latLng.lng() +
            '&timestamp=' + getTimeStamp(new Date().getTime()) +
            '&sensor=' + 'false' +
            '&language=' + 'ja';

        //request timezone
        $.ajax({
            url: requestUrl,
            type: 'GET',
            success: function(timeZone) {
                if (timeZone['status'] == 'OK') {
                    //add marker
                    addMarker(event.latLng, timeZone);
                } else {
                    //error
                    alert('status:' + timeZone['status']);
                }
            }
        });
    });
}

function getTimeStamp(time)
{
    return Math.round(time / 1000);
}

function addMarker(latLng, timeZone)
{
    var contentString =
        '<div class="content">' +
        '<p>' + '緯度経度:　' + latLng + '</p>' +
        '<p>' + 'タイムゾーンID:　' + timeZone['timeZoneId'] + '</p>' +
        '<p>' + 'タイムゾーン名:　' + timeZone['timeZoneName'] + '</p>' +
        '<p>' + '時差:　' + timeZone['rawOffset']/3600 + '時間' + '</p>' +
        '<p>' + 'サマータイムによる時差:　' + timeZone['dstOffset']/3600 + '時間' + '</p>' +
        '</div>';

    //create infowindow
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    
    //create marker
    var marker = new google.maps.Marker({
        position:latLng,
    });
    
    //set event
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
    
    //set map
    marker.setMap(map);
    
    //open infowindow
    infowindow.open(map, marker);
}

//initialize
google.maps.event.addDomListener(window, 'load', initialize);
