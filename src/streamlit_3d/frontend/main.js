function detectDoubleTapClosure() {
  let lastTap = 0;
  let timeout;
  return function detectDoubleTap(event) {
    const curTime = new Date().getTime();
    const tapLen = curTime - lastTap;
    if (tapLen < 500 && tapLen > 0) {
      addAnnotation(event)
      event.preventDefault();
    } else {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
      }, 500);
    }
    lastTap = curTime;
  };
}


function selectText(nodeId) {
  const node = document.getElementById(nodeId);
  node.focus();
  if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(node);
      range.select();
      node.focus();
  } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
  } else {
      console.warn("Could not select text in node: Unsupported browser.");
  }
}
function mobileCheck () {
  let check = false;
  check=(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) 
  return check;
}
function sendValue(value) {
  Streamlit.setComponentValue(value)
}
function addAnnotation(event){
  const modelViewer = document.querySelector("#mod");
  var x=event.clientX;
  var y=event.clientY;
  if(event.changedTouches){
    x=event.changedTouches[0].clientX;
    y=event.changedTouches[0].clientY;
  }
  let hit = modelViewer.positionAndNormalFromPoint(x, y);
  var node=`
    <button onclick="sendValue('${hit.position.x}')" slot="hotspot-hand${hit.position.x}" data-position="${hit.position.x} ${hit.position.y} ${hit.position.z}" data-normal="${hit.normal.x} ${hit.normal.y} ${hit.normal.z}">
      <div onfocus="selectText('ano${hit.position.x}')" id="ano${hit.position.x}" class="up annotation" contenteditable="true">Edit text</div>
    </button>`
  modelViewer.insertAdjacentHTML( 'beforeend', node );
  selectText(`ano${hit.position.x}`)
  sendValue(`${hit.position.x} ${hit.position.y} ${hit.position.z} ${hit.normal.x} ${hit.normal.y} ${hit.normal.z}`)
}
function onRender(event) {
  const {model,key,} = event.detail.args;
  if (!window.rendered) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      document.getElementById("vv").addEventListener('touchend', detectDoubleTapClosure());
    }
    const modelViewer = document.querySelector("#mod");
    modelViewer.addEventListener('dblclick', (event) => {
      addAnnotation(event)
    }, true);
    document.getElementById("mod").setAttribute("src",model);
    window.rendered = true
  }
  
}

// Render the component whenever python send a "render event"
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
// Tell Streamlit that the component is ready to receive events
Streamlit.setComponentReady()
// Render with the correct height, if this is a fixed-height component
if(mobileCheck())
  Streamlit.setFrameHeight(400)
else{
  Streamlit.setFrameHeight(1000)
}  
