(function () {
  'use strict';
  var vids = document.getElementsByTagName('video') 
  vids = [].slice.call(vids);

  var all_data_loaded_for_vid = new WeakMap();

  for( var ii = 0; ii < vids.length; ii++ ){ 
    vids[ii].style.display = "none"; // hide videos untill downloaded
    all_data_loaded_for_vid.set(vids[ii],0)
    var url = vids[ii].getAttribute('data-src');
    download_video(url, vids[ii], all_data_loaded_for_vid);
  }

  var already_loaded = 0;
  var loading_gif = document.getElementById("loading");
  loading_gif.style.display = '';
  var demo_header = document.getElementById("demo_header");

  var debug = 0;


  function check_browser() {

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    if (isSafari) {
      return 0;
    }

    return 1;
  }


  if (!check_browser()) {
    loading_gif.style.display = 'none';
    demo_header.style.display = '';
    demo_header.innerHTML = '<h1> Sorry, your web browser is not supported. Please load the page with Chrome or Firefox, or watch our non-interactive example videos. </h1>'
    return
  }

  function wait_for_download_loop() {
    if (already_loaded) {
     return
    }

    if (debug){
      var strr = ''
      for( var ii = 0; ii < vids.length; ii++ ){ 
        //strr +=  vids[ii].readyState + ' '
        //strr +=  all_data_loaded_for_vid[ii] + ' '
        //strr +=  all_data_loaded_for_vid[vids[ii]] + ' '
        strr +=  all_data_loaded_for_vid.get(vids[ii]) + ' '
      }
      document.getElementById("print").innerHTML = strr ;
    }

    var all_found = 1;
    for( var ii = 0; ii < vids.length; ii++ ){ 
      if (all_data_loaded_for_vid.get(vids[ii]) === 0) {
        all_found = 0;
      }
    }
    //all_found = 0;

    // TODO: Add "Please wait while loading icon/moving thing"
    var all_found = 1;
    if ( all_found ) {
    loading_gif.style.display = 'none';
     demo_header.style.display = '';

     play_videos(all_data_loaded_for_vid, debug);
     already_loaded = 1;
    }
  }

  var intervalID = setInterval(wait_for_download_loop, 100); 

 })();


function download_video(url, video_element, all_data_loaded_for_vid) {
  
}



