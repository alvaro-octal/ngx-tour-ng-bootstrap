import { ElementRef, Injectable, RendererFactory2 } from '@angular/core';
import type { Renderer2 } from '@angular/core';

@Injectable()
export class TourBackdropService {
    private renderer: Renderer2;
    private backdropElement: HTMLElement;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    public show(targetElement: ElementRef): void {
        const boundingRect = targetElement.nativeElement.getBoundingClientRect();

        if (!this.backdropElement) {
            this.backdropElement = this.renderer.createElement('div');
            this.renderer.addClass(this.backdropElement, 'ngx-tour_backdrop');
            this.renderer.appendChild(document.body, this.backdropElement);
        }

        this.setStyles(boundingRect);
    }

    public close(): void {
        if (this.backdropElement) {
            this.renderer.removeChild(document.body, this.backdropElement);
            this.backdropElement = null;
        }
    }

    private setStyles(boundingRect: DOMRect): void {
        console.log({
            boundingRect: boundingRect
        });
        const styles = {
            position: 'fixed',
            width: `${boundingRect.width}px`,
            height: `${boundingRect.height}px`,
            top: `${boundingRect.top}px`,
            left: `${boundingRect.left}px`,
            'box-shadow': '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            'z-index': '100'
        };

        for (const name of Object.keys(styles)) {
            this.backdropElement.style.setProperty(name, styles[name]);
        }
    }
}
