let currSong = new Audio();
let songs;
let currfolder;

function formatTime(seconds) {
 // Ensure the input is an integer
 seconds = Math.floor(seconds);

 // Calculate minutes and remaining seconds
 const minutes = Math.floor(seconds / 60);
 const remainingSeconds = seconds % 60;

 // Pad single digit minutes and seconds with a leading zero
 const paddedMinutes = String(minutes).padStart(2, '0');
 const paddedSeconds = String(remainingSeconds).padStart(2, '0');

 // Return formatted time
 return `${paddedMinutes}:${paddedSeconds}`
}



async function getSongs(folder){
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    
    songs = []
    for(let index=0; index<as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
           songs.push(element.href.split(`/${folder}/`)[1]) 
        }
    }

    //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                <img class="invert" src="images/music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Srajan</div>
                </div>

                <div class="playnow">
                  <span>Play Now</span>
                  <img class="playno" src="images/playnow.svg" alt="">
                </div>
                 </li>`;
    }

    //attach an event Listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
       e.addEventListener("click", element => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        
       })
    })

   


  return songs;
    
 
}

const playMusic = (track , pause= false) => {
    //   let audio = new Audio("/song/" + track);
    currSong.src = `/${currfolder}/` + track
    if(!pause){
         currSong.play();
         play.src = "images/pause.svg"
    }
   
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


    

}

 async function displayAlbums(){

  let a = await fetch(`http://127.0.0.1:5500/song/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    // console.log(anchors);
    
    let cardContainer = document.querySelector(".cardContainer");
    
    let array = Array.from(anchors)
      console.log(array)

    for(let i = 0; i<array.length; i++){
      const e = array[i];

      // console.log(e)

      // console.log(e.href.includes("/song/"))

    
      if(e.href.includes("/song/")){
        let folder = e.href.split("/").slice(-1)[0];
      console.log(folder)


        let a = await fetch(`http://127.0.0.1:5500/song/${folder}/info.json`)
        let response = await a.json();
            //  console.log(response)

             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}"  class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  width="20"
                  height="20"
                  viewBox="0 0 220 280"
                  xml:space="preserve"
                >
                  <defs></defs>
                  <g
                    style="
                      stroke: none;
                      stroke-width: 0;
                      stroke-dasharray: none;
                      stroke-linecap: butt;
                      stroke-linejoin: miter;
                      stroke-miterlimit: 10;
                      fill: none;
                      fill-rule: nonzero;
                      opacity: 1;
                    "
                    transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                  >
                    <path
                      d="M 81.73 50.284 c 4.068 -2.349 4.068 -8.22 0 -10.569 L 48.051 20.271 L 14.372 0.827 c -4.068 -2.349 -9.153 0.587 -9.153 5.284 V 45 v 38.889 c 0 4.697 5.085 7.633 9.153 5.284 l 33.679 -19.444 L 81.73 50.284 z"
                      style="
                        stroke: none;
                        stroke-width: 1;
                        stroke-dasharray: none;
                        stroke-linecap: butt;
                        stroke-linejoin: miter;
                        stroke-miterlimit: 10;
                        fill: rgb(0, 0, 0);
                        fill-rule: nonzero;
                        opacity: 1;
                      "
                      transform=" matrix(1 0 0 1 0 0) "
                      stroke-linecap="round"
                    />
                  </g>
                </svg>
              </div>

              <img
                src="/song/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
      }
    }

      //load the playlist whenever  card is clicked

      Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" ,async item=>{
            songs = await getSongs(`song/${ item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
         })
      }) 
   

}

async function main(){

    //get all the songs in the playlist
    await getSongs("song/ncs");
    playMusic(songs[0], true);

    //display all the albums on the page
   await displayAlbums()
    
    //attach an event listener to play next and previos
    play.addEventListener("click" , ()=>{
        if(currSong.paused){
            currSong.play();
            play.src = "images/pause.svg"
        }else{
            currSong.pause();
            play.src = "images/play.svg"
        }
    })

    //listen for time udate event

    currSong.addEventListener("timeupdate", ()=>{
        console.log(currSong.currentTime,currSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currSong.currentTime)} / ${formatTime(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime/ currSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click" , e => {
        let percent =  (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currSong.currentTime = ((currSong.duration)*percent) / 100;
    })

    //add at event listener for hamburber
    document.querySelector(".hamburger").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "0"
    })

    //add at event listener for close button
    document.querySelector(".close").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "-120%"
    })

    //add event listener to previous
    previous.addEventListener("click", ()=> {
        currSong.pause();

      let index = songs.indexOf(currSong.src.split("/").slice(-1) [0])
      if((index-1) >= 0){
        playMusic(songs[index-1]);
      }
    })

    //add event listener to next
    next.addEventListener("click", ()=> {
        currSong.pause();
        let index = songs.indexOf(currSong.src.split("/").slice(-1) [0])
        if((index+1) < songs.length){
          playMusic(songs[index+1]);
        }
    })

    //add an event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("Setting volume to", e.target.value, "/ 100")
        currSong.volume  = parseInt(e.target.value)/100;

        if(currSong.volume > 0){
          document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    //add event listener to mute
    document.querySelector(".volume>img").addEventListener("click" , e=> {
      if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0
      }else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currSong.volume = .10
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10

      }
    }) 

    
}

main();