var lastEv,lastNode,curMod;
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
function showPopupUpdate(){
  var popup = document.getElementById("myPopupUpdate");
  popup.classList.toggle("show");
  document.getElementById("nmupdate").focus();
}
function showPopup(){
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
  document.getElementById("nm").value="";
  document.getElementById("nm").focus();
}
function mobileCheck () {
  let check = false;
  check=(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) 
  return check;
}
function sendValue(value,action) {
  var dp=value.getAttribute("data-position");
  dp=dp.split(' ')
  var dn=value.getAttribute("data-normal");
  dn=dn.split(' ')
  var desc=value.getAttribute("textNode");
  Streamlit.setComponentValue({model:curMod,action:action,description:desc,"data-position":{x:parseFloat(dp[0]),y:parseFloat(dp[1]),z:parseFloat(dp[2])},"data-normal":{x:parseFloat(dn[0]),y:parseFloat(dn[1]),z:parseFloat(dn[2])}})
}
function annotate(){
  var nm = document.getElementById("nm");
  addAnnotation(lastEv,nm.value)
  showPopup();
}
function updateNode(){
  var dp=lastNode.parentNode.getAttribute("data-position");
  var newval=document.getElementById("nmupdate").value;
  document.querySelector(`[mid="${dp}"]`).textContent=newval;
  document.querySelector(`[mid="${dp} text"]`).setAttribute("textNode",newval);
  lastNode.parentNode.setAttribute("textNode",newval);
  sendValue(lastNode.parentNode,"UDPATE")
  showPopupUpdate();
}
function deleteNode(){
  const modelViewer = document.querySelector("#mod");
  modelViewer.removeChild(lastNode.parentNode)
  sendValue(lastNode.parentNode,"DELETE");
  showPopupUpdate();
}
function edit(event,node){
  lastNode=node;
  event.stopPropagation();
  var desc=node.getAttribute("textNode");
  var popup = document.getElementById("myPopupUpdate");
  popup.classList.toggle("show");
  document.getElementById("nmupdate").value=desc;
}
function createNodeModel(name,dx,dy,dz,nx,ny,nz){
  const modelViewer = document.querySelector("#mod");
  var node=`
    <button class="bta" onclick="sendValue(this,'CLICK')" slot="hotspot-hand${dx}" textNode="${name}" data-position="${dx} ${dy} ${dz}" data-normal="${nx} ${ny} ${nz}">
    <div mid="${dx} ${dy} ${dz} text" onclick="edit(event,this)" textNode="${name}" class="closeb">⚙️</div>  
    <div mid="${dx} ${dy} ${dz}" class="up annotation">${name}</div>
    </button>`
  modelViewer.insertAdjacentHTML( 'beforeend', node );
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
  createNodeModel(name,hit.position.x,hit.position.y,hit.position.z,hit.normal.x,hit.normal.y,hit.normal.z)
  Streamlit.setComponentValue({model:curMod,action:'CREATE',description:name,"data-position":{x:hit.position.x,y:hit.position.y,z:hit.position.z},"data-normal":{x:hit.normal.x,y:hit.normal.y,z:hit.normal.z}})
}
function onRender(event) {
  const {model,key,points,height} = event.detail.args;
  curMod=model;
  if (!window.rendered) {
    if(mobileCheck())
      Streamlit.setFrameHeight(400)
    else{
      Streamlit.setFrameHeight(height)
    }  
    points.map((el)=>{
      createNodeModel(el.description,el['data-position'].x,el['data-position'].y,el['data-position'].z,el['data-normal'].x,el['data-normal'].y,el['data-normal'].z)
    })
    // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    //   document.getElementById("vv").addEventListener('touchend', detectDoubleTapClosure());
    // }
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



//TODO
// OK SEND ALL VALUES (pos and text)
// OK SEND ACTION (Delete,Create,Click)
// LOAD POINTS AT LOADING