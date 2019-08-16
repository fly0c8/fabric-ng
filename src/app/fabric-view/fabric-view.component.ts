import { Component, OnInit, AfterViewInit } from '@angular/core';
import { flushModuleScopingQueueAsMuchAsPossible } from '@angular/core/src/render3/jit/module';

declare const fabric;

@Component({
  selector: 'app-fabric-view',
  templateUrl: './fabric-view.component.html',
  styleUrls: ['./fabric-view.component.css']
})
export class FabricViewComponent implements OnInit, AfterViewInit {

  canvas: any;
  isDragging: boolean;
  selection: boolean;
  lastPosX: number;
  lastPosY: number;

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {

    this.canvas = new fabric.Canvas('canvas');
    this.canvas.on('mouse:down', opt => {
      const evt = opt.e;
      if (evt.altKey) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
    this.canvas.on('mouse:move', opt => {
      if(this.isDragging) {
        let e = opt.e;
        this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;

      }
    })

    
  }
  add_rect() {
    let rect = new fabric.Rect({
      top: 0,
      left: 0,
      width: 60,
      height: 70,
      fill: 'rgba(255,0,0,0.3)',
      selectable: true,
      
    });
    this.canvas.add(rect);
    
  }
  flip: boolean;
  i = 0;
  get nextEntry() {
    return ++this.i;
  }
  add_entry() {
    fabric.Image.fromURL('/assets/barrier.png', img => {
      this.canvas.add(img);
      this.flip = !this.flip;
      img.set('id', `Entry: ${this.nextEntry}`);
      img.set('flipX', this.flip);
      img.scale(0.3);
      img.on('selected', _ => {
        console.log(this.canvas.getActiveObject().id);
        
        
      })
    });
  }
  add_text() {
    const text = new fabric.IText("Entry 1", { left :100, top: 100});
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
    fabric.Image.fromURL('/assets/airportmap.png', img => {            
      // this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas),{
      //   originX: 'left',
      //   originY: 'top'
      // });
      // this.canvas.backgroundImage.width = this.canvas.getWidth();
      // this.canvas.backgroundImage.height = this.canvas.getHeight();
        this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
          scaleX: this.canvas.getWidth() / img.width,
          scaleY: this.canvas.getHeight() / img.height
        });      
    });
    

  }
  delete_object() {
    const obj = this.canvas.getActiveObject();
    if(obj) {
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
    })
  }
  set_object_image() {
    let entry1 = this.canvas.getObjects().find(x => x.id === "Entry: 1");
    console.log(entry1);
    entry1.setSrc('/assets/barrier1.png', this.canvas.renderAll.bind(this.canvas));
  }

  

}
