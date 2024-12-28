export { CanvasScene }

abstract class CanvasScene
{
  private             canvasscene:                      number; // stops duck typing

  protected abstract  canvases:                         HTMLCanvasElement[];
  protected abstract  canvas_contexts:                  CanvasRenderingContext2D[];
  protected abstract  DOM_Boxes:                        DOMRect[];

  protected abstract  on_resize(canvas_inds: number[]): void;
  
  public    abstract  paint():                          void;
  public    abstract  animate(t: number):               void;

  constructor(canvas_IDs?: string[])
  {
    if (canvas_IDs !== undefined)
    {
      this.set_canvases(canvas_IDs);
    }
  }

  protected set_canvases(canvas_IDs: string[]): void
  {
    this.canvases = [];
    this.canvas_contexts = [];
    this.DOM_Boxes = [];

    {
      let i: number;

      for (i = 0; i < canvas_IDs.length; ++i)
      {
        this.canvases.push(<HTMLCanvasElement>document.getElementById(canvas_IDs[i]));

        if (this.canvases[i])
        {
          this.canvas_contexts.push(this.canvases[i].getContext("2d") as
            CanvasRenderingContext2D);

          if (this.canvas_contexts[i])
          {
            this.DOM_Boxes.push(this.canvases[i].getBoundingClientRect());
          }
          else
          {
            throw "failed to retrieve canvas";
          }
        }
      }
    }
  }

  protected detect_resizes(): void
  {
    // For each canvas:
    // Determine if its size has changed
    // store the new DOM box size in this.DOM_Boxes[]
    // pass the indices of resized elements to on_resize()

    let new_DOM_box: DOMRect;
    let resized_canvases = Array<number>();

    {
      let i: number;

      for (i = 0; i < this.canvases.length; ++i)
      {
        new_DOM_box = this.canvases[i].getBoundingClientRect();

        if (new_DOM_box.width !== this.DOM_Boxes[i].width ||
          new_DOM_box.height !== this.DOM_Boxes[i].height)
        {
          this.DOM_Boxes[i] = new_DOM_box;
          // update the canvas resolutions to match size
          this.canvases[i].width  = this.DOM_Boxes[i].width;
          this.canvases[i].height = this.DOM_Boxes[i].height;
          resized_canvases.push(i);
        }
      }
    }

    this.on_resize(resized_canvases);
  }
}
