var lastEv;
function detectDoubleTapClosure() {
  let lastTap = 0;
  let timeout;
  return function detectDoubleTap(event) {
    const curTime = new Date().getTime();
    const tapLen = curTime - lastTap;
    if (tapLen < 500 && tapLen > 0) {
      lastEv=event;
      showPopup();
      event.preventDefault();
    } else {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
      }, 500);
    }
    lastTap = curTime;
  };
}
function showPopup(){
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}
function mobileCheck () {
  let check = false;
  check=(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) 
  return check;
}
function sendValue(value) {
  var dp=value.getAttribute("data-position");
  Streamlit.setComponentValue(dp)
}
function annotate(){
  var nm = document.getElementById("nm");
  addAnnotation(lastEv,nm.value)
  showPopup();
}
function addAnnotation(event,name){
  const modelViewer = document.querySelector("#mod");
  var x=event.clientX;
  var y=event.clientY;
  if(event.changedTouches){
    x=event.changedTouches[0].clientX;
    y=event.changedTouches[0].clientY;
  }
  let hit = modelViewer.positionAndNormalFromPoint(x, y);
  var node=`
    <button class="bta" onclick="sendValue(this)" slot="hotspot-hand${hit.position.x}" data-position="${hit.position.x} ${hit.position.y} ${hit.position.z}" data-normal="${hit.normal.x} ${hit.normal.y} ${hit.normal.z}">
      <div id="ano${hit.position.x}" class="up annotation">${name}</div>
    </button>`
  modelViewer.insertAdjacentHTML( 'beforeend', node );
  // sendValue(`${hit.position.x} ${hit.position.y} ${hit.position.z} ${hit.normal.x} ${hit.normal.y} ${hit.normal.z}`)
}
function onRender(event) {
  const {model,key,} = event.detail.args;
  if (!window.rendered) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      document.getElementById("vv").addEventListener('touchend', detectDoubleTapClosure());
    }
    const modelViewer = document.querySelector("#mod");
    modelViewer.addEventListener('dblclick', (event) => {
      lastEv=event;
      showPopup();
    }, true);
    document.getElementById("mod").setAttribute("src",model);
    window.rendered = true
  }
  
}


Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

Streamlit.setComponentReady()

if(mobileCheck())
  Streamlit.setFrameHeight(400)
else{
  Streamlit.setFrameHeight(1000)
}  

//TODO
// SEND ALL VALUES (pos and text)
// SEND ACTION (Delete,Create,Click)
// LOAD POINTS AT LOADING