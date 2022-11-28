function selectText(nodeId) {
  const node = document.getElementById(nodeId);
  node.focus();
  node.click()
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

function sendValue(value) {
  Streamlit.setComponentValue(value)
}

function onRender(event) {
  const {model,key,} = event.detail.args;
  if (!window.rendered) {
    const modelViewer = document.querySelector("#mod");
    modelViewer.addEventListener('dblclick', (event) => {
      let hit = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY);
      var node=`
        <button onclick="sendValue('${hit.position.x}')" slot="hotspot-hand${hit.position.x}" data-position="${hit.position.x} ${hit.position.y} ${hit.position.z}" data-normal="${hit.normal.x} ${hit.normal.y} ${hit.normal.z}">
          <div onfocus="selectText('ano${hit.position.x}')" id="ano${hit.position.x}" class="up annotation" contenteditable="true">Edit text</div>
        </button>`
      modelViewer.insertAdjacentHTML( 'beforeend', node );
      selectText(`ano${hit.position.x}`)
      sendValue(`${hit.position.x} ${hit.position.y} ${hit.position.z} ${hit.normal.x} ${hit.normal.y} ${hit.normal.z}`)
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
Streamlit.setFrameHeight(1000)
