import { TourHotkeyListenerComponent, IStepOption } from '@ngx-tour/core';
import { TourStepTemplateService } from './tour-step-template.service';
import {
  Component,
  TemplateRef,
  ViewChild,
  AfterContentInit,
  ViewEncapsulation,
  Input,
  ContentChild,
} from '@angular/core';
import { NgbTourService } from './ng-bootstrap-tour.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tour-step-template',
  styles: ['.close { margin-top: -4px; }'],
  template: `
    <ng-template #tourStepTitle let-step="step">
      {{ step?.title }}
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="tourService.end()"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </ng-template>
    <ng-template #tourStep let-step="step">
      <p class="tour-step-content">{{ step?.content }}</p>
      <div class="tour-step-navigation">
        <button
          *ngIf="tourService.hasPrev(step)"
          class="btn btn-sm btn-primary"
          (click)="tourService.prev()"
        >
          {{ step?.prevBtnTitle }}</button
        >&nbsp;
        <button
          *ngIf="tourService.hasNext(step)"
          class="btn btn-sm btn-primary"
          (click)="tourService.next()"
        >
          {{ step?.nextBtnTitle }}</button
        >&nbsp;
      </div>
    </ng-template>
  `,
})
export class TourStepTemplateComponent
  extends TourHotkeyListenerComponent
  implements AfterContentInit {
  @ViewChild('tourStep', { read: TemplateRef, static: true })
  public defaultTourStepTemplate: TemplateRef<any>;

  @Input()
  public stepTemplate: TemplateRef<{ step: IStepOption }>;

  @ViewChild('tourStepTitle', { read: TemplateRef, static: true })
  public defaultTourStepTitleTemplate: TemplateRef<any>;

  @Input()
  public stepTitleTemplate: TemplateRef<{ step: IStepOption }>;

  constructor(
    private tourStepTemplateService: TourStepTemplateService,
    public tourService: NgbTourService
  ) {
    super(tourService);
  }

  public ngAfterContentInit(): void {
    this.tourStepTemplateService.template =
      this.stepTemplate || this.defaultTourStepTemplate;
    this.tourStepTemplateService.titleTemplate =
      this.stepTitleTemplate || this.defaultTourStepTitleTemplate;
  }
}
