const getText = () => reearth.widget.property && reearth.widget.property.title ? reearth.widget.property.title.text || "" : "";

const html = `
<style>
  html,body { 
    margin: 0;
    width: 156px;
    min-height: 35px;
  }
  #wrapper {
    height: 100%;
  }
  .tilename {
    height: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  p {
    line-height: 24px;
    font-size: 12px;
    margin: 0 16px;
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .slider {
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  </style>
  <div id="wrapper">
    <div id ="tile_contents" class="tile_contents">
      <div class="tile_content">
        <div class="tilename">
          <p>title</p> 
        </div>
        <div class="slider"
          <input id="opacity" type="range" min="0" max="1" step="0.1" oninput="change_slider()">
        </div>
      </div>
    </div>
  </div>

  <script>
  let reearth, tiles, property;
  window.addEventListener("message", e => {
    if (e.source !== parent) return;
    property = e.data.property;
    reearth = e.source.reearth;
    tiles = e.data.tiles;


    // 全てのtileを削除
    var tile_block = document.getElementById("tile_contents");
    tile_block.innerHTML = "";
    for (let i=0; i < tiles.length; i++){
      if (tiles[i].tile_type === undefined) {
        tiles[i].tile_type = "default";
      }
      if (tiles[i].tile_opacity==undefined){
        tiles[i].tile_opacity = 1;
      }
      create_slider(tiles[i]);
    }

    var rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
      input.addEventListener('change', change_slider);
      input.addEventListener('input', update_slider_UI);
    })  

    let ElementTitle = document.getElementsByClassName("title");
    let j=0;
    for (let k = 0; k < ElementTitle.length; k++){
      if (ElementTitle[k].innerHTML === "url" ){
        ElementTitle[k].innerHTML = property.name[j].tileName;
        j +=1;
      }
    }
    

    if (property.color && property.color.bgColor){
      document.getElementById("wrapper").style.backgroundColor = property.color.bgColor;
    }else{
      document.getElementById("wrapper").style.backgroundColor = "transparent";
    }
    if (property.color && property.color.textColor){
      document.getElementById("wrapper").style.color = property.color.textColor;
    }else{
      document.getElementById("wrapper").style.color = "#fff";
    }



  });


  function create_slider(tile) {
    var list = document.getElementById("tile_contents");


    var add_code = '<div id="tile_content_'+ tile.tile_type +'">' +
    '<div class="tilename">' +
    '<p class="title">' + tile.tile_type + '</p>' +
    '</div>' +
    '<div class="slider">' +
      '<input class="opacity" id="opacity_'+ tile.id + '" data-tile="'+ tile.tile_type + '" value="' + tile.tile_opacity + '" type="range" min="0.0" max="1" step="0.05">' +
    '</div>'
    '</div>';
    

    list.insertAdjacentHTML('afterbegin', add_code);
    // add Tile_id
    const inputElem = document.getElementById('opacity_' + tile.id)
    inputElem.dataset.tileId = tile.id;
    // add tile url
    if(tile.tile_url){
      inputElem.dataset.tileUrl = tile.tile_url;
    }
    update_slider_UI(inputElem);
  }

  function update_slider_UI(e){
    let target = e.target ?? e;
    const min = target.min;
    const max = target.max;
    const val = target.value;
    
    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
  }

  function change_slider(e) {
    var slider = document.getElementsByClassName('opacity');   

    let list_tile_property = [];
    for (let i=0; i < slider.length; i++){
      let tile_dic ={};
      tile_dic["id"] = slider[i].dataset.tileId;
      tile_dic["tile_opacity"] = slider[i].value;
      tile_dic["tile_type"] = slider[i].dataset.tile;
      // add tile url
      if(slider[i].dataset.tileUrl){
        tile_dic["tile_url"] = slider[i].dataset.tileUrl;
      }
      if(slider[i].dataset.tileMaxLevel){
        tile_dic["tile_maxLevel"] = slider[i].dataset.tileMaxLevel;
      }
      if(slider[i].dataset.tileMinLevel){
        tile_dic["tile_minLevel"] = slider[i].dataset.tileMinLevel;
      }
      list_tile_property.unshift(tile_dic);
    }
    reearth.visualizer.overrideProperty({
      tiles: list_tile_property
    });
  }
  </script>
  `

reearth.ui.show(html, { visible: true });


reearth.on("update", send);
send();


function send() {
  reearth.ui.postMessage({
    property: reearth.widget.property,
    tiles: reearth.visualizer.property.tiles
  });
}