function play_videos(all_data_loaded_for_vid, debug){ 


  // Does the browser actually support the video element?
  var supportsVideo = !!document.createElement('video').canPlayType;
  var supportsEventListener = document.addEventListener
  if (!supportsVideo || !supportsEventListener){
    // TODO: add error message
    return;
  }


  // Obtain handles to main elements
  var videoContainer = document.getElementById('videoContainer');
  var videoControls = document.getElementById('video-controls');

  var vids = document.getElementsByTagName('video') 
  vids = [].slice.call(vids);
  //vids = vids.slice(2);
  //vids = [].slice.call(vids).slice(2);
  //vids = vids.slice(1);

  var video = vids[0]; // set the first one as the reference video

  //if (debug){
    //var intervalID = setInterval(function(){
       ////console.log("Interval reached");
      //var strr = ''
      //for( var ii = 0; ii < vids.length; ii++ ){ 
         ////strr +=  vids[ii].readyState + ' '
         ////strr +=  all_data_loaded_for_vid.get(vids[ii]) + ' '
         //strr += ii + ': ' +  vids[ii].currentTime +  '<br>'
         //if (ii === 0) {
           //strr += '<br>'
         //}
      //}
      //document.getElementById("print").innerHTML = strr ;
    //}, 100); 
  //}
  
  var mute_states = [];
  var cur_video;
  enable_video(vids, 0);

  var bboxes = [];
  for( var ii = 0; ii < vids.length; ii++ ){ 
      var bbox = vids[ii].getAttribute('data-bbox');
      bbox = JSON.parse(bbox);
      bboxes.push(bbox);
  }

  var time_lims = [];
  for( var ii = 0; ii < vids.length; ii++ ){ 
      var time_lim = vids[ii].getAttribute('data-time_lims');
      time_lim = JSON.parse(time_lim);
      time_lims.push(time_lim);
  }

  // Hide the default controls
  for( var ii = 0; ii < vids.length; ii++ ){ 
      vids[ii].controls = false;
  }
  

  // Display the user defined video controls
  videoControls.setAttribute('data-state', 'visible');

  // Obtain handles to buttons and other elements
  var playpause = document.getElementById('playpause');
  var stop = document.getElementById('stop');
  var mute = document.getElementById('mute');
  var volinc = document.getElementById('volinc');
  var voldec = document.getElementById('voldec');
  var progress = document.getElementById('progress');
  var progressBar = document.getElementById('progress-bar');
  var fullscreen = document.getElementById('fs');

  // If the browser doesn't support the progress element, set its state for some different styling
  var supportsProgress = (document.createElement('progress').max !== undefined);
  if (!supportsProgress) progress.setAttribute('data-state', 'fake');

  // For now we dont support fullscreen

  var global_mute = false;
  var toggle_global_mute = function(value=-1) {
      if (value != -1){
        global_mute = value;
      }
      else {
        global_mute = !global_mute;
      }
      // if global_mute is on, mute all vids
      if (global_mute) {
        for( var ii = 0; ii < vids.length; ii++ ){ 
          vids[ii].muted = global_mute;
        }
      }
      // else restore the previous state
      else {
        for( var ii = 0; ii < vids.length; ii++ ){ 
          vids[ii].muted = mute_states[ii];
        }
      }
      changeButtonState('mute');
  }


  // Check the volume
  var checkVolume = function(dir) {
    if (dir) {
      var currentVolume = Math.floor(video.volume * 10) / 10;
      if (dir === '+') {
        if (currentVolume < 1){
          for( var ii = 0; ii < vids.length; ii++ ){ 
              vids[ii].volume += 0.1;
          }
        }
      }
      else if (dir === '-') {
        if (currentVolume > 0){
          for( var ii = 0; ii < vids.length; ii++ ){ 
              vids[ii].volume -= 0.1;
          }
        }
      }
      // If the volume has been turned off, also set it as muted
      // Note: can only do this with the custom control set as when the 'volumechange' event is raised, there is no way to know if it was via a volume or a mute change
      if (currentVolume <= 0){
        toggle_global_mute(1)
      }
      else{
        toggle_global_mute(0)
      }
    }
  }

  // Change the volume
  var alterVolume = function(dir) {
    checkVolume(dir);
  }

  // Set the video container's fullscreen state
  var setFullscreenData = function(state) {
    videoContainer.setAttribute('data-fullscreen', !!state);
    // Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
    fullscreen.setAttribute('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
  }

  // Checks if the document is currently in fullscreen mode
  var isFullScreen = function() {
          return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
  }

  // Fullscreen
  var handleFullscreen = function() { }

  // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)

    // Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
  video.addEventListener('loadedmetadata', function() {
    progress.setAttribute('max', video.duration);
  });

    // Changes the button state of certain button's so the correct visuals can be displayed with CSS
  var changeButtonState = function(type) {
    // Play/Pause button
    if (type == 'playpause') {
            if (video.paused || video.ended) {
                    playpause.setAttribute('data-state', 'play');
            }
            else {
                    playpause.setAttribute('data-state', 'pause');
            }
    }
    // Mute button
    else if (type == 'mute') {
            mute.setAttribute('data-state', global_mute ? 'unmute' : 'mute');
    }
  }

  // Add event listeners for video specific events
  video.addEventListener('play', function() {
    changeButtonState('playpause');
  }, false);
  video.addEventListener('pause', function() {
    changeButtonState('playpause');
  }, false);
  video.addEventListener('volumechange', function() {
    checkVolume();
  }, false);

  // Add events for all buttons			
  playpause.addEventListener('click', function(e) {
    if (video.paused || video.ended){
      //video.play();
      for( var ii = 0; ii < vids.length; ii++ ){ 
          vids[ii].play();
      }
      vidDeviationControl();
    }
    else {
      for( var ii = 0; ii < vids.length; ii++ ){ 
          vids[ii].pause();
      }
      //video.pause();
    }
  });			

  // The Media API has no 'stop()' function, so pause the video and reset its time and the progress bar
  stop.addEventListener('click', function(e) {
    for( var ii = 0; ii < vids.length; ii++ ){ 
        vids[ii].pause();
        vids[ii].currentTime = 0;
    }
    progress.value = 0;
    // Update the play/pause button's 'data-state' which allows the correct button image to be set via CSS
    changeButtonState('playpause');
  });
  mute.addEventListener('click', function(e) {
    toggle_global_mute();
  });
  volinc.addEventListener('click', function(e) {
          alterVolume('+');
  });
  voldec.addEventListener('click', function(e) {
          alterVolume('-');
  });
  

  // As the video is playing, update the progress bar
  video.addEventListener('timeupdate', function() {
          // For mobile browsers, ensure that the progress element's max attribute is set
          if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
          progress.value = video.currentTime;
          progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
  });

  // React to the user clicking within the progress bar
  progress.addEventListener('click', function(e) {
          //var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth; // Also need to take the parent into account here as .controls now has position:relative
          var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
          for( var ii = 0; ii < vids.length; ii++ ){ 
            vids[ii].currentTime = pos * vids[0].duration;
          }
  });

  
 

  for( var ii = 0; ii < vids.length; ii++ ){ 
    vids[ii].addEventListener('mousemove', showCoords)
    vids[ii].addEventListener('mouseleave', mouseOut)
  }

  function enable_video(vids, vid_id) {

    if (cur_video === vids[vid_id]) {
      return
    }

    for( var ii = 0; ii < vids.length; ii++ ){ 
      //if (cursor_in_bbox(bboxes[ii], cX, cY)) {
      if (ii === vid_id) {
        vids[ii].style.display = "";
        if (!global_mute) {
          vids[ii].muted=0;
        }
        mute_states[ii] = 0;
      } else{
        vids[ii].style.display = "none";
        vids[ii].muted=1;
        mute_states[ii] = 1;
      }
    }

    cur_video = vids[vid_id];

  }

  function time_in_lims(time_lims) {
    var t0, t1;
    [t0, t1] = time_lims;
    var rel_time = video.currentTime / video.duration;
    if ( rel_time < t0  || rel_time > t1) {
      return 0;
    } 
    return 1;
  }

  function cursor_in_bbox(bbox, cX, cY) {
    var x0, y0, x1, y1;
    [x0, x1, y0, y1] = bbox
    if ( cX < x0  || cX > x1) {
      return 0;
    } 
    if ( cY < y0  || cY > y1) {
      return 0;
    } 
    return 1;
  }


  function showCoords(event) {

      //var mix = document.getElementById("mix");

      var rect = event.target.getBoundingClientRect();
      var cX = (event.clientX - rect.left) / rect.width;
      var cY = (event.clientY - rect.top) / rect.height;
      var coords1 = "client - X: " + cX + ", Y coords: " + cY;
      //console.log(coords1)
      // var coords2 = "top: " + rect.top + ", left: " + rect.left;
      //document.getElementById("print").innerHTML = coords1 ;

      //mix.style.display = "none";
      //mix.muted=1;

      //console.log('cursor in bbox 1', cursor_in_bbox(bbox1, cX, cY));

      var found_id = -1;
      for( var ii = 0; ii < vids.length; ii++ ){ 

        var bbox_ok = cursor_in_bbox(bboxes[ii], cX, cY);
        var time_ok = time_in_lims(time_lims[ii]);
        if (bbox_ok && time_ok) {
          found_id = ii;
          break;
        }
      }

      // In case we're close but out of boundaries for a bit, just keep the last element on
      if (found_id === -1) {
        enable_video(vids, 0);
        return
      }

      enable_video(vids, found_id);

  }


  function mouseOut(event) {
      if (event.target != cur_video){
        return
      }
      enable_video(vids, 0);
  }

  function updateVideoStats(deviations) {
    var strr = ''
    for( var ii = 0; ii < vids.length; ii++ ){ 
       //strr +=  vids[ii].readyState + ' '
       //strr +=  all_data_loaded_for_vid.get(vids[ii]) + ' '
       strr += ii + ': ' +  vids[ii].currentTime + ', deviation: ' + deviations[ii]*25 + ', paused: ' + vids[ii].paused +  '<br>' 
       if (ii === 0) {
         strr += '<br>'
       }
    }
    document.getElementById("print").innerHTML = strr ;
  }

  function vidDeviationControl() {
    //return

    var dev_thresh = 0.2;
    //var dev_thresh = 0.04;

    var deviations = [];
    var dev_detected = false;
    //var ref_vid = vids[0]
    var ref_vid = cur_video

    for( var ii = 0; ii < vids.length; ii++ ){ 
       deviations[ii] = Math.abs(ref_vid.currentTime - vids[ii].currentTime);
       if (deviations[ii] > dev_thresh) {
         dev_detected = true;
       }
    }

    if (debug) {
      updateVideoStats(deviations)
    }

    if (dev_detected) {

      console.log('Deviation detected!')

      //$('#current_G_Deviation').css("background-color", "red");

      cancelAnimationFrame(vidDeviationControl);

      ref_time = ref_vid.currentTime

      for( var ii = 0; ii < vids.length; ii++ ){ 
        //vids[ii].pause();
        vids[ii].currentTime = ref_time;
      }

      for( var ii = 0; ii < vids.length; ii++ ){ 
        vids[ii].play();
      }


    } 

    if (ref_vid.paused || ref_vid.ended) {
      cancelAnimationFrame(vidDeviationControl);
      //$(button).html('Start');
      return;
    } else {
      requestAnimationFrame(vidDeviationControl);
    }
  }


}

function get_download_progress() {

     for( var ii = 0; ii < vids.length; ii++ ){ 

      var video = vids[ii];
      //var video = vids[0];

        //vids[0].addEventListener('progress', function(event) {
           //var loadedPercentage = event.target.buffered.end(0) / this.duration;
           //all_data_loaded_for_vid[event.target] = loadedPercentage ;
        //});

      video.addEventListener('progress', function(event) {
                var range = 0;
                var bf = this.buffered;
                if (bf.length <= 0) {
                  return;
                }
                var time = this.currentTime;

                while(!(bf.start(range) <= time && time <= bf.end(range))) {
                          range += 1;
                              }
                var loadStartPercentage = bf.start(range) / this.duration;
                var loadEndPercentage = bf.end(range) / this.duration;
                var loadPercentage = loadEndPercentage - loadStartPercentage;
                all_data_loaded_for_vid.set(event.target, loadPercentage) ;


          });
     }
}






