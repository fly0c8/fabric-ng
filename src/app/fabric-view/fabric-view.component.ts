import { Component, OnInit, AfterViewInit } from '@angular/core';
import mapJson from '../../assets/map.json';

declare const fabric;

@Component({
  selector: 'app-fabric-view',
  templateUrl: './fabric-view.component.html',
  styleUrls: ['./fabric-view.component.css']
})
export class FabricViewComponent implements OnInit, AfterViewInit {

  canvas: any;
  isDragging: boolean;

  lastPosX: number;
  lastPosY: number;
  zoom: number;  
  i = 0;
  clipboard: any;


  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {

    this.canvas = new fabric.Canvas('canvas');
    this.canvas.loadFromJSON(mapJson);

    // zooming
    this.canvas.on('mouse:wheel', opt => {
      const delta = opt.e.deltaY;
      let zoom = this.canvas.getZoom() + delta / 200;
      if (zoom > 20) {
        zoom = 20;
      } else if (zoom < 0.01) {
        zoom = 0.01;
      }
      this.canvas.setZoom(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // panning
    this.canvas.on('mouse:down', opt => {
      const evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.canvas.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });

    this.canvas.on('mouse:move', opt => {
      if (this.isDragging) {
        const e = opt.e;
        this.canvas.viewportTransform[4] += e.clientX - this.lastPosX;
        this.canvas.viewportTransform[5] += e.clientY - this.lastPosY;
        this.canvas.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    this.canvas.on('mouse:up', opt => {
      this.isDragging = false;
      this.canvas.selection = true;
      this.canvas.getObjects().forEach(o => {
        o.setCoords();
      });
    });
    console.log(this.canvas.getZoom());

  }
  add_rect() {
    const rect = new fabric.Rect({
      top: 0,
      left: 0,
      width: 60,
      height: 70,
      fill: 'rgba(255,0,0,0.3)',
      selectable: true,
    });
    this.canvas.add(rect);
  }
  get nextEntry() {
    return ++this.i;
  }
  add_entry() {
    fabric.Image.fromURL('/assets/barrier.png', img => {
      this.canvas.add(img);
      img.set('id', `Entry: ${this.nextEntry}`);
      img.scale(0.3);
      img.on('selected', _ => {
        console.log(this.canvas.getActiveObject().id);
      });
    });
  }
  add_text() {
    const text = new fabric.IText('Entry 1', { left: 100, top: 100 });
    this.canvas.add(text);
  }
  add_apm() {
    fabric.Image.fromURL('/assets/apm.jpg', img => {
      this.canvas.add(img);
      img.on('selected', _ => {
        console.log(this.canvas.getActiveObject().id);
      })
    });
  }
  add_background() {
    //const imgUrl = 'https://publicsafety.tufts.edu/parking/files/Parking-Map-2018-734x567.jpg';
    const imgUrl = '/assets/airportmap.png';
    fabric.Image.fromURL(imgUrl, img => {
      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
        originX: 'left',
        originY: 'top',
        scaleX: this.canvas.getWidth() / img.width,
        scaleY: this.canvas.getHeight() / img.height
      });
    });
  }
  delete_object() {
    const obj = this.canvas.getActiveObject();
    if (obj) {
      this.canvas.remove(obj);
    }
  }
  delete_background() {
    console.log('de')
    this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
  }
  get_object_names() {
    this.canvas.getObjects().forEach(o => {
      console.log(o.id);
    });
  }
  set_object_image() {
    const entry1 = this.canvas.getObjects().find(x => x.id === "Entry: 1");
    console.log(entry1);
    entry1.setSrc('/assets/barrier1.png', this.canvas.renderAll.bind(this.canvas));
  }
  serialize() {
    console.log('serializing');
    console.log(JSON.stringify(this.canvas));
  }
  to_default_view() {
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);;
  }
  copy() {
    this.canvas.getActiveObject().clone(clone => {
      this.clipboard = clone;
    });
  }
  paste() {
    this.clipboard.clone(clone => {
      this.canvas.discardActiveObject();
      clone.set({
        left: clone.left + 10,
        top: clone.top + 10,
        evented: true
      });
      if (clone.type === 'activeSelection') {
        clone.canvas = this.canvas;
        clone.forEachObject(obj => {
          this.canvas.add(obj);
        });
        clone.setCoords();
      } else {
        this.canvas.add(clone);
      }
      this.clipboard.top += 10;
      this.clipboard.left += 10;
      this.canvas.setActiveObject(clone);
      this.canvas.requestRenderAll();
    });

    
  } 
  // transformmatrix examples
    // http://www.senocular.com/flash/tutorials/transformmatrix/
    // | a  b  u |
    // | c  d  v |
    // | tx ty w |
    // a..x-scale, b..y-skew, c..x-skew d..y scale
    // transformMatrix = [a,b,c,d,tx,ty] = [x-scale,y-skew,x-skew,y-scale,tx,ty]
    transform() {
      const obj = this.canvas.getActiveObject();
      if (!obj) {
        return;
      }
      obj.transformMatrix = [1, 0, -1.0, 1, 0, 0];
      this.canvas.requestRenderAll();


    } 
}
