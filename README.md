<a href="https://aalteirac-streamlit-3d-app-main-su4uf9.streamlit.app/" title="3d-badge"><img src="https://static.streamlit.io/badges/streamlit_badge_black_white.svg"></a><br>

# streamlit_3d

<strong>A Streamlit component that lets you view, interact with, and annotate 3d models</strong>

## Installation instructions

```sh
pip install streamlit-3d
```

## Usage instructions

```python
    import streamlit as st
    import streamlit_3d as sd

    md=st.selectbox("3D Model:",["https://alteirac.com/models/helmet/scene.gltf",
                                 "https://alteirac.com/models/engine/scene.gltf"
                                 ])
    # if you want to load existing Annotations:
    value = sd.streamlit_3d(height=600,model=md,points=[{"description":"LEFT_LIGHT",
                                            "data-position":{"x":0.4595949207254826,"y":0.40998085773554555,"z":0.33846317660071373},
                                            "data-normal":{"x":-0.18705895743345607,"y":-0.3420641705224677,"z":0.9208697246020658}}
                                            ])
    # if you simply want to show the model:
    value = sd.streamlit_3d(model=md,height=700)
    st.write(value)
```