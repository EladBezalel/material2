import{
  AnimationEntryMetadata,
  trigger,
  style,
  animate,
  transition
} from '@angular/core';

/**
 * Below are all the animations for the md-expansion-panel component.
 * Animation duration and timing values are based on the Material design spec.
 */


/**
 *
 */
export const togglePanel: AnimationEntryMetadata =  trigger('transformExpansionsPanel', [
  transition(':enter', [
      style({height: 0, opacity: 0}),
      animate('300ms cubic-bezier(0.35, 0, 0.25, 1);', style({height: '*', opacity: 1}))
    ]
  ),
  transition(':leave', [
      style({opacity: 1}),
      animate('300ms cubic-bezier(0.35, 0, 0.25, 1);', style({height: 0, opacity: 0}))
    ]
  )]
);
