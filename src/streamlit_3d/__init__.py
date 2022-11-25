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
    model:Optional[str] = 'engine/scene.gltf'
):
    """
    Add a descriptive docstring
    """
    component_value = _component_func(
        key=key,model=model
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
    md=st.selectbox("3D Model:",["helmet/scene.gltf","engine/scene.gltf","turbine/scene.gltf","projector/scene.gltf","car/scene.gltf","captain/scene.gltf","moto/scene.gltf"])
    value = streamlit_3d(model=md)
    if value is not None:
        coords.append(value)
    st.table(coords)


# if __name__ == "__main__":
#     main()
