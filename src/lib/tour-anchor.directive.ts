import { Directive, ElementRef, Host, HostBinding, Input } from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';
import { NgbPopover, Placement } from '@ng-bootstrap/ng-bootstrap';
import { TourAnchorDirective } from '@ngx-tour/core';

import withinviewport from 'withinviewport';

import { NgbTourService } from './ng-bootstrap-tour.service';
import { INgbStepOption } from './step-option.interface';
import { TourStepTemplateService } from './tour-step-template.service';
import { TourBackdropService } from './tour-backdrop.service';

@Directive({ selector: '[tourAnchor]' })
export class TourAnchorNgBootstrapPopoverDirective extends NgbPopover {}

@Directive({
  selector: '[tourAnchor]',
})
export class TourAnchorNgBootstrapDirective
  implements OnInit, OnDestroy, TourAnchorDirective {
  @Input() public tourAnchor: string;

  @HostBinding('class.touranchor--is-active')
  public isActive: boolean;

  constructor(
    private tourService: NgbTourService,
    private tourStepTemplate: TourStepTemplateService,
    private element: ElementRef,
    @Host() private popoverDirective: TourAnchorNgBootstrapPopoverDirective,
    private tourBackdrop: TourBackdropService
  ) {
    this.popoverDirective.autoClose = false;
    this.popoverDirective.animation = false;
    this.popoverDirective.triggers = '';
    this.popoverDirective.toggle = () => {};
  }

  public ngOnInit(): void {
    this.tourService.register(this.tourAnchor, this);
  }

  public ngOnDestroy(): void {
    this.tourService.unregister(this.tourAnchor);
  }

  public showTourStep(step: INgbStepOption): void {
    this.isActive = true;
    this.popoverDirective.ngbPopover = this.tourStepTemplate.template;
    this.popoverDirective.popoverTitle = this.tourStepTemplate.titleTemplate;
    this.popoverDirective.container = 'body';
    if (step.containerClass) {
      this.popoverDirective.popoverClass += ` ${step.containerClass}`;
    }
    this.popoverDirective.placement = (step.placement || 'auto')
      .replace('before', 'left')
      .replace('after', 'right')
      .replace('below', 'bottom')
      .replace('above', 'top') as Placement;

    step.prevBtnTitle = step.prevBtnTitle || 'Prev';
    step.nextBtnTitle = step.nextBtnTitle || 'Next';
    step.endBtnTitle = step.endBtnTitle || 'End';

    this.popoverDirective.open({ step });
    if (!step.preventScrolling) {
      if (!withinviewport(this.element.nativeElement, { sides: 'bottom' })) {
        (this.element.nativeElement as HTMLElement).scrollIntoView(false);
      } else if (
        !withinviewport(this.element.nativeElement, { sides: 'left top right' })
      ) {
        (this.element.nativeElement as HTMLElement).scrollIntoView(true);
      }
    }

    if (step.enableBackdrop) {
      this.tourBackdrop.show(this.element, step.backdropZIndex);
    } else {
      this.tourBackdrop.close();
    }
  }

  public hideTourStep(): void {
    this.isActive = false;
    this.popoverDirective.close();
    this.tourBackdrop.close();
  }
}
