import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-offer-card-skeleton',
  standalone: true,
  template: `
    <article
      class="producto product-card offer-card snap-start bg-white p-3 md:p-5 rounded-xl w-40 md:w-55 min-h-[300px] md:min-h-[350px] flex flex-col justify-start transition-all duration-400 relative overflow-hidden"
    >
      <div
        class="absolute top-2.5 left-3 md:top-3 md:left-3.5 z-10 bg-linear-to-r from-orange-500 to-yellow-400 text-white px-2 py-1 md:px-2.5 md:py-1 rounded-full flex items-center gap-1 animate-pulse"
      >
        <div class="w-4 h-4 md:w-5 md:h-5 bg-yellow-300 rounded-full"></div>
        <span class="text-xs md:text-sm font-bold">OFERTA</span>
      </div>

      <div class="w-full h-[120px] md:h-[150px] bg-gray-300 rounded-lg mb-3 flex items-center justify-center animate-pulse"></div>

      <div class="flex flex-col w-full mb-2 animate-pulse">
        <div class="flex items-baseline gap-2 mb-1">
          <div class="h-5 md:h-6 w-20 md:w-28 bg-red-400 rounded"></div>
          <div class="h-3 md:h-4 w-16 md:w-20 bg-gray-300 rounded"></div>
        </div>
        <div class="h-3 w-24 bg-gray-200 rounded"></div>
      </div>

      <div class="space-y-1.5 mb-3 animate-pulse">
        <div class="h-3 bg-gray-200 rounded w-full"></div>
        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
        <div class="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>

      <div class="h-8 bg-gray-300 rounded-lg mt-auto animate-pulse"></div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferCardSkeletonComponent {}
