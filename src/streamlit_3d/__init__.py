from pathlib import Path
from typing import Optional

import streamlit as st
import streamlit.components.v1 as components

# Tell streamlit that there is a component called streamlit_3d,
# and that the code to display that component is in the "frontend" folder
frontend_dir = (Path(__file__).parent / "frontend").absolute()
_component_func = components.declare_component(
	"streamlit_3d", path=str(frontend_dir)
)

# Create the python function that will be called
def streamlit_3d(
    key: Optional[str] = None,
    model:Optional[str] = 'engine/scene.gltf',
    points:Optional[list]=[],
    height:Optional[int] = 700,
):
    """
    Add a descriptive docstring
    """
    component_value = _component_func(
        key=key,model=model,points=points,height=height
    )

    return component_value


def main():
    if(st.session_state.get("coord") is not None):
        coords=st.session_state["coord"] 
    else:
        coords=[]
        st.session_state["coord"] = coords
    st.markdown('''
        <style>
        .main .block-container{
            max-width: unset;
            padding-left: 5em;
            padding-right: 5em;
            padding-top: 1.5em;
            padding-bottom: 1em;
            }
        </style>
''', unsafe_allow_html=True)
    st.write("## 3D Annotations | Right-Click to Annotate")
    md=st.selectbox("3D Model:",["https://alteirac.com/models/helmet/scene.gltf","https://alteirac.com/models/engine/scene.gltf","https://alteirac.com/models/turbine/scene.gltf","https://alteirac.com/models/projector/scene.gltf","https://alteirac.com/models/car/scene.gltf","https://alteirac.com/models/captain/scene.gltf","https://alteirac.com/models/moto/scene.gltf"])
    value = streamlit_3d(model=md,points=[{"description":"LEFT_LIGHT","data-position":{"x":0.4595949207254826,"y":0.40998085773554555,"z":0.33846317660071373},"data-normal":{"x":-0.18705895743345607,"y":-0.3420641705224677,"z":0.9208697246020658}
}])
    if value is not None:
        coords.append(value)
    st.table(coords)


# if __name__ == "__main__":
#     main()
