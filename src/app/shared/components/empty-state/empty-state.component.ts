import { ChangeDetectionStrategy, Component, Input, isDevMode, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * EmptyStateComponent — Shared component for empty states
 *
 * Provides a unified interface to display when there is no data
 * in carts, searches, offers, or any list.
 *
 * Orchestrated by specialized components such as:
 * - EmptyCartComponent: Empty cart state
 * - EmptyOffersComponent: Empty offers state
 * - EmptySearchResultsComponent: Empty search results state
 */
export class EmptyStateComponent implements OnInit {
  /** Main title of the empty state */
  @Input({ required: true }) title!: string;
  /** Detailed description or informational message */
  @Input() description?: string;
  /** Icon string (simple text fallback) */
  @Input() icon?: string;
  /** Text for the action button */
  @Input() actionLabel?: string;
  /** RouterLink URL for the action button */
  @Input() actionHref?: string;
  /** Callback executed on action button click */
  @Input() onAction?: () => void;
  /** Additional CSS classes for customization */
  @Input() className?: string;
  /** Visual variant of the empty state */
  @Input() appearance: 'default' | 'flat' = 'default';

  ngOnInit(): void {
    if (isDevMode() && this.actionHref && this.onAction) {
      console.warn(
        '[EmptyState] Both actionHref and onAction are set. ' +
        'actionHref will take priority. This may indicate a misuse of the API.'
      );
    }
  }

  get hasAction(): boolean {
    return !!this.actionHref || !!this.onAction;
  }

  get isLink(): boolean {
    return !!this.actionHref;
  }

  handleAction(): void {
    this.onAction?.();
  }
}
