import { Component, OnInit, AfterViewInit } from '@angular/core';

declare const fabric;

@Component({
  selector: 'app-fabric-view',
  templateUrl: './fabric-view.component.html',
  styleUrls: ['./fabric-view.component.css']
})
export class FabricViewComponent implements OnInit, AfterViewInit {

  canvas: any;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {

    this.canvas = new fabric.Canvas('canvas');
    let rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      fill: 'blue',
      selectable: true
    });
    this.canvas.add(rect);
    
  }
  add_rect() {
    let rect = new fabric.Rect({
      top: 0,
      left: 0,
      width: 60,
      height: 70,
      fill: 'green',
      selectable: true
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
    const text = new fabric.Text("Entry 1", { left :100, top: 100});
    this.canvas.add(text);
  }
  add_background() {
    fabric.Image.fromURL('/assets/test.svg', img => {
      console.log('img loaded');
      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas),{
        originX: 'left',
        originY: 'top'
      });
      this.canvas.backgroundImage.width = this.canvas.getWidth();
      this.canvas.backgroundImage.height = this.canvas.getHeight();
        // this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
        //   scaleX: this.canvas.width/img.width,
        //   scaleY: this.canvas.heigt/img.height
        // });      
    });
    

  }
  remove_rect() {}

}
